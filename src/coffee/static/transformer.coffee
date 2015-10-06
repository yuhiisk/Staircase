do (win = window, doc = document) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI
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
                params:
                    upload:
                        'image_path': '/stub/kayac.png',
                        'image_uuid': '*********'
                # elements
                reUploadSize: 640,
                # debug mode
                debugMode: 'debug'
            })

            @initialize()

        initialize: ->
            @uploader = new Staircase.Uploader('#StartUpload')
            @transform = new Staircase.Transform(
                transform: '#Transform',
                transformImageWrap: '.transform__image',
                transformDrag: '.transform__touch',
                btnUp: '#AdjustUp',
                btnDown: '#AdjustDown',
                btnLeft: '#AdjustLeft',
                btnRight: '#AdjustRight',
                btnZoomIn: '#ZoomIn',
                btnZoomOut: '#ZoomOut',
            )
            @$btnPostPhoto = $('#PostPhoto')

            # event
            @eventify()


        eventify: ->

            @$btnPostPhoto.on('click', (e) =>
                e.preventDefault()
            )

        _postCameraImage: ->


    new Main()
