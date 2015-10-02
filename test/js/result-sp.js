var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Debug, Events, Main, Result, UI;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  UI = Staircase.UI;

  /*
   * Result
   */
  Result = (function(superClass) {
    extend(Result, superClass);

    function Result(id) {
      Result.__super__.constructor.call(this, id);
      this.el = doc.getElementById(id);
      this.img = new Image();
      this.initialize();
    }

    Result.prototype.initialize = function() {
      var _render;
      _render = function() {
        return this.el.appendChild(this.img);
      };
      return this.render = _render;
    };

    return Result;

  })(EventEmitter2);
  UI.Result = Result;
  Main = (function() {
    function Main() {
      this.initialize();
      this.eventify();
    }

    Main.prototype.initialize = function() {
      var _drawDoughnut, _drawRader, _load, _startShowElements, _startShowVisual;
      if (/^#share$/.test(win.location.hash)) {
        $(doc.body).addClass('mode-share');
      }
      _drawRader = function() {
        var canvas, chart, context, data, radarChartData, rader;
        if (Debug === true) {
          data = [89, 70, 33, 10, 50];
        } else {
          data = GRAPH_DATA;
        }
        radarChartData = {
          labels: ['', '', '', '', ''],
          datasets: [
            {
              fillColor: 'rgba(153,153,153,0.5)',
              strokeColor: 'rgba(0,162,154,0)',
              pointColor: '#fff',
              pointStrokeColor: '#03a39b',
              data: data
            }
          ]
        };
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        chart = new Chart(context);
        return rader = chart.Radar(radarChartData, {
          animationEasing: "easeOutExpo",
          angleLineColor: '#bbe6e4',
          angleLineWidth: 0,
          scaleLineWidth: 0,
          scaleLineColor: '#bbe6e4',
          scaleShowLabel: false,
          scaleShowGridLines: false,
          showTooltips: false,
          pointDotRadius: 2,
          pointDotStrokeWidth: 2
        });
      };
      _drawDoughnut = function() {
        var canvas, chart, context, data, doughnutChartData, options, rader;
        if (Debug === true) {
          data = [50, 50];
        } else {
          data = DOUGHNUT_CHART_DATA;
        }
        doughnutChartData = [
          {
            value: data[0],
            color: "#00a29a"
          }, {
            value: data[1],
            color: "rgba(255,255,255,0)"
          }
        ];
        options = {
          segmentShowStroke: false,
          segmentStrokeColor: "transparent",
          segmentStrokeWidth: 1,
          percentageInnerCutout: 90,
          animationSteps: 70,
          animationEasing: "easeOutExpo",
          animateRotate: true,
          animateScale: false,
          showTooltips: false
        };
        canvas = document.getElementById('ScoreChart');
        context = canvas.getContext('2d');
        chart = new Chart(context);
        return rader = chart.Doughnut(doughnutChartData, options);
      };
      _startShowVisual = function() {
        $('.diagnosis__image-effect').addClass('is-start');
        return $('.diagnosis__image-processed').addClass('is-start');
      };
      _startShowElements = function() {
        var base;
        base = 2000;
        $('.diagnosis__comment-heading').delay(base).animate({
          opacity: 1
        });
        $('.diagnosis__comment-title').delay(base + 500).animate({
          opacity: 1
        });
        $('.diagnosis__comment-text').delay(base + 1000).animate({
          opacity: 1
        });
        $('.diagnosis__comment-text').delay(base + 1000).animate({
          opacity: 1
        });
        $('.diagnosis__score-text').delay(base + 1500).animate({
          opacity: 1
        });
        $('.diagnosis__score-graph').delay(base + 2000).animate({
          opacity: 1
        }, function() {
          self.countUp.start();
          return _drawDoughnut();
        });
        return $('.diagnosis__graph').delay(base + 3000).animate({
          opacity: 1
        }, function() {
          return _drawRader();
        });
      };
      _load = function() {
        var image;
        image = new Image();
        image.onload = _startShowVisual;
        return image.src = $('.diagnosis__image-processed img').attr('src');
      };
      this.drawRader = _drawRader;
      this.drawDoughnut = _drawDoughnut;
      this.start = _startShowVisual;
      return this.start();
    };

    Main.prototype.eventify = function() {
      var $target, $win, _onScroll;
      $('.btn__item--download').on('click', function(e) {
        var url;
        url = $(this).data('redirect');
        return setTimeout(function() {
          return win.location.href = url;
        }, 1500);
      });
      $win = $(win);
      $target = $('.diagnosis__data');
      _onScroll = (function(_this) {
        return function(e) {
          if ($win.scrollTop() + $win.height() > $target.offset().top + $target.height()) {
            _this.drawDoughnut();
            setTimeout(_this.drawRader, 250);
            return $win.off('scroll', _onScroll);
          }
        };
      })(this);
      return $win.on('scroll', _onScroll);
    };

    return Main;

  })();
  return new Main();
})(window, window.document);
