var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, PreviewCanvas, PreviewImage, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * PreviewCanvas
   * @constructor
   * @extends EventDispatcher
   * @params {string} DOM id
   */
  PreviewCanvas = (function(superClass) {
    extend(PreviewCanvas, superClass);

    function PreviewCanvas(id) {
      PreviewCanvas.__super__.constructor.call(this);
      this.initialize(id);
    }

    PreviewCanvas.prototype.initialize = function(id) {
      var _ctx, _reset, _toBinary, canvas, draw, getBlob, getCanvas, self, wrap;
      self = this;
      canvas = doc.getElementById(id);
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
        return self.trigger(Events.PREVIEW_SEND);
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

  })(EventDispatcher);
  UI.PreviewCanvas = PreviewCanvas;

  /*
   * PreviewImage
   * @constructor
   * @extends EventDispatcher
   * @params id {String} DOM id
   * @params res {Object} Response data
   */
  PreviewImage = (function(superClass) {
    extend(PreviewImage, superClass);

    function PreviewImage(id) {
      PreviewImage.__super__.constructor.call(this);
      this.el = doc.getElementById(id);
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

  })(EventDispatcher);
  return UI.PreviewImage = PreviewImage;
})(window, window.document);
