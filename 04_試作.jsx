var doc = app.activeDocument;
var obj = doc.pathItems;

var divArray = [];
var posiXArray=[];
var posiYArray=[];
var widArray=[];
var heiArray=[];
var cssArray=[];

for (var i = 0, objLen = obj.length; i < objLen; i++) {
    var docWidth = doc.width; //ドキュメントの幅
    var docHeight = doc.height; //ドキュメントの高さ
    
    var posiX = round(obj[i].position[0], 3); //X座標
    posiXArray.push(posiX);
    var minus = -1; //マイナス
    var posiY = round(obj[i].position[1] * minus, 3); //Y座標　負の値になるので-1を乗算
    posiYArray.push(posiY);
    var wid = round(obj[i].width, 3); //幅
     widArray.push(wid);
    var hei = round(obj[i].height, 3); //高さ
    heiArray.push(hei);

    var _div = "_div" + zeroPad([i + 1]);
    
    cssArray.push('.'+_div+'{left:'+posiXArray[i]+ 'px;top:' +posiYArray[i]+'px;width:'+widArray[i]+ 'px;height:'+heiArray[i]+ 'px;}');    
    
    var divTag='<div class="'+_div+'"></div>';
    divArray.push(divTag);

    }
var divArray = divArray.toString(); //HTMLタグ用配列を文字列に変換　※変数上書き
    var divArray = divArray.replace(/,/g, ""); //文字列化したCSVのカンマを削除
    var cssArray = cssArray.toString(); //HTMLタグ用配列を文字列に変換　※変数上書き
    var cssArray = cssArray.replace(/,/g, ""); //文字列化したCSVのカンマを削除

var htmlTag='<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>Document</title><style>div{position:absolute;background-color:red;}'+cssArray+'</style></head><body>'+divArray+'</body></html>';
alert(divArray);

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ファイル保存
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
(function saveFile() { //即時関数
    var inputFileName = File.saveDialog("保存先とファイル名を指定して下さい");
    if (inputFileName == null) { //キャンセル処理
        alert("キャンセルしました。");
        return;
    }

    var inputFileName = inputFileName.toString(); //ファイル名に拡張子がないときの処理
    var myNewText = inputFileName.match(/.html/); //拡張子".txt"を付与
    if (myNewText) {
        var inputFileName = inputFileName; //入力したファイル名に拡張子が含まれる場合はそのまま
    } else {
        var inputFileName = inputFileName + ".html"; //入力したファイル名に拡張子が含まれない場合は付与
    }

    var fileObj = new File(inputFileName); //ファイル名を入力して保存
    var inputFileName = fileObj.open("w");
    if (inputFileName == true) {
        fileObj.encoding = "UTF-8"; //UTF-8を指定。これを入れないと異体字依存で書き出されない場合がある。
        fileObj.writeln(htmlTag); //書き出すテキストを連結
        fileObj.close();
        alert("処理が終わりました。");
    }
}());