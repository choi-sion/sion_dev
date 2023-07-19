;(function($, doc, win) {
  var layerPopup = function() {
    var layerEvent = function($this, event, addActiveClass) {
      var laterActiveClass = 'on';
      var $targetLayer = $('#' + $this.attr('aria-controls'));
      var $layerCloseBtn = $targetLayer.find('*[aria-label="닫기"]');
      var $layerObjTabbable = $targetLayer.find('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])').filter(function() {
        return $(this).attr('tabindex') !== '-1';
      });

      var $layerObjTabbableFirst = $layerObjTabbable && $layerObjTabbable.first();
      var $layerObjTabbableLast = $layerObjTabbable && $layerObjTabbable.last();
      var isTab = function(e) {
        return (e.keyCode || e.which) === 9;
      };

      var layerClose = function(e) {
        e.preventDefault();
        $targetLayer.removeClass(laterActiveClass);
        if (laterActiveClass) {
          $targetLayer.removeClass(addActiveClass);
        }
        setTimeout(function() {
          $this.focus();
        }, 0);
        $(document).off('keydown');
      };

      var focusLayer = function() {
        if ($this[0].nodeName === 'DIV') {
          return;
        }

        setTimeout(function() {
          $layerObjTabbableFirst.focus();
        }, 0);
      };

      var keydown = {
        first: function($firstEl, $lastEl) {
          $firstEl.on('keydown', function(event) {
            if (event.shiftKey && isTab(event)) {
              event.preventDefault();
              $lastEl.focus();
            }
          });
        },
        last: function($firstEl, $lastEl) {
          $lastEl.on('keydown', function(event) {
            if (!event.shiftKey && isTab(event)) {
              event.preventDefault();
              $firstEl.focus();
            }
          });
        },
        init: function($fEl, $lEl) {
          keydown.first($fEl, $lEl);
          keydown.last($fEl, $lEl);
        }
      };

      var keyBoardTabTrap = function() {
        keydown.init($layerObjTabbableFirst, $layerObjTabbableLast);

        $layerObjTabbable.on('click', function() {
          if ($(this).attr('aria-expanded') === undefined) {
            return;
          }

          $layerObjTabbableFirst.off('keydown');
          $layerObjTabbableLast.off('keydown');

          setTimeout(function() {
            $layerObjTabbable = $targetLayer.find('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])').filter(function() {
              return $(this).attr('tabindex') !== '-1';
            });

            $layerObjTabbableFirst = $layerObjTabbable && $layerObjTabbable.first();
            $layerObjTabbableLast = $layerObjTabbable && $layerObjTabbable.last();

            keydown.init($layerObjTabbableFirst, $layerObjTabbableLast);
          }, 500);
        });
      };

      var checkEsc = function(e) {
        var keyType = e.keyCode || e.which;

        if (keyType === 27 && $targetLayer.hasClass(laterActiveClass)) {
          layerClose();
          $layerCloseBtn.trigger('click');
        }
      };

      var toggleClass = function() {
        $('.searchItem .searchLayer').removeClass(laterActiveClass);
        $targetLayer.addClass(laterActiveClass);
        $targetLayer.addClass(addActiveClass);
      };

      var init = function(e) {
        e.preventDefault();

        toggleClass();
        keyBoardTabTrap();
        focusLayer();

        $layerCloseBtn.off('click');
        $layerCloseBtn.on('click', layerClose);
        $(document).on('keydown.layer_keydown', function(event) {
          checkEsc(event);
        });

        $(document).mouseup(function(e) {
          if ($targetLayer.has(e.target).length === 0 && $targetLayer.hasClass('on')) {
            layerClose(e);
          }
        });
      };

      init(event);
    };

    $('.openLayerBtn').on('click', function(e) {
      if ($(this).hasClass('filBtn')) {
        var trNum = $(this).closest('.col').prevAll().length;
        var arrFilght = $(this).hasClass('arr');
        var addActiveClass;
        if (arrFilght) {
          switch (trNum) {
          case 1:
            addActiveClass = 'second arr';
            break;
          case 2:
            addActiveClass = 'third arr';
            break;
          default :
            addActiveClass = 'first arr';
          };
        } else {
          switch (trNum) {
          case 1:
            addActiveClass = 'second';
            break;
          case 2:
            addActiveClass = 'third';
            break;
          default :
            addActiveClass = 'first';
          };
        }

        if ($(e.target).attr('aria-controls') === 'peopAirSelect' && $('.schFlight').hasClass('multi')) {
          addActiveClass = 'third';
        }
      }

      layerEvent($(this), e, addActiveClass);
    });

    $('*[class^=openLayer] input').on('focus', function(e) {
      layerEvent($(this).parent(), e);
    });
  };

  layerPopup();

  $('html').on('click', function(e) {
    if ($('.searchLayer.on').length === 0) {
      return;
    }

    if (e.target.nodeName === 'BUTTON') {
      return;
    }

    if (e.target.nodeName === 'INPUT') {
      return;
    }

    if ($(e.target).parents('.openLayerBtn').length) {
      return;
    }

    if ($(e.target).parents('.searchLayer').length) {
      return;
    }

    $('.searchLayer').removeClass('on');
  });
})(jQuery, document, window);
