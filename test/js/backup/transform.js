var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, RESIZED_IMAGE_HEIGHT, RESIZED_IMAGE_WIDTH, Scale, Transform, Translate, UI, Util;
  Events = win.Staircase.ns('Events');
  Util = win.Staircase.ns('Util');
  UI = win.Staircase.ns('UI');
  if (Util.ua.isMobile) {
    Events.CLICK = 'touchend';
    Events.START = 'touchstart';
    Events.MOVE = 'touchmove';
    Events.END = 'touchend';
  } else {
    Events.CLICK = 'click';
    Events.START = 'mousedown';
    Events.MOVE = 'mousemove';
    Events.END = 'mouseup';
  }
  RESIZED_IMAGE_WIDTH = 0;
  RESIZED_IMAGE_HEIGHT = 0;

  /*
   * Translate
   * @constructor
   * @extends EventDispatcher
   */
  Translate = (function(superClass) {
    extend(Translate, superClass);

    function Translate() {
      Translate.__super__.constructor.call(this);
      this.$imageFrame = $('.transform__image');
      this.$image = $('img', this.$imageFrame);
      this.location = {};
      this.flag = false;
      this.initialize();
    }

    Translate.prototype.initialize = function() {
      this.imageFrameWidth = this.$imageFrame.width();
      this.imageFrameHeight = this.$imageFrame.height();
      this.location = {
        top: this.$imageFrame.offset().top,
        bottom: this.$imageFrame.offset().top + this.imageFrameHeight,
        left: this.$imageFrame.offset().left,
        right: this.$imageFrame.offset().left + this.imageFrameWidth
      };
      this.$imageFrame.data({
        location: this.location
      });
      return this.framePosition = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
    };

    Translate.prototype.adjust = function($box, x, y) {
      if (this.location.left < this.framePosition.left) {
        $box.css({
          left: 0 + x
        });
      } else if (this.location.right > this.framePosition.right) {
        $box.css({
          left: this.imageFrameWidth - this.$image.width() + x
        });
      }
      if (this.location.top < this.framePosition.top) {
        return $box.css({
          top: 0 + y
        });
      } else if (this.location.bottom > this.framePosition.bottom) {
        return $box.css({
          top: this.imageFrameHeight - this.$image.height() + y
        });
      }
    };

    Translate.prototype.start = function(e) {
      this.flag = true;
      this.startX = e.pageX;
      this.startY = e.pageY;
      this.originalTop = parseInt(this.$imageFrame.css('top'), 10);
      return this.originalLeft = parseInt(this.$imageFrame.css('left'), 10);
    };

    Translate.prototype.move = function(e) {
      var mouseX, mouseY, newX, newY;
      mouseX = e.pageX;
      mouseY = e.pageY;
      newX = mouseX - this.startX;
      newY = mouseY - this.startY;
      return this.locate(this.$imageFrame, 0, 0, newX, newY);
    };

    Translate.prototype.locate = function($box, x, y, newX, newY) {
      return $box.css({
        left: this.originalLeft + newX + x,
        top: this.originalTop + newY + y
      });
    };

    Translate.prototype.end = function(e) {
      this.flag = false;
      return this.adjustPhotoLocation();
    };

    Translate.prototype.adjustPhotoLocation = function() {
      this.framePosition = {
        top: this.$imageFrame.offset().top,
        bottom: this.$imageFrame.offset().top + this.$image.height(),
        left: this.$imageFrame.offset().left,
        right: this.$imageFrame.offset().left + this.$image.width()
      };
      return this.adjust(this.$imageFrame, 0, 0);
    };

    Translate.prototype.set = function(newX, newY) {
      this.originalTop = parseInt(this.$imageFrame.css('top'), 10);
      this.originalLeft = parseInt(this.$imageFrame.css('left'), 10);
      this.locate(this.$imageFrame, 0, 0, newX, newY);
      return this.adjustPhotoLocation();
    };

    Translate.prototype.reset = function() {
      this.location = {};
      this.$imageFrame.css({
        left: 0,
        top: 0
      });
      this.framePosition = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      this.$imageFrame.width(this.imageFrameWidth);
      return this.$imageFrame.height(this.imageFrameHeight);
    };

    return Translate;

  })(EventDispatcher);

  /*
   * Scale
   * @constructor
   * @extends EventDispatcher
   */
  Scale = (function(superClass) {
    extend(Scale, superClass);

    function Scale(id) {
      Scale.__super__.constructor.call(this);
      this.$imageFrame = $('.transform__image');
      this.$image = $('img', this.$imageFrame);
      this.ratio = 10;
      this.initialize();
    }

    Scale.prototype.initialize = function() {
      this.$image.data('baseWidth', this.$image.width());
      return this.$image.data('baseHeight', this.$image.height());
    };

    Scale.prototype.scale = function(e, zoomScale) {
      var imageLeft, imageTop, imageX, imageXcenter, imageY, imageYcenter, unitScale;
      e.preventDefault();
      imageLeft = parseInt(this.$imageFrame.css('left'), 10);
      imageTop = parseInt(this.$imageFrame.css('top'), 10);
      imageX = this.$image.offset().left;
      imageY = this.$image.offset().top;
      unitScale = 10;
      imageXcenter = imageX + this.$image.width() / unitScale / 2;
      imageYcenter = imageY - this.$image.height() / unitScale / 2;
      if (this.ratio >= unitScale * 3 && zoomScale > 0) {
        this.ratio = unitScale * 3;
      } else if (this.ratio <= unitScale && zoomScale < 0) {
        this.ratio = unitScale;
      } else {
        this.ratio += zoomScale * unitScale;
        imageLeft -= RESIZED_IMAGE_WIDTH * zoomScale / 2;
        imageTop -= RESIZED_IMAGE_HEIGHT * zoomScale / 2;
      }
      this.resize({
        top: imageTop,
        left: imageLeft,
        ratio: this.ratio
      });
      return this.trigger('scaled');
    };

    Scale.prototype.resize = function(e) {
      var resizeBox, resizeImg;
      resizeImg = function($img) {
        return $img.css({
          width: RESIZED_IMAGE_WIDTH * e.ratio / 10,
          height: RESIZED_IMAGE_HEIGHT * e.ratio / 10
        });
      };
      resizeBox = function($box, x, y) {
        return $box.css({
          left: e.left + x,
          top: e.top + y
        });
      };
      resizeImg(this.$image);
      return resizeBox(this.$imageFrame, 0, 0);
    };

    Scale.prototype.getDistance = function(e) {
      return Math.sqrt(Math.pow(Number(e.originalEvent.touches[0].pageX) - Number(e.originalEvent.touches[1].pageX), 2) + Math.pow(Number(e.originalEvent.touches[0].pageY) - Number(e.originalEvent.touches[1].pageY), 2));
    };

    Scale.prototype.getRatio = function() {
      return this.ratio;
    };

    Scale.prototype.reset = function() {
      this.ratio = 10;
      this.$image.css({
        width: '',
        height: ''
      });
      this.$imageFrame.css({
        left: 0,
        top: 0
      });
      this.$image.data('baseWidth', null);
      return this.$image.data('baseHeight', null);
    };

    return Scale;

  })(EventDispatcher);

  /*
   * Transform
   * @constructor
   * @extends EventDispatcher
   */
  Transform = (function(superClass) {
    extend(Transform, superClass);

    function Transform(id) {
      Transform.__super__.constructor.call(this);
      this.$el = $(id);
      this.initialize();
      this.eventify();
    }

    Transform.prototype.initialize = function() {
      var $image, $imageFrame, centering, imageFrameHeight, imageFrameWidth, loaded, ratio, reset, resizeImage, resizeImageBox, resizeParent, setImgToFrame;
      this.translate = null;
      this.scale = null;
      this.$dragArea = $('.transform__touch');
      this.$btnUp = $('#AdjustUp');
      this.$btnDown = $('#AdjustDown');
      this.$btnLeft = $('#AdjustLeft');
      this.$btnRight = $('#AdjustRight');
      this.$btnZoomIn = $('#ZoomIn');
      this.$btnZoomOut = $('#ZoomOut');
      $imageFrame = $('.transform__image');
      $image = $imageFrame.find('img');
      $image.css({
        width: 'auto',
        height: 'auto'
      });
      imageFrameWidth = $imageFrame.width();
      imageFrameHeight = $imageFrame.height();
      ratio = 10;
      resizeImage = function($img) {
        var aspectRatio, height, width;
        width = $img.width();
        height = $img.height();
        aspectRatio = width / height;
        RESIZED_IMAGE_WIDTH = imageFrameWidth;
        RESIZED_IMAGE_HEIGHT = RESIZED_IMAGE_WIDTH / aspectRatio;
        if (RESIZED_IMAGE_HEIGHT < imageFrameHeight) {
          RESIZED_IMAGE_HEIGHT = imageFrameHeight;
          RESIZED_IMAGE_WIDTH = RESIZED_IMAGE_HEIGHT * aspectRatio;
        }
        $img.css({
          width: RESIZED_IMAGE_WIDTH,
          height: RESIZED_IMAGE_HEIGHT
        });
        return resizeImageBox($img);
      };
      resizeImageBox = function($img) {
        return $imageFrame.css({
          width: $img.width(),
          height: $img.height()
        });
      };
      resizeParent = function($img) {
        return $imageFrame.css({
          width: $img.width(),
          height: $img.height()
        });
      };
      centering = function($box, $frame, x, y) {
        var left, top;
        top = ($box.height() - $frame.height()) / 2;
        left = ($box.width() - $frame.width()) / 2;
        return $box.css({
          top: -top + y,
          left: -left + x
        });
      };
      loaded = (function(_this) {
        return function() {
          if (_this.translate == null) {
            _this.translate = new Translate();
          } else {
            _this.translate.initialize();
          }
          if (_this.scale == null) {
            _this.scale = new Scale();
          } else {
            _this.scale.initialize();
          }
          resizeImage($image);
          return centering($imageFrame, $imageFrame, 0, 0);
        };
      })(this);
      $image.on('load', (function(_this) {
        return function() {
          return loaded();
        };
      })(this));
      setImgToFrame = (function(_this) {
        return function() {
          return $image.attr({
            src: Util.getImagePath()
          });
        };
      })(this);
      setImgToFrame();
      reset = (function(_this) {
        return function() {
          if (_this.translate != null) {
            _this.translate.reset();
            _this.translate.initialize();
          }
          if (_this.scale != null) {
            _this.scale.reset();
            return _this.scale.initialize();
          }
        };
      })(this);
      this.setImage = setImgToFrame;
      return this.reset = reset;
    };

    Transform.prototype.eventify = function() {
      var currentScale, moveDistance, saveScale, startDistance;
      this.$dragArea.on(Events.START, (function(_this) {
        return function(e) {
          if (!e.pageX) {
            e = event.touches[0];
          }
          return _this.translate.start(e);
        };
      })(this));
      $(doc).on(Events.MOVE, (function(_this) {
        return function(e) {
          if ((_this.translate != null) && _this.translate.flag === true) {
            if (!e.pageX) {
              e = event.touches[0];
            }
            return _this.translate.move(e);
          }
        };
      })(this));
      $(doc).on(Events.END, (function(_this) {
        return function(e) {
          return _this.translate.end();
        };
      })(this));
      this.$btnZoomIn.on(Events.CLICK, (function(_this) {
        return function(e) {
          return _this.scale.scale(e, 0.2);
        };
      })(this));
      this.$btnZoomOut.on(Events.CLICK, (function(_this) {
        return function(e) {
          return _this.scale.scale(e, -0.2);
        };
      })(this));
      this.$btnUp.on(Events.CLICK, (function(_this) {
        return function() {
          return _this.translate.set(0, -10);
        };
      })(this));
      this.$btnDown.on(Events.CLICK, (function(_this) {
        return function() {
          return _this.translate.set(0, 10);
        };
      })(this));
      this.$btnLeft.on(Events.CLICK, (function(_this) {
        return function() {
          return _this.translate.set(-10, 0);
        };
      })(this));
      this.$btnRight.on(Events.CLICK, (function(_this) {
        return function() {
          return _this.translate.set(10, 0);
        };
      })(this));
      if (Util.ua.isMobile) {
        startDistance = 0;
        moveDistance = 0;
        currentScale = 1;
        saveScale = 10;
        this.$dragArea.on('touchstart', (function(_this) {
          return function(e) {
            e.preventDefault();
            if (e.originalEvent.touches.length === 2) {
              return startDistance = _this.scale.getDistance(e);
            }
          };
        })(this));
        return this.$dragArea.on('touchmove', (function(_this) {
          return function(e) {
            if (e.originalEvent.touches.length === 2) {
              moveDistance = _this.scale.getDistance(e);
              ratio *= moveDistance / startDistance;
              return _this.scale.scale(e, ratio / 10 - 1);
            }
          };
        })(this));
      }
    };

    return Transform;

  })(EventDispatcher);
  return UI.Transform = Transform;
})(window, window.document);
