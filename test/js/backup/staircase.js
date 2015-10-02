(function(win, doc) {
  'use strict';
  var Events, Main, Params, UI, Util;
  Events = win.Staircase.ns('Events');
  Util = win.Staircase.ns('Util');
  UI = win.Staircase.ns('UI');
  Params = win.Staircase.ns('Params');
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
    function Main() {
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.modal = new UI.Modal({
        id: '#Modal',
        page: '.wrapper'
      });
      this.camera = new UI.Camera('Video');
      this.previewCanvas = new UI.PreviewCanvas('Canvas');
      this.previewImage = new UI.PreviewImage('PreviewContainer');
      this.uploader = new UI.Uploader('#StartUpload');
      this.reUploader = new UI.ReUploader({
        size: 640
      });
      this.processChecker = new UI.ProcessChecker();
      this.loading = new UI.LoadingSprite('#Loading');
      this.cameraView = new UI.Scene('Camera');
      this.previewView = new UI.Scene('Preview');
      this.loadingView = new UI.Scene('Loading');
      this.sceneManager = new UI.SceneManager([this.cameraView, this.previewView, this.loadingView]);
      this.$btnStartUpload = $('#StartUpload');
      this.$btnStartCamera = $('#StartCamera');
      this.$btnCancel = $('#Cancel');
      this.$btnCapture = $('#Capture');
      this.$btnRetake = $('#Retake');
      this.$btnReselect = $('#Reselect');
      this.$btnPostWebCamera = $('#PostWebCamera');
      this.$btnPostPhoto = $('#PostPhoto');
      this.$form = $('#Upload');
      Util.rollover();
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
            self.previewView.trigger(Events.PREVIEW_PHOTO);
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
      blob = this.previewCanvas.getBlob("image/png");
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
        xhr.open('POST', '/api' + this.$form.attr('action'));
        return xhr.send(formData);
      }
    };

    return Main;

  })();
  return new Main();
})(window, window.document);
