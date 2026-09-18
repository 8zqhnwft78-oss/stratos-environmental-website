// ============================================================================
// Stratos Environmental Ltd — payments page
// - Custom-amount / invoice payments go through a Netlify Function that
//   creates a Stripe Checkout Session (see netlify/functions/create-checkout.js).
// - Recurring plans and fixed one-offs use Stripe Payment Links (plain <a>).
// ============================================================================
(function () {
  "use strict";

  var CHECKOUT_ENDPOINT = "/.netlify/functions/create-checkout";

  // ---- Return-from-Stripe status banner --------------------------------
  var banner = document.getElementById("payBanner");
  if (banner) {
    var params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      banner.hidden = false;
      banner.classList.add("pay-banner-ok");
      banner.textContent = "Payment received — thank you. A receipt is on its way to your email.";
    } else if (params.get("canceled") === "1") {
      banner.hidden = false;
      banner.classList.add("pay-banner-warn");
      banner.textContent = "Payment cancelled. Nothing has been charged — you can try again any time.";
    }
  }

  // ---- Warn if any Payment Link hasn't been configured yet -------------
  document.querySelectorAll("[data-stripe-link]").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.indexOf("#REPLACE") === 0 || href === "#") {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        alert("This payment option isn't set up yet. Please call +44 7448 730416 and we'll take payment over the phone.");
      });
    }
  });

  // ---- Custom-amount / invoice payment ---------------------------------
  var form = document.getElementById("payForm");
  if (!form) return;

  var amount = document.getElementById("amount");
  var email = document.getElementById("payEmail");
  var invoiceRef = document.getElementById("invoiceRef");
  var btn = document.getElementById("payBtn");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setInvalid(el, invalid) {
    var field = el.closest(".form-field");
    if (field) field.classList.toggle("invalid", invalid);
  }

  [amount, email].forEach(function (el) {
    el.addEventListener("input", function () { setInvalid(el, false); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var amt = parseFloat(amount.value);
    var okAmount = !isNaN(amt) && amt >= 1;
    var okEmail = isValidEmail(email.value.trim());
    setInvalid(amount, !okAmount);
    setInvalid(email, !okEmail);
    if (!okAmount || !okEmail) return;

    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Connecting to Stripe…";

    fetch(CHECKOUT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        amount: Math.round(amt * 100), // pence
        email: email.value.trim(),
        invoiceRef: (invoiceRef.value || "").trim(),
      }),
    })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, body: b }; }); })
      .then(function (res) {
        if (res.ok && res.body && res.body.url) {
          window.location.href = res.body.url; // hand off to Stripe Checkout
        } else {
          fail(btn, original, (res.body && res.body.error) || "Unable to start payment.");
        }
      })
      .catch(function (err) {
        fail(btn, original, err && err.message ? err.message : "Network error.");
      });
  });

  function fail(button, text, detail) {
    button.disabled = false;
    button.textContent = text;
    alert("Sorry, we couldn't start the payment. Please call +44 7448 730416 and we'll help right away." + (detail ? "\n\n(" + detail + ")" : ""));
  }
})();
