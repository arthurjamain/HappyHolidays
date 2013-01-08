/*
* TODO : Don't forget to unbind app from window.
*/

if(isCanvasSupported()) {
  Sid.js('src/app.canvas.js', function() {
    $(function() {
      window.app = new CanvasApp({
        device: 'desktop'
      });
    });
  });
} else {
  Sid.js('src/app.nocanvas.js', function() {
    $(function() {
      window.app = new NoCanvasApp({
        device: 'desktop'
      });
    });
  });
}


/**
* Create a quick/light base class
* for the app which allows the handling of
* multiple devices / technologies fairly easily
**/
var appBaseClass = function (opt) {
  appBaseClass.initialize(opt);
};
appBaseClass.extend = function(opt) {
  for(var k in opt) {
    appBaseClass.prototype[k] = appBaseClass[k];
  }
  _.extend(appBaseClass, opt);
  return appBaseClass;
};
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
appBaseClass.digits = [
  {
    startIndex: 0,
    span: 14
  },
  {
    startIndex: 15,
    span: 20
  },
  {
    startIndex: 35,
    span: 10
  },
  {
    startIndex: 45,
    span: 16
  }
];


/**
* HELPERS
**/

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


