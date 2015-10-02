do (win = window, doc = window.document) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    UI = Staircase.UI
    Util = Staircase.Util

    ###
    # Uploader
    # @constructor
    # @extends EventEmitter2
    ###
    class Uploader extends EventEmitter2

        constructor: (id) ->

            super(id)
            @$el = $(id)
            @initialize()

        initialize: (els) ->
            self = @
            $input  = @$el.find('input[type="file"]')
            $iframe = @$el.find('iframe')

            # change
            _handleFileChange = (e) ->
                reader = new FileReader()
                file   = e.target.files[0]

                reader.onload = _handleReaderLoad
                reader.readAsDataURL(file)

            _handleReaderLoad = (e) ->
                self.emit(Events.UPLOAD_READER)

                img = new Image()

                img.onload = _handleImgLoad
                img.src    = e.target.result

            _handleImgLoad = (e) ->
                self.emit(Events.UPLOAD_LOAD_IMG)

            _onChangeHandler = (e) ->

                # Debug
                if Debug
                    $iframe
                        .attr(
                            src: '/stub/_image.html'
                            width: 500
                            height: 300
                        )
                    return

                # IE対応用submitボタン
                if Util.ua.isMobile or !win.FileReader
                    self.$el.find('form').submit()
                else
                    _handleFileChange(e)

            $input.on('change', _onChangeHandler)

            reset = () ->
                $input.val('')
                $input.off('change')
                $input.parent().html($input.parent().html())
                $input = @$el.find('input[type="file"]')
                $input.on('change', _onChangeHandler)

            @reset = reset

    UI.Uploader = Uploader


