do (win = window, doc = window.document, Staircase = window.Staircase) ->

    'use strict'

    defaults =
        # image size
        trim_offset_top: 176,
        trim_offset_left: 0,
        trim_width: 886, #649 #600
        trim_height: 236, #198 #160
        # debug mode
        debug_mode: '?debug',
        # event namespace
        event_namespace: 'Staircase',
        # parameter name
        params: {},
        path: 'image_path',
        uuid: 'image_uuid',
        # elments
        modal: '#Modal',
        modalPage: '.wrapper'
        camera: 'Video',
        previewCanvas: 'Canvas',
        previewContainer: 'PreviewContainer',
        uploader: '#StartUpload',
        reUploadSize: 640,
        loading: '#Loading',
        cameraScene: 'Camera',
        previewScene: 'Preview',
        loadingScene: 'Loading',
        scenes: [],
        btnStartUpload: '#StartUpload',
        btnStartCamera: '#StartCamera',
        btnCancelCamera: '#Cancel',
        btnCaptureCamera: '#Capture',
        btnRetakeCapture: '#Retake',
        btnReselect: '#Reselect',
        btnPostWebCamera: '#PostWebCamera',
        btnPostPhoto: '#PostPhoto',
        uploadForm: '#Upload'

    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI

    Params = Staircase.Params
    Params.upload = {}
    Params.reupload = {}

    Util.getImagePath = () ->
        return Params.upload.image_path

    Util.getImageId = () ->
        return Params.upload.image_uuid


    class Main

        constructor: (option) ->
            @settings = $.extend( defaults, option )
            @initialize()

        initialize: () ->
            # objects
            @modal = new UI.Modal(
                id: @settings.modal
                page: @settings.modalPage
            )
            @camera = new UI.Camera(@settings.camera)
            @previewCanvas = new UI.PreviewCanvas(@settings.previewCanvas)
            @previewImage = new UI.PreviewImage(@settings.previewContainer)
            @uploader = new UI.Uploader(@settings.uploader)
            @reUploader = new UI.ReUploader({ size: @settings.reUploadSize })
            @processChecker = new UI.ProcessChecker()
            @loading = new UI.LoadingSprite(@settings.loading)

            @cameraView = new UI.Scene(@settings.cameraScene)
            @previewView = new UI.Scene(@settings.previewScene)
            @loadingView = new UI.Scene(@settings.loadingScene)

            # scene
            @sceneManager = new UI.SceneManager([
                @cameraView,
                @previewView,
                @loadingView
            ])
            @sceneManager.active(@sceneManager.current)

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


        eventify: () ->

            if !@camera.isSupport?
                @$btnStartCamera.parent().hide()

            # Start
            @$btnStartCamera.on('click', (e) =>
                e.preventDefault()
                @modal.show()
                @camera.powerOn()
                @sceneManager.active(0)
            )

            # Camera
            @camera.on(Events.CAMERA_SUCCESS, (e) =>
                console.log e
            )
            @camera.on(Events.CAMERA_ERROR, (e) ->
                console.log e
            )

            # Button
            @$btnCancel.on('click', (e) =>
                e.preventDefault()
                @sceneManager.prev()
                @camera.powerOff()
                @modal.hide()
            )

            @$btnCapture.on('click', (e) =>
                e.preventDefault()
                video = @camera.getVideo()
                @previewCanvas.draw(video)
                @sceneManager.next()
                @previewImage.show()
            )

            # Preview
            @$btnRetake.on('click', (e) =>
                e.preventDefault()
                @sceneManager.prev()
                @previewImage.hide()
            )
            @$btnReselect.on('click', (e) =>
                e.preventDefault()
                @sceneManager.active(0)
                @uploader.reset()
                @transformView.$el.addClass('is-hidden')
                @modal.hide()
            )

            @$btnPostWebCamera.on('click', (e) =>
                e.preventDefault()
                @loading.start()
                @_postCameraImage()
            )

            @$btnPostPhoto.on('click', (e) =>
                e.preventDefault()
                @reUploader.submit()
                $('.loading__upload').append($('.transform__wrap'))
                @loading.start()
                @sceneManager.next()
            )

            @modal.on(Events.MODAL_HIDE, (e) =>
                if @camera.getStatus() is true
                    @camera.powerOff()

                if @transformView?
                    @transformView.$el.addClass('is-hidden')

                @uploader.reset()
                @previewImage.hide()
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

        globalize: () ->
            self = @

            # JSONを受け取って処理する
            Util.setResponse = (res, CAMERA_or_PHOTO) ->
                Params.upload = res.response
                self.modal.show()

                switch CAMERA_or_PHOTO
                    when 'CAMERA'
                        self.processChecker.set(Params.upload.result_path).start()
                        break

                    when 'PHOTO'
                        # 再代入を回避
                        if !self.transformView?
                            self.transformView = new UI.Transform('#Transform')
                        else
                            self.transformView.setImage()
                            self.transformView.reset()
                        self.transformView.$el.removeClass('is-hidden')
                        self.previewView.emit(Events.PREVIEW_PHOTO)
                        self.sceneManager.active(1)
                        break

                    else
                        break

            # iframeを経由してサーバからHTMLファイル形式でJSONを受け取るグローバルメソッド
            Util.getJSON = (json) ->
                Util.setResponse(json, 'PHOTO')


        _postCameraImage: () ->

            canvas = @previewCanvas.getCanvas()
            blob     = @previewCanvas.getBlob('image/png')
            formData = new FormData(@$form[0])
            xhr      = new XMLHttpRequest()

            @camera.powerOff()

            ratio = 2.2 + (UI.TRIM_RATIO - 1)
            video = @camera.getVideo()
            x = ($(video).width() / 2 * ratio) - (UI.TRIM_WIDTH / 2)
            y = ($(video).height() / 2 * ratio) - (UI.TRIM_HEIGHT / 2)

            formData.append('is_camera', true) # camera画像の送信かどうか
            formData.append('image', blob) # 画像データ
            formData.append('zoom', ratio) # 拡大比率
            formData.append('x', x) # 拡大画像の左上を基準としたトリミング位置x
            formData.append('y', y) # 拡大画像の左上を基準としたトリミング位置y
            formData.append('width', UI.TRIM_WIDTH) # トリミング横サイズ
            formData.append('height', UI.TRIM_HEIGHT) # トリミング縦サイズ

            xhr.onload = (e) ->
                if xhr.readyState is 4
                    if xhr.status is 200
                        json = Util.parseJSON(xhr.responseText)
                        Util.setResponse(json, 'CAMERA')

                    else
                        # エラー処理

            xhr.onerror = (e) ->
                # エラー処理
                console.log 'XHR ERROR: ', e

            # テストコード
            if /\?debug/.test(location.search)
                # テスト
                xhr.open('GET', 'stub/result.json')
                xhr.send()

            else
                # 本番
                xhr.open('POST', @$form.attr('action'))
                xhr.send(formData)


    ###
    # Entry Point
    ###
    new Main()

