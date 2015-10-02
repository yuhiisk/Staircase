do (win = window, doc = window.document) ->

    'use strict'

    Events = win.Staircase.ns('Events')
    UI = win.Staircase.ns('UI')

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

            @el = document.getElementById(id)
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


    ###
    # SceneManager
    # シーン管理クラス
    # @constructor
    # @extends EventEmitter2
    # @params {HTMLElement} DOM
    ###
    class SceneManager extends EventEmitter2

        constructor: (scene) ->

            super(scene)

            @scenes = scene || []
            @current = 0

            @active(@current)

        add: (scene) ->
            @scenes.push(scene)

        active: (index, silent) ->
            if index?
                current = index
            else
                current = @current

            for i in [0...@scenes.length]
                scene = @scenes[i]
                if i is current
                    # console.log scene
                    scene.active()
                else
                    scene.deactive()

            @current = current
            @emit('sceneManager.active', null, @current)

        deactive: (index) ->
            if index?
                current = index
            else
                current = @current

            @scenes[index].deactive()
            @current = current

            @emit('sceneManager.deactive', null, @current)

        reset: () ->
            @current = 0

            for i in [0...@scene.length]
                scene = @scene[i]
                scene.deactive()
            @scenes = []

        first: () ->
            return @scenes[0]

        last: () ->
            return @scenes[@scenes.length - 1]

        isFirst: () ->
            return @current is 0

        isLast: () ->
            return @current is @scenes.length - 1

        prev: () ->
            if @hasPrev()
                @active(--@current)

        next: () ->
            if @hasNext()
                @active(++@current)

        hasPrev: () ->
            return 0 <= @current - 1

        hasNext: () ->
            return @scenes.length > @current + 1

    UI.SceneManager = SceneManager

