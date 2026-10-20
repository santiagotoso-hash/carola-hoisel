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

document.getElementById("year").textContent = new Date().getFullYear();
