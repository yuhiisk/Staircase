do (win = window, doc = window.document) ->

    'use strict'

    Events = win.Staircase.ns('Events')
    UI = win.Staircase.ns('UI')

    ###
    # PreviewCanvas
    # @constructor
    # @extends EventEmitter2
    # @params {string} DOM id
    ###
    class PreviewCanvas extends EventEmitter2

        constructor: (id) ->

            super(id)

            @initialize(id)

        initialize: (id) ->

            self = @
            canvas = doc.getElementById(id)
            _ctx = `canvas.getContext ? canvas.getContext("2d") : null;`

            _reset = () ->
                canvas.width = 0
                canvas.height = 0
            _reset()

            _toBinary = () ->
                base64 = canvas.toDataURL("image/png")
                bin = atob(base64.replace(/^.*,/, ""))
                buffer = new Uint8Array(bin.length)

                for i in [0...bin.length]
                    buffer[i] = bin.charCodeAt(i)

                buffer

            wrap = () ->
                self.emit(Events.PREVIEW_SEND)

            draw = (src) ->
                canvas.width  = src.videoWidth
                canvas.height = src.videoHeight
                _ctx.drawImage(src, 0, 0)

            getCanvas = () ->
                return canvas

            getBlob = () ->
                buf  = _toBinary()
                blob = new Blob([buf.buffer],
                    type: 'image/png'
                )

                wrap()
                blob

            @wrap    = wrap
            @draw    = draw
            @getCanvas = getCanvas
            @getBlob = getBlob
            @reset   = _reset

    UI.PreviewCanvas = PreviewCanvas


    ###
    # PreviewImage
    # @constructor
    # @extends EventEmitter2
    # @params id {String} DOM id
    # @params res {Object} Response data
    ###
    class PreviewImage extends EventEmitter2

        constructor: (id) ->

            super(id)

            @el = doc.getElementById(id)
            @img = new Image()

            @initialize()

        initialize: () ->

            _render = (path) ->
                @img.src = "http://#{path}"
                @el.appendChild(@img)

            _show = () ->
                @el.style.display = 'block'

            _hide = () ->
                @el.style.display = 'none'

            _reset = () ->
                @hide()
                @el.removeChild(@img)

            @render = _render
            @show = _show
            @hide = _hide
            @reset = _reset

    UI.PreviewImage = PreviewImage


