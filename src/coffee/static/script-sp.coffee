do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    Params = Staircase.Params
    Util = Staircase.Util
    UI = Staircase.UI
    # SP用に変更
    UI.TRIM_OFFSET_TOP = 200
    UI.TRIM_OFFSET_LEFT = 0


    ###
    # Entry Point
    ###
    class Main

        constructor: () ->

            @initialize()

        initialize: () ->
            # objects
            @modal = new Staircase.Modal(
                id: '#Modal'
                page: '.wrapper'
            )
            @previewImage = new Staircase.PreviewImage('#PreviewContainer')
            @uploader = new Staircase.Uploader('#StartUpload')
            @reUploader = new Staircase.ReUploader({ size: 276 })
            @processChecker = new Staircase.ProcessChecker()
            @loading = new Staircase.Loading('#Loading')
            @exchangeLoading = new Staircase.Exchange('#Exchange')
            @$form = $('#Upload')

            @previewView = new Staircase.Scene('#Preview')
            @loadingView = new Staircase.Scene('#Loading')

            # scene
            @sceneManager = new Staircase.SceneManager([
                @previewView,
                @loadingView
            ])

            # elements
            # TODO: Subjectとしてbuttonのクラスが欲しい
            @$btnCancel = $('#Cancel')
            @$btnCapture = $('#Capture')
            @$btnReselect = $('#Reselect')
            @$btnPostPhoto = $('#PostPhoto')

            # event
            @eventify()

            # callback
            @globalize()


        eventify: () ->

            # Button
            @$btnCancel.on('click', (e) =>
                @sceneManager.prev()
                @modal.hide()
            )

            # Preview
            @$btnReselect.on('click', (e) =>
                e.preventDefault()
                @sceneManager.active(0)
                @uploader.reset()
                @transformView.$el.addClass('is-hidden')
                @modal.hide()
            )

            @$btnPostPhoto.on('click', (e) =>
                @reUploader.submit()
                $('.loading__upload').append($('.transform__wrap').clone())
                @loading.start()
                @sceneManager.next()
            )

            @modal.on(Events.MODAL_SHOW, (e) =>
                if !@modal.HEIGHT?
                    @modal.HEIGHT = @modal.$el.find('.modal__content').height()
                @modal.$el.height(@modal.HEIGHT)
            )
            @modal.on(Events.MODAL_HIDE, (e) =>
                @modal.$el.height('auto')
            )

            @$form.on('submit', (e) =>
                @exchangeLoading.active().show()
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
                        win.location.href = '/sp/error.html#0'
                        break
                    when 1
                        win.location.href = res.result_url
                        break
                    when 2
                        win.location.href = '/sp/error.html#2'
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
                    when 'PHOTO'
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

                        self.exchangeLoading.deactive().hide()
                        self.transformView.$el.removeClass('is-hidden')
                        self.previewView.trigger(Events.PREVIEW_PHOTO)
                        self.sceneManager.active(0)
                        break

                    else
                        break

            # iframeからJSONを受け取るグローバルメソッド
            Util['getJSON'] = (json) ->
                Util.setResponse(json, 'PHOTO')


    new Main()


