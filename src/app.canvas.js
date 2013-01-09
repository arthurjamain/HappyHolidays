var CanvasApp = appBaseClass.extend({

  views: {
    content: document.getElementById('content'),
    instructions: document.getElementById('instructions'),
    canvas: null
  },
  triangleWidth: 20,
  initialize: function() {
    // By default, the DOM is layed out to match the nocanvas
    // version. Hence this reinit.
    var self = this;
    this.totalTriangles = 0;
    this.deletedTriangles = 0;

    $(window).on('resize', _.bind(function() {
      var contentHeight = $(this.views.content).height();
      var contentWidth = $(this.views.content).width();
      
      var xPos = ($(document).width() - contentWidth) / 2,
          yPos = ($(document).height() - contentHeight) / 2;
      
      // Align left / top of the intro block on the previous
      // small "square" to ensure seamless overlapping of triangles
      xPos = xPos - xPos%this.triangleWidth;
      yPos = yPos - yPos%this.triangleWidth;

      this.views.canvas.style.left = xPos + 'px';
      this.views.canvas.style.top = yPos + 'px';

      this.views.content.style.left = xPos + 'px';
      this.views.content.style.top = yPos + 'px';

      this.views.instructions.style.left = (($(document).width() - 50) / 2) + 'px';
      this.views.instructions.style.top = (yPos + 320) + 'px';

    }, this));

    this.initializeDom();
    this.setContentBounds();
    self.fillCanvasWithTiledTriangles();
    this.fillCanvasWithAnimatedTriangles(function() {
      this.fadeInSeparateLetters(_.bind(function() {
        this.deletingToggler = 0;

        this.showInstructionPicto();

        $(document).one('mousemove touchstart', 'canvas', function() {
          self.paintOverAnimatedTriangles();
          $(self.views.content).show();
        });

        $(document).on('mousemove touchmove', 'canvas', _.bind(this.deleteTriangleUnderCursor, this));
      }, this));
      window.theapp = this;
    });
  },

  initializeDom: function() {
    $('#intro, #overlay').remove();
    this.views.content.className += ' big';
    this.views.canvas = document.createElement('canvas');
    this.views.canvas.appendChild(
      document.createTextNode('This should not happen ...'));

    $('.container').prepend(this.views.canvas);
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
    this.views.canvas.style.left = xPos + 'px';
    this.views.canvas.style.top = yPos + 'px';

    if(this.views.canvas.width !== contentWidth)
      this.views.canvas.width = contentWidth;
    if(this.views.canvas.height !== contentWidth)
      this.views.canvas.height = contentHeight;

    this.views.instructions.style.left = (($(document).width() - 50) / 2) + 'px';
    this.views.instructions.style.top = yPos + 320;
  },

  deleteTriangleUnderCursor: function(e) {
    e.preventDefault();
    var self = this;
    off = $('canvas').position();
    var deletedPoint = {
      x: Math.round((this.getX(e) - off.left)/self.triangleWidth)*self.triangleWidth,
      y: Math.round((this.getY(e) - off.top)/self.triangleWidth)*self.triangleWidth
    };

    if(this.deletingToggler == 2) {
      self.clearLargeTriangle(deletedPoint.x, deletedPoint.y, false);
      self.deletedTriangles += 4;
    } else if(this.deletingToggler == 4) {
      self.clearLargeTriangle(deletedPoint.x, deletedPoint.y, true);
      self.deletedTriangles += 4;
    }

    this.deletingToggler = (this.deletingToggler > 4) ? 0 : this.deletingToggler + 1 ;
    if(self.deletedTriangles >= (self.totalTriangles / 100 * 15)) {
      $('canvas').fadeOut(600);
    }

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
      t.x += 120;
      t.y += 60;
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
    ctx.beginPath();
    if(rev) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + this.triangleWidth*2, y);
      ctx.lineTo(x, y + this.triangleWidth*2);
    ctx.save();
    ctx.clip();
    ctx.clearRect(x, y, x + this.triangleWidth * 2, y + this.triangleWidth * 2);
    ctx.restore();
    } else {
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
        ctx.save();
        ctx.clip();
        ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
        ctx.restore();
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
        ctx.save();
        ctx.clip();
        ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
        ctx.restore();
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
        ctx.save();
        ctx.clip();
        ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
        ctx.restore();

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
        ctx.save();
        ctx.clip();
        ctx.clearRect(x, y, x + this.triangleWidth, y + this.triangleWidth);
        ctx.restore();

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