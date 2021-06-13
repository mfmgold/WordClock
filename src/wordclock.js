// (c) Murtuza Masalawala 11.6.2021
let version = '2.0.2'; // update version here.
var canvas, ctx;
var padx = pady = 30;
var cellw, cellh;

//var letter = ['I', 'T', 'T', 'I', 'S ', 'I', 'T', 'W', 'E', 'N', 'T', 'Y', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'H', 'A', 'L', 'F', 'M', 'T', 'E', 'N', 'F', 'I', 'V', 'E', 'E', 'P', 'A', 'S', 'T', 'T', 'O', 'A', 'T', 'W', 'E', 'L', 'V', 'E', 'O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E', 'F', 'O', 'U', 'R', 'F ', 'I', 'V', 'E', 'S', 'I', 'X', 'S', 'E', 'V', 'E', 'N', 'E', 'I', 'G', 'H', 'T', 'N', 'I', 'N', 'E', 'T', 'E', 'N', 'E', 'L', 'E', 'V', 'E', 'N', 'N', 'D', 'D', 'A', 'T', 'E', 'O', "'", 'C', 'L', 'O', 'C', 'K', 'T', 'I', 'M', 'E', 'A'];

var letter = ['I', 'T', 'T', 'I', 'S ', 'I', 'T', 'W', 'E', 'N', 'T', 'Y', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'H', 'A', 'L', 'F', 'M', 'T', 'E', 'N', 'F', 'I', 'V', 'E', 'E', 'P', 'A', 'S', 'T', 'T', 'O', 'A', 'T', 'W', 'E', 'L', 'V', 'E', 'O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E', 'F', 'O', 'U', 'R', 'F ', 'I', 'V', 'E', 'S', 'I', 'X', 'S', 'E', 'V', 'E', 'N', 'E', 'I', 'G', 'H', 'T', 'N', 'I', 'N', 'E', 'T', 'E', 'N', 'E', 'L', 'E', 'V', 'E', 'N', 'N', 'D', 'D', 'A', 'T', 'E', 'O', "'", 'C', 'L', 'O', 'C', 'K', 'T', 'I', 'M', 'E', 'A'];
var panel = {
    MTwenty: [6, 11],
    MQuarter: [12, 18],
    MHalf: [19, 22],
    MTen: [24, 26],
    MFive: [27, 30],
    MPast: [32, 35],
    MTo: [36, 37],
    H12: [39, 44],
    H1: [45, 47],
    H2: [48, 50],
    H3: [51, 55],
    H4: [56, 59],
    H5: [60, 63],
    H6: [64, 66],
    H7: [67, 71],
    H8: [72, 76],
    H9: [77, 80],
    H10: [81, 83],
    H11: [84, 89],
    OClock: [96, 102]
};

canvas = document.getElementById('myCanvas');
ctx = canvas.getContext('2d');
var glowColor, idleColor, gridColor;
var letterFont = 'Arial';
var letterFontStyle;
var theme = 'dark';

if (getCookie('theme') != '') {
    theme = getCookie('theme');
} else {
    setCookie('theme', theme, 365);
}

Resize();

function FullScreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}


function Appearance() {

    if (theme == 'dark') { //dark time
        glowColor = 'yellow';
        idleColor = '#333333';
        gridColor = '#080808';

    } else { //light time
        glowColor = 'red';
        idleColor = 'lightgrey';
        gridColor = 'white';

    }

}

function SetTime() {
    var d = new Date();

    BlackOut(); // blackout the panel
    var h = d.getHours() % 12;
    var m = d.getMinutes();

    if (h == 0) h = 12;
    if (m > 34) {
        if (m != 0) LightUp(panel.MTo);
        if (h == 12) h = 11;
        LightUp(panel["H" + (h + 1)]);
    } else {
        if (!(m >= 0 && m < 5)) LightUp(panel.MPast);
        LightUp(panel["H" + h]);
    }
    if (m >= 0 && m < 5) LightUp(panel.OClock);
    else if ((m >= 5 && m < 10) || m >= 55) LightUp(panel.MFive);
    else if ((m >= 10 && m < 15) || (m >= 50 && m < 55)) LightUp(panel.MTen);
    else if ((m >= 15 && m < 20) || (m >= 45 && m < 50)) LightUp(panel.MQuarter);
    else if ((m >= 20 && m < 25) || (m >= 40 && m < 45)) LightUp(panel.MTwenty);
    else if ((m >= 25 && m < 30) || (m >= 35 && m < 40)) {
        LightUp(panel.MTwenty);
        LightUp(panel.MFive);
    } else if (m >= 30 && m < 35) LightUp(panel.MHalf);
    setTimeout(SetTime, 1000); //One second
}

function LightUp(pnl) {
    // Light up the letters with the glow color
    for (idx = pnl[0]; idx <= pnl[1]; idx++) {
        let x = (idx % 12) * cellw + padx;
        let y = Math.trunc(idx / 12) * cellh + pady;
        ctx.fillStyle = glowColor;
        ctx.font = letterFontStyle;
        let z = (cellw - ctx.measureText(letter[idx]).width) / 2;
        ctx.fillText(letter[idx], x + z, y + cellh - 15);
    }
}

function Resize() {
    FullScreen();
    SetCanvasSize();
    SetTime();
}

function BlackOut() {
    // draw board with numbers in idleColor
    let idx = 0;
    for (row = 0; row < 9; row++) {
        for (col = 0; col < 12; col++) {
            let x = col * cellw + padx;
            let y = row * cellh + pady;
            ctx.rect(x, y, cellw, cellh);
            ctx.font = letterFontStyle;
            let z = (cellw - ctx.measureText(letter[idx]).width) / 2;
            ctx.fillStyle = idleColor;
            if (idx < 5 && idx != 2) ctx.fillStyle = glowColor;
            ctx.fillText(letter[idx], x + z, y + cellh - 15);
            idx++;
        }
    }
    ctx.strokeStyle = gridColor;
    ctx.stroke();
}

function SetCanvasSize() {
    Appearance(theme);
    canvas.style = 'background-color:' + gridColor;
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.canvas.height = document.documentElement.clientHeight;
    cellw = (ctx.canvas.width - 2 * padx) / 12;
    cellh = (ctx.canvas.height - 2 * pady) / 9;
    SetFontSize();
}

function SetFontSize() {
    let sz = 200;
    let w, h, metrics;
    let tryFontStyle;
    do {
        sz -= 2;
        tryFontStyle = sz + 'px ' + letterFont;
        ctx.font = tryFontStyle;
        metrics = ctx.measureText('W');
        w = Math.trunc(metrics.width);
        h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    } while (((cellw - w) < 40) && ((cellh - h) < 40)); //gap of 5 pixels on each side of the cell to fit and aesthetics
    letterFontStyle = tryFontStyle; //set the correct font style with size to fit for display
}

canvas.onclick = function(event) {
    theme = theme == 'dark' ? 'light' : 'dark';
    setCookie('theme', theme, 365);
    Resize();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}