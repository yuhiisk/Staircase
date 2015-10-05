do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    UI = Staircase.UI

    ###
    # ProcessChecker
    # サーババッチ処理の完了チェッカ
    # @constructor
    # @extends EventEmitter2
    ###
    class ProcessChecker extends EventEmitter2

        constructor: (options) ->

            super(options)
            @initialize()

        initialize: () ->

            self = @
            isComplete = false
            timer = null
            url = ''

            _set = (path) ->
                url = path
                @

            _start = () ->

                isComplete = false

                timer = setInterval(() ->

                    $.ajax(
                        type: 'GET'
                        url: url
                        dataType: 'jsonp'
                        jsonpCallback: 'callback'
                    ).done((res) ->

                        #  画像が完成している場合
                        if res.is_recogition_finished is true
                            _stop()
                            isComplete = true
                            self.emit(Events.CHECK_COMPLETE, res)

                        # 画像が完成していない場合
                        else if res.is_recogition_finished is false
                            self.emit(Events.CHECK_PROCESS, res)

                        # Error handle
                        # uidが存在しないとき（最初の画像のアップロード自体が失敗している時など）
                        # else if res.status is 'error'
                        #     alert('ファイルのアップロードに失敗しました。')
                        #     _stop()
                        #     self.emit(Events.CHECK_ERROR)
                    )

                , 1000)

            _stop = () ->

                clearInterval(timer)
                timer = null

            _getStatus = () ->
                return isComplete

            @set = _set
            @start = _start
            @stop = _stop
            @getStatus = _getStatus

    UI.ProcessChecker = ProcessChecker


