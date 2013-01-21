// isMobile()
(function(a){a||(a=window.isMobile={});var c=/Android/i,b=navigator.userAgent;a.apple={};a.apple.phone=/iPhone/i.test(b);a.apple.ipod=/iPod/i.test(b);a.apple.tablet=/iPad/i.test(b);a.apple.device=a.apple.phone||a.apple.ipod||a.apple.tablet;a.android={};a.android.phone=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(b);a.android.tablet=!a.android.phone&&c.test(b);a.android.device=a.android.phone||a.android.tablet;a.seven_inch=/(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)/i.test(b)})(window.isMobile);

/**
* Dummy touch listeners to prevent an Ice Cream Sandwich
* bug ignoring such listeners if they are bound later on
* (in a setTimeout for instance).
**/
if(isMobile.android.device || (document.all && document.addEventListener)) {
  document.addEventListener('touchstart',
    function(e) {
      e.preventDefault();
      return false;
    }, false);
  document.addEventListener('touchmove',
    function(e) {
      e.preventDefault();
      return false;
    }, false);
  document.addEventListener('touchend',
    function(e) {
      e.preventDefault();
      return false;
    }, false);
}
/*
* Main entry point
*/
if(isCanvasSupported()) {
  Sid.js('src/app.canvas.js', function() {
    $(function() {
      // Waiting for the background image to be fully loaded.
      $('<img />').attr('src', 'img/background.png').on('load', function() {
        var app = new CanvasApp({
          device: 'desktop'
        });
      });
    });
  });
} else {
  Sid.js('src/app.nocanvas.js', function() {
    $(function() {
      // Waiting for the background image to be fully loaded.
      var app = new NoCanvasApp({
        device: 'desktop'
      });
    });
  });
}

/**
* Create a quick/light base class
* for the app
**/
var appBaseClass = function (opt) {
  var h = document.location.hash || '#message';
  if(h && h.length && h.substr(1).length) {
    if(isMobile.android.device || isMobile.apple.device || isMobile.seven_inch) {
      $('#content, #fake-content, #contentcopy').css({
        backgroundImage: 'url(messages/'+h.substr(1)+'_big.png?)'
      });
    } else {
      $('#content, #fake-content, #contentcopy').css({
        backgroundImage: 'url(messages/'+h.substr(1)+'.png?)'
      });
    }
  }

  appBaseClass.initialize(opt);
};

appBaseClass.extend = function(opt) {
  for(var k in opt) {
    appBaseClass.prototype[k] = appBaseClass[k];
  }
  _.extend(appBaseClass, opt);
  return appBaseClass;
};

// All the colors of the background pattern. To get them, run
// imagemagicks' identify -verbose on the png.
// They are weighed in a normal/gaussian way in order to be distributed
// when either the canvas or the DOM triangles are being drawn.
appBaseClass.colors = [
  // color  , weight
  ['#DDDBD2', 0],
  ['#DEDBD2', 1],
  ['#DEDBD3', 2],
  ['#DEDCD3', 3],
  ['#DFDCD3', 4],
  ['#DFDCD4', 5],
  ['#DFDDD4', 6],
  ['#E0DDD4', 7],
  ['#E0DDD5', 8],
  ['#E0DED5', 9],
  ['#E1DED5', 10],
  ['#E1DED6', 11],
  ['#E1DFD6', 12],
  ['#E2DFD6', 13],
  ['#E2DFD7', 14],
  ['#E2E0D7', 15],
  ['#E3E0D7', 16],
  ['#E3E0D8', 17],
  ['#E4E1D8', 18],
  ['#E4E1D9', 18],
  ['#E4E2D9', 17],
  ['#E5E2D9', 16],
  ['#E5E2DA', 15],
  ['#E5E3DA', 14],
  ['#E6E3DA', 13],
  ['#E6E3DB', 12],
  ['#E7E4DB', 11],
  ['#E7E4DC', 10],
  ['#E7E5DC', 9],
  ['#E8E5DC', 8],
  ['#E8E5DD', 7],
  ['#E9E6DD', 6],
  ['#E9E6DE', 5],
  ['#EAE7DE', 4],
  ['#EAE7DF', 3],
  ['#EBE8DF', 2],
  ['#EBE8E0', 1],
  ['#ECE9E0', 0]
];

// Those are the coordinates (relative to the topleft point of the canvas)
// of the various points composing the animated triangles (the 2013 ones)
// They are drawn and animated sequencially, making their indexes
// somewhat important regarding the final rendering.
appBaseClass.animatedTriangles = [
  { x: 0, y: 160, reverted: true },
  { x: 20, y: 160 },
  { x: 40, y: 20 },
  { x: 40, y: 140 },
  { x: 40, y: 160 },
  { x: 60, y: 0, reverted: true },
  { x: 60, y: 120 },
  { x: 60, y: 160 },
  { x: 80, y: 20 },
  { x: 80, y: 80, reverted: true },
  { x: 80, y: 100 },
  { x: 80, y: 160 },
  { x: 100, y: 40 },
  { x: 100, y: 60 },
  { x: 140, y: 60, reverted: true },
  { x: 140, y: 80, reverted: true },
  { x: 140, y: 100 },
  { x: 140, y: 120, reverted: true },
  { x: 140, y: 140, reverted: true },
  { x: 160, y: 20, reverted: true },
  { x: 160, y: 40 },
  { x: 160, y: 160 },
  { x: 180, y: 20 },
  { x: 180, y: 160 },
  { x: 200, y: 20, reverted: true },
  { x: 200, y: 160, reverted: true },
  { x: 220, y: 20, reverted: true },
  { x: 220, y: 60, reverted: true },
  { x: 220, y: 80, reverted: true },
  { x: 220, y: 100, reverted: true },
  { x: 220, y: 120 },
  { x: 220, y: 140, reverted: true },
  { x: 220, y: 160 },
  { x: 240, y: 40 },
  { x: 280, y: 40 },
  { x: 280, y: 20, reverted: true },
  { x: 300, y: 20 },
  { x: 300, y: 40, reverted: true },
  { x: 300, y: 60, reverted: true },
  { x: 300, y: 80, reverted: true },
  { x: 300, y: 100 },
  { x: 300, y: 120, reverted: true },
  { x: 300, y: 140 },
  { x: 300, y: 160, reverted: true },
  { x: 360, y: 160 },
  { x: 380, y: 20 },
  { x: 380, y: 80 },
  { x: 380, y: 160, reverted: true },
  { x: 400, y: 0, reverted: true },
  { x: 400, y: 80, reverted: true },
  { x: 400, y: 160 },
  { x: 420, y: 20 },
  { x: 420, y: 60, reverted: true },
  { x: 420, y: 100, reverted: true },
  { x: 420, y: 140 },
  { x: 420, y: 160 },
  { x: 440, y: 60 },
  { x: 440, y: 120 }
];

// group members of the above array in digits.
appBaseClass.digits = [
  {
    startIndex: 0,
    span: 14
  },
  {
    startIndex: 14,
    span: 20
  },
  {
    startIndex: 34,
    span: 10
  },
  {
    startIndex: 44,
    span: 16
  }
];

// The limit of this light architecture is here :
// this non-canvas-dependent script has to be defined
// here to avoid code duplication. In a not-really-beautiful way.
appBaseClass.showInstructionPicto = function() {
  var toggle = 1;
  var inst = document.getElementById('instructions');

  $(inst).fadeIn(600);

  if(isMobile.apple.device || isMobile.android.device || isMobile.seven_inch) {
    $(inst).css({
      backgroundImage: 'url(img/pictophone.png)'
    });
  } else {
    $(inst).css({
      backgroundImage: 'url(img/pictocomp_noresize.png)',
      width: 75,
      height: 75
    });
  }
  if(Modernizr.csstransitions) {
    appBaseClass.instructionsLoop = setInterval(_.bind(function() {
      toggle *= -1;
      var c = (toggle < 0) ? 'toLeft' : 'toRight';
      inst.className = c;
    }, this), 1200);
  } else {

    $(inst).animate({
      left: '+=' + 150
    }, 1000, 'easeInOutQuad', function() {});

    appBaseClass.instructionsLoop = setInterval(_.bind(function() {
      toggle *= -1;
      var l = (toggle < 0) ? -300 : 300;
      $(inst).animate({
        left: '+=' + l
      }, 1000, 'easeInOutQuad', function() {});
    }, this), 1200);
  }
};

appBaseClass.setContentScale = function() {
  
  var dw = $(window).width(),
      dh = $(window).height(),
      dr = dh / dw;

  var squareAreaSide = 900;

  if(!this.scale) {
    if(dr < 1) {
      console.log(dr, 1/dr);
      this.scale = (squareAreaSide/(squareAreaSide * (1/dr))).toFixed(2);
      console.log(dr, 1/dr, this.scale);
    } else {
      this.scale = 1;
    }
  }

  $('body > .logo').css({
    right: -((dw * 1/this.scale) - dw)/2 + 40,
    bottom: -((dh * 1/this.scale) - dh)/2 + 40
  });

  $('body').css({
    '-webkit-transform': 'scale('+this.scale+')',
    '-moz-transform': 'scale('+this.scale+')',
    '-ms-transform': 'scale('+this.scale+')',
    '-o-transform': 'scale('+this.scale+')',
    'transform': 'scale('+this.scale+')'
  });
};

appBaseClass.triggerCardOpening = function() {

};
appBaseClass.setContentBounds = function() {
  var contentHeight = parseInt($(this.views.fakeCanvas).height(), 10);
  var contentWidth = parseInt($(this.views.fakeCanvas).width(), 10);
  var shadowWidth = parseInt($(this.views.coverShadow).width(), 10);
  var introWidth = parseInt($(this.views.intro).width(), 10);
  var introHeight = parseInt($(this.views.intro).height(), 10);

  var xPos = ($(document).width() - contentWidth) / 2,
      yPos = ($(window).height() - contentHeight) / 2;
  

  // Align left / top of the intro block on the previous
  // small "square" to ensure seamless overlapping of triangles
  xPos = xPos - xPos%this.triangleWidth;
  yPos = yPos - yPos%this.triangleWidth;

  var padding = parseInt(contentWidth - $(this.views.content).width(), 10) / 2;

  this.views.intro.style.marginLeft = -introWidth/2 + 'px';
  this.views.intro.style.marginTop = -introHeight/2 + 'px';

  this.views.fakeCanvas.style.left = xPos + 'px';
  this.views.fakeCanvas.style.top = yPos + 'px';

  this.views.content.style.left = (xPos + padding) + 'px';
  this.views.content.style.top = (yPos + padding) + 'px';
  this.views.content.style.zIndex = 5;

  this.views.contentcopy.style.left = (xPos + padding) + 'px';
  this.views.contentcopy.style.top = (yPos + padding) + 'px';
  
  this.views.inShad.style.left = (xPos - 5) + 'px';
  this.views.inShad.style.top = (yPos - 5) + 'px';

  this.views.cover.style.width = (contentWidth) + 'px';
  this.views.cover.style.height = (contentHeight) + 'px';
  this.views.cover.style.left = (xPos) + 'px';
  this.views.cover.style.top = (yPos) + 'px';

  this.views.instructions.style.left = (($(document).width() - 50) / 2) + 'px';
  this.views.instructions.style.top = (yPos + 450) + 'px';

  if(document.all) {
    this.views.cover.className += ' small';
  }

};
/**
* HELPERS
**/
// Canvas support
function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

// easing func for jquery
$.extend($.easing,
{
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  }
});

