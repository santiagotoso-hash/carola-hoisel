// ---- Configurações ----
const WHATSAPP = "5571993021728"; // DDI + DDD + número, só dígitos

const LITOCODE_WHATSAPP = "5571999991778"; // WhatsApp da litocode (crédito no rodapé)
document.getElementById("creditLink").href = `https://wa.me/${LITOCODE_WHATSAPP}`;

// Fotos reais das seções de galeria (personalizadas, murais, estampas): coloque os arquivos numa pasta
// (ex.: murais/) e liste aqui. Sem fotos, aparecem blocos de cor no lugar.
const fotos = {
  "personalizadas": ["AQUARELAS-PERSONALIZADAS/1.jpeg?v=2", "AQUARELAS-PERSONALIZADAS/2.jpeg?v=2", "AQUARELAS-PERSONALIZADAS/3-sevilha.jpg?v=2"],
  "estampas": ["ESTAMPAS-WEB/iemanja.jpg", "ESTAMPAS-WEB/maragogipinho.jpg", "ESTAMPAS-WEB/cordel.jpg?v=2"],
  // "murais": ["murais/1.jpg", "murais/2.jpg", "murais/3.jpg"],
};

// Carrosséis: quadrados de uma seção com várias fotos que deslizam (setas, dedo ou mouse). A posição na lista é o
// número do quadrado (0 = primeiro). Cada item é o caminho de uma foto ou { video, poster } para um vídeo.
const carrosseis = {
  // Estampas: os três quadrados são carrosséis (Iemanjá, Maragogipinho e Cordel).
  "estampas": [
    { alt: "Estampa Iemanjá", itens: ["ESTAMPAS-WEB/iemanja.jpg", "ESTAMPAS-WEB/estampa1.jpg"] },
    { alt: "Estampa Maragogipinho", itens: ["ESTAMPAS-WEB/maragogipinho.jpg", "ESTAMPAS-WEB/maragogipinho2.jpg"] },
    { alt: "Estampa Cordel", itens: ["ESTAMPAS-WEB/cordel.jpg?v=2", "ESTAMPAS-WEB/cordel2.jpg"] },
  ],
  "murais": [
    { alt: "Mural", itens: ["MURAIS-WEB/mural-2.jpg", "MURAIS-WEB/mural-0.jpg", "MURAIS-WEB/mural-1.jpg", "MURAIS-WEB/mural-3.jpg", { video: "MURAIS-WEB/mural-video-2.mp4", poster: "MURAIS-WEB/mural-video-2-poster.jpg" }] },
    { alt: "Mural", itens: ["MURAIS-WEB/mural-4.jpg", "MURAIS-WEB/mural-5.jpg", { video: "MURAIS-WEB/mural-video-1.mp4", poster: "MURAIS-WEB/mural-video-1-poster.jpg" }] },
    { alt: "Mural", itens: ["MURAIS-WEB/mural-6.jpg", "MURAIS-WEB/mural-7.jpg", "MURAIS-WEB/mural-8.jpg", { video: "MURAIS-WEB/mural-video-3.mp4", poster: "MURAIS-WEB/mural-video-3-poster.jpg" }] },
  ],
};

// Parte da foto que fica visível na miniatura (as miniaturas cortam a foto). Padrão: centro.
// Valores: "left", "right", "top", "bottom", "center" ou percentuais como "20% 50%".
const focos = {
  "AQUARELAS-PERSONALIZADAS/3-sevilha.jpg?v=2": "left center",
};

// Hero: para imagem, troque a div .hero-media por <img class="hero-media" src="hero.jpg" alt="">
// Para vídeo: <video class="hero-media" src="hero.mp4" autoplay muted loop playsinline></video>

// Textos e dados da página "Ver mais" (colecao.html?c=...). tipo "loja" = produtos com carrinho; "galeria" = fotos + WhatsApp.
const categorias = {
  "fine-art": {
    tipo: "loja", eyebrow: "obras originais", titulo: "Aquarelas Fine Art",
    texto: "Qualidade de galeria ao seu alcance: impressao em papel 100% algodão, pigmentos que resistem ao tempo e a textura viva da aquarela.\nNão inclui moldura."
  },
  "personalizadas": {
    tipo: "galeria", eyebrow: "sob medida", titulo: "Aquarelas Personalizadas",
    texto: "Veja o passo a passo de como ter a aquarela dos seus sonhos.",
    cta: "Quero um orçamento", href: "orcamento.html",
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
    const c = (carrosseis[section] || [])[i];
    if (c) {
      const caixa = document.createElement("div");
      caixa.innerHTML = sliderHtml(c.itens, (n) => c.alt + (n ? " — foto " + (n + 1) : ""));
      const car = caixa.firstElementChild;
      car.classList.add("reveal");
      g.appendChild(car);
      continue;
    }
    const el = urls.length ? document.createElement("img") : document.createElement("div");
    el.className = "ph reveal";
    el.style.transitionDelay = i * 80 + "ms";
    if (urls.length) { el.src = urls[i]; el.alt = ""; el.loading = "lazy"; if (focos[urls[i]]) el.style.objectPosition = focos[urls[i]]; }
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
  { id: 31, cat: "fine-art", titulo: "Cajueiro", tecnica: "Aquarela", cor: "#8a9a86", image: "AQUARELAS/cajueiro.jpg?v=2" },
  { id: 34, cat: "fine-art", titulo: "Carpa Dourada", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/carpa-dourada.jpg?v=2", extras: ["AQUARELAS/carpa-dourada-mockup.jpg?v=2"] },
  { id: 35, cat: "fine-art", titulo: "Das profundezas\npra Luz", tecnica: "Aquarela", cor: "#5d6b7a", image: "AQUARELAS/das-profundezas-pra-luz.jpg?v=2" },
  { id: 32, cat: "fine-art", titulo: "A onda dela", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/a-onda-dela.jpg?v=2" },
  { id: 33, cat: "fine-art", titulo: "Caribbean Blue", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/caribbean-blue.jpg?v=2" },
  { id: 36, cat: "fine-art", titulo: "Meninas do Mar", tecnica: "Aquarela", cor: "#b07a6e", image: "AQUARELAS/meninas-do-mar.jpg?v=2" },
  { id: 37, cat: "fine-art", titulo: "Onça Pintada", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/onca-pintada.jpg?v=2" },
  { id: 38, cat: "fine-art", titulo: "Peixe papagaio", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/peixe-papagaio.png?v=2", extras: ["AQUARELAS/peixe-papagaio-mockup.jpg?v=2"] },
  { id: 39, cat: "fine-art", titulo: "Peixe-voador", tecnica: "Aquarela", cor: "#7d9a8c", image: "AQUARELAS/peixe-voador.jpg?v=2" },
  { id: 40, cat: "fine-art", titulo: "Verão Nórdico", tecnica: "Aquarela", cor: "#d9c4b2", image: "AQUARELAS/verao-nordico.jpg?v=2" },
  { id: 41, cat: "fine-art", titulo: "Água-viva", tecnica: "Aquarela", cor: "#5d6b7a", image: "AQUARELAS/agua-viva.jpg?v=2" },
  { id: 42, cat: "fine-art", titulo: "Xangô", tecnica: "Aquarela", cor: "#9c6244", image: "AQUARELAS/xango.jpg?v=2" },
  { id: 43, cat: "fine-art", titulo: "Ibejis", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/ibejis.jpeg?v=2", extras: ["AQUARELAS/ibejis-mockup.jpg?v=2"] },
  { id: 11, cat: "prints", titulo: "Coração do Brasil", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/coracao-do-brasil.jpg?v=2" },
  { id: 12, cat: "prints", titulo: "Polvo Azul", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/polvo-azul.jpg?v=2" },
  { id: 13, cat: "prints", titulo: "Bahia Resistência", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/bahia-resistencia.jpg?v=2" },
  { id: 14, cat: "prints", titulo: "Bananeira", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/bananeira.jpg?v=2" },
  { id: 15, cat: "prints", titulo: "Banana Rosa", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/banana-rosa-agrupada.jpg?v=2" },
  { id: 16, cat: "prints", titulo: "Bomfim", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/bomfim.jpg?v=2" },
  { id: 17, cat: "prints", titulo: "Café para Despertar", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/cafe-para-despertar.jpg?v=2" },
  { id: 18, cat: "prints", titulo: "Eagle Ray", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/eagle-ray.jpg?v=2" },
  { id: 19, cat: "prints", titulo: "Jubarte", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/jubarte.jpg?v=2" },
  { id: 20, cat: "prints", titulo: "Jubarte (fundo amarelo)", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/jubarte-fundo-amarelo.jpg?v=2" },
  { id: 21, cat: "prints", titulo: "Márcio Freire", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/marcio-freire.jpg?v=3" },
  { id: 22, cat: "prints", titulo: "Mermaid", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/parede-agrupada.jpg?v=2" },
  { id: 23, cat: "prints", titulo: "Solitude", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/solitude.jpg?v=2" },
  { id: 24, cat: "prints", titulo: "Sup Yoga", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/sup-yoga.jpg?v=2" },
  { id: 25, cat: "prints", titulo: "Surf Sunset Whale", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/surf-sunset-whale.jpg?v=2" },
  { id: 26, cat: "prints", titulo: "Surfgirl", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/surfgirl.jpg?v=2" },
  { id: 27, cat: "prints", titulo: "Axé", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 100, cor: "#d9c4b2", image: "PRINTS-WEB/axe.jpg?v=1" },
  { id: 21, cat: "tecido", titulo: "Canga", tecnica: "Canga", medidas: "00 × 00 cm", preco: 180, cor: "#8a9a86", image: "" },
  { id: 22, cat: "tecido", titulo: "Lenço", tecnica: "Lenço de seda", medidas: "00 × 00 cm", preco: 220, cor: "#e3d2c0", image: "" },
  { id: 23, cat: "tecido", titulo: "Pareô", tecnica: "Pareô", medidas: "00 × 00 cm", preco: 160, cor: "#b07a6e", image: "" },
  { id: 24, cat: "tecido", titulo: "Canga II", tecnica: "Canga", medidas: "00 × 00 cm", preco: 180, cor: "#c9a882", image: "" },
  { id: 25, cat: "tecido", titulo: "Lenço II", tecnica: "Lenço de seda", medidas: "00 × 00 cm", preco: 220, cor: "#7d9a8c", image: "" },
  { id: 26, cat: "tecido", titulo: "Pareô II", tecnica: "Pareô", medidas: "00 × 00 cm", preco: 160, cor: "#5d6b7a", image: "" },
];


// Tamanhos e preços: só a fine-art é vendida em A5, A4, A3 e A2 (o cliente escolhe no cartão da obra).
// Os preços valem para a categoria inteira; para uma obra diferente, adicione  precos: { A5: 0, A4: 0, A3: 0, A2: 0 }  nela.
// Itens sem tamanho (prints e tecido) usam o campo preco. Prints são arquivos digitais: sem tamanho e sem frete.
const TAMANHOS = { A5: "14,8 × 21 cm", A4: "21 × 29,7 cm", A3: "29,7 × 42 cm", A2: "42 × 59,4 cm" };
const PRECOS = {
  "fine-art": { A5: 210, A4: 300, A3: 500, A2: 700 },
};
const tabela = (o) => o.precos || PRECOS[o.cat] || null;
const precoDe = (o, size) => (tabela(o) ? tabela(o)[size] : o.preco);
const detalhe = (o, size) => [o.tecnica, tabela(o) ? TAMANHOS[size] : o.medidas].filter(Boolean).join(" · ");
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
  return sliderHtml([o.image, ...o.extras], (i) => txt(o.titulo) + (i ? " — mockup" : ""));
}
function sliderHtml(fotos, altDe) {
  const imgs = fotos.map((src, i) => typeof src === "string"
    ? `<img class="product-img" src="${esc(src)}" alt="${esc(altDe(i))}" loading="lazy">`
    : `<video class="product-img" src="${esc(src.video)}" poster="${esc(src.poster || "")}" aria-label="${esc(altDe(i))}" muted loop playsinline preload="metadata" disablepictureinpicture controlslist="nodownload"></video>`).join("");
  return `<div class="slider"><div class="slides">${imgs}</div>
    <button type="button" class="slide-btn prev" data-slide="-1" aria-label="Foto anterior">‹</button>
    <button type="button" class="slide-btn next" data-slide="1" aria-label="Próxima foto">›</button>
    <div class="dots">${fotos.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("")}</div></div>`;
}
document.addEventListener("scroll", (e) => {
  if (!e.target.classList || !e.target.classList.contains("slides")) return;
  const i = Math.round(e.target.scrollLeft / e.target.clientWidth);
  e.target.parentElement.querySelectorAll(".dots span").forEach((d, n) => d.classList.toggle("on", n === i));
  [...e.target.children].forEach((el, n) => { if (el.tagName === "VIDEO") { if (n === i) el.play().catch(() => {}); else el.pause(); } });
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

const subtotalDoCarrinho = () => cart.reduce((s, c) => s + precoDe(porId(c.id), c.size), 0);

// ---- Frete (estimativa por região, a partir da Bahia) ----
// Valores de teste. PAC: base = frete do 1º item, adicional = cada item físico a mais. SEDEX = PAC × SEDEX_FATOR, com prazo menor.
// Prints são arquivos digitais e não pagam frete.
// Para frete exato dos Correios é preciso um serviço com chave de acesso (ex.: Melhor Envio), que exige um servidor.
const SEDEX_FATOR = 1.7;
const FRETE = {
  BA: { nome: "Bahia", base: 18, adicional: 8, pac: "3 a 5 dias úteis", sedex: "1 a 2 dias úteis" },
  NE: { nome: "Nordeste", base: 28, adicional: 10, pac: "5 a 8 dias úteis", sedex: "2 a 3 dias úteis" },
  SE: { nome: "Sudeste", base: 38, adicional: 12, pac: "6 a 9 dias úteis", sedex: "2 a 4 dias úteis" },
  CO: { nome: "Centro-Oeste", base: 42, adicional: 12, pac: "7 a 10 dias úteis", sedex: "3 a 5 dias úteis" },
  S: { nome: "Sul", base: 45, adicional: 14, pac: "7 a 10 dias úteis", sedex: "3 a 5 dias úteis" },
  N: { nome: "Norte", base: 55, adicional: 16, pac: "10 a 15 dias úteis", sedex: "4 a 7 dias úteis" },
};
const SERVICOS = { pac: "PAC", sedex: "SEDEX" };
const REGIAO = {};
[["N", "AC AP AM PA RO RR TO"], ["NE", "AL CE MA PB PE PI RN SE"], ["CO", "DF GO MT MS"], ["SE", "ES MG RJ SP"], ["S", "PR RS SC"]]
  .forEach(([r, ufs]) => ufs.split(" ").forEach((uf) => { REGIAO[uf] = r; }));
REGIAO.BA = "BA";

let destino = null; // { cep, cidade, uf }
try { destino = JSON.parse(localStorage.getItem("carola-destino")); } catch (e) { }
let servico = "pac";
try { if (SERVICOS[localStorage.getItem("carola-servico")]) servico = localStorage.getItem("carola-servico"); } catch (e) { }

const temPrints = () => cart.some((c) => porId(c.id).cat === "prints");
let emailCliente = "";
try { emailCliente = localStorage.getItem("carola-email") || ""; } catch (e) {}
const emailValido = (v) => /^[^ @]+@[^ @]+[.][^ @]{2,}$/.test(v.trim());

const itensFisicos = () => cart.filter((c) => porId(c.id).cat !== "prints").length;
const freteValor = (tipo) => {
  const f = FRETE[REGIAO[destino.uf]];
  const pac = f.base + (itensFisicos() - 1) * f.adicional;
  return tipo === "sedex" ? Math.round(pac * SEDEX_FATOR) : pac;
};
const freteDoCarrinho = () => {
  if (!itensFisicos()) return 0;
  if (!destino) return null; // ainda não calculado
  return freteValor(servico);
};

function mostrarFrete() {
  const msg = $("freteMsg");
  const opcoes = $("freteOpcoes");
  $("freteBox").hidden = !itensFisicos();
  if (!itensFisicos() || !destino) { msg.textContent = ""; opcoes.innerHTML = ""; return; }
  const f = FRETE[REGIAO[destino.uf]];
  msg.textContent = `Entrega para ${destino.cidade} - ${destino.uf}`;
  opcoes.innerHTML = Object.keys(SERVICOS).map((s) => `<label class="opcao${s === servico ? " on" : ""}">
    <input type="radio" name="servico" value="${s}" ${s === servico ? "checked" : ""}>
    <span><strong>${SERVICOS[s]}</strong> · ${f[s]}</span><span>${brl(freteValor(s))}</span></label>`).join("");
}

async function calcularFrete() {
  const cep = $("cep").value.replace(/\D/g, "");
  const msg = $("freteMsg");
  if (cep.length !== 8) { msg.textContent = "Digite um CEP com 8 números."; return; }
  msg.textContent = "Calculando…";
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (d.erro || !REGIAO[d.uf]) { msg.textContent = "CEP não encontrado. Confira os números."; return; }
    destino = { cep, cidade: d.localidade, uf: d.uf };
    try { localStorage.setItem("carola-destino", JSON.stringify(destino)); } catch (e) { }
    renderCart();
  } catch (e) {
    msg.textContent = "Não foi possível consultar o CEP agora. Tente de novo ou combine o frete pelo WhatsApp.";
  }
}

// Total = subtotal + frete (quando já calculado)
const totalDoCarrinho = () => subtotalDoCarrinho() + (freteDoCarrinho() || 0);
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
  const frete = freteDoCarrinho();
  $("cartSub").textContent = brl(subtotalDoCarrinho());
  $("cartFrete").textContent = frete === null ? "informe o CEP" : frete === 0 ? "sem frete (arquivo digital)" : brl(frete);
  $("cartTotal").textContent = brl(totalDoCarrinho());
  mostrarFrete();
  $("emailBox").hidden = !temPrints();
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

const freteLinha = () => {
  const f = freteDoCarrinho();
  if (f === 0) return "";
  if (f === null) return "\nFrete: a combinar (CEP não informado)";
  return `\nFrete ${SERVICOS[servico]}: ${brl(f)} (CEP ${destino.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}, ${destino.cidade} - ${destino.uf})`;
};

$("cep").addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 8);
  e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
});
$("cep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcularFrete(); });
$("cepBtn").addEventListener("click", calcularFrete);
$("freteOpcoes").addEventListener("change", (e) => {
  if (!SERVICOS[e.target.value]) return;
  servico = e.target.value;
  try { localStorage.setItem("carola-servico", servico); } catch (err) { }
  renderCart();
});
if (destino) $("cep").value = destino.cep.replace(/(\d{5})(\d{3})/, "$1-$2");

// ---- Pagamento por Pix (QR Code e "copia e cola") ----
// Preencha a chave Pix da Carola (CPF/CNPJ só com números, e-mail, telefone no formato +5571999999999 ou chave aleatória).
// Enquanto a chave estiver vazia, "Finalizar" continua enviando o pedido pelo WhatsApp.
const PIX = {
  chave: "97464031504", // CPF
  nome: "Carola Hoisel",    // nome do recebedor (até 25 letras)
  cidade: "Praia do Forte", // cidade do recebedor (até 15 letras)
};

const semAcento = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
const emv = (id, valor) => id + String(valor.length).padStart(2, "0") + valor;
function crc16(texto) { // CRC-16/CCITT-FALSE, exigido pelo padrão do Pix
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function pixPayload(valor, txid) {
  const conta = emv("00", "br.gov.bcb.pix") + emv("01", PIX.chave.trim());
  const base = emv("00", "01") + emv("26", conta) + emv("52", "0000") + emv("53", "986") + emv("54", valor.toFixed(2)) +
    emv("58", "BR") + emv("59", semAcento(PIX.nome).slice(0, 25)) + emv("60", semAcento(PIX.cidade).slice(0, 15)) +
    emv("62", emv("05", txid)) + "6304";
  return base + crc16(base);
}

function resumoDoPedido(pedido) {
  return `Olá, Carola! Pedido ${pedido}:\n${cart.map((c) => `• ${nomeDoItem(c)} — ${brl(precoDe(porId(c.id), c.size))}`).join("\n")}\nSubtotal: ${brl(subtotalDoCarrinho())}${freteLinha()}${temPrints() ? `\nE-mail para receber o arquivo: ${emailCliente.trim()}` : ""}\nTotal: ${brl(totalDoCarrinho())}`;
}
const linkWhats = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

function abrirPagamento() {
  const pedido = "CH" + Date.now().toString(36).toUpperCase();
  const total = totalDoCarrinho();
  const codigo = pixPayload(total, pedido);
  const qr = qrcode(0, "M");
  qr.addData(codigo);
  qr.make();
  $("pagQr").innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
  $("pagTotal").textContent = brl(total);
  $("pagPedido").textContent = pedido;
  $("pagCodigo").value = codigo;
  $("pagEmail").hidden = !temPrints();
  $("pagEmail").textContent = `O arquivo dos prints será enviado para ${emailCliente.trim()} depois da confirmação do pagamento.`;
  $("pagWhats").href = linkWhats(resumoDoPedido(pedido) + "\n\nPagamento feito por Pix. Segue o comprovante:");
  $("drawer").classList.add("pagando");
  $("pagamento").hidden = false;
  $("drawer").scrollTop = 0;
}
function fecharPagamento() {
  $("drawer").classList.remove("pagando");
  $("pagamento").hidden = true;
}

$("checkout").addEventListener("click", () => {
  if (!cart.length) return;
  if (itensFisicos() && !destino) {
    $("freteMsg").textContent = "Informe o CEP e escolha PAC ou SEDEX para continuar.";
    $("cep").focus();
    return;
  }
  if (temPrints() && !emailValido(emailCliente)) {
    $("emailMsg").textContent = "Digite um e-mail válido para receber o arquivo.";
    $("emailCliente").focus();
    return;
  }
  if (!PIX.chave.trim()) { window.open(linkWhats(resumoDoPedido("novo")), "_blank", "noopener"); return; }
  abrirPagamento();
});
$("emailCliente").value = emailCliente;
$("emailCliente").addEventListener("input", (e) => {
  emailCliente = e.target.value;
  $("emailMsg").textContent = "";
  try { localStorage.setItem("carola-email", emailCliente); } catch (err) {}
});
$("pagVoltar").addEventListener("click", fecharPagamento);
$("pagCopiar").addEventListener("click", async () => {
  const btn = $("pagCopiar");
  try { await navigator.clipboard.writeText($("pagCodigo").value); }
  catch (e) { $("pagCodigo").select(); document.execCommand("copy"); }
  btn.textContent = "Código copiado!";
  setTimeout(() => { btn.textContent = "Copiar código Pix"; }, 2500);
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
    $("colText").innerHTML = esc(cat.texto).replace(/\n/g, "<br>");
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
        if (urls.length) { el.src = urls[i]; el.alt = ""; el.loading = "lazy"; if (focos[urls[i]]) el.style.objectPosition = focos[urls[i]]; }
        else { const c = cat.cores[i % cat.cores.length]; el.style.setProperty("--c1", c); el.style.setProperty("--c2", c); }
        grid.appendChild(el);
      }
      $("colCta").hidden = false;
      $("colCta").innerHTML = cat.href
        ? `<a class="pill pill-dark" href="${esc(cat.href)}">${esc(cat.cta)}</a>`
        : `<a class="pill pill-dark" data-wa="${esc(cat.wa)}">${esc(cat.cta)}</a>`;
      bindWhatsApp($("colCta"));
    }
  }
}


// ---- Ampliar imagem (clique na foto mostra a imagem inteira) ----
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `<button type="button" class="lightbox-close" aria-label="Fechar">×</button><img alt=""><video muted loop playsinline controls controlslist="nodownload noremoteplayback" disablepictureinpicture hidden></video><p class="lightbox-cap"></p>`;
document.body.appendChild(lightbox);
let videoDeOrigem = null; // vídeo do carrossel que foi ampliado (volta a tocar ao fechar)
const closeLightbox = () => {
  const v = lightbox.querySelector("video");
  v.pause(); v.removeAttribute("src"); v.load(); v.hidden = true;
  lightbox.querySelector("img").hidden = false;
  if (videoDeOrigem) { videoDeOrigem.play().catch(() => {}); videoDeOrigem = null; }
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
};
document.addEventListener("click", (e) => {
  const img = e.target.closest("img.product-img, .gallery img, .grid-gallery img, .slides video");
  if (img) {
    const ehVideo = img.tagName === "VIDEO";
    const lbImg = lightbox.querySelector("img"), lbVideo = lightbox.querySelector("video");
    lbImg.hidden = ehVideo;
    lbVideo.hidden = !ehVideo;
    if (ehVideo) {
      lbVideo.poster = img.poster;
      lbVideo.src = img.currentSrc || img.src;
      lbVideo.currentTime = img.currentTime || 0;
      lbVideo.play().catch(() => {});
      img.pause();
      videoDeOrigem = img;
    } else {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
    }
    lightbox.querySelector(".lightbox-cap").textContent = ehVideo ? img.getAttribute("aria-label") || "" : img.alt;
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  } else if (lightbox.contains(e.target) && !["IMG", "VIDEO"].includes(e.target.tagName)) closeLightbox();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
// ---- Simulador de valor de referência (orcamento.html) ----
// Valores da Carola (anotação de referência). Os acréscimos vão somando sobre o valor anterior:
// tamanho → + acréscimo do papel → + acréscimo das cores. Ex.: A5 (270), +50% = 405, +10% = R$ 445,50.
const ORC = {
  tamanhos: { A5: 270, A4: 500, A3: 900, A2: 1500 },
  papeis: [
    { id: "p1", nome: "Papel algodão", extra: 0.5,
      spec: "Papel feito em 100% algodão · 300 g/m² · cold press (grão fino) · livre de ácido · alta gramatura · indicado para aquarela, guache e técnicas úmidas. Maior resistência e durabilidade a longo prazo." },
    { id: "p2", nome: "Papel misto", extra: 0.3,
      spec: "Papel feito em 30% algodão + 70% fibras de cana-de-açúcar (bagaço) · 290 g/m², branco natural, de tonalidade levemente quente · superfície cold pressed (grão fino) · livre de ácido. Indicado para aquarela e técnicas úmidas." },
    { id: "p3", nome: "Papel celulose", extra: 0.2,
      spec: "Papel feito em 100% celulose de madeira, 300 g/m² · livre de ácido · sem aditivos ópticos branqueadores · tratamento antifúngico · em conformidade com a ISO 9706. Papel desenvolvido para aquarela, com superfície de grão fino." },
  ],
  // papéis disponíveis em cada tamanho (p1 = algodão, p2 = misto, p3 = celulose)
  disponivel: { A5: ["p1", "p2", "p3"], A4: ["p1", "p2", "p3"], A3: ["p1", "p3"], A2: ["p3"] },
  cores: [
    { id: "unica", nome: "Monocromático", extra: 0.1 },
    { id: "colorido", nome: "Colorido", extra: 0.2 },
  ],
};
if ($("orcCfg")) {
  const escolha = { papel: ORC.papeis[0].id, tamanho: "A4", cores: ORC.cores[0].id };
  const grupos = [
    { chave: "tamanho", titulo: "Tamanho", opcoes: Object.entries(TAMANHOS).map(([k, v]) => [k, `${k} · ${v}`]) },
    { chave: "papel", titulo: "Tipo de papel", opcoes: ORC.papeis.map((p) => [p.id, p.nome]) },
    { chave: "cores", titulo: "Cores", opcoes: ORC.cores.map((c) => [c.id, c.nome]) },
  ];
  const nomeDe = (chave) => grupos.find((g) => g.chave === chave).opcoes.find(([id]) => id === escolha[chave])[1];
  // um papel só pode ser escolhido nos tamanhos em que está disponível
  const papelLivre = (id) => ORC.disponivel[escolha.tamanho].includes(id);
  function desenharOrc() {
    if (!papelLivre(escolha.papel)) escolha.papel = ORC.disponivel[escolha.tamanho][0];
    $("orcGrupos").innerHTML = grupos.map((g) => `<div class="config-grupo"><p>${g.titulo}</p><div class="sizes" role="group" aria-label="${g.titulo}">${g.opcoes.map(([id, nome]) => {
      const off = g.chave === "papel" && !papelLivre(id);
      return `<button type="button" class="size${escolha[g.chave] === id ? " on" : ""}" data-opt="${g.chave}" data-val="${id}" aria-pressed="${escolha[g.chave] === id}" ${off ? 'disabled title="Indisponível neste tamanho"' : ""}>${nome}</button>`;
    }).join("")}</div>${g.chave === "papel" ? `<p class="papel-spec"><strong>${nomeDe("papel")}:</strong> ${ORC.papeis.find((p) => p.id === escolha.papel).spec}</p>` : ""}</div>`).join("");
    const papel = ORC.papeis.find((p) => p.id === escolha.papel);
    const cor = ORC.cores.find((c) => c.id === escolha.cores);
    const preco = Math.round(ORC.tamanhos[escolha.tamanho] * (1 + papel.extra) * (1 + cor.extra) * 100) / 100;
    const precoTexto = "R$ " + preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    $("orcPreco").textContent = precoTexto;
    $("orcCta").dataset.wa = `Olá, Carola! Quero um orçamento de uma aquarela personalizada: ${nomeDe("papel")}, tamanho ${escolha.tamanho}, ${nomeDe("cores").toLowerCase()}. Valor de referência: ${precoTexto}.`;
    bindWhatsApp($("orcCta").parentElement);
  }
  $("orcGrupos").addEventListener("click", (e) => {
    const d = e.target.dataset;
    if (!d.opt) return;
    escolha[d.opt] = d.val;
    desenharOrc();
  });
  desenharOrc();
}

renderCart();
observeReveals();

$("year").textContent = new Date().getFullYear();

// ---- Dificulta salvar ou copiar imagens (botão direito e arrastar) ----
document.addEventListener("contextmenu", (e) => { if (e.target.closest("img, video")) e.preventDefault(); });
document.addEventListener("dragstart", (e) => { if (e.target.closest("img")) e.preventDefault(); });
