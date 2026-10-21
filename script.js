// ---- Configurações ----
const WHATSAPP = "5571993021728"; // DDI + DDD + número, só dígitos

const LITOCODE_WHATSAPP = "5571999991778"; // WhatsApp da litocode (crédito no rodapé)
document.getElementById("creditLink").href = `https://wa.me/${LITOCODE_WHATSAPP}`;

// Fotos reais das seções de galeria (personalizadas, murais, estampas): coloque os arquivos numa pasta
// (ex.: murais/) e liste aqui. Sem fotos, aparecem blocos de cor no lugar.
const fotos = {
  // "murais": ["murais/1.jpg", "murais/2.jpg", "murais/3.jpg"],
};

// Hero: para imagem, troque a div .hero-media por <img class="hero-media" src="hero.jpg" alt="">
// Para vídeo: <video class="hero-media" src="hero.mp4" autoplay muted loop playsinline></video>

// Textos e dados da página "Ver mais" (colecao.html?c=...). tipo "loja" = produtos com carrinho; "galeria" = fotos + WhatsApp.
const categorias = {
  "fine-art": {
    tipo: "loja", eyebrow: "obras originais", titulo: "Aquarelas Fine Art",
    texto: "Aquarelas autorais, únicas e assinadas, em papel de algodão. Adicione ao carrinho e finalize a compra pelo WhatsApp com a Carola."
  },
  "personalizadas": {
    tipo: "galeria", eyebrow: "sob medida", titulo: "Aquarelas Personalizadas",
    texto: "Uma aquarela criada especialmente para você — um retrato, um lugar, uma lembrança ou um presente. Cada traço carrega uma intenção única.",
    cta: "Encomendar", wa: "Olá, Carola! Quero encomendar uma aquarela personalizada.",
    cores: ["#b07a6e", "#c9a882", "#8a9a86", "#e3d2c0"], total: 9
  },
  "prints": {
    tipo: "loja", eyebrow: "arquivo digital", titulo: "Prints",
    texto: "Compre o arquivo em alta resolução e imprima onde e no tamanho que preferir. O arquivo é enviado depois da confirmação do pagamento."
  },
  "tecido": {
    tipo: "loja", eyebrow: "arte para vestir", titulo: "Arte no Tecido",
    texto: "Cangas, lenços e pareôs com as aquarelas da Carola estampadas, para usar e levar a arte com você."
  },
  "murais": {
    tipo: "galeria", eyebrow: "projetos", titulo: "Murais",
    texto: "Pintura em paredes para casas, lojas, restaurantes e espaços de convivência. Cada mural é pensado para o lugar e para quem vai viver nele.",
    cta: "Pedir orçamento", wa: "Olá, Carola! Quero um orçamento para um mural.",
    cores: ["#8a9a86", "#c9a882", "#b07a6e", "#7d9a8c"], total: 9
  },
  "estampas": {
    tipo: "galeria", eyebrow: "design de superfície", titulo: "Estampas",
    texto: "Estampas autorais criadas a partir das aquarelas, para moda, decoração, papelaria e outros produtos.",
    cta: "Falar sobre estampas", wa: "Olá, Carola! Tenho interesse nas estampas.",
    cores: ["#d9c4b2", "#7d9a8c", "#b07a6e", "#c9a882", "#5d6b7a"], total: 12
  },
};

const $ = (id) => document.getElementById(id);
const brl = (n) => "R$ " + n.toLocaleString("pt-BR");
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const txt = (t) => t.replace(/\n/g, " "); // títulos podem ter quebra de linha (\n); em texto corrido viram espaço

// ---- Galerias da página inicial ----
document.querySelectorAll(".gallery, .grid-gallery[data-count]").forEach((g) => {
  const section = g.closest("section").id;
  const urls = fotos[section] || [];
  const colors = (g.dataset.colors || "").split(",");
  const count = urls.length || Number(g.dataset.count);
  if (g.dataset.w) g.style.setProperty("--w", g.dataset.w + "vw");
  if (g.dataset.h) g.style.setProperty("--h", g.dataset.h + "px");
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
const burger = $("burger");
const menu = $("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

// ---- WhatsApp ----
const bindWhatsApp = (root) => root.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = "_blank";
  a.rel = "noopener";
});
bindWhatsApp(document);

// ---- Animação de entrada ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); setTimeout(() => { e.target.style.transitionDelay = ""; }, 1200); } });
}, { threshold: 0.12 });
const observeReveals = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));

// ---- Loja e carrinho ----
// Substitua pelas obras reais. image: caminho da foto (ex.: "obras/obra-1.jpg"); vazio = bloco de cor.
// cat: "fine-art" | "prints" | "tecido". Os ids não podem se repetir.
// A página inicial mostra só os 3 primeiros de cada categoria; "Ver mais" mostra todos.
const obras = [
  { id: 31, cat: "fine-art", titulo: "Cajueiro", tecnica: "Aquarela", cor: "#8a9a86", image: "AQUARELAS/cajueiro.jpg" },
  { id: 34, cat: "fine-art", titulo: "Carpa Dourada", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/carpa-dourada.jpg", extras: ["AQUARELAS/carpa-dourada-mockup.jpg"] },
  { id: 35, cat: "fine-art", titulo: "Das profundezas\npra Luz", tecnica: "Aquarela", cor: "#5d6b7a", image: "AQUARELAS/das-profundezas-pra-luz.jpg" },
  { id: 32, cat: "fine-art", titulo: "A onda dela", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/a-onda-dela.jpg" },
  { id: 33, cat: "fine-art", titulo: "Caribbean Blue", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/caribbean-blue.jpg" },
  { id: 36, cat: "fine-art", titulo: "Meninas do Mar", tecnica: "Aquarela", cor: "#b07a6e", image: "AQUARELAS/meninas-do-mar.jpg" },
  { id: 37, cat: "fine-art", titulo: "Onça Pintada", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/onca-pintada.jpg" },
  { id: 38, cat: "fine-art", titulo: "Peixe papagaio", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/peixe-papagaio.png", extras: ["AQUARELAS/peixe-papagaio-mockup.jpg"] },
  { id: 39, cat: "fine-art", titulo: "Peixe-voador", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/peixe-voador.jpg" },
  { id: 40, cat: "fine-art", titulo: "Verão Nórdico", tecnica: "Aquarela", cor: "#d9c4b2", image: "AQUARELAS/verao-nordico.jpg" },
  { id: 41, cat: "fine-art", titulo: "Água-viva", tecnica: "Aquarela", cor: "#5d6b7a", image: "AQUARELAS/agua-viva.jpg" },
  { id: 42, cat: "fine-art", titulo: "Xangô",                   tecnica: "Aquarela", cor: "#9c6244", image: "AQUARELAS/xango.jpeg" },
  { id: 43, cat: "fine-art", titulo: "Ibejis",                   tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/ibejis.jpeg", extras: ["AQUARELAS/ibejis-mockup.jpg"] },
  { id: 11, cat: "prints", titulo: "Print I", tecnica: "Arquivo digital", cor: "#b07a6e", image: "" },
  { id: 12, cat: "prints", titulo: "Print II", tecnica: "Arquivo digital", cor: "#9c6244", image: "" },
  { id: 13, cat: "prints", titulo: "Print III", tecnica: "Arquivo digital", cor: "#5d6b7a", image: "" },
  { id: 14, cat: "prints", titulo: "Print IV", tecnica: "Arquivo digital", cor: "#c9a882", image: "" },
  { id: 15, cat: "prints", titulo: "Print V", tecnica: "Arquivo digital", cor: "#7d9a8c", image: "" },
  { id: 16, cat: "prints", titulo: "Print VI", tecnica: "Arquivo digital", cor: "#d9c4b2", image: "" },
  { id: 21, cat: "tecido", titulo: "Canga", tecnica: "Canga", medidas: "00 × 00 cm", preco: 180, cor: "#8a9a86", image: "" },
  { id: 22, cat: "tecido", titulo: "Lenço", tecnica: "Lenço de seda", medidas: "00 × 00 cm", preco: 220, cor: "#e3d2c0", image: "" },
  { id: 23, cat: "tecido", titulo: "Pareô", tecnica: "Pareô", medidas: "00 × 00 cm", preco: 160, cor: "#b07a6e", image: "" },
  { id: 24, cat: "tecido", titulo: "Canga II", tecnica: "Canga", medidas: "00 × 00 cm", preco: 180, cor: "#c9a882", image: "" },
  { id: 25, cat: "tecido", titulo: "Lenço II", tecnica: "Lenço de seda", medidas: "00 × 00 cm", preco: 220, cor: "#7d9a8c", image: "" },
  { id: 26, cat: "tecido", titulo: "Pareô II", tecnica: "Pareô", medidas: "00 × 00 cm", preco: 160, cor: "#5d6b7a", image: "" },
];


// Tamanhos e preços: fine-art e prints são vendidos em A5, A4, A3 e A2 (o cliente escolhe no cartão da obra).
// Os preços valem para a categoria inteira; para uma obra diferente, adicione  precos: { A5: 0, A4: 0, A3: 0, A2: 0 }  nela.
// Itens sem tamanho (tecido) usam o campo preco.
const TAMANHOS = { A5: "14,8 × 21 cm", A4: "21 × 29,7 cm", A3: "29,7 × 42 cm", A2: "42 × 59,4 cm" };
const PRECOS = {
  "fine-art": { A5: 210, A4: 300, A3: 500, A2: 700 },
  "prints": { A5: 30, A4: 45, A3: 70, A2: 110 },
};
const tabela = (o) => o.precos || PRECOS[o.cat] || null;
const precoDe = (o, size) => (tabela(o) ? tabela(o)[size] : o.preco);
const detalhe = (o, size) => `${o.tecnica} · ${tabela(o) ? TAMANHOS[size] : o.medidas}`;
const porId = (id) => obras.find((o) => o.id === id);

const sel = {}; // tamanho escolhido em cada obra (padrão A4)
const tamanhoDe = (o) => (tabela(o) ? sel[o.id] || "A4" : "");

let cart = []; // [{ id, size }]
try { cart = (JSON.parse(localStorage.getItem("carola-cart-v2")) || []).filter((c) => porId(c.id)); } catch (e) { }

const media = (o, cls) => o.image
  ? `<img class="${cls}" src="${esc(o.image)}" alt="${esc(txt(o.titulo))}" loading="lazy">`
  : `<div class="${cls} ph" style="--c1:${o.cor};--c2:${o.cor}"></div>`;

// Obras com `extras` (outras fotos, como o mockup) ganham um carrossel: deslizar para o lado ou usar as setas.
function slider(o) {
  const fotos = [o.image, ...o.extras];
  const imgs = fotos.map((src, i) => `<img class="product-img" src="${esc(src)}" alt="${esc(txt(o.titulo))}${i ? " — mockup" : ""}" loading="lazy">`).join("");
  return `<div class="slider"><div class="slides">${imgs}</div>
    <button type="button" class="slide-btn prev" data-slide="-1" aria-label="Foto anterior">‹</button>
    <button type="button" class="slide-btn next" data-slide="1" aria-label="Próxima foto">›</button>
    <div class="dots">${fotos.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("")}</div></div>`;
}
document.addEventListener("scroll", (e) => {
  if (!e.target.classList || !e.target.classList.contains("slides")) return;
  const i = Math.round(e.target.scrollLeft / e.target.clientWidth);
  e.target.parentElement.querySelectorAll(".dots span").forEach((d, n) => d.classList.toggle("on", n === i));
}, true);

function renderShop() {
  document.querySelectorAll(".shop").forEach((shop) => {
    if (!shop.dataset.cat) return;
    const limit = Number(shop.dataset.limit) || Infinity;
    shop.innerHTML = obras.filter((o) => o.cat === shop.dataset.cat).slice(0, limit).map((o) => {
      const size = tamanhoDe(o);
      const added = cart.some((c) => c.id === o.id && c.size === size);
      const sizes = tabela(o)
        ? `<div class="sizes" role="group" aria-label="Tamanho">${Object.keys(TAMANHOS).map((s) =>
          `<button type="button" class="size${s === size ? " on" : ""}" data-size="${s}" data-for="${o.id}" title="${TAMANHOS[s]}" aria-pressed="${s === size}">${s}</button>`).join("")}</div>`
        : "";
      return `<article class="product reveal in">
        ${o.extras ? slider(o) : media(o, "product-img")}
        <div class="product-info">
          <div class="product-row"><h3>${esc(o.titulo).replace(/\n/g, "<br>")}</h3><span class="product-price">${brl(precoDe(o, size))}</span></div>
          <p class="product-tech">${esc(detalhe(o, size))}</p>
          ${sizes}
          <button type="button" class="pill ${added ? "pill-line" : "pill-dark"} product-btn" data-add="${o.id}" ${added ? "disabled" : ""}>${added ? "No carrinho" : "Adicionar ao carrinho"}</button>
        </div></article>`;
    }).join("");
  });
}

const totalDoCarrinho = () => cart.reduce((s, c) => s + precoDe(porId(c.id), c.size), 0);
const nomeDoItem = (c) => txt(porId(c.id).titulo) + (c.size ? ` (${c.size})` : "");

function renderCart() {
  $("cartCount").textContent = cart.length;
  $("cartCount").hidden = !cart.length;
  $("cartEmpty").hidden = cart.length > 0;
  $("cartFoot").hidden = !cart.length;
  $("cartItems").innerHTML = cart.map((c, i) => {
    const o = porId(c.id); return `<li>
    ${media(o, "drawer-thumb")}
    <div><strong>${esc(nomeDoItem(c))}</strong><span>${esc(detalhe(o, c.size))}</span><span>${brl(precoDe(o, c.size))}</span></div>
    <button type="button" data-remove="${i}" aria-label="Remover ${esc(txt(o.titulo))}">×</button></li>`;
  }).join("");
  $("cartTotal").textContent = brl(totalDoCarrinho());
  try { localStorage.setItem("carola-cart-v2", JSON.stringify(cart)); } catch (e) { }
  renderShop();
}

function setDrawer(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", !open);
  $("drawerOverlay").hidden = !open;
  document.body.classList.toggle("no-scroll", open);
}

// Os cliques são tratados no documento, porque a lista de produtos é redesenhada a cada mudança.
document.addEventListener("click", (e) => {
  const d = e.target.dataset;
  if (d.slide) {
    const slides = e.target.parentElement.querySelector(".slides");
    slides.scrollBy({ left: Number(d.slide) * slides.clientWidth, behavior: "smooth" });
    return;
  }
  if (d.size) { sel[Number(d.for)] = d.size; renderShop(); return; }
  const id = Number(d.add);
  if (!id) return;
  const o = porId(id), size = tamanhoDe(o);
  if (!cart.some((c) => c.id === id && c.size === size)) { cart.push({ id, size }); renderCart(); setDrawer(true); }
});
$("cartItems").addEventListener("click", (e) => {
  if (e.target.dataset.remove === undefined) return;
  cart.splice(Number(e.target.dataset.remove), 1);
  renderCart();
});
$("cartOpen").addEventListener("click", () => setDrawer(true));
$("cartClose").addEventListener("click", () => setDrawer(false));
$("drawerOverlay").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

$("checkout").addEventListener("click", () => {
  if (!cart.length) return;
  const msg = `Olá, Carola! Quero comprar:\n${cart.map((c) => `• ${nomeDoItem(c)} — ${brl(precoDe(porId(c.id), c.size))}`).join("\n")}\nTotal: ${brl(totalDoCarrinho())}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

// ---- Página "Ver mais" (colecao.html) ----
if ($("colecao")) {
  const key = new URLSearchParams(location.search).get("c");
  const cat = categorias[key];
  if (!cat) { location.replace("index.html"); }
  else {
    document.title = `${cat.titulo} — Carola Hoisel`;
    $("colEyebrow").textContent = cat.eyebrow;
    $("colTitle").textContent = cat.titulo;
    $("colText").textContent = cat.texto;
    $("colBack").href = `index.html#${key}`;
    if (cat.tipo === "loja") {
      $("colShop").hidden = false;
      $("colShop").dataset.cat = key;
    } else {
      const urls = fotos[key] || [];
      const grid = $("colGrid");
      grid.hidden = false;
      for (let i = 0; i < (urls.length || cat.total); i++) {
        const el = urls.length ? document.createElement("img") : document.createElement("div");
        el.className = "ph reveal";
        if (urls.length) { el.src = urls[i]; el.alt = ""; el.loading = "lazy"; }
        else { const c = cat.cores[i % cat.cores.length]; el.style.setProperty("--c1", c); el.style.setProperty("--c2", c); }
        grid.appendChild(el);
      }
      $("colCta").hidden = false;
      $("colCta").innerHTML = `<a class="pill pill-dark" data-wa="${esc(cat.wa)}">${esc(cat.cta)}</a>`;
      bindWhatsApp($("colCta"));
    }
  }
}


// ---- Ampliar imagem (clique na foto mostra a imagem inteira) ----
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `<button type="button" class="lightbox-close" aria-label="Fechar">×</button><img alt=""><p class="lightbox-cap"></p>`;
document.body.appendChild(lightbox);
const closeLightbox = () => { lightbox.hidden = true; document.body.classList.remove("no-scroll"); };
document.addEventListener("click", (e) => {
  const img = e.target.closest("img.product-img, .gallery img, .grid-gallery img");
  if (img) {
    lightbox.querySelector("img").src = img.currentSrc || img.src;
    lightbox.querySelector("img").alt = img.alt;
    lightbox.querySelector(".lightbox-cap").textContent = img.alt;
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  } else if (lightbox.contains(e.target) && e.target.tagName !== "IMG") closeLightbox();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
renderCart();
observeReveals();

$("year").textContent = new Date().getFullYear();

// ---- Dificulta salvar ou copiar imagens (botão direito e arrastar) ----
document.addEventListener("contextmenu", (e) => { if (e.target.closest("img")) e.preventDefault(); });
document.addEventListener("dragstart", (e) => { if (e.target.closest("img")) e.preventDefault(); });
