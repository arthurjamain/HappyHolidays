var CanvasApp = appBaseClass.extend({

  views: {
    container: document.getElementById('container'),
    content: document.getElementById('content'),
    contentcopy: document.getElementById('contentcopy'),
    instructions: document.getElementById('instructions'),
    cover: document.getElementById('cover'),
    inShad: document.getElementById('insideshadow'),
    canvas: null
  },
  triangleWidth: 20,
  fadeOutThreshold: 35,
  initialize: function() {
    var self = this;
    window.app = this;

    this.totalTriangles = 0;
    this.deletedTriangles = 0;

    // The threshold is expressed as a percentage of the canvas
    // that's been cleaned. (Well, that was the plan anyway. I can't be
    // sure i've actually deleted something yet, meaning that moving the
    // cursor in a small circle will eventually clear the canvas anyway.)
    // Android devices tend to sent much less events per second, making it harder
    // to meet the threshold with a constant %. Thus, we make it vary.
    if(isMobile.apple.device)
      this.fadeOutThreshold = 25;
    if(!isMobile.apple.device && !isMobile.android.device)
      this.fadeOutThreshold = 55;

    $(window).on('resize', _.bind(this.onResize, this));

    // By default, the DOM is layed out to match the nocanvas
    // version. Hence this reinit.
    this.initializeDom();
    
    if(isMobile.android.device || isMobile.apple.device || isMobile.seven_inch)
      this.setContentScale();

    this.setContentBounds();
    this.fillCanvasWithTiledTriangles();


    this.waitForImages([
      'img/cover_large.png',
      'img/inside_shadow.png',
      'img/paper_pattern.png',
      'img/background.png'
    ], function() {
      $(self.views.container).animate({
        opacity: 1
      }, 1000);

      setTimeout(_.bind(function() {
        this.triggerCardOpening();
        setTimeout(_.bind(function() {
        $('.logo').fadeIn(1000);
          this.triggerCanvasAnimation();
        }, this), 1200);
      }, this), 2500);
    });
  },

  triggerCardOpening: function() {
    if(Modernizr.csstransforms3d) {
      $(this.views.cover).addClass('opened');
      $(this.views.inShad).addClass('opened');
      setTimeout(_.bind(function() {
        // Changing opacity seems to be less time-consuming
        // than changing diplay modes during an animation.
        // The framerate drop is less noticable.
        $(this.views.inShad).css({
          opacity: 0
        });
        
      }, this), 520),
      setTimeout(_.bind(function() {
        $(this.views.inShad).remove();
        $(this.views.coverShadow).addClass('opened');
      }, this), 650);
    } else {
      $(this.views.cover).fadeOut(1000);
      $(this.views.inShad).fadeOut(1000);
      $(this.views.coverShadow).hide();
    }
  },

  triggerCanvasAnimation: function() {
    var self = this;

    this.fillCanvasWithAnimatedTriangles(function() {
      this.fadeInSeparateLetters(_.bind(function() {
        this.deletingToggler = 0;
        this.showInstructionPicto();
        
        var ts = function(e) {
          
          var ctx = self.views.canvas.getContext('2d');
          ctx.drawImage(self.backgroundPattern, 0, 0);
          if(self.instructionsLoop) {
            clearInterval(self.instructionsLoop);
            $(self.views.instructions).fadeOut(500);
          }
          
          self.paintOverAnimatedTriangles();
          $(self.views.content).show();

          $(document).on('mousemove touchmove', 'canvas', _.bind(self.deleteTriangleUnderCursor, self));
      
          e.preventDefault();
          return false;
        };

        $(document).one('mousemove touchstart touchmove', 'canvas', ts);
        
      }, this));
      window.theapp = this;
    });
  },

  initializeDom: function() {
    $('#fake-canvas').remove();
    
    this.views.content.className += ' big';
    this.views.contentcopy.className += ' big';

    this.views.canvasContainer = document.createElement('div');
    this.views.canvasContainer.className = 'canvasContainer';

    this.views.canvas = document.createElement('canvas');
    this.views.canvas.appendChild(
      document.createTextNode('This should not happen ...'));

    this.views.canvasBackground = document.createElement('div');
    this.views.canvasBackground.className = 'canvasBackground';

    this.views.coverShadow = document.createElement('div');
    this.views.coverShadow.className = 'covershadow';

    this.views.canvasContainer.appendChild(this.views.canvasBackground);
    this.views.canvasContainer.appendChild(this.views.canvas);

    $(this.views.container).prepend(this.views.coverShadow);
    $(this.views.container).prepend(this.views.canvasContainer);

    this.views.canvasContainer.appendChild(this.views.content);

    if(document.all) {
      $(this.views.cover).addClass('small');
    }

  },

  setContentBounds: function() {
    var contentHeight = parseInt($(this.views.canvasContainer).height(), 10);
    var contentWidth = parseInt($(this.views.canvasContainer).width(), 10);
    var shadowWidth = parseInt($(this.views.coverShadow).width(), 10);
    
    if(!this.scale) this.scale = 1;

    if(isMobile.apple.device) {
      var xPos = ($(window).width() - contentWidth) / 2,
          yPos = ($(window).height() - contentHeight) / 2;
    } else {
      var xPos = ($(window).width() - contentWidth * this.scale) / 2,
          yPos = ($(window).height() - contentHeight * this.scale) / 2;
    }
    // Align left / top of the intro block on the previous
    // small "square" to ensure seamless overlapping of triangles
    xPos = xPos - xPos%this.triangleWidth;
    yPos = yPos - yPos%this.triangleWidth;

    var padding = parseInt(contentWidth - $(this.views.content).width(), 10) / 2;

    //this.views.content.style.left = (xPos + padding) + 'px';
    //this.views.content.style.top = (yPos + padding) + 'px';
    this.views.contentcopy.style.left = (xPos + padding) + 'px';
    this.views.contentcopy.style.top = (yPos + padding) + 'px';

    this.views.canvasContainer.style.left = (xPos) + 'px';
    this.views.canvasContainer.style.top = (yPos) + 'px';

    this.views.coverShadow.style.bottom = ($(document).height() - yPos) + 'px';
    this.views.coverShadow.style.left = (xPos - (contentWidth - shadowWidth) / 2 * -1) + 'px';

    this.views.canvas.style.left = padding + 'px';
    this.views.canvas.style.top = padding + 'px';

    this.views.canvasBackground.style.left = padding + 'px';
    this.views.canvasBackground.style.top = padding + 'px';
    this.views.canvasBackground.style.width = (contentWidth - padding * 2) + 'px';
    this.views.canvasBackground.style.height = (contentWidth - padding * 2) + 'px';

    this.views.inShad.style.left = (xPos - 5) + 'px';
    this.views.inShad.style.top = (yPos - 5) + 'px';

    this.views.cover.style.width = (contentWidth) + 'px';
    this.views.cover.style.height = (contentHeight) + 'px';
    this.views.cover.style.left = (xPos) + 'px';
    this.views.cover.style.top = (yPos) + 'px';

    if(this.views.canvas.width !== contentWidth)
      this.views.canvas.width = (contentWidth - padding * 2);
    if(this.views.canvas.height !== contentWidth)
      this.views.canvas.height = (contentHeight - padding * 2);

    this.views.instructions.style.left = (xPos + contentWidth/2 - $(this.views.instructions).width() / 2) + 'px';
    this.views.instructions.style.top = (yPos + contentHeight - 150) + 'px';
  },

  deleteTriangleUnderCursor: function(e) {
    e.preventDefault();
    var self = this;
    off = $('canvas').offset();
    var deletedPoint = {
      x: Math.round((this.getX(e) - off.left)/self.triangleWidth)*self.triangleWidth * (1/this.scale || 1),
      y: Math.round((this.getY(e) - off.top)/self.triangleWidth)*self.triangleWidth * (1/this.scale || 1)
    };

    if(this.deletingToggler) {
      this.deletingToggler = 0;
      self.clearLargeTriangle(deletedPoint.x, deletedPoint.y, false);
      self.deletedTriangles += 4;
    } else {
      this.deletingToggler = 1;
      self.clearLargeTriangle(deletedPoint.x, deletedPoint.y, true);
      self.deletedTriangles += 4;
    }

    //this.deletingToggler = (this.deletingToggler > 4) ? 0 : this.deletingToggler + 1 ;
    if(self.deletedTriangles >= (this.totalTriangles / 100 * this.fadeOutThreshold)) {
      $('#contentcopy').css({
        'opacity': 0,
        display: 'block'
      });
      $('#contentcopy').animate({
        opacity: '1'
      }, 1000);

      $(document).off('mousemove touchmove');
    }
    // So yeah, as per usual with android there's at least one or two main
    // devices whose behaviour is broken. This fix forces a redraw of the
    // canvas element.
    if(isMobile.android.device) {
      this.onResize(null, true);
    }

    return false;
  },

  getX: function(e) {
    if(e.pageX)
      return e.pageX;
    if(e.originalEvent) {
      if(e.originalEvent.pageX)
        return e.originalEvent.pageX;
      if(e.originalEvent.touches && e.originalEvent.touches.length) {
        if(e.originalEvent.touches[0].pageX)
          return e.originalEvent.touches[0].pageX;
      }
      if(e.originalEvent.x)
        return e.originalEvent.x;
    }
  },

  getY: function(e) {
    if(e.pageY)
      return e.pageY;
    if(e.originalEvent) {
      if(e.originalEvent.pageY)
        return e.originalEvent.pageY;
      if(e.originalEvent.touches && e.originalEvent.touches.length) {
        if(e.originalEvent.touches[0].pageY)
          return e.originalEvent.touches[0].pageY;
      }
      if(e.originalEvent.y)
        return e.originalEvent.y;
    }
  },

  paintOverAnimatedTriangles: function() {
    var ctx = this.views.canvas.getContext('2d');
    var self = this;
    for(var i in this.animatedTriangles) {
      var t = this.animatedTriangles[i],
          ac = this.hexToRgb(this.getColor());

      var ctx = this.views.canvas.getContext('2d');
      if(t.reverted) {
        ctx.fillStyle = "rgba("+ac.r+", "+ac.g+", "+ac.b+", 1)";
        ctx.beginPath();
        ctx.moveTo(t.x + this.triangleWidth, t.y + this.triangleWidth);
        ctx.lineTo(t.x + this.triangleWidth, t.y);
        ctx.lineTo(t.x, t.y + this.triangleWidth);
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba("+ac.r+", "+ac.g+", "+ac.b+", 1)";
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x + this.triangleWidth + 4, t.y);
        ctx.lineTo(t.x, t.y + this.triangleWidth + 4);
        ctx.fill();
      }
    }
  },

  fillCanvasWithAnimatedTriangles: function(cb) {
    var ctx = this.views.canvas.getContext('2d');
    var self = this;
    for(var i in this.animatedTriangles) {
      var t = this.animatedTriangles[i];
      t.x += 60;
      t.y += 200;
      setTimeout(_.bind(function() {
        self.fadeInTriangle(this.t.x, this.t.y, 150, this.t.reverted);
        setTimeout(_.bind(function() {
          self.fadeOutTriangle(this.t.x, this.t.y, 175, this.t.reverted);
          
          if(this.i == self.animatedTriangles.length - 1) {
            setTimeout(function(){
              if(typeof cb === 'function') cb.call(self);
            }, 150);
          }
        }, {t: this.t, i: this.i}), 600);
      }, {t: t, i: i}), i * 30);
      
    }
  },

  fadeInSeparateLetters: function(cb) {
    var self = this;
    for(var i in this.digits) {
      setTimeout(_.bind(function() {
        var k = 0;
        for(var j = self.digits[this.i].startIndex; j < self.digits[this.i].startIndex + self.digits[this.i].span; j++) {
          setTimeout(_.bind(function() {
            if(self.animatedTriangles[this.j])
              self.fadeInTriangle(self.animatedTriangles[this.j].x, self.animatedTriangles[this.j].y, 150, self.animatedTriangles[this.j].reverted);
            if(this.i == self.digits.length - 1 && this.j == self.digits[this.i].startIndex + self.digits[this.i].span - 1) {
              setTimeout(function(){
                if(typeof cb === 'function') cb();
              }, 150);
            }
          }, {i: this.i, j: j}), 40 * k);
          k++;
        }
      }, {i: i}), 150 * i);
    }
  },

  clearLargeTriangle: function(x, y, rev) {
    var ctx = this.views.canvas.getContext('2d');

    if(document.all) {
      ctx.clearRect(x, y, this.triangleWidth, this.triangleWidth);
      return;
    }

    if(rev) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + this.triangleWidth*2, y);
      ctx.lineTo(x, y + this.triangleWidth*2);
      ctx.save();
      ctx.clip();
      ctx.clearRect(x, y, x + this.triangleWidth * 2, y + this.triangleWidth * 2);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.moveTo(x + 40, y);
      ctx.lineTo(x + this.triangleWidth*2, y + 40);
      ctx.lineTo(x, y + this.triangleWidth*2);
      ctx.save();
      ctx.clip();
      ctx.clearRect(0, 0, 700, 300);
      ctx.restore();
    }
  },

  fadeInTriangle: function(x, y, dur, rev, cb) {
    rev = rev || false;
    var ctx = this.views.canvas.getContext('2d'),
        ticks = Math.ceil(dur / 17),
        i = 0,
        alpha = 0;
    var itv = setInterval(_.bind(function() {
      i++;
      alpha += 1/ticks;
      if(!rev) {
        //tl
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.triangleWidth, y);
        ctx.lineTo(x, y + this.triangleWidth);
        if(true) {
          ctx.clearRect(x, y, this.triangleWidth, this.triangleWidth);
        } else {
          ctx.save();
          ctx.clip();
          ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
          ctx.restore();
        }
        ctx.fillStyle = "rgba(255, 255, 255, "+ (alpha) +")";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.triangleWidth + 1, y);
        ctx.lineTo(x, y + this.triangleWidth + 1);
        ctx.fill();
      } else {
        //br
        ctx.beginPath();
        ctx.moveTo(x + this.triangleWidth, y + this.triangleWidth);
        ctx.lineTo(x + this.triangleWidth, y + 1);
        ctx.lineTo(x + 1, y + this.triangleWidth);
        if(true) {
          ctx.clearRect(x, y, this.triangleWidth, this.triangleWidth);
        } else {
        ctx.save();
        ctx.clip();
        ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
        ctx.restore();
        }
        ctx.fillStyle = "rgba(255, 255, 255, "+ (alpha) +")";
        ctx.beginPath();
        ctx.moveTo(x + this.triangleWidth, y + this.triangleWidth);
        ctx.lineTo(x + this.triangleWidth, y);
        ctx.lineTo(x, y + this.triangleWidth);
        ctx.fill();
      }

      if(i == ticks) {
        clearInterval(itv);
      }
    }, this), 17);
  },

  fadeOutTriangle: function(x, y, dur, rev, cb) {
    rev = rev || false;
    var ctx = this.views.canvas.getContext('2d'),
        ticks = Math.ceil(dur / 17),
        i = ticks,
        alpha = 1;

    var itv = setInterval(_.bind(function() {
      i--;
      alpha = alpha - 1/ticks;

      // Just try removing this if you dare...
      // wtfjs.
      alpha = alpha < 0 ? 0 : alpha;
      //console.log("Lol, wut ?", alpha);

      if(!rev) {

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.triangleWidth + 2 , y);
        ctx.lineTo(x, y + this.triangleWidth + 2);
        if(true) {
          ctx.clearRect(x, y, this.triangleWidth, this.triangleWidth);
        } else {
          ctx.save();
          ctx.clip();
          ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
          ctx.restore();
        }
        ctx.fillStyle = "rgba(255, 255, 255, "+ alpha +")";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.triangleWidth, y);
        ctx.lineTo(x, y + this.triangleWidth);
        ctx.fill();

      } else {
        
        ctx.beginPath();
        ctx.moveTo(x + this.triangleWidth, y + this.triangleWidth);
        ctx.lineTo(x + this.triangleWidth, y);
        ctx.lineTo(x, y + this.triangleWidth);
        if(true) {
          ctx.clearRect(x, y, this.triangleWidth, this.triangleWidth);
        } else {
          ctx.save();
          ctx.clip();
          ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
          ctx.restore();
        }

        ctx.fillStyle = "rgba(255, 255, 255, "+ alpha +")";
        ctx.beginPath();
        ctx.moveTo(x + this.triangleWidth, y + this.triangleWidth);
        ctx.lineTo(x + this.triangleWidth, y);
        ctx.lineTo(x, y + this.triangleWidth);
        ctx.fill();
      }

      if(i === 0) {
        clearInterval(itv);
      }
    }, this), 17);
  },

  fillCanvasWithTiledTriangles: function() {
    var w = this.views.canvas.width;
    var h = this.views.canvas.height;
    var ac;
    var ctx = this.views.canvas.getContext('2d');


    this.backgroundPattern = new Image();

    var ol = function(e) {
      ctx.drawImage(this.backgroundPattern, 0, 0);
    };

    this.backgroundPattern.onLoad = _.bind(ol, this);
    this.backgroundPattern.onload = _.bind(ol, this);
    this.backgroundPattern.src = 'img/background.png';

    this.totalTriangles = w / (this.triangleWidth / 2) * h / this.triangleWidth;

    return;
    // Turns out the whole following block is completely useless.
    // meh...
    // Drawing each triangle and assigning colors n stuff is unnecessary
    // when it is possible to draw an image and punch holes in it.
    /*
    for (var x=0; x < w; x+= this.triangleWidth) {
      for (var y=0; y < h; y+= this.triangleWidth) {

        //triangle down
        ac = this.hexToRgb(this.getColor());
        this.drawTiledTriangle(x, y, false, ac);

        //triangle up
        ac = this.hexToRgb(this.getColor());
        this.drawTiledTriangle(x, y, true, ac);

        this.totalTriangles += 2;
      }
    }
    */
  },

  drawTiledTriangle: function(x, y, rev, rgb) {
    var ctx = this.views.canvas.getContext('2d');
    if(rev) {
      ctx.fillStyle = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", 1)";
      ctx.beginPath();
      ctx.moveTo(x + this.triangleWidth, y + this.triangleWidth);
      ctx.lineTo(x + this.triangleWidth, y);
      ctx.lineTo(x, y + this.triangleWidth);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", 1)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + this.triangleWidth + 1, y);
      ctx.lineTo(x, y + this.triangleWidth + 1);
      ctx.fill();
    }
  },

  onResize: function(e, force) {
    var contentHeight = parseInt($(this.views.canvasContainer).height(), 10);
    var contentWidth = parseInt($(this.views.canvasContainer).width(), 10);
    var shadowWidth = parseInt($(this.views.coverShadow).width(), 10);
    var xPos, yPos;
    
    if(isMobile.apple.device) {
      xPos = ($(window).width() - contentWidth) / 2;
      yPos = ($(window).height() - contentHeight) / 2;
    } else {
      xPos = ($(window).width() - contentWidth * this.scale) / 2;
      yPos = ($(window).height() - contentHeight * this.scale) / 2;
    }
    
    // Align left / top of the intro block on the previous
    // small "square" to ensure seamless overlapping of triangles
    // Incidentally reduces the laggy effect so i'll leave it anyway.
    xPos = xPos - xPos%this.triangleWidth;
    yPos = yPos - yPos%this.triangleWidth;

    var padding = parseInt(contentWidth - $(this.views.content).width(), 10) / 2;

    /*
     * this param is used to forcefuly move the canvas around,
     * solving a rendering problem on android 4.
     */
    if(force) {
      this.forceResizeOffset = this.forceResizeOffset * -1 || 1;
    }

    this.views.canvas.style.left = (padding + (this.forceResizeOffset || 0)) + 'px';
    this.views.canvas.style.top = (padding + (this.forceResizeOffset * -1 || 0)) + 'px';

    this.views.contentcopy.style.left = (xPos + padding) + 'px';
    this.views.contentcopy.style.top = (yPos + padding) + 'px';

    this.views.canvasContainer.style.left = (xPos) + 'px';
    this.views.canvasContainer.style.top = (yPos) + 'px';

    this.views.coverShadow.style.bottom = $(window).height() - yPos - 3 + 'px';
    this.views.coverShadow.style.left = xPos - (contentWidth - shadowWidth) / 2 * -1 + 'px';

    this.views.instructions.style.left = (xPos + contentWidth/2 - $(this.views.instructions).width() / 2) + 'px';
    this.views.instructions.style.top = yPos + contentHeight - 150 + 'px';

    this.views.inShad.style.left = (xPos - 5) + 'px';
    this.views.inShad.style.top = (yPos - 5) + 'px';

    this.views.cover.style.left = (xPos) + 'px';
    this.views.cover.style.top = (yPos) + 'px';
    
    // Detect orientation change (cross ver/dev/whatever)
    if(isMobile.android.device || isMobile.apple.device || isMobile.seven_inch) {
      if($(window).height() !== (this.prevWindowHeight || 0)) {
        this.setContentScale();
        this.prevWindowHeight = $(window).height();
      }
    }
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

  },
  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
});