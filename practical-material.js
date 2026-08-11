(() => {
  const root = document.documentElement;
  const body = document.body;
  const buttons = Array.from(document.querySelectorAll("[data-lang]"));
  const blocks = Array.from(document.querySelectorAll("[data-language-content]"));
  const shared = Array.from(document.querySelectorAll("[data-shared-ru][data-shared-en]"));
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  function setLanguage(language) {
    const lang = language === "en" ? "en" : "ru";
    localStorage.setItem("ifa-language", lang);
    root.lang = lang;
    blocks.forEach((block) => { block.hidden = block.dataset.languageContent !== lang; });
    shared.forEach((node) => { node.textContent = lang === "en" ? node.dataset.sharedEn : node.dataset.sharedRu; });
    buttons.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const title = body.dataset[`title${lang === "en" ? "En" : "Ru"}`];
    const summary = body.dataset[`description${lang === "en" ? "En" : "Ru"}`];
    if (title) { document.title = title; if (ogTitle) ogTitle.content = title; }
    if (summary) { if (description) description.content = summary; if (ogDescription) ogDescription.content = summary; }
  }

  buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  setLanguage(localStorage.getItem("ifa-language") || "ru");
})();
