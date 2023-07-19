(() => {
  const CLASS_TOURCOMPLAYER = 'jsTourCompLayer';
  const CLASS_VISIBLE = 'visible';
  const CLASS_ANIMATE = 'animate';

  const layerOpenButton = document.querySelectorAll('button[data-comp-layer-open]');
  const layerCloseButton = document.querySelectorAll(`.${CLASS_TOURCOMPLAYER} .layerCloseButton`);

  const setLayer = {
    openTarget: e => {
      let targetLayer;
      const dataCompLayer = e.target.dataset.compLayerOpen;

      if (dataCompLayer.length) {
        targetLayer = document.querySelector(`.${dataCompLayer}`);
      } else {
        targetLayer = e.target.parentNode.querySelector(`.${CLASS_TOURCOMPLAYER}`);
      }

      popCommon.setScroll(true, true);
      targetLayer.classList.add(CLASS_VISIBLE);

      setTimeout(() => {
        targetLayer.classList.add(CLASS_ANIMATE);
      }, 50);

      const targetInputSearch = targetLayer.querySelector('input[type="search"]');
      if (targetInputSearch) {
        targetInputSearch.focus();
      }
    },
    close: currentLayer => {
      popCommon.setScroll(false, true);
      currentLayer.classList.remove(CLASS_ANIMATE);

      setTimeout(() => {
        currentLayer.classList.remove(CLASS_VISIBLE);
      }, 300);
    },
    closeTarget: e => {
      setLayer.close(e.target.closest(`.${CLASS_TOURCOMPLAYER}`));
    }
  };

  layerOpenButton.forEach(b => b.addEventListener('click', e => setLayer.openTarget(e)));
  layerCloseButton.forEach(b => b.addEventListener('click', e => setLayer.closeTarget(e)));

  //레이어 외 클릭 시 레이어 닫기
  document.addEventListener('click', e => {
    const currentActiveLayer = document.querySelector(`.${CLASS_TOURCOMPLAYER}.${CLASS_ANIMATE}`);

    if (!e.target.closest(`.${CLASS_TOURCOMPLAYER}`) && currentActiveLayer) {
      if (e.target !== currentActiveLayer.previousElementSibling) { //UI프리뷰 진입시 달력 로드 trigger click 방지
        setLayer.close(currentActiveLayer);
      }
    }
  });
})();
