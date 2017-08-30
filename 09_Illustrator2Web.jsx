var doc = app.activeDocument; //ドキュメント
var obj = doc.pathItems; //ドキュメント上のオブジェクト
var sel = doc.selection; //選択しているテキストフレーム
var docWidth=round((doc.width),3);//ドキュメントの幅
var docHeight=round((doc.height),3);//ドキュメントの高さ

var divArray = []; //div用の配列
var posiXArray = []; //X座標用の配列
var posiYArray = []; //Y座標用の配列
var widArray = []; //幅用の配列
var heiArray = []; //高さの配列
var cssArray = []; //CSS用の配列


if(doc.documentColorSpace!=DocumentColorSpace.RGB){
    alert("ドキュメントのカラーモードがRGBではありません。\r\nRGBにしてください。");
    }


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
        var illGraDeg = round((processObj[i].fillColor.angle), 1); //Illustratorの角度
        var fixNum = 90; //Illustratorの角度と書き出されるCSSの結果の角度の和は常に90
        var cssGraDeg = ((illGraDeg + fixNum) - 180) * -1; //CSSへ書き出す角度の計算

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

        var fillResult = "background: linear-gradient(" + cssGraDeg + "deg," + graStoArr + ");";
        //グラデーションプロパティ

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