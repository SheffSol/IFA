(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const gallery = document.querySelector(".journey-gallery");
  const slides = gallery ? Array.from(gallery.querySelectorAll(".journey-gallery-slide")) : [];
  const previousButton = document.querySelector(".journey-gallery-prev");
  const nextButton = document.querySelector(".journey-gallery-next");
  const count = document.querySelector(".journey-gallery-count");
  const progress = document.querySelector(".journey-gallery-progress span");
  let activeIndex = 0;
  let scrollFrame = 0;
  let drag = null;

  function closestSlideIndex() {
    if (!gallery || !slides.length) return 0;
    const centre = gallery.scrollLeft + gallery.clientWidth / 2;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCentre = slide.offsetLeft + slide.offsetWidth / 2;
      const nextDistance = Math.abs(slideCentre - centre);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = index;
      }
    });

    return closest;
  }

  function updateGallery(index = closestSlideIndex()) {
    if (!slides.length) return;
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    if (count) {
      count.innerHTML = `<strong>${String(activeIndex + 1).padStart(2, "0")}</strong> / ${String(slides.length).padStart(2, "0")}`;
    }

    if (progress) {
      progress.style.width = `${100 / slides.length}%`;
      progress.style.transform = `translateX(${activeIndex * 100}%)`;
    }
  }

  function goToSlide(index, behaviour = "smooth") {
    if (!gallery || !slides.length) return;
    const targetIndex = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[targetIndex];
    const left = Math.max(0, slide.offsetLeft - (gallery.clientWidth - slide.offsetWidth) / 2);
    gallery.scrollTo({ left, behavior: reducedMotion.matches ? "auto" : behaviour });
    updateGallery(targetIndex);
  }

  previousButton?.addEventListener("click", () => {
    goToSlide(activeIndex > 0 ? activeIndex - 1 : slides.length - 1);
  });

  nextButton?.addEventListener("click", () => {
    goToSlide(activeIndex < slides.length - 1 ? activeIndex + 1 : 0);
  });

  gallery?.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      updateGallery();
      scrollFrame = 0;
    });
  }, { passive: true });

  gallery?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeIndex + 1);
    }
  });

  gallery?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: gallery.scrollLeft,
      horizontal: false,
    };
  });

  gallery?.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.horizontal && Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.horizontal = true;
      gallery.classList.add("is-dragging");
      gallery.setPointerCapture?.(event.pointerId);
    }

    if (!drag.horizontal) return;
    event.preventDefault();
    gallery.scrollLeft = drag.scrollLeft - deltaX;
  });

  function finishDrag(event) {
    if (!drag || (event && drag.pointerId !== event.pointerId)) return;
    const wasHorizontal = drag.horizontal;
    drag = null;
    gallery?.classList.remove("is-dragging");
    if (wasHorizontal) window.requestAnimationFrame(() => goToSlide(closestSlideIndex()));
  }

  gallery?.addEventListener("pointerup", finishDrag);
  gallery?.addEventListener("pointercancel", finishDrag);
  gallery?.addEventListener("lostpointercapture", finishDrag);
  window.addEventListener("resize", () => goToSlide(activeIndex, "auto"));
  updateGallery(0);

  const regionButtons = Array.from(document.querySelectorAll(".journey-region-button"));
  const regionTitle = document.querySelector(".journey-region-title");
  const regionText = document.querySelector(".journey-region-text");
  const regionList = document.querySelector(".journey-region-list");
  let activeRegion = regionButtons.find((button) => button.classList.contains("is-active")) || regionButtons[0];

  function updateRegion(button = activeRegion) {
    if (!button || !regionTitle || !regionText || !regionList) return;
    activeRegion = button;
    const language = document.documentElement.lang === "en" ? "en" : "ru";
    const title = button.dataset[`${language}Title`];
    const text = button.dataset[`${language}Text`];
    const items = String(button.dataset[`${language}List`] || "").split("|").filter(Boolean);

    regionButtons.forEach((regionButton) => {
      const selected = regionButton === button;
      regionButton.classList.toggle("is-active", selected);
      regionButton.setAttribute("aria-pressed", String(selected));
    });

    regionTitle.textContent = title || "";
    regionText.textContent = text || "";
    regionList.replaceChildren(...items.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }));
  }

  regionButtons.forEach((button) => {
    button.addEventListener("click", () => updateRegion(button));
  });

  if (regionButtons.length) {
    const languageObserver = new MutationObserver(() => updateRegion(activeRegion));
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    updateRegion(activeRegion);
  }

  const animatedJourneySections = Array.from(document.querySelectorAll(".great-journey-feature, .journey-hero, .atlas-stage"));

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const journeyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-journey-active");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    animatedJourneySections.forEach((section) => journeyObserver.observe(section));
  } else {
    animatedJourneySections.forEach((section) => section.classList.add("is-journey-active"));
  }

  const atlasStages = Array.from(document.querySelectorAll("[data-atlas-stage]"));
  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const atlasChapters = [
    {
      image: "assets/astana-landscape.webp",
      width: 1200,
      height: 1800,
      coordinates: "51°10′N / 71°26′E",
      kicker: { ru: "КОНЦЕПЦИЯ / В РЕАЛИЗАЦИИ", en: "CONCEPT / IN DEVELOPMENT" },
      title: { ru: "СОВРЕМЕННЫЙ<br>КАЗАХСТАН.", en: "MODERN<br>KAZAKHSTAN." },
      text: {
        ru: "Проект находится на стадии реализации. Его цель — показать современный Казахстан и развитие страны как ведущего государства Центральной Азии. Концепция создаётся для совместной реализации с Министерством туризма и спорта Республики Казахстан, культурными центрами страны, сетью туристских информационных центров и активистами в сфере туризма.",
        en: "The project is currently in development. Its purpose is to present modern Kazakhstan and the country’s progress as a leading state in Central Asia. The concept is being developed for joint implementation with the Ministry of Tourism and Sports of the Republic of Kazakhstan, cultural institutions, the national tourist information centre network and tourism advocates.",
      },
      alt: {
        ru: "Современная архитектура делового центра Астаны",
        en: "Contemporary architecture in Astana’s business district",
      },
    },
  ];

  function createAtlasSpreads(stage) {
    const container = stage.querySelector("[data-atlas-spreads]");
    const dots = stage.querySelector("[data-atlas-dots]");
    if (!container || container.children.length) return;

    atlasChapters.forEach((chapter, index) => {
      const spread = document.createElement("article");
      spread.className = "atlas-book-spread";
      spread.dataset.atlasSpread = String(index);
      spread.setAttribute("aria-hidden", "true");
      spread.innerHTML = `
        <div class="atlas-spread-page atlas-spread-page--visual">
          <img src="${chapter.image}" alt="" width="${chapter.width}" height="${chapter.height}" loading="lazy" data-atlas-alt />
          <span>${chapter.coordinates}</span>
        </div>
        <div class="atlas-spread-page atlas-spread-page--copy">
          <span class="atlas-spread-kicker" data-atlas-kicker></span>
          <strong data-atlas-title></strong>
          <p data-atlas-text></p>
          <div class="atlas-spread-cityline" aria-hidden="true"><i></i><i></i><i></i></div>
        </div>`;
      container.append(spread);

      if (dots) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.dataset.atlasDot = String(index);
        dot.setAttribute("aria-label", `${index + 1}`);
        dot.addEventListener("click", () => updateAtlasSpread(stage, index));
        dots.append(dot);
      }
    });
  }

  function renderAtlasLanguage(stage) {
    const language = document.documentElement.lang === "en" ? "en" : "ru";
    stage.querySelectorAll("[data-atlas-spread]").forEach((spread, index) => {
      const chapter = atlasChapters[index];
      if (!chapter) return;
      const image = spread.querySelector("[data-atlas-alt]");
      const kicker = spread.querySelector("[data-atlas-kicker]");
      const title = spread.querySelector("[data-atlas-title]");
      const copy = spread.querySelector("[data-atlas-text]");
      if (image) image.alt = chapter.alt[language];
      if (kicker) kicker.textContent = chapter.kicker[language];
      if (title) title.innerHTML = chapter.title[language];
      if (copy) copy.textContent = chapter.text[language];
    });

    const previous = stage.querySelector("[data-atlas-prev]");
    const next = stage.querySelector("[data-atlas-next]");
    const navigation = stage.querySelector("[data-atlas-navigation]");
    if (previous) previous.setAttribute("aria-label", language === "en" ? "Previous chapter" : "Предыдущая глава");
    if (next) next.setAttribute("aria-label", language === "en" ? "Next chapter" : "Следующая глава");
    if (navigation) navigation.setAttribute("aria-label", language === "en" ? "Guide chapter navigation" : "Навигация по главам гида");
  }

  function updateAtlasSpread(stage, requestedIndex) {
    const spreads = Array.from(stage.querySelectorAll("[data-atlas-spread]"));
    if (!spreads.length) return;
    const previousIndex = Number(stage.dataset.atlasIndex || 0);
    const index = (requestedIndex + spreads.length) % spreads.length;
    stage.dataset.atlasIndex = String(index);

    if (stage.classList.contains("is-open") && index !== previousIndex) {
      const forward = (index - previousIndex + spreads.length) % spreads.length <= spreads.length / 2;
      stage.classList.remove("is-turning-forward", "is-turning-back");
      void stage.offsetWidth;
      stage.classList.add(forward ? "is-turning-forward" : "is-turning-back");
      window.clearTimeout(stage.atlasTurnTimer);
      stage.atlasTurnTimer = window.setTimeout(() => {
        stage.classList.remove("is-turning-forward", "is-turning-back");
      }, 620);
    }

    spreads.forEach((spread, spreadIndex) => {
      const active = spreadIndex === index;
      spread.classList.toggle("is-active", active);
      spread.setAttribute("aria-hidden", String(!active));
    });

    stage.querySelectorAll("[data-atlas-dot]").forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });

    const counter = stage.querySelector("[data-atlas-count]");
    if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(spreads.length).padStart(2, "0")}`;
  }

  function updateAtlasLabel(stage) {
    const label = stage.querySelector(".atlas-toggle-label");
    const toggle = stage.querySelector("[data-atlas-toggle]");
    if (!label || !toggle) return;

    const language = document.documentElement.lang === "en" ? "en" : "ru";
    const open = toggle.getAttribute("aria-pressed") === "true";
    label.textContent = label.dataset[`${language}${open ? "Close" : "Open"}`] || label.textContent;
    renderAtlasLanguage(stage);
  }

  atlasStages.forEach((stage) => {
    const toggle = stage.querySelector("[data-atlas-toggle]");
    const book = stage.querySelector("[data-atlas-book]");
    const previous = stage.querySelector("[data-atlas-prev]");
    const next = stage.querySelector("[data-atlas-next]");
    let atlasDrag = null;
    if (!toggle || !book) return;

    stage.classList.toggle("atlas-stage--single", atlasChapters.length === 1);
    createAtlasSpreads(stage);
    updateAtlasSpread(stage, 0);

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", String(open));
      stage.classList.toggle("is-open", open);
      book.setAttribute("aria-hidden", String(!open));
      if (open) updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0));
      updateAtlasLabel(stage);
    });

    previous?.addEventListener("click", () => {
      updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0) - 1);
    });

    next?.addEventListener("click", () => {
      updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0) + 1);
    });

    stage.addEventListener("keydown", (event) => {
      if (!stage.classList.contains("is-open")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0) - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0) + 1);
      }
    });

    stage.addEventListener("pointerdown", (event) => {
      if (!stage.classList.contains("is-open") || event.target.closest("button")) return;
      atlasDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    });

    stage.addEventListener("pointerup", (event) => {
      if (!atlasDrag || atlasDrag.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - atlasDrag.x;
      const deltaY = event.clientY - atlasDrag.y;
      atlasDrag = null;
      if (Math.abs(deltaX) < 38 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      updateAtlasSpread(stage, Number(stage.dataset.atlasIndex || 0) + (deltaX < 0 ? 1 : -1));
    });

    stage.addEventListener("pointercancel", () => {
      atlasDrag = null;
    });

    stage.addEventListener("pointermove", (event) => {
      if (!precisePointer.matches || reducedMotion.matches || stage.classList.contains("is-open")) return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      stage.style.setProperty("--atlas-tilt-x", `${(-y * 6).toFixed(2)}deg`);
      stage.style.setProperty("--atlas-tilt-y", `${(x * 8).toFixed(2)}deg`);
    });

    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--atlas-tilt-x", "0deg");
      stage.style.setProperty("--atlas-tilt-y", "0deg");
    });

    updateAtlasLabel(stage);
  });

  if (atlasStages.length) {
    const atlasLanguageObserver = new MutationObserver(() => {
      atlasStages.forEach(updateAtlasLabel);
    });
    atlasLanguageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
})();
