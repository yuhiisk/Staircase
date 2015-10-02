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
  return Staircase.ns = Staircase.namespace;
})(window, window.document);
