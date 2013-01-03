$(function() {
  
  /**
  * Create a quick/light base class
  * for the app which allows the handling of
  * multiple devices / technologies fairly easily
  **/
  var appBase = function (opt) {
    appBase.initialize(opt);
  };
  appBase.extend = function(opt) {
    for(var k in opt) {
      appBase.prototype[k] = appBase[k];
    }
    _.extend(appBase, opt);
    return appBase;
  };


  var appClass = appBase.extend({

    introTriangles: [],
    introRows: 9,
    /* 
    * each digit represents the number
    * of triangles in a column.
    * The length of the array is the number
    * of columns.
    * 0 -> empty column -> whitespace
    */
    introColumnsCount: [
    1, 1, 3, 3, 4, 2,
    0,
    5, 3, 2, 2, 7, 1,
    0,
    2, 8,
    0,
    0,
    0,
    1, 3, 3, 5, 4,
    0],
    triangleWidth: 20,
    
    /**
    * Main entry point (or so it should be)
    **/
    initialize: function(opt) {
      this.device = opt.device || 'desktop';
      this.views = {
        content: document.getElementById('content'),
        intro: document.getElementById('intro')
      };

      this.setIntroElements();
      this.setIntroBounds();
      this.triggerIntroAnimation();
    },

    setIntroElements: function() {
      var aTriangle,
          container = this.views.intro,
          totalTriangles = _.reduce(this.introColumnsCount, function(memo, num) { return memo + num; });
      
      for(var i = 1; i < totalTriangles; i++) {
        aTriangle = document.createElement('div');
        aTriangle.className = 'intro-triangle';
        aTriangle.id = 'it' + i;

        this.introTriangles.push(aTriangle);

        container.appendChild(aTriangle);
      }

    },

    setIntroBounds: function() {

      var introHeight = this.triangleWidth * this.introRows;
      var introWidth = this.triangleWidth * this.introColumnsCount.length;
      
      var xPos = ($(document).width() - introWidth) / 2,
          yPos = ($(document).height() - introHeight) / 2;
      
      // Align left / top of the intro block on the previous
      // small "square" to ensure seamless overlapping of triangles
      xPos = xPos - xPos%this.triangleWidth;
      yPos = yPos - yPos%this.triangleWidth;
      this.views.intro.style.left = xPos + 'px';
      this.views.intro.style.top = yPos + 'px';
      this.views.intro.style.height = introHeight + 'px';
      this.views.intro.style.width = introWidth + 'px';
    },

    triggerIntroAnimation: function(cb) {
      setTimeout(_.bind(function() {
        this.triggerFirstIntroAnimation(function() {
          setTimeout(_.bind(function() {
            this.triggerSecondIntroAnimation(function() {
              if(typeof cb === 'function') cb.call(this);
            });
          }, this), 500);
        });
      }, this), 500);
    },

    triggerFirstIntroAnimation: function(cb) {
      this.timeOffset = 0;
      this.triangleOffset = 0;
      var self = this;
      var firstOfColumn = 1;
      var totalTriangles = _.reduce(this.introColumnsCount, function(memo, num) { return memo + num; });

      for(var i = 0; i < this.introColumnsCount.length; i++) {
        
        if(this.introColumnsCount[i] < 5) {
          for(var j = 0; j < this.introColumnsCount[i]; j++) {
            setTimeout(_.bind(function() {
              var $t = $(this.introTriangles[this.triangleOffset]);

              $t.fadeIn(100, _.bind(function() {
                setTimeout(_.bind(function() {
                  this.fadeOut(100);
                }, this), 140);

                if(self.triangleOffset == totalTriangles) {
                  if(typeof cb === 'function') cb.call(self);
                }

              }, $t));

              this.triangleOffset++;
            }, this), 50 * this.timeOffset);
            this.timeOffset++;
          }
        }
        else {
          
          setTimeout(_.bind(function() {
            var sel = '';
            for(var j = this.first; j < this.first + self.introColumnsCount[this.i]; j++) {
              sel += '#it'+(j)+',';
            }
            sel = sel.substr(0, sel.length - 1);
            
            var $k = $(sel);
            $k.fadeIn(100, _.bind(function() {
              setTimeout(_.bind(function() {
                this.fadeOut(100);
              }, this), 100);

              if(self.triangleOffset == totalTriangles) {
                if(typeof cb === 'function') cb.call(self);
              }

            }, $k));
            self.triangleOffset += self.introColumnsCount[this.i];
          }, {i: i, first: firstOfColumn}), 50 * self.timeOffset);
          this.timeoffset++;
        }
        firstOfColumn += this.introColumnsCount[i];
      }
    },

    triggerSecondIntroAnimation: function(cb) {
      this.timeOffset = 0;
      this.triangleOffset = 0;
      var totalTriangles = _.reduce(this.introColumnsCount, function(memo, num) { return memo + num; });
      /*
      for(var i = 0; i < this.introColumnsCount.length; i++) {
        for(var j = 0; j < this.introColumnsCount[i]; j++) {
          setTimeout(_.bind(function() {
            $t = $(this.introTriangles[this.triangleOffset]);

            $t.fadeIn(120);

            this.triangleOffset++;
            if(this.triangleOffset == totalTriangles) {
              if(typeof cb === 'function') cb.call(this);
            }
          }, this), 50 * this.timeOffset);
          this.timeOffset++;
        }
      }
      */
    }
  });


  /*
  * TODO : Don't forget to unbind app from window.
  */
  window.app = new appClass({
    device: 'desktop',
    strategy: 'fulljs'
  });

});
