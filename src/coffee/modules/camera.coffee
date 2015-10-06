do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events

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

            video = $(id)[0]
            navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia || navigator.msGetUserMedia)
            status = false

            _handleSuccess = (localMediaStream) =>
                status = true
                video.src = window.URL.createObjectURL(localMediaStream)
                video.play()

                @powerOff = ->
                    localMediaStream.stop()
                    status = false

                @emit(Events.CAMERA_SUCCESS, localMediaStream)

            _handleError = (e) =>
                status = false
                @emit(Events.CAMERA_ERROR, e)

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

    Staircase.Camera = Camera


