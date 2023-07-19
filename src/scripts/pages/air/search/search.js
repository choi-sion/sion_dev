;(function($) {
  var ranges = (function() {
    if ($('.range').length !== 0) {
      var ranges = $('.range').nstSlider({
        'rounding': {
          '100': '1000'
        },
        'left_grip_selector': '.leftGrip',
        'value_bar_selector': '.bar',
        'value_changed_callback': function(cause, leftValue, rightValue) {
          var $container = $(this).parent();
          var $grip = $(this).find('.leftGrip');
          var getMax = $('.range').nstSlider('get_range_max');
          var maxValue = getMax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          var text = [];
          valueNow = $grip.attr('aria-valuenow');
          $grip.attr('aria-valuenow', valueNow);
          $grip.attr('aria-valuetext', valueNow + '원'); //NVDA에서 원까지 읽게 해줌.
          leftValue = leftValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          rightValue = rightValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          $('.ariaAttributesAsText').html(text.join('<br />'));
          $(this).parent().find('.leftLabel').text(leftValue + '원');
          $container.find('.minPrice').text(rightValue + '원');
          $container.find('.maxPrice').text(maxValue + '원');
        }
      });
      $('.range').nstSlider('refresh');
    }
  }());

  $.fn.listAccordion = function(opts) {
    var defaults = {
      speed: 200,
      currentClass: 'current'
    };

    opts = $.extend({}, defaults, opts);

    return this.each(function() {
      var $accordion = $(this);
      var $toggleBtn = $accordion.find('.viewBtn');

      $toggleBtn.on('click', function(e) {
        e.preventDefault();

        var $this = $(this);
        var $parent = $this.closest('.itemBlock');

        $parent
          .find('.itemContents')
          .slideToggle(opts.speed)
          .parent()
          .toggleClass(opts.currentClass);

        if ($parent.hasClass('current')) {
          $this
            .attr('aria-expanded', 'true');
        } else {
          $this
            .attr('aria-expanded', 'false');
        }
      });
    });
  };

  $.fn.popupLayer = function() {
    $(this).click(function() {
      $(this)
        .attr('aria-expanded', true)
        .parent('.listTitle li')
        .toggleClass('visible');
      $('.range').nstSlider('refresh');
      $('.seatingList').seatSelect();
      $('.listTitle li .listBtn').not(this).parents('.listTitle li').removeClass('visible');
      $('.listTitle li .listBtn').not(this).attr('aria-expanded', false);

      if ($(this).parent('.listTitle li').hasClass('visible')) {
        $(this).attr('aria-expanded', true);
      } else {
        $(this).attr('aria-expanded', false);
      };
    });
    var $body = $('body');
    $body.mouseup(function(e) {
      var LayerPopup = $('.listTitle');
      if (LayerPopup.has(e.target).length === 0) {
        $('.listTitle li').removeClass('visible');
        $('.listTitle li button').attr('aria-expanded', false);
      }
    });
  };

  $.fn.jjim= function() {
    this.each(function() {
      var $this = $(this);
      $this.on('click', function() {
        var active = 'active';
        $this.toggleClass(active);
        if ($this.hasClass('active')) {
          $this
            .attr('aria-pressed', 'true');
        } else {
          $this
            .attr('aria-pressed', 'false');
        }
      });
    });
  };

  $.fn.checkEvent = function() {
    var $checkboxWrap = $('.sortingList.airline');
    var $checkBox = $checkboxWrap.find('input[type="checkbox"]');
    var $allCheckBox = $checkboxWrap.find('.allCheck');

    $checkBox.prop('checked', true).parent().addClass('check');

    return this.each(function() {
      var $this = $(this);
      var checkboxLength = $checkBox.not('.allCheck').length;
      var submitAvailable = false;

      var buttonStatus = {
        enable: function() {
          submitAvailable = true;
        },
        disable: function() {
          submitAvailable = false;
        }
      };

      $checkboxWrap.each(function() {
        $this.on('click', function() {
          var hasAllClass = $(this).hasClass('allCheck');
          var allCheckedLength = $checkBox.not('.allCheck').filter(':checked').length;
          var isChecked = $(this).prop('checked');

          if (checkboxLength === allCheckedLength) {
            $allCheckBox
              .prop('checked', true)
              .parent()
              .addClass('check');
          } else {
            $allCheckBox
              .prop('checked', false)
              .parent()
              .removeClass('check');
          }

          if (isChecked) {
            $(this)
              .parent()
              .addClass('check');

            if (hasAllClass) {
              $checkBox
                .prop('checked', true)
                .parent()
                .addClass('check');
            }
          } else {
            $(this)
              .parent()
              .removeClass('check');

            if (hasAllClass) {
              $checkBox
                .prop('checked', false)
                .parent()
                .removeClass('check');
            }
          }
        });
      });

      buttonStatus.disable();
    });
  };

  $.fn.seatSelect = function() {
    var $seatBtn = $('.seatingList li button');

    $seatBtn.addClass('selected');

    var seatHandler = function(e) {
      var targetElem = $(e.target).parent();
      targetElem
        .addClass('selected');
      $('.seatingList li button').not(this).removeClass('selected');

      if ($seatBtn.hasClass('selectAll selected')) {
        $('.seatingList li button').addClass('selected');
      }
    };
    $seatBtn.on('click', seatHandler);
  };

  $.fn.tooltip = function() {
    this.each(function() {
      var $this = $(this);
      $this.on('focus', function() {
        $(this).find('.tooltipContent').css('display', 'block');
      }).on('blur', function() {
        $(this).find('.tooltipContent').css('display', 'none');
      });
    });
  };

  //웹접근성 스크립트
  $.extend($.fn, {
    ariaSelect: function() {
      $(this)
        .parents('ul')
        .find('li[role="tab"]')
        .attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        });
      $(this)
        .attr({
          'aria-selected': 'true',
          'tabindex': '0'
        });
    },
    ariaExpand: function() {
      $(this).on('click', function() {
        var ariaAttribute = $(this).attr('aria-expanded');
        if (ariaAttribute === 'true') {
          $(this).attr('aria-expanded', 'false');
        } else {
          $(this).parent().siblings().find('button').attr('aria-expanded', 'false');
          $(this).attr('aria-expanded', 'true');
        }
      });
    },
    ariaCurrent: function(option) {
      $(this).on('click', function() {
        $(this).siblings().removeAttr('aria-current');
        $(this).attr('aria-current', option);
      });
    },
    triggerEnter: function() {
      $(this).on('keydown', function(e) {
        if ((e.keyCode ? e.keyCode : e.which) === 13) {
          e.preventDefault();
          $(this).trigger('click');
        }
      });
    },
    tabAccess: function(tabStartNum) {
      var tablist = $(this).find('[role="tablist"]');
      var tabs = tablist.find('[role="tab"]');
      var tabOrder = tabStartNum;
      tabs.each(function() {
        $(this).on('keydown', function(e) {
          if (e.keyCode === 39 || e.keyCode === 37) {
            $(tabs[tabOrder]).attr('tabindex', -1);
            if (e.keyCode === 39) {
              tabOrder++;
              if (tabOrder >= tabs.length) {
                tabOrder = 0;
              }
            } else if (e.keyCode === 37) {
              tabOrder--;
              if (tabOrder < 0) {
                tabOrder = tabs.length - 1;
              }
            }
            $(tabs[tabOrder]).attr('tabindex', 0);
            $(tabs[tabOrder]).focus();
          }
        });
        $(this).on('click', function() {
          $(this).ariaSelect();
        });
      });
    }
  });

  $('input:checkbox').triggerEnter();
  $('[aria-expanded]').triggerEnter();
  $('.btnjjim').jjim();
  $('.tooltip').tooltip();
  $('.listBtn').popupLayer();
  $('.airSearchList').listAccordion();
  $('.checkBtn').checkEvent();
  $('.seatingList').seatSelect();
})(jQuery);
