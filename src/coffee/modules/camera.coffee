do (win = window, doc = window.document) ->

    'use strict'

    Events = win.Staircase.ns('Events')
    UI = win.Staircase.ns('UI')

    ###
    # Camera
    # @constructor
    # @extends EventEmitter2
    # @params {String} DOM id
    ###
    class Camera extends EventEmitter2

        constructor: (id) ->

            super(id)

            @initialize(id)

        initialize: (id) ->

            video = doc.getElementById(id)
            navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia || navigator.msGetUserMedia)
            status = false

            _handleSuccess = (localMediaStream) =>
                status = true
                video.src = window.URL.createObjectURL(localMediaStream)
                video.play()

                @powerOff = ->
                    localMediaStream.stop()
                    status = false

                @emit(Events.CAMERA_SUCCESS, null, localMediaStream)

            _handleError = (e) =>
                status = false
                @emit(Events.CAMERA_ERROR, null, e)

            _powerOn = () =>
                navigator.getUserMedia({ video: true, audio: false }, _handleSuccess, _handleError)

            _isSupport = do () ->
                return navigator.getUserMedia

            _getStatus = () ->
                return status

            _getVideo = () ->
                return video

            # export
            @powerOn = _powerOn
            @powerOff = () ->
            @isSupport = _isSupport
            @getStatus = _getStatus
            @getVideo = _getVideo

    UI.Camera = Camera


