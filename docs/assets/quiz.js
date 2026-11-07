/* Quiz engine. Data: window.QUIZ = [{ week, topic, level (1 basic, 2 applied, 3 exam-hard),
   q, code?, opts: [correct, wrong, wrong, wrong], ex, refs: [{label, href}] }]
   window.COURSE = { code, weeks: [{ n, title }], exams: [{ title, weeks }] } */
(function () {
  const Q = window.QUIZ || [];
  const C = window.COURSE || { code: "COURSE", weeks: [], exams: [] };
  const KEY = "studyhub-quiz-" + C.code;
  const LET = ["A", "B", "C", "D", "E"];
  const LV = { 1: "기본", 2: "응용", 3: "시험 심화" };
  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  saved.practice = saved.practice || {}; saved.wrong = saved.wrong || {};
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
  const qid = (q) => q.week + ":" + q.q.slice(0, 60);

  const counts = {};
  Q.forEach((q) => { counts[q.week] = (counts[q.week] || 0) + 1; });
  const S = { weeks: new Set(Object.keys(counts).map(Number)), mode: "practice", filter: "all", size: 20, exam: null };

  // Controls
  function controls() {
    const wk = el("weeks");
    wk.innerHTML = C.weeks.map((w) => `<button class="chip" data-w="${w.n}" aria-pressed="${S.weeks.has(w.n)}" ${counts[w.n] ? "" : "disabled"}>Week ${w.n} <small>${counts[w.n] || 0}</small></button>`).join("");
    const pre = el("presets");
    pre.innerHTML = (C.exams || []).map((x, i) => `<button class="chip" data-p="${i}">${esc(x.title)} 범위 <small>W${x.weeks.join(",")}</small></button>`).join("") +
      `<button class="chip" data-p="all">전체</button><button class="chip" data-p="wrong">오답노트 <small>${Object.keys(saved.wrong).length}</small></button>`;
    document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === S.mode)));
    el("size-row").style.display = S.mode === "exam" ? "" : "none";
    document.querySelectorAll("[data-size]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.size) === S.size)));
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    if (b.dataset.w) { const n = Number(b.dataset.w); S.weeks.has(n) ? S.weeks.delete(n) : S.weeks.add(n); S.filter = "all"; S.exam = null; controls(); render(); }
    else if (b.dataset.p) {
      S.exam = null; S.filter = "all";
      if (b.dataset.p === "all") S.weeks = new Set(Object.keys(counts).map(Number));
      else if (b.dataset.p === "wrong") { S.filter = "wrong"; S.mode = "practice"; }
      else S.weeks = new Set(C.exams[Number(b.dataset.p)].weeks.filter((n) => counts[n]));
      controls(); render();
    }
    else if (b.dataset.mode) { S.mode = b.dataset.mode; S.exam = null; controls(); render(); }
    else if (b.dataset.size) { S.size = Number(b.dataset.size); controls(); render(); }
  });

  const pool = () => Q.map((q, i) => ({ ...q, i })).filter((q) => S.filter === "wrong" ? saved.wrong[qid(q)] : S.weeks.has(q.week));

  function card(q, n, state) {
    // state: { order, picked, reveal }
    let h = `<article class="q" id="q${q.i}"><div class="qhead"><b>Q${n}</b><span>Week ${q.week}</span><span>· ${esc(q.topic || "")}</span><span class="lvl">${LV[q.level || 1]}</span></div>`;
    if (q.code) h += `<pre>${esc(q.code)}</pre>`;
    h += `<p class="stem">${esc(q.q)}</p><div class="opts">`;
    state.order.forEach((oi, pos) => {
      let cls = "opt";
      if (state.reveal) { if (oi === 0) cls += " right"; else if (oi === state.picked) cls += " wrong"; }
      else if (oi === state.picked) cls += " picked";
      h += `<button class="${cls}" data-q="${q.i}" data-o="${oi}" ${state.reveal ? "disabled" : ""}><span class="let">${LET[pos]}</span><span>${esc(q.opts[oi])}</span></button>`;
    });
    h += `</div>`;
    if (state.reveal) {
      const ok = state.picked === 0;
      h += `<div class="explain"><p class="verdict ${ok ? "ok" : "no"}">${state.picked === undefined ? "안 풀었어요. 정답은 " + LET[state.order.indexOf(0)] + "예요." : ok ? "정답이에요." : "아쉬워요. 정답은 " + LET[state.order.indexOf(0)] + "예요."}</p><p>${esc(q.ex || "")}</p>`;
      if (q.refs && q.refs.length) h += `<div class="src">${q.refs.map((r) => `<span>📎 <a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.label)}</a></span>`).join("")}</div>`;
      h += `</div>`;
    }
    return h + `</article>`;
  }

  const orders = {};
  const orderOf = (q) => (orders[q.i] = orders[q.i] || shuffle(q.opts.map((_, k) => k)));

  function render() {
    const list = el("list"), bar = el("bar");
    if (S.mode === "practice") {
      const items = pool();
      const done = items.filter((q) => saved.practice[q.i] !== undefined);
      const right = done.filter((q) => saved.practice[q.i] === 0).length;
      bar.innerHTML = `<b>${right}</b> / ${done.length} 정답 · 전체 ${items.length}문항<div class="progress"><i style="width:${items.length ? (done.length / items.length) * 100 : 0}%"></i></div><button class="btn ghost" id="reset-p">다시 풀기</button>`;
      list.innerHTML = items.length ? items.map((q, n) => card(q, n + 1, { order: orderOf(q), picked: saved.practice[q.i], reveal: saved.practice[q.i] !== undefined })).join("") : `<p class="empty">${S.filter === "wrong" ? "오답노트가 비어 있어요." : "주차를 골라 주세요."}</p>`;
      el("reset-p").onclick = () => { items.forEach((q) => delete saved.practice[q.i]); persist(); render(); };
      return;
    }
    // Exam mode
    if (!S.exam) {
      const items = pool();
      bar.innerHTML = "";
      list.innerHTML = `<div class="result"><p>선택한 주차에서 <b>${Math.min(S.size, items.length)}문항</b>을 뽑아요. 어려운 문제(응용, 시험 심화)를 먼저 넣고, 보기 순서도 섞어요.</p>
        <p>제한 시간 <b>${Math.ceil(Math.min(S.size, items.length) * 1.2)}분</b> · 제출하기 전에는 정답을 보여 주지 않아요.</p>
        <button class="btn" id="start" ${items.length ? "" : "disabled"}>시험 시작</button></div>`;
      el("start").onclick = startExam;
      return;
    }
    const ex = S.exam;
    const answered = Object.keys(ex.picked).length;
    const remain = Math.max(0, ex.endAt - Date.now());
    if (ex.submitted) {
      const right = ex.items.filter((q) => ex.picked[q.i] === 0).length;
      const byWeek = {};
      ex.items.forEach((q) => { byWeek[q.week] = byWeek[q.week] || [0, 0]; byWeek[q.week][1]++; if (ex.picked[q.i] === 0) byWeek[q.week][0]++; });
      bar.innerHTML = `<b>결과</b> ${right} / ${ex.items.length}<div class="progress"><i style="width:${(right / ex.items.length) * 100}%"></i></div><button class="btn ghost" id="again">새 시험</button>`;
      list.innerHTML = `<div class="result"><div class="score">${Math.round((right / ex.items.length) * 100)}점</div><p>${Object.entries(byWeek).map(([w, [r, t]]) => `Week ${w}: ${r}/${t}`).join(" · ")}</p><p>틀린 문제는 오답노트에 저장했어요.</p></div>` +
        ex.items.map((q, n) => card(q, n + 1, { order: ex.order[q.i], picked: ex.picked[q.i], reveal: true })).join("");
      el("again").onclick = () => { S.exam = null; render(); };
      return;
    }
    const m = Math.floor(remain / 60000), s = Math.floor((remain % 60000) / 1000);
    bar.innerHTML = `⏱ <b>${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}</b> · ${answered} / ${ex.items.length} 답함<div class="progress"><i style="width:${(answered / ex.items.length) * 100}%"></i></div><button class="btn" id="submit">제출</button>`;
    if (!list.dataset.exam || list.dataset.exam !== String(ex.id)) {
      list.dataset.exam = String(ex.id);
      list.innerHTML = ex.items.map((q, n) => card(q, n + 1, { order: ex.order[q.i], picked: ex.picked[q.i], reveal: false })).join("");
    }
    el("submit").onclick = () => { if (answered < ex.items.length && !confirm(`${ex.items.length - answered}문항을 안 풀었어요. 제출할까요?`)) return; submit(); };
  }

  function startExam() {
    const items = pool();
    const hard = shuffle(items.filter((q) => (q.level || 1) >= 2)), easy = shuffle(items.filter((q) => (q.level || 1) < 2));
    const pick = hard.concat(easy).slice(0, S.size);
    const order = {}; pick.forEach((q) => (order[q.i] = shuffle(q.opts.map((_, k) => k))));
    S.exam = { id: Date.now(), items: shuffle(pick), order, picked: {}, endAt: Date.now() + Math.ceil(pick.length * 1.2) * 60000, submitted: false };
    el("list").dataset.exam = "";
    render(); window.scrollTo(0, el("bar").offsetTop - 80);
  }
  function submit() {
    const ex = S.exam; ex.submitted = true;
    ex.items.forEach((q) => { if (ex.picked[q.i] === 0) delete saved.wrong[qid(q)]; else saved.wrong[qid(q)] = 1; });
    persist(); el("list").dataset.exam = ""; controls(); render(); window.scrollTo(0, 0);
  }

  el("list").addEventListener("click", (e) => {
    const b = e.target.closest(".opt");
    if (!b || b.disabled) return;
    const i = Number(b.dataset.q), o = Number(b.dataset.o);
    if (S.mode === "practice") {
      saved.practice[i] = o;
      const q = Q[i]; if (o === 0) delete saved.wrong[qid(q)]; else saved.wrong[qid(q)] = 1;
      persist(); const y = window.scrollY; render(); controls(); window.scrollTo(0, y);
    } else if (S.exam && !S.exam.submitted) {
      S.exam.picked[i] = o;
      b.parentElement.querySelectorAll(".opt").forEach((x) => x.classList.toggle("picked", x === b));
      render();
    }
  });
  setInterval(() => { if (S.mode === "exam" && S.exam && !S.exam.submitted) { if (Date.now() >= S.exam.endAt) submit(); else render(); } }, 1000);

  controls(); render();
})();
