/*------------------------- Web Font Nanum Gothic---------------
 google.load( "webfont", "1" );
 google.setOnLoadCallback(function() {
  WebFont.load({ custom: {
   families: [ "NanumGothic" ],
   urls: [ "http://fontface.kr/NanumGothic/css" ]
  }});
 });
*/
 /*Gateway Auto Login Layer ------------------------------------------------------------------------------ */
	function autolv(){
		if(document.getElementById('autolv').style.display==''){
			document.getElementById('autolv').style.display="none";
			document.getElementById('autolvimg').src="http://bimage.interpark.com/renewPark/reBookpark/header/gnb/gnb_loginAuto_on.gif"
		}else{
			document.getElementById('autolv').style.display="";
			document.getElementById('autolvimg').src="http://bimage.interpark.com/renewPark/reBookpark/header/gnb/gnb_loginAuto_off.gif"
		}
	}
function showLayer(elementId){
	    var element = document.getElementById(elementId);
	    if(element){
	        element.style.display = '';
	    }
	}
	function hideLayer(elementId){
	    var element = document.getElementById(elementId);
	    if(element){
	        element.style.display = 'none';
	    }
	}
/*Gateway Layer      -------------------------------------------------------------------------*/
	function showMlv(elementId){
		    var element = document.getElementById(elementId);
		    if(element !=null){
		    	document.getElementById(elementId+"_arrow").className="on"
				document.getElementById(elementId).style.display = '';
		    }
		}
		function hideMlv(elementId){
		     var element = document.getElementById(elementId);
		    if(element !=null){
		    	document.getElementById(elementId+"_arrow").className="off"
				document.getElementById(elementId).style.display = 'none';
		    }
		}

/*Gateway Bar Layer -------------------------------------------------------------------------*/
		function showDiv(elementId){
		    var element = document.getElementById(elementId);
		    if(element){
		        element.style.display = '';
		    }
		}
		function hideDiv(elementId){
		    var element = document.getElementById(elementId);
		    if(element){
		        element.style.display = 'none';
		    }
		}

/*GNB SubMenu -------------------------------------------------------------------------*/
		function showGLayer(layer_id) {
			 var layer_id = document.getElementById(layer_id);
		    if(layer_id){
		        layer_id.style.display = '';
		    }
		}
		function hideGLayer(layer_id) {
			 var layer_id = document.getElementById(layer_id);
		    if(layer_id){
		        layer_id.style.display = 'none';
		    }
		}

/*GNB SubMenu+a -------------------------------------------------------------------------*/
	    function ly_all(num){
	        if(document.getElementById('ly_all_'+num).style.display==''){
	            document.getElementById('ly_all_'+num).style.display="none";
	        }else{
	            document.getElementById('ly_all_'+num).style.display="";
	        }
	    }
	    function gnbBtn(num){
	        if(document.getElementById('btn_gnb'+num).src=='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb'+num+'_off.gif'){
	            document.getElementById('btn_gnb'+num).src='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb'+num+'_on.gif';
	        }else{
	            document.getElementById('btn_gnb'+num).src='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb'+num+'_off.gif';
	        }
	    }

	     function gnbCenBtn(num){
	        if(document.getElementById('btn_cengnb'+num).src=='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb_cen'+num+'_off.gif'){
	            document.getElementById('btn_cengnb'+num).src='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb_cen'+num+'_on.gif';
	        }else{
	            document.getElementById('btn_cengnb'+num).src='http://bimage.interpark.com/renewPark/reBookpark/header/gnb/20150708/gnb_cen'+num+'_off.gif';
	        }
	    }

/*GNB Search AutoLayer  -------------------------------------------------------------------------*/
		function autoSearchLayer(){
			if(document.getElementById('auto').style.display==''){
				document.getElementById('auto').style.display="none"
			}else{
				document.getElementById('auto').style.display=""
			}
		}

		function autoSearchLayer(){
			if(document.getElementById('autoMain').style.display==''){
				document.getElementById('autoMain').style.display="none"
			}else{
				document.getElementById('autoMain').style.display=""
			}
		}

/*GNB Rolling Ranking  -------------------------------------------------------------------------*/
	// 에러 출력
      function rpError(e) {
       alert(e.responseText);
       alert('정상적으로 처리되지 않았습니다.');
      }//end function rpError()

var RollingList = function (id, tagType, liHeight, gabSpeed, rollSpeed, startspeed) {  
var listObj = document.getElementById(id);
var nowCnt = 0;
var movingCnt = 0;
var maxCnt = 10; 
this.setting = function () {
      var ulObj = listObj.getElementsByTagName(tagType)[0];
      var liObj = ulObj.getElementsByTagName("LI");
      maxCnt = liObj.length; 
      ulObj.insertBefore(liObj[0].cloneNode(true), liObj[maxCnt-1].nextSibling);
      ulObj.style.position = "absolute";
      ulObj.style.left = "0px";
      if(maxCnt>0) {
          this.show();
    }
}
this.init = function () {
    if (listObj.getElementsByTagName(tagType)[0].getElementsByTagName("LI").length > 1) {
        var t = setTimeout(listObj.id + ".setting()", startspeed);
    }
}
this.show = function () {
    if (maxCnt == nowCnt) {
        nowCnt = 0;
        movingCnt = 0;
        listObj.getElementsByTagName(tagType)[0].style.top = "0px";
    }
    nowCnt++;
    var t = setTimeout(listObj.id + ".motion()", gabSpeed);
}
  this.motion = function () {
      movingCnt = movingCnt + 4;
      if (movingCnt > (liHeight * nowCnt)) {
          movingCnt = liHeight * nowCnt;
          this.show();
      } else {
          listObj.getElementsByTagName(tagType)[0].style.top= "-" + movingCnt + "px";
          var t = setTimeout(listObj.id + ".motion()", rollSpeed);
      }
  }
}

        // 상단 띠배너 스크립트
	/*$(function(){
		$('#topSlide').mouseenter(function(){
			if(!$(".big").is(":animated")){
			$(this).find(".big").slideDown();
		}
		});
			$('#topSlide').mouseleave(function(){
			$(this).find(".big").slideUp();
		});
		$("#topSlide .close").click(function(){
			$("#topSlide").hide();
		});
	});
*/
//CNB 카테고리
	function cnbView(num){
	if(isNaN(parseInt(num))) num = 0;
	num = parseInt(num) + 1;
	try{
		for(var i = 1; i <= 6; i++){
			if(document.getElementById("cnb_con_"+i)!=null){
				if(i == num){
					document.getElementById("cnb_con_"+i).style.display="block";
					document.getElementById("cnb_bar_"+i).className="cnb_bar_on";
				}
				else{
					document.getElementById("cnb_con_"+i).style.display="none";
					document.getElementById("cnb_bar_"+i).className="cnb_bar_off";
				}
			}
		}
	}catch(e){}
}

/* ========================= My Mini Js =========================
20140310: Lim jisun
sub right SkyBanner Wrap All Script.
jQuery Script --> in Page
===============================================================*/

// 확장형
function miniView(){
	if(document.getElementById('miniView').className=='out'){
		document.getElementById('miniView').className="over";
		document.getElementById('seeView').className="out";
	}else{
		document.getElementById('miniView').className="out";
	}
}

function seeView(){
	if(document.getElementById('seeView').className=='out'){
		document.getElementById('seeView').className="over";
		document.getElementById('miniView').className="out";
	}else{
		document.getElementById('seeView').className="out";
	}
}



//<!-- 체크버튼 추가 START -->
	function chg_checkopt(btnID) {//alert('function chg_checkopt(btnID)');
		var form = document.MemberLogInForm;

		if (btnID.src=="http://bimage.interpark.com/renewPark/reBookpark/aside/subRight/bt_check_on.gif")
			{
				btnID.src="http://bimage.interpark.com/renewPark/reBookpark/aside/subRight/bt_check.gif";
		 		form.elements["sc.saveMemId"].value = 'N';
		}
		else{
				btnID.src="http://bimage.interpark.com/renewPark/reBookpark/aside/subRight/bt_check_on.gif";
		 		form.elements["sc.saveMemId"].value = 'Y';
		}
	}

// mini Tab 3ro
 function miniTab(num){
	for(var i = 1; i <= 3; i++){
		if(i == num){
			document.getElementById("miniTab"+i).style.display="";
			document.getElementById("tabBg"+i).className="on"+i;
		}
		else{
			document.getElementById("miniTab"+i).style.display="none";
			document.getElementById("tabBg"+i).className="off";
		}
	}
}

// CNB Script
	function cnbView(num){
			for(var i = 1; i <= 5; i++){
				if(i == num){
				document.getElementById("cnb_ly_"+i).style.display="";
				document.getElementById("cnb_arrow_"+i).src="http://bimage.interpark.com/renewPark/reBookpark/cnb/arrow_on.gif"
			}
			else{
				document.getElementById("cnb_ly_"+i).style.display="none";
				document.getElementById("cnb_arrow_"+i).src="http://bimage.interpark.com/renewPark/reBookpark/cnb/arrow_off.gif"
			}
		}
	}

	// 우측 상사 오픈 Script
	function quickView(num){
			for(var i = 1; i <= 5; i++){
				if(i == num){
				document.getElementById("quick_ly_"+i).style.display="";
				document.getElementById("quick_arrow_"+i).src="http://bimage.interpark.com/renewPark/reBookpark/aside/quickMenu/btn_qmUp.png"
			}
			else{
				document.getElementById("quick_ly_"+i).style.display="none";
				document.getElementById("quick_arrow_"+i).src="http://bimage.interpark.com/renewPark/reBookpark/aside/quickMenu/btn_qmDown.png"
			}
		}
	}

	// Left SkyBanner Rolling Btn
	function skyRoll(num){
		for(var i = 1; i <= 2; i++){
			if(i == num){
				document.getElementById("skyRoll"+i).style.display="";
				document.getElementById("btSkyRoll"+i).className="on";
			}
			else{
				document.getElementById("skyRoll"+i).style.display="none";
				document.getElementById("btSkyRoll"+i).className="off";
			}
		}
	}

	/* ---------------------Location Navi --------------------//20150613 어디다 사용하는 물건인고??? - jslim
	jQuery(window).ready(function($){
		$(".listview").on("click",function(){
			$('.listviewOn').removeClass('listviewOn').addClass('listview');
			//노출 상태값
			var st = $(this).parent().parent().children(".navi_layer").css("display");
			//상태가 만약 히든일 경우
			if(st == 'none'){
				$(this).removeClass('listview').addClass('listviewOn');
				$(".navi_layer").hide();
				$(this).parent().parent().children(".navi_layer").show();
			//상태가 만약 노출인 경우
			}else{
				$(this).removeClass('listviewOn').addClass('listview');
				$(this).parent().parent().children(".navi_layer").hide();
			}
		});
	});
-*/
	/*-------------- LuckyBag Img Popup Script ---------------------*/
	function registerNS(ns){
	var nsParts = ns.split(".");
   	 var root = window;

		    for(var i=0; i<nsParts.length; i++){
		        if(typeof root[nsParts[i]] == "undefined")
		        	root[nsParts[i]] = new Object();
		        root = root[nsParts[i]];
		    }
		}

	Object.extend = function(source, destination, aliasName){
	  for (var property in source){
		//override
		if(!destination[property])
			destination[property] = source[property];
	  }
	  //make alias
	  if(aliasName) window[aliasName] = destination;
	  return destination;
	};

/*
	$baseclass = function(){};
	$baseclass.prototype  = Object.create({
		logger : null
	});
	$extend = function(objectSource,aliasname){
		var o;
		if(typeof(objectSource)=="object" && typeof(aliasname)=="object"){
			o = Object.extend(objectSource,aliasname);
			o.logger = new Function("str", "if(window.console != null) console.log(str)");
		}else{
			o = Object.extend(new $baseclass,objectSource);
			if(aliasname) window[aliasname] = o;
			o.logger = new Function("str", "if(window.console != null) console.log(str)");
		}
		return o;
	}
	*/