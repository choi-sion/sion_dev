(() => {
  const ARIA_SELECTED = 'aria-selected';
  const tabBtns = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  const tabEvent = e => {
    const index = Array.from(tabBtns).indexOf(e.target);

    tabBtns.forEach(btn => btn.setAttribute(ARIA_SELECTED, 'false'));
    e.target.setAttribute(ARIA_SELECTED, 'true');

    tabPanels.forEach(panel => panel.classList.remove('active'));
    tabPanels[index].classList.add('active');

    window.scroll(0, 0);
  };

  tabBtns.forEach(btn => btn.addEventListener('click', tabEvent));
})();
