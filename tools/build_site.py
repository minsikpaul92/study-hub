"""study-hub 정적 사이트 빌더.

사용법: python3 tools/build_site.py [출력폴더=_site]
courses/*/course.json 을 읽어서 수업별, 주차별 HTML 페이지를 만든다.
GitHub Actions(.github/workflows/pages.yml)가 push 때마다 실행해서 GitHub Pages에 배포한다.
"""
import html, json, os, re, shutil, sys, glob
from markdown_it import MarkdownIt
from mdit_py_plugins.anchors import anchors_plugin
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from pygments.util import ClassNotFound

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "_site"))
REPO = os.environ.get("GITHUB_REPOSITORY", "minsikpaul92/study-hub")
REPO_URL = f"https://github.com/{REPO}"
SITE_NAME = "study-hub"


def _asset_version():
    import hashlib
    h = hashlib.sha1()
    for f in sorted(glob.glob(os.path.join(ROOT, "assets", "*"))):
        h.update(open(f, "rb").read())
    return h.hexdigest()[:8]


V = _asset_version()  # cache-busting query so browsers pick up new CSS/JS


# ---------- Markdown ----------
def slug(s):
    s = re.sub(r"<[^>]+>", "", s).strip().lower()
    s = re.sub(r"[^\w\s가-힣-]", "", s)
    return re.sub(r"[\s]+", "-", s).strip("-") or "section"


def hl(code, lang, attrs):
    lang = (lang or "").strip().lower()
    alias = {"js": "jsx", "javascript": "jsx", "ts": "tsx", "typescript": "tsx", "sh": "bash", "shell": "bash", "": "text"}
    try:
        lexer = get_lexer_by_name(alias.get(lang, lang))
    except ClassNotFound:
        lexer = get_lexer_by_name("text")
    body = highlight(code, lexer, HtmlFormatter(nowrap=True))
    return f'<pre class="hl"><code class="language-{html.escape(lang or "text")}">{body}</code></pre>'


MD = (MarkdownIt("commonmark", {"html": True, "highlight": hl})
      .enable("table").enable("strikethrough")
      .use(anchors_plugin, min_level=1, max_level=4, slug_func=slug, permalink=True, permalinkSymbol="#", permalinkBefore=False))


def render_md(text):
    out = MD.render(text)
    # Korean explanation blocks: from "🇰🇷 ..." paragraph up to the next heading
    out = re.sub(r'(<p><strong>🇰🇷[^<]*</strong></p>)(.*?)(?=<h[1-4][ >]|<hr ?/?>|\Z)',
                 r'<div class="ko">\1\2</div>', out, flags=re.S)
    out = re.sub(r'<a href="(https://snack\.expo\.dev[^"]*)">', r'<a class="run" href="\1" target="_blank" rel="noopener">', out)
    out = re.sub(r'<a href="(https?://(?!snack)[^"]*)">', r'<a href="\1" target="_blank" rel="noopener">', out)
    # markitdown left some images as truncated data URIs; drop them
    out = re.sub(r'<img src="data:[^"]*\.\.\."[^>]*>', '', out)
    out = out.replace('class="header-anchor"', 'class="anchor" aria-label="링크"')
    return out


def strip_toc_section(text):
    # The notes carry a plain "## 목차" list; the site shows a sidebar instead.
    return re.sub(r"\n## 목차\n\n(?:- .*\n)+", "\n", text)


def headings(h, levels=(2, 3)):
    res = []
    for m in re.finditer(r'<h([1-4]) id="([^"]+)"[^>]*>(.*?)</h\1>', h, re.S):
        lv = int(m.group(1))
        if lv in levels:
            txt = re.sub(r"<[^>]+>", "", m.group(3)).replace("#", "").strip()
            res.append((lv, m.group(2), html.unescape(txt)))
    return res


def h1_of(text, fallback):
    m = re.search(r"^#\s+(.+)$", text, re.M)
    return m.group(1).strip() if m else fallback


# ---------- Page shell ----------
THEME_JS = """<script>(function(){var t='dark';try{t=localStorage.getItem('studyhub-theme')||'dark';}catch(e){}document.documentElement.dataset.theme=t;})();</script>"""


def page(title, body, rel, crumbs=(), scripts=(), toc_toggle=False, desc=""):
    cr = "".join(f'<span>/</span><a href="{rel}{href}">{html.escape(t)}</a>' if href else f'<span>/</span><span>{html.escape(t)}</span>' for t, href in crumbs)
    sc = "".join(f'<script src="{rel}assets/{s}?v={V}"></script>' for s in scripts)
    tt = '<button class="iconbtn toc-toggle" id="toc-toggle" aria-label="목차">☰ 목차</button>' if toc_toggle else ""
    return f"""<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc or title)}">
{THEME_JS}
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="{rel}assets/site.css?v={V}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
</head><body>
<header class="topbar"><div class="in">
<a class="brand" href="{rel}index.html">study<span>-hub</span></a>
<nav class="crumbs">{cr}</nav><div class="spacer"></div>{tt}
<button class="iconbtn" id="theme" aria-label="테마 바꾸기">🌙<span class="t"> 다크</span></button>
</div></header>
{body}
<script>
(function(){{var b=document.getElementById('theme');function lab(){{var d=document.documentElement.dataset.theme==='dark';b.innerHTML=d?'☀️<span class="t"> 라이트</span>':'🌙<span class="t"> 다크</span>';b.title=d?'라이트 모드로':'다크 모드로';}}lab();b.onclick=function(){{var n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{{localStorage.setItem('studyhub-theme',n);}}catch(e){{}}lab();}};
var t=document.getElementById('toc-toggle'),toc=document.querySelector('.toc');if(t&&toc){{t.onclick=function(){{toc.classList.toggle('open');}};toc.addEventListener('click',function(e){{if(e.target.closest('a'))toc.classList.remove('open');}});}}
document.querySelectorAll('.md pre').forEach(function(p){{var c=document.createElement('button');c.className='copy';c.textContent='복사';c.onclick=function(){{navigator.clipboard.writeText(p.querySelector('code').innerText).then(function(){{c.textContent='복사됨';setTimeout(function(){{c.textContent='복사';}},1200);}});}};p.appendChild(c);}});
}})();
</script>
<script src="{rel}assets/timer.js?v={V}"></script><script src="{rel}assets/snack.js?v={V}"></script><script src="{rel}assets/resume.js?v={V}"></script>{sc}
</body></html>"""


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def doc_page(title, md_html, rel, crumbs, after="", pre=""):
    hs = headings(md_html)
    toc = "".join(f'<li class="l{lv}"><a href="#{i}">{html.escape(t)}</a></li>' for lv, i, t in hs)
    body = f"""<div class="doc"><nav class="toc" aria-label="목차"><div class="t">목차</div><ol>{toc}</ol></nav>
<article class="md">{pre}{md_html}{after}</article></div>
<script>(function(){{var links=[].slice.call(document.querySelectorAll('.toc a'));var map={{}};links.forEach(function(a){{map[a.getAttribute('href').slice(1)]=a;}});
var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{links.forEach(function(a){{a.classList.remove('active');}});var a=map[e.target.id];if(a){{a.classList.add('active');a.scrollIntoView({{block:'nearest'}});}}}}}});}},{{rootMargin:'-70px 0px -75% 0px'}});
document.querySelectorAll('.md h2[id], .md h3[id]').forEach(function(h){{io.observe(h);}});}})();</script>"""
    return page(title, body, rel, crumbs, toc_toggle=True)


# ---------- Course ----------
def build_course(cdir):
    cfg = json.load(open(os.path.join(cdir, "course.json"), encoding="utf-8"))
    cid = os.path.basename(cdir)
    code = cfg["code"]
    out = os.path.join(OUT, "c", cid)
    rel = "../../"
    crumbs = [(code, f"c/{cid}/index.html")]
    weeks = cfg.get("weeks", [])
    repo_tree = f"{REPO_URL}/tree/main/courses/{cid}"

    # Toy project
    toy = cfg.get("toy_project") or {}
    snack = {}
    if toy.get("snack_links") and os.path.exists(os.path.join(cdir, toy["snack_links"])):
        snack = json.load(open(os.path.join(cdir, toy["snack_links"]), encoding="utf-8"))
    guide = None
    if toy.get("guide") and os.path.exists(os.path.join(cdir, toy["guide"])):
        guide = "toy/" + os.path.basename(toy["guide"])
        os.makedirs(os.path.join(out, "toy"), exist_ok=True)
        g = open(os.path.join(cdir, toy["guide"]), encoding="utf-8").read()
        # Follow the site's theme choice and give a way back to the course page
        head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + THEME_JS
        if re.search(r"<head[\s>]", g):
            g = re.sub(r"(<head[^>]*>)", lambda m: m.group(1) + head, g, count=1)
        else:  # artifact-style fragment without a document skeleton
            g = '<!doctype html>\n<html lang="ko"><head>' + head + "</head>\n" + g
        if "</body>" not in g:
            g += "</body></html>"
        back = (f'<a href="../index.html" style="position:fixed;left:16px;bottom:16px;z-index:60;padding:8px 14px;border-radius:999px;'
                f'background:var(--surface);color:var(--ink);border:1px solid var(--line);text-decoration:none;font:600 14px system-ui,sans-serif;'
                f'box-shadow:0 4px 16px rgba(0,0,0,.2)">← {html.escape(code)}</a>')
        g = g.replace("</body>", back + "</body>", 1)
        write(os.path.join(out, guide), g)

    def toy_link(w):
        t = w.get("toy")
        if not t:
            return ""
        key = re.sub(r"\D", "", t).zfill(2)
        if key in snack:
            return f'<a class="pill" href="{html.escape(snack[key])}" target="_blank" rel="noopener">🧩 토이 Snack</a>'
        return f'<a class="pill" href="{repo_tree}/toy-project/{t}" target="_blank" rel="noopener">🧩 토이 코드</a>'

    # Week pages
    built = []
    for idx, w in enumerate(weeks):
        p = os.path.join(cdir, w.get("notes", ""))
        if not w.get("notes") or not os.path.exists(p):
            continue
        text = open(p, encoding="utf-8").read()
        h = render_md(strip_toc_section(text))
        name = f"week-{w['n']:02d}.html"
        built.append((w, name))
    for k, (w, name) in enumerate(built):
        text = open(os.path.join(cdir, w["notes"]), encoding="utf-8").read()
        h = render_md(strip_toc_section(text))
        prev = built[k - 1] if k > 0 else None
        nxt = built[k + 1] if k + 1 < len(built) else None
        pager = '<nav class="pager">' + (f'<a href="{prev[1]}"><small>← 이전</small>Week {prev[0]["n"]}. {html.escape(prev[0]["title"])}</a>' if prev else "<span></span>") + \
                (f'<a class="next" href="{nxt[1]}"><small>다음 →</small>Week {nxt[0]["n"]}. {html.escape(nxt[0]["title"])}</a>' if nxt else "<span></span>") + "</nav>"
        extra = f"""<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:32px">{toy_link(w)}<a class="pill" href="quiz.html">📝 퀴즈 풀기</a></div>
<button class="mark-done" data-key="{cid}-w{w['n']}" aria-pressed="false">☐ 이번 주 공부 완료로 표시</button>{pager}
<script>(function(){{var b=document.querySelector('.mark-done'),K='studyhub-done';var d={{}};try{{d=JSON.parse(localStorage.getItem(K)||'{{}}');}}catch(e){{}}
function p(){{var on=!!d[b.dataset.key];b.setAttribute('aria-pressed',on);b.textContent=(on?'☑ 완료한 주차예요':'☐ 이번 주 공부 완료로 표시');}}
b.onclick=function(){{d[b.dataset.key]=!d[b.dataset.key];try{{localStorage.setItem(K,JSON.stringify(d));}}catch(e){{}}p();}};p();}})();</script>"""
        write(os.path.join(out, name), doc_page(f"Week {w['n']}. {w['title']} · {code}", h, rel, crumbs + [(f"Week {w['n']}", None)], after=extra))

    # Mock exams
    mocks = []
    for i, m in enumerate(cfg.get("mock_exams", []), 1):
        for kind in ("file", "answers"):
            src = m.get(kind)
            if src and os.path.exists(os.path.join(cdir, src)):
                text = open(os.path.join(cdir, src), encoding="utf-8").read()
                name = f"mock-{i}{'-answers' if kind == 'answers' else ''}.html"
                label = m["title"] + (" 정답과 해설" if kind == "answers" else "")
                write(os.path.join(out, name), doc_page(f"{label} · {code}", render_md(text), rel, crumbs + [(label, None)]))
        mocks.append((m, f"mock-{i}.html", f"mock-{i}-answers.html" if m.get("answers") else None))

    # Quiz
    qpath = os.path.join(cdir, "exam-prep", "quiz.json")
    quiz = json.load(open(qpath, encoding="utf-8")) if os.path.exists(qpath) else []
    qc = {"code": code, "weeks": [{"n": w["n"], "title": w["title"]} for w in weeks], "exams": cfg.get("exams", [])}
    quiz_body = f"""<main class="wrap"><section class="hero"><h1>{html.escape(code)} 퀴즈 · 시험 대비</h1>
<p>주차를 골라서 풀어요. <b>연습 모드</b>는 바로 채점하고 해설을 보여 주고, <b>시험 모드</b>는 어려운 문제부터 뽑아 시간 제한을 두고 제출한 뒤에 채점해요. 틀린 문제는 오답노트에 모여요.</p></section>
<div class="quiz-controls" style="margin-top:24px">
<div><div class="lbl">모드</div><div class="chips"><button class="chip" data-mode="practice">연습 모드</button><button class="chip" data-mode="exam">시험 모드</button></div></div>
<div><div class="lbl">빠른 선택</div><div class="chips" id="presets"></div></div>
<div><div class="lbl">주차 (숫자는 문항 수)</div><div class="chips" id="weeks"></div></div>
<div id="size-row"><div class="lbl">문항 수</div><div class="chips"><button class="chip" data-size="10">10</button><button class="chip" data-size="20">20</button><button class="chip" data-size="40">40</button><button class="chip" data-size="999">전부</button></div></div>
</div>
<div class="quiz-bar" id="bar"></div><div id="list"></div></main>
<script>window.QUIZ={json.dumps(quiz, ensure_ascii=False)};window.COURSE={json.dumps(qc, ensure_ascii=False)};</script>"""
    write(os.path.join(out, "quiz.html"), page(f"퀴즈 · {code}", quiz_body, rel, crumbs + [("퀴즈", None)], scripts=["quiz.js"]))

    # Materials browser
    mat_root = os.path.join(cdir, "materials")
    mat_groups = []
    labels = {"lectures": "강의자료", "in-class": "인클래스 수업자료", "labs": "Labs / Workshops", "projects": "프로젝트", "sample-tests": "샘플 시험", "course-notes": "코스노트"}
    if os.path.isdir(mat_root):
        for sub in sorted(os.listdir(mat_root), key=lambda s: list(labels).index(s) if s in labels else 99):
            files = sorted(glob.glob(os.path.join(mat_root, sub, "**", "*.md"), recursive=True))
            items = []
            for f in files:
                relp = os.path.relpath(f, mat_root)
                name = "m/" + relp[:-3].replace(os.sep, "__") + ".html"
                text = open(f, encoding="utf-8").read()
                t = h1_of(text, os.path.basename(f))
                write(os.path.join(out, name), doc_page(f"{t} · {code}", render_md(text), "../" + rel, crumbs + [("자료", f"c/{cid}/materials.html"), (t, None)]))
                items.append((t, name, relp))
            mat_groups.append((labels.get(sub, sub), items))
    mat_body = '<main class="wrap"><section class="hero"><h1>수업 원본 자료</h1><p>해설노트가 참고한 영어 원문이에요. 출처는 각 페이지 맨 위에 있어요.</p></section>'
    for g, items in mat_groups:
        if not items:
            continue
        mat_body += f'<h2 class="section-title">{html.escape(g)} · {len(items)}</h2>'
        mat_body += '<div class="grid">' + "".join(f'<a class="card" href="{n}"><h3>{html.escape(t)}</h3><p>{html.escape(r)}</p></a>' for t, n, r in items) + "</div>"
    mat_body += "</main>"
    write(os.path.join(out, "materials.html"), page(f"자료 · {code}", mat_body, rel, crumbs + [("자료", None)]))

    # Course index
    wk_cards = ""
    for w, name in built:
        tags = "".join(f'<span class="tag">{html.escape(t)}</span>' for t in w.get("topics", []))
        wk_cards += f"""<div class="card wk" data-key="{cid}-w{w['n']}"><span class="done-badge">완료</span><span class="kicker">WEEK {w['n']}</span><h3>{html.escape(w['title'])}</h3><div class="tags">{tags}</div>
<div class="row"><a class="pill primary" href="{name}">📘 해설노트</a>{toy_link(w)}</div></div>"""
    exam_cards = f'<a class="card" href="quiz.html"><span class="kicker">QUIZ</span><h3>주차별 퀴즈 · 모의시험</h3><p>{len(quiz)}문항 · 연습 모드와 시험 모드, 오답노트</p></a>'
    for m, a, b in mocks:
        exam_cards += f'<div class="card"><span class="kicker">MOCK EXAM</span><h3>{html.escape(m["title"])}</h3><p>실제 시험 형식(객관식, 서술, 코딩)</p><div class="row"><a class="pill primary" href="{a}">문제</a>' + (f'<a class="pill" href="{b}">정답과 해설</a>' if b else "") + "</div></div>"
    toy_cards = ""
    if guide or toy:
        toy_cards = f'<div class="grid">' + (f'<a class="card" href="{guide}"><span class="kicker">TOY PROJECT</span><h3>{html.escape(toy.get("title", "토이 프로젝트"))} 로드맵</h3><p>주차마다 기능을 하나씩 더해 완성하는 앱. 주차별 목표, 해설, Snack 버튼.</p></a>' if guide else "") + \
                    f'<a class="card" href="{repo_tree}/toy-project" target="_blank" rel="noopener"><span class="kicker">CODE</span><h3>토이 프로젝트 코드</h3><p>주차별 폴더 (GitHub)</p></a></div>'
    links = "".join(f'<a class="pill" href="{html.escape(l["href"])}" target="_blank" rel="noopener">{html.escape(l["label"])}</a>' for l in cfg.get("links", []))
    body = f"""<main class="wrap"><section class="hero"><p class="kicker" style="color:var(--accent);font-weight:700">{html.escape(cfg.get('school', ''))} · {html.escape(cfg.get('term', ''))}</p>
<h1>{html.escape(code)} {html.escape(cfg.get('title_ko') or cfg.get('title', ''))}</h1><p>{html.escape(cfg.get('title', ''))} · {html.escape(cfg.get('language', ''))}</p>
<div style="margin-top:16px;max-width:420px"><div class="progress"><i id="prog"></i></div><p style="font-size:14px;margin-top:6px" id="prog-t"></p></div>
<div class="row" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><a class="pill" href="materials.html">📂 원본 자료</a>{links}</div></section>
<div class="grid resume-grid" id="resume-box" data-scope="here" hidden></div>
<h2 class="section-title">1. 강의 해설노트</h2><div class="grid">{wk_cards}</div>
<h2 class="section-title">2. 토이 프로젝트</h2>{toy_cards or '<p class="empty">아직 없어요.</p>'}
<h2 class="section-title">3. 퀴즈 · 시험 대비</h2><div class="grid">{exam_cards}</div></main>
<script>(function(){{var d={{}};try{{d=JSON.parse(localStorage.getItem('studyhub-done')||'{{}}');}}catch(e){{}}var cs=document.querySelectorAll('.wk'),n=0;cs.forEach(function(c){{if(d[c.dataset.key]){{c.classList.add('is-done');n++;}}}});
document.getElementById('prog').style.width=(cs.length?n/cs.length*100:0)+'%';document.getElementById('prog-t').textContent='공부 완료 '+n+' / '+cs.length+'주';}})();</script>"""
    write(os.path.join(out, "index.html"), page(f"{code} · {SITE_NAME}", body, rel, crumbs[:0] + [(code, None)]))
    return cfg, cid, len(built), len(quiz)


def main():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "assets"))
    for f in glob.glob(os.path.join(ROOT, "assets", "*")):
        shutil.copy(f, os.path.join(OUT, "assets"))
    courses = []
    for cdir in sorted(glob.glob(os.path.join(ROOT, "courses", "*"))):
        if os.path.exists(os.path.join(cdir, "course.json")):
            courses.append(build_course(cdir))
    cards = "".join(f"""<a class="card" href="c/{cid}/index.html"><span class="kicker">{html.escape(c.get('term', ''))}</span><h3>{html.escape(c['code'])} · {html.escape(c.get('title_ko') or c.get('title', ''))}</h3>
<p>{html.escape(c.get('title', ''))}</p><div class="tags"><span class="tag">해설노트 {nw}주</span><span class="tag">퀴즈 {nq}문항</span></div></a>""" for c, cid, nw, nq in courses)
    body = f"""<main class="wrap"><section class="hero"><h1>수업별 공부 노트</h1>
<p>영어 강의자료 원문 아래에 한글 해설을 붙인 해설노트, 주차마다 기능을 더해 가는 토이 프로젝트, 주차를 골라 푸는 퀴즈와 모의시험. 오른쪽 아래 타이머로 15분 공부, 5분 휴식을 반복해요.</p></section>
<div class="grid resume-grid" id="resume-box" hidden></div>
<h2 class="section-title">수업</h2><div class="grid">{cards}</div></main>
<footer class="site">원본 자료의 저작권은 각 수업의 저작자에게 있어요. 해설과 정리는 개인 학습용이에요. · <a href="{REPO_URL}">GitHub</a></footer>"""
    write(os.path.join(OUT, "index.html"), page(SITE_NAME, body, ""))
    write(os.path.join(OUT, ".nojekyll"), "")
    print("built", OUT, [(c["code"], nw, nq) for c, _, nw, nq in courses])


if __name__ == "__main__":
    main()
