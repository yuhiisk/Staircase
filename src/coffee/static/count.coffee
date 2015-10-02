do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    UI = Staircase.UI

    ###
    # Count
    # @constructor
    # @extends EventEmitter2
    ###
    class Count extends EventEmitter2

        constructor: (id) ->

            super(id)

            @$el = $(id)
            @numbers = []
            @count = 0
            @max = parseInt(@$el.data('count'), 10)
            @digit = @max.toString().length
            @time = 5000
            @timer = null

            @initialize()
            @eventify()

        initialize: () ->
            $.each(@max.toString().split(''), (i) =>
                el = $('.diagnosis__score-number', @$el).eq(i)
                @numbers.unshift(el)
            )
            @render()

        eventify: () ->
            @$el.on(
                start: () => @start(),
                stop: () => @stop(),
                reset: () => @reset()
            )

        start: () ->
            self = @
            interval = 10

            @timer = setInterval(() ->
                self.time -= interval
                self.count++
                self.render()
                if self.max <= self.count
                    self.stop()

            , interval)

        stop: () ->
            clearInterval(@timer)
            @timer = null

        render: () ->
            padding = ''
            for i in [0...@digit]
                padding += '0'
            count = (padding + @count).slice(-3)

            $.each(@numbers, (i, $number) =>
                className = 'diagnosis__score-number icon-n'

                # TODO: 3桁だとおかしい
                if @digit isnt 1 and @digit - 1 is i
                    className += count.slice(i, i + 1)
                else
                    className += count.slice(-1)

                $number[0].className = className
            )

        getTime: () ->
            return @time

        reset: () ->
            @count = 0
            @time = 5000
            @timer = null

            $.each(@numbers, (i, $number) ->
                $number[0].className =  'diagnosis__score-number icon-n0'
            )

    UI.Count = Count


