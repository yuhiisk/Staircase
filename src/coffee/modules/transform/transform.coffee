do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    UI = Staircase.UI
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
    # Transform
    # @constructor
    # @extends EventEmitter2
    ###
    class Transform extends EventEmitter2

        constructor: (id) ->

            super(id)
            @$el = $(id)
            @isLoaded = false

            @initialize()
            @eventify()

        initialize: () ->

            self = @

            @translate = null
            @scale = null

            @$dragArea = $('.transform__touch')

            @$btnUp = $('#AdjustUp')
            @$btnDown = $('#AdjustDown')
            @$btnLeft = $('#AdjustLeft')
            @$btnRight = $('#AdjustRight')
            @$btnZoomIn = $('#ZoomIn')
            @$btnZoomOut = $('#ZoomOut')

            $imageFrame = $('.transform__image')
            $image = $imageFrame.find('img')
            $image.css(
                width: 'auto',
                height: 'auto'
            )
            # フレームサイズ, 幅, 高さ
            imageFrameWidth = $imageFrame.width()
            imageFrameHeight = $imageFrame.height()

            ratio = 10

            # 画像リサイズ
            resizeImage = ($img) ->
                width = $img.width()
                height = $img.height()
                aspectRatio = width / height

                Params.resized_image_width = imageFrameWidth
                Params.resized_image_height = Params.resized_image_width / aspectRatio

                if Params.resized_image_height < imageFrameHeight
                    Params.resized_image_height = imageFrameHeight
                    Params.resized_image_width = Params.resized_image_height * aspectRatio

                $img.css(
                    width: Params.resized_image_width,
                    height: Params.resized_image_height
                )

                resizeImageBox($img)


            resizeImageBox = ($img) ->
                $imageFrame.css(
                    width: $img.width(),
                    height: $img.height()
                )

            # 画像の親要素のリサイズ
            resizeParent = ($img) ->
                $imageFrame.css(
                    width: $img.width(),
                    height: $img.height()
                )

            centering = ($box, $frame, x, y) ->
                top = ($box.height() - $frame.height()) / 2
                left = ($box.width() - $frame.width()) / 2

                $box.css(
                    top: -top + y,
                    left: -left + x
                )


            loaded = () =>
                if !@translate?
                    @translate = new UI.Translate()
                else
                    @translate.initialize()

                if !@scale?
                    @scale = new UI.Scale()
                else
                    @scale.initialize()

                resizeImage($image)
                centering($imageFrame, $imageFrame, 0, 0)

            $image.on('load', () =>
                loaded()
                @isLoaded = true
                @emit(Events.TRANSFORM_LOAD_IMG)
            )

            # アップロード画像をフレームにセット
            setImgToFrame = () =>
                $image.attr(
                    src: Util.getImagePath()
                )

            # 画像をフレームに読み込み
            setImgToFrame()

            reset = () =>
                if @translate?
                    @translate.reset()
                    @translate.initialize()
                if @scale?
                    @scale.reset()
                    @scale.initialize()

            @setImage = setImgToFrame
            @reset = reset


        eventify: () ->

            if @isLoaded is true
                @eventifyExt()
            else
                @on(Events.TRANSFORM_LOAD_IMG, () =>
                    @eventifyExt()
                )

            ##
            # Drag
            ##
            @$dragArea.on(Events.START, (e) =>
                if !e.pageX
                    e = event.touches[0]
                @translate.start(e)
            )

            $(doc).on(Events.MOVE, (e) =>
                if @translate? and @translate.flag is true
                    if !e.pageX
                        e = event.touches[0]
                    @translate.move(e)
            )

            $(doc).on(Events.END, (e) =>
                @translate.end(e)
            )

            if Util.ua.isMobile

                # =============================
                # sp:ピンチイン・アウト
                startDistance = 0
                moveDistance = 0
                currentScale = 1
                saveScale = 10

                @$dragArea.on('touchstart', (e) =>
                    e.preventDefault()
                    if e.originalEvent.touches.length is 2
                        startDistance = @scale.getDistance(e)
                )

                @$dragArea.on('touchmove', (e) =>
                    if e.originalEvent.touches.length is 2
                        moveDistance = @scale.getDistance(e)
                        ratio *= moveDistance / startDistance
                        @scale.scale(e, ratio / 10 - 1)
                )

        eventifyExt: ->
            ##
            # Scale
            ##
            @$btnZoomIn.on(Events.CLICK, (e) =>
                @scale.scale(e, 0.2)
            )
            @$btnZoomOut.on(Events.CLICK, (e) =>
                @scale.scale(e, -0.2)
            )

            ##
            # Move
            @$btnUp.on(Events.CLICK, () =>
                @translate.set(0, -10)
            )
            @$btnDown.on(Events.CLICK, () =>
                @translate.set(0, 10)
            )
            @$btnLeft.on(Events.CLICK, () =>
                @translate.set(-10, 0)
            )
            @$btnRight.on(Events.CLICK, () =>
                @translate.set(10, 0)
            )

    UI.Transform = Transform

