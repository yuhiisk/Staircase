do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events

    ###
    # Modal
    # @constructor
    # @extends EventEmitter2
    ###
    class Modal extends EventEmitter2

        constructor: (option) ->

            super(option)

            @$el = $(option.id)
            @$page = $(option.page)
            @$win = $(win)
            @winHeight = @$win.height()
            @currentScroll = 0

            @initialize()
            @eventify()

        initialize: () ->

            _show = () =>
                @_fixed()
                @$el.show()
                @emit(Events.MODAL_SHOW)

            _hide = () =>
                @_static()
                @$el.hide()
                @emit(Events.MODAL_HIDE)

            @show = _show
            @hide = _hide

        eventify: () ->
            @$el.on('click', '.modal__bg, .modal__close', (e) =>
                @hide()
            )


        _fixed: () ->
            scrollTop = @$win.scrollTop() * -1
            @currentScroll = @$win.scrollTop()
            @$page.addClass('is-fixed').css('top', scrollTop)

            @$el.css(
                position: 'relative'
                height: @winHeight
            )
            @$win.scrollTop(0)

        _static: () ->
            scrollTop = @$win.scrollTop() * -1
            @$page.removeClass('is-fixed').css('top', '')

            @$el.css(
                position: '',
                height: 'auto'
            )
            @$win.scrollTop(@currentScroll)

    Staircase.Modal = Modal


