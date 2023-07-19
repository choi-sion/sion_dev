;(function($, window, document) {
  String.prototype.unaccented = function() {
    var accent = [
      /[\300-\306]/g, /[\340-\346]/g, // A, a
      /[\310-\313]/g, /[\350-\353]/g, // E, e
      /[\314-\317]/g, /[\354-\357]/g, // I, i
      /[\322-\330]/g, /[\362-\370]/g, // O, o
      /[\331-\334]/g, /[\371-\374]/g, // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g // C, c
    ];
    var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    var str = this;
    for (var i = 0; i < accent.length; i++) {
      str = str.replace(accent[i], noaccent[i]);
    }

    return str;
  };

  $.fn.fSelect = function(options) {
    if ('string' === typeof options) {
      var settings = options;
    } else {
      var settings = $.extend({
        placeholder: '옵션을 선택해주세요.',
        numDisplayed: 3,
        overflowText: '{n}개 선택하였습니다.',
        searchText: '검색어를 입력하세요.',
        noResultsText: '찾을 수 없습니다.',
        showSearch: true,
        optionFormatter: false,
        wrapClass: '',
        labelClass: '',
      }, options);
    }

    function fSelect(select, settings) {
      this.$select = $(select);
      this.settings = settings;
      this.create();
    }

    fSelect.prototype = {
      create: function() {
        this.idx = 0;
        this.optgroup = 0;
        this.selected = [].concat(this.$select.val()); // force an array
        this.settings.multiple = this.$select.is('[multiple]');

        var search_html = '';
        var no_results_html = '';
        var choices_html = this.buildOptions(this.$select);

        if (this.settings.showSearch) {
          search_html = '<div class="fsSearch"><input type="text" placeholder="' + this.settings.searchText + '" /></div>';
        }
        if ('' !== this.settings.noResultsText) {
          no_results_html = '<div class="fsNoResults hidden">' + this.settings.noResultsText + '</div>';
        }

        var html = '<div class="fsLabelWrap"><div class="fsLabel' + (this.settings.labelClass ? ' ' + this.settings.labelClass : '')  + '"></div><span class="fsArrow"></span></div>';
        html += '<div class="fsDropdown hidden">{search}{no-results}<div class="fsOptions">' + choices_html + '</div></div>';
        html = html.replace('{search}', search_html);
        html = html.replace('{no-results}', no_results_html);

        this.$select.wrap('<div class="fsWrap' + (this.settings.wrapClass ? ' ' + this.settings.wrapClass : '') + (this.settings.multiple ? ' multiple' : '') + '" tabindex="0" />');
        this.$select.addClass('hidden');
        this.$select.before(html);
        this.$wrap = this.$select.parents('.fsWrap');
        this.$wrap.data('id', window.fSelect.num_items);
        window.fSelect.num_items++;

        this.reloadDropdownLabel();
      },

      reload: function() {
        this.destroy();
        this.create();
        this.bind();
      },

      destroy: function() {
        this.$wrap.find('.fsLabelWrap').remove();
        this.$wrap.find('.fsDropdown').remove();
        this.$select.unwrap().removeClass('hidden');
      },

      buildOptions: function ($element) {
        var $this = this;

        var choices = '';
        $element.children().each(function (i, el) {
          var $el = $(el);

          if ('optgroup' === $el.prop('nodeName').toLowerCase()) {
            choices += '<div class="fsOptgroupLabel" data-group="' + $this.optgroup + '">' + $el.prop('label') + '</div>';
            choices += $this.buildOptions($el);
            $this.optgroup++;
          } else {
            var val = $el.prop('value');
            var classes = $el.attr('class');
            classes = ('undefined' !== typeof classes) ? ' ' + classes : '';

            // exclude the first option in multi-select mode
            if (0 < $this.idx || '' !== val || !$this.settings.multiple) {
              var disabled = $el.is(':disabled') ? ' disabled' : '';
              var selected = -1 < $.inArray(val, $this.selected) ? ' selected' : '';
              var group = ' g' + $this.optgroup;
              var row = '<div class="fsOption' + selected + disabled + group + classes + '" data-value="' + val + '" data-index="' + $this.idx + '"><span class="fsCheckbox"><i></i></span><div class="fsOptionLabel">' + $el.html() + '</div></div>';

              if ('function' === typeof $this.settings.optionFormatter) {
                row = $this.settings.optionFormatter(row);
              }

              choices += row;
              $this.idx++;
            }
          }
        });

        return choices;
      },

      reloadDropdownLabel: function () {
        var settings = this.settings;
        var labelText = [];

        this.$wrap.find('.fsOption.selected').each(function (i, el) {
          labelText.push($(el).find('.fsOptionLabel').html());
        });

        if (labelText.length < 1) {
          labelText = settings.placeholder;
        } else if (labelText.length > settings.numDisplayed) {
          labelText = settings.overflowText.replace('{n}', labelText.length);
        } else {
          labelText = labelText.join(', ');
        }

        this.$wrap.find('.fsLabel').html(labelText);
        this.$wrap.toggleClass('fsDefault', labelText === settings.placeholder);
      },
    }

    /**
     * Loop through each matching element
     */
    return this.each(function () {
      var data = $(this).data('fSelect');

      if (!data) {
        data = new fSelect(this, settings);
        $(this).data('fSelect', data);
      }

      if ('string' === typeof settings) {
        data[settings]();
      }
    });
  }

  window.fSelect = {
    'num_items': 0,
    'active_id': null,
    'active_el': null,
    'last_choice': null,
    'idx': -1
  };

  $(document).delegate('.fsOption', 'click', function (e) {
    if ($(this).hasClass('hidden') || $(this).hasClass('disabled')) {
      return false;
    }

    var $wrap = $(this).parents('.fsWrap');
    var $select = $wrap.find('select');
    var do_close = false;

    // prevent selections
    if ($wrap.hasClass('fsDisabled')) {
      return;
    }

    if ($wrap.hasClass('multiple')) {
      var selected = [];

      // shift + click support
      if (e.shiftKey && null !== window.fSelect.last_choice) {
        var current_choice = parseInt($(this).attr('data-index'));
        var addOrRemove = !$(this).hasClass('selected');
        var min = Math.min(window.fSelect.last_choice, current_choice);
        var max = Math.max(window.fSelect.last_choice, current_choice);

        for (i = min; i <= max; i++) {
          $wrap.find('.fsOption[data-index=' + i + ']')
            .not('.hidden, .disabled')
            .each(function () {
              $(this).toggleClass('selected', addOrRemove);
            });
        }
      } else {
        window.fSelect.last_choice = parseInt($(this).attr('data-index'));
        $(this).toggleClass('selected');
      }

      $wrap.find('.fsOption.selected').each(function (i, el) {
        selected.push($(el).attr('data-value'));
      });
    } else {
      var selected = $(this).attr('data-value');
      $wrap.find('.fsOption').removeClass('selected');
      $(this).addClass('selected');
      do_close = true;
    }

    $select.val(selected);
    $select.fSelect('reloadDropdownLabel');
    $select.change();

    // fire an event
    $(document).trigger('fs:changed', $wrap);

    if (do_close) {
      closeDropdown($wrap);
    }
  });

  $(document).delegate('.fsSearch input', 'keyup', function (e) {
    if (40 === e.which) { // down
      $(this).blur();
      return;
    }

    var $wrap = $(this).parents('.fsWrap');
    var matchOperators = /[|\\{}()[\]^$+*?.]/g;
    var keywords = $(this).val().replace(matchOperators, '\\$&');

    $wrap.find('.fsOption, .fsOptgroupLabel').removeClass('hidden');

    if ('' !== keywords) {
      $wrap.find('.fsOption').each(function () {
        var regex = new RegExp(keywords.unaccented(), 'gi');
        var formatedValue = $(this).find('.fsOptionLabel').text().unaccented();

        if (null === formatedValue.match(regex)) {
          $(this).addClass('hidden');
        }
      });

      $wrap.find('.fsOptgroupLabel').each(function () {
        var group = $(this).attr('data-group');
        var num_visible = $(this).parents('.fsOptions').find('.fsOption.g' + group).not('.hidden').length;
        if (num_visible < 1) {
          $(this).addClass('hidden');
        }
      });
    }

    setIndexes($wrap);
    checkNoResults($wrap);
  });

  $(document).bind('click', function (e) {
    var $el = $(e.target);
    var $wrap = $el.parents('.fsWrap');

    if (0 < $wrap.length) {

      // user clicked another fSelect box
      if ($wrap.data('id') !== window.fSelect.active_id) {
        closeDropdown();
      }

      // fSelect box was toggled
      if ($el.hasClass('fsLabel') || $el.hasClass('fsArrow')) {
        var is_hidden = $wrap.find('.fsDropdown').hasClass('hidden');

        if (is_hidden) {
          openDropdown($wrap);
        } else {
          closeDropdown($wrap);
        }
      } else {
        closeDropdown($wrap);
      }
    } else {
      closeDropdown();
    }
  });

  $(document).bind('keydown', function (e) {
    var $wrap = window.fSelect.active_el;
    var $target = $(e.target);

    // toggle the dropdown on space
    if ($target.hasClass('fsWrap')) {
      if (32 === e.which || 13 === e.which) {
        e.preventDefault();
        $target.find('.fsLabel').trigger('click');
        return;
      }
    } else if (0 < $target.parents('.fsSearch').length) { // preserve spaces during search
      if (32 === e.which) {
        return;
      }
    } else if (null === $wrap) {
      return;
    }

    if (38 === e.which) { // up
      e.preventDefault();

      $wrap.find('.fsOption.hl').removeClass('hl');

      var $current = $wrap.find('.fsOption[data-index=' + window.fSelect.idx + ']');
      var $prev = $current.prevAll('.fsOption').not('.hidden, .disabled');

      if ($prev.length > 0) {
        window.fSelect.idx = parseInt($prev.attr('data-index'));
        $wrap.find('.fsOption[data-index=' + window.fSelect.idx + ']').addClass('hl');
        setScroll($wrap);
      } else {
        window.fSelect.idx = -1;
        $wrap.find('.fsSearch input').focus();
      }
    } else if (40 === e.which) { // down
      e.preventDefault();

      var $current = $wrap.find('.fsOption[data-index=' + window.fSelect.idx + ']');
      if ($current.length < 1) {
        var $next = $wrap.find('.fsOption:first').not('.hidden, .disabled');
      } else {
        var $next = $current.nextAll('.fsOption').not('.hidden, .disabled');
      }

      if ($next.length > 0) {
        window.fSelect.idx = parseInt($next.attr('data-index'));
        $wrap.find('.fsOption.hl').removeClass('hl');
        $wrap.find('.fsOption[data-index=' + window.fSelect.idx + ']').addClass('hl');
        setScroll($wrap);
      }
    } else if (32 === e.which || 13 == e.which) { // space, enter
      e.preventDefault();

      $wrap.find('.fsOption.hl').click();
    } else if (27 === e.which) { // esc
      closeDropdown($wrap);
    }
  });

  function checkNoResults($wrap) {
    var addOrRemove = $wrap.find('.fsOption').not('.hidden').length > 0;
    $wrap.find('.fsNoResults').toggleClass('hidden', addOrRemove);
  }

  function setIndexes($wrap) {
    $wrap.find('.fsOption.hl').removeClass('hl');
    $wrap.find('.fsSearch input').focus();
    window.fSelect.idx = -1;
  }

  function setScroll($wrap) {
    var $container = $wrap.find('.fsOptions');
    var $selected = $wrap.find('.fsOption.hl');

    var itemMin = $selected.offset().top + $container.scrollTop();
    var itemMax = itemMin + $selected.outerHeight();
    var containerMin = $container.offset().top + $container.scrollTop();
    var containerMax = containerMin + $container.outerHeight();

    if (itemMax > containerMax) { // scroll down
      var to = $container.scrollTop() + itemMax - containerMax;
      $container.scrollTop(to);
    }
    else if (itemMin < containerMin) { // scroll up
      var to = $container.scrollTop() - containerMin - itemMin;
      $container.scrollTop(to);
    }
  }

  function openDropdown($wrap) {
    window.fSelect.active_el = $wrap;
    window.fSelect.active_id = $wrap.data('id');
    window.fSelect.initial_values = $wrap.find('select').val();
    $(document).trigger('fs:opened', $wrap);
    $wrap.find('.fsDropdown').removeClass('hidden');
    $wrap.addClass('fsOpen');
    setIndexes($wrap);
    checkNoResults($wrap);
  }

  function closeDropdown($wrap) {
    if ('undefined' === typeof $wrap && null !== window.fSelect.active_el) {
      $wrap = window.fSelect.active_el;
    }
    if ('undefined' !== typeof $wrap) {
      // only trigger if the values have changed
      var initial_values = window.fSelect.initial_values;
      var current_values = $wrap.find('select').val();
      if (JSON.stringify(initial_values) !== JSON.stringify(current_values)) {
        $(document).trigger('fs:closed', $wrap);
      }
    }

    $('.fsWrap').removeClass('fsOpen');
    $('.fsDropdown').addClass('hidden');
    window.fSelect.active_el = null;
    window.fSelect.active_id = null;
    window.fSelect.last_choice = null;
  }
})(jQuery, window, document);
