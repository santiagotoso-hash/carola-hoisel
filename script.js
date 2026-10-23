// ---- Configurações ----
const WHATSAPP = "5571993021728"; // DDI + DDD + número, só dígitos

const LITOCODE_WHATSAPP = "5571999991778"; // WhatsApp da litocode (crédito no rodapé)
document.getElementById("creditLink").href = `https://wa.me/${LITOCODE_WHATSAPP}`;

// Fotos reais das seções de galeria (personalizadas, murais, estampas): coloque os arquivos numa pasta
// (ex.: murais/) e liste aqui. Sem fotos, aparecem blocos de cor no lugar.
const fotos = {
  "personalizadas": ["AQUARELAS-PERSONALIZADAS/1.jpeg", "AQUARELAS-PERSONALIZADAS/2.jpeg", "AQUARELAS-PERSONALIZADAS/3-sevilha.jpg"],
  // "murais": ["murais/1.jpg", "murais/2.jpg", "murais/3.jpg"],
};

// Parte da foto que fica visível na miniatura (as miniaturas cortam a foto). Padrão: centro.
// Valores: "left", "right", "top", "bottom", "center" ou percentuais como "20% 50%".
const focos = {
  "AQUARELAS-PERSONALIZADAS/3-sevilha.jpg": "left center",
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
  { id: 42, cat: "fine-art", titulo: "Xangô", tecnica: "Aquarela", cor: "#9c6244", image: "AQUARELAS/xango.jpeg" },
  { id: 43, cat: "fine-art", titulo: "Ibejis", tecnica: "Aquarela", cor: "#c9a882", image: "AQUARELAS/ibejis.jpeg", extras: ["AQUARELAS/ibejis-mockup.jpg"] },
  { id: 11, cat: "prints", titulo: "Coração do Brasil", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/coracao-do-brasil.jpg" },
  { id: 12, cat: "prints", titulo: "Polvo Azul", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/polvo-azul.jpg" },
  { id: 13, cat: "prints", titulo: "Bahia Resistência", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/bahia-resistencia.jpg" },
  { id: 14, cat: "prints", titulo: "Bananeira", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/bananeira.jpg" },
  { id: 15, cat: "prints", titulo: "Banana Rosa", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/banana-rosa-agrupada.jpg" },
  { id: 16, cat: "prints", titulo: "Bomfim", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/bomfim.jpg" },
  { id: 17, cat: "prints", titulo: "Café para Despertar", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/cafe-para-despertar.jpg" },
  { id: 18, cat: "prints", titulo: "Eagle Ray", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/eagle-ray.jpg" },
  { id: 19, cat: "prints", titulo: "Jubarte", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/jubarte.jpg" },
  { id: 20, cat: "prints", titulo: "Jubarte (fundo amarelo)", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/jubarte-fundo-amarelo.jpg" },
  { id: 21, cat: "prints", titulo: "Márcio Freire", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/marcio-freire.jpg" },
  { id: 22, cat: "prints", titulo: "Parede Agrupada", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/parede-agrupada.jpg" },
  { id: 23, cat: "prints", titulo: "Solitude", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/solitude.jpg" },
  { id: 24, cat: "prints", titulo: "Sup Yoga", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/sup-yoga.jpg" },
  { id: 25, cat: "prints", titulo: "Surf Sunset Whale", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/surf-sunset-whale.jpg" },
  { id: 26, cat: "prints", titulo: "Surfgirl", tecnica: "Arquivo digital", medidas: "alta resolução", preco: 40, cor: "#d9c4b2", image: "PRINTS-WEB/surfgirl.jpg" },
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

$("checkout").addEventListener("click", () => {
  if (!cart.length) return;
  const msg = `Olá, Carola! Quero comprar:\n${cart.map((c) => `• ${nomeDoItem(c)} — ${brl(precoDe(porId(c.id), c.size))}`).join("\n")}\nSubtotal: ${brl(subtotalDoCarrinho())}${freteLinha()}\nTotal: ${brl(totalDoCarrinho())}`;
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
// ---- Simulador de valor de referência (orcamento.html) ----
// Valores de teste. preço = tamanho × papel × cores, arredondado para múltiplos de 5.
const ORC = {
  papeis: [
    { id: "p1", nome: "Papel 1", fator: 1 },
    { id: "p2", nome: "Papel 2", fator: 1.15 },
    { id: "p3", nome: "Papel 3", fator: 1.3 },
  ],
  tamanhos: { A5: 250, A4: 450, A3: 750, A2: 1500 },
  cores: [
    { id: "unica", nome: "Cor única", fator: 1 },
    { id: "colorido", nome: "Colorido", fator: 1.4 },
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
  function desenharOrc() {
    $("orcGrupos").innerHTML = grupos.map((g) => `<div class="config-grupo"><p>${g.titulo}</p><div class="sizes" role="group" aria-label="${g.titulo}">${g.opcoes.map(([id, nome]) =>
      `<button type="button" class="size${escolha[g.chave] === id ? " on" : ""}" data-opt="${g.chave}" data-val="${id}" aria-pressed="${escolha[g.chave] === id}">${nome}</button>`).join("")}</div></div>`).join("");
    const papel = ORC.papeis.find((p) => p.id === escolha.papel);
    const cor = ORC.cores.find((c) => c.id === escolha.cores);
    const preco = Math.round((ORC.tamanhos[escolha.tamanho] * papel.fator * cor.fator) / 5) * 5;
    $("orcPreco").textContent = brl(preco);
    $("orcCta").dataset.wa = `Olá, Carola! Quero um orçamento de uma aquarela personalizada: ${nomeDe("papel")}, tamanho ${escolha.tamanho}, ${nomeDe("cores").toLowerCase()}. Valor de referência: ${brl(preco)}.`;
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
document.addEventListener("contextmenu", (e) => { if (e.target.closest("img")) e.preventDefault(); });
document.addEventListener("dragstart", (e) => { if (e.target.closest("img")) e.preventDefault(); });
