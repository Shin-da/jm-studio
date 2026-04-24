(() => {
  const storageKey = "jmstudio-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      const isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.textContent = isDark ? "Light mode" : "Dark mode";
    }
  };

  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(storageKey, nextTheme);
    });
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  const stagedItems = document.querySelectorAll(".card.reveal, .step.reveal");

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("in-view"));
  } else {
    stagedItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 3) * 70}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const referrerField = document.querySelector("#referrer-field");
  const landingPathField = document.querySelector("#landing-path-field");
  const campaignSourceField = document.querySelector("#campaign-source-field");
  const params = new URLSearchParams(window.location.search);

  if (referrerField) {
    referrerField.value = document.referrer || "direct";
  }

  if (landingPathField) {
    landingPathField.value = window.location.pathname + window.location.search;
  }

  if (campaignSourceField) {
    campaignSourceField.value = params.get("src") || params.get("utm_source") || "direct";
  }
})();
