(function(win, doc, Staircase) {
  'use strict';
  var Debug, Events, Params, UI, Util;
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
  Staircase.prototype.initialize = function() {
    this.previewImage = new UI.PreviewImage(this.settings.previewContainer);
    this.uploader = new UI.Uploader(this.settings.uploader);
    this.reUploader = new UI.ReUploader({
      size: this.settings.reUploadSize
    });
    this.processChecker = new UI.ProcessChecker();
    this.loading = new UI.LoadingSprite(this.settings.loading);
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
    this.$btnReselect.on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        _this.uploader.reset();
        _this.transformView.$el.addClass('is-hidden');
        return _this.modal.hide();
      };
    })(this));
    this.$btnPostPhoto.on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        _this.reUploader.submit();
        $('.loading__upload').append($('.transform__wrap'));
        return _this.loading.start();
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
    Util.setResponse = function(res, CAMERA_or_PHOTO) {
      Params.upload = res.response;
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
          break;
        default:
          break;
      }
    };
    return Util.getJSON = function(json) {
      return Util.setResponse(json, 'PHOTO');
    };
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
    previewContainer: '#PreviewContainer',
    uploader: '#StartUpload',
    reUploadSize: 640,
    btnReselect: '#Reselect',
    btnPostPhoto: '#PostPhoto',
    uploadForm: '#Upload'
  });
})(window, window.document, window.Staircase);
