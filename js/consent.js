// Cookie consent banner + Google Consent Mode v2 update.
// Consent defaults to "denied" in the inline tag on every page; this shows a
// banner and updates consent once the visitor makes a choice.
(function () {
  var KEY = "se-cookie-consent";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored === "granted" || stored === "denied") return; // choice already made

  function applyConsent(granted) {
    var state = granted ? "granted" : "denied";
    try { localStorage.setItem(KEY, state); } catch (e) {}
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
        analytics_storage: state,
      });
    }
    dismiss();
  }

  var banner;
  function dismiss() {
    if (!banner) return;
    banner.classList.add("hide");
    setTimeout(function () {
      if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    }, 300);
  }

  function build() {
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<div class="cookie-inner">' +
      '<p class="cookie-text">We use cookies to measure traffic. Accept or reject non-essential cookies. ' +
      '<a href="/privacy">Privacy policy</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-ghost cookie-reject">Reject</button>' +
      '<button type="button" class="btn btn-primary cookie-accept">Accept</button>' +
      "</div></div>";
    document.body.appendChild(banner);
    banner.querySelector(".cookie-accept").addEventListener("click", function () { applyConsent(true); });
    banner.querySelector(".cookie-reject").addEventListener("click", function () { applyConsent(false); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
