#target illustrator-22
#targetengine main

/*//////////////////////////////////////////////////  変数定義  ////////////////////////////////////////////////////////////////////*/
var doc = app.activeDocument; //ドキュメント

/*/////////////////////////////////////////////// 入力ダイアログ表示 ////////////////////////////////////////////////////////*/
win = new Window("palette", "指定行数に長体処理", [200, 150, 350, 300]);
var para01Btn = win.add("button", [10, 10, 70, 30], "１行");
var para02Btn = win.add("button", [10, 35, 70, 55], "２行");
var para03Btn = win.add("button", [10, 60, 70, 80], "３行");
var para04Btn = win.add("button", [75, 10, 135, 30], "４行");
var para05Btn = win.add("button", [75, 35, 135, 55], "５行");
var para06Btn = win.add("button", [75, 60, 135, 80], "６行");
var unDoBtn = win.add("button", [10, 90, 70, 110], "取り消し");
var reDoBtn = win.add("button", [75, 90, 135, 110], "やり直し");
var cancelBtn = win.add("button", [10, 120, 135, 140], "キャンセル");

win.show(); //ウィンドウを表示
win.center(); //センターに表示  

/*//////////////////////////////////////////////////////////// 関数 //////////////////////////////////////////////////////////////*/
//▼1～6行のボタンが押されたとき
para01Btn.onClick = function () { //1行
    num = 1;
    btProcess();
};

para02Btn.onClick = function () { //2
    num = 2;
    btProcess();
};

para03Btn.onClick = function () { //3行
    num = 3;
    btProcess();
};

para04Btn.onClick = function () { //4行
    num = 4;
    btProcess();
};

para05Btn.onClick = function () { //5行
    num = 5;
    btProcess();
};

para06Btn.onClick = function () { //6行
    num = 6;
    btProcess();
};

//▼取り消しボタンが押されたとき
unDoBtn.onClick = function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator-22";
    bridgeTalk.body = "undo();"
    bridgeTalk.send();
};

//▼やり直しボタンが押されたとき
reDoBtn.onClick = function () {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator-22";
    bridgeTalk.body = "redo();"
    bridgeTalk.send();
};

//▼キャンセルボタンが押されたとき
cancelBtn.onClick = function () {
    win.close();
};

//▼長体処理関数　BridgeTalk
function btProcess() {
    var bridgeTalk = new BridgeTalk(); //BridgeTalkを使用
    bridgeTalk.target = "illustrator-22";
    bridgeTalk.body = "setBtnValue(num);"
    bridgeTalk.send();
}

//▼行数を指定する関数
function setBtnValue(num) {
    var sel=doc.selection;
    var paraLen = doc.selection.paragraphs.length; //選択している段落数
    //▼エラー処理
    if (paraLen > 1) {
        alert("選択している文字が段落に跨ってます。\r\nご確認ください。");
        return;
    }
    while (sel.lines.length > num) { //指定した行数になるまで-1づつ長体をかける
        sel.horizontalScale -= 0.1;
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
