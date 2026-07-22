(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    if (link.hasAttribute("data-replace-navigation")) {
      event.preventDefault();
      window.location.replace(link.href);
      return;
    }

    const destination = new URL(link.href, window.location.href);
    const current = new URL(window.location.href);
    const sameDocument = destination.origin === current.origin
      && destination.pathname === current.pathname
      && destination.search === current.search;

    if (!sameDocument || !destination.hash) return;

    const targetId = decodeURIComponent(destination.hash.slice(1));
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    history.replaceState(history.state, "", destination.href);
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
})();
