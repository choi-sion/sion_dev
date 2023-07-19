;(function($, win, doc) {
  window.onload = function() {
    var CLASS_ACTIVE = 'active';

    var corpMenu = function() {
      var corpItem = document.querySelectorAll('.corpList>li');

      var handler = {
        show: function(e) {
          var depth = e.target.querySelector('.depth');
          var hasDepth = e.target.contains(depth);

          if (!hasDepth) {
            return false;
          }

          e.target.classList.add(CLASS_ACTIVE);
        },
        hide: function(e) {
          e.target.classList.remove(CLASS_ACTIVE);
        }
      };

      corpItem.forEach(function(item) {
        item.addEventListener('mouseenter', handler.show);
      });

      corpItem.forEach(function(item) {
        item.addEventListener('mouseleave', handler.hide);
      });
    };

    corpMenu();
  };
})(jQuery, window, document);
