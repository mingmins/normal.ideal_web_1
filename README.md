# Normal / Ideal 교체용 코드

기존 프로젝트의 index.html, style.css, script.js 내용을 각각 새 파일로 교체하세요.
assets 폴더는 삭제하지 말고 이 압축파일의 assets 내용을 추가하세요.
기존의 main-name.png, normal-ideal.png, title.png, what-defines.png 네 파일은 그대로 필요합니다.
이 압축파일에는 새로 첨부한 일곱 PNG만 들어 있습니다.

## 현재 동작

- Home에서만 스크롤을 막습니다. About은 설명문 아래 60px 여백을 둡니다.
- Type은 네 가지 이미지 버튼을 누르면 항목을 선택합니다.
- Type 버튼을 호버하거나 키보드로 포커스하면 a–z가 220ms 간격으로 순환합니다.
- 호버/포커스를 벗어나면 선택된 항목의 a로 돌아옵니다.
- 운영체제의 동작 줄이기 설정에서는 자동 재생을 멈춥니다.
- 현재 Lips의 a 세 개만 실제 PNG입니다. 아직 없는 글자는 임시 Pretendard입니다.
- Fonts의 아래 입력창은 Noto Sans Mono 14px로 고정합니다. 입력한 문장은 위쪽의 테두리 없는 미리보기에 실시간 표시됩니다.
- 선택한 폰트와 글자 크기는 위쪽 미리보기에만 적용됩니다. 줄바꿈도 유지됩니다.
- 항목과 변형에 따라 왼쪽 JPG도 전환합니다.
- Basic=Light 300 / Indigenous=Medium 500 / Modern=Bold 700.
- 입력 문장과 글자 크기는 전환 시 유지됩니다. 새로고침 후 보존하는 기능은 없습니다.
- 왼쪽 사진은 assets/photos/의 JPG 12개를 사용합니다. 파일을 넣기 전에는 회색 바탕으로 표시됩니다.
- 외부 폰트 CDN이 차단되면 시스템 대체 글꼴이 표시됩니다.
- 화면의 Modern 오타는 수정했습니다. 첨부한 ficial.png 이미지 자체의 Ficial 문구는 그대로입니다.

## Type에 PNG 추가

script.js의 categories 설정에서 해당 항목의 pngLetters를 수정합니다.

```js
pngLetters: "abcdefghijklmnopqrstuvwxyz",
```

경로 규칙: assets/type/항목/변형/글자.png

- 항목: lips, tooth, neck, facial
- 변형: basic, indigenous, modern
- 글자: a.png, b.png, ... z.png

예: assets/type/lips/basic/b.png
예: assets/type/tooth/indigenous/z.png
부분 완성 상태라면 pngLetters: "abc"처럼 준비된 글자만 적으세요.
목록에 적은 글자는 세 변형 폴더 모두에 PNG를 넣어야 합니다.
PNG는 동일한 아트보드 크기와 기준선을 사용하면 전환할 때 흔들리지 않습니다.
pngLetters에 없는 a는 firstImages의 경로를 사용합니다.

## 왼쪽 사진 교체

각 항목의 photos 배열 순서는 Basic / Indigenous / Modern입니다.

```js
photos: [
  "assets/photos/lips-basic.jpg",
  "assets/photos/lips-indigenous.jpg",
  "assets/photos/lips-modern.jpg"
],
```

모든 파일은 assets/photos/ 폴더에 넣으세요. 파일명은 아래와 같습니다.

| 항목 | Basic | Indigenous | Modern |
| --- | --- | --- | --- |
| Lips | lips-basic.jpg | lips-indigenous.jpg | lips-modern.jpg |
| Tooth | tooth-basic.jpg | tooth-indigenous.jpg | tooth-modern.jpg |
| Neck · Waist | neck-basic.jpg | neck-indigenous.jpg | neck-modern.jpg |
| Facial | facial-basic.jpg | facial-indigenous.jpg | facial-modern.jpg |

소문자 이름과 .jpg 확장자를 정확히 맞추고 추가 후 브라우저를 새로고침하세요.
사진 전체가 보이게 object-fit: contain을 사용했습니다.
회색 박스를 꽉 채우려면 .reference-photo img의 object-fit을 cover로 바꾸세요. 일부가 잘릴 수 있습니다.

## Glyphs 폰트 연결

Glyphs의 파일 > 내보내기(Command+E)에서 WOFF2로 내보내세요.
버전별 화면 구성은 다를 수 있으며 내보내기 대상 스타일이 활성화되어 있어야 합니다.
공식 안내: https://handbook.glyphsapp.com/export/
각 변형을 독립적인 WOFF2 파일로 내보내어 fonts 폴더에 넣으세요.
.glyphs 작업 파일과 PNG는 타이핑용 웹폰트 파일이 아닙니다.

script.js에서 해당 항목의 fontFiles만 수정하세요.

```js
fontFiles: [
  "fonts/lips-basic.woff2",
  "fonts/lips-indigenous.woff2",
  "fonts/lips-modern.woff2"
]
```

JavaScript의 FontFace로 연결하므로 별도의 @font-face 코드를 추가할 필요가 없습니다.
빈 문자열이면 Pretendard를 사용하고, 실제 폰트가 로드되면 400으로 표시해 원래 획을 유지합니다.
기본형이 모든 항목에서 같다면 같은 basic.woff2 경로를 재사용하세요.
소문자만 제작했다면 소문자로 시험하세요. 없는 대문자/한글 등은 대체 폰트로 표시될 수 있습니다.
최종 폰트는 로컬 HTTP 서버 또는 웹 호스팅에서 확인하세요. file://에서의 로딩은 브라우저 제약을 받을 수 있습니다.

## 확인 범위

JavaScript 문법, HTML 연결 및 화면 전환/버튼/크기 조절 상태를 점검했습니다.
이 환경에서는 실제 브라우저 시각 검증을 진행하지 못했습니다.
