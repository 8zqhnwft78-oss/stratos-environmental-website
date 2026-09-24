// ============================================================================
// Stratos Environmental Ltd — existing-customer order portal
// Sends the order to the same Web3Forms inbox as quote requests.
// ============================================================================
var PORTAL_CONFIG = {
  WEB3FORMS_KEY: "2f639e6f-3aa3-40d2-b691-9660089f3f09",
  BUSINESS_NAME: "Stratos Environmental Ltd",
  STORE_KEY: "se-portal-identity",
};

(function () {
  var form = document.getElementById("portalForm");
  if (!form) return;

  var panels = Array.prototype.slice.call(form.querySelectorAll(".step-panel"));
  var fill = document.getElementById("progressFill");
  var stepLabel = document.getElementById("stepLabel");
  var stepPct = document.getElementById("stepPct");
  var welcome = document.getElementById("portalWelcome");
  var welcomeName = document.getElementById("welcomeName");
  var altAddress = document.getElementById("altAddressField");
  var orderErr = document.getElementById("orderErr");
  var TOTAL = 2;
  var current = 1;

  var ITEMS = [
    { name: "qty_general", label: "General waste sacks", packSize: 50 },
    { name: "qty_recycling", label: "Recycling sacks", packSize: 50 },
    { name: "qty_food", label: "Food waste sacks / liners", packSize: 50 },
    { name: "qty_extra", label: "Extra collections", packSize: 0 },
  ];

  var hasSavedIdentity = restoreIdentity();
  if (hasSavedIdentity) {
    goTo(2);
  } else {
    updateProgress(1);
  }

  form.querySelectorAll(".options").forEach(function (group) {
    group.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.addEventListener("change", function () {
        group.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
        input.closest(".option").classList.add("selected");
        toggleAltAddress();
      });
    });
  });

  form.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { if (validateStep(current)) goTo(current + 1); });
  });
  form.querySelectorAll("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () { goTo(current - 1); });
  });

  var notYou = document.getElementById("notYou");
  if (notYou) {
    notYou.addEventListener("click", function () {
      try { localStorage.removeItem(PORTAL_CONFIG.STORE_KEY); } catch (e) {}
      form.reset();
      form.querySelectorAll(".option").forEach(function (o) {
        var input = o.querySelector("input");
        o.classList.toggle("selected", !!(input && input.checked));
      });
      toggleAltAddress();
      if (welcome) welcome.hidden = true;
      goTo(1);
    });
  }

  form.querySelectorAll("[data-qty]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".qty");
      var input = wrap.querySelector("input");
      var step = Number(input.getAttribute("data-step") || input.step || 1);
      var next = readQty(input) + (btn.getAttribute("data-qty") === "+" ? step : -step);
      input.value = String(Math.max(0, next));
      clearOrderError();
    });
  });

  form.querySelectorAll(".qty input").forEach(function (input) {
    input.addEventListener("input", clearOrderError);
  });

  function goTo(step) {
    if (step < 1) step = 1;
    if (step > 3) step = 3;
    current = step;
    panels.forEach(function (p) {
      p.classList.toggle("active", Number(p.getAttribute("data-step")) === step);
    });
    if (step <= TOTAL) updateProgress(step);
    if (step === 2) showWelcome();
    var wizard = document.querySelector(".wizard");
    if (wizard) wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgress(step) {
    var pct = Math.round((step / TOTAL) * 100);
    fill.style.width = pct + "%";
    stepLabel.textContent = "Step " + step + " of " + TOTAL;
    stepPct.textContent = pct + "%";
  }

  function validateStep(step) {
    if (step === 1) return validateIdentity();
    if (step === 2) return validateOrder();
    return true;
  }

  function validateIdentity() {
    var ok = true;
    form.querySelectorAll('.step-panel[data-step="1"] [required]').forEach(function (input) {
      var field = input.closest(".form-field");
      var valid = checkField(input);
      field.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function validateOrder() {
    var lines = collectLines();
    if (!lines.length) {
      if (orderErr) orderErr.hidden = false;
      return false;
    }
    clearOrderError();
    if (deliveryValue() === "different") {
      var addr = form.querySelector('[name="deliveryAddress"]');
      var field = addr.closest(".form-field");
      var valid = addr.value.trim().length > 8;
      field.classList.toggle("invalid", !valid);
      if (!valid) return false;
    }
    return true;
  }

  function checkField(input) {
    var v = input.value.trim();
    if (!v) return false;
    if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (input.type === "tel") return v.replace(/[^0-9]/g, "").length >= 7;
    return true;
  }

  form.querySelectorAll(".form-field input, .form-field textarea").forEach(function (input) {
    input.addEventListener("input", function () {
      var field = input.closest(".form-field");
      if (field && field.classList.contains("invalid")) {
        field.classList.toggle("invalid", input.hasAttribute("required") ? !checkField(input) : false);
      }
    });
  });

  function toggleAltAddress() {
    var show = deliveryValue() === "different";
    if (!altAddress) return;
    altAddress.hidden = !show;
    var addr = form.querySelector('[name="deliveryAddress"]');
    if (addr) addr.required = show;
    if (!show && addr) addr.closest(".form-field").classList.remove("invalid");
  }

  function deliveryValue() {
    var el = form.querySelector('[name="delivery"]:checked');
    return el ? el.value : "usual";
  }

  function readQty(input) {
    var n = parseInt(input.value, 10);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function collectLines() {
    return ITEMS.map(function (item) {
      var el = form.querySelector('[name="' + item.name + '"]');
      var qty = el ? readQty(el) : 0;
      if (qty <= 0) return "";
      if (item.packSize) {
        var packs = Math.round(qty / item.packSize);
        return item.label + ": " + qty + " (" + packs + " pack" + (packs === 1 ? "" : "s") + " of " + item.packSize + ")";
      }
      return item.label + ": " + qty;
    }).filter(Boolean);
  }

  function clearOrderError() {
    if (orderErr) orderErr.hidden = true;
  }

  function showWelcome() {
    var company = getText("company");
    if (welcomeName) welcomeName.textContent = company || "your account";
    if (welcome) welcome.hidden = !company;
  }

  function getText(n) {
    var el = form.querySelector('[name="' + n + '"]');
    return el && el.value ? el.value.trim() : "";
  }

  function restoreIdentity() {
    try {
      var saved = JSON.parse(localStorage.getItem(PORTAL_CONFIG.STORE_KEY) || "null");
      if (!saved || !saved.company || !saved.email) return false;
      ["company", "postcode", "name", "phone", "email", "account"].forEach(function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        if (el && saved[n]) el.value = saved[n];
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function saveIdentity(d) {
    try {
      localStorage.setItem(PORTAL_CONFIG.STORE_KEY, JSON.stringify({
        company: d.company,
        postcode: d.postcode,
        name: d.name,
        phone: d.phone,
        email: d.email,
        account: d.account,
      }));
    } catch (e) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateIdentity()) { goTo(1); return; }
    if (!validateOrder()) { goTo(2); return; }

    var honey = form.querySelector('[name="website"]');
    if (honey && honey.value) return;

    var submitBtn = document.getElementById("submitOrder");
    submitBtn.disabled = true;
    var originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    var data = collectData();
    saveIdentity(data);

    if (!PORTAL_CONFIG.WEB3FORMS_KEY) {
      alert("The portal is not fully configured yet. Please call us on +44 7448 730416.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload(data)),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) { showSuccess(data); }
        else { failSubmit(submitBtn, originalText, res.message || "Unknown error"); }
      })
      .catch(function (err) {
        failSubmit(submitBtn, originalText, err && err.message ? err.message : "Network error");
      });
  });

  function collectData() {
    var lines = collectLines();
    var delivery = deliveryValue();
    var deliveryLabel = delivery === "different"
      ? "Different address: " + getText("deliveryAddress")
      : "Usual collection address (" + getText("postcode") + ")";
    return {
      company: getText("company"),
      postcode: getText("postcode"),
      name: getText("name"),
      phone: getText("phone"),
      email: getText("email"),
      account: getText("account"),
      order: lines.join("\n"),
      delivery: deliveryLabel,
      notes: getText("notes"),
    };
  }

  function payload(d) {
    var body = {
      access_key: PORTAL_CONFIG.WEB3FORMS_KEY,
      subject: "CUSTOMER ORDER — " + d.company + " (" + d.postcode + ")",
      from_name: PORTAL_CONFIG.BUSINESS_NAME + " Portal",
      replyto: d.email,
      "Company": d.company,
      "Postcode": d.postcode,
      "Contact Name": d.name,
      "Phone": d.phone,
      "Email": d.email,
      "Account reference": d.account || "Not given",
      "Order": d.order,
      "Delivery": d.delivery,
    };
    if (d.notes) body["Notes"] = d.notes;
    return body;
  }

  function showSuccess(data) {
    var summary = document.getElementById("orderSummary");
    if (summary) {
      summary.textContent = data.company + " — " + data.order.replace(/\n/g, "; ");
    }
    goTo(3);
  }

  function failSubmit(btn, text, detail) {
    btn.disabled = false;
    btn.textContent = text;
    alert("Sorry, something went wrong sending your order. Please call us on +44 7448 730416 and we'll help right away." + (detail ? "\n\n(" + detail + ")" : ""));
  }

  var another = document.getElementById("orderAnother");
  if (another) {
    another.addEventListener("click", function () {
      ITEMS.forEach(function (item) {
        var el = form.querySelector('[name="' + item.name + '"]');
        if (el) el.value = "0";
      });
      var notes = form.querySelector('[name="notes"]');
      if (notes) notes.value = "";
      var submitBtn = document.getElementById("submitOrder");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send order";
      }
      goTo(2);
    });
  }

  toggleAltAddress();
})();
