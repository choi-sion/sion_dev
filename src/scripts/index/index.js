;(function($, undefined) {
  $.extend($.fn, {
    splitLayout: function(opts) {
      var $splitter = this.eq(0);
      var $asideCol = $('#asideCol');
      var cookieName = 'shoppingMobile_asideWidth';
      var defaults = {
        limit: {
          min: 150,
          max: 600
        }
      };

      opts = $.extend({}, defaults, opts);

      $asideCol.css({
        width: Cookies.get(cookieName)
      });

      $splitter.on('mousedown', function(e) {
        var $this = $(this);
        e.preventDefault();
        $(document).on({
          mousemove: function(e) {
            if (e.pageX > opts.limit.min && e.pageX < opts.limit.max) {
              $asideCol.css({
                width: e.pageX
              });
            }

            $(document.body).addClass('resizing');
          },
          mouseup: function(e) {
            $(this).off('mousemove');
            $(document.body).removeClass('resizing');

            var width = Math.min(Math.max(parseInt(e.pageX), opts.limit.min), opts.limit.max);
            Cookies.set(cookieName, width);
          }
        });
      });
    },

    search: function(opts) {
      var defaults = {
        delay: 300,
        targetWrapper: '.asideWrapper',
        targetGroups: '.group',
        groupVisibilityClass: 'visible',
        itemVisibilityClass: 'visibleItem',
        searchStatusClass: 'searchResult'
      };

      var $input = this.eq(0);
      var $reset = $input.next('.resetButton');

      opts = $.extend({}, defaults, opts);

      if (!$input.length) {
        return;
      }

      var $wrapper = $(opts.targetWrapper);
      var $groups = $wrapper.find(opts.targetGroups);

      var reset = function(e) {
        e.preventDefault();
        $input
          .val('')
          .trigger('input')
          .focus();
      };

      var $notFound = $('<p/>', {
        'class': 'empty',
        text: 'No results found.'
      });

      var searchIt = function(res) {
        var keyword = res.trim();
        var regexp = new RegExp(keyword, 'g');
        var isMatched = false;

        $notFound.remove();

        $groups
          .removeClass(opts.groupVisibilityClass)
          .find('.visibleItem')
          .removeClass(opts.itemVisibilityClass);

        $wrapper
          .find('mark')
          .contents()
          .unwrap();

        if (!keyword) {
          $wrapper.removeClass(opts.searchStatusClass);
          return;
        }

        $wrapper.addClass(opts.searchStatusClass);

        $groups.each(function(i, v) {
          var $group = $(this);
          var $h3 = $group.find('h3');
          var groupTitle = $h3.text();
          var $items = $group.find('.innerLink');
          var markedKeyword = '<mark>' + keyword + '</mark>';

          $group.removeClass(opts.groupVisibilityClass);
          $items
            .parent('li')
            .removeClass(opts.itemVisibilityClass);

          if (~groupTitle.indexOf(keyword)) {
            $h3.html(groupTitle.replace(regexp, markedKeyword));
            $group.addClass(opts.groupVisibilityClass);

            $items
              .parent()
              .addClass(opts.itemVisibilityClass);

            isMatched = true;
          }

          $items.each(function() {
            var $item = $(this);
            var pageName = $item.text();

            if (~pageName.indexOf(keyword)) {
              $group.addClass(opts.groupVisibilityClass);
              $item
                .html(pageName.replace(regexp, markedKeyword))
                .parent()
                .addClass(opts.itemVisibilityClass);

              isMatched = true;
            }
          });
        });

        if (!isMatched) {
          $wrapper.append($notFound);
        }
      };

      var inputTimeout;
      var keyInput = function() {
        var _this = this;

        if (inputTimeout) {
          clearTimeout(inputTimeout);
        }

        inputTimeout = setTimeout(function() {
          searchIt(_this.value);
        }, opts.delay);
      };

      $input.on('input', keyInput);
      $reset.on('click', reset);
      return $input;
    },

    pageSwitcher: function() {
      var $menu = this.eq(0);
      var $menuItems = $menu.find('.innerLink');
      var $header = $('.contentHeader');
      var $groupNameElem = $header.find('.groupName');
      var $pageNameElem = $header.find('.pageName');
      var $urlElem = $header.find('.url');
      var $newWinElem = $header.find('.openWithNewWindow');

      var pageName = function() {
        return window.location.hash.slice(1);
      };

      var historyState = function(method, $elem) {
        var token = $elem.data('token');

        history[method]({
          elem: token
        }, null, '#' + token);
      };

      var menuHighlightChanger = function($elem) {
        $menuItems.each(function() {
          $(this).parent().removeClass('current');
        });

        $elem.parent().addClass('current');
      };

      var menuSlider = function($elem) {
        var padding = $menu.offset().top;
        var currentScrollTop = $elem.offset().top + $menu.scrollTop();
        var top = $menu.scrollTop();
        var bottom = top + $menu.height();
        var isAbove = currentScrollTop > top + padding;
        var isBelow = currentScrollTop < bottom;
        var scrollTo = currentScrollTop;
        var gap = 40;

        if (!isAbove || !isBelow) {
          scrollTo -= !isAbove ? padding + gap : $menu.height() - gap;

          $menu.animate({
            scrollTop: scrollTo
          }, 300);
        }
      };

      var switcher = function($elem) {
        var $frame = $('#contentFrame');
        var frameLocation = $frame.contents()[0].location;
        var frameSrc = frameLocation.pathname + frameLocation.search;

        $frame.replaceWith($('<iframe/>', {
          attr: {
            id: 'contentFrame',
            src: $elem.attr('href'),
            'class': 'frame'
          },
          on: {
            load: function() {
              var newFrameLocation = $(this).contents()[0].location;
              var newFrameSrc = newFrameLocation.pathname + newFrameLocation.search;
              var $targetElem = $menuItems.filter('[href="' + newFrameSrc + '"]');

              if (newFrameSrc === frameSrc || !$targetElem.length) {
                return;
              }

              $frame = $(this);
              frameLocation = newFrameLocation;
              frameSrc = newFrameSrc;

              menuHighlightChanger($targetElem);
              $groupNameElem.text($targetElem.data('groupName'));
              $pageNameElem.text($targetElem.text());
              $urlElem.text($targetElem.attr('href'));
              $newWinElem.attr('href', $targetElem.attr('href'));
              historyState('replaceState', $targetElem);
              menuSlider($targetElem);
            }
          }
        }));
      };

      $menuItems.on('click', function(e) {
        e.preventDefault();

        if (e.which === 2) {
          window.open(this.href);
          return;
        }

        switcher($(this));
        historyState('pushState', $(this));
      });

      var initialSelection = function() {
        var page = pageName();
        var $selectedMenu;

        if (page) {
          $selectedMenu = $menuItems.filter('[data-token="' + page + '"]');
        } else {
          $selectedMenu = $menuItems.eq(0);
        }

        switcher($selectedMenu);

        // $menuItems.each(function() {
        //   if ($(this).data('token') === pageName()) {
        //     switcher($(this));
        //     return false;
        //   }
        // });
      };

      $(window).on('popstate', function(e) {
        if (e.originalEvent.state) {
          initialSelection();
        }
      });

      initialSelection();
    },

    toggleLayout: function() {
      var $button = this.eq(0);
      var $target = $button.parents('.projectInfo');
      var cookieName = 'shoppingMobile_infoboxStatus';

      var statusChange = function(method) {
        var before = 'collapsed';
        var after = 'expanded';

        if (method === 'collapse') {
          before = [after, after = before][0];
        }

        if ($target.hasClass(after)) {
          return;
        }

        $target
          .removeClass(before)
          .addClass(after);

        Cookies.set(cookieName, after);
      };

      var toggleIt = function(e) {
        var isExpanded = $target.hasClass('expanded');
        var action = isExpanded ? 'collapse' : 'expand';

        statusChange(action);
        e.preventDefault();
      };

      var init = function() {
        var savedVal = Cookies.get(cookieName);
        var isCollapsed = savedVal === 'collapsed';
        var initStatus = isCollapsed ? 'collapse' : 'expand';

        statusChange(initStatus);
      };

      init();
      $button.on('click', toggleIt);
    }
  });

  $('.pages').pageSwitcher();
  $('.splitter').splitLayout();
  $('#searchInput').search();
  $('.viewToggleButton').toggleLayout();
})(jQuery);
