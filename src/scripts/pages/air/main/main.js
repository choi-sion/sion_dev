;(function($, win, doc) {
  function tab() {
    var targetId;
    var currentItem;
    var $tabWrap = $('.airTabWrap');

    var activate = function(elem) {
      elem.addClass('selected');
      elem
        .parents()
        .find('#'+targetId)
        .addClass('current');
      currentItem = elem;
    };

    var inactivate = function() {
      $('button[aria-controls="'+targetId+'"]')
        .siblings()
        .removeClass('selected');
      $('#'+targetId)
        .siblings()
        .removeClass('current');
    };

    var current = function() {
      $tabWrap.each(function() {
        $(this)
          .find('.tabContain')
          .eq(0)
          .addClass('current');
      });
    };

    var tabHandler = function(e) {
      var targetElem = $(e.target);
      targetId = targetElem.attr('aria-controls');

      if (currentItem) {
        inactivate(currentItem);
      }

      if (targetElem) {
        activate(targetElem);
      }
    };

    activate($tabWrap.find('button[role="tab"]:first-child'));
    current();
    $tabWrap.on('click', 'button[role="tab"]', tabHandler);
  };

  function makeMainBxSliders() {
    var setCurrentNum = function(newIndex) {
      var $current = $('.current .num');
      $current.text(newIndex);
    };
    var setTabIndex = function(totalIndex) {
      var $current = $('.max .num');
      $current.text(totalIndex);
    };
    var bxSliders = [];
    var slidersOption = [
      {
        'name': 'partnerBannerView',
        'option': {
          slideWidth: 625,
          minSlides: 2,
          maxSlides: 20,
          moveSlides: 1,
          pager: false,
          controls: true,
          nextText: '다음 슬라이드',
          prevText: '이전 슬라이드',
          prependControls: true,
          roleControls: true,
          auto: true,
          pause: 3000,
          pagerType: 'short',
          onSlideBefore: function($slideElement, oldIndex, newIndex) {
            setCurrentNum(newIndex + 1);
            setTabIndex($slideElement.prevObject.length);
          }
        }
      },
      {
        'name': 'promotionSlide',
        'option': {
          slideWidth: 810,
          touchEnabled: false,
          pager: true,
          controls: false,
          prependControls: false,
          roleControls: true,
          auto: true,
          pause: 3000
        }
      }
    ];
    slidersOption.forEach(function(option) {
      var slider = $('.' + option.name).find('.slideArea').bxSlider(option.option);
      if (option.option.onSlideBefore) {
        setTabIndex(slider.getSlideCount());
      }
      bxSliders.push(slider);
    });
  };

  $(doc).ready(function() {
    tab();
    makeMainBxSliders();
  });
})(jQuery, window, document);

