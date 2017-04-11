/*
仕様
選択している矩形から、グラデーションかベタ塗りかを取得。
未選択の場合、ドキュメント上の全てのフレームを処理する。
フレームは長方形ツールで作成されたPathItemに限る。
グラデーションポイントを含めカラーモードはRGBであること。
ベンダープレフィックスは -webkit- のみ付与する。

*/
var doc = app.activeDocument; //ドキュメント
var obj = doc.pathItems; //ドキュメント上のオブジェクト
var sel = doc.selection; //選択しているテキストフレーム

var docWidth = doc.width; //ドキュメントの幅
var docHeight = doc.height; //ドキュメントの高さ

var divArray = []; //div用の配列
var posiXArray = []; //X座標用の配列
var posiYArray = []; //Y座標用の配列
var widArray = []; //幅用の配列
var heiArray = []; //高さの配列
var cssArray = []; //CSS用の配列

if (sel.length == 0) {
    var processObj = obj; //フレームが未選択の場合、全てのフレームを対象にする
} else {
    var processObj = sel; //選択されている場合、選択されているフレームを対象にする
}

for (var i = 0, processObjLen = processObj.length; i < processObjLen; i++) {

    var graStoArr = []; //グラデーションポイント用の配列
    var graArray = []; //グラデーション用の配列
    var posiX = round(processObj[i].position[0], 3); //X座標
    posiXArray.push(posiX);
    var minus = -1; //マイナス
    var posiY = round(processObj[i].position[1] * minus, 3); //Y座標　負の値になるので-1を乗算
    posiYArray.push(posiY);
    var wid = round(processObj[i].width, 3); //幅
    widArray.push(wid);
    var hei = round(processObj[i].height, 3); //高さ
    heiArray.push(hei);

    var _div = "_div" + zeroPad([i + 1]); //セレクタ作成

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            塗り取得
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    if (processObj[i].fillColor.typename == "GradientColor") { //グラデーションの場合
        var graStoRedArr = []; //red配列
        var graStoGreenArr = []; //green配列
        var graStoBlueArr = []; //blue配列

        var graSto = processObj[i].fillColor.gradient.gradientStops; //グラデーションポイント
        var graDeg = round((processObj[i].fillColor.angle), 1); //角度

        for (var k = 0, graStoLen = graSto.length; k < graStoLen; k++) {
            var graStoRed = graSto[k].color.red;
            var graStoGreen = graSto[k].color.green;
            var graStoBlue = graSto[k].color.blue;
            graStoRedArr.push(graStoRed);
            graStoGreenArr.push(graStoGreen);
            graStoBlueArr.push(graStoBlue);
            var graStoRedResult = getColor(graStoRedArr[k]); //red
            var graStoGreenResult = getColor(graStoGreenArr[k]); //green
            var graStoBlueResult = getColor(graStoBlueArr[k]); //blue
            var graStoColResult = "#" + graStoRedResult + graStoGreenResult + graStoBlueResult; //カラーHEX値
            var myRampPoint = round((graSto[k].rampPoint), 2); //グラデーションスライダー
            var popGraResult = graStoColResult + " " + myRampPoint + "%";
            graStoArr.push(popGraResult);

        }

        var fillResult = "background: -webkit-linear-gradient(" + graDeg + "deg," + graStoArr + ");";
        //-webkit- のベンダープレフィックス付けないとグラデーションが反転する

    } else if (processObj[i].fillColor.typename == "RGBColor") { //単色の場合
        var redColor = getColor(processObj[i].fillColor.red);
        var greenColor = getColor(processObj[i].fillColor.green);
        var blueColor = getColor(processObj[i].fillColor.blue);
        var fillResult = 'background-color: #' + redColor + greenColor + blueColor;
    }

    cssArray.push('.' + _div + '{left:' + posiXArray[i] + 'px;top:' + posiYArray[i] + 'px;width:' + widArray[i] + 'px;height:' + heiArray[i] + 'px;' + fillResult + '}');

    var divTag = '<div class="' + _div + '"></div>';
    divArray.push(divTag);

}

var divArray = divArray.toString(); //div用配列を文字列に変換　※変数上書き
var divArray = divArray.replace(/,/g, ""); //文字列化したCSVのカンマを削除
var cssArray = cssArray.toString(); //CSS用配列を文字列に変換　※変数上書き
var cssArray = cssArray.replace(/},./g, "}."); //文字列化したCSVのカンマを削除

var htmlTag = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>Document</title><style>div{position:absolute;}' + cssArray + '</style></head><body>' + divArray + '</body></html>';
//alert(divArray);

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

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       関数定義
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function zeroPad(myNum) { //ゼロパディング
    var myNum = ("00" + myNum).slice(-2);
    return myNum;
}

function round(number, n) { //四捨五入
    var myPow = Math.pow(10, n);
    return Math.round(number * myPow) / myPow;
}

function getColor(_color) { //取得した色値をHEX値、大文字、ゼロパディング
    var _color = zeroPad(_color.toString(16).toUpperCase());
    return _color;
}
