// 윤해담 작가 홈페이지: 마크다운(.md)과 books.json을 읽어 화면을 만든다
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function getJSON(url) { const r = await fetch(url); return r.json(); }
async function getText(url) { const r = await fetch(url); if (!r.ok) throw new Error(url); return r.text(); }

function coverHTML(b, big) {
  return `<div class="cover" style="--c:${b.color}; --a:${b.accent}">
    <div class="ct">${esc(b.title)}</div><div class="ca">윤해담${big ? " · " + b.year : ""}</div></div>`;
}

/* ---------- 첫 화면 ---------- */
async function initHome() {
  const [about, books] = await Promise.all([getText("content/about.md"), getJSON("content/books.json")]);
  document.querySelector("#about-md").innerHTML = marked.parse(about);

  const f = books.find((b) => b.full) || books[0];
  document.querySelector("#feature").innerHTML = `
    <a href="book.html?id=${f.id}" style="text-decoration:none">${coverHTML(f, true)}</a>
    <div>
      <span class="tag">${esc(f.badge)}</span>
      <h3>${esc(f.title)}</h3>
      <p class="tl">${esc(f.tagline)}</p>
      <p>${esc(f.summary)}</p>
      <p style="margin-top:24px"><a class="btn solid" href="book.html?id=${f.id}">전문 읽기 →</a></p>
    </div>`;

  document.querySelector("#book-list").innerHTML = books.map((b) => `
    <a class="book" href="book.html?id=${b.id}">
      ${coverHTML(b)}
      <div><span class="meta">${b.year} · ${esc(b.badge)}</span><h4>${esc(b.title)}</h4><p>${esc(b.tagline)}</p></div>
    </a>`).join("");
}

/* ---------- 책 읽기 화면 ---------- */
async function initBook() {
  const id = new URLSearchParams(location.search).get("id") || "ai-reading";
  const books = await getJSON("content/books.json");
  const b = books.find((x) => x.id === id) || books[0];
  document.title = `${b.title} · 윤해담`;
  document.querySelector("#book-head").innerHTML = `
    ${coverHTML(b, true)}
    <div><p class="label">${b.year} · ${esc(b.badge)}</p><h1>${esc(b.title)}</h1><p>${esc(b.tagline)}</p></div>`;

  const art = document.querySelector("article.md");
  art.innerHTML = marked.parse(await getText(`books/${b.id}/book.md`));

  // 원고 맨 위의 책 제목·부제·지은이는 위쪽 머리말에 이미 있으니 본문에서 뺀다
  const h1 = art.querySelector("h1");
  if (h1) {
    let n = h1.nextElementSibling;
    while (n && n.tagName !== "H2") { const next = n.nextElementSibling; n.remove(); n = next; }
    h1.remove();
  }

  // 그림: 경로를 책 폴더 기준으로 바꾸고, 바로 아래 기울임 글을 그림 설명으로
  art.querySelectorAll("p > img").forEach((img) => {
    const p = img.parentElement;
    if (!/^(https?:|\/)/.test(img.getAttribute("src"))) img.src = `books/${b.id}/${img.getAttribute("src")}`;
    img.loading = "lazy";
    const fig = document.createElement("figure");
    fig.appendChild(img);
    const em = p.querySelector("em");
    if (em) { const cap = document.createElement("figcaption"); cap.innerHTML = em.innerHTML; fig.appendChild(cap); }
    p.replaceWith(fig);
  });

  // 오른쪽 개요(목차): ## 제목으로 만든다
  const heads = [...art.querySelectorAll("h2")];
  heads.forEach((h, i) => (h.id = "s" + i));
  const toc = document.querySelector(".toc");
  toc.innerHTML = "<p>CONTENTS</p>" + heads.map((h) => `<a href="#${h.id}">${esc(h.textContent)}</a>`).join("");
  toc.addEventListener("click", (e) => { if (e.target.tagName === "A") toc.classList.remove("open"); });
  document.querySelector(".toc-btn").addEventListener("click", () => toc.classList.toggle("open"));

  const links = [...toc.querySelectorAll("a")];
  const bar = document.querySelector(".progress");
  const onScroll = () => {
    let cur = 0;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) cur = i; });
    links.forEach((a, i) => a.classList.toggle("on", i === cur));
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  initSearch(art);
}

/* ---------- 본문 찾기 ---------- */
function initSearch(art) {
  const input = document.querySelector(".search input");
  const cnt = document.querySelector(".search .cnt");
  let marks = [], now = -1;

  function clear() {
    art.querySelectorAll("mark").forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
    art.normalize();
    marks = []; now = -1; cnt.textContent = "";
  }
  function find(q) {
    clear();
    if (!q) return;
    const walker = document.createTreeWalker(art, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const t = node.nodeValue;
      let i = t.indexOf(q);
      if (i < 0) return;
      const frag = document.createDocumentFragment();
      let last = 0;
      while (i >= 0) {
        frag.append(t.slice(last, i));
        const m = document.createElement("mark");
        m.textContent = q;
        frag.append(m); marks.push(m);
        last = i + q.length;
        i = t.indexOf(q, last);
      }
      frag.append(t.slice(last));
      node.replaceWith(frag);
    });
    cnt.textContent = marks.length ? `0/${marks.length}` : "없음";
    if (marks.length) go(0);
  }
  function go(n) {
    if (!marks.length) return;
    if (now >= 0) marks[now].classList.remove("now");
    now = (n + marks.length) % marks.length;
    marks[now].classList.add("now");
    marks[now].scrollIntoView({ block: "center", behavior: "smooth" });
    cnt.textContent = `${now + 1}/${marks.length}`;
  }
  let t;
  input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => find(input.value.trim()), 250); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); go(now + (e.shiftKey ? -1 : 1)); } });
  document.querySelector(".search .prev").addEventListener("click", () => go(now - 1));
  document.querySelector(".search .next").addEventListener("click", () => go(now + 1));
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") { e.preventDefault(); input.focus(); input.select(); }
  });
}
