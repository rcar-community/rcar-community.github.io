(function () {
  "use strict";

  function initTabGroup(root) {
    var buttons = Array.prototype.filter.call(
      root.querySelectorAll(".rc-tabs__btn"),
      function (btn) {
        return btn.closest(".rc-tabs") === root;
      }
    );
    var panels = Array.prototype.filter.call(
      root.querySelectorAll(".rc-tabs__panel"),
      function (panel) {
        return panel.closest(".rc-tabs") === root;
      }
    );

    function activate(key) {
      buttons.forEach(function (btn) {
        var isActive = btn.getAttribute("data-tab") === key;
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-tab-panel") === key;
        panel.setAttribute("data-active", isActive ? "true" : "false");
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn.getAttribute("data-tab"));
      });
    });

    var initial = buttons.filter(function (btn) {
      return btn.getAttribute("aria-selected") === "true";
    })[0] || buttons[0];
    if (initial) {
      activate(initial.getAttribute("data-tab"));
    }
  }

  function init() {
    document.querySelectorAll(".rc-tabs").forEach(initTabGroup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
