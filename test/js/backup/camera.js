var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Camera, Events, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * Camera
   * @constructor
   * @extends EventDispatcher
   * @params {String} DOM id
   */
  Camera = (function(superClass) {
    extend(Camera, superClass);

    function Camera(id) {
      Camera.__super__.constructor.call(this);
      this.initialize(id);
    }

    Camera.prototype.initialize = function(id) {
      var _getStatus, _getVideo, _handleError, _handleSuccess, _isSupport, _powerOn, status, video;
      video = doc.getElementById(id);
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
          return _this.trigger(Events.CAMERA_SUCCESS, null, localMediaStream);
        };
      })(this);
      _handleError = (function(_this) {
        return function(e) {
          status = false;
          return _this.trigger(Events.CAMERA_ERROR, null, e);
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

  })(EventDispatcher);
  return UI.Camera = Camera;
})(window, window.document);
