;(function($) {
  $.extend($.fn, {
    lazyLoad: function() {
      var $this = $(this);

      if (!$this.find('.lazy').length) {
        return;
      }

      $this.find('.lazy').each(function() {
        var changeSrc = $(this).data('src');

        $(this)
          .attr('src', changeSrc)
          .removeClass('lazy')
          .on('error', function() {
            this.src = 'http://bimage.interpark.com/renewPark/reBookpark/common/noImage/singleNoimg.jpg';
          });
      });
    },

    slider: function(options) {
      var $this = $(this);

      var moveSlideLength = options.moveSlides ? options.moveSlides : 1;
      var minSlideLength = options.minSlides ? options.minSlides : 1;
      var viewSlideLength = Math.max(moveSlideLength, minSlideLength);

      // 2개 이상의 세트회전시 세트로 딱 나눠지지 않는 갯수 지우기(요청된 내용)
      var deleteRemnants = function() {
        var delLength = $this.find('li').length % moveSlideLength;

        for (var d = 0; d < delLength; d++) {
          $this.find('li:last-child').remove();
        }
      };
      deleteRemnants();

      var defaults = {
        speed: 300,
        slideWidth: 196,
        responsive: false,
        minSlides: 1,
        moveSlides: 1,
        pager: true,
        controls: false,
        onSlideBefore: function($slideElement, oldIndex, newIndex) {
          for (var i = 0; i < moveSlideLength; i++) {
            var targetIndex = i + (moveSlideLength * newIndex);
            var targetEl = $slideElement.prevObject.eq(targetIndex);

            targetEl.lazyLoad();
          }

          $slideElement.lazyLoad();
          $this.find('.bx-clone').lazyLoad(); // 슬라이드 이동시 clone 슬라이드도 미리 받아놓음
        },
        onSliderLoad: function(currentIndex) {
          if (viewSlideLength === 1) {
            $this.find('> li:not(.bx-clone)').eq(currentIndex).lazyLoad();
          } else {
            for (var i = currentIndex; i < currentIndex + viewSlideLength; i++) {
              var targetIndex = i + currentIndex;
              $this.find('> li:not(.bx-clone)').eq(targetIndex).lazyLoad();
            }
          }
        }
      };

      options = $.extend({}, defaults, options);

      $this.bxSlider(options);
    },
    tabChange: function(options) {
      var $tabEl = $(this);
      var tabParent = $tabEl.parent();
      var tabs = tabParent.parent().children();

      var defaults = {
        'tabIndex': tabParent.index(),
        'targetGroup': '.' + $tabEl.data('target-group'),
        'targetContent': '.' + $tabEl.data('target-content')
      };

      options = $.extend({}, defaults, options);

      var targetEl = $(options.targetGroup).find(options.targetContent);

      tabs
        .eq(options.tabIndex)
        .addClass('current')
        .siblings()
        .removeClass('current');

      targetEl
        .eq(options.tabIndex)
        .addClass('current')
        .siblings()
        .removeClass('current');
    }
  });

  function topMainBanner(speed) {
    var $wrapper = $('.topBannerWrap');
    var bannerList = $wrapper.find('.topMainBannerList');
    var tabList = $wrapper.find('.topBannerTabInner');
    var bannerEl = bannerList.find('.topMainBanner');
    var tabEl = tabList.find('.topMainBannerTab a');

    if (bannerEl.length !== tabEl.length) {
      return;
    }

    var intervalEvent = function() {
      var currentNo = bannerList.find('.current').index();
      var changeNo = currentNo === bannerEl.length - 1 ? 0 : currentNo + 1;

      tabEl.tabChange({'tabIndex': changeNo});
    };

    var interval = setInterval(intervalEvent, speed);

    $wrapper.on({
      'mouseover': function() {
        clearInterval(interval);
      },
      'mouseleave': function() {
        interval = setInterval(intervalEvent, speed);
      }
    });

    tabEl.on('mouseover', function(e) {
      e.preventDefault();

      $(this).tabChange();
    });
  }
  topMainBanner(6000);


  function editorRecommendTab() {
    var $wrapper = $('.editorRecommends');
    var slide = $wrapper.find('.editorRecommendSlide');
    var recommendTab = slide.find('.editorRecommendTabs li a');

    recommendTab.on('mouseover', function() {
      var tabIndex = $(this).parent('li').index();
      var tabNumber = $(this).closest('.editorRecommendSlide').index();

      $(this)
        .parent()
        .addClass('current')
        .siblings()
        .removeClass('current');

      slide
        .eq(tabNumber)
        .find('.editorRecommendContent')
        .eq(tabIndex)
        .addClass('current')
        .siblings()
        .removeClass('current');
    });
  }
  editorRecommendTab();

  function pointBookAccodion() {
    var speed = 250;
    var $wrapper = $('.pointBookSection .accodionWrap');
    var accodion = $wrapper.find('.accodion');

    var accodionWidth = {
      'expand': '405px',
      'collapse': '131px'
    };

    accodion.on('mouseenter', function() {
      $(this)
        .addClass('current')
        .find('a')
        .stop()
        .animate({'width': accodionWidth.expand}, speed)
        .parent()
        .siblings()
        .removeClass('current')
        .find('a')
        .stop()
        .animate({'width': accodionWidth.collapse}, speed);
    });
  }
  pointBookAccodion();

  function bestSellerSelect() {
    var $wrapper = $('.bestSellerHeader .selectStyle');
    var selector = $wrapper.find('.selected');
    var optionWrap = $wrapper.find('.select');
    var option = optionWrap.find('a');

    selector.on('click', function(e) {
      e.preventDefault();

      optionWrap.show();
    });

    option.on('click', function(e) {
      e.preventDefault();

      var optionName = $(this).text();
      var optionRel = $(this).attr('rel');

      selector
        .attr('rel', optionRel)
        .find('.optionName')
        .text(optionName);

      optionWrap.hide();
    });

    optionWrap.on('mouseleave', function() {
      optionWrap.hide();
    });
  }
  bestSellerSelect();

  function bestSellerTab() {
    var $wrapper = $('.bestSellerContents');
    var tabs = $wrapper.find('.bestSellerTabs ul li a');
    var contents = $wrapper.find('.bestSellerRank');

    if (tabs.length !== contents.length) {
      return;
    }

    tabs.on('click', function(e) {
      e.preventDefault();

      $(this).tabChange();
    });
  }
  bestSellerTab();

  function giftAccodion() {
    var $wrapper = $('.bestSection .giftWrap');
    var accodion = $wrapper.find('.accodion');
    var accodionTitle = accodion.find('.title');
    var accodionContent = accodion.find('.accodionContent');

    var contentHeight = accodionContent.find('img').outerHeight();
    var speed = 250;

    var accodionEvent = function() {
      accodion.each(function() {
        var $this = $(this);

        if ($this.hasClass('current')) {
          $this
            .find('.accodionContent')
            .stop()
            .animate({
              'height': contentHeight
            }, speed)
            .parent()
            .siblings()
            .find('.accodionContent')
            .stop()
            .animate({
              'height': 0
            }, speed);
        }
      });
    };
    accodionEvent();

    accodionTitle.on('click', function(e) {
      e.preventDefault();

      $(this)
        .parent()
        .addClass('current')
        .siblings()
        .removeClass('current');

      accodionEvent();
    });
  }
  giftAccodion();

  $('.topSideSlider .sliderWrap').slider({
    slideWidth: 220,
    responsive: false,
    randomStart: true,
    auto: true,
    pause: 5000,
    autoHover: true,
    infiniteLoop: true,
    controls: true
  });

  $('.specialRecommends .editorRecommendSlider').slider({
    slideWidth: 294,
    responsive: false,
    randomStart: true,
    auto: true,
    pause: 6000,
    autoHover: true,
    infiniteLoop: true,
    stopAuto: false,
    mode: 'fade',
    speed: 0
  });

  $('.pointBookSection .sliderWrap').slider({
    slideWidth: 546,
    responsive: false,
    pager: false,
    randomStart: true,
    auto: true,
    pause: 6000,
    autoHover: true,
    infiniteLoop: true,
    controls: true
  });

  $('.bookStorySlider ul').slider({
    slideWidth: 194,
    responsive: false,
    mode: 'fade',
    speed: 0
  });

  $('.recommendReviewSection .reviewList ul').slider({
    slideWidth: 491,
    responsive: false,
    moveSlides: 2,
    maxSlides: 99,
    pager: false,
    controls: true
  });

  $('.usedBookList ul').slider({
    slideWidth: 174,
    responsive: false,
    moveSlides: 3,
    minSlides: 3,
    maxSlides: 99,
    pager: false,
    controls: true
  });

  $('.biscuitWrap ul').slider({
    slideWidth: 294,
    responsive: false,
    mode: 'fade',
    speed: 0,
    pager: false,
    controls: true
  });

  $('.musicDVDWrap ul').slider({
    slideWidth: 293,
    responsive: false,
    mode: 'fade',
    speed: 0,
    pager: false,
    controls: true
  });

  $('.goodsShopRank ul').slider({
    slideWidth: 186,
    responsive: false,
    minSlides: 5,
    moveSlides: 5,
    maxSlides: 10,
    controls: true,
    pager: false
  });

  $('.recommendBooks').each(function() {
    $(this).find('ul').slider({
      slideWidth: 183,
      responsive: false,
      minSlides: 4,
      moveSlides: 4,
      maxSlides: 100,
      pager: false,
      controls: true
    });
  });

  $('.bannerArea').each(function() {
    $(this).find('ul').slider({
      mode: 'fade',
      responsive: false,
      pager: ($(this).find('ul li').length > 1) ? true: false,
      randomStart: true,
      speed: 0
    });
  });

  $('.specialDiscountWrap .sliders').slider({
    slideWidth: 269,
    responsive: false,
    moveSlides: 2,
    maxSlides: 99
  });

  $('.eventBooks  .sliders').slider({
    slideWidth: 127,
    responsive: false,
    moveSlides: 4,
    maxSlides: 99
  });

  function bookStory() {
    var $wrapper = $('.bookStoryContents');
    var tab = $wrapper.find('.bookStoryTab li a');

    tab.on('mouseover', function() {
      $(this).tabChange();
    });
  }
  bookStory();

  function newBookTab() {
    var options = {
      start: Math.floor(Math.random() * 5)
    };

    var $wrapper = $('.newBookSection');
    var $categoryTab = $wrapper.find('.category');
    var $categoryLink = $categoryTab.find('a');
    var categoryTabLength = $categoryTab.length;
    var start = Math.min(options.start, categoryTabLength - 1);
    var currentIndex = options.start;
    var opened = [];

    //$wrapper.find('h2').on('click', function() {
    //  alert(opened);
    //});

    $categoryLink.on('click', function(e) {
      e.preventDefault();

      $(this)
        .parent()
        .addClass('current')
        .siblings()
        .removeClass('current');

      var targetName = $(this).attr('href');

      $(targetName)
        .addClass('current')
        .siblings()
        .removeClass('current');

      currentIndex = $categoryLink.index(this);

      if (opened.indexOf(currentIndex) < 0) {
        opened.push(currentIndex);

        $(targetName).find('.sliders').slider({
          slideWidth: 925,
          responsive: false,
          mode: 'fade',
          speed: 0,
          pager: false,
          controls: true
        });
      }
    });

    $categoryTab.eq(start).find('a').trigger('click');

    var interval;
    var autoplay = function() {
      if (interval) {
        clearInterval(interval);
      }

      interval = setInterval(function() {
        var clickIndex = currentIndex + 1;

        if (clickIndex > categoryTabLength - 1) {
          clickIndex = 0;
        }

        $categoryLink.eq(clickIndex).trigger('click');
      }, 6000);
    };

    autoplay();

    $wrapper.on({
      mouseenter: function() {
        clearInterval(interval);
      },
      mouseleave: function() {
        autoplay();
      }
    });
  }
  newBookTab();
})(jQuery);
