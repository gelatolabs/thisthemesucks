/*
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (c) 2016 Kyle Farwell <m@kfarwell.org>
 * Copyright (c) 2016 Keefer Rourke <keefer.rourke@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for
 * any purpose with or without fee is hereby granted, provided that the
 * above copyright notice and this permission notice appear in all
 * copies.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

/* fit canvas to window */
var sizeCanvas = function() {
    if (window.innerWidth / 1.33 <= window.innerHeight) {
        /* fit width if the whole 1.33:1 (4:3) canvas will fit */
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth / 1.33;
    } else {
        /* else fit height */
        canvas.width = window.innerHeight * 1.33;
        canvas.height = window.innerHeight;
    }
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
};

/* create canvas */
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.style.position = "absolute";
sizeCanvas();
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
document.body.appendChild(canvas);

/* game object definitions */
var bg = {
    w: canvas.width,
    h: canvas.height,
    x: 0,
    y: 0,

    ready: false
};
bg.img = new Image();
bg.img.onload = function() {
    bg.ready = true;
}
bg.img.src = "img/bg.png";

var walls = [
    {
        w: canvas.width * 0.0225,
        h: canvas.width * 0.3225,
        x: canvas.width * 0.75,
        y: canvas.width * 0.1875
    },
    {
        w: canvas.width * 0.5,
        h: canvas.width * 0.0225,
        x: canvas.width * 0.25,
        y: canvas.width * 0.51
    },
    {
        w: canvas.width * 0.0225,
        h: canvas.width * 0.3225,
        x: canvas.width * 0.2275,
        y: canvas.width * 0.1875
    }
];

var room = {
    w: canvas.width * 0.5,
    h: canvas.width * 0.3225,
    x: canvas.width * 0.25,
    y: canvas.width * 0.1875
};

var dude = { ready: false };
dude.img = new Image();
dude.img.onload = function() {
    dude.ready = true;
}
dude.img.src = "img/dude.png";

var dudes = [];

/* useful functions */
var pointOver = function(p, a) {
    return (p.x >= a.x && p.x <= (a.x + a.w) && p.y >= a.y && p.y <= (a.y + a.h));
};

var touching = function(a, b) {
    return a.x + a.w > b.x && a.x < b.x + b.w &&
           a.y + a.h > b.y && a.y < b.y + b.h;
};

var resetDudes = function() {
    for(var i = 0; i < 38; i++) {
        dudes.push({
            w: canvas.width * 0.05,
            h: canvas.width * 0.075,
            x: 0 - canvas.width * 0.5 * i,
            y: canvas.width * 0.675,

            dragging: false
        });
    }
};

/* real events */
canvas.addEventListener('mousedown', function(evt) {
    var m = {
        x: evt.pageX - canvas.offsetLeft,
        y: evt.pageY - canvas.offsetTop
    };

    for(var i = 0; i < dudes.length; i++)
        if(pointOver(m, dudes[i]) && dudes[i].y == canvas.width * 0.675)
            dudes[i].dragging = true;
});

canvas.addEventListener('mousemove', function(evt) {
    var m = {
        x: evt.pageX - canvas.offsetLeft,
        y: evt.pageY - canvas.offsetTop
    };

    for(var i = 0; i < dudes.length; i++)
        if(dudes[i].dragging) {
            dudes[i].x = m.x - dudes[i].w / 2;
            dudes[i].y = m.y;

            for(var j = 0; j < walls.length; j++)
                if(touching(dudes[i], walls[j]))
                    alert("you suck");
        }
});

canvas.addEventListener('mouseup', function(evt) {
    var m = {
        x: evt.pageX - canvas.offsetLeft,
        y: evt.pageY - canvas.offsetTop
    };

    for(var i = 0; i < dudes.length; i++)
        if(dudes[i].dragging) {
            dudes[i].dragging = false;
            if(!touching(dudes[i], room))
                dudes[i].x = bg.w;
        }
});

var render = function() {
    if(bg.ready)
        ctx.drawImage(bg.img, bg.x, bg.y, bg.w, bg.h);
    for(var i = 0; i < dudes.length; i++)
        if(dudes[i].x > 0 && dudes[i].x < bg.w && dude.ready)
            ctx.drawImage(dude.img, dudes[i].x, dudes[i].y, dudes[i].w, dudes[i].h);
};

/* main game loop */
var main = function() {
    render();
    requestAnimationFrame(main);
};

/* make requestAnimationFrame work in stupid browsers (all of them) */
var w = window;
requestAnimationFrame =
        w.requestAnimationFrame
        || w.webkitRequestAnimationFrame
        || w.msRequestAnimationFrame
        || w.mozRequestAnimationFrame;

/* start game */
resetDudes();
render();
requestAnimationFrame(main);
main();

setInterval(function() {
    for(var i = 0; i < dudes.length; i++)
        if(!dudes[i].dragging && dudes[i].y == canvas.width * 0.675 && dudes[i].x <= bg.w)
            dudes[i].x += dudes[i].w;
}, 250);
