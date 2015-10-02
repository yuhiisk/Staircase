do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    UI = Staircase.UI
    Util = Staircase.Util

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

    RESIZED_IMAGE_WIDTH = 0
    RESIZED_IMAGE_HEIGHT = 0

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

    ###
    # Scale
    # @constructor
    # @extends EventEmitter2
    ###
    class Scale extends EventEmitter2

        constructor: (id) ->

            super(id)
            @$imageFrame = $('.transform__image')
            @$image = $('img', @$imageFrame)
            @ratio = 10

            @initialize()

        initialize: () ->
            # 画像の初期サイズを保存
            @$image.data('baseWidth', @$image.width())
            @$image.data('baseHeight', @$image.height())

        scale: (e, zoomScale) ->
            e.preventDefault()

            # フレームを起点としたimageまでの距離を監視する
            imageLeft = parseInt(@$imageFrame.css('left'), 10)
            imageTop = parseInt(@$imageFrame.css('top'), 10)

            # 画像の位置
            imageX = @$image.offset().left
            imageY = @$image.offset().top

            # 画像の中心の座標
            unitScale = 10
            imageXcenter = imageX + @$image.width() / unitScale / 2
            imageYcenter = imageY - @$image.height() / unitScale / 2

            # 画像の比率を取得
            if @ratio >= unitScale * 3 && zoomScale > 0
                @ratio = unitScale * 3
            else if @ratio <= unitScale && zoomScale < 0
                @ratio = unitScale
            else
                @ratio += zoomScale * unitScale
                imageLeft -= RESIZED_IMAGE_WIDTH * zoomScale / 2
                imageTop -= RESIZED_IMAGE_HEIGHT * zoomScale / 2

            @resize(
                top: imageTop,
                left: imageLeft,
                ratio: @ratio
            )

            @emit('scaled')

        resize: (e) ->

            resizeImg = ($img) ->
                $img.css(
                    width: RESIZED_IMAGE_WIDTH * e.ratio / 10,
                    height: RESIZED_IMAGE_HEIGHT * e.ratio / 10
                )

            resizeBox = ($box, x, y) ->
                $box.css(
                    left: e.left + x,
                    top: e.top + y
                )

            # 画像をリサイズ
            resizeImg(@$image)
            # ボックスの位置
            resizeBox(@$imageFrame, 0, 0)


        # // 2本の指の距離を測るメソッド
        # // √((X2 - X1)2 + (Y2 - Y1)2)
        getDistance: (e) ->
            return Math.sqrt(
                Math.pow(Number(e.originalEvent.touches[0].pageX) - Number(e.originalEvent.touches[1].pageX), 2) +
                Math.pow(Number(e.originalEvent.touches[0].pageY) - Number(e.originalEvent.touches[1].pageY), 2)
            )

        getRatio: () ->
            return @ratio

        reset: () ->
            @ratio = 10
            @$image.css(
                width: '',
                height: ''
            )
            @$imageFrame.css(
                left: 0,
                top: 0
            )

            @$image.data('baseWidth', null)
            @$image.data('baseHeight', null)


    ###
    # Transform
    # @constructor
    # @extends EventEmitter2
    ###
    class Transform extends EventEmitter2

        constructor: (id) ->

            super(id)
            @$el = $(id)

            @initialize()
            @eventify()

        initialize: () ->

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

                RESIZED_IMAGE_WIDTH = imageFrameWidth
                RESIZED_IMAGE_HEIGHT = RESIZED_IMAGE_WIDTH / aspectRatio

                if RESIZED_IMAGE_HEIGHT < imageFrameHeight
                    RESIZED_IMAGE_HEIGHT = imageFrameHeight
                    RESIZED_IMAGE_WIDTH = RESIZED_IMAGE_HEIGHT * aspectRatio

                $img.css(
                    width: RESIZED_IMAGE_WIDTH,
                    height: RESIZED_IMAGE_HEIGHT
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
                    @translate = new Translate()
                else
                    @translate.initialize()

                if !@scale?
                    @scale = new Scale()
                else
                    @scale.initialize()

                resizeImage($image)
                centering($imageFrame, $imageFrame, 0, 0)

            $image.on('load', () =>
                loaded()
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
                @translate.end()
            )

            ##
            # Scale
            ##
            # pc
            @$btnZoomIn.on(Events.CLICK, (e) =>
                @scale.scale(e, 0.2)
            )
            @$btnZoomOut.on(Events.CLICK, (e) =>
                @scale.scale(e, -0.2)
            )

            ##
            # Move
            #@
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

    UI.Transform = Transform

