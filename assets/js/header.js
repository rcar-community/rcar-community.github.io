document.addEventListener('DOMContentLoaded', function() {
  let animationId = null;

  function updateLayout() {
    const header = document.querySelector('.site-header');
    const wrapper = document.querySelector('.home-wrapper');
    const leftNavContent = document.querySelector('.left-nav-content');
    const rightLinksContent = document.querySelector('.right-links-content');

    if (!header) return;
    const height = header.offsetHeight;

    if (wrapper) wrapper.style.marginTop = height + 'px';
    if (leftNavContent) {
      leftNavContent.style.top = height + 'px';
      leftNavContent.style.maxHeight = 'calc(100vh - ' + height + 'px)';
    }
    if (rightLinksContent) {
      rightLinksContent.style.top = height + 'px';
      rightLinksContent.style.maxHeight = 'calc(100vh - ' + height + 'px)';
    }
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const headings = mainContent.querySelectorAll('h2, h3, h4');
      headings.forEach(function(h) {
        h.style.scrollMarginTop = (height + 8) + 'px';
      });
    }
  }

  function startAnimation() {
    if (animationId) return;
    function loop() {
      updateLayout();
      animationId = requestAnimationFrame(loop);
    }
    animationId = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  updateLayout();

  window.addEventListener('resize', updateLayout);

  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 0) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    }
    updateLayout();
  });

  const header = document.querySelector('.site-header');
  if (header) {
    header.addEventListener('transitionstart', startAnimation);
    header.addEventListener('transitionend', function() {
      updateLayout();
      stopAnimation();
    });
  }
});
