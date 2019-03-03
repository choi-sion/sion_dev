(function($) {
  $.extend($.fn, {
    monthWrapper: function() {
      var now = new Date();
      var years = now.getFullYear();
      var month = now.getMonth();
      var days = now.getDate();

      var today = new Date(years, month, 1);
      var week = today.getDay();

      var lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (years * 4) {
        fourYearsLastDay = lastDay[1] = 29;
      }

      var $thisMonth = lastDay[month];

      var row = Math.ceil(($thisMonth + week) / 7);
      console.log($thisMonth + week);

      $(this).find('caption').append('<span>' + (month+1) +'월</span>');

      var dNum = 1;
      for (var i = 1; i <= 7; i++) {
        if (i <= week || dNum > lastDay) {
          var dd =$(this).find('td').eq(i);
        } else {
          $(this).find('td').eq(i).text(dNum);
        }
      }
    }
  });

  $('table').monthWrapper();
})(jQuery);

