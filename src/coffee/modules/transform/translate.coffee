do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    Util = Staircase.Util
    Params = Staircase.Params

    if Util.ua.isMobile
        Events.CLICK = 'touchend'
        Events.START = 'touchstart'
        Events.MOVE = 'touchmove'
        Events.END = 'touchend'
    else
        Events.CLICK = 'click'
        Events.START = 'mousedown'
        Events.MOVE = 'mousemove'
        Events.END = 'mouseup'

    ###
    # Translate
    # @constructor
    # @extends EventEmitter2
    ###
    class Translate extends EventEmitter2

        constructor: (option) ->

            super(option)
            @$imageFrame = $('.transform__image')
            @$image = $('img', @$imageFrame)
            @location = {}
            @flag = false

            @initialize()

        initialize: () ->
            @imageFrameWidth = @$imageFrame.width()
            @imageFrameHeight = @$imageFrame.height()

            @location =
                top: @$imageFrame.offset().top
                bottom: @$imageFrame.offset().top + @imageFrameHeight
                left: @$imageFrame.offset().left
                right: @$imageFrame.offset().left + @imageFrameWidth

            @$imageFrame.data(
                location: @location
            )

            @framePosition =
                top: 0
                bottom: 0
                left: 0
                right: 0

        adjust: ($box, x, y) ->
            # オーバーした時
            if @location.left < @framePosition.left
                # console.log 'left'
                $box.css(
                    left: 0 + x
                )
            else if @location.right > @framePosition.right
                # console.log 'right'
                $box.css(
                    left: @imageFrameWidth - @$image.width() + x
                )

            if @location.top < @framePosition.top
                # console.log 'top'
                $box.css(
                    top: 0 + y
                )
            else if @location.bottom > @framePosition.bottom
                # console.log 'bottom'
                $box.css(
                    top: @imageFrameHeight - @$image.height() + y
                )

        start: (e) ->
            @flag = true
            @startX = e.pageX
            @startY = e.pageY
            @originalTop = parseInt(@$imageFrame.css('top'), 10)
            @originalLeft = parseInt(@$imageFrame.css('left'), 10)

        move: (e) ->
            # ブラウザのドキュメント表示領域からカーソルまでの位置
            mouseX = e.pageX
            mouseY = e.pageY

            # 画像の位置
            newX = mouseX - @startX
            newY = mouseY - @startY

            @locate(@$imageFrame, 0, 0, newX, newY)

        locate: ($box, x, y, newX, newY) ->
            $box.css(
                left: @originalLeft + newX + x,
                top: @originalTop + newY + y
            )

        end: (e) ->
            @flag = false
            @adjustPhotoLocation()

        adjustPhotoLocation: () ->
            @framePosition =
                top: @$imageFrame.offset().top
                bottom: @$imageFrame.offset().top + @$image.height()
                left: @$imageFrame.offset().left
                right: @$imageFrame.offset().left + @$image.width()

            @adjust(@$imageFrame, 0, 0)

        set: (newX, newY) ->
            @originalTop = parseInt(@$imageFrame.css('top'), 10)
            @originalLeft = parseInt(@$imageFrame.css('left'), 10)

            @locate(@$imageFrame, 0, 0, newX, newY)

            @adjustPhotoLocation()

        reset: () ->
            @location = {}
            @$imageFrame.css(
                left: 0,
                top: 0
            )
            @framePosition =
                top: 0
                bottom: 0
                left: 0
                right: 0

            @$imageFrame.width(@imageFrameWidth)
            @$imageFrame.height(@imageFrameHeight)


    Staircase.Translate = Translate

