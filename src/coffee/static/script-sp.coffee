do (win = window, doc = window.document) ->

    'use strict'

    Events = win.Staircase.ns('Events')
    Util = win.Staircase.ns('Util')

    UI = win.Staircase.ns('UI')
    UI.TRIM_OFFSET_TOP = 200
    UI.TRIM_OFFSET_LEFT = 0

    Params = win.Staircase.ns('Params')
    Params.upload = {}
    Params.reupload = {}

    Util.getImagePath = () ->
        return Params.upload.image_path

    Util.getImageId = () ->
        return Params.upload.image_uuid

    ###
    # Entry Point
    ###
    class Main

        constructor: () ->

            @initialize()

        initialize: () ->
            # objects
            @modal = new UI.Modal(
                id: '#Modal'
                page: '.wrapper'
            )
            @previewImage = new UI.PreviewImage('PreviewContainer')
            @uploader = new UI.Uploader('#StartUpload')
            @reUploader = new UI.ReUploader({ size: 276 })
            @processChecker = new UI.ProcessChecker()
            @loading = new UI.Loading('#Loading')
            @exchangeLoading = new UI.Exchange('#Exchange')
            @$form = $('#Upload')

            @previewView = new UI.Scene('Preview')
            @loadingView = new UI.Scene('Loading')

            # scene
            @sceneManager = new UI.SceneManager([
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
                # console.log @modal.winHeight, @modal.$el.find('.modal__content').height()
                # if @modal.winHeight >= @modal.$el.find('.modal__content').height()
                    # console.log 'window height'
                    # @modal.$el.height(@modal.winHeight)
                # else
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
            # @reUploader.on(Events.REUPLOAD_SUBMIT, (params) =>
            # )
            @reUploader.on(Events.REUPLOAD_SUCCESS, (e) =>
                Params.reupload = e.response
                @processChecker.set(Params.reupload.result_path).start()
            )
            @reUploader.on(Events.REUPLOAD_ERROR, (e) =>
                alert('アップロードに失敗しました。')
                @loading.stop()
            )

            # Checker
            # @processChecker.on(Events.CHECK_PROCESS, (res) =>
            #    console.log 'check processing...', res
            # )
            @processChecker.on(Events.CHECK_COMPLETE, (res) =>
                # console.log 'check complete', res
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
            # @processChecker.on(Events.CHECK_ERROR, (err) =>
            #    console.log 'check error'
            #)

        globalize: () ->
            self = @

            # JSONを受け取って処理する
            Util.setResponse = (res, CAMERA_or_PHOTO) ->
                Params.upload = res.response
                self.modal.show()

                switch CAMERA_or_PHOTO
                    when 'PHOTO'
                        if !self.transformView?
                            self.transformView = new UI.Transform('#Transform')
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
            Util.getJSON = (json) ->
                Util.setResponse(json, 'PHOTO')


    new Main()


