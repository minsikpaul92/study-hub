# study-hub

수업별 공부 사이트: https://minsikpaul92.github.io/study-hub/

- **강의 해설노트**: 영어 강의자료 원문 그대로, 아래에 한글 해설. 코드는 바로 실행할 수 있는 링크와 함께.
- **토이 프로젝트**: 주차마다 그 주 개념을 하나씩 더해 완성하는 앱.
- **퀴즈와 모의시험**: 주차를 골라 푸는 연습 모드, 어려운 문제부터 시간 제한으로 푸는 시험 모드, 오답노트.
- **공부 타이머**: 모든 페이지 오른쪽 아래. 15분 공부, 5분 휴식 반복 (설정에서 시간 변경).

## 수업

| 수업 | 내용 |
| --- | --- |
| [WEB530](courses/web530) | React Native 모바일 앱 개발 · Week 1~8 해설노트, Campus Spots 토이 프로젝트, Week 5~7 퀴즈 |

## 새 수업 추가

```
python3 tools/new_course.py abc123 ABC123 "한글 수업 이름"
```
`courses/abc123/materials/` 아래 `lectures`, `in-class`, `labs`, `projects`에 자료를 넣고 Claude에게 "이 수업도 같은 방식으로 만들어 줘"라고 하면 [CLAUDE.md](CLAUDE.md)의 순서(강의 파악, 해설노트, 토이 프로젝트, 퀴즈와 시험 대비)대로 진행해요.

## 사이트 다시 만들기

사이트는 main 브랜치의 `docs/` 폴더에서 배포돼요. 노트나 퀴즈를 바꾸면 아래 명령으로 `docs/`를 다시 만들어 같이 커밋해요.

```
pip install -r requirements.txt
python3 tools/build_site.py docs
python3 -m http.server -d docs 8000
```

원본 자료의 저작권은 각 수업의 저작자에게 있어요. 해설과 정리는 개인 학습용이에요.
