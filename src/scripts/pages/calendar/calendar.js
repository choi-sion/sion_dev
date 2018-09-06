;(function($) {
  $.extend($.fn, {
    monthWrapper: function() {
      var now = new Date();
      var years = now.getFullYear();
      var caption = now.getMonth() + 1;

      console.log(years);

      $(this).find('caption').append('<span>' + caption +'월</span>');
    // NowTime += '-' + Now.getMonth() + 1 ;
    // NowTime += '-' + Now.getDate();
    // NowTime += ' ' + Now.getHours();
    // NowTime += ':' + Now.getMinutes();
    // NowTime += ':' + Now.getSeconds();
    }
  });

  $('table').monthWrapper();
})(jQuery);
