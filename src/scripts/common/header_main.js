// 검색창 열기
$(function(){
  var speed = 400;
  $("#headerBox .btn_zoom").click(function(){
    $(this).parent().parent().find("#autoMain").slideToggle(speed);
  });
  $("#headerBox .close").click(function(e){
    e.preventDefault();
    $("#autoMain").slideToggle(speed);
  });
});

/* 책상품 마우스 오버시 장바구니 버튼 세트*/
$(window).load(function()  {
  $('.singleImg').hover(function() {
    $(this).find('div.overBtnBox').stop(false,true).fadeIn(200);
  },
  function() {
    $(this).find('div.overBtnBox').stop(false,true).fadeOut(200);
  });

  $('.setImg').hover(function() {
    $(this).find('div.overBtnBox').stop(false,true).fadeIn(200);
  },
  function() {
    $(this).find('div.overBtnBox').stop(false,true).fadeOut(200);
  });
});

/* 201606 */
// main navigation
function mainNavEvent() {
  var $wrapper = $('.bookGNBWrapper');
  var allview = $wrapper.find('.bookAllView .allNav');
  var closeBtn = $wrapper.find('.closeCategories > a');
  //var closeBtnMeta = false;

  var createBG = function($targetEl) {
    /*
    var bgLayer = $('<i/>', {
      class: 'bgLayer'
    });
    */
    var bgLayer = $('<i/>');
    bgLayer.addClass('bgLayer');

    if($targetEl.hasClass('on')) {
      $wrapper.prepend(bgLayer);
    } else {
      $wrapper.find('.bgLayer').remove();
    }
  };

  allview.on('click', function(e) {
    e.preventDefault();

    var slideSpeed = 300;
    var $this = $(this);
    var thisParent = $this.parent();

    thisParent.toggleClass('on');

    if(thisParent.hasClass('on')) {
      $('.bookAllCategoryWrap').slideDown(slideSpeed);
    } else {
      $('.bookAllCategoryWrap').slideUp(slideSpeed);
    }

    //createBG(thisParent);
    /*
    closeBtnMeta = {
      'top': closeBtn.offset().top,
      'height': closeBtn.height()
    };

    if(closeBtnMeta) {
      $(window).on('scroll', function(){
        var closeTime = $(this).scrollTop() > closeBtnMeta.top + closeBtnMeta.height;

        if(closeTime && thisParent.hasClass('on')) {
          allview.trigger('click');
          $(this).off('scroll');
        }
      });
    }
    */
  });

  closeBtn.on('click', function(e) {
    e.preventDefault();

    allview.trigger('click');
  });
}
mainNavEvent();
/* 201606 */
