/* Study timer: 15 min study, 5 min break, repeating.
   State lives in localStorage with an absolute end time, so it keeps running
   while you move between week pages or open several tabs. */
(function () {
  const KEY = "studyhub-timer-v1";
  const DEFAULT = { studyMin: 15, breakMin: 5, auto: true, sound: true };

  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    const today = new Date().toDateString();
    if (!s) s = { mode: "study", running: false, endAt: 0, remain: null, cycles: 0, day: today, cfg: { ...DEFAULT } };
    s.cfg = { ...DEFAULT, ...(s.cfg || {}) };
    if (s.day !== today) { s.day = today; s.cycles = 0; }
    if (s.remain == null) s.remain = s.cfg.studyMin * 60 * 1000;
    return s;
  }
  // Study history (kept separately so it survives timer resets and can be synced across devices)
  const STATS = "studyhub-stats";
  const dayKey = (t) => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  function stats() { try { return JSON.parse(localStorage.getItem(STATS)) || { days: {}, total: 0, last: 0 }; } catch (e) { return { days: {}, total: 0, last: 0 }; } }
  function saveStats(x) { try { localStorage.setItem(STATS, JSON.stringify(x)); } catch (e) {} }
  function touchLast() { const x = stats(); x.last = Date.now(); saveStats(x); }
  function addSet() { const x = stats(), k = dayKey(Date.now()); x.days[k] = (x.days[k] || 0) + 1; x.total = Object.values(x.days).reduce((a, n) => a + n, 0); x.last = Date.now(); saveStats(x); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  let st = load();

  const dur = (m) => (m === "study" ? st.cfg.studyMin : st.cfg.breakMin) * 60 * 1000;
  const left = () => Math.max(0, st.running ? st.endAt - Date.now() : st.remain);
  const fmt = (ms) => { const s = Math.ceil(ms / 1000); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

  // UI
  const root = document.createElement("div");
  root.className = "timer";
  root.innerHTML = `
    <div class="timer-panel" role="dialog" aria-label="공부 타이머">
      <div class="top"><div class="mode"></div><button class="snd" data-a="sound" title="알람 소리 켜기/끄기"></button></div>
      <div class="big">15:00</div>
      <div class="bar"><i></i></div>
      <div class="btns">
        <button class="main" data-a="toggle">시작</button>
        <button data-a="skip" title="다음 단계로 넘어가기">건너뛰기</button>
        <button data-a="reset" title="공부 시간 처음부터 다시">↺ 리셋</button>
      </div>
      <div class="meta"><span class="cycles"></span><button class="setreset" data-a="setreset" title="오늘 세트 수를 0으로">세트 리셋</button><span class="next"></span></div>
      <div class="last"></div>
      <details>
        <summary>설정</summary>
        <label>공부 시간(분) <input type="number" min="1" max="120" data-c="studyMin"></label>
        <label>휴식 시간(분) <input type="number" min="1" max="60" data-c="breakMin"></label>
        <label>끝나면 다음 단계 자동 시작 <input type="checkbox" data-c="auto"></label>
        <button data-a="test" class="sound-test">🔔 소리 테스트</button>
        <div class="sync"><div class="sync-title">📲 다른 기기로 옮기기</div>
          <div class="sync-row"><button data-a="export">내보내기(링크 복사)</button><button data-a="import">가져오기</button></div>
          <p class="sound-tip">내보내기로 복사한 링크를 폰이나 아이패드에서 열면 이어보기 위치, 북마크, 공부 기록이 합쳐져요. 링크나 코드를 "가져오기"에 붙여넣어도 돼요.</p>
          <p class="sync-msg" aria-live="polite"></p></div>
        <p class="sound-tip">브라우저는 페이지를 한 번 누르기 전에는 소리를 막아요. 페이지를 옮기면 아무 곳이나 한 번 눌러 두세요.</p>
      </details>
    </div>
    <button class="timer-pill" aria-label="공부 타이머 열기"><span class="dot"></span><span class="pill-label">공부 15:00</span></button>`;
  const overlay = document.createElement("div");
  overlay.className = "break-overlay";
  overlay.innerHTML = `<div class="box"><h2>쉬는 시간이에요</h2><div class="big">05:00</div>
    <p>화면에서 눈을 떼고 일어나서 물 한 잔 마셔요. 끝나면 종소리로 한 번 알려 줄게요.</p>
    <button data-a="hide">계속 읽기 (타이머는 유지)</button><button data-a="skip">바로 공부 시작</button><button data-a="reset">↺ 타이머 리셋</button></div>`;
  document.body.append(root, overlay);
  const $ = (s) => root.querySelector(s);

  // Browsers keep audio locked until the user clicks or presses a key on *this* page,
  // so keep one AudioContext and unlock it on the first gesture.
  let ctx = null;
  function audio() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => window.addEventListener(ev, audio, { capture: true, passive: true }));
  // School chime ("딩동댕동"): the Westminster quarters melody, played with a bell-like tone.
  const C = { do: 523.25, re: 587.33, mi: 659.25, sol: 392.0 };
  const CHIME = [["sol", "mi", "re", "do"]];   // one 딩동댕동 phrase, played once
  // Every sound node of the ring in progress, so one tap can silence it at once.
  let ring = null;
  function bell(c, out, f, at, len, nodes) {
    // A struck bell: a few partials (some slightly off-harmonic) that fade at different speeds.
    [[1, 0.5, 1], [2, 0.25, 0.7], [2.4, 0.12, 0.5], [3, 0.1, 0.45], [4.2, 0.06, 0.3], [0.5, 0.15, 1.2]].forEach(([r, amp, d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f * r;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(amp, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len * d);
      o.connect(g).connect(out); o.start(at); o.stop(at + len * d + 0.05);
      nodes.push(o);
    });
  }
  function tones() {
    stopRing();
    const c = audio(); if (!c) return false;
    const out = c.createGain(); out.gain.value = 0.55;
    const comp = c.createDynamicsCompressor(); out.connect(comp).connect(c.destination);
    const nodes = []; let t = c.currentTime + 0.05;
    CHIME.forEach((phrase) => {
      phrase.forEach((n, i) => { const last = i === phrase.length - 1; bell(c, out, C[n], t, last ? 2.6 : 1.8, nodes); t += last ? 1.1 : 0.55; });
    });
    ring = { out, nodes, comp };
    return c.state === "running";
  }
  function stopRing() {
    if (!ring) return;
    try { ring.out.gain.cancelScheduledValues(0); ring.out.gain.value = 0; ring.nodes.forEach((o) => { try { o.stop(); } catch (e) {} }); ring.out.disconnect(); } catch (e) {}
    ring = null;
  }

  // Toast shown while the bell rings; tapping it silences the bell right away.
  let toastEl = null, toastT = null;
  function hideToast() { clearTimeout(toastT); if (toastEl) { toastEl.remove(); toastEl = null; } }
  function showToast(text, silent) {
    hideToast();
    toastEl = document.createElement("button");
    toastEl.type = "button"; toastEl.className = "chime-toast";
    toastEl.innerHTML = `<span class="msg"></span><span class="hint"></span>`;
    toastEl.querySelector(".msg").textContent = "🔔 " + text;
    toastEl.querySelector(".hint").textContent = silent ? "눌러서 닫기" : "눌러서 종 끄기";
    toastEl.addEventListener("click", () => { stopRing(); hideToast(); });
    document.body.appendChild(toastEl);
    toastT = setTimeout(hideToast, silent ? 8000 : 6500);
  }
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { stopRing(); hideToast(); } });

  let flashT = null;
  function flashTitle(text) {
    // Fallback when sound is blocked: blink the tab title until the page is touched.
    const orig = document.title; let on = false; clearInterval(flashT);
    flashT = setInterval(() => { document.title = (on = !on) ? "🔔 " + text : orig; }, 900);
    const stop = () => { clearInterval(flashT); document.title = orig; window.removeEventListener("pointerdown", stop); window.removeEventListener("keydown", stop); };
    window.addEventListener("pointerdown", stop); window.addEventListener("keydown", stop);
  }
  function stopRepeat() {}   // old name kept; nothing repeats any more

  // One ring per phase change, even with several tabs open: the phase end time is the dedupe key.
  const RINGED = "studyhub-ringed";
  function chime(text, key) {
    try {
      if (key && localStorage.getItem(RINGED) === String(key)) return;
      if (key) localStorage.setItem(RINGED, String(key));
    } catch (e) {}
    const ok = st.cfg.sound ? tones() : false;
    showToast(text, !st.cfg.sound || !ok);
    if (st.cfg.sound && !ok) flashTitle(text);
  }
  function notify(text) {
    try { if ("Notification" in window && Notification.permission === "granted" && document.hidden) new Notification("study-hub", { body: text }); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
  }

  function finish() {
    // Another open tab may have already advanced the timer.
    const fresh = load(), endedKey = st.endAt;
    if (fresh.mode !== st.mode || fresh.endAt !== st.endAt || !fresh.running) { st = fresh; return; }
    if (st.mode === "study") { st.cycles += 1; addSet(); st.mode = "break"; }
    else st.mode = "study";
    st.remain = dur(st.mode);
    if (st.cfg.auto) { st.running = true; st.endAt = Date.now() + st.remain; }
    else st.running = false;
    const msg = st.mode === "break" ? `${st.cfg.studyMin}분 끝! ${st.cfg.breakMin}분 쉬어요.` : "휴식 끝! 다시 공부 시작해요.";
    save(); chime(msg, endedKey); notify(msg);
  }

  const msg = (t) => { const m = $(".sync-msg"); m.textContent = t; };
  async function doExport() {
    if (!window.StudySync) return msg("내보내기를 쓸 수 없어요. 페이지를 새로고침해 주세요.");
    try {
      const { link, code } = await window.StudySync.exportLink();
      try { await navigator.clipboard.writeText(link); msg("링크를 복사했어요. 다른 기기에서 그 링크를 열어 보세요."); }
      catch (e) { window.prompt("이 링크를 복사해 주세요", link); msg("링크를 만들었어요."); }
    } catch (e) { msg("링크를 만들지 못했어요."); }
  }
  async function doImport() {
    const t = window.prompt("복사한 링크나 코드를 붙여넣어 주세요");
    if (!t) return;
    try {
      const ok = await window.StudySync.importText(t);
      if (ok) { msg("합쳤어요. 새로고침합니다."); setTimeout(() => location.reload(), 600); }
    } catch (e) { msg("링크나 코드가 잘못됐어요."); }
  }
  function act(a) {
    if (a === "toggle") {
      if (st.running) { st.remain = left(); st.running = false; }
      else {
        st.running = true; st.endAt = Date.now() + (st.remain || dur(st.mode));
        if (st.mode === "study") touchLast();
        try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
      }
    } else if (a === "skip") {
      st.mode = st.mode === "study" ? "break" : "study";
      st.remain = dur(st.mode);
      if (st.running) st.endAt = Date.now() + st.remain;
    } else if (a === "reset") {
      st.mode = "study"; st.running = false; st.remain = dur("study"); stopRing(); hideToast();
    } else if (a === "hide") { st.hiddenFor = st.endAt; }
    else if (a === "setreset") {
      const x = stats(), k = dayKey(Date.now()), n = x.days[k] || 0;
      if (!n) { paint(); return; }
      if (!window.confirm("오늘 " + n + "세트 기록을 0으로 되돌릴까요? (지난 날짜 기록은 그대로예요)")) return;
      delete x.days[k]; x.total = Object.values(x.days).reduce((a, v) => a + v, 0); saveStats(x); st.cycles = 0;
    }
    else if (a === "test") { tones(); showToast("소리 테스트", false); return; }
    else if (a === "export") { doExport(); return; }
    else if (a === "import") { doImport(); return; }
    else if (a === "sound") { st.cfg.sound = !st.cfg.sound; stopRing(); }
    save(); paint();
  }

  function paint() {
    const ms = left();
    const label = st.mode === "study" ? "공부" : "휴식";
    root.dataset.mode = st.mode; root.dataset.running = String(st.running);
    $(".mode").textContent = st.mode === "study" ? `📖 공부 ${st.cfg.studyMin}분` : `☕ 휴식 ${st.cfg.breakMin}분`;
    $(".big").textContent = fmt(ms);
    $(".bar i").style.width = (100 - (ms / dur(st.mode)) * 100) + "%";
    $(".pill-label").textContent = `${label} ${fmt(ms)}${st.running ? "" : " ⏸"}${st.cfg.sound ? "" : " 🔕"}`;
    $('[data-a="toggle"]').textContent = st.running ? "일시정지" : (ms < dur(st.mode) ? "계속" : "시작");
    $(".snd").textContent = st.cfg.sound ? "🔔 알람 켜짐" : "🔕 알람 꺼짐";
    $(".snd").classList.toggle("off", !st.cfg.sound);
    const sx = stats(), today = sx.days[dayKey(Date.now())] || 0;
    $(".cycles").textContent = `오늘 ${today}세트 · 총 ${sx.total || 0}세트`;
    $(".last").textContent = sx.last ? "마지막 공부: " + new Date(sx.last).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }) : "마지막 공부: 아직 없어요";
    $(".next").textContent = st.mode === "study" ? `다음: 휴식 ${st.cfg.breakMin}분` : `다음: 공부 ${st.cfg.studyMin}분`;
    overlay.querySelector(".big").textContent = fmt(ms);
    overlay.classList.toggle("show", st.mode === "break" && st.running && st.hiddenFor !== st.endAt);
    const base = document.title.replace(/^\[[^\]]*\] /, "");
    document.title = st.running ? `[${label} ${fmt(ms)}] ${base}` : base;
  }

  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (b) return act(b.dataset.a);
    if (e.target.closest(".timer-pill")) root.classList.toggle("open");
  });
  overlay.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (b) act(b.dataset.a); });
  root.querySelectorAll("[data-c]").forEach((inp) => {
    const k = inp.dataset.c;
    if (inp.type === "checkbox") inp.checked = !!st.cfg[k]; else inp.value = st.cfg[k];
    inp.addEventListener("change", () => {
      st.cfg[k] = inp.type === "checkbox" ? inp.checked : Math.max(1, Number(inp.value) || DEFAULT[k]);
      if (!st.running) st.remain = dur(st.mode);
      save(); paint();
    });
  });
  document.addEventListener("click", (e) => { if (!root.contains(e.target)) root.classList.remove("open"); });
  window.addEventListener("storage", (e) => { if (e.key === KEY) { st = load(); paint(); } });

  const tick = () => { if (st.running && Date.now() >= st.endAt) finish(); paint(); };
  setInterval(tick, 250);
  document.addEventListener("visibilitychange", tick);
  paint();
})();
