(function () {
  const toggle = document.querySelector(".navbar__toggle");
  const nav = document.querySelector(".navbar__nav");
  const navLinks = document.querySelectorAll(".navbar__link");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const form = document.querySelector(".contact__form form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = "Sending…";
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          btn.textContent = "Message Sent!";
          form.reset();
          setTimeout(() => {
            btn.textContent = "Send Message";
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error("Server error");
        }
      } catch {
        btn.textContent = "Failed — Try Again";
        btn.disabled = false;
      }
    });
  }
})();
