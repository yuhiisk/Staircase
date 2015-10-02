(function(win, doc) {
  'use strict';

  /*
   * Namespace
   */
  var Staircase, ref;
  Staircase = (ref = win.Staircase) != null ? ref : {};
  win.Staircase = Staircase;
  Staircase.namespace = function(ns_string) {
    var i, j, parent, parts, ref1;
    parts = ns_string.split('.');
    parent = Staircase;
    if (parts[0] === 'Staircase') {
      parts = parts.slice(1);
    }
    for (i = j = 0, ref1 = parts.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };
  Staircase.ns = Staircase.namespace;

  /*
   * API
   */
  Staircase.ns('API');
  Staircase.API = {
    URL: 'http://example.com/'
  };

  /*
   * Debug
   */
  Staircase.ns('Debug');
  Staircase.Debug = (function() {
    return /\?debug/.test(location.search);
  })();

  /*
   * Utilities
   */
  Staircase.ns('Util');

  /*
   * Parameters
   */
  Staircase.ns('Params');

  /*
   * UI components
   */
  Staircase.ns('UI');
  Staircase.UI.TRIM_OFFSET_TOP = 176;
  Staircase.UI.TRIM_OFFSET_LEFT = 0;
  Staircase.UI.TRIM_WIDTH = 886;
  Staircase.UI.TRIM_HEIGHT = 236;
  Staircase.UI.TRIM_RATIO = (function() {
    return Staircase.UI.TRIM_WIDTH / 640;
  })();

  /*
   * Events
   */
  Staircase.ns('Events');
  Staircase.Events = {
    CAMERA_SUCCESS: 'camera_success',
    CAMERA_ERROR: 'camera_error',
    UPLOAD_LOAD_IMG: 'upload_img_load',
    UPLOAD_READER: 'upload_reader',
    PREVIEW_SEND: 'preview_send',
    PREVIEW_CAMERA: 'preview_camera',
    PREVIEW_PHOTO: 'preview_photo',
    REUPLOAD_SUBMIT: 'reupload_submit',
    REUPLOAD_SUCCESS: 'reupload_success',
    REUPLOAD_ERROR: 'reupload_error',
    CHECK_PROCESS: 'check_process',
    CHECK_COMPLETE: 'check_complete',
    CHECK_ERROR: 'check_error',
    MODAL_SHOW: 'modal_show',
    MODAL_HIDE: 'modal_hide'
  };

  /*
   * Error
   */
  Staircase.ns('Error');
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
