do (win = window, doc = window.document, Staircase = window.Staircase) ->

    'use strict'

    Debug = Staircase.Debug
    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI
    Params = Staircase.Params

    ###
    # Entry Point
    ###
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

            @previewImage = new Staircase.PreviewImage('#PreviewContainer')
            @uploader = new Staircase.Uploader('#StartUpload')
            @reUploader = new Staircase.ReUploader({ size: 640 })
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

            # callback
            @globalize()


        eventify: ->
            # Preview
            @$btnReselect.on('click', (e) =>
                e.preventDefault()
                @uploader.reset()
                @transformView.$el.addClass('is-hidden')
                @modal.hide()
            )

            @$btnPostPhoto.on('click', (e) =>
                e.preventDefault()
                @reUploader.submit()
                $('.loading__upload').append($('.transform__wrap'))
                @loading.start()
            )

            # Uploader
            @uploader.on(Events.UPLOAD_LOAD_IMG, (e, image) =>
                @$form.submit()
            )

            @reUploader.on(Events.REUPLOAD_SUCCESS, (e) =>
                Params.reupload = e.response
                @processChecker.set(Params.reupload.result_path).start()
            )
            @reUploader.on(Events.REUPLOAD_ERROR, (e) =>
                alert('アップロードに失敗しました。')
                @loading.stop()
            )

            # Checker
            @processChecker.on(Events.CHECK_COMPLETE, (res) =>
                @loading.stop()

                switch res.result.face_count
                    when 0
                        win.location.href = '/error.html#0'
                        break
                    when 1
                        win.location.href = res.result_url
                        break
                    when 2
                        win.location.href = '/error.html#2'
                        break
                    else
                        break
            )

        globalize: ->
            self = @

            # JSONを受け取って処理する
            Util.setResponse = (res, CAMERA_or_PHOTO) ->
                Params.upload = res.response
                # self.modal.show()

                switch CAMERA_or_PHOTO
                    when 'CAMERA'
                        self.processChecker.set(Params.upload.result_path).start()
                        break

                    when 'PHOTO'
                        # 再代入を回避
                        if !self.transformView?
                            self.transformView = new Staircase.Transform(
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
                        else
                            self.transformView.setImage()
                            self.transformView.reset()
                        self.transformView.$el.removeClass('is-hidden')
                        break

                    else
                        break

            # iframeを経由してサーバからHTMLファイル形式でJSONを受け取るグローバルメソッド
            Util['getJSON'] = (json) ->
                Util.setResponse(json, 'PHOTO')


        _postCameraImage: ->

    new Main()
