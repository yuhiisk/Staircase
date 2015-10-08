'use strict'

_setupFixture = (file) ->
    html = __html__['spec/fixture/' + file]
    $j(document.body).append($j(html))

describe('globals parameters', ->

    describe('Staircase.defaults', ->

    )

    describe('Staircase.API', ->

    )

    describe('Staircase.Debug', ->

    )

    describe('Staircase.Util', ->

    )

    describe('Staircase.Params', ->

    )

    describe('Staircase.UI', ->

    )

    describe('Staircase.Events', ->

    )

    describe('Staircase.Error', ->

    )

)

describe('Staircase features test', ->

    describe('Staircase.Camera', ->

        beforeEach(->
            _setupFixture('camera.html')
            @video = document.getElementById('Video')
            @camera = new Staircase.Camera(@video)
        )

        it('Web Camera is supported? for current Browser.', ->
            expect(@camera.isSupport).toEqual(navigator.getUserMedia)
        )

        it('Web Camera power off on init.', ->
            expect(@camera.getStatus()).toBeFalsy()
        )

        it('Get element from instance.', ->
            expect(@camera.getVideo()).toBe(@video)
        )
    )

    describe('Staircase.Uploader', ->
        beforeEach(->
            _setupFixture('uploader.html')
            @el = document.getElementById('StartUpload')
            @uploader = new Staircase.Uploader(@el)
        )

        # it('', ->
        #     expect().toEqual()
        # )
        # it('', ->
        #     expect().toEqual()
        # )
    )

)
