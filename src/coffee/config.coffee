do (win = window, doc = window.document) ->

    'use strict'

    ###
    # Namespace
    ###
    Staircase = win.Staircase ? {}
    win.Staircase = Staircase

    Staircase.namespace = (ns_string) ->
        parts = ns_string.split('.')
        parent = Staircase

        if parts[0] is 'Staircase' then parts = parts.slice(1)

        for i in [0...parts.length]
            if typeof parent[parts[i]] is 'undefined'
                parent[parts[i]] = {}

            parent = parent[parts[i]]

        return parent

    # namespace() alias
    Staircase.ns = Staircase.namespace


    ###
    # API
    ###
    Staircase.ns('API')

    Staircase.API =
        URL: 'http://example.com/'

    ###
    # Debug
    ###
    Staircase.ns('Debug')

    Staircase.Debug = do () ->
        return /\?debug/.test(location.search)

    ###
    # Utilities
    ###
    Staircase.ns('Util')

    ###
    # Parameters
    ###
    Staircase.ns('Params')

    ###
    # UI components
    ###
    Staircase.ns('UI')
    Staircase.UI.TRIM_OFFSET_TOP = 176
    Staircase.UI.TRIM_OFFSET_LEFT = 0
    Staircase.UI.TRIM_WIDTH = 886 #649 #600
    Staircase.UI.TRIM_HEIGHT = 236 #198 #160
    Staircase.UI.TRIM_RATIO = do () ->
        return (Staircase.UI.TRIM_WIDTH / 640)

    ###
    # Events
    ###
    Staircase.ns('Events')

    Staircase.Events =
        # Camera
        CAMERA_SUCCESS: 'camera_success'
        CAMERA_ERROR: 'camera_error'
        # Uploader
        UPLOAD_LOAD_IMG: 'upload_img_load'
        UPLOAD_READER: 'upload_reader'
        # Preview
        PREVIEW_SEND: 'preview_send'
        PREVIEW_CAMERA: 'preview_camera'
        PREVIEW_PHOTO: 'preview_photo'
        # ReUpload
        REUPLOAD_SUBMIT: 'reupload_submit'
        REUPLOAD_SUCCESS: 'reupload_success'
        REUPLOAD_ERROR: 'reupload_error'
        # Check
        CHECK_PROCESS: 'check_process'
        CHECK_COMPLETE: 'check_complete'
        CHECK_ERROR: 'check_error'
        # Modal
        MODAL_SHOW: 'modal_show'
        MODAL_HIDE: 'modal_hide'


    ###
    # Error
    ###
    Staircase.ns('Error')
    Staircase.Error =
        code:
            '0': '0'
            '2': '2'
        text:
            '0': '瞳を検出することが出来ませんでした。'
            '2': '複数の瞳が検出されました'

