document.addEventListener('DOMContentLoaded', function () {
  const leftNav = document.querySelector('.left-nav');
  if (!leftNav) return;

  const content = document.querySelector('.main-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3, h4');
  if (headings.length === 0) return;

  const nav = document.createElement('nav');
  nav.className = 'toc';

  let currentH2Children = null;
  let currentH3Children = null;
  let h2Counter = 0;
  let h3Counter = 0;
  let h4Counter = 0;

  const headingArray = Array.from(headings);

  function hasChildren(index, parentTag) {
    const childTag = parentTag === 'H2' ? 'H3' : 'H4';
    for (let i = index + 1; i < headingArray.length; i++) {
      if (headingArray[i].tagName === parentTag) break;
      if (headingArray[i].tagName === childTag) return true;
    }
    return false;
  }

  headingArray.forEach(function (heading, index) {
    if (!heading.id) {
      heading.id = heading.textContent.trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }

    if (heading.tagName === 'H2') {
      h2Counter++;
      h3Counter = 0;
      h4Counter = 0;

      const children = document.createElement('div');
      children.className = 'toc-children';
      children.style.display = 'none';
      currentH2Children = children;
      currentH3Children = null;

      const item = document.createElement('div');
      item.className = 'toc-h2-item';

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = h2Counter + '. ' + heading.textContent.replace(/^\d+\.\s*/, '');

      item.appendChild(link);

      if (hasChildren(index, 'H2')) {
        const toggle = document.createElement('span');
        toggle.className = 'toc-toggle';
        toggle.textContent = ' ▶';

        (function(ch, tg) {
          tg.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpen = ch.style.display !== 'none';
            ch.style.display = isOpen ? 'none' : 'block';
            tg.textContent = isOpen ? ' ▶' : ' ▼';
          });
        })(children, toggle);

        item.appendChild(toggle);
      }

      nav.appendChild(item);
      nav.appendChild(children);

    } else if (heading.tagName === 'H3' && currentH2Children) {
      h3Counter++;
      h4Counter = 0;

      const children = document.createElement('div');
      children.className = 'toc-children';
      children.style.display = 'none';
      currentH3Children = children;

      const item = document.createElement('div');
      item.className = 'toc-h3-item';

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = h2Counter + '.' + h3Counter + '. ' + heading.textContent.replace(/^\d+\.\d+\s*/, '');

      item.appendChild(link);

      if (hasChildren(index, 'H3')) {
        const toggle = document.createElement('span');
        toggle.className = 'toc-toggle';
        toggle.textContent = ' ▶';

        (function(ch, tg) {
          tg.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpen = ch.style.display !== 'none';
            ch.style.display = isOpen ? 'none' : 'block';
            tg.textContent = isOpen ? ' ▶' : ' ▼';
          });
        })(children, toggle);

        item.appendChild(toggle);
      }

      currentH2Children.appendChild(item);
      currentH2Children.appendChild(children);

    } else if (heading.tagName === 'H4' && currentH3Children) {
      h4Counter++;

      const child = document.createElement('div');
      child.className = 'toc-h4-item';

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = h2Counter + '.' + h3Counter + '.' + h4Counter + '. ' + heading.textContent.replace(/^\d+\.\d+\.\d+\s*/, '');

      child.appendChild(link);
      currentH3Children.appendChild(child);
    }
  });

  leftNav.innerHTML = '';
  const navWrapper = document.createElement('div');
  navWrapper.className = 'left-nav-content';
  const title = document.createElement('div');
  title.className = 'toc-title';
  title.textContent = '♦Contents♦';
  navWrapper.appendChild(title);
  navWrapper.appendChild(nav);
  leftNav.appendChild(navWrapper);
});
