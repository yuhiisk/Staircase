do (win = window, doc = window.document) ->

    'use strict'

    if win.location.hash?
        if win.location.hash is "#0"
            $('.error__text').text('瞳を検出することが出来ませんでした。')
        else if win.location.hash is "#2"
            $('.error__text').text('複数の瞳が検出されました')

