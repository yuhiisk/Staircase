do (win = window, doc = document) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI
    Params = Staircase.Params

    Staircase::initialize = ->
        @uploader = new UI.Uploader(@settings.uploader)
        @transform = new UI.Transform(@settings.transformOption)
        @$btnPostPhoto = $(@settings.btnPostPhoto)

        # event
        @eventify()

        # callback
        @globalize()


    Staircase::eventify = ->

        @$btnPostPhoto.on('click', (e) =>
            e.preventDefault()
        )

    Staircase::_postCameraImage = ->


    ###
    # Entry Point
    ###
    sc =new Staircase({
        # image size
        size: 640,
        # trim size
        trim_offset_top: 176,
        trim_offset_left: 0,
        trim_width: 886, #649 #600
        trim_height: 236, #198 #160
        # parameter name
        params:
            upload:
                'image_path': '/stub/kayac.png',
                'image_uuid': '*********'
        # elements
        btnUp: '#AdjustUp',
        btnDown: '#AdjustDown',
        btnLeft: '#AdjustLeft',
        btnRight: '#AdjustRight',
        btnZoomIn: '#ZoomIn',
        btnZoomOut: '#ZoomOut',
    })
    console.log sc
