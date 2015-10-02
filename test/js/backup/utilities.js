(function(win, doc) {
  'use strict';
  var Util, getQueryString, parseJSON, ua;
  Util = win.Staircase.ns('Util');
  ua = navigator.userAgent.toLowerCase();
  Util.ua = {};
  Util.ua.isIOS = /(iphone|ipod|ipad)/.test(ua);
  Util.ua.isAndroid = /(android)/.test(ua);
  Util.ua.isMobile = Util.ua.isIOS || Util.ua.isAndroid;
  getQueryString = function() {
    var element, i, j, paramName, paramValue, parameters, query, ref, result;
    result = {};
    if (1 < win.location.search.length) {
      query = win.location.search.substring(1);
      parameters = query.split('&');
      for (i = j = 0, ref = parameters.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        element = parameters[i].split('=');
        paramName = decodeURIComponent(element[0]);
        paramValue = decodeURIComponent(element[1]);
        result[paramName] = paramValue;
      }
    }
    return result;
  };
  Util.getQueryString = getQueryString;
  parseJSON = function(data) {
    if (win.JSON && win.JSON.parse) {
      return win.JSON.parse(data + '');
    }
  };
  return Util.parseJSON = parseJSON;
})(window, window.document);
