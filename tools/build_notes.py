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
import re, sys, os, json, glob, urllib.parse as up
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
def snack(code,name):
    d=deps_for(code)
    plat='web'
    if re.search(r'react-native-maps|react-native-gesture-handler|Alert\.alert|PanResponder|Animated',code): plat='ios'
    q={'name':name[:60],'platform':plat,'sdkVersion':'54.0.0','code':code}
    if d: q['dependencies']=','.join(f"{p}@{VER.get(p,'*')}" for p in d)
    return 'https://snack.expo.dev/?'+up.urlencode(q,quote_via=up.quote)
def fix_body(text,name,kind):
    out=[];lines=text.split('\n');i=0
    while i<len(lines):
        l=lines[i]
        if l.strip() in BOILER: i+=1; continue
        m=re.match(r'^(\s*)```(\w*)\s*$',l)
        if m:
            lang=m.group(2); j=i+1
            while j<len(lines) and not re.match(r'^\s*```\s*$',lines[j]): j+=1
            code='\n'.join(lines[i+1:j])
            if not lang: lang='json' if code.lstrip().startswith('{') and '"dependencies"' in code else 'jsx'
            out.append(m.group(1)+'```'+lang); out+=lines[i+1:j]; out.append(m.group(1)+'```')
            if RUNNER!='snack': pass
            elif 'export default' in code and 'react-native' in code and re.search(r'''from\s+['"](@/|\.\.?/|expo-router)''',code):
                out.append(''); out.append('▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.')
            elif 'export default' in code and 'react-native' in code:
                out.append(''); out.append(f'▶ **[Snack에서 바로 실행하기]({snack(code.strip()+chr(10),name)})** (SDK 54, 필요한 패키지 자동 포함)')
            elif re.search(r'createRoot|function MyApp|<div|<button',code) and 'react-native' not in code and lang in('jsx','js'):
                out.append(''); out.append(f'▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿]({CSB})에 붙여넣어 실행하세요.')
            i=j+1; continue
        out.append(l); i+=1
    return '\n'.join(out)
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
    out=[header.rstrip()]; toc=[]; sec=0; warn=[]
    k=0
    while k<len(blocks):
        d,rest=blocks[k]
        typ,_,arg=d.partition(' ')
        if typ in SRC:
            path=SRC[typ]+arg.strip(); title,src,pre,chs=chunks(path)
            kor={}; k+=1
            while k<len(blocks) and blocks[k][0].startswith('K '):
                kor.setdefault(norm(blocks[k][0][2:].strip()),[]).append(blocks[k][1].strip()); k+=1
            sec+=1
            label={'NOTE':'📘 코스노트','LEC':'💻 인클래스 예제','LAB':'🧪 Lab','TEST':'📝 샘플 시험'}[typ]
            h=f'{sec}. {label}: {title}'; toc.append(h)
            out.append(f'\n---\n\n## {h}\n')
            out.append(f'> 원문 출처: {src or (ATTR + "  " + os.path.basename(path))}\n')
            if '_intro' in kor: out.append('**🇰🇷 들어가기 전에**\n\n'+kor.pop('_intro')[0]+'\n')
            if pre: out.append(fix_body(pre,f'{CODE} W{wk} {title}',typ)+'\n')
            if '_pre' in kor: out.append('**🇰🇷 한글 해설**\n\n'+kor.pop('_pre')[0]+'\n')
            parent=''
            for c in chs:
                if c['lvl']==2: parent=c['h']
                nm=c['h'] if c['lvl']==2 else parent+' - '+c['h']
                hl='###' if c['lvl']==2 else '####'
                ic={'NOTE':'📘','LEC':'💻','LAB':'🧪','TEST':'📝'}[typ]
                out.append(f'{hl} {ic} {c["h"]}\n')
                out.append(fix_body('\n'.join(c['body']).strip(),f'{CODE} W{wk} {nm}',typ)+'\n')
                if kor.get(norm(c['h'])):
                    out.append('**🇰🇷 한글 해설**\n\n'+kor[norm(c['h'])].pop(0)+'\n')
                else: warn.append(f'{arg}: no K for [{c["h"]}]')
            for kk,v in kor.items():
                if v: warn.append(f'{arg}: unused K [{kk}] x{len(v)}')
        elif typ=='TEXT':
            out.append('\n---\n\n'+fix_body(rest.strip(),f'{CODE} W{wk} practice','TEXT')+'\n'); 
            for hh in re.findall(r'^## (.*)$',rest,re.M): toc.append(hh)
            k+=1
        else:
            warn.append('bad directive '+d); k+=1
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
