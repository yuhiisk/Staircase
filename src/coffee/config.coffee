do (win = window, doc = window.document) ->

    'use strict'

    Staircase =
        initialize: (option) ->
            @settings = $.extend( Staircase.defaults, option )
            Staircase.Params = $.extend(Staircase.Params, @settings.params)

    win.Staircase = Staircase

    Staircase.defaults =
        # image size
        size:
            width: 640
            height: 640
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

    ###
    # API
    ###
    Staircase.API =
        upload: 'http://example.com/'

    ###
    # Debug
    ###
    Staircase.Debug = do () ->
        regExp = new RegExp("^\\?#{Staircase.defaults.debugMode}$")
        return regExp.test(location.search)

    ###
    # Utilities
    ###
    Staircase.Util = {}

    ###
    # Parameters
    ###
    # TODO: defaults.paramsを入れる
    Staircase.Params =
        resized_image_width: 0
        resized_image_height: 0

    ###
    # UI components
    ###
    Staircase.UI = {}

    # TODO:インスタンス化の時に再初期化処理必要
    Staircase.UI.TRIM_OFFSET_TOP = Staircase.defaults.trim_offset_top
    Staircase.UI.TRIM_OFFSET_LEFT = Staircase.defaults.trim_offset_left
    Staircase.UI.TRIM_WIDTH = Staircase.defaults.trim_width
    Staircase.UI.TRIM_HEIGHT = Staircase.defaults.trim_height
    Staircase.UI.TRIM_RATIO = do () ->
        return (Staircase.UI.TRIM_WIDTH / Staircase.defaults.size)

    ###
    # Events
    ###
    Staircase.Events =
        # Camera
        CAMERA_SUCCESS       : Staircase.defaults.eventNamespace + 'camera_success'
        CAMERA_ERROR         : Staircase.defaults.eventNamespace + 'camera_error'
        # Uploader
        UPLOAD_LOAD_IMG      : Staircase.defaults.eventNamespace + 'upload_img_load'
        UPLOAD_READER        : Staircase.defaults.eventNamespace + 'upload_reader'
        # Preview
        PREVIEW_SEND         : Staircase.defaults.eventNamespace + 'preview_send'
        PREVIEW_CAMERA       : Staircase.defaults.eventNamespace + 'preview_camera'
        PREVIEW_PHOTO        : Staircase.defaults.eventNamespace + 'preview_photo'
        # ReUpload
        REUPLOAD_SUBMIT      : Staircase.defaults.eventNamespace + 'reupload_submit'
        REUPLOAD_SUCCESS     : Staircase.defaults.eventNamespace + 'reupload_success'
        REUPLOAD_ERROR       : Staircase.defaults.eventNamespace + 'reupload_error'
        # ProcessCheck
        CHECK_PROCESS        : Staircase.defaults.eventNamespace + 'check_process'
        CHECK_COMPLETE       : Staircase.defaults.eventNamespace + 'check_complete'
        CHECK_ERROR          : Staircase.defaults.eventNamespace + 'check_error'
        # Modal
        MODAL_SHOW           : Staircase.defaults.eventNamespace + 'modal_show'
        MODAL_HIDE           : Staircase.defaults.eventNamespace + 'modal_hide'
        # Transform
        TRANSFORM_LOAD_IMG   : Staircase.defaults.eventNamespace + 'transform_img_load'
        TRANSFORM_MOVE_START : Staircase.defaults.eventNamespace + 'transform_move_start'
        TRANSFORM_MOVE       : Staircase.defaults.eventNamespace + 'transform_move'
        TRANSFORM_MOVE_END   : Staircase.defaults.eventNamespace + 'transform_move_end'
        TRANSFORM_SCALE      : Staircase.defaults.eventNamespace + 'transform_scale'
        # DragAndDrop
        DND_LOAD_IMG : Staircase.defaults.eventNamespace + 'draganddrop_img_load'
        DND_SELECT   : Staircase.defaults.eventNamespace + 'draganddrop_select'
        DND_DROP     : Staircase.defaults.eventNamespace + 'draganddrop_droped'
        DND_READ     : Staircase.defaults.eventNamespace + 'draganddrop_read'


    ###
    # Error
    ###
    Staircase.Error =
        code:
            '0': '0'
            '2': '2'
        text:
            '0': 'エラーテキスト1'
            '2': 'エラーテキスト2'

