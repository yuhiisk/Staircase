(function(win, doc) {
  'use strict';
  var Debug, Events, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Params.upload = {
    'image_path': '/stub/kayac.png',
    'image_uuid': '*********'
  };
  Params.reupload = {};
  Util.getImagePath = function() {
    return Params.upload.image_path;
  };
  Util.getImageId = function() {
    return Params.upload.image_uuid;
  };
  Staircase.prototype.initialize = function() {
    this.uploader = new UI.Uploader(this.settings.uploader);
    this.transform = new UI.Transform('#Transform');
    this.$btnPostPhoto = $(this.settings.btnPostPhoto);
    this.eventify();
    return this.globalize();
  };
  Staircase.prototype.eventify = function() {
    return this.$btnPostPhoto.on('click', (function(_this) {
      return function(e) {
        return e.preventDefault();
      };
    })(this));
  };
  Staircase.prototype.globalize = function() {};
  Staircase.prototype._postCameraImage = function() {};

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
    uploadForm: '#Upload'
  });
})(window, document);
