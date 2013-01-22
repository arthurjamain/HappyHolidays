#!/bin/zsh

alias yui="java -jar ~/Tools/yuicompressor-2.4.7.jar "

yui src/app.nocanvas.js -o src/app.nocanvas.optimized.js
yui src/app.canvas.js -o src/app.canvas.optimized.js
yui src/main.js -o src/main.optimized.js

yui css/style.css -o src/style.min.css
