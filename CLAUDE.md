# study-hub 작업 가이드 (Claude용)

수업별 공부 사이트. `courses/<id>/` 하나가 수업 하나이고, `tools/build_site.py`가 GitHub Pages 사이트로 만든다.
사용자(Paul)는 한국어로 대화하고, **대화와 문서 어디에도 em dash(U+2014 긴 대시)를 쓰지 않는다.** 빌더가 노트 안의 em dash를 `-`로 바꾸지만 처음부터 쓰지 말 것.

## 폴더 규칙

```
courses/<id>/
  course.json            수업 정보, 주차 목록, 시험 범위 (courses/_template/course.example.json 참고)
  materials/             원본 자료 (영어 원문, md)
    lectures/            강의자료 (강의 노트, 슬라이드 변환본)
    in-class/            인클래스 수업자료 (라이브 코딩, 예제 코드)
    labs/                Labs 또는 Workshops
    projects/            과제, 프로젝트 안내
    sample-tests/        샘플 시험 문제
    course-notes/        (있으면) 코스노트 사이트 변환본
  notes-src/week-XX.md   해설노트 주석 파일 (사람이 쓰는 원본)
  notes/week-XX.md       빌드된 해설노트 (tools/build_notes.py 출력, 직접 고치지 말 것)
  toy-project/weekNN/    주차별 토이 프로젝트 코드
  exam-prep/quiz.json    퀴즈 문항
  exam-prep/mock-exams/  모의시험 md (문제, 정답 파일 분리)
```

새 수업: `python3 tools/new_course.py <id> <CODE> "<한글 이름>"` 후 materials 채우기.

## 0단계. 강의 파악

1. 자료를 `materials/` 하위 폴더에 md로 넣는다. PDF, PPT, HTML은 markitdown 등으로 변환하고, 파일 첫 줄에 `Source: <원본 URL>`을 둔다.
2. 주차별로 어떤 자료가 어느 주차에 속하는지 표로 정리하고 `course.json`의 `weeks`(n, title, topics, notes, toy)와 `exams`(시험 이름, 범위 주차)를 채운다.
3. 시험 형식(객관식, 서술, 코딩 비율과 배점)을 샘플 시험이나 사용자에게서 확인해 둔다. 3단계에서 그대로 따라 한다.

## 1단계. 강의해설노트 (`notes-src` -> `notes`)

원칙
- **영어 원문은 요약하지 않고 그대로**, 바로 아래에 **🇰🇷 한글 해설**. 고등학생에게 설명하는 튜터 말투.
- 인클래스 예제와 랩을 해당 개념 옆에 붙인다. 코드는 실행 링크(React Native면 Snack)와 코드 해설을 함께.
- 랩은 정답 코드를 쓰지 말고 힌트, 참고할 예제 위치, "내 말로 설명해 보기"만.
- 주차 맨 앞에 "0. 이번 주 한눈에 보기"(핵심 표, 함정 모음), 맨 끝에 "✅ 시험 대비 체크리스트"와 "✍️ 손으로 써 보기" 연습 코드.

주석 파일 문법 (`tools/build_notes.py`)
```
# Week 5. 제목
> 읽는 법 안내
## 0. 이번 주 한눈에 보기
...
{{TOC}}
@@NOTE E-Lists/working-with-lists.md    (note_sources.NOTE 기준 경로)
@@K _pre                                 원문 첫 제목 앞 본문에 붙일 해설
@@K FlatList                             원문 "## FlatList" 또는 "### FlatList" 아래에 붙일 해설
@@LEC week-05.1-notes.md                 인클래스 강의
@@K _intro                               이 원문을 읽기 전에 보여 줄 안내
@@LAB lab-5.md
@@S FlatList | read                      원문 "FlatList" 제목 바로 아래, 원문보다 먼저 보일 짧은 한글 미리보기
@@S _doc | type                          원문 전체 앞 미리보기 (_pre: 첫 제목 앞 본문용)
@@TEXT                                   자유 마크다운 (체크리스트, 연습 코드)
```
- 챕터(원문 파일 하나) 순서: 🧭 한글 미리보기 상자 한 번(`_doc` 글 + 각 제목의 `@@S` 글을 "이 챕터 구성" 목록으로 합침) → 원문 출처 → 영어 원문 → ▶ Snack 링크 → 🇰🇷 한글 해설(`@@K`). 미리보기를 제목마다 따로 두지 않는다 (Paul 요청).
- `@@S`의 종류: `type`(Snack에서 직접 쳐 보기), `read`(읽고 이해만), `lab`(혼자 풀기), `skim`(가볍게 훑기). 화면에서 색으로 구분된다.
- 원문 파일마다 `@@S _doc`은 꼭 쓴다. 제목별 `@@S`가 없으면 빌더가 종류를 제목으로 추측하고(Step, Starter는 type, Finished와 Why는 read 등) 그 제목 `@@K`의 첫 문장을 미리보기 목록에 쓴다. 직접 쳐 볼 코드(인클래스 Example, Starter, Step)는 `할 일:`이 있는 `@@S`를 직접 쓴다. 같은 제목이 여러 번이면 모든 번째에 쓴다.
- 주차 머리말의 `{{PRACTICE}}`는 `{{TOC}}` 바로 앞에 둔다. 직접 쳐 볼 것이 없으면 빈칸이 된다.
- `type`이 아닌 실행 가능한 RN 코드 옆에는 "👀 여기서 결과 보기" 버튼이 자동으로 붙어 페이지 안에 Snack이 열린다(`assets/snack.js`, Expo embed).
- `type` 제목의 코드 블록 위에는 "⌨️ 이 코드는 Snack에서 직접 쳐 보세요"가 자동으로 붙는다 (첫 코드와 export default가 있는 전체 코드만).
- `type` 미리보기 첫 줄을 `할 일: ...`로 쓰면, 주석 파일의 `{{PRACTICE}}` 자리에 "Snack에서 직접 쳐 볼 것" 순서표가 생기고 각 줄이 그 코드(`#practice-N`)로 링크된다.
- 원문의 모든 h2, h3 제목마다 `@@K`가 있어야 한다. 빌드 시 `WARN no K for [...]`가 나오면 채운다. 같은 제목이 여러 번이면 `@@K`도 같은 순서로 여러 번.
- 빌드: `python3 tools/build_notes.py courses/<id> [week-05]`
- `course.json`의 `runner: "snack"`이면 `export default` + `react-native` 코드에 Snack 링크가 자동으로 붙는다. Snack `App.js`는 interface와 `: 타입`은 되지만 `값 as 타입`, `f<T>()` 제네릭 호출은 파싱 에러가 난다.

## 2단계. 토이 프로젝트

- 수업 전체를 관통하는 **앱 하나**를 정하고, 주차마다 그 주 개념 하나를 더한다 (week01 -> weekNN).
- `toy-project/weekNN/`에 그 주 완성 코드. 앞 주차 코드를 복사해서 시작하고, 바뀐 파일만 설명한다.
- 실행 방법이 한 파일이면 실행 링크 JSON(`snack_links`, 키 "01"...)을 만들고, 로컬 프로젝트면 README에 명령어.
- 가이드 페이지(HTML)를 만들면 `toy_project.guide`에 경로를 적는다. 사이트가 복사해서 링크한다.
- 실제로 실행되는지 확인한다 (번들, 타입 검사, 브라우저 미리보기).

## 3단계. 퀴즈 · 시험 대비

`exam-prep/quiz.json` 문항 형식
```json
{ "week": 5, "topic": "FlatList", "level": 2,
  "q": "영어 문제", "code": "선택: 코드 조각",
  "opts": ["정답", "오답", "오답", "오답"],
  "ex": "한글 해설: 왜 정답이고 오답은 왜 틀렸는지",
  "refs": [{ "label": "Week 5.1 Notes · Example: FlatList", "href": "원문 링크" }] }
```
- `opts[0]`이 항상 정답. 화면에서 섞는다.
- `level`: 1 기본(정의, 용어), 2 응용(코드 읽고 결과 예측, 버그 찾기), 3 시험 심화(두 개념 결합, 함정, 실제 시험보다 어렵게).
- **시험 모드는 level 2, 3을 먼저 뽑는다.** 주차마다 최소 level 2 이상이 절반 넘게 되도록 만든다.
- 오답 보기는 학생들이 실제로 하는 실수(구조분해 누락, 상태 직접 변경, cleanup 누락 등)로 만든다.
- 문제는 시험처럼 영어로, 해설은 한국어로. 근거가 되는 원문 위치를 refs에 넣는다.
- 모의시험: 실제 시험 형식(배점, 시간)을 그대로 따라 `mock-exams/<name>.md`와 `<name>-answers.md`로 나누고 `course.json`의 `mock_exams`에 등록. 코딩 문항은 starter 코드와 채점 기준(Part별 배점)을 함께.

## 빌드와 배포

```
pip install -r requirements.txt
python3 tools/build_notes.py courses/<id>     # 해설노트
python3 tools/build_site.py docs              # docs/ 생성, python3 -m http.server -d docs 로 확인
```
GitHub Pages는 **main 브랜치의 `docs/` 폴더**를 그대로 배포한다. 내용을 바꾸면 반드시 `build_site.py docs`를 다시 돌리고 `docs/`까지 같이 커밋한다. (이 환경의 GitHub 토큰은 workflow 파일을 push할 권한이 없어서 Actions 대신 docs 폴더 방식을 쓴다.)

## 올리면 안 되는 것

레포는 **Public**이다. 채점된 시험지, 점수, 학번, 개인 진단 자료, API 키는 커밋하지 않는다. 그런 자료는 프로젝트 공유 폴더(`/mnt/project-files/<CODE>/`)에만 둔다.

## 배포가 멈췄을 때
Pages 배포(`pages build and deployment`)가 실패하거나 Queued에서 오래 멈추면 같은 실행을 다시 돌려도 소용없을 수 있다. 내용이 담긴 새 커밋을 main에 올려 새 배포를 만든다.
