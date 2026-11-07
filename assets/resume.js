/* Resume where you left off + bookmarks.
   - Note pages: remembers the section you are reading; next visit shows "이어서 보기".
   - 🔖 next to every section heading toggles a bookmark.
   - Index pages: <div id="resume-box"> lists the last place and all bookmarks. */
(function () {
  const LAST = "studyhub-last", POS = "studyhub-pos", BM = "studyhub-bookmarks";
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = (h) => h.textContent.replace(/🔖/g, "").trim().replace(/#$/, "").trim();
  const page = location.pathname;
  const pageTitle = document.title.replace(/^\[[^\]]*\] /, "").split(" · ")[0];

  const md = document.querySelector(".md");
  const heads = md ? [...md.querySelectorAll("h2[id], h3[id], h4[id]")] : [];

  if (heads.length) {
    // ---- remember the section in view ----
    let timer = null;
    const current = () => {
      let cur = null;
      for (const h of heads) { if (h.getBoundingClientRect().top < 120) cur = h; else break; }
      return cur;
    };
    const save = () => {
      const h = current();
      if (!h || window.scrollY < 200) return;
      const rec = { page, title: pageTitle, id: h.id, head: clean(h), y: Math.round(window.scrollY), t: Date.now() };
      const pos = get(POS, {}); pos[page] = rec; put(POS, pos); put(LAST, rec);
    };
    window.addEventListener("scroll", () => { clearTimeout(timer); timer = setTimeout(save, 600); }, { passive: true });
    window.addEventListener("pagehide", save);

    // ---- offer to jump back ----
    const prev = get(POS, {})[page];
    if (prev && !location.hash && prev.y > 400) {
      const bar = document.createElement("div");
      bar.className = "resume-toast";
      bar.innerHTML = `<span>📍 지난번 여기까지 봤어요: <b>${esc(prev.head)}</b></span><button class="go">이어서 보기</button><button class="x" aria-label="닫기">✕</button>`;
      document.body.appendChild(bar);
      bar.querySelector(".go").onclick = () => {
        const el = document.getElementById(prev.id);
        if (el) el.scrollIntoView({ block: "start" }); else window.scrollTo(0, prev.y);
        bar.remove();
      };
      bar.querySelector(".x").onclick = () => bar.remove();
      setTimeout(() => bar.classList.add("hide"), 15000);
    }

    // ---- bookmark buttons ----
    const marked = (id) => get(BM, []).some((b) => b.page === page && b.id === id);
    heads.forEach((h) => {
      const b = document.createElement("button");
      b.className = "bm"; b.type = "button";
      const sync = () => { const on = marked(h.id); b.classList.toggle("on", on); b.title = on ? "북마크 지우기" : "북마크하기"; b.textContent = "🔖"; };
      b.onclick = (e) => {
        e.preventDefault();
        let list = get(BM, []);
        if (marked(h.id)) list = list.filter((x) => !(x.page === page && x.id === h.id));
        else list.unshift({ page, title: pageTitle, id: h.id, head: clean(h), t: Date.now() });
        put(BM, list); sync();
      };
      sync(); h.appendChild(b);
    });
  }

  // ---- index pages: last place + bookmark list ----
  const box = document.getElementById("resume-box");
  if (box) {
    const scope = box.dataset.scope === "here" ? location.pathname.replace(/[^/]*$/, "") : "/";
    const last = get(LAST, null);
    const bms = get(BM, []).filter((b) => b.page.startsWith(scope));
    let h = "";
    if (last && last.page.startsWith(scope)) {
      h += `<a class="card resume" href="${esc(last.page)}#${esc(last.id)}"><span class="kicker">📍 이어서 보기</span><h3>${esc(last.title)}</h3><p>${esc(last.head)}</p></a>`;
    }
    if (bms.length) {
      h += `<div class="card bms"><span class="kicker">🔖 북마크 ${bms.length}개</span><ul>` +
        bms.map((b) => `<li><a href="${esc(b.page)}#${esc(b.id)}"><b>${esc(b.title)}</b> · ${esc(b.head)}</a><button data-del="${esc(b.page + "#" + b.id)}" aria-label="북마크 지우기">✕</button></li>`).join("") + "</ul></div>";
    }
    if (h) { box.innerHTML = h; box.hidden = false; }
    box.addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"); if (!d) return;
      e.preventDefault();
      put(BM, get(BM, []).filter((b) => b.page + "#" + b.id !== d.dataset.del));
      d.closest("li").remove();
    });
  }
})();
