// Shared site behaviour: mobile nav + footer year + see-all toggles
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    if (!toggle.hasAttribute("aria-expanded")) {
      toggle.setAttribute("aria-expanded", "false");
    }
    if (!toggle.hasAttribute("aria-controls")) {
      toggle.setAttribute("aria-controls", "nav");
    }

    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });

    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-see-all]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-see-all");
      var panel = document.getElementById(targetId);
      if (!panel) return;
      var expanded = panel.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.textContent = expanded
        ? (btn.getAttribute("data-label-less") || "Show fewer")
        : (btn.getAttribute("data-label-more") || "See all");
    });
  });
})();
