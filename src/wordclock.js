// (c) Murtuza Masalawala 11.6.2021
let version = '2.1.0'; // update version here.
var canvas, ctx;
var padx = pady = 20;
var cellw, cellh;

var loc = {
    longitude: 0,
    latitude: 0
};
var units = ['standard', 'metric', 'imperial'];
var weather = {
    temp: 0,
    tempMax: 0,
    tempMin: 0,
    mainCondition: '',
    iconCode: '',
    success: false,
    interval: 0,
    displayUnit: units[1],
    apikey: ('2a788854d783cfc339a7a43873885d39'), //this is Murtuza's API key.
    iconLink: "http://openweathermap.org/img/wn/"
};


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
var letterFontStyle, weatherFontStyle;
var theme = 'dark';

// get or set the Theme preference from cookie. 
if (getCookie('theme') != '') {
    theme = getCookie('theme');
} else {
    setCookie('theme', theme, 365);
}

// get or set the weather unit preference from cookie. 
if (getCookie('weatherunit') != '') {
    weather.displayUnit = getCookie('weatherunit');
} else {
    setCookie('weatherunit', weather.displayUnit, 365);
}

frameResize();

function goFullScreen() {
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


function clockAppearance() {
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

function setTime() {
    var d = new Date();
    if (weather.interval-- == 0) {
        weather.interval = 600; // reset to 10 minutes weather fetch interval
        getLocation(); // start to collect weather data
    }
    blackOut(); // blackout the panel

    var h = d.getHours() % 12;
    var m = d.getMinutes();

    if (h == 0) h = 12;
    if (m > 34) {
        if (m != 0) lightUp(panel.MTo);
        if (h == 12) h = 11;
        lightUp(panel["H" + (h + 1)]);
    } else {
        if (!(m >= 0 && m < 5)) lightUp(panel.MPast);
        lightUp(panel["H" + h]);
    }
    if (m >= 0 && m < 5) lightUp(panel.OClock);
    else if ((m >= 5 && m < 10) || m >= 55) lightUp(panel.MFive);
    else if ((m >= 10 && m < 15) || (m >= 50 && m < 55)) lightUp(panel.MTen);
    else if ((m >= 15 && m < 20) || (m >= 45 && m < 50)) lightUp(panel.MQuarter);
    else if ((m >= 20 && m < 25) || (m >= 40 && m < 45)) lightUp(panel.MTwenty);
    else if ((m >= 25 && m < 30) || (m >= 35 && m < 40)) {
        lightUp(panel.MTwenty);
        lightUp(panel.MFive);
    } else if (m >= 30 && m < 35) lightUp(panel.MHalf);

    setTimeout(setTime, 1000); //One second
}


function lightUp(pnl) {
    // Light up the letters with the glow color
    for (idx = pnl[0]; idx <= pnl[1]; idx++) {
        let x = (idx % 12) * cellw + padx;
        let y = (1 + Math.trunc(idx / 12)) * cellh + pady;
        ctx.fillStyle = glowColor;
        ctx.font = letterFontStyle;
        let z = (cellw - ctx.measureText(letter[idx]).width) / 2;
        ctx.fillText(letter[idx], x + z, y + cellh - 10);
    }
}

function frameResize() {
    goFullScreen();
    setCanvasSize();
    weather.interval = 0; // to ensure that on frameResize the weather data is also displayed.
    setTime();
}

function blackOut() {

    // draw board with numbers in idleColor
    let idx = 0;
    for (row = 1; row < 10; row++) {
        for (col = 0; col < 12; col++) {
            let x = col * cellw + padx;
            let y = row * cellh + pady;
            ctx.rect(x, y, cellw, cellh);
            ctx.font = letterFontStyle;
            let z = (cellw - ctx.measureText(letter[idx]).width) / 2;
            ctx.fillStyle = idleColor;
            if (idx < 5 && idx != 2) ctx.fillStyle = glowColor;
            ctx.fillText(letter[idx], x + z, y + cellh - 10);
            idx++;
        }
    }
    ctx.strokeStyle = gridColor;
    ctx.stroke();
}

function setCanvasSize() {
    clockAppearance(theme);
    canvas.style = 'background-color:' + gridColor;
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.canvas.height = document.documentElement.clientHeight;
    cellw = (ctx.canvas.width - 2 * padx) / 12;
    cellh = (ctx.canvas.height - 2 * pady) / 10;
    setFontSize();
}

function setFontSize() {
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
    } while (((cellw - w) < 40) && ((cellh - h) < 40)); //gap of 20 pixels on each side of the cell to fit and aesthetics
    letterFontStyle = tryFontStyle; //set the correct font style with size to fit for display
    weatherFontStyle = sz / (1.5) + 'px ' + letterFont;
}

function checkPointinWeatherPanel(x, y) {
    return (x >= 0 && x < cellw * 12 && y >= 0 && y <= cellh * 1); // check if x, y is in first row
}
canvas.onclick = function(event) {
    var boundingRect = canvas.getBoundingClientRect();
    // translate mouse event coordinates to canvas coordinates
    x = (event.clientX - boundingRect.left) * (canvas.width / boundingRect.width);
    y = (event.clientY - boundingRect.top) * (canvas.height / boundingRect.height);

    if (checkPointinWeatherPanel(x, y)) { // if user clicks/taps on the weather panel the unit toggles betweem metric and imperial.
        weather.displayUnit = weather.displayUnit == units[1] ? units[2] : units[1];
    } else {
        theme = theme == 'dark' ? 'light' : 'dark';
    }
    setCookie('theme', theme, 365);
    setCookie('weatherunit', weather.displayUnit, 365);
    frameResize();
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    loc.latitude = position.coords.latitude;
    loc.longitude = position.coords.longitude;
    getWeather(); // only get weather once location is determined. 
}

function getWeather() {

    var link = "https://api.openweathermap.org/data/2.5/weather?lat=" + loc.latitude + "&lon=" + loc.longitude + "&units=" + weather.displayUnit + "&apikey=" + weather.apikey;
    var request = new XMLHttpRequest();

    request.open('GET', link, true);
    request.onload = function() {
        var weatherData = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            weather.temp = Math.round(weatherData.main.temp);
            weather.tempMax = Math.round(weatherData.main.temp_max);
            weather.tempMin = Math.round(weatherData.main.temp_min);
            weather.mainCondition = weatherData.weather[0].main;
            weather.iconCode = weatherData.weather[0].icon;
            weather.success = true;
            displayWeather();
        } else weather.success = false;
    }
    request.send();
}

function displayWeather() {
    //display weather data in the first row
    // draw icon
    var img = new Image();
    img.onload = function() {
        let x = 0 * cellw + padx; // col 0
        let y = 0 * cellh + pady; // row 0
        let imgsz = cellw > cellh ? cellh : cellw;
        ctx.drawImage(img, x, y, imgsz, imgsz);
    };
    img.src = weather.iconLink + weather.iconCode + "@2x.png"; // the smallest icon size from openweather
    let degree = weather.displayUnit == units[1] ? '°C' : '°F'; // set C or F as per display unit preference

    // alert(weather.temp + " : " + weather.tempMax + " : " + weather.tempMin + " : " + weather.mainCondition + " : " + weather.iconCode);

    weather.mainCondition = weather.mainCondition.toUpperCase().padEnd(7).substring(0, 7); // limit the length to 7 or pad with space if less than 7
    let weatherData = [
        weather.temp + degree,
        '',
        weather.tempMax + '°h',
        weather.tempMin + '°l',
        weather.mainCondition.substring(0, 1),
        weather.mainCondition.substring(1, 2),
        weather.mainCondition.substring(2, 3),
        weather.mainCondition.substring(3, 4),
        weather.mainCondition.substring(4, 5),
        weather.mainCondition.substring(5, 6),
        weather.mainCondition.substring(6, 7)
    ];


    // draw weather panel in the first row
    let idx = 0;
    for (col = 1; col < 12; col++) { // first two cells are occupied by the icon. 
        x = col * cellw + padx;
        y = 0 * cellh + pady; //row 0

        ctx.rect(x, y, cellw, cellh);
        ctx.font = weatherFontStyle;
        let z = (cellw - ctx.measureText(weatherData[idx]).width) / 2;
        ctx.fillStyle = glowColor;
        ctx.fillText(weatherData[idx], x + z, y + cellh - 20);
        idx++;
    }

}