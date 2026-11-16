# Jay's Lectures

사용자가 강의하는 모든 강의 자료를 모아 두는 저장소. 강의마다 폴더 하나.
GitHub Pages(`main` 브랜치, `/ (root)`)로 호스팅한다.

- 사이트: https://jay-nuclear-phd.github.io/jays-lectures/
- 빌드 도구 없음. 순수 HTML/CSS/JS이며 푸시하면 1~2분 뒤 반영된다.
- 사용자와의 대화와 화면 문구는 한국어로 한다.
- 커밋과 푸시는 사용자가 요청할 때만 한다.

## 폴더 구조

```
index.html        랜딩 페이지(강의 카드 목록). 새 강의를 만들면 여기에 카드를 추가한다
dream_juice/      드림주스 주식스터디. 원래 별도 저장소(jay-nuclear-phd/dream_juice)에서 옮겨 옴. 자세한 규칙은 dream_juice/CLAUDE.md
ai_basics/        AI 문맹탈출을 위한 기본 도구 익히기
  index.html      강의 목록 허브
  assets/         deck.js, deck.css (드림주스 엔진 복사본 + 아래쪽에 파란 테마와 추가 컴포넌트)
  lecture1/       1강 터미널과 IDE
  lecture2/       2강 마크다운과 옵시디언
  lecture3/       3강 깃허브
  lecture4/       4강 실습: 작가 홈페이지 만들기
    example-site/ 실습 결과물인 가상 작가 '윤해담'의 홈페이지 (실제로 동작하는 사이트)
```

- 각 강의 허브의 "← 전체 강의" 링크는 `../index.html`(랜딩)로 간다.
- 슬라이드 엔진 사용법과 HTML 규칙은 `dream_juice/CLAUDE.md`와 같다.

## ai_basics 메모

- 수강생은 AI와 개발을 전혀 모르는 사람들이다. 쉬운 말과 생활 속 비유를 쓴다.
- `assets/deck.css` 아래쪽 "AI 문맹탈출 테마"가 드림주스 색을 덮어쓴다.
  - 변수 이름은 그대로 두고 값만 바꿨다. `--red`는 주 강조색(남색), `--blue`는 보조 강조색(청록), `--warn`은 경고 빨강이다.
- 추가 컴포넌트: `.term`(터미널 창), `.win`(앱 창), `.code`, `.md-pair`/`.md-view`(마크다운 원문↔보이는 모습), `.pins`/`.legend`(이미지 위 번호 표시), `.eras`(연표), `.chat`(말풍선), `.vs`, `.chip`, `.filelist`, `.credit`(이미지 출처)
- 드림주스 `.row` 규칙이 문장 안 `<b>`를 블록으로 만들고 `.num` 글자를 가린다. 테마 쪽 보정 규칙이 있으니 지우지 않는다.
- 이미지는 Wikimedia Commons의 자유 라이선스 파일이나 공식 사이트 화면 캡처다.
  - 이미지마다 `.credit`으로 출처를 달고, 강의 마지막 "이미지 출처" 슬라이드에도 적는다.
  - CC BY / CC BY-SA 이미지는 출처 표기가 필수다.
- 4강 `example-site/`는 강의 슬라이드와 별개인 독립 사이트다.
  - `content/about.md`, `content/books.json`, `books/<id>/book.md`를 읽어 화면을 그린다. 마크다운 변환은 CDN의 marked를 쓴다.
  - 책 읽기 화면(`book.html?id=`)의 오른쪽 목차는 원고의 `##` 제목으로 만든다. 그림 바로 아래 `*기울임*` 줄은 그림 설명이 된다.
  - 슬라이드의 완성 화면(`lecture4/img/site-*.jpg`)은 이 사이트를 캡처한 것이다. 사이트를 고치면 캡처도 다시 찍는다.
  - 윤해담과 책들은 가상이다. 사이트와 슬라이드에 그 사실을 밝혀 둔다.
- 이미지를 같은 이름으로 바꿔 넣으면 브라우저 캐시 때문에 예전 그림이 보일 수 있다. 파일 이름을 바꾼다.

## 확인 방법

- 로컬 서버: `python3 -m http.server 8766` → `http://localhost:8766/`
- Playwright로 확인할 것:
  - 1280×720에서 모든 슬라이드에 넘침이 없는지, 깨진 이미지가 없는지
  - 390px 폭(휴대폰) 화면
- 스크린샷은 `.playwright-mcp/`에 저장하고(gitignore에 들어 있다), 다 쓰면 지운다.
