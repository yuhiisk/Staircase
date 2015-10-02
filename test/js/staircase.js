(function(win, doc) {
  'use strict';
  win.Staircase = win.Staircase || {};
  Staircase.defaults = {
    size: 640,
    trim_offset_top: 176,
    trim_offset_left: 0,
    trim_width: 886,
    trim_height: 236,
    eventNamespace: 'Staircase',
    params: {},
    path: 'image_path',
    uuid: 'image_uuid',
    modal: '#Modal',
    modalPage: '.wrapper',
    camera: '#Video',
    previewCanvas: '#Canvas',
    previewContainer: '#PreviewContainer',
    uploader: '#StartUpload',
    reUploadSize: 640,
    loading: '#Loading',
    cameraScene: '#Camera',
    previewScene: '#Preview',
    loadingScene: '#Loading',
    sceneManager: [],
    btnStartUpload: '#StartUpload',
    btnStartCamera: '#StartCamera',
    btnCancelCamera: '#Cancel',
    btnCaptureCamera: '#Capture',
    btnRetakeCapture: '#Retake',
    btnReselect: '#Reselect',
    btnPostWebCamera: '#PostWebCamera',
    btnPostPhoto: '#PostPhoto',
    uploadForm: '#Upload',
    debugMode: 'debug'
  };

  /*
   * API
   */
  Staircase.API = {
    upload: 'http://example.com/'
  };

  /*
   * Debug
   */
  Staircase.Debug = (function() {
    var regExp;
    regExp = new RegExp("^\\?" + Staircase.defaults.debugMode + "$");
    return regExp.test(location.search);
  })();

  /*
   * Utilities
   */
  Staircase.Util = {};

  /*
   * Parameters
   */
  Staircase.Params = {};

  /*
   * UI components
   */
  Staircase.UI = {};
  Staircase.UI.TRIM_OFFSET_TOP = Staircase.defaults.trim_offset_top;
  Staircase.UI.TRIM_OFFSET_LEFT = Staircase.defaults.trim_offset_left;
  Staircase.UI.TRIM_WIDTH = Staircase.defaults.trim_width;
  Staircase.UI.TRIM_HEIGHT = Staircase.defaults.trim_height;
  Staircase.UI.TRIM_RATIO = (function() {
    return Staircase.UI.TRIM_WIDTH / Staircase.defaults.size;
  })();

  /*
   * Events
   */
  Staircase.Events = {
    CAMERA_SUCCESS: Staircase.defaults.eventNamespace + 'camera_success',
    CAMERA_ERROR: Staircase.defaults.eventNamespace + 'camera_error',
    UPLOAD_LOAD_IMG: Staircase.defaults.eventNamespace + 'upload_img_load',
    UPLOAD_READER: Staircase.defaults.eventNamespace + 'upload_reader',
    PREVIEW_SEND: Staircase.defaults.eventNamespace + 'preview_send',
    PREVIEW_CAMERA: Staircase.defaults.eventNamespace + 'preview_camera',
    PREVIEW_PHOTO: Staircase.defaults.eventNamespace + 'preview_photo',
    REUPLOAD_SUBMIT: Staircase.defaults.eventNamespace + 'reupload_submit',
    REUPLOAD_SUCCESS: Staircase.defaults.eventNamespace + 'reupload_success',
    REUPLOAD_ERROR: Staircase.defaults.eventNamespace + 'reupload_error',
    CHECK_PROCESS: Staircase.defaults.eventNamespace + 'check_process',
    CHECK_COMPLETE: Staircase.defaults.eventNamespace + 'check_complete',
    CHECK_ERROR: Staircase.defaults.eventNamespace + 'check_error',
    MODAL_SHOW: Staircase.defaults.eventNamespace + 'modal_show',
    MODAL_HIDE: Staircase.defaults.eventNamespace + 'modal_hide'
  };

  /*
   * Error
   */
  return Staircase.Error = {
    code: {
      '0': '0',
      '2': '2'
    },
    text: {
      '0': '瞳を検出することが出来ませんでした。',
      '2': '複数の瞳が検出されました'
    }
  };
})(window, window.document);

(function(win, doc) {
  'use strict';
  var Params, Util, getParam, getQueryString, parseJSON, ua;
  Util = Staircase.Util;
  Params = Staircase.Params;
  ua = navigator.userAgent.toLowerCase();
  Util.ua = {};
  Util.ua.browser = ua;
  Util.ua.isIOS = /(iphone|ipod|ipad)/.test(ua);
  Util.ua.isAndroid = /(android)/.test(ua);
  Util.ua.isMobile = Util.ua.isIOS || Util.ua.isAndroid;
  getQueryString = function() {
    var element, i, j, paramName, paramValue, parameters, query, ref, result;
    result = {};
    if (1 < win.location.search.length) {
      query = win.location.search.substring(1);
      parameters = query.split('&');
      for (i = j = 0, ref = parameters.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        element = parameters[i].split('=');
        paramName = decodeURIComponent(element[0]);
        paramValue = decodeURIComponent(element[1]);
        result[paramName] = paramValue;
      }
    }
    return result;
  };
  Util.getQueryString = getQueryString;
  parseJSON = function(data) {
    if (win.JSON && win.JSON.parse) {
      return win.JSON.parse(data + '');
    }
  };
  Util.parseJSON = parseJSON;
  getParam = function(key, value) {
    return Params[key][value];
  };
  return Util.getParam = getParam;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Camera, Events, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * Camera
   * @constructor
   * @extends EventEmitter2
   * @params {String} DOM id
   */
  Camera = (function(superClass) {
    extend(Camera, superClass);

    function Camera(id) {
      Camera.__super__.constructor.call(this, id);
      this.initialize(id);
    }

    Camera.prototype.initialize = function(id) {
      var _getStatus, _getVideo, _handleError, _handleSuccess, _isSupport, _powerOn, status, video;
      video = $(id)[0];
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      status = false;
      _handleSuccess = (function(_this) {
        return function(localMediaStream) {
          status = true;
          video.src = window.URL.createObjectURL(localMediaStream);
          video.play();
          _this.powerOff = function() {
            localMediaStream.stop();
            return status = false;
          };
          return _this.emit(Events.CAMERA_SUCCESS, null, localMediaStream);
        };
      })(this);
      _handleError = (function(_this) {
        return function(e) {
          status = false;
          return _this.emit(Events.CAMERA_ERROR, null, e);
        };
      })(this);
      _powerOn = (function(_this) {
        return function() {
          return navigator.getUserMedia({
            video: true,
            audio: false
          }, _handleSuccess, _handleError);
        };
      })(this);
      _isSupport = (function() {
        return navigator.getUserMedia;
      })();
      _getStatus = function() {
        return status;
      };
      _getVideo = function() {
        return video;
      };
      this.powerOn = _powerOn;
      this.powerOff = function() {};
      this.isSupport = _isSupport;
      this.getStatus = _getStatus;
      return this.getVideo = _getVideo;
    };

    return Camera;

  })(EventEmitter2);
  return UI.Camera = Camera;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, PreviewCanvas, PreviewImage, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * PreviewCanvas
   * @constructor
   * @extends EventEmitter2
   * @params {string} DOM id
   */
  PreviewCanvas = (function(superClass) {
    extend(PreviewCanvas, superClass);

    function PreviewCanvas(id) {
      PreviewCanvas.__super__.constructor.call(this, id);
      this.initialize(id);
    }

    PreviewCanvas.prototype.initialize = function(id) {
      var _ctx, _reset, _toBinary, canvas, draw, getBlob, getCanvas, self, wrap;
      self = this;
      canvas = $(id)[0];
      _ctx = canvas.getContext ? canvas.getContext("2d") : null;;
      _reset = function() {
        canvas.width = 0;
        return canvas.height = 0;
      };
      _reset();
      _toBinary = function() {
        var base64, bin, buffer, i, j, ref;
        base64 = canvas.toDataURL("image/png");
        bin = atob(base64.replace(/^.*,/, ""));
        buffer = new Uint8Array(bin.length);
        for (i = j = 0, ref = bin.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          buffer[i] = bin.charCodeAt(i);
        }
        return buffer;
      };
      wrap = function() {
        return self.emit(Events.PREVIEW_SEND);
      };
      draw = function(src) {
        canvas.width = src.videoWidth;
        canvas.height = src.videoHeight;
        return _ctx.drawImage(src, 0, 0);
      };
      getCanvas = function() {
        return canvas;
      };
      getBlob = function() {
        var blob, buf;
        buf = _toBinary();
        blob = new Blob([buf.buffer], {
          type: 'image/png'
        });
        wrap();
        return blob;
      };
      this.wrap = wrap;
      this.draw = draw;
      this.getCanvas = getCanvas;
      this.getBlob = getBlob;
      return this.reset = _reset;
    };

    return PreviewCanvas;

  })(EventEmitter2);
  UI.PreviewCanvas = PreviewCanvas;

  /*
   * PreviewImage
   * @constructor
   * @extends EventEmitter2
   * @params id {String} DOM id
   * @params res {Object} Response data
   */
  PreviewImage = (function(superClass) {
    extend(PreviewImage, superClass);

    function PreviewImage(id) {
      PreviewImage.__super__.constructor.call(this, id);
      this.$el = $(id);
      this.el = this.$el[0];
      this.img = new Image();
      this.initialize();
    }

    PreviewImage.prototype.initialize = function() {
      var _hide, _render, _reset, _show;
      _render = function(path) {
        this.img.src = "http://" + path;
        return this.el.appendChild(this.img);
      };
      _show = function() {
        return this.el.style.display = 'block';
      };
      _hide = function() {
        return this.el.style.display = 'none';
      };
      _reset = function() {
        this.hide();
        return this.el.removeChild(this.img);
      };
      this.render = _render;
      this.show = _show;
      this.hide = _hide;
      return this.reset = _reset;
    };

    return PreviewImage;

  })(EventEmitter2);
  return UI.PreviewImage = PreviewImage;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, ProcessChecker, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * ProcessChecker
   * サーババッチ処理の完了チェッカ
   * @constructor
   * @extends EventEmitter2
   */
  ProcessChecker = (function(superClass) {
    extend(ProcessChecker, superClass);

    function ProcessChecker(options) {
      ProcessChecker.__super__.constructor.call(this, options);
      this.initialize();
    }

    ProcessChecker.prototype.initialize = function() {
      var _getStatus, _set, _start, _stop, isComplete, self, timer, url;
      self = this;
      isComplete = false;
      timer = null;
      url = '';
      _set = function(path) {
        url = path;
        return this;
      };
      _start = function() {
        isComplete = false;
        return timer = setInterval(function() {
          return $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'callback'
          }).done(function(res) {
            if (res.is_recogition_finished === true) {
              _stop();
              isComplete = true;
              return self.emit(Events.CHECK_COMPLETE, null, res);
            } else if (res.is_recogition_finished === false) {
              return self.emit(Events.CHECK_PROCESS, null, res);
            }
          });
        }, 1000);
      };
      _stop = function() {
        clearInterval(timer);
        return timer = null;
      };
      _getStatus = function() {
        return isComplete;
      };
      this.set = _set;
      this.start = _start;
      this.stop = _stop;
      return this.getStatus = _getStatus;
    };

    return ProcessChecker;

  })(EventEmitter2);
  return UI.ProcessChecker = ProcessChecker;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, ORIGINAL_IMAGE_WIDTH, ReUploader, UI, Util;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  ORIGINAL_IMAGE_WIDTH = 640;

  /*
   * Re-Uploader
   * @constructor
   * @extends EventEmitter2
   * @params {object} options
   */
  ReUploader = (function(superClass) {
    extend(ReUploader, superClass);

    function ReUploader(option) {
      ReUploader.__super__.constructor.call(this, option);
      this.size = option.size || ORIGINAL_IMAGE_WIDTH;
      this.expansion = ORIGINAL_IMAGE_WIDTH / this.size;
      this.initialize();
      this.eventify();
    }

    ReUploader.prototype.initialize = function() {
      this.$form = $('#Adjust');
      this.$imageFrame = $('.transform__image');
      return this.$image = $('img', this.$imageFrame);
    };

    ReUploader.prototype.eventify = function() {
      return this.$form.on('submit', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.submit();
        };
      })(this));
    };

    ReUploader.prototype.submit = function() {
      var params, ratio;
      ratio = this.$image.width() / this.size + (UI.TRIM_RATIO - 1);
      params = {
        image_uuid: Util.getImageId(),
        zoom: ratio,
        x: (UI.TRIM_OFFSET_LEFT * UI.TRIM_RATIO) + Math.abs(this.$imageFrame.position().left) * this.expansion,
        y: (UI.TRIM_OFFSET_TOP * UI.TRIM_RATIO) + Math.abs(this.$imageFrame.position().top) * this.expansion,
        width: UI.TRIM_WIDTH,
        height: UI.TRIM_HEIGHT
      };
      this.emit(Events.REUPLOAD_SUBMIT, null, params);
      return $.ajax({
        type: 'POST',
        url: this.$form.attr('action'),
        data: params
      }).done((function(_this) {
        return function(e) {
          return _this.emit(Events.REUPLOAD_SUCCESS, null, e);
        };
      })(this)).fail((function(_this) {
        return function(e) {
          return _this.emit(Events.REUPLOAD_ERROR, null, e);
        };
      })(this));
    };

    return ReUploader;

  })(EventEmitter2);
  return UI.ReUploader = ReUploader;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, RESIZED_IMAGE_HEIGHT, RESIZED_IMAGE_WIDTH, Scale, Transform, Translate, UI, Util;
  Events = Staircase.Events;
  UI = Staircase.UI;
  Util = Staircase.Util;
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
   * @extends EventEmitter2
   */
  Translate = (function(superClass) {
    extend(Translate, superClass);

    function Translate(option) {
      Translate.__super__.constructor.call(this, option);
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

  })(EventEmitter2);

  /*
   * Scale
   * @constructor
   * @extends EventEmitter2
   */
  Scale = (function(superClass) {
    extend(Scale, superClass);

    function Scale(id) {
      Scale.__super__.constructor.call(this, id);
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
      return this.emit('scaled');
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

  })(EventEmitter2);

  /*
   * Transform
   * @constructor
   * @extends EventEmitter2
   */
  Transform = (function(superClass) {
    extend(Transform, superClass);

    function Transform(id) {
      Transform.__super__.constructor.call(this, id);
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

  })(EventEmitter2);
  return UI.Transform = Transform;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Debug, Events, UI, Uploader, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  UI = Staircase.UI;
  Util = Staircase.Util;

  /*
   * Uploader
   * @constructor
   * @extends EventEmitter2
   */
  Uploader = (function(superClass) {
    extend(Uploader, superClass);

    function Uploader(id) {
      Uploader.__super__.constructor.call(this, id);
      this.$el = $(id);
      this.initialize();
    }

    Uploader.prototype.initialize = function(els) {
      var $iframe, $input, _handleFileChange, _handleImgLoad, _handleReaderLoad, _onChangeHandler, reset, self;
      self = this;
      $input = this.$el.find('input[type="file"]');
      $iframe = this.$el.find('iframe');
      _handleFileChange = function(e) {
        var file, reader;
        reader = new FileReader();
        file = e.target.files[0];
        reader.onload = _handleReaderLoad;
        return reader.readAsDataURL(file);
      };
      _handleReaderLoad = function(e) {
        var img;
        self.emit(Events.UPLOAD_READER);
        img = new Image();
        img.onload = _handleImgLoad;
        return img.src = e.target.result;
      };
      _handleImgLoad = function(e) {
        return self.emit(Events.UPLOAD_LOAD_IMG);
      };
      _onChangeHandler = function(e) {
        if (Debug) {
          $iframe.attr({
            src: '/stub/_image.html',
            width: 500,
            height: 300
          });
          return;
        }
        if (Util.ua.isMobile || !win.FileReader) {
          return self.$el.find('form').submit();
        } else {
          return _handleFileChange(e);
        }
      };
      $input.on('change', _onChangeHandler);
      reset = function() {
        $input.val('');
        $input.off('change');
        $input.parent().html($input.parent().html());
        $input = this.$el.find('input[type="file"]');
        return $input.on('change', _onChangeHandler);
      };
      return this.reset = reset;
    };

    return Uploader;

  })(EventEmitter2);
  return UI.Uploader = Uploader;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Exchange, Loading, LoadingSprite, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * Loading
   * @constructor
   * @extends EventEmitter2
   */
  Loading = (function(superClass) {
    extend(Loading, superClass);

    function Loading(id) {
      Loading.__super__.constructor.call(this, id);
      this.$el = $(id);
      this.$icon = this.$el.find('.loading__icon');
      this.initialize();
      this.eventify();
    }

    Loading.prototype.initialize = function() {
      var _start, _stop;
      _start = (function(_this) {
        return function() {
          _this.$icon.addClass('is-active');
          return _this.emit(Events.LOADING_SHOW);
        };
      })(this);
      _stop = (function(_this) {
        return function() {
          _this.$icon.removeClass('is-active');
          return _this.emit(Events.LOADING_HIDE);
        };
      })(this);
      this.start = _start;
      return this.stop = _stop;
    };

    Loading.prototype.eventify = function() {};

    return Loading;

  })(EventEmitter2);
  UI.Loading = Loading;

  /*
   * LoadingSprite
   * @constructor
   * @extends EventEmitter2
   */
  LoadingSprite = (function(superClass) {
    extend(LoadingSprite, superClass);

    function LoadingSprite(el) {
      LoadingSprite.__super__.constructor.call(this, el);
      this.$el = $(el);
      this.$icon = $('.loading__icon', this.$el);
      this.defaultClass = this.$icon.attr('class');
      this.initialize();
      this.eventify();
    }

    LoadingSprite.prototype.initialize = function() {
      var _rotate, _start, _stop, count, interval, max, timer;
      timer = null;
      interval = 40;
      count = 0;
      max = 36;
      _rotate = (function(_this) {
        return function() {
          return timer = setInterval(function() {
            count++;
            _this.$icon[0].className = _this.defaultClass + ' loading-n' + count;
            if (count >= max) {
              return count = 0;
            }
          }, interval);
        };
      })(this);
      _start = (function(_this) {
        return function() {
          _this.$el.show();
          _rotate();
          return _this.emit(Events.LOADING_START);
        };
      })(this);
      _stop = (function(_this) {
        return function() {
          _this.$el.hide();
          timer = clearInterval(timer);
          timer = null;
          return _this.emit(Events.LOADING_STOP);
        };
      })(this);
      this.start = _start;
      return this.stop = _stop;
    };

    LoadingSprite.prototype.eventify = function() {};

    return LoadingSprite;

  })(EventEmitter2);
  UI.LoadingSprite = LoadingSprite;

  /*
   * Exchange
   * @constructor
   * @extends EventEmitter2
   */
  Exchange = (function(superClass) {
    extend(Exchange, superClass);

    function Exchange(id) {
      Exchange.__super__.constructor.call(this, id);
      this.$el = $(id);
      this.$icon = this.$el.find('.loading__icon');
      this.initialize();
    }

    Exchange.prototype.initialize = function() {
      var _active, _deactive, _hide, _show;
      _show = (function(_this) {
        return function() {
          _this.$el.removeClass('is-hidden');
          return _this;
        };
      })(this);
      _hide = (function(_this) {
        return function() {
          _this.$el.addClass('is-hidden');
          return _this;
        };
      })(this);
      _active = (function(_this) {
        return function() {
          _this.$icon.addClass('is-active');
          return _this;
        };
      })(this);
      _deactive = (function(_this) {
        return function() {
          _this.$icon.removeClass('is-active');
          return _this;
        };
      })(this);
      this.show = _show;
      this.hide = _hide;
      this.active = _active;
      return this.deactive = _deactive;
    };

    return Exchange;

  })(EventEmitter2);
  return UI.Exchange = Exchange;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Modal, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * Modal
   * @constructor
   * @extends EventEmitter2
   */
  Modal = (function(superClass) {
    extend(Modal, superClass);

    function Modal(option) {
      Modal.__super__.constructor.call(this, option);
      this.$el = $(option.id);
      this.$page = $(option.page);
      this.$win = $(win);
      this.winHeight = this.$win.height();
      this.currentScroll = 0;
      this.initialize();
      this.eventify();
    }

    Modal.prototype.initialize = function() {
      var _hide, _show;
      _show = (function(_this) {
        return function() {
          _this._fixed();
          _this.$el.show();
          return _this.emit(Events.MODAL_SHOW);
        };
      })(this);
      _hide = (function(_this) {
        return function() {
          _this._static();
          _this.$el.hide();
          return _this.emit(Events.MODAL_HIDE);
        };
      })(this);
      this.show = _show;
      return this.hide = _hide;
    };

    Modal.prototype.eventify = function() {
      return this.$el.on('click', '.modal__bg, .modal__close', (function(_this) {
        return function(e) {
          return _this.hide();
        };
      })(this));
    };

    Modal.prototype._fixed = function() {
      var scrollTop;
      scrollTop = this.$win.scrollTop() * -1;
      this.currentScroll = this.$win.scrollTop();
      this.$page.addClass('is-fixed').css('top', scrollTop);
      this.$el.css({
        position: 'relative',
        height: this.winHeight
      });
      return this.$win.scrollTop(0);
    };

    Modal.prototype._static = function() {
      var scrollTop;
      scrollTop = this.$win.scrollTop() * -1;
      this.$page.removeClass('is-fixed').css('top', '');
      this.$el.css({
        position: '',
        height: 'auto'
      });
      return this.$win.scrollTop(this.currentScroll);
    };

    return Modal;

  })(EventEmitter2);
  return UI.Modal = Modal;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, SceneManager, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * SceneManager
   * シーン管理クラス
   * @constructor
   * @extends EventEmitter2
   * @params {HTMLElement} DOM
   */
  SceneManager = (function(superClass) {
    extend(SceneManager, superClass);

    function SceneManager(scene) {
      SceneManager.__super__.constructor.call(this, scene);
      this.scenes = scene || [];
      this.current = 0;
      this.active(this.current);
    }

    SceneManager.prototype.add = function(scene) {
      return this.scenes.push(scene);
    };

    SceneManager.prototype.active = function(index, silent) {
      var current, i, j, ref, scene;
      if (index != null) {
        current = index;
      } else {
        current = this.current;
      }
      for (i = j = 0, ref = this.scenes.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        scene = this.scenes[i];
        if (i === current) {
          scene.active();
        } else {
          scene.deactive();
        }
      }
      this.current = current;
      return this.emit('sceneManager.active', null, this.current);
    };

    SceneManager.prototype.deactive = function(index) {
      var current;
      if (index != null) {
        current = index;
      } else {
        current = this.current;
      }
      this.scenes[index].deactive();
      this.current = current;
      return this.emit('sceneManager.deactive', null, this.current);
    };

    SceneManager.prototype.reset = function() {
      var i, j, ref, scene;
      this.current = 0;
      for (i = j = 0, ref = this.scene.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        scene = this.scene[i];
        scene.deactive();
      }
      return this.scenes = [];
    };

    SceneManager.prototype.first = function() {
      return this.scenes[0];
    };

    SceneManager.prototype.last = function() {
      return this.scenes[this.scenes.length - 1];
    };

    SceneManager.prototype.isFirst = function() {
      return this.current === 0;
    };

    SceneManager.prototype.isLast = function() {
      return this.current === this.scenes.length - 1;
    };

    SceneManager.prototype.prev = function() {
      if (this.hasPrev()) {
        return this.active(--this.current);
      }
    };

    SceneManager.prototype.next = function() {
      if (this.hasNext()) {
        return this.active(++this.current);
      }
    };

    SceneManager.prototype.hasPrev = function() {
      return 0 <= this.current - 1;
    };

    SceneManager.prototype.hasNext = function() {
      return this.scenes.length > this.current + 1;
    };

    return SceneManager;

  })(EventEmitter2);
  return UI.SceneManager = SceneManager;
})(window, window.document);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Scene, UI;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * Scene
   * シーン単体のクラス
   * @constructor
   * @extends EventEmitter2
   * @params {string} DOM id
   */
  Scene = (function(superClass) {
    extend(Scene, superClass);

    function Scene(id) {
      Scene.__super__.constructor.call(this, id);
      this.el = $(id)[0];
      this.items = [];
      this.initialize();
    }

    Scene.prototype.initialize = function() {};

    Scene.prototype.add = function(item) {
      this.items.push(item);
      return this.emit('scene.add', item, this);
    };

    Scene.prototype.active = function() {
      var i, item, len, ref;
      if (this.items.length > 0) {
        ref = this.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          item.show();
        }
      }
      this.el.style.display = 'block';
      return this.emit('scene.active', this);
    };

    Scene.prototype.deactive = function() {
      var i, item, len, ref;
      if (this.items.length > 0) {
        ref = this.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          item.hide();
        }
      }
      this.el.style.display = 'none';
      return this.emit('scene.deactive', this);
    };

    return Scene;

  })(EventEmitter2);
  return UI.Scene = Scene;
})(window, window.document);

(function(win, doc, Staircase) {
  'use strict';
  var Debug, Events, Main, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Params.upload = {};
  Params.reupload = {};
  Util.getImagePath = function() {
    return Params.upload.image_path;
  };
  Util.getImageId = function() {
    return Params.upload.image_uuid;
  };

  /*
   * Entry Point
   */
  Main = (function() {
    function Main(option) {
      this.settings = $.extend(Staircase.defaults, option);
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.modal = new UI.Modal({
        id: this.settings.modal,
        page: this.settings.modalPage
      });
      this.camera = new UI.Camera(this.settings.camera);
      this.previewCanvas = new UI.PreviewCanvas(this.settings.previewCanvas);
      this.previewImage = new UI.PreviewImage(this.settings.previewContainer);
      this.uploader = new UI.Uploader(this.settings.uploader);
      this.reUploader = new UI.ReUploader({
        size: this.settings.reUploadSize
      });
      this.processChecker = new UI.ProcessChecker();
      this.loading = new UI.LoadingSprite(this.settings.loading);
      this.cameraView = new UI.Scene(this.settings.cameraScene);
      this.previewView = new UI.Scene(this.settings.previewScene);
      this.loadingView = new UI.Scene(this.settings.loadingScene);
      this.sceneManager = new UI.SceneManager([this.cameraView, this.previewView, this.loadingView]);
      this.sceneManager.active(this.sceneManager.current);
      this.$btnStartUpload = $(this.settings.btnStartUpload);
      this.$btnStartCamera = $(this.settings.btnStartCamera);
      this.$btnCancel = $(this.settings.btnCancelCamera);
      this.$btnCapture = $(this.settings.btnCaptureCamera);
      this.$btnRetake = $(this.settings.btnRetakeCapture);
      this.$btnReselect = $(this.settings.btnReselect);
      this.$btnPostWebCamera = $(this.settings.btnPostWebCamera);
      this.$btnPostPhoto = $(this.settings.btnPostPhoto);
      this.$form = $(this.settings.uploadForm);
      this.eventify();
      return this.globalize();
    };

    Main.prototype.eventify = function() {
      if (this.camera.isSupport == null) {
        this.$btnStartCamera.parent().hide();
      }
      this.$btnStartCamera.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.modal.show();
          _this.camera.powerOn();
          return _this.sceneManager.active(0);
        };
      })(this));
      this.camera.on(Events.CAMERA_SUCCESS, (function(_this) {
        return function(e) {
          return console.log(e);
        };
      })(this));
      this.camera.on(Events.CAMERA_ERROR, function(e) {
        return console.log(e);
      });
      this.$btnCancel.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.sceneManager.prev();
          _this.camera.powerOff();
          return _this.modal.hide();
        };
      })(this));
      this.$btnCapture.on('click', (function(_this) {
        return function(e) {
          var video;
          e.preventDefault();
          video = _this.camera.getVideo();
          _this.previewCanvas.draw(video);
          _this.sceneManager.next();
          return _this.previewImage.show();
        };
      })(this));
      this.$btnRetake.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.sceneManager.prev();
          return _this.previewImage.hide();
        };
      })(this));
      this.$btnReselect.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.sceneManager.active(0);
          _this.uploader.reset();
          _this.transformView.$el.addClass('is-hidden');
          return _this.modal.hide();
        };
      })(this));
      this.$btnPostWebCamera.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.loading.start();
          return _this._postCameraImage();
        };
      })(this));
      this.$btnPostPhoto.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.reUploader.submit();
          $('.loading__upload').append($('.transform__wrap'));
          _this.loading.start();
          return _this.sceneManager.next();
        };
      })(this));
      this.modal.on(Events.MODAL_HIDE, (function(_this) {
        return function(e) {
          if (_this.camera.getStatus() === true) {
            _this.camera.powerOff();
          }
          if (_this.transformView != null) {
            _this.transformView.$el.addClass('is-hidden');
          }
          _this.uploader.reset();
          return _this.previewImage.hide();
        };
      })(this));
      this.uploader.on(Events.UPLOAD_LOAD_IMG, (function(_this) {
        return function(e) {
          return _this.$form.submit();
        };
      })(this));
      this.reUploader.on(Events.REUPLOAD_SUCCESS, (function(_this) {
        return function(e) {
          Params.reupload = e.response;
          return _this.processChecker.set(Params.reupload.result_path).start();
        };
      })(this));
      this.reUploader.on(Events.REUPLOAD_ERROR, (function(_this) {
        return function(e) {
          alert('アップロードに失敗しました。');
          return _this.loading.stop();
        };
      })(this));
      return this.processChecker.on(Events.CHECK_COMPLETE, (function(_this) {
        return function(res) {
          _this.loading.stop();
          switch (res.result.face_count) {
            case 0:
              win.location.href = '/error.html#0';
              break;
            case 1:
              win.location.href = res.result_url;
              break;
            case 2:
              win.location.href = '/error.html#2';
              break;
            default:
              break;
          }
        };
      })(this));
    };

    Main.prototype.globalize = function() {
      var self;
      self = this;
      Util.setResponse = function(res, CAMERA_or_PHOTO) {
        Params.upload = res.response;
        self.modal.show();
        switch (CAMERA_or_PHOTO) {
          case 'CAMERA':
            self.processChecker.set(Params.upload.result_path).start();
            break;
          case 'PHOTO':
            if (self.transformView == null) {
              self.transformView = new UI.Transform('#Transform');
            } else {
              self.transformView.setImage();
              self.transformView.reset();
            }
            self.transformView.$el.removeClass('is-hidden');
            self.previewView.emit(Events.PREVIEW_PHOTO);
            self.sceneManager.active(1);
            break;
          default:
            break;
        }
      };
      return Util.getJSON = function(json) {
        return Util.setResponse(json, 'PHOTO');
      };
    };

    Main.prototype._postCameraImage = function() {
      var blob, canvas, formData, ratio, video, x, xhr, y;
      canvas = this.previewCanvas.getCanvas();
      blob = this.previewCanvas.getBlob('image/png');
      formData = new FormData(this.$form[0]);
      xhr = new XMLHttpRequest();
      this.camera.powerOff();
      ratio = 2.2 + (UI.TRIM_RATIO - 1);
      video = this.camera.getVideo();
      x = ($(video).width() / 2 * ratio) - (UI.TRIM_WIDTH / 2);
      y = ($(video).height() / 2 * ratio) - (UI.TRIM_HEIGHT / 2);
      formData.append('is_camera', true);
      formData.append('image', blob);
      formData.append('zoom', ratio);
      formData.append('x', x);
      formData.append('y', y);
      formData.append('width', UI.TRIM_WIDTH);
      formData.append('height', UI.TRIM_HEIGHT);
      xhr.onload = function(e) {
        var json;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            json = Util.parseJSON(xhr.responseText);
            return Util.setResponse(json, 'CAMERA');
          } else {

          }
        }
      };
      xhr.onerror = function(e) {
        return console.log('XHR ERROR: ', e);
      };
      if (/\?debug/.test(location.search)) {
        xhr.open('GET', 'stub/result.json');
        return xhr.send();
      } else {
        xhr.open('POST', this.$form.attr('action'));
        return xhr.send(formData);
      }
    };

    return Main;

  })();
  return Staircase.Main = Main;
})(window, window.document, window.Staircase);
