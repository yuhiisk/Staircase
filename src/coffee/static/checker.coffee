do (win = window, doc = document) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    Util = Staircase.Util

    Params = Staircase.Params

    class Main
        constructor: () ->
            Staircase.initialize({
                # image size
                size: 640,
                # trim size
                trim_offset_top: 176,
                trim_offset_left: 0,
                trim_width: 886, #649 #600
                trim_height: 236, #198 #160
                # event namespace
                eventNamespace: 'Staircase',
                # extend parameter
                params: {},
                # elements
                reUploadSize: 640,
                # debug mode
                debugMode: 'debug'
            })

            @initialize()

        initialize: ->
            # objects
            @processChecker = new Staircase.ProcessChecker()
            @loading = new Staircase.LoadingSprite('#Loading')

            # elements
            @$btnStartUpload = $('#StartUpload')
            @$btnStartCamera = $('#StartCamera')
            @$btnCancel = $('#Cancel')
            @$btnCapture = $('#Capture')
            @$btnRetake = $('#Retake')
            @$btnReselect = $('#Reselect')
            @$btnPostWebCamera = $('#PostWebCamera')
            @$btnPostPhoto = $('#PostPhoto')
            @$form  = $('#Upload')

            # event
            @eventify()

        eventify: ->

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

    new Main()
