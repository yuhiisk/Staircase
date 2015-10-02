do (win = window, doc = window.document) ->

    'use strict'

    Util = Staircase.Util

    query = Util.getQueryString()

    if !query.image_uuid? then return

    $('.btn__item--back').attr('href', "/recognition/result/#{query.image_uuid}")

