var doc = app.activeDocument;
var obj = doc.pathItems;

var graStoArr = []; //配列を作成
var rectArray = [];

for (var i = 0, objLen = obj.length; i < objLen; i++) {
    var docWidth = doc.width; //ドキュメントの幅
    var docHeight = doc.height; //ドキュメントの高さ
    var posiX = round(obj[i].position[0], 3); //X座標
    var minus = -1; //マイナス
    var posiY = round(obj[i].position[1] * minus, 3); //Y座標　負の値になるので-1を乗算
    var wid = round(obj[i].width, 3); //幅
    var hei = round(obj[i].height, 3); //高さ

    var _rect = "_div" + zeroPad([i + 1]);
    rectArray.push(_rect);
    // alert(_rect);


    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            グラデーション取得
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    var graStoRedArr = []; //red配列
    var graStoGreenArr = []; //green配列
    var graStoBlueArr = []; //blue配列
    
    var graSto = obj[i].fillColor.gradient.gradientStops; //グラデーションポイント
    var graDeg = round((obj[i].fillColor.angle), 1); //角度
    for (var k = 0, graStoLen = graSto.length; k < graStoLen; k++) {
        var graStoRed = graSto[k].color.red;
        var graStoGreen = graSto[k].color.green;
        var graStoBlue = graSto[k].color.blue;
        graStoRedArr.push(graStoRed);
        graStoGreenArr.push(graStoGreen);
        graStoBlueArr.push(graStoBlue);
        var graStoRedResult = graStoRedArr[i]; //red
        var graStoGreenResult = graStoGreenArr[i]; //green
        var graStoBlueResult = graStoBlueArr[i]; //blue
        var graStoColResult = "#" + graStoRedResult + graStoGreenResult + graStoBlueResult; //カラーHEX値
        var myRampPoint = round((graSto[k].rampPoint), 2); //グラデーションスライダー
        var popGraResult = graStoColResult + " " + myRampPoint + "%";
        graStoArr.push(popGraResult);
    }

    var fillResult = "background: -webkit- linear-gradient(" + graDeg + "deg," + graStoArr + ");"; //ベンダープレフィックス付けないとグラデーションが反転する
    //return fillResult;



    //▼CSSに書き出す

    var selResult = '{position:absolute;left:' + posiX + 'px;top:' + posiY + 'px;width:' + wid + 'px;height:' + hei + 'px;' + fillResult + '}';
}

var htmlTag = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>Document</title><style>*{margin:0;padding:0;}' + selResult + '</style></head><body>' + rectArray + '</body></html>';

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
