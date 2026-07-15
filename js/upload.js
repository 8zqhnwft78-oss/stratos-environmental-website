var UPLOAD_CONFIG = {
  WEB3FORMS_KEY: "2f639e6f-3aa3-40d2-b691-9660089f3f09",
  BUSINESS_NAME: "Stratos Environmental",
};

(function () {
  var form = document.getElementById("uploadForm");
  if (!form) return;

  var btn = document.getElementById("uploadBtn");
  var success = document.getElementById("uploadSuccess");
  var wrap = document.getElementById("uploadFormWrap");

  function valid(input) {
    if (input.type === "file") return input.files && input.files.length > 0;
    if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (input.type === "tel") return input.value.replace(/[^0-9]/g, "").length >= 7;
    return input.value.trim().length > 0;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("input[required]").forEach(function (input) {
      var field = input.closest(".form-field");
      var v = valid(input);
      field.classList.toggle("invalid", !v);
      if (!v) ok = false;
    });
    if (!ok) return;

    if (!UPLOAD_CONFIG.WEB3FORMS_KEY) {
      alert("Upload is not configured yet. Please call +44 7448 730416.");
      return;
    }

    btn.disabled = true;
    var orig = btn.textContent;
    btn.textContent = "Uploading...";

    var fd = new FormData();
    fd.append("access_key", UPLOAD_CONFIG.WEB3FORMS_KEY);
    fd.append("subject", "Invoice upload — " + form.company.value.trim());
    fd.append("from_name", UPLOAD_CONFIG.BUSINESS_NAME + " Website");
    fd.append("Company", form.company.value.trim());
    fd.append("Postcode", form.postcode.value.trim());
    fd.append("Contact Name", form.name.value.trim());
    fd.append("Phone", form.phone.value.trim());
    fd.append("Email", form.email.value.trim());
    if (form.notes.value.trim()) fd.append("Notes", form.notes.value.trim());
    fd.append("attachment", form.attachment.files[0]);

    fetch("https://api.web3forms.com/submit", { method: "POST", body: fd })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          wrap.style.display = "none";
          success.classList.add("show");
        } else {
          btn.disabled = false;
          btn.textContent = orig;
          alert("Upload failed. Please try again or call +44 7448 730416.");
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = orig;
        alert("Upload failed. Please try again or call +44 7448 730416.");
      });
  });
})();
