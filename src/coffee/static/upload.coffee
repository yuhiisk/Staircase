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
    Staircase::initialize = ->

        @previewImage = new UI.PreviewImage(@settings.previewContainer)
        @uploader = new UI.Uploader(@settings.uploader)
        @reUploader = new UI.ReUploader({ size: @settings.reUploadSize })
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
        @uploader.on(Events.UPLOAD_LOAD_IMG, (e) =>
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

    Staircase::globalize = ->
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
                        self.transformView = new UI.Transform(self.settings.transformOption)
                    else
                        self.transformView.setImage()
                        self.transformView.reset()
                    self.transformView.$el.removeClass('is-hidden')
                    break

                else
                    break

        # iframeを経由してサーバからHTMLファイル形式でJSONを受け取るグローバルメソッド
        Util.getJSON = (json) ->
            Util.setResponse(json, 'PHOTO')


    Staircase::_postCameraImage = ->

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
        params:
            upload: {}
            reupload: {}
        previewContainer: '#PreviewContainer',
        uploader: '#StartUpload',
        reUploadSize: 640,
        btnReselect: '#Reselect',
        btnPostPhoto: '#PostPhoto',
        uploadForm: '#Upload',
    })
