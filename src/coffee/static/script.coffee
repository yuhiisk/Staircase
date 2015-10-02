do (win = window, doc = document) ->

    new Staircase({
        # image size
        size: 640,
        # trim size
        trim_offset_top: 176,
        trim_offset_left: 0,
        trim_width: 886, #649 #600
        trim_height: 236, #198 #160
        # parameter name
        params: {},
        path: 'image_path',
        uuid: 'image_uuid',
        # elements
        modal: '#Modal',
        modalPage: '.wrapper'
        camera: '#Video',
        previewCanvas: '#Canvas',
        previewContainer: '#PreviewContainer',
        uploader: '#StartUpload',
        reUploadSize: 640,
        loading: '#Loading',
        cameraScene: '#Camera',
        previewScene: '#Preview',
        loadingScene: '#Loading',
        sceneManager: [],
        btnStartUpload: '#StartUpload',
        btnStartCamera: '#StartCamera',
        btnCancelCamera: '#Cancel',
        btnCaptureCamera: '#Capture',
        btnRetakeCapture: '#Retake',
        btnReselect: '#Reselect',
        btnPostWebCamera: '#PostWebCamera',
        btnPostPhoto: '#PostPhoto',
        uploadForm: '#Upload',
    })

