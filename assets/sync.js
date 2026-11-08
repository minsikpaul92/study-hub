/* Move your study records between browsers and devices without a server.
   Export: every "studyhub-*" record (except the running timer) is gzip-compressed into a
   link that ends in #sync=CODE. Opening that link (or pasting the link or the CODE into
   "가져오기") merges the records into this browser. Nothing leaves the page. */
(function () {
  const SKIP = ["studyhub-timer-v1"];
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // ---- encode / decode ----
  const b64 = (u8) => btoa(String.fromCharCode.apply(null, u8)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unb64 = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
  async function pipe(u8, Stream) {
    const s = new Blob([u8]).stream().pipeThrough(new Stream("gzip"));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }
  async function encode(obj) {
    const raw = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) { try { return "z" + b64(await pipe(raw, CompressionStream)); } catch (e) {} }
    return "p" + b64(raw);
  }
  async function decode(code) {
    code = code.trim();
    const m = code.match(/#sync=([A-Za-z0-9_-]+)/);
    if (m) code = m[1];
    if (!/^[zp][A-Za-z0-9_-]+$/.test(code)) throw new Error("bad code");
    const u8 = unb64(code.slice(1));
    const raw = code[0] === "z" ? await pipe(u8, DecompressionStream) : u8;
    const obj = JSON.parse(new TextDecoder().decode(raw));
    if (!obj || obj.v !== 1 || typeof obj.d !== "object") throw new Error("bad data");
    return obj;
  }

  // ---- collect ----
  function collect() {
    const d = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k.startsWith("studyhub-") || SKIP.includes(k)) continue;
      const v = get(k, null);
      if (v !== null) d[k] = v;
    }
    return { v: 1, at: Date.now(), d };
  }

  // ---- merge (never deletes what this device already has) ----
  const union = (a, b) => Object.assign({}, b || {}, a || {});
  function mergeKey(k, local, inc) {
    if (local == null) return inc;
    if (k === "studyhub-bookmarks") {
      const seen = new Set(local.map((x) => x.page + "#" + x.id));
      return local.concat(inc.filter((x) => !seen.has(x.page + "#" + x.id))).sort((a, b) => (b.t || 0) - (a.t || 0));
    }
    if (k === "studyhub-pos") {
      const out = Object.assign({}, local);
      for (const p in inc) if (!out[p] || (inc[p].t || 0) > (out[p].t || 0)) out[p] = inc[p];
      return out;
    }
    if (k === "studyhub-last") return (inc.t || 0) > (local.t || 0) ? inc : local;
    if (k === "studyhub-done") return union(local, inc);
    if (k === "studyhub-stats") {
      const days = Object.assign({}, inc.days || {});
      for (const day in (local.days || {})) days[day] = Math.max(days[day] || 0, local.days[day]);
      const total = Object.values(days).reduce((s, n) => s + n, 0);
      return { days, total, last: Math.max(local.last || 0, inc.last || 0) };
    }
    if (k.startsWith("studyhub-quiz-")) return { practice: union(local.practice, inc.practice), wrong: union(local.wrong, inc.wrong) };
    return local;
  }
  function merge(inc) {
    for (const k in inc.d) put(k, mergeKey(k, get(k, null), inc.d[k]));
  }
  function summary(inc) {
    const d = inc.d, parts = [];
    if (d["studyhub-bookmarks"]) parts.push(`북마크 ${d["studyhub-bookmarks"].length}개`);
    if (d["studyhub-last"]) parts.push("이어보기 위치");
    if (d["studyhub-done"]) parts.push(`완료 체크 ${Object.keys(d["studyhub-done"]).length}개`);
    if (d["studyhub-stats"]) parts.push(`공부 기록 ${d["studyhub-stats"].total || 0}세트`);
    if (Object.keys(d).some((k) => k.startsWith("studyhub-quiz-"))) parts.push("퀴즈 기록");
    return parts.join(", ") || "저장된 기록";
  }

  // ---- public API ----
  async function exportLink() {
    const code = await encode(collect());
    const base = location.origin + location.pathname.replace(/\/c\/[^/]*\/.*$|\/[^/]*$/, "/");
    return { code, link: base + "index.html#sync=" + code };
  }
  async function importText(text) {
    const inc = await decode(text);
    if (!confirm(`다른 기기의 기록을 이 기기에 합칠까요?\n(${summary(inc)})\n\n이 기기에 있는 기록은 지워지지 않아요.`)) return false;
    merge(inc);
    return true;
  }
  window.StudySync = { exportLink, importText };

  // ---- opened via a sync link (fresh load, or pasted into an already open tab) ----
  function fromHash() {
    if (!/^#sync=/.test(location.hash)) return;
    const text = location.hash;
    history.replaceState(null, "", location.pathname + location.search);
    importText(text).then((ok) => { if (ok) location.reload(); }).catch(() => alert("링크가 잘못됐어요. 내보내기를 다시 해서 새 링크로 열어 주세요."));
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
