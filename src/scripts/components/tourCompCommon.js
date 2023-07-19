const popCommon = (() => {
  let CLASS_POPOPEN = 'popOpen';

  return {
    setScroll: (popOpen, mobileOnly) => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const contentWrapper = document.querySelector('.contentWrapper');
      const currentTop = parseFloat(getComputedStyle(contentWrapper).top) * -1;
      contentWrapper.style.setProperty('--window-scrollY', `${window.scrollY * -1}px`);

      if (mobileOnly === true) {
        CLASS_POPOPEN = 'popOpenMobile';
      }

      if (popOpen === true) {
        contentWrapper.classList.add(CLASS_POPOPEN);
      } else {
        contentWrapper.classList.remove(CLASS_POPOPEN);

        if (mobileOnly === true) {
          if (mobile) {
            window.scrollTo(0, currentTop);
          }
        } else {
          window.scrollTo(0, currentTop);
        }
      }
    }
  };
})();
