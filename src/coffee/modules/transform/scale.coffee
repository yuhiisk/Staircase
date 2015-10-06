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
    # Scale
    # @constructor
    # @extends EventEmitter2
    ###
    class Scale extends EventEmitter2

        constructor: (option) ->

            super(option)
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
                imageLeft -= Params.resized_image_width * zoomScale / 2
                imageTop -= Params.resized_image_height * zoomScale / 2

            resized = @resize(
                top: imageTop,
                left: imageLeft,
                ratio: @ratio
            )

            @emit(Events.TRANSFORM_SCALE, resized)

        resize: (e) ->
            width = Params.resized_image_width * e.ratio / 10
            height = Params.resized_image_height * e.ratio / 10
            top = 0
            left = 0
            resizeImg = ($img) =>
                $img.css(
                    width: width,
                    height: height
                )

            resizeBox = ($box, x, y) ->
                top = e.top + y
                left = e.left + x
                $box.css(
                    left: left,
                    top: top
                )

            # 画像をリサイズ
            resizeImg(@$image)
            # ボックスの位置
            resizeBox(@$imageFrame, 0, 0)

            return {
                width: width,
                height: height,
                top: top,
                left: left,
                ratio: e.ratio
            }


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


    Staircase.Scale = Scale

