"""새 수업 폴더 만들기: python3 tools/new_course.py abc123 "ABC123" "한글 수업 이름"
courses/_template 을 복사하고 course.json 의 code, title_ko 를 채운다."""
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cid, code = sys.argv[1].lower(), sys.argv[2]
title_ko = sys.argv[3] if len(sys.argv) > 3 else ""
dst = os.path.join(ROOT, "courses", cid)
if os.path.exists(dst):
    sys.exit(f"이미 있어요: {dst}")
shutil.copytree(os.path.join(ROOT, "courses", "_template"), dst)
src = os.path.join(dst, "course.example.json")
cfg = json.load(open(src, encoding="utf-8"))
cfg.update(code=code, title_ko=title_ko, weeks=[], mock_exams=[], exams=[])
json.dump(cfg, open(os.path.join(dst, "course.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
os.remove(src)
print("만들었어요:", dst)
