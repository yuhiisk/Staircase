# Autoprefixer
AUTOPREFIXER_BROWSERS = [
    "ie >= 8",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.0",
    "bb >= 10"
]

# Device type
typeStr = "%type%"
typeDist = "%type_dir%"

# Directory
build = "./build/"
root = "./"
src = "#{root}src/"
dist = "#{root}test/"
# common = "#{root}dist/common/"
# src_common = "#{root}src/common/"

config =
    DEFAULT_TYPE: "pc"
    distTypeDir: ""
    # directory path
    path:
        "build" : build
        # document root
        "htdocs" : dist + "#{typeDist}/"
        # distribution
        "dist"   : dist + "#{typeDist}/"
        "css"    : dist + "#{typeDist}/css/"
        "js"     : dist + "#{typeDist}/js/"
        "image"  : dist + "#{typeDist}/img/"
        # sources
        "src"   : src
        "scss"   : src + "scss/"
        "coffee" : src + "coffee/"
        "jade"   : src + "jade/"
        "sprite" : src + "sprite/"
        "fonts"  : src + "fonts/"

        # "docs": src + "docs/'

    files:
        "static" : [
            src + "coffee/static/**/*.coffee"
        ],
        "lib"    : [
            src + "coffee/config.coffee",
            src + "coffee/utilities.coffee",
            src + "coffee/modules/**/*.coffee"
        ],
        "test"   : [
            'bower_components/eventemitter2/lib/eventemitter2.js',
            'bower_components/jquery/dist/jquery.js',

            'src/coffee/*.coffee',
            'src/coffee/modules/*.coffee',

            'spec/fixture/*.html'
            'spec/*.coffee'
        ]

    # entry point
    entry:
        "css"    : "style.css"
        "js"     : "staircase.js"
        "coffee" : "staircase.coffee"


    # after compile name
    name:
        "css" : "style.css"
        "js"  : "staircase.js"
        "min" : "staircase.min.js"

    # sass option
    sass:
        lib: "./src/scss/function.rb"

    # task configs
    autoprefixer: AUTOPREFIXER_BROWSERS
    modernizr:
        filename: "modernizr.min.js"
        options: [
            "setClasses",
            "addTest",
            "html5shiv",
            "testProp",
            "fnBind"
        ]
        tests: [
            "canvas",
            "filereader",
        ]

module.exports = config
