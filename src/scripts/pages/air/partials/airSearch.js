;(function($, win, doc) {
  function makeBxSliders() {
    var setTabIndex = function(totalIndex) {
      var $current = $('.max .num');
      $current.text(totalIndex);
    };
    var bxSliders = [];
    var slidersOption = [
      {
        'name': 'searchNotice',
        'option': {
          mode: 'vertical',
          auto: true,
          minSlides: 1,
          pager: false,
          controls: false,
          autoDirection: 'prev',
          onSliderLoad: function() {
            $('.bx-clone').find('a').prop('tabIndex', '-1');
          },
          onSlideAfter: function() {
            $('.slideArea').children('li').each(function() {
              if ($(this).attr('aria-hidden') === false) {
                $(this).find('a').attr('tabIndex', '0');
              } else {
                $(this).find('a').attr('tabIndex', '-1');
              }
            });
          }
        }
      }
    ];
    slidersOption.forEach(function(option) {
      var slider = $('.' + option.name).find('.slideArea').bxSlider(option.option);
      if (option.option.onSlideBefore) {
        setTabIndex(slider.getSlideCount());
      }
      bxSliders.push(slider);

      $('.slideArea a').focusin(function() {
        slider.stopAuto();
      });
    });
  };

  function innerHtmlMultiSection() {
    var $airSearch = $('.schTabs button');

    var multi = function(multiEl) {
      document.querySelector('.schFlight').className += ' multi';

      $('button[aria-controls="'+targetId+'"]')
        .addClass('selected')
        .siblings()
        .removeClass('selected');

      if (targetId !== 'multi') {
        $('.schFlight').removeClass('multi');
        $('#clone_1').remove();
      }
    };

    var searchHandler = function(e) {
      var targetElem = $(e.target);
      targetId = targetElem.attr('aria-controls');

      if (targetElem) {
        multi();
      }
    };
    $airSearch.on('click', searchHandler);
  }

  function various() {
    var $moreBtn = $('.indMoreBtn');
    var $tabEl = $('.indTabs button');

    $tabEl.on('click', function() {
      $moreBtn.removeClass('moreBtn');
      $(this)
        .parents('.indTabsWrap')
        .siblings('.current')
        .removeClass('moreView');
    });

    $moreBtn.on('click', function() {
      $(this)
        .toggleClass('moreBtn')
        .parents('.current')
        .toggleClass('moreView');
    });
  }

  function sortList() {
    var $sortBtn = $('.sortBtn');
    var $sortList = $('.sortList');
    var $unmDate = $('.unmDate');
    var $unmList = $('.unmList');

    var openLayer = function($targetElem, temp) {
      $targetElem
        .parent()
        .children()
        .attr('aria-expanded', temp);

      if ($targetElem.context.className.match('unmDate')) {
        listSelect();

        if (temp === 'false') {
          $('button.unmBtn').text('기간');
        }
      }
    };

    var placeSelect = function() {
      elemTxt = $(this).text().trim();
      $(this)

        .attr('aria-selected', 'true')
        .siblings()
        .attr('aria-selected', 'false');

      $targetElem.text(elemTxt);
      openLayer($targetElem, 'false');
    };

    var listSelect = function() {
      $unmList.on('click', 'li', function() {
        $targetElem = $(this);
        elemTxt = $targetElem.text().trim();
        $('button.unmBtn')
          .text(elemTxt)
          .attr('aria-expanded', 'false');
        $unmList
          .attr('aria-expanded', 'false');
      });
    };

    var layerSelectHandler = function(e) {
      e.preventDefault();
      $targetElem = $(e.currentTarget);
      var label = $targetElem.attr('aria-expanded');
      temp = label !== 'true' ? 'true' : 'false';

      openLayer($targetElem, temp);
    };

    $sortBtn.on('click', layerSelectHandler);
    $sortList.on('click', 'li', placeSelect);
    $unmDate.on('click', layerSelectHandler);
  }

  function initPop() {
    $('.travelselectCity dl').on('click', 'a', function(e) {
      var targetElem = $('.travelselectCity dl a');
      targetElem.attr('aria-selected', false);
      $(e.target)
        .attr('aria-selected', true);
    });
  }

  function optionStage() {
    var quantity = function($target, $method) {
      var quantityTxt = $target.siblings('.currentQuantity').find('span');
      var stat = quantityTxt.text();
      var num = parseInt(stat, 0);

      if ($method === 'increase') {
        num++;
      } else {
        num--;
        if (num <= 0) {
          num = 0;
        }
      }
      quantityTxt.text(num);
    };

    var quantityHandler = function(e) {
      e.preventDefault();
      $targetElem = $(e.target);
      var $method = $targetElem.attr('data-method');
      quantity($targetElem, $method);
    };
    $('.controller').on('click', quantityHandler);
  }

  function uiCheckbox(el) {
    el.on('click', function() {
      var chkbox = el.find('[type=checkbox]');
      el.toggleClass('checked');
      chkbox.prop('checked', !chkbox.is(':checked'));
      return false;
    });
  }

  //투어 모바일 text switch 스크립트 동일.
  function searchDestination(e) {
    $('.searchLayerInner')[(Boolean(e.target.value.length) ? 'add' : 'remove') + 'Class']('searched');
  }

  function jsIconAnimate() {
    var getRotationDegrees = function(obj) {
      var matrix = obj.css('-webkit-transform') ||
        obj.css('-moz-transform') ||
        obj.css('-ms-transform') ||
        obj.css('-o-transform') ||
        obj.css('transform');

      if (typeof matrix === 'string' && matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      } else {
        var angle = 0;
      }

      return parseInt((angle < 0) ? angle + 360 : angle);
    };

    var textChange = function(element) {
      var $departure = element.parent().prev().children('.jsBtnDeparture');
      var $arrival = element.parent().next().children('.jsBtnArrival');

      var departureIsActive = $departure.hasClass('active');
      var arrivalIsActive = $arrival.hasClass('active');

      var $departureClone = $departure.clone().attr('class',
        $arrival.attr('class').replace('active', '').trim()
      ).addClass(departureIsActive ? 'active clone' : 'clone');
      var $arrivalClone = $arrival.clone().attr('class',
        $departure.attr('class').replace('active', '').trim()
      ).addClass(arrivalIsActive ? 'active clone' : 'clone');


      $departure.before($arrivalClone);
      $arrival.after($departureClone);

      $.when($departure, $departureClone, $arrival, $arrivalClone).then(function() {
        $departure.remove();
        $arrival.remove();

        $departureClone.removeClass('clone');
        $arrivalClone.removeClass('clone');

        element.siblings('.flightDes').removeClass('animating');
      });
    };

    $('.flightDes').on('click', '.jsIconAnimate', function(e) {
      var _this = $(this);
      $(this).siblings('.flightDes').addClass('animating');

      if ($(this).find('.jsIconRoundCircle').length) {
        var iconRotate = getRotationDegrees($(this).children('.jsIconRoundCircle')) + 180;
        $(this).children('.jsIconRoundCircle').animate({
          deg: iconRotate
        }, {
          duration: 300,
          step: function(now) {
            $(this).css({ transform: 'rotate(' + now + 'deg)' });
          },
          complete: function() {
            if (iconRotate === 360) {
              $(this).animate({ deg: 0 }, 0, function() {
                $(this).css({ transform: 'rotate(' + 0 + 'deg)' });
              });
            }
            textChange(_this);
          }
        });
      } else {
        textChange(_this);
      }
    });
  }

  $(doc).ready(function() {
    makeBxSliders();
    innerHtmlMultiSection();
    various();
    sortList();
    initPop();
    optionStage();
    jsIconAnimate();

    $('.jsSearch').on('keyup', function(event) {
      searchDestination(event);
    });

    $('.chkBox').each(function() {
      uiCheckbox($(this));
    });
  });
})(jQuery, window, document);

