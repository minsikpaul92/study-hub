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
      <div class="meta"><span class="cycles"></span><span class="next"></span></div>
      <details>
        <summary>설정</summary>
        <label>공부 시간(분) <input type="number" min="1" max="120" data-c="studyMin"></label>
        <label>휴식 시간(분) <input type="number" min="1" max="60" data-c="breakMin"></label>
        <label>끝나면 다음 단계 자동 시작 <input type="checkbox" data-c="auto"></label>
        <button data-a="test" class="sound-test">🔔 소리 테스트</button>
        <p class="sound-tip">브라우저는 페이지를 한 번 누르기 전에는 소리를 막아요. 페이지를 옮기면 아무 곳이나 한 번 눌러 두세요.</p>
      </details>
    </div>
    <button class="timer-pill" aria-label="공부 타이머 열기"><span class="dot"></span><span class="pill-label">공부 15:00</span></button>`;
  const overlay = document.createElement("div");
  overlay.className = "break-overlay";
  overlay.innerHTML = `<div class="box"><h2>쉬는 시간이에요</h2><div class="big">05:00</div>
    <p>화면에서 눈을 떼고 일어나서 물 한 잔 마셔요. 끝나면 종소리로 알려 줄게요(안 누르면 30초마다 최대 3번).</p>
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
  const CHIME = [["mi", "do", "re", "sol"], ["sol", "re", "mi", "do"], ["mi", "re", "do", "sol"], ["sol", "re", "mi", "do"]];
  function bell(c, out, f, at, len) {
    // A struck bell: a few partials (some slightly off-harmonic) that fade at different speeds.
    [[1, 0.5, 1], [2, 0.25, 0.7], [2.4, 0.12, 0.5], [3, 0.1, 0.45], [4.2, 0.06, 0.3], [0.5, 0.15, 1.2]].forEach(([r, amp, d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f * r;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(amp, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len * d);
      o.connect(g).connect(out); o.start(at); o.stop(at + len * d + 0.05);
    });
  }
  function tones() {
    const c = audio(); if (!c) return false;
    const out = c.createGain(); out.gain.value = 0.55;
    const comp = c.createDynamicsCompressor(); out.connect(comp).connect(c.destination);
    let t = c.currentTime + 0.05;
    CHIME.forEach((phrase) => {
      phrase.forEach((n, i) => { const last = i === 3; bell(c, out, C[n], t, last ? 2.6 : 1.8); t += last ? 1.1 : 0.55; });
      t += 0.2;
    });
    return c.state === "running";
  }
  let flashT = null;
  function flashTitle(text) {
    // Fallback when sound is blocked: blink the tab title until the page is touched.
    const orig = document.title; let on = false; clearInterval(flashT);
    flashT = setInterval(() => { document.title = (on = !on) ? "🔔 " + text : orig; }, 900);
    const stop = () => { clearInterval(flashT); document.title = orig; window.removeEventListener("pointerdown", stop); window.removeEventListener("keydown", stop); };
    window.addEventListener("pointerdown", stop); window.addEventListener("keydown", stop);
  }
  let repeatT = null;
  function stopRepeat() { clearInterval(repeatT); repeatT = null; }
  ["pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, stopRepeat, { capture: true }));
  function chime(text) {
    if (!st.cfg.sound) return;
    stopRepeat(); let rings = 1;
    repeatT = setInterval(() => { if (!st.cfg.sound || ++rings > 3) return stopRepeat(); tones(); }, 30000);
    const ok = tones();
    if (!ok) {
      flashTitle(text);
      // Retry once the user touches the page, so the chime still plays late instead of never.
      const late = () => { tones(); window.removeEventListener("pointerdown", late); };
      window.addEventListener("pointerdown", late);
    }
  }
  function notify(text) {
    try { if ("Notification" in window && Notification.permission === "granted" && document.hidden) new Notification("study-hub", { body: text }); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
  }

  function finish() {
    // Another open tab may have already advanced the timer.
    const fresh = load();
    if (fresh.mode !== st.mode || fresh.endAt !== st.endAt || !fresh.running) { st = fresh; return; }
    if (st.mode === "study") { st.cycles += 1; st.mode = "break"; }
    else st.mode = "study";
    st.remain = dur(st.mode);
    if (st.cfg.auto) { st.running = true; st.endAt = Date.now() + st.remain; }
    else st.running = false;
    const msg = st.mode === "break" ? `${st.cfg.studyMin}분 끝! ${st.cfg.breakMin}분 쉬어요.` : "휴식 끝! 다시 공부 시작해요.";
    save(); chime(msg); notify(msg);
  }

  function act(a) {
    if (a === "toggle") {
      if (st.running) { st.remain = left(); st.running = false; }
      else {
        st.running = true; st.endAt = Date.now() + (st.remain || dur(st.mode));
        try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
      }
    } else if (a === "skip") {
      st.mode = st.mode === "study" ? "break" : "study";
      st.remain = dur(st.mode);
      if (st.running) st.endAt = Date.now() + st.remain;
    } else if (a === "reset") {
      st.mode = "study"; st.running = false; st.remain = dur("study"); stopRepeat();
    } else if (a === "hide") { st.hiddenFor = st.endAt; }
    else if (a === "test") { tones(); return; }
    else if (a === "sound") { st.cfg.sound = !st.cfg.sound; stopRepeat(); }
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
    $(".cycles").textContent = `오늘 ${st.cycles}세트 완료`;
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
