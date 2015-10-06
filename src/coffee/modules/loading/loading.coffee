do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events

    ###
    # Loading
    # @constructor
    # @extends EventEmitter2
    ###
    class Loading extends EventEmitter2

        constructor: (id) ->

            super(id)

            @$el = $(id)
            @$icon = @$el.find('.loading__icon')

            @initialize()
            @eventify()

        initialize: () ->

            _start = () =>
                @$icon.addClass('is-active')
                # @$el.show()
                @emit(Events.LOADING_SHOW)

            _stop = () =>
                @$icon.removeClass('is-active')
                # @$el.hide()
                @emit(Events.LOADING_HIDE)

            @start = _start
            @stop = _stop

        eventify: () ->


    Staircase.Loading = Loading


    ###
    # LoadingSprite
    # @constructor
    # @extends EventEmitter2
    ###
    class LoadingSprite extends EventEmitter2

        constructor: (el) ->

            super(el)

            @$el = $(el)
            @$icon = $('.loading__icon', @$el)
            @defaultClass = @$icon.attr('class')

            @initialize()
            @eventify()

        initialize: () ->

            timer = null
            interval = 40
            count = 0
            max = 36

            _rotate = () =>
                timer = setInterval(() =>
                    count++
                    @$icon[0].className = @defaultClass + ' loading-n' + count
                    if count >= max then count = 0
                , interval)

            _start = () =>
                @$el.show()
                _rotate()
                @emit(Events.LOADING_START)

            _stop = () =>
                @$el.hide()
                timer = clearInterval(timer)
                timer = null
                @emit(Events.LOADING_STOP)

            @start = _start
            @stop = _stop

        eventify: () ->


    Staircase.LoadingSprite = LoadingSprite


    ###
    # Exchange
    # @constructor
    # @extends EventEmitter2
    ###
    class Exchange extends EventEmitter2

        constructor: (id) ->

            super(id)

            @$el = $(id)
            @$icon = @$el.find('.loading__icon')

            @initialize()

        initialize: () ->

            _show = () =>
                @$el.removeClass('is-hidden')
                @

            _hide = () =>
                @$el.addClass('is-hidden')
                @

            _active = () =>
                @$icon.addClass('is-active')
                @

            _deactive = () =>
                @$icon.removeClass('is-active')
                @

            @show = _show
            @hide = _hide
            @active = _active
            @deactive = _deactive


    Staircase.Exchange = Exchange

