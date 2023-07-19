;(function($, doc) {
  var laterActiveClass= 'active';

  var layerAccessibility = function($this) {
    var $targetLayer = $('#' + $this.attr('aria-controls'));
    var $layerCloseBtn = $targetLayer.find('*[aria-label="닫기"]');
    var $layerObjTabbable = $targetLayer.find('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])');
    var $layerObjTabbableFirst = $layerObjTabbable && $layerObjTabbable.first();
    var $layerObjTabbableLast = $layerObjTabbable && $layerObjTabbable.last();
    var isTab = function(e) {
      return (e.keyCode || e.which) === 9;
    };

    var layerClose = function() { // 레이어 닫기 동작
      setTimeout(function() {
        $this.focus();
      }, 0);
      $(document).off('keydown.lp_keydown');
    };

    var focusLayer = function() {
      setTimeout(function() {
        $layerObjTabbableFirst.focus();
      }, 0);
    };

    var keyBoardTabTrap = function() { // 키보드 이용시 tabTrap
      $layerObjTabbableFirst.on('keydown', function(event) {
        if (event.shiftKey && isTab(event)) {
          event.preventDefault();
          $layerObjTabbableLast.focus();
        }
      });

      $layerObjTabbableLast.on('keydown', function(event) {
        if (!event.shiftKey && isTab(event)) {
          event.preventDefault();
          $layerObjTabbableFirst.focus();
        }
      });
    };

    var checkEsc = function(e) { // esc 닫기 지원
      var keyType = e.keyCode || e.which;

      if (keyType === 27 && $targetLayer.hasClass(laterActiveClass)) {
        layerClose();
        $layerCloseBtn.trigger('click');
      }
    };

    var init = function() {
      keyBoardTabTrap();
      focusLayer();
      $layerCloseBtn.on('click', layerClose);
      $(document).on('keydown.layer_keydown', function(event) {
        checkEsc(event);
      });
    };

    init();
  };

  $(doc)
    .on('click', '.layerPopupButton', function() {
      var $alertButton = $(this);
      var $targetLayer = $('.commonPopup').filter(function() {
        return $(this).attr('id') === $alertButton.attr('aria-controls');
      });

      if ($('.commonPopup.' + laterActiveClass).length) {
        $('.commonPopup.' + laterActiveClass).removeClass(laterActiveClass);
      }

      $targetLayer.addClass(laterActiveClass);
      layerAccessibility($alertButton);
    })
    .on('click', '.commonPopupCloseBtn[aria-label="닫기"]', function() {
      $(this).parents('.commonPopup').removeClass(laterActiveClass).attr('aria-modal', false);
    });
})(jQuery, document);
