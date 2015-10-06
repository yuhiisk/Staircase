do (win = window, doc = document) ->

    'use strict'

    Events = Staircase.Events
    Util = Staircase.Util
    UI = Staircase.UI
    Params = Staircase.Params

    class Main
        constructor: () ->
            Staircase.initialize({
                # image size
                size:
                    width: 640
                    height: 480
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
            @dnd = new Staircase.DragAndDrop('#DragAndDrop')
            @previewCanvas = new Staircase.PreviewCanvas('#Canvas')
            @previewImage = new Staircase.PreviewImage('#PreviewContainer')

            # elements
            # @$btnStartUpload = $('#StartUpload')
            # @$btnStartCamera = $('#StartCamera')
            @$btnRetake = $('#Retake')
            # @$btnReselect = $('#Reselect')
            @$btnPostWebCamera = $('#PostWebCamera')
            @$form  = $('#Upload')

            # event
            @eventify()

            # callback
            @globalize()


        eventify: ->
            # DragAndDrop
            @dnd.on(Events.DND_SELECT, (files) ->
                console.log files
            )
            @dnd.on(Events.DND_DROP, (files) ->
                console.log files
            )
            @dnd.on(Events.DND_LOAD_IMG, (result, file) =>
                if file.size >= 2097152
                    alert('アップロードサイズ上限を超えています。')

                @previewCanvas.draw(result)
                @previewImage.show()

                $('#DragAndDrop').hide()
                $('#Preview').show()
            )

            # Preview
            @$btnRetake.on('click', (e) =>
                e.preventDefault()
                @previewImage.hide()
                $('#DragAndDrop').show()
                $('#Preview').hide()
            )
            @$btnPostWebCamera.on('click', (e) =>
                e.preventDefault()
                @_postCameraImage()
            )


        globalize: ->
            self = @

            # JSONを受け取って処理する
            Util.setResponse = (res, type) ->
                Params.upload = res.response

                switch type
                    when 'CAMERA'
                        alert('Post Complete.')
                        # self.processChecker.set(Params.upload.result_path).start()
                        break

                    when 'PHOTO'
                        alert('Form?')
                        break

                    else
                        break

            # iframeを経由してサーバからHTMLファイル形式でJSONを受け取るグローバルメソッド
            Util['getJSON'] = (json) ->
                Util.setResponse(json, 'PHOTO')


        _postCameraImage: ->

            canvas = @previewCanvas.getCanvas()
            blob     = @previewCanvas.getBlob('image/png')
            formData = new FormData(@$form[0])
            xhr      = new XMLHttpRequest()

            # ratio = 2.2 + (UI.TRIM_RATIO - 1)
            # video = @camera.getVideo()
            # x = ($(video).width() / 2 * ratio) - (UI.TRIM_WIDTH / 2)
            # y = ($(video).height() / 2 * ratio) - (UI.TRIM_HEIGHT / 2)

            # formData.append('is_camera', true) # camera画像の送信かどうか
            formData.append('image', blob) # 画像データ
            # formData.append('zoom', ratio) # 拡大比率
            # formData.append('x', x) # 拡大画像の左上を基準としたトリミング位置x
            # formData.append('y', y) # 拡大画像の左上を基準としたトリミング位置y
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
            if Staircase.Debug
                # テスト
                xhr.open('GET', 'stub/result.json')
                xhr.send()

            else
                # 本番
                xhr.open('POST', @$form.attr('action'))
                xhr.send(formData)

    new Main()
