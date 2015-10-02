do (win = window, doc = window.document) ->

    'use strict'

    Events = Staircase.Events
    UI = Staircase.UI

    ###
    # Scene
    # シーン単体のクラス
    # @constructor
    # @extends EventEmitter2
    # @params {string} DOM id
    ###
    class Scene extends EventEmitter2

        constructor: (id) ->

            super(id)

            @el = $(id)[0]
            @items = []

            @initialize()

        initialize: () ->

        add: (item) ->
            @items.push(item)
            @emit('scene.add', item, @)

        active: () ->

            if @items.length > 0
                for item in @items
                    item.show()

            @el.style.display = 'block'
            @emit('scene.active', @)

        deactive: () ->

            if @items.length > 0
                for item in @items
                    item.hide()

            @el.style.display = 'none'
            @emit('scene.deactive', @)

    UI.Scene = Scene

