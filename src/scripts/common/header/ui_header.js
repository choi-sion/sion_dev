(function($, win, doc) {
  var CLASS_ACTIVE = 'active';
  var ARIA_EXPANDED = 'aria-expanded';

  $.extend($.fn, {
    subGateway: function() {
      var gateway = $('.gatewayMenus');
      var hasSubEl = gateway.find('.hasSub');
      var hasSubElA = hasSubEl.find('> a');

      hasSubEl.on({
        mouseenter: function() {
          $(this).addClass(CLASS_ACTIVE);
        },
        mouseleave: function() {
          $(this).removeClass(CLASS_ACTIVE);
        }
      });

      hasSubElA.on('keydown', function(e) {
        if (e.keyCode === 13) {
          $(this)
            .parent()
            .toggleClass(CLASS_ACTIVE);

          return false;
        }
      });
    },
    searchField: function() {
      if (!this.length) {
        return;
      }

      var headerSearch = $('.headerSearch');
      var searchForm = headerSearch.find('.searchFormWrap');
      var searchInput = searchForm.find('.inputSearch');
      var btnReset = searchForm.find('.serachReset');
      var autocomplete = headerSearch.find('.autocompleteWrap');
      var searchKeyword = headerSearch.find('.searchKeywordWrap');
      var keywordList = headerSearch.find('.popularList, .autocomplete').find('a');

      textRemove = function() {
        searchInput.val('');
        searchInput.focus();

        inputEvent();
      };

      searchLayerOpen = function(e) {
        var hasActive = headerSearch.hasClass(CLASS_ACTIVE);
        var isSearchBtn = $(e.target).hasClass('inputSearchBtn');
        var gnbActive = $('.allCategory').hasClass(CLASS_ACTIVE);

        if (hasActive || isSearchBtn) {
          return;
        }

        if (gnbActive) {
          gnbClose();
        }

        headerSearch.addClass(CLASS_ACTIVE);
        searchInput.focus();
      };

      searchLayerClose = function() {
        var hasActive = headerSearch.hasClass(CLASS_ACTIVE);

        if (!hasActive) {
          return;
        }

        headerSearch.removeClass(CLASS_ACTIVE);
      };

      inputEvent = function() {
        hasText = searchInput.val().length > 0;

        if (hasText) {
          autocomplete.addClass(CLASS_ACTIVE);
          searchKeyword.hide();
        } else {
          autocomplete.removeClass(CLASS_ACTIVE);
          searchKeyword.show();
        }

        switchDeleteButton();
      };

      switchDeleteButton = function() {
        searchInput[(hasText ? 'add' : 'remove') + 'Class']('hasText');
      };

      btnReset.on('click', textRemove);
      searchForm.on('click', searchLayerOpen);
      searchInput.on('input', inputEvent);

      $(doc).on('click', function(e) {
        if (headerSearch.has(e.target).length === 0) {
          searchLayerClose();
        }
      });

      //a11y
      searchForm.on('keydown', function(e) {
        if (e.keyCode === 13) {
          searchLayerOpen(e);
        }
      });
      keywordList.on('keydown', function(e) {
        var lastLi = !$(this).parent().next().length;

        if (e.keyCode === 9 && !e.shiftKey) {
          if (lastLi) {
            searchLayerClose();
            searchForm.focus();
          }
        }
      });
      searchInput.on('keydown', function(e) {
        if (e.keyCode === 9 && e.shiftKey) {
          searchLayerClose();
          searchForm.focus();
        }
      });
    },
    allCategory: function() {
      if (!this.length) {
        return;
      }

      var gnb = $(this);
      var btnAllMenu = gnb.find('.allCategoryButton');
      var btnClose = gnb.find('.closeCategoryButton');
      var gnbWrap = gnb.find('.allCategoryWrapper');
      var innerH = gnb.find('.allCategoryInner').outerHeight();

      gnbOpen = function() {
        gnb.addClass(CLASS_ACTIVE);
        gnbWrap.height(innerH);
        btnAllMenu.attr(ARIA_EXPANDED, true);
      };

      gnbClose = function() {
        gnb.removeClass(CLASS_ACTIVE);
        gnbWrap.height(0);
        btnAllMenu.attr(ARIA_EXPANDED, false);
      };

      btnAllMenu.on('click', gnbOpen);
      btnClose.on('click', gnbClose);

      $(doc).mouseup(function(e) {
        if (gnbWrap.has(e.target).length === 0) {
          gnbClose(e);
        }
      });
    },
    navigatior: function() {
      if (!this.length || $('.tourHeader').hasClass('container800')) {
        return;
      }

      var $nav = $(this);
      var navWrap = $nav.find('.localNavigation');
      var navEl = navWrap.find('> ul > li');
      var targetEl = $nav.find('.subMenuWrapper');
      var depth3El = $nav.find('.depth2List');
      var depthNav = depth3El.find('> li > a');

      var categoryOpen = function($el) {
        var wrap = $el.find('.subMenuWrapper');

        $el
          .addClass(CLASS_ACTIVE)
          .siblings()
          .removeClass(CLASS_ACTIVE);

        targetEl
          .css({height: 0});

        if (wrap.length) {
          var listEl = wrap.find('.subMenuInner');
          var listHeight = listEl.outerHeight();
          var hasActive = $el.find('.depth2List > li.active');
          var depth3Height = numNullCheck(hasActive.find('.depth3Wrapper').outerHeight());
          var depth3ElMaxHeight = listHeight + depth3Height;

          wrap
            .height(depth3ElMaxHeight);

          $('select').blur();
        }
      };

      var numNullCheck = function(str) {
        var newStr = str;
        if (newStr === null || newStr === '' || newStr === undefined || newStr === 'undefined') {
          newStr = 0;
        }

        return newStr;
      };

      var categoryClose = function($el) {
        $el
          .removeClass(CLASS_ACTIVE);
        targetEl
          .css({height: 0});
      };

      var depth2Tab = function() {
        $(this)
          .parent()
          .addClass(CLASS_ACTIVE)
          .siblings()
          .removeClass(CLASS_ACTIVE);

        var subWrapper = $(this);
        var listEl = $('.subMenuInner');
        var listWrapper = subWrapper.parents('.subMenuWrapper');
        var depth3El = subWrapper.parent().find('.depth3Wrapper');
        var depth3ElMaxHeight = listEl.outerHeight() + depth3El.outerHeight();
        listWrapper.height(depth3ElMaxHeight);
      };

      var timer = null;
      var delay = 500;
      navEl.on({
        'mouseenter focusin': function() {
          var _this = $(this);
          clearTimeout(timer);
          categoryOpen(_this);
        },
        'mouseleave': function() {
          var _this = $(this);
          timer = setTimeout(function() {
            categoryClose(_this);
          }, delay);
        }
      });

      depthNav.on('mouseenter focusin', depth2Tab);
    },
    rollingBanner: function() {
      if (!this.length) {
        return;
      }

      var banner_idx = 1;
      setInterval(function() {
        var idx = banner_idx;
        var wrap = document.querySelector('.headerMarketing');
        var ul = wrap.querySelector('ul');
        var arrBannerImg = ul.querySelectorAll('li');
        var bannerCnt = arrBannerImg.length;

        document.querySelector('.headerMarketing li:nth-child(' + idx + ')').style.display = 'none';
        idx = idx + 1;

        if (idx > bannerCnt) {
          idx = idx - bannerCnt;
        }

        document.querySelector('.headerMarketing li:nth-child(' + idx + ')').style.display = 'list-item';
        banner_idx = idx;
      }, 2000);
    }
  });

  $(document).ready(function() {
    $('.gatewayMenus').subGateway();
    $('.headerSearch').searchField();
    $('.rollingBanner').rollingBanner();
    $('.navigationWrapper').navigatior();
    $('.allCategory').allCategory();
  });
})(jQuery, window, document);