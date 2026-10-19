document.addEventListener("DOMContentLoaded", function () {
  function makeCopyButton(getCode) {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerHTML =
      '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2" stroke-width="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke-width="2" fill="none"/></svg>';
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(getCode()).then(function () {
        const original = button.innerHTML;
        button.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" fill="none"/></svg>';
        setTimeout(function () {
          button.innerHTML = original;
        }, 1500);
      });
    });
    return button;
  }

  // ラベル付きコードブロック
  document.querySelectorAll("div[data-filename]").forEach(function (wrapper) {
    const header = document.createElement("div");
    header.className = "code-header";

    const label = document.createElement("span");
    label.className = "code-label";
    label.textContent = wrapper.getAttribute("data-filename");

    const codeEl = wrapper.querySelector("code");
    const button = makeCopyButton(function () {
      return codeEl ? codeEl.innerText : "";
    });

    header.appendChild(label);
    header.appendChild(button);
    wrapper.insertBefore(header, wrapper.firstChild);
  });

  // ラベル無しの単独コードブロック
  document.querySelectorAll("div.highlighter-rouge").forEach(function (block) {
    if (block.closest("div[data-filename]")) return;
    const codeEl = block.querySelector("code");
    const button = makeCopyButton(function () {
      return codeEl ? codeEl.innerText : "";
    });
    button.classList.add("standalone");
    block.style.position = "relative";
    block.appendChild(button);
  });
});
