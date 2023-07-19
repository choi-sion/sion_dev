;(function($, win, doc) {
  var agreeAllChecked = function agreeAllChecked() {
    var $agreeList = $('input[name="agreeRule"]');
    var $allCheck = $('.allCheck');

    var $checkBtn = $('.btnCheckOk');
    var submitAvailable = false;

    var buttonStatus = {
      enable: function() {
        $checkBtn.prop('disabled', false);
        submitAvailable = true;
      },
      disable: function() {
        $checkBtn.prop('disabled', true);
        submitAvailable = false;
      }
    };

    $allCheck.change(function() {
      var $this = $(this);
      var checked = $this.prop('checked');

      $agreeList.prop('checked', checked);

      if (checked) {
        buttonStatus.enable();
      } else {
        buttonStatus.disable();
      }
    });

    $agreeList.change(function() {
      var agreeListLength = $agreeList.length;
      var checkedLength = $('input[name="agreeRule"]:checked').length;
      var selectAll = (agreeListLength === checkedLength);

      $allCheck.prop('checked', selectAll);

      if (selectAll) {
        buttonStatus.enable();
      } else {
        buttonStatus.disable();
      }
    });

    buttonStatus.disable();
  };

  $(doc).ready(function() {
    agreeAllChecked();
  });
})(jQuery, window, document);