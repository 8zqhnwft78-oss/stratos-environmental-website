(function () {
  var tabs = document.querySelectorAll('.bin-tab');
  var panels = document.querySelectorAll('.bin-panel');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.getAttribute('data-bin');
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.remove('active');
        p.hidden = true;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('bin-' + id);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });
})();
