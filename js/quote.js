// ============================================================================
// Stratos Environmental — quote wizard
// ----------------------------------------------------------------------------
// To receive quote submissions by email, create a FREE access key at
// https://web3forms.com (enter the inbox you want leads sent to) and paste it
// into WEB3FORMS_KEY below. Until a key is set, the form runs in demo mode:
// it validates and shows the success screen but does NOT send an email.
// ============================================================================
var CONFIG = {
  WEB3FORMS_KEY: "2f639e6f-3aa3-40d2-b691-9660089f3f09",
  BUSINESS_NAME: "Stratos Environmental",
};

(function () {
  var form = document.getElementById("quoteForm");
  if (!form) return;

  var panels = Array.prototype.slice.call(form.querySelectorAll(".step-panel"));
  var fill = document.getElementById("progressFill");
  var stepLabel = document.getElementById("stepLabel");
  var stepPct = document.getElementById("stepPct");
  var TOTAL = 5; // input steps (6th panel is the success screen)
  var current = 1;

  // ----- Prefill waste type from URL (?waste=...) -----
  var params = new URLSearchParams(window.location.search);
  var presetWaste = params.get("waste");
  var presetPostcode = params.get("postcode");
  if (presetWaste) {
    var wasteInput = form.querySelector('input[name="waste"][value="' + cssEscape(presetWaste) + '"]');
    if (wasteInput) { wasteInput.checked = true; syncSelected(wasteInput); }
  }
  if (presetPostcode) {
    var pc = document.getElementById("postcode");
    if (pc) pc.value = presetPostcode;
  }

  // ----- Option card selection styling -----
  form.querySelectorAll(".options").forEach(function (group) {
    group.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.addEventListener("change", function () { syncSelected(input); });
    });
  });

  function syncSelected(input) {
    var group = input.closest(".options");
    group.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
    input.closest(".option").classList.add("selected");
  }

  // ----- Navigation -----
  form.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { if (validateStep(current)) goTo(current + 1); });
  });
  form.querySelectorAll("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () { goTo(current - 1); });
  });

  function goTo(step) {
    if (step < 1) step = 1;
    current = step;
    panels.forEach(function (p) {
      p.classList.toggle("active", Number(p.getAttribute("data-step")) === step);
    });
    updateProgress(step);
    var wizard = document.querySelector(".wizard");
    if (wizard) wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgress(step) {
    if (step > TOTAL) return; // success screen keeps bar full
    var pct = Math.round((step / TOTAL) * 100);
    fill.style.width = pct + "%";
    stepLabel.textContent = "Step " + step + " of " + TOTAL;
    stepPct.textContent = pct + "%";
  }

  // ----- Validation -----
  function validateStep(step) {
    var panel = form.querySelector('.step-panel[data-step="' + step + '"]');
    var group = panel.querySelector(".options");
    if (group) {
      var checked = group.querySelector("input:checked");
      if (!checked) { flashOptions(group); return false; }
      return true;
    }
    var ok = true;
    panel.querySelectorAll("input").forEach(function (input) {
      var field = input.closest(".form-field");
      var valid = checkField(input);
      field.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function checkField(input) {
    var v = input.value.trim();
    if (!v) return false;
    if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (input.type === "tel") return v.replace(/[^0-9]/g, "").length >= 7;
    return true;
  }

  form.querySelectorAll(".form-field input").forEach(function (input) {
    input.addEventListener("input", function () {
      var field = input.closest(".form-field");
      if (field.classList.contains("invalid")) field.classList.toggle("invalid", !checkField(input));
    });
  });

  function flashOptions(group) {
    group.style.animation = "none";
    void group.offsetWidth;
    group.style.animation = "fade 0.25s ease";
  }

  // ----- Submit -----
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(5)) return;

    var submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    var originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    var data = collectData();

    if (!CONFIG.WEB3FORMS_KEY) {
      // Demo mode — no email backend configured yet.
      console.warn("[Stratos] No WEB3FORMS_KEY set — running in demo mode. Add a key in js/quote.js to receive quotes by email.", data);
      setTimeout(function () { showSuccess(submitBtn, originalText); }, 500);
      return;
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload(data)),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) { showSuccess(submitBtn, originalText); }
        else { failSubmit(submitBtn, originalText); }
      })
      .catch(function () { failSubmit(submitBtn, originalText); });
  });

  function collectData() {
    var get = function (n) { var el = form.querySelector('[name="' + n + '"]:checked, [name="' + n + '"]'); return el ? el.value.trim() : ""; };
    return {
      waste: get("waste"),
      frequency: get("frequency"),
      container: get("container"),
      company: get("company"),
      postcode: get("postcode"),
      firstName: get("firstName"),
      lastName: get("lastName"),
      phone: get("phone"),
      email: get("email"),
    };
  }

  function payload(d) {
    return {
      access_key: CONFIG.WEB3FORMS_KEY,
      subject: "New quote request — " + d.company + " (" + d.postcode + ")",
      from_name: CONFIG.BUSINESS_NAME + " Website",
      "Company": d.company,
      "Postcode": d.postcode,
      "Contact Name": d.firstName + " " + d.lastName,
      "Phone": d.phone,
      "Email": d.email,
      "Waste Type": d.waste,
      "Frequency": d.frequency,
      "Container": d.container,
    };
  }

  function showSuccess(btn, text) {
    goTo(6);
    btn.disabled = false;
    btn.textContent = text;
  }

  function failSubmit(btn, text) {
    btn.disabled = false;
    btn.textContent = text;
    alert("Sorry, something went wrong sending your request. Please call us on +44 7448 730416 and we'll help right away.");
  }

  // Minimal CSS.escape fallback for attribute selectors
  function cssEscape(s) { return s.replace(/["\\]/g, "\\$&"); }

  updateProgress(1);
})();
