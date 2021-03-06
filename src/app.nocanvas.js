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
      container: document.getElementById('container'),
      content: document.getElementById('content'),
      contentcopy: document.getElementById('contentcopy'),
      overlay: document.getElementById('overlay'),
      intro: document.getElementById('intro'),
      cover: document.getElementById('cover'),
      inShad: document.getElementById('insideshadow'),
      instructions: document.getElementById('instructions'),
      fakeCanvas: document.getElementById('fake-canvas')

    };

    this.setIntroElements();
    this.setIntroBounds();
    this.setContentBounds();

    $(window).on('resize', _.bind(function() {
      var contentHeight = $(this.views.content).height();
      var contentWidth = $(this.views.content).width();
      
      var xPos = ($(document).width() - contentWidth) / 2,
          yPos = ($(document).height() - contentHeight) / 2;
      
      // Align left / top of the intro block on the previous
      // small "square" to ensure seamless overlapping of triangles
      xPos = xPos - xPos%this.triangleWidth;
      yPos = yPos - yPos%this.triangleWidth;

      this.views.fakeCanvas.style.left = xPos + 'px';
      this.views.fakeCanvas.style.top = yPos + 'px';

      this.views.content.style.left = xPos + 'px';
      this.views.content.style.top = yPos + 'px';

      this.views.instructions.style.left = (($(document).width() - 50) / 2) + 'px';
      this.views.instructions.style.top = (yPos + 450) + 'px';

    }, this));


    this.waitForImages([
      'img/cover.png',
      'img/paper_pattern.png',
      'img/background.png'
    ], function() {
      setTimeout(_.bind(function() {
        $(self.views.container).css({
          display: 'block',
          opacity: 1
        });
        setTimeout(_.bind(function() {
          $(self.views.inShad).fadeOut(800);
          $('.logo').fadeIn(800);
          $(self.views.cover).fadeOut(800, _.bind(function() {
            this.triggerIntroAnimation(_.bind(function() {
              this.setContentElements();

              $(this.views.overlay).fadeIn(1000, function() {
                $(document.getElementById('fake-content')).css({
                  display: 'block'
                });
              });
              
              self.showInstructionPicto();

              $(this.views.intro).on('mouseover touchmove', function() {
                $(this).remove();
                if(self.instructionsLoop) {
                  clearInterval(self.instructionsLoop);
                  $(self.views.instructions).remove();
                }

                if(!isMobile.apple.device) {
                  self.safeEndTimeout = setTimeout(function() {

                    $(self.views.overlay).fadeOut('400', function() {
                      $(self.views.overlay).remove();
                      self.views.overlay = null;
                    });

                    $(document).off('mousemove touchmove');

                  }, 5000);
                }

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
          }, this));
        }, this), 2000);
      }, this), 2000);
    });
  },

  setContentElements: function() {

    this.totalContentTriangles = $(this.views.content).width()/10 * $(this.views.content).height()/20;
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

    $('#insideshadow').remove();

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
    this.views.intro.style.height = introHeight + 'px';
    this.views.intro.style.width = introWidth + 'px';
  },

  deleteTrianglesUnderCursor: function(e) {
    e.preventDefault();
    if((e.fromElement && e.fromElement.className.indexOf('overlay-triangle') > -1) ||
       (e.target && e.target.className && e.target.className.indexOf('overlay-triangle') > -1)) {
      
      var baseIndex = 0;
      var theel;

      if(e.fromElement) {
        theel = e.fromElement;
        baseIndex = parseInt(e.fromElement['data-index'], 10);
      } else if(e.originalEvent.pageX && e.originalEvent.pageY) {
        theel = document.elementFromPoint(e.originalEvent.pageX, e.originalEvent.pageY);
        baseIndex = parseInt(theel['data-index'], 10);
      }
      if(!theel) return;

      var indices = [];
      var elements = [];
      var odd = (theel.className.indexOf('odd') > -1);
      
      if(odd) {

        this.toggle++;
        if(this.toggle % 2 === 0) {
          indices = [baseIndex, (baseIndex + 1)];
          supplementaryTriangles = [(baseIndex + 2)];
        }
        else {
          indices = [(baseIndex - 1), (baseIndex - 2)];
          supplementaryTriangles = [(baseIndex - 1), (baseIndex - 3)];
        }

        
        for(var j in supplementaryTriangles) {
          var sup = $(this.views.overlay)[0].childNodes[supplementaryTriangles[j]];
          $(sup).css({
            borderBottomColor: 'transparent'
          });
        }

        for(var i in indices) {
          var el = $(this.views.overlay)[0].childNodes[indices[i]];
          $(el).css({
            visibility: 'hidden'
          });

        }

      } else {
        this.toggle++;
        indices = [baseIndex, (baseIndex - 2)];
        supplementaryTriangles = [(baseIndex - 1)];
        
        for(var l in supplementaryTriangles) {
          var sup2 = $(this.views.overlay)[0].childNodes[supplementaryTriangles[l]];
          $(sup2).css({
            borderTopColor: 'transparent'
          });
        }
        
        for(var k in indices) {
          var el2 = $(this.views.overlay)[0].childNodes[indices[k]];
          $(el2).css({
            visibility: 'hidden'
          });
        }
      }

      this.toggle ++;
    

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