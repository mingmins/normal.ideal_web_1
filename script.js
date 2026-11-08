/* 수정할 설정: 이미지, PNG 글자 목록, 사진, 실제 폰트 */
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const variants = ["basic", "indigenous", "modern"];
const variantNames = ["Basic structure", "Indigenous culture", "Modern culture"];
const weights = [300, 500, 700];
const categories = {
  lips: {
    name: "Lips", button: "lips.png", width: "83.77%",
    labels: ["Lips", "Mursi", "Lip fillers"],
    firstImages: ["assets/lip-a.png", "assets/mursi-a.png", "assets/fillers-a.png"],
    pngLetters: "", // PNG 세트가 준비되면 "abcdefghijklmnopqrstuvwxyz"
    photos: ["assets/photos/lips-basic.jpg", "assets/photos/lips-indigenous.jpg", "assets/photos/lips-modern.jpg"],
    fontFiles: ["", "", ""]
  },
  tooth: {
    name: "Tooth", button: "toorh.png", width: "100%",
    labels: ["Tooth", "Mentawai", "Veneers"],
    firstImages: ["", "", ""], pngLetters: "",
    photos: ["assets/photos/tooth-basic.jpg", "assets/photos/tooth-indigenous.jpg", "assets/photos/tooth-modern.jpg"], fontFiles: ["", "", ""]
  },
  neck: {
    name: "Neck · Waist Shape", button: "neck.png", width: "85.66%",
    labels: ["Neck · Waist", "Kayan", "Corset"],
    firstImages: ["", "", ""], pngLetters: "",
    photos: ["assets/photos/neck-basic.jpg", "assets/photos/neck-indigenous.jpg", "assets/photos/neck-modern.jpg"], fontFiles: ["", "", ""]
  },
  facial: {
    name: "Facial Contouring", button: "ficial.png", width: "89.43%",
    labels: ["Facial Contouring", "Mangbetu", "Facial contouring"],
    firstImages: ["", "", ""], pngLetters: "",
    photos: ["assets/photos/facial-basic.jpg", "assets/photos/facial-indigenous.jpg", "assets/photos/facial-modern.jpg"], fontFiles: ["", "", ""]
  }
};

let selected = "lips";
let variant = "basic";
let timer;
let fontVersion = 0;
const input = document.querySelector("#type-input");
const preview = document.querySelector("#font-preview");
function syncPreview() { preview.textContent = input.value; }
input.addEventListener("input", syncPreview);
syncPreview();
const photo = document.querySelector("#reference-image");
const fontCache = new Map();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

/* 이미지가 없거나 잘못된 경로이면 깨진 이미지 대신 대체 내용을 유지 */
function setImage(img, src, alt, fallback) {
  img.hidden = true;
  img.alt = alt;
  if (fallback) fallback.hidden = false;
  img.onload = () => {
    img.hidden = false;
    if (fallback) fallback.hidden = true;
  };
  img.onerror = () => {
    img.hidden = true;
    if (fallback) fallback.hidden = false;
  };
  if (src) img.src = src;
  else img.removeAttribute("src");
}

/* 네 개 버튼을 Type과 Fonts 양쪽에 생성 */
document.querySelectorAll(".category-menu").forEach(menu => {
  Object.entries(categories).forEach(([key, data]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = key;
    button.setAttribute("aria-label", data.name);
    button.style.setProperty("--button-width", data.width);
    const img = document.createElement("img");
    img.src = `assets/${data.button}`;
    img.alt = data.name;
    button.append(img);
    button.addEventListener("click", () => {
      selected = key;
      markSelected();
      renderType(key, "a");
      renderFont();
    });
    if (menu.dataset.menu === "type") {
      button.addEventListener("pointerenter", () => startAnimation(key));
      button.addEventListener("pointerleave", stopAnimation);
      button.addEventListener("focus", () => startAnimation(key));
      button.addEventListener("blur", stopAnimation);
    }
    menu.append(button);
  });
});

function markSelected() {
  document.querySelectorAll("[data-category]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.category === selected));
  });
}

function renderType(key, letter) {
  const data = categories[key];
  document.querySelectorAll(".glyph-grid figure").forEach((figure, index) => {
    const fallback = figure.querySelector("span");
    fallback.textContent = letter;
    fallback.style.fontWeight = weights[index];
    const src = data.pngLetters.includes(letter)
      ? `assets/type/${key}/${variants[index]}/${letter}.png`
      : (letter === "a" ? data.firstImages[index] : "");
    setImage(figure.querySelector("img"), src, `${data.labels[index]}: ${letter}`, fallback);
    figure.querySelector("figcaption").textContent = `${variantNames[index]}_${data.labels[index]}`;
  });
}

function startAnimation(key) {
  clearInterval(timer);
  let index = 0;
  renderType(key, "a");
  if (reducedMotion.matches) return;
  timer = setInterval(() => {
    index = (index + 1) % alphabet.length;
    renderType(key, alphabet[index]);
  }, 350); // 숫자를 늘리면 느려짐
}

function stopAnimation() {
  clearInterval(timer);
  renderType(selected, "a");
}

/* 실제 폰트 경로가 비어 있으면 Pretendard 300 / 500 / 700 */
async function renderFont() {
  const version = ++fontVersion;
  const data = categories[selected];
  const index = variants.indexOf(variant);
  const status = document.querySelector("#font-status");
  document.querySelector("#font-name").textContent = `${data.name} — ${variantNames[index]}`;
  document.querySelectorAll("[data-variant]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.variant === variant));
  });
  setImage(photo, data.photos[index], `${data.name} / ${variantNames[index]}`);
  preview.style.fontFamily = '"Pretendard Variable", sans-serif';
  preview.style.fontWeight = weights[index];
  status.textContent = "";
  const file = data.fontFiles[index];
  if (!file) return;
  const family = `NI-${selected}-${variant}`;
  try {
    if (!fontCache.has(file)) {
      const face = new FontFace(family, `url("${file}")`, { weight: "400" });
      fontCache.set(file, face.load().then(loaded => {
        document.fonts.add(loaded);
        return loaded.family;
      }).catch(error => { fontCache.delete(file); throw error; }));
    }
    const loadedFamily = await fontCache.get(file);
    if (version !== fontVersion) return;
    preview.style.fontFamily = `"${loadedFamily}", "Pretendard Variable", sans-serif`;
    preview.style.fontWeight = "400";
  } catch {
    if (version === fontVersion) status.textContent = "폰트를 불러오지 못해 임시 폰트를 표시합니다.";
  }
}

document.querySelectorAll("[data-variant]").forEach(button => {
  button.addEventListener("click", () => {
    variant = button.dataset.variant;
    renderFont(); // 입력한 문장은 그대로 유지
  });
});

const size = document.querySelector("#font-size");
size.addEventListener("input", () => {
  preview.style.fontSize = `${size.value}px`;
  document.querySelector("#size-value").textContent = `${size.value}px`;
});

/* 주소의 #home / #about / #type / #fonts로 화면 전환 */
function showPage() {
  const requested = location.hash.slice(1);
  const page = ["about", "type", "fonts"].includes(requested) ? requested : "home";
  stopAnimation();
  document.body.dataset.page = page;
  document.querySelectorAll(".page").forEach(element => {
    element.hidden = element.id !== `${page}-page`;
  });
  document.querySelectorAll(".navigation a").forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}
document.addEventListener("visibilitychange", () => { if (document.hidden) stopAnimation(); });
reducedMotion.addEventListener("change", stopAnimation);
window.addEventListener("hashchange", showPage);
markSelected();
renderFont();
showPage();
