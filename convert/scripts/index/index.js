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
      };

      $(window).on('popstate', function(e) {
        if (e.originalEvent.state) {
          initialSelection();
        }
      });

      initialSelection();
    }
  });

  $('.pages').pageSwitcher();
  $('.splitter').splitLayout();
})(jQuery);
