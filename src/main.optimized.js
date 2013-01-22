(function(e){e||(e=window.isMobile={});var f=/Android/i,d=navigator.userAgent;e.apple={};e.apple.phone=/iPhone/i.test(d);e.apple.ipod=/iPod/i.test(d);e.apple.tablet=/iPad/i.test(d);e.apple.device=e.apple.phone||e.apple.ipod||e.apple.tablet;e.android={};e.android.phone=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(d);e.android.tablet=!e.android.phone&&f.test(d);e.android.device=e.android.phone||e.android.tablet;e.seven_inch=/(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)/i.test(d)})(window.isMobile);if(isMobile.android.device||(document.all&&document.addEventListener)){document.addEventListener("touchstart",function(a){a.preventDefault();return false},false);document.addEventListener("touchmove",function(a){a.preventDefault();return false},false);document.addEventListener("touchend",function(a){a.preventDefault();return false},false)}if(isCanvasSupported()){Sid.js("src/app.canvas.optimized.js",function(){$(function(){$("<img />").attr("src","img/background.png").on("load",function(){var a=new CanvasApp({device:"desktop"})})})})}else{Sid.js("src/app.nocanvas.optimized.js",function(){$(function(){var a=new NoCanvasApp({device:"desktop"})})})}var appBaseClass=function(a){var b=document.location.hash||"#joshfire";if(b&&b.length&&b.substr(1).length){if(isMobile.android.device||isMobile.apple.device||isMobile.seven_inch){$("#content, #fake-content, #contentcopy").css({backgroundImage:"url(messages/"+b.substr(1)+"_big.png)"})}else{$("#content, #fake-content, #contentcopy").css({backgroundImage:"url(messages/"+b.substr(1)+".png)"})}}appBaseClass.initialize(a)};appBaseClass.extend=function(b){for(var a in b){appBaseClass.prototype[a]=appBaseClass[a]}_.extend(appBaseClass,b);return appBaseClass};appBaseClass.colors=[["#DDDBD2",0],["#DEDBD2",1],["#DEDBD3",2],["#DEDCD3",3],["#DFDCD3",4],["#DFDCD4",5],["#DFDDD4",6],["#E0DDD4",7],["#E0DDD5",8],["#E0DED5",9],["#E1DED5",10],["#E1DED6",11],["#E1DFD6",12],["#E2DFD6",13],["#E2DFD7",14],["#E2E0D7",15],["#E3E0D7",16],["#E3E0D8",17],["#E4E1D8",18],["#E4E1D9",18],["#E4E2D9",17],["#E5E2D9",16],["#E5E2DA",15],["#E5E3DA",14],["#E6E3DA",13],["#E6E3DB",12],["#E7E4DB",11],["#E7E4DC",10],["#E7E5DC",9],["#E8E5DC",8],["#E8E5DD",7],["#E9E6DD",6],["#E9E6DE",5],["#EAE7DE",4],["#EAE7DF",3],["#EBE8DF",2],["#EBE8E0",1],["#ECE9E0",0]];appBaseClass.animatedTriangles=[{x:0,y:160,reverted:true},{x:20,y:160},{x:40,y:20},{x:40,y:140},{x:40,y:160},{x:60,y:0,reverted:true},{x:60,y:120},{x:60,y:160},{x:80,y:20},{x:80,y:80,reverted:true},{x:80,y:100},{x:80,y:160},{x:100,y:40},{x:100,y:60},{x:140,y:60,reverted:true},{x:140,y:80,reverted:true},{x:140,y:100},{x:140,y:120,reverted:true},{x:140,y:140,reverted:true},{x:160,y:20,reverted:true},{x:160,y:40},{x:160,y:160},{x:180,y:20},{x:180,y:160},{x:200,y:20,reverted:true},{x:200,y:160,reverted:true},{x:220,y:20,reverted:true},{x:220,y:60,reverted:true},{x:220,y:80,reverted:true},{x:220,y:100,reverted:true},{x:220,y:120},{x:220,y:140,reverted:true},{x:220,y:160},{x:240,y:40},{x:280,y:40},{x:280,y:20,reverted:true},{x:300,y:20},{x:300,y:40,reverted:true},{x:300,y:60,reverted:true},{x:300,y:80,reverted:true},{x:300,y:100},{x:300,y:120,reverted:true},{x:300,y:140},{x:300,y:160,reverted:true},{x:360,y:160},{x:380,y:20},{x:380,y:80},{x:380,y:160,reverted:true},{x:400,y:0,reverted:true},{x:400,y:80,reverted:true},{x:400,y:160},{x:420,y:20},{x:420,y:60,reverted:true},{x:420,y:100,reverted:true},{x:420,y:140},{x:420,y:160},{x:440,y:60},{x:440,y:120}];appBaseClass.digits=[{startIndex:0,span:14},{startIndex:14,span:20},{startIndex:34,span:10},{startIndex:44,span:16}];appBaseClass.showInstructionPicto=function(){var a=1;var b=document.getElementById("instructions");$(b).fadeIn(600);if(isMobile.apple.device||isMobile.android.device||isMobile.seven_inch){$(b).css({backgroundImage:"url(img/pictophone.png)"})}else{$(b).css({backgroundImage:"url(img/pictocomp_noresize.png)",width:75,height:75})}if(Modernizr.csstransitions){appBaseClass.instructionsLoop=setInterval(_.bind(function(){a*=-1;var d=(a<0)?"toLeft":"toRight";b.className=d},this),1200)}else{$(b).animate({left:"+="+150},1000,"easeInOutQuad",function(){});appBaseClass.instructionsLoop=setInterval(_.bind(function(){a*=-1;var c=(a<0)?-300:300;$(b).animate({left:"+="+c},1000,"easeInOutQuad",function(){})},this),1200)}};appBaseClass.setContentScale=function(){var a=$(window).width(),c=$(window).height(),d=c/a;var b=900;if(!this.scale){if(d<1){console.log(d,1/d);this.scale=(b/(b*(1/d))).toFixed(2);console.log(d,1/d,this.scale)}else{this.scale=1}}$("body > .logo").css({right:-((a*1/this.scale)-a)/2+40,bottom:-((c*1/this.scale)-c)/2+40});$("body").css({"-webkit-transform":"scale("+this.scale+")","-moz-transform":"scale("+this.scale+")","-ms-transform":"scale("+this.scale+")","-o-transform":"scale("+this.scale+")",transform:"scale("+this.scale+")"})};appBaseClass.triggerCardOpening=function(){};appBaseClass.setContentBounds=function(){var f=parseInt($(this.views.fakeCanvas).height(),10);var c=parseInt($(this.views.fakeCanvas).width(),10);var a=parseInt($(this.views.coverShadow).width(),10);var d=parseInt($(this.views.intro).width(),10);var b=parseInt($(this.views.intro).height(),10);var h=($(document).width()-c)/2,e=($(window).height()-f)/2;h=h-h%this.triangleWidth;e=e-e%this.triangleWidth;var g=parseInt(c-$(this.views.content).width(),10)/2;this.views.intro.style.marginLeft=-d/2+"px";this.views.intro.style.marginTop=-b/2+"px";this.views.fakeCanvas.style.left=h+"px";this.views.fakeCanvas.style.top=e+"px";this.views.content.style.left=(h+g)+"px";this.views.content.style.top=(e+g)+"px";this.views.content.style.zIndex=5;this.views.contentcopy.style.left=(h+g)+"px";this.views.contentcopy.style.top=(e+g)+"px";this.views.inShad.style.left=(h-5)+"px";this.views.inShad.style.top=(e-5)+"px";this.views.cover.style.width=(c)+"px";this.views.cover.style.height=(f)+"px";this.views.cover.style.left=(h)+"px";this.views.cover.style.top=(e)+"px";this.views.instructions.style.left=(($(document).width()-50)/2)+"px";this.views.instructions.style.top=(e+450)+"px";if(document.all){this.views.cover.className+=" small"}};appBaseClass.waitForImages=function(c,a){var b=this;if($.browser.msie&&parseInt($.browser.version,10)===7){if(typeof a==="function"){a.call(b)}return}if(c&&c.length){_.each(c,function(f,e){var d=new Image();d.src=f;d.onload=d.onLoad=_.bind(function(){if(this.index==(c.length-1)&&typeof a==="function"){a.call(b)}},{index:e})})}return};function isCanvasSupported(){var a=document.createElement("canvas");return !!(a.getContext&&a.getContext("2d"))}$.extend($.easing,{easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a}});