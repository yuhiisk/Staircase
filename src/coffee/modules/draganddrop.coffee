do (win = window, doc = window.document) ->

    'use strict'

    UI = Staircase.UI
    Events = Staircase.Events

    ###
    # DragAndDrop
    # @constructor
    # @extends EventEmitter2
    # @params {String} DOM id
    ###
    class DragAndDrop extends EventEmitter2

        constructor: (id) ->

            super(id)

            @initialize(id)

        initialize: (id) ->

            self = @
            drag = $(id)[0]
            input = doc.getElementById('File')

            _handleFileSelect = (e) ->
                # FileList object
                files = e.target.files

                # output = []
                for file in files
                    if !file.type.match('image.*') then continue
                    _handleFileReader(file)

                self.emit(Events.DND_SELECT, files)

            _handleDragOver = (e) ->
                e.stopPropagation()
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'

            _handleDrop = (e) ->
                e.stopPropagation()
                e.preventDefault()

                # FileList object
                files = e.dataTransfer.files
                for file in files
                    if !file.type.match('image.*') then continue
                    _handleFileReader(file)

                self.emit(Events.DND_DROP, e, files)

            _handleFileReader = (file) ->
                _file = {}
                image = new Image()
                image.onload = (e) ->
                    self.emit(Events.DND_LOAD_IMG, e, @, _file)

                reader = new FileReader()
                reader.onload = do (theFile = file) ->
                    return (e) ->
                        _file = theFile
                        image.src = e.target.result
                        self.emit(Events.DND_READ, e, e.target.result, _file)

                reader.readAsDataURL(file)

            _isSupport = do () ->
                status = (win.File? && win.FileReader? && win.FileList? && win.Blob?)
                if !status then throw new Error('The File APIs are not fully supported in this browser.')
                return status

            _getDragElement = () ->
                return draggable

            if input?
                input.addEventListener('change', _handleFileSelect, false)
            drag.addEventListener('dragover', _handleDragOver, false)
            drag.addEventListener('drop', _handleDrop, false)

            # export
            @isSupport = _isSupport
            @getDragElement = _getDragElement

    Staircase.DragAndDrop = DragAndDrop


