document.addEventListener("DOMContentLoaded", function () {
  const popup = document.createElement("img");
  popup.className = "hover-popup";
  popup.style.position = "absolute";
  popup.style.display = "none";
  popup.style.pointerEvents = "none";
  document.body.appendChild(popup);

  const margin = 20;
  const offset = 15;
  const isTouchDevice = 'ontouchstart' in window;

  let currentTarget = null;

  function updatePosition(e = null) {
    const popupWidth = popup.offsetWidth || 300;
    const popupHeight = popup.offsetHeight || 200;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left, top;

    if (isTouchDevice || !e) {
      left = (screenWidth - popupWidth) / 2;
      top = (screenHeight - popupHeight) / 2;
    } else {
      left = e.clientX + offset;
      top = e.clientY + offset;
    }

    left = Math.min(left, screenWidth - popupWidth - margin);
    top = Math.min(top, screenHeight - popupHeight - margin);

    left = Math.max(left, margin);
    top = Math.max(top, margin);

    popup.style.left = left + window.scrollX + "px";
    popup.style.top = top + window.scrollY + "px";
  }

  popup.onload = () => {
    updatePosition();
  };

  document.querySelectorAll(".hover-img").forEach(item => {

    // ===== PC =====
    item.addEventListener("mouseenter", e => {
      if (isTouchDevice) return;
      currentTarget = item;
      popup.src = item.dataset.img;
      popup.style.display = "block";
    });

    item.addEventListener("mousemove", e => {
      if (isTouchDevice) return;
      updatePosition(e);
    });

    item.addEventListener("mouseleave", () => {
      if (isTouchDevice) return;
      popup.style.display = "none";
    });

    // ===== スマホ =====
    item.addEventListener("click", e => {
      if (!isTouchDevice) return;

      e.preventDefault();

      if (popup.style.display === "block" && popup.src === item.dataset.img) {
        popup.style.display = "none";
        return;
      }

      currentTarget = item;
      popup.src = item.dataset.img;
      popup.style.display = "block";

      popup.style.width = (window.innerWidth - margin * 2) + "px";
      popup.style.height = "auto";

      updatePosition();
    });
  });

  document.addEventListener("click", e => {
    if (!isTouchDevice) return;
    if (!e.target.classList.contains("hover-img")) {
      popup.style.display = "none";
    }
  });
});
