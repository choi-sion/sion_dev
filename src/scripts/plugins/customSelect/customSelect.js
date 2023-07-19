(function($, win, doc) {
  $.fn.customSelect = function(opts) {
    opts = opts || {};

    var settings = $.extend({
      forceiOS: false,
      includeBlank: false,
      appendTo: doc.body,
      optionTemplate: function(optionEl) {
        return optionEl.text();
      },
      triggerTemplate: function(optionEl) {
        return optionEl.text();
      }
    }, opts);

    return this.each(function(elem, i) {
      var copyOptionsToList;
      var updateTriggerText;
      var optionResize;
      var resizeTimeout;
      var $this = $(this);

      if ($this.hasClass('customized') || $this[0].tagName !== 'SELECT') {
        return;
      }

      $this.addClass('customized').css({
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        width: 1,
        height: 1,
        opacity: 0
      });

      var data = $this.data();
      var $wrapper = $this.wrap($('<div class="customSelect"/>')).parent();
      var isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
      var $appendTarget;
      var $optionsWrapper;
      var $options;
      var isOptionHovered = false;
      var isDisabled = $this.prop('disabled');

      if (isDisabled) {
        $wrapper.addClass('disabled');
      }

      if (data['class']) {
        $wrapper.addClass(data['class']);
      }

      var $trigger = $('<div/>', {
        'class': 'trigger',
        'css': {
          width: data.width
        },
        appendTo: $wrapper
      });

      if (!(isiOS && !settings.forceiOS)) {
        $appendTarget = $(settings.appendTo).length ? $(settings.appendTo) : $wrapper;

        $optionsWrapper = $('<div class="customSelectOptions"/>');
        $options = $('<ul class="customOptionUl"/>');
        $optionsWrapper.append($options).appendTo($appendTarget);
      }

      if (data.optionsClass) {
        $optionsWrapper.addClass(data.optionsClass);
      }

      updateTriggerText = function() {
        var triggerHtml = settings.triggerTemplate($this.find(':selected'));
        $trigger.html(triggerHtml);
      };

      $this.on({
        focus: function() {
          $trigger.addClass('focus');
        },
        blur: function() {
          if (isOptionHovered) {
            return;
          }

          isOptionHovered = false;

          $trigger.removeClass('focus');

          if ($trigger.hasClass('open')) {
            setTimeout(function() {
              $trigger.trigger('close');
            }, 140);
          }
        },
        enable: function() {
          $this.prop('disabled', false);
          $wrapper.removeClass('disabled');
          isDisabled = false;
          copyOptionsToList();
        },
        disable: function() {
          $this.prop('disabled', true);
          $wrapper.addClass('disabled');
          isDisabled = true;
        },
        change: function(e) {
          if (e.originalEvent && e.originalEvent.isTrusted) {
            e.stopPropagation();
          } else {
            updateTriggerText();
          }
        },
        keydown: function(e) {
          var hovered;
          var newHovered;
          var key = e.which;

          hovered = $options.find('.hover');
          hovered.removeClass('hover');

          if (!$optionsWrapper.hasClass('open')) {
            if (key === 13 || key === 32 || key === 38 || key === 40) {
              e.preventDefault();
              $trigger.trigger('click');
              return;
            }
          } else {
            if (key === 38) {
              e.preventDefault();

              if (hovered.length && hovered.index() > 0) {
                hovered.prev().addClass('hover');
              } else {
                $options.find('li:last-child').addClass('hover');
              }
            } else if (key === 40) {
              e.preventDefault();

              if (hovered.length && hovered.index() < $options.find('li').length - 1) {
                hovered.next().addClass('hover');
              } else {
                $options.find('li:first-child').addClass('hover');
              }
            } else if (key === 27) {
              e.preventDefault();
              $trigger.trigger('click');
            } else if (key === 13 || key === 32) {
              e.preventDefault();
              hovered.trigger('click');
            } else if (key === 9) {
              if ($trigger.hasClass('open')) {
                $trigger.trigger('close');
              }
            }

            newHovered = $options.find('.hover');

            if (newHovered.length) {
              $options.scrollTop(0);
              $options.scrollTop(newHovered.position().top - 12);
            }
          }
        }
      });

      $trigger.on({
        close: function() {
          isOptionHovered = false;
          $wrapper.removeClass('open');
          $trigger.removeClass('open');
          $optionsWrapper.removeClass('open');
        },
        click: function(e) {
          e.stopPropagation();

          if (isDisabled) {
            return;
          }

          var topPos = 'auto';
          var leftPos = 'auto';
          var wrapperOffset = $wrapper.offset();
          var wrapperHeight = $wrapper.outerHeight();
          var wrapperWidth = $wrapper.outerWidth();

          var optionsHeight = $optionsWrapper.outerHeight();
          var optionsWidth = $optionsWrapper.outerWidth();

          var thisOuterHeight = $(this).outerHeight();
          var thisInnerHeight = $(this).innerHeight();
          var thisBorderWidth = (thisOuterHeight - thisInnerHeight) / 2;
          var roomSize = thisOuterHeight - thisBorderWidth;

          $wrapper.toggleClass('open');
          $trigger.toggleClass('open');

          var winHeight = $(win).height();
          var winScrollTop = $(win).scrollTop();
          var targetHeight = winHeight + winScrollTop;
          var isDropDown = wrapperOffset.top + wrapperHeight + optionsHeight < targetHeight;

          if (isiOS && !settings.forceiOS) {
            if ($trigger.hasClass('open')) {
              $this.focus();
              return;
            }
          } else {
            if ($trigger.hasClass('open')) {
              if (settings.appendTo && $(settings.appendTo).length) {
                if (isDropDown) {
                  topPos = wrapperOffset.top + roomSize;
                } else {
                  topPos = wrapperOffset.top - optionsHeight + thisBorderWidth;
                }

                if (data.optionsAlign === 'right') {
                  leftPos = wrapperOffset.left + wrapperWidth - optionsWidth;
                } else {
                  leftPos = wrapperOffset.left;
                }
              }

              $optionsWrapper.css({
                top: topPos,
                left: leftPos
              });
            }

            $optionsWrapper.toggleClass('open');

            if (!isiOS) {
              $this.focus();
              return;
            }
          }
        }
      });

      $optionsWrapper.on({
        mouseenter: function() {
          isOptionHovered = true;
        },
        mouseleave: function() {
          isOptionHovered = false;
        }
      });

      $options.on({
        click: function() {
          var $clickedElem = $(this);

          $this.val($clickedElem.data('raw-value'));

          if (!isiOS) {
            $trigger.trigger('close');
            $this.trigger('blur').trigger('focus');
          }

          $options.find('.selected').removeClass('selected');
          $clickedElem.addClass('selected');
          $trigger.addClass('selected');

          $this.val($clickedElem.data('raw-value'))
            .trigger('change')
            .trigger('blur')
            .trigger('focus');
        },
        mouseenter: function() {
          $options.find('.hover').removeClass('hover');
          $(this).addClass('hover');
        },
        mouseleave: function() {
          $options.find('.hover').removeClass('hover');
        }
      }, 'li');

      optionResize = function() {
        var triggerInnerWidth = $trigger.innerWidth();
        var triggerOuterWidth = $trigger.outerWidth();
        var triggerBorder = (triggerOuterWidth - triggerInnerWidth) / 2;
        var triggerWidth = triggerOuterWidth - triggerBorder;
        var scrollWidth = win.innerWidth-$(win).width();

        if (data.optionsWidth) {
          $optionsWrapper.css('width', data.optionsWidth);
        } else if ($trigger.outerWidth() > $optionsWrapper.outerWidth() && data.fitwidth) {
          $optionsWrapper.css('width', triggerWidth - triggerBorder);
        } else if ($optionsWrapper.outerHeight() < $options.outerHeight()) {
          $optionsWrapper.css('padding-right', scrollWidth);
        }
      };

      copyOptionsToList = function() {
        updateTriggerText();

        if (isiOS && !settings.forceiOS) {
          return;
        }

        var selOpts = $this.find('option');
        var fragment = $(doc.createDocumentFragment());

        $this.find('option').each(function(i, opt) {
          var $li;
          var optHtml;
          var optionsWidth;

          $opt = $(opt);
          var optData = $opt.data();

          if (!$opt.prop('disabled') && ($opt.val() || settings.includeBlank)) {
            optHtml = settings.optionTemplate($opt);

            $li = $('<li/>', {
              'data-raw-value': $opt.val(),
              html: $('<span/>', {
                addClass: 'text',
                html: optHtml
              })
            });

            if ($opt.prop('selected')) {
              $li.addClass('selected');
            }

            if (optData['class']) {
              $li.addClass(optData['class']);
            }

            if (optData.before) {
              $('<span/>', {
                text: optData.before,
                addClass: ['before', optData.beforeClass || ''].join(' '),
                prependTo: $li
              });
            }

            if (optData.after) {
              $('<span/>', {
                text: optData.after,
                addClass: ['after', optData.afterClass || ''].join(' '),
                appendTo: $li
              });
            }

            fragment.append($li);
          }
        });

        $options.append(fragment);
        optionResize();
      };

      $(win).on('resize', function() {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        resizeTimeout = setTimeout(function() {
          $trigger.trigger('close');
        }, 10);
      });

      $(doc).on('click', function() {
        $trigger.trigger('close');
      });

      $this.on('update', function() {
        $options.empty();
        copyOptionsToList();
      });

      copyOptionsToList();
    });
  };
})(jQuery, window, document);
