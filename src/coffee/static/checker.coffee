do (win = window, doc = document) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI

    Params = Staircase.Params

    Staircase::initialize = ->
        # objects
        @processChecker = new UI.ProcessChecker()
        @loading = new UI.LoadingSprite(@settings.loading)

        # elements
        @$btnStartUpload = $(@settings.btnStartUpload)
        @$btnStartCamera = $(@settings.btnStartCamera)
        @$btnCancel = $(@settings.btnCancelCamera)
        @$btnCapture = $(@settings.btnCaptureCamera)
        @$btnRetake = $(@settings.btnRetakeCapture)
        @$btnReselect = $(@settings.btnReselect)
        @$btnPostWebCamera = $(@settings.btnPostWebCamera)
        @$btnPostPhoto = $(@settings.btnPostPhoto)
        @$form  = $(@settings.uploadForm)

        # event
        @eventify()

        # callback
        @globalize()


    Staircase::eventify = ->

        @$btnPostPhoto.on('click', (e) =>
            e.preventDefault()
            @processChecker.set('/stub/status.jsonp').start()
        )

        # Checker
        @processChecker.on(Events.CHECK_PROCESS, (res) =>
            console.log res
            console.log @processChecker.getStatus()
        )
        @processChecker.on(Events.CHECK_COMPLETE, (res) =>
            console.log res
            @processChecker.stop()
        )

    ###
    # Entry Point
    ###
    new Staircase({
        # image size
        size: 640,
        # trim size
        trim_offset_top: 176,
        trim_offset_left: 0,
        trim_width: 886, #649 #600
        trim_height: 236, #198 #160
        # parameter name
        params: {},
        # elements
        btnStartUpload: '#StartUpload',
        btnStartCamera: '#StartCamera',
        btnCancelCamera: '#Cancel',
        btnCaptureCamera: '#Capture',
        btnRetakeCapture: '#Retake',
        btnReselect: '#Reselect',
        btnPostWebCamera: '#PostWebCamera',
        btnPostPhoto: '#PostPhoto',
        uploadForm: '#Upload',
    })
