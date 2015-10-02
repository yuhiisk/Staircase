(function(win, doc) {
  'use strict';
  if (win.location.hash != null) {
    if (win.location.hash === "#0") {
      return $('.error__text').text('瞳を検出することが出来ませんでした。');
    } else if (win.location.hash === "#2") {
      return $('.error__text').text('複数の瞳が検出されました');
    }
  }
})(window, window.document);
