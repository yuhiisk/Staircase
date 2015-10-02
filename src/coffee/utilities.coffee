do (win = window, doc = window.document) ->

    'use strict'

    Util = win.Staircase.ns('Util')

    # Detect Mobile devices
    ua = navigator.userAgent.toLowerCase()
    Util.ua = {}
    Util.ua.isIOS = /(iphone|ipod|ipad)/.test(ua)
    Util.ua.isAndroid = /(android)/.test(ua)
    Util.ua.isMobile = (Util.ua.isIOS || Util.ua.isAndroid)


    #
    # GETクエリを取得
    #
    getQueryString = () ->

        result = {}

        if 1 < win.location.search.length
            # 最初の1文字 (?記号) を除いた文字列を取得する
            query = win.location.search.substring( 1 )

            # クエリの区切り記号 (&) で文字列を配列に分割する
            parameters = query.split( '&' )

            for i in [0...parameters.length]
                # パラメータ名とパラメータ値に分割する
                element = parameters[ i ].split( '=' )

                paramName = decodeURIComponent( element[ 0 ] )
                paramValue = decodeURIComponent( element[ 1 ] )

                # パラメータ名をキーとして連想配列に追加する
                result[ paramName ] = paramValue

        return result

    Util.getQueryString = getQueryString

    # Attempt to parse using the native JSON parser first
    parseJSON = ( data ) ->
        if win.JSON && win.JSON.parse
            # Support: Android 2.3
            # Workaround failure to string-cast null input
            return win.JSON.parse( data + '' )

    Util.parseJSON = parseJSON


    # rollover = () ->
    #     $('[class^="btn__item--"], .rollover').each(() ->
    #         $this = $(@)
    #         if $this.hasClass('btn__item--input') then return

    #         $this.hover(() ->
    #             $this.stop().animate({
    #                 opacity: .8
    #             }, 100)
    #         , () ->
    #             $this.stop().animate({
    #                 opacity: 1
    #             }, 100)
    #         )
    #     )

    # Util.rollover = rollover
