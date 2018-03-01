/* 로딩될때 숨김처리 */
$(document).ready(function($) {
    var container = $('#sky_wrapper');
    var article = $('.sky_list li');
    article.addClass('folder_off');
    $('.accordion_content').hide();
});
$(window).load(function() {
    var container = $('#sky_wrapper');

    /* 북카트/오늘본상품 아코디언 */
    var article = $('.sky_list li');
    article.addClass('folder_off');
    container.find('.accordion_content').hide();

    $('.sky_list li .accordion_title').click(function(){
      var myArticle = $(this).parents('li');
      if(myArticle.hasClass('folder_off')){
        article.addClass('folder_off').removeClass('folder_on');
        article.find('.accordion_content').slideUp(300);
        myArticle.removeClass('folder_off').addClass('folder_on');
        myArticle.find('.accordion_content').slideDown(300);
        return false;
      } else {
        myArticle.removeClass('folder_on').addClass('folder_off');
        myArticle.find('.accordion_content').slideUp(300);
        return false;
      }
    });

    // rightbar close click event
    var $closeButton = container.find('.sky_quick_open a');
    $closeButton.on('click', function(e) {
      e.preventDefault();

      var rightPosition = 0;
      var duration = 300;
      var label;

      if ($(this).hasClass('hidden')) {
        label = '닫기';
      } else {
        rightPosition = -112;
        label = '열기';
      }
      container.find('.sky_wrap').stop().animate({right: rightPosition}, duration);
      $(this).toggleClass('hidden').find('span').text(label);
    });

    /* top 버튼 애니메이션 */
    var $goTop = container.find('.bottom_goTop');
    // gotop event
    $goTop.on('click', function(e){
      e.preventDefault();
      $('body, html').animate({scrollTop: 0}, 200);
    });

  });
