// ---- Configurações ----
const WHATSAPP = "5571993021728"; // DDI + DDD + número, só dígitos

const LITOCODE_WHATSAPP = "5571999991778"; // WhatsApp da litocode (crédito no rodapé)
document.getElementById("creditLink").href = `https://wa.me/${LITOCODE_WHATSAPP}`;

// Fotos reais: coloque os arquivos em pastas (ex.: obras/, sob-medida/) e liste aqui.
// Se uma seção não tiver fotos, aparecem blocos de cor no lugar.
const fotos = {
  // "obras": ["obras/1.jpg", "obras/2.jpg", "obras/3.jpg"],
};

// Hero: para imagem, troque a div .hero-media por <img class="hero-media" src="hero.jpg" alt="">
// Para vídeo: <video class="hero-media" src="hero.mp4" autoplay muted loop playsinline></video>

// ---- Galerias ----
document.querySelectorAll(".gallery").forEach((g) => {
  const section = g.closest("section").id;
  const urls = fotos[section] || [];
  const colors = (g.dataset.colors || "").split(",");
  const count = urls.length || Number(g.dataset.count);
  g.style.setProperty("--w", g.dataset.w + "vw");
  g.style.setProperty("--h", g.dataset.h + "px");
  for (let i = 0; i < count; i++) {
    const el = urls.length ? document.createElement("img") : document.createElement("div");
    el.className = "ph reveal";
    el.style.transitionDelay = i * 80 + "ms";
    if (urls.length) { el.src = urls[i]; el.alt = ""; el.loading = "lazy"; }
    else { const c = colors[i % colors.length]; el.style.setProperty("--c1", c); el.style.setProperty("--c2", c); }
    g.appendChild(el);
  }
});

// ---- Menu ----
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

// ---- WhatsApp ----
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

// ---- Animação de entrada ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---- Loja e carrinho ----
// Substitua pelas obras reais. image: caminho da foto (ex.: "obras/obra-1.jpg"); vazio = bloco de cor.
const obras = [
  { id: 1, titulo: "Obra I",   tecnica: "Acrílica",      medidas: "00 × 00 cm", preco: 1900, cor: "#c9a882", image: "" },
  { id: 2, titulo: "Obra II",  tecnica: "Óleo",          medidas: "00 × 00 cm", preco: 3400, cor: "#7d9a8c", image: "" },
  { id: 3, titulo: "Obra III", tecnica: "Aquarela",      medidas: "00 × 00 cm", preco: 850,  cor: "#d9c4b2", image: "" },
  { id: 4, titulo: "Obra IV",  tecnica: "Óleo",          medidas: "00 × 00 cm", preco: 4200, cor: "#b07a6e", image: "" },
  { id: 5, titulo: "Obra V",   tecnica: "Técnica mista", medidas: "00 × 00 cm", preco: 2300, cor: "#9c6244", image: "" },
  { id: 6, titulo: "Obra VI",  tecnica: "Acrílica",      medidas: "00 × 00 cm", preco: 1200, cor: "#5d6b7a", image: "" },
];
const brl = (n) => "R$ " + n.toLocaleString("pt-BR");
const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let cart = [];
try { cart = (JSON.parse(localStorage.getItem("carola-cart")) || []).filter((id) => obras.some((o) => o.id === id)); } catch (e) {}

const media = (o, cls) => o.image
  ? `<img class="${cls}" src="${esc(o.image)}" alt="${esc(o.titulo)}" loading="lazy">`
  : `<div class="${cls} ph" style="--c1:${o.cor};--c2:${o.cor}"></div>`;

function renderShop() {
  $("shop").innerHTML = obras.map((o) => {
    const added = cart.includes(o.id);
    return `<article class="product reveal in">
      ${media(o, "product-img")}
      <div class="product-info">
        <div class="product-row"><h3>${esc(o.titulo)}</h3><span class="product-price">${brl(o.preco)}</span></div>
        <p class="product-tech">${esc(o.tecnica)} · ${esc(o.medidas)}</p>
        <button type="button" class="pill ${added ? "pill-line" : "pill-dark"} product-btn" data-add="${o.id}" ${added ? "disabled" : ""}>${added ? "No carrinho" : "Adicionar ao carrinho"}</button>
      </div></article>`;
  }).join("");
}

function renderCart() {
  const items = cart.map((id) => obras.find((o) => o.id === id));
  $("cartCount").textContent = items.length;
  $("cartCount").hidden = !items.length;
  $("cartEmpty").hidden = items.length > 0;
  $("cartFoot").hidden = !items.length;
  $("cartItems").innerHTML = items.map((o) => `<li>
    ${media(o, "drawer-thumb")}
    <div><strong>${esc(o.titulo)}</strong><span>${esc(o.tecnica)} · ${esc(o.medidas)}</span><span>${brl(o.preco)}</span></div>
    <button type="button" data-remove="${o.id}" aria-label="Remover ${esc(o.titulo)}">×</button></li>`).join("");
  $("cartTotal").textContent = brl(items.reduce((s, o) => s + o.preco, 0));
  try { localStorage.setItem("carola-cart", JSON.stringify(cart)); } catch (e) {}
  renderShop();
}

function setDrawer(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", !open);
  $("drawerOverlay").hidden = !open;
  document.body.classList.toggle("no-scroll", open);
}

$("shop").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.add);
  if (id && !cart.includes(id)) { cart.push(id); renderCart(); setDrawer(true); }
});
$("cartItems").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.remove);
  if (id) { cart = cart.filter((c) => c !== id); renderCart(); }
});
$("cartOpen").addEventListener("click", () => setDrawer(true));
$("cartClose").addEventListener("click", () => setDrawer(false));
$("drawerOverlay").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

$("checkout").addEventListener("click", () => {
  const items = cart.map((id) => obras.find((o) => o.id === id));
  if (!items.length) return;
  const total = items.reduce((s, o) => s + o.preco, 0);
  const msg = `Olá, Carola! Quero comprar:\n${items.map((o) => `• ${o.titulo} (${brl(o.preco)})`).join("\n")}\nTotal: ${brl(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

renderCart();

document.getElementById("year").textContent = new Date().getFullYear();
