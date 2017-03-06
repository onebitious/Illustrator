var sel = app.activeDocument.selection;
var color = sel[0].fillColor;

var red = color.red; //red
var green = green = color.green; //green
var blue = color.blue; //blue

var redColor = getColor(red);
var greenColor = getColor(green);
var blueColor = getColor(blue);

var myColor = "#" + redColor + greenColor + blueColor; //HEX値
alert(myColor);

//▼関数定義
function getColor(_color) { //取得した色値をHEX値、大文字、ゼロパディング
    var _color = zeroPad(_color.toString(16).toUpperCase());
    return _color;
}

function zeroPad(myNum) { //ゼロパディング
    var myNum = ("00" + myNum).slice(-2);
    return myNum;
}

function round(number, n) { //四捨五入
    var myPow = Math.pow(10, n);
    return Math.round(number * myPow) / myPow;
}