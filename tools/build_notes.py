"""강의해설노트 빌더.

사용법: python3 tools/build_notes.py courses/<code> [week-05 ...]
  courses/<code>/notes-src/week-XX.md (주석 파일) -> courses/<code>/notes/week-XX.md

주석 파일 문법 (자세한 설명은 CLAUDE.md):
  @@NOTE <path>  코스노트 원문 (course.json note_sources.NOTE 기준 상대경로)
  @@LEC <file>   인클래스 강의 원문
  @@LAB <file>   랩/워크숍 원문
  @@TEST <file>  샘플 시험 원문
  @@K <heading>  바로 위 원문의 해당 제목 아래에 붙일 한글 해설 (_intro, _pre 특수키)
  @@TEXT         자유 마크다운 (체크리스트, 연습 문제 등)
  {{TOC}}        목차 자리
"""
import re, sys, os, json, glob, html, urllib.parse as up
SRC={}; CODE='COURSE'; RUNNER=None; ATTR=''
VER={'@react-navigation/native':'^7.0.0','@react-navigation/native-stack':'^7.0.0','@react-navigation/bottom-tabs':'^7.0.0',
'@react-navigation/drawer':'^7.0.0','react-native-screens':'~4.16.0','react-native-safe-area-context':'~5.6.0',
'react-native-gesture-handler':'~2.28.0','react-native-reanimated':'~4.1.1','react-native-worklets':'0.5.1',
'@expo/vector-icons':'^15.0.3','jotai':'*','@types/react':'*','expo-location':'~19.0.8','react-native-maps':'1.20.1','prop-types':'*'}
BOILER=['Exampleruns in Expo Snack','Opens the code in Snack, where you can edit it and see the result.',
'To interact with it, run the code in Snack, where you can also edit it.']
CSB='https://codesandbox.io/p/sandbox/react-basic-3rqll4'
def deps_for(code):
    pk=set()
    for m in re.finditer(r'''from\s+['"]([^'"./][^'"]*)['"]''',code):
        p=m.group(1)
        p='/'.join(p.split('/')[:2]) if p.startswith('@') else p.split('/')[0]
        if p in('react','react-native'): continue
        pk.add(p)
    if any(p.startswith('@react-navigation') for p in pk):
        pk|={'@react-navigation/native','react-native-screens','react-native-safe-area-context'}
    if '@react-navigation/drawer' in pk:
        pk|={'react-native-gesture-handler','react-native-reanimated','react-native-worklets'}
    if 'jotai' in pk: pk.add('@types/react')
    return sorted(pk)
def snack_platform(code):
    # web preview can't run these, so Snack opens on the iOS simulator instead
    return 'ios' if re.search(r'react-native-maps|react-native-gesture-handler|Alert\.alert|PanResponder|Animated',code) else 'web'
def snack(code,name):
    d=deps_for(code)
    plat=snack_platform(code)
    q={'name':name[:60],'platform':plat,'sdkVersion':'54.0.0','code':code}
    if d: q['dependencies']=','.join(f"{p}@{VER.get(p,'*')}" for p in d)
    return 'https://snack.expo.dev/?'+up.urlencode(q,quote_via=up.quote)
def where_to_type(code):
    web=re.search(r'<div|<button|<h1|createRoot|function MyApp',code) and 'react-native' not in code
    return 'CodeSandbox' if (web or RUNNER!='snack') and web else 'Snack'
def fix_body(text,name,kind,mark=None):
    """mark=(practice_no, todo): put a 'type this' line above every code block."""
    out=[];lines=text.split('\n');i=0;first=True;has_rn='react-native' in text
    while i<len(lines):
        l=lines[i]
        if l.strip() in BOILER: i+=1; continue
        m=re.match(r'^(\s*)```(\w*)\s*$',l)
        if m:
            lang=m.group(2); j=i+1
            while j<len(lines) and not re.match(r'^\s*```\s*$',lines[j]): j+=1
            code='\n'.join(lines[i+1:j])
            if not lang: lang='json' if code.lstrip().startswith('{') and '"dependencies"' in code else 'jsx'
            marked=False
            skipweb=has_rn and where_to_type(code)=='CodeSandbox'   # HTML 'before' version next to the RN version
            if mark and not skipweb and lang in('jsx','js','tsx','ts') and (first or len(mark)>2 or 'export default' in code):
                marked=True
                no,todo=mark[:2]; ind=m.group(1)
                idattr=f' id="practice-{no}"' if (first and no) else ''
                tail=f': {html.escape(todo)}' if (first and todo) else ''
                out.append(''); out.append(f'{ind}<p class="typeit"{idattr}>⌨️ <b>이 코드는 {where_to_type(code)}에서 직접 쳐 보세요</b>{tail}</p>' if first else f'{ind}<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>'); out.append('')
                first=False
            out.append(m.group(1)+'```'+lang); out+=lines[i+1:j]; out.append(m.group(1)+'```')
            if RUNNER!='snack': pass
            elif 'export default' in code and 'react-native' in code and re.search(r'''from\s+['"](@/|\.\.?/|expo-router)''',code):
                out.append(''); out.append('▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.')
            elif 'export default' in code and 'react-native' in code and lang=='tsx' and re.search(r'\w<[^>\n]*>\(|\bas\s+(const|[A-Z]\w*|string|number)\b',code):
                out.append(''); out.append('▶ 이 코드는 `useState<...>()` 같은 TypeScript 문법이 있어서 Snack의 `App.js`에서는 에러가 나요. [Snack](https://snack.expo.dev)을 새로 열고 왼쪽 파일 목록에서 `App.js` 메뉴(점 세 개) → **Rename to App.tsx** 한 번 한 뒤 붙여 넣으세요. 빨간 줄(squiggle)이 타입 에러 표시이고, 앱은 그래도 실행돼요.')
            elif 'export default' in code and 'react-native' in code:
                emb='' if re.search(r'react-native-maps|react-native-gesture-handler',code) else ' <button class="snack-embed" type="button">👀 여기서 결과 보기</button>'
                if emb and 'Alert.alert' in code: emb+=' <span class="snack-tip-inline">(웹 미리보기에서는 Alert 팝업이 안 떠요. 팝업까지 보려면 위 Snack 링크의 iOS로 열어 보세요)</span>'
                out.append(''); out.append(f'▶ **[Snack에서 바로 실행하기]({snack(code.strip()+chr(10),name)})** (SDK 54, 필요한 패키지 자동 포함){emb}')
            elif re.search(r'createRoot|function MyApp|<div|<button',code) and 'react-native' not in code and lang in('jsx','js'):
                out.append(''); out.append(f'▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿]({CSB})에 붙여넣어 실행하세요.')
            i=j+1; continue
        out.append(l); i+=1
    return '\n'.join(out)
KIND={'type':'⌨️ Snack에서 직접 쳐 보기','read':'👀 읽고 이해하기 (타이핑 안 해도 돼요)','lab':'🧪 혼자 풀어 보기','skim':'⏭️ 가볍게 훑기'}
KICON={'type':'⌨️','read':'👀','lab':'🧪','skim':'⏭️'}
def split_todo(text):
    lines=text.split('\n')
    if lines and lines[0].startswith('할 일:'): return lines[0][4:].strip(),'\n'.join(lines[1:]).strip()
    return '',text.strip()
SKIM=('A Note on AI','Submission','Running Your App','Styling Rules','The Clock','Playground','React Playground','React Native Playground')
def auto_kind(typ,h,body):
    if typ=='LAB':
        if h.startswith(SKIM) or h.endswith('Playground'): return 'skim'
        return 'read' if h in('Setup','Overview') else 'lab'
    if typ=='LEC':
        if h.endswith('Playground'): return 'skim'
        if h.startswith('Finished') or h.startswith(('Why','How It Works','What to Show')) or 'Checklist' in h: return 'read'
        if (h.startswith('Example') and '```' in body) or h.startswith(('Starter','Step')): return 'type'
    return 'read'
def first_line(k):
    for l in k.split('\n'):
        l=l.strip()
        if not l or l.startswith(('```','|','>','#')): continue
        l=re.sub(r'^[-*]\s+|^\d+\.\s+','',l).replace('**','')
        l=re.sub(r'^(코드 해설|예제 해설|해설|요점|핵심)\s*[:：]\s*','',l)
        if re.fullmatch(r'[^:：]{0,20}[:：]?',l): continue   # labels like "코드 해설", "예제 해설:"
        m=re.search(r'(.{25,}?(?:요\.|다\.|\.\s))',l+' ')
        l=(m.group(1) if m else l).strip()
        return l if len(l)<=140 else l[:137].rstrip()+'...'
    return ''
def doc_box(kind,text,items):
    """원문 출처 앞에 한 번만 나오는 한글 미리보기. items=[(kind, heading, text, todo, practice_no)]"""
    badge=f' · {KIND[kind]}' if kind in KIND else ''
    md=f'<div class="sum" data-kind="{kind}">\n\n**🧭 먼저 한국어로**{badge}\n\n{text}\n\n'
    if items:
        md+='**이 챕터 구성**\n\n'
        for k,h,t,todo,no in items:
            hh=f'[{h}](#practice-{no})' if no else h
            line=f'- {KICON.get(k,"•")} **{hh}**: '+' '.join(t.split())
            if todo: line+=f' (⌨️ {todo})'
            md+=line+'\n'
        md+='\n'
    return md+'</div>\n'
def norm(h):
    return h.replace('\u2011','-').replace('\u2010','-').strip()
def chunks(path):
    txt=open(path).read()
    lines=txt.split('\n'); title='';src=''; cur=None; res=[]; pre=[]
    infence=False
    for l in lines:
        if re.match(r'^\s*```',l): infence=not infence
        if not infence:
            m=re.match(r'^(#{1,3})\s+(.*)$',l)
            if m and len(m.group(1))==1: title=m.group(2).strip(); continue
            if m:
                cur={'lvl':len(m.group(1)),'h':m.group(2).replace('**','').strip(),'body':[]}; res.append(cur); continue
            if l.startswith('Source: <'): src=l[9:-1]; continue
        (cur['body'] if cur else pre).append(l)
    return title,src,'\n'.join(pre).strip(),res
def build(annpath,outpath):
    ann=open(annpath).read()
    parts=re.split(r'^@@',ann,flags=re.M)
    header=parts[0]; blocks=[]
    for p in parts[1:]:
        first,_,rest=p.partition('\n'); blocks.append((first.strip(),rest))
    m=re.search(r'^#\s+(.*)',header,re.M); wk=re.search(r'Week\s*(\d+)',m.group(1)).group(1) if m else '?'
    out=[header.rstrip()]; toc=[]; sec=0; warn=[]; plan=[]
    k=0
    while k<len(blocks):
        d,rest=blocks[k]
        typ,_,arg=d.partition(' ')
        if typ in SRC:
            path=SRC[typ]+arg.strip(); title,src,pre,chs=chunks(path)
            kor={}; summ={}; k+=1
            while k<len(blocks) and blocks[k][0].startswith(('K ','S ')):
                key=blocks[k][0][2:].strip()
                if blocks[k][0].startswith('S '):
                    m=re.match(r'^(.*?)\s*\|\s*(\w+)\s*$',key)
                    hk,kind=(m.group(1),m.group(2)) if m else (key,'')
                    summ.setdefault(norm(hk),[]).append((kind,blocks[k][1].strip()))
                else:
                    kor.setdefault(norm(key),[]).append(blocks[k][1].strip())
                k+=1
            sec+=1
            label={'NOTE':'📘 코스노트','LEC':'💻 인클래스 예제','LAB':'🧪 Lab','TEST':'📝 샘플 시험'}[typ]
            h=f'{sec}. {label}: {title}'; toc.append(h)
            out.append(f'\n---\n\n## {h}\n')
            # one Korean preview per document: _doc text + every section's short preview, then source, then original
            dk,dtext=summ['_doc'].pop(0) if summ.get('_doc') else ('','')
            items=[]; marks={}
            if pre and summ.get('_pre'):
                kd,t=summ['_pre'].pop(0); todo,t=split_todo(t)
                no=None
                if kd=='type' and todo: plan.append((f'{sec}. {title}',todo)); no=len(plan); marks['_pre']=(no,todo)
                items.append((kd,'시작 부분',t,todo,no))
            parent=''; seen={}
            for ci,c in enumerate(chs):
                if c['lvl']==2: parent=c['h']
                nm=c['h'] if c['lvl']==2 else parent+' › '+c['h']
                key=norm(c['h']); occ=seen.get(key,0); seen[key]=occ+1
                if not summ.get(key):
                    # no @@S: guess the kind from the heading and borrow the first line of the Korean explanation
                    kt=kor.get(key,[]); kt=kt[occ] if occ<len(kt) else ''
                    t=first_line(kt)
                    if t: items.append((auto_kind(typ,c['h'],'\n'.join(c['body'])),nm,t,'',None))
                    continue
                if summ.get(key):
                    kd,t=summ[key].pop(0); todo,t=split_todo(t); no=None
                    if kd=='type': no=len(plan)+1 if todo else None; marks[ci]=(no,todo,'all') if c['h'].startswith(('Step','Starter')) else (no,todo)
                    if no: plan.append((nm,todo))
                    items.append((kd,nm,t,todo,no))
            if dtext or items: out.append(doc_box(dk or (items[0][0] if items else ''),dtext,items))
            out.append(f'> 원문 출처: {src or (ATTR + "  " + os.path.basename(path))}\n')
            if '_intro' in kor: out.append('**🇰🇷 들어가기 전에**\n\n'+kor.pop('_intro')[0]+'\n')
            if pre: out.append(fix_body(pre,f'{CODE} W{wk} {title}',typ,marks.get('_pre'))+'\n')
            if '_pre' in kor: out.append('**🇰🇷 한글 해설**\n\n'+kor.pop('_pre')[0]+'\n')
            parent=''
            for ci,c in enumerate(chs):
                if c['lvl']==2: parent=c['h']
                nm=c['h'] if c['lvl']==2 else parent+' - '+c['h']
                hl='###' if c['lvl']==2 else '####'
                ic={'NOTE':'📘','LEC':'💻','LAB':'🧪','TEST':'📝'}[typ]
                bd=fix_body('\n'.join(c['body']).strip(),f'{CODE} W{wk} {nm}',typ,marks.get(ci))
                mk=marks.get(ci)
                if mk and mk[0] and f'id="practice-{mk[0]}"' not in bd:
                    out.append(f'<div class="pt" id="practice-{mk[0]}"></div>\n')   # table link target when the step has no code
                out.append(f'{hl} {ic} {c["h"]}\n')
                out.append(bd+'\n')
                if kor.get(norm(c['h'])):
                    out.append('**🇰🇷 한글 해설**\n\n'+kor[norm(c['h'])].pop(0)+'\n')
                else: warn.append(f'{arg}: no K for [{c["h"]}]')
            for kk,v in summ.items():
                if v: warn.append(f'{arg}: unused S [{kk}] x{len(v)}')
            for kk,v in kor.items():
                if v: warn.append(f'{arg}: unused K [{kk}] x{len(v)}')
        elif typ=='TEXT':
            out.append('\n---\n\n'+fix_body(rest.strip(),f'{CODE} W{wk} practice','TEXT')+'\n'); 
            for hh in re.findall(r'^## (.*)$',rest,re.M): toc.append(hh)
            k+=1
        else:
            warn.append('bad directive '+d); k+=1
    if plan:
        rows=[f'| {i} | [{w}](#practice-{i}) | {t} |' for i,(w,t) in enumerate(plan,1)]
        planmd='\n**⌨️ 직접 쳐 볼 것 (이 순서대로)**\n\n어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.\n\n| # | 어디 | 무엇을 |\n| --- | --- | --- |\n'+'\n'.join(rows)+'\n\n나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.\n'
        out=[o.replace('{{PRACTICE}}',planmd) for o in out]
    out=[o.replace('{{PRACTICE}}','') for o in out]
    tocmd='\n## 목차\n\n'+'\n'.join(f'- {t}' for t in toc)+'\n'
    body='\n'.join(out)
    body=body.replace('{{TOC}}',tocmd)
    body=body.replace('\u2014','-')
    open(outpath,'w').write(body)
    for w in warn: print('WARN',w)
    print(outpath, len(body))
if __name__=='__main__':
    cdir=sys.argv[1].rstrip('/')
    cfg=json.load(open(os.path.join(cdir,'course.json')))
    CODE=cfg.get('code','COURSE'); RUNNER=cfg.get('runner'); ATTR=cfg.get('source_attribution','')
    for k,v in cfg.get('note_sources',{}).items(): SRC[k]=os.path.join(cdir,v).rstrip('/')+'/'
    only=sys.argv[2:]
    for a in sorted(glob.glob(os.path.join(cdir,'notes-src','*.md'))):
        n=os.path.basename(a)[:-3]
        if only and n not in only: continue
        build(a,os.path.join(cdir,'notes',n+'.md'))
