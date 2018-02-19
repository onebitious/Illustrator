//#target illustrator
//#targetengine mainProcess
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    入力ダイアログ表示
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
win = new Window("palette", "ランダムに着色", [200, 150, 480, 300]);
win.add("statictext", [10, 15, 200, 30], "対象を選んでください。");
var fillValue = win.add("radiobutton", [30, 40, 100, 60], "塗り");
fillValue.value = true;
fillValue.active = true;
var strokeValue = win.add("radiobutton", [110, 40, 180, 60], "線");
var bothVlaue = win.add("radiobutton", [180, 40, 250, 60], "塗りと線");
var strokeThinBtn = win.add("button", [110, 65, 170, 85], "線を細く");
var strokeThickBtn = win.add("button", [180, 65, 250, 85], "線を太く");
var cancelBtn = win.add("button", [60, 100, 140, 125], "閉じる");
var okBtn = win.add("button", [150, 100, 220, 125], "色を変える");
okBtn.active = true;
win.show();
win.center();

//▼「色を変える」ボタン
okBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk;
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "applyColor();";
    bridgeTalk.send();
}, false);

//▼「閉じる」ボタン
cancelBtn.addEventListener('click', function () {
    win.close();
}, false);

//▼「線を細く」ボタン
strokeThinBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalk
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "dec();";
    bridgeTalk.send();
}, false);

//▼「線を太く」ボタン
strokeThickBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalk
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "inc();";
    bridgeTalk.send();
}, false);

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    関数
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//▼線幅を減らす関数
function dec() {
    for (var i = 0, objLen = obj.length; i < objLen; i++) {
        obj[i].strokeWidth -= 1;
    }
}

//▼線幅を増やす関数
function inc() {
    for (var j = 0, objLen = obj.length; j < objLen; j++) {
        obj[j].strokeWidth += 1;
    }
}

//▼ランダム配色する関数
function applyColor() {
    var doc = app.activeDocument; //ドキュメント
    var colSP = doc.documentColorSpace; //カラースペース
    var obj = doc.pathItems; //オブジェクトの数
    //var sel=doc.selection;

    var colorMin = 0; //最小値
    var colorArray01 = []; //カラー値用の配列01
    var colorArray02 = []; //カラー値用の配列02

    if (colSP == "DocumentColorSpace.CMYK") { //CMYKの場合
        flag = true;
        var colorMax = 100; //最大値は100
        var colorLength = 4; //色数は4
        //alert("CMYK");
    } else { //RGBの場合
        flag = false;
        var colorMax = 255; //最大値は255
        var colorLength = 3; //色数は3
        //alert("RGB");
    }

    for (var k = 0, objLength = obj.length; k < objLength; k++) { //オブジェクトの数だけ繰り返す
        for (var l = 0; l < colorLength; l++) { //色数だけ繰り返す
            var ranNum01 = Math.floor(Math.random() * (colorMax + 1 - colorMin)) + colorMin; //ランダムな数値を得る01
            var ranNum02 = Math.floor(Math.random() * (colorMax + 1 - colorMin)) + colorMin; //ランダムな数値を得る02
            colorArray01.push(ranNum01); //配列に追加01
            colorArray02.push(ranNum02); //配列に追加02
        }

        //▼塗りの場合
        if (fillValue.value == true) {
            if (flag == true) { //CMYKの場合
                obj[k].fillColor.cyan = colorArray01[k + 0];
                obj[k].fillColor.magenta = colorArray01[k + 1];
                obj[k].fillColor.yellow = colorArray01[k + 2];
                obj[k].fillColor.black = colorArray01[k + 3];
            } else { //RGBの場合
                obj[k].fillColor.red = colorArray01[k + 0];
                obj[k].fillColor.green = colorArray01[k + 1];
                obj[k].fillColor.blue = colorArray01[k + 2];
            }
            //▼線の場合
        } else if (strokeValue.value == true) {
            if (flag == true) { //CMYKの場合
                obj[k].strokeColor.cyan = colorArray02[k + 0];
                obj[k].strokeColor.magenta = colorArray02[k + 1];
                obj[k].strokeColor.yellow = colorArray02[k + 2];
                obj[k].strokeColor.black = colorArray02[k + 3];
            } else { //RGBの場合
                obj[k].strokeColor.red = colorArray02[k + 0];
                obj[k].strokeColor.green = colorArray02[k + 1];
                obj[k].strokeColor.blue = colorArray02[k + 2];
            }
            //▼塗りと線の場合
        } else {
            if (flag == true) { //CMYKの場合
                obj[k].fillColor.cyan = colorArray01[k + 0];
                obj[k].fillColor.magenta = colorArray01[k + 1];
                obj[k].fillColor.yellow = colorArray01[k + 2];
                obj[k].fillColor.black = colorArray01[k + 3];
                obj[k].strokeColor.cyan = colorArray02[k + 0];
                obj[k].strokeColor.magenta = colorArray02[k + 1];
                obj[k].strokeColor.yellow = colorArray02[k + 2];
                obj[k].strokeColor.black = colorArray02[k + 3];
            } else { //RGBの場合
                obj[k].fillColor.red = colorArray01[k + 0];
                obj[k].fillColor.green = colorArray01[k + 1];
                obj[k].fillColor.blue = colorArray01[k + 2];
                obj[k].strokeColor.red = colorArray02[k + 0];
                obj[k].strokeColor.green = colorArray02[k + 1];
                obj[k].strokeColor.blue = colorArray02[k + 2];
            }
        }
    }
}
