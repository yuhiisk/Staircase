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

