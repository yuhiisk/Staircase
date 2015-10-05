Staircase
=======

## Overview
Staircase is Javascript File uploader library.

## WorkFlow

### Web Camera

### File Upload


## Server


# API

## Staircase.UI
### Staircase.UI.Camera

- isSupport()
- powerOn()
- powerOff()

### Staircase.UI.Modal

- show()
- hide()

### Staircase.UI.PreviewCanvas

- draw()
- getCanvas()
- getBlob()

### Staircase.UI.PreviewImage

- show()
- hide()

### Staircase.UI.Uploader

- reset()


### Staircase.UI.ReUploader

- submit()

### Staircase.UI.ProcessChecker

- set()
- start()

### Staircase.UI.LoadingSprite

- start()
- stop()

### Staircase.UI.Scene

### Staircase.UI.SceneManager

- current

- active()
- deactive()
- prev()
- next()


### Staircase.Events

#### Camera
CAMERA_SUCCESS:   Staircase.defaults.eventNamespace + 'camera_success'
CAMERA_ERROR:     Staircase.defaults.eventNamespace + 'camera_error'
#### Uploader
UPLOAD_LOAD_IMG:  Staircase.defaults.eventNamespace + 'upload_img_load'
UPLOAD_READER:    Staircase.defaults.eventNamespace + 'upload_reader'
#### Preview
PREVIEW_SEND:     Staircase.defaults.eventNamespace + 'preview_send'
PREVIEW_CAMERA:   Staircase.defaults.eventNamespace + 'preview_camera'
PREVIEW_PHOTO:    Staircase.defaults.eventNamespace + 'preview_photo'
#### ReUploader
REUPLOAD_SUBMIT:  Staircase.defaults.eventNamespace + 'reupload_submit'
REUPLOAD_SUCCESS: Staircase.defaults.eventNamespace + 'reupload_success'
REUPLOAD_ERROR:   Staircase.defaults.eventNamespace + 'reupload_error'
#### ProcessChecker
CHECK_PROCESS:    Staircase.defaults.eventNamespace + 'check_process'
CHECK_COMPLETE:   Staircase.defaults.eventNamespace + 'check_complete'
CHECK_ERROR:      Staircase.defaults.eventNamespace + 'check_error'
#### Modal
MODAL_SHOW:       Staircase.defaults.eventNamespace + 'modal_show'
MODAL_HIDE:       Staircase.defaults.eventNamespace + 'modal_hide'
