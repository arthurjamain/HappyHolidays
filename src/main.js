/*
* TODO : Don't forget to unbind app from window.
*/
/*
if(isCanvasSupported()) {
  Sid.js('src/app.canvas.js', function() {
    $(function() {
      window.app = new CanvasApp({
        device: 'desktop'
      });
    });
  });
} else {*/
  Sid.js('src/app.nocanvas.js', function() {
    $(function() {
      window.app = new NoCanvasApp({
        device: 'desktop'
      });
    });
  });
//}




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


/**
* HELPERS
**/

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}


