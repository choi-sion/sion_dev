var skyLiftmiddleRnd = 1;

  $(function() {
  //랜덤으로 중간 배너 노출
  skyLiftMiddleBannerRoll(skyLiftmiddleRnd);

  //상단 오버시 큰 이미지 노출

  var myTimeout;
  $('#banner_leftBook').mouseenter(function() {
      myTimeout = setTimeout(function() {
        showTopBigBanner();
      }, 300);
  }).mouseleave(function() {
      clearTimeout(myTimeout);
  });

  //페이지 로드 되었을때 페이지 열림

  // 2초있다가 닫힘.
  window.setTimeout("closeSkyLeftBanner()", 2000);

});


function hideIssueMain(){
    //welSetCookie("issueMain1", "done" , 1);
    closeSkyLeftBanner();
}

function closeSkyLeftBanner(){
  $('#mLeftBanner').hide('normal');
}

function showTopBigBanner(){
  $('#mLeftBanner').show('slow');
}


//좌측 귀배너 중간배너  2015.07.27  by 김범래
function skyLiftMiddleBannerRoll(skyLiftmiddleRnd){
  $('.skyLeftMiddleBannerClass').hide();
  $('#skyLeftMiddleBannerId'+skyLiftmiddleRnd).show();
}

//중단 배너 누를 시
function moveSkyLiftMiddleBannerList(tempVar){
  if(tempVar =='pre'){
    skyLiftmiddleRnd=skyLiftmiddleRnd-1;
    if(skyLiftmiddleRnd ==0){
      skyLiftmiddleRnd = temp069Cnt;
    }
  }else{
    skyLiftmiddleRnd=skyLiftmiddleRnd+1;
    if(skyLiftmiddleRnd ==temp069Cnt+1){
      skyLiftmiddleRnd = 1;
    }
  }
  skyLiftMiddleBannerRoll(skyLiftmiddleRnd);
}

var bannerLength2 = 0;
var bannerLength3 = 0;
var imgUrls = '';
var imgUrl = '';
var linkUrl = '';
var linktarget = '';
