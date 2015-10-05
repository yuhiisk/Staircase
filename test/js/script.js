(function(win, doc) {
  'use strict';
  var Debug, Events, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Params.upload = {};
  Params.reupload = {};
  Staircase.prototype.initialize = function() {
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
  Staircase.prototype.eventify = function() {
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
  Staircase.prototype.globalize = function() {
    var self;
    self = this;
    Util.setResponse = function(res, type) {
      Params.upload = res.response;
      self.modal.show();
      switch (type) {
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
  Staircase.prototype._postCameraImage = function() {
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

  /*
   * Entry Point
   */
  return new Staircase({
    size: 640,
    trim_offset_top: 176,
    trim_offset_left: 0,
    trim_width: 886,
    trim_height: 236,
    params: {},
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
    uploadForm: '#Upload'
  });
})(window, document);
