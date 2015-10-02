do (win = window, doc = window.document) ->

    'use strict'

    Debug = win.Staircase.ns('Debug')
    Events = win.Staircase.ns('Events')
    UI = win.Staircase.ns('UI')

    ###
    # Result
    ###
    class Result extends EventEmitter2

        constructor: (id) ->

            super(id)

            @el = doc.getElementById(id)
            @img = new Image()

            @initialize()

        initialize: () ->

            _render = () ->
                @el.appendChild(@img)

            @render = _render

    UI.Result = Result


    ##
    # Entry Point
    ##
    class Main

        constructor: () ->

            @initialize()
            @eventify()

        initialize: () ->
            # shareからの導線
            if /^#share$/.test(win.location.hash)
                $(doc.body).addClass('mode-share')

            _drawRader = () ->
                if Debug is true
                    data = [89, 70, 33, 10, 50]
                else
                    data = GRAPH_DATA
                # レーダーチャートで表示するデータを用意
                radarChartData =
                    labels: ['','','','',''],
                    datasets: [
                        {
                            fillColor: 'rgba(153,153,153,0.5)', # 線で囲まれた部分の色
                            strokeColor: 'rgba(0,162,154,0)', # 線の色
                            pointColor: '#fff',
                            pointStrokeColor: '#03a39b',      # 点を囲む線の色
                            data: data
                        }
                    ]

                # Canvas にレーダーチャートを描画
                canvas = document.getElementById('canvas')
                context = canvas.getContext('2d')
                chart = new Chart(context)
                rader = chart.Radar(radarChartData,
                    animationEasing: "easeOutExpo",
                    angleLineColor: '#bbe6e4',
                    angleLineWidth : 0, # 位置合わせ用 => 2
                    scaleLineWidth: 0, # 位置合わせ用 => 2
                    scaleLineColor: '#bbe6e4',
                    scaleShowLabel: false,
                    scaleShowGridLines: false,
                    showTooltips: false,
                    pointDotRadius: 2,
                    pointDotStrokeWidth: 2
                )


            _drawDoughnut = () ->
                if Debug is true
                    data = [50, 50]
                else
                    data = DOUGHNUT_CHART_DATA

                doughnutChartData = [
                    {
                        value: data[0],
                        color: "#00a29a"
                    },
                    {
                        value: data[1],
                        color: "rgba(255,255,255,0)"
                    }
                ]

                options =
                    # Boolean - Whether we should show a stroke on each segment
                    segmentShowStroke : false,

                    # String - The colour of each segment stroke
                    segmentStrokeColor : "transparent",

                    # Number - The width of each segment stroke
                    segmentStrokeWidth : 1,

                    # Number - The percentage of the chart that we cut out of the middle
                    percentageInnerCutout : 90, # This is 0 for Pie charts

                    # Number - Amount of animation steps
                    animationSteps : 70,

                    # String - Animation easing effect
                    animationEasing : "easeOutExpo",

                    # Boolean - Whether we animate the rotation of the Doughnut
                    animateRotate : true,

                    # Boolean - Whether we animate scaling the Doughnut from the centre
                    animateScale : false,

                    showTooltips: false

                # Canvas にレーダーチャートを描画
                canvas = document.getElementById('ScoreChart')
                context = canvas.getContext('2d')
                chart = new Chart(context)
                rader = chart.Doughnut(doughnutChartData, options)


            _startShowVisual = () ->
                $('.diagnosis__image-effect').addClass('is-start')
                $('.diagnosis__image-processed').addClass('is-start')

            _startShowElements = () ->
                base = 2000

                $('.diagnosis__comment-heading').delay(base).animate(
                    opacity: 1
                )

                $('.diagnosis__comment-title').delay(base + 500).animate(
                    opacity: 1
                )

                $('.diagnosis__comment-text').delay(base + 1000).animate(
                    opacity: 1
                )

                $('.diagnosis__comment-text').delay(base + 1000).animate(
                    opacity: 1
                )

                $('.diagnosis__score-text').delay(base + 1500).animate(
                    opacity: 1
                )

                $('.diagnosis__score-graph').delay(base + 2000).animate(
                    opacity: 1
                , () ->
                    self.countUp.start()
                    _drawDoughnut()
                )

                $('.diagnosis__graph').delay(base + 3000).animate(
                    opacity: 1
                , () ->
                    _drawRader()
                )

            _load = () ->
                image = new Image()
                image.onload = _startShowVisual
                image.src = $('.diagnosis__image-processed img').attr('src')


            @drawRader = _drawRader
            @drawDoughnut = _drawDoughnut
            @start = _startShowVisual
            @start()

        eventify: () ->

            $('.btn__item--download').on('click', (e) ->
                url = $(@).data('redirect')
                setTimeout(() ->
                    win.location.href = url
                , 1500)
            )


            $win = $(win)
            $target = $('.diagnosis__data')

            _onScroll = (e) =>
                if $win.scrollTop() + $win.height() > $target.offset().top + $target.height()

                    @drawDoughnut()
                    setTimeout( @drawRader , 250)
                    $win.off('scroll', _onScroll)

            $win.on('scroll', _onScroll)

    new Main()

