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
    this.camera = new UI.Camera(this.settings.camera);
    this.previewCanvas = new UI.PreviewCanvas(this.settings.previewCanvas);
    this.previewImage = new UI.PreviewImage(this.settings.previewContainer);
    this.$btnStartUpload = $(this.settings.btnStartUpload);
    this.$btnStartCamera = $(this.settings.btnStartCamera);
    this.$btnCancel = $(this.settings.btnCancelCamera);
    this.$btnCapture = $(this.settings.btnCaptureCamera);
    this.$btnRetake = $(this.settings.btnRetakeCapture);
    this.$btnPostWebCamera = $(this.settings.btnPostWebCamera);
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
        return _this.camera.powerOn();
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
        return _this.camera.powerOff();
      };
    })(this));
    this.$btnCapture.on('click', (function(_this) {
      return function(e) {
        var video;
        e.preventDefault();
        video = _this.camera.getVideo();
        _this.previewCanvas.draw(video);
        _this.previewImage.show();
        $('#Camera').hide();
        return $('#Preview').show();
      };
    })(this));
    this.$btnRetake.on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        _this.previewImage.hide();
        $('#Camera').show();
        return $('#Preview').hide();
      };
    })(this));
    return this.$btnPostWebCamera.on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        _this.camera.powerOff();
        return _this._postCameraImage();
      };
    })(this));
  };
  Staircase.prototype.globalize = function() {
    var self;
    self = this;
    Util.setResponse = function(res, type) {
      Params.upload = res.response;
      switch (type) {
        case 'CAMERA':
          alert('Post Complete.');
          break;
        case 'PHOTO':
          alert('Form?');
          break;
        default:
          break;
      }
    };
    return Util['getJSON'] = function(json) {
      return Util.setResponse(json, 'PHOTO');
    };
  };
  Staircase.prototype._postCameraImage = function() {
    var blob, canvas, formData, ratio, video, x, xhr, y;
    canvas = this.previewCanvas.getCanvas();
    blob = this.previewCanvas.getBlob('image/png');
    formData = new FormData(this.$form[0]);
    xhr = new XMLHttpRequest();
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
