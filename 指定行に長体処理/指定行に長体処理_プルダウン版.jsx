//#target illustrator
//#targetengine mainProcess

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    変数定義
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
var doc = app.activeDocument; //ドキュメント

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    入力ダイアログ表示
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
win = new Window("palette", "行数指定", [200, 150, 380, 310]);
win.add("statictext", [10, 0, 200, 55], "文字を選択して\r\n行数を指定してください。");
var linesValue = win.add("dropdownlist", [10, 60, 80, 75], ["1 行", "2 行", "3 行", "4 行", "5 行"]);
linesValue.selection = 0;
var okBtn = win.add("button", [100, 60, 170, 80], "OK");
var unDoBtn = win.add("button", [100, 90, 170, 110], "取り消し");
var reDoBtn = win.add("button", [100, 120, 170, 140], "やり直し");
var cancelBtn = win.add("button", [10, 120, 90, 140], "キャンセル");
okBtn.active = true;
win.show(); //ウィンドウを表示
win.center(); //センターに表示

//▼OKボタン
okBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "setLinesValue();"
    bridgeTalk.send();
}, false);

//▼取り消し
unDoBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "doUnDo();"
    bridgeTalk.send();
}, false);

//▼やり直し
reDoBtn.addEventListener('click', function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator";
    bridgeTalk.body = "doReDo();"
    bridgeTalk.send();
}, false);

//▼キャンセルボタン
cancelBtn.addEventListener('click', function () {
    win.close();
}, false);

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    関数
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//▼行数を指定する関数
function setLinesValue() {
    var sel = doc.selection; //選択
    if (linesValue.selection == 0) { //switch文にできなかった。。。
        var linesLen = 1;
    } else if (linesValue.selection == 1) {
        var linesLen = 2;
    } else if (linesValue.selection == 2) {
        var linesLen = 3;
    } else if (linesValue.selection == 3) {
        var linesLen = 4;
    } else if (linesValue.selection == 4) {
        var linesLen = 5;
    }
    while (sel.lines.length > linesLen) { //指定した行数になるまで-1づつ長体をかける
        sel.horizontalScale -= 1;
    }
}

//▼取り消し関数
function doUnDo() {
    undo();
}

//▼やり直し関数
function doReDo() {
    redo();
}
