var NoCanvasApp = appBaseClass.extend({

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
    1, 3, 3, 5, 4,
    0
  ],

  triangleWidth: 20,
  
  /**
  * Main entry point (or so it should be)
  **/
  initialize: function(opt) {
    var self = this;
    this.device = opt.device || 'desktop';
    this.views = {
      content: document.getElementById('content'),
      overlay: document.getElementById('overlay'),
      intro: document.getElementById('intro')
    };

    this.setIntroElements();
    this.setIntroBounds();
    this.setContentBounds();

    this.triggerIntroAnimation(_.bind(function() {
      this.setContentElements();
      $(this.views.overlay).fadeIn(1000, function() {
      $(self.views.content).show();
      });

      $(this.views.intro).on('mouseover touchmove', function() {
        $(this).remove();
        var threshold = (self.totalContentTriangles/100 * 10);
        $(document).on('mouseover touchmove', self.views.overlay, _.bind(self.deleteTrianglesUnderCursor, {
          hidden: 0,
          toggle: 0,
          threshold: threshold,
          views: {
            overlay: self.views.overlay
          }
        }));
      });

    }, this));
  },

  setContentElements: function() {

    this.totalContentTriangles = 700/10 * 300/20;
    var aTriangle = document.createElement('div');
    aTriangle.className = 'overlay-triangle';

    for(var i = 0; i < this.totalContentTriangles; i++) {
      var a = aTriangle.cloneNode();

      var c = this.getColor();
      a.style.borderLeftColor = c;
      a.style.borderRightColor = c;

      if(i%2 !== 0) {
        a.className += ' odd';
      } else {
        a.style.borderBottomColor = c;
      }

      a['data-index'] = i;
      this.views.overlay.appendChild(a);
    }

  },

  setContentBounds: function() {
    var contentHeight = $(this.views.content).height();
    var contentWidth = $(this.views.content).width();
    
    var xPos = ($(document).width() - contentWidth) / 2,
        yPos = ($(document).height() - contentHeight) / 2;
    
    // Align left / top of the intro block on the previous
    // small "square" to ensure seamless overlapping of triangles
    xPos = xPos - xPos%this.triangleWidth;
    yPos = yPos - yPos%this.triangleWidth;
    this.views.content.style.left = xPos + 'px';
    this.views.content.style.top = yPos + 'px';
    this.views.overlay.style.left = xPos + 'px';
    this.views.overlay.style.top = yPos + 'px';
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

  deleteTrianglesUnderCursor: function(e) {
    e.preventDefault();
    if((e.fromElement && e.fromElement.className.indexOf('overlay-triangle') > -1) ||
       (e.target && e.target.className && e.target.className.indexOf('overlay-triangle') > -1)) {
      

      var baseIndex = 0;
      if(e.fromElement) {
        baseIndex = e.fromElement['data-index'];
      } else if(e.originalEvent.pageX && e.originalEvent.pageY) {
        var t = document.elementFromPoint(e.originalEvent.pageX, e.originalEvent.pageY);
        baseIndex = t['data-index'];
      }

      var indices = [];
      var elements = [];

      if(this.toggle === 0) {

        this.toggle++;
        indices = [baseIndex, baseIndex + 70, baseIndex + 2, baseIndex + 1];
        
        for(var i in indices) {
          var el = $(this.views.overlay)[0].childNodes[indices[i]];
          
          $(el).css({
            visibility: 'hidden'
          });

        }

      } else if(this.toggle == 3) {
        this.toggle++;
        indices = [baseIndex, baseIndex + 1, baseIndex - 1, baseIndex - 69];
        supplementaryTriangles = [baseIndex - 2, baseIndex - 70];

        for(var j in supplementaryTriangles) {
          var sup = $(this.views.overlay)[0].childNodes[supplementaryTriangles[j]];
          $(sup).css({
            borderBottomColor: 'transparent'
          });
        }
        for(var k in indices) {
          var el = $(this.views.overlay)[0].childNodes[indices[k]];

          $(el).css({
            visibility: 'hidden'
          });

        }
      } else {
        if(this.toggle%5 === 0) {
          this.toggle = 0;
        } else {
          this.toggle ++;
        }
      }

      if(this.hidden > this.threshold) {
        $(this.views.overlay).fadeOut('400', function() {
          if(this.views) {
            $(this.views.overlay).remove();
            this.views.overlay = null;
          }
        });
      }

      this.hidden++;
    }
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
    var cbcalled = false;
    var totalTriangles = _.reduce(this.introColumnsCount, function(memo, num) { return memo + num; });

    for(var i = 0; i < this.introColumnsCount.length; i++) {
      
      if(this.introColumnsCount[i] < 5) {
        for(var j = 0; j < this.introColumnsCount[i]; j++) {
          setTimeout(_.bind(function() {
            var $t = $(this.introTriangles[this.triangleOffset]);

            $t.fadeIn(150, _.bind(function() {
              setTimeout(_.bind(function() {
                this.fadeOut(150);
              }, this), 100);

              if(self.triangleOffset == totalTriangles && !cbcalled) {
                cbcalled = true;
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
          $k.fadeIn(150, _.bind(function() {
            setTimeout(_.bind(function() {
              this.fadeOut(150);
            }, this), 100);

            if(self.triangleOffset == totalTriangles && !cbcalled) {
              cbcalled = true;
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
    var totalTriangles = _.reduce(this.introColumnsCount, function(memo, num) { return memo + num; });
    var digits = this.splitArrayAtZeros(this.introColumnsCount);
    var launchedTriangles = 0;
    var self = this;
    for(var i = 0; i < digits.length; i++) {
      setTimeout(_.bind(function() {
        var trianglesPerDigit = 0;
        for(var j = 0; j < digits[this.i].length; j++) {
          for(var k = 0; k < digits[this.i][j]; k++) {
            trianglesPerDigit++;
          }
        }
        for(var l = 0; l < trianglesPerDigit; l++) {
          var c = launchedTriangles;
          setTimeout(_.bind(function() {
            var $t = $(this.introTriangles[c]);
            c++;
            $t.fadeIn(200);
          }, {introTriangles: this.introTriangles}), 30 * l);
          
          if(this.i == (digits.length - 1) && l == (trianglesPerDigit - 1)) {
            setTimeout(function() {
              cb.call(self);
            }, (l + 1) * 30);
          }
        }

        launchedTriangles += trianglesPerDigit;

      }, {i: i, introTriangles: this.introTriangles}), i*200);
    }
  },
  splitArrayAtZeros: function(arr) {
    var splitArray = [];
    var buffer = [];

    for(var i in arr) {
      if(arr[i] === 0) {
        if(buffer.length) {
          splitArray.push(buffer);
          buffer = [];
        }
      }
      else {
        buffer.push(arr[i]);
      }
    }

    return splitArray;

  },

  getRandomInt: function(min, max) {
    return Math.round(Math.random() * (max - min + 1)) + min;
  },

  getColor: function() {
    
    var w = 0,
        cumW = 0;

    for(var k in this.colors) {
      w += this.colors[k][1];
    }

    var rand = Math.floor(Math.random() * w);

    for(var l in this.colors) {
      cumW += this.colors[l][1];
      if(rand < cumW)
        return this.colors[l][0];
    }

  }
});