/*windows 10
Illustrator CC 2017(21.0.2)
Chrome 56.0.2924.87
Firefox 51.0.1
Opera 43.0.2442.1144
Microsoft Edge 38.14393.0.0
Internet Explorer 11.576.14393.0　→ ×
*/

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
変数定義とエラー処理
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
var doc = app.activeDocument; //ドキュメント
var sel = doc.selection; //選択しているテキストフレーム

var graStoArr = []; //配列を作成

MAIN: { //ラベル
    //▼選択している文字を取得
    try {
        if (sel[0].constructor.name != "PathItem") {
            alert("グラデーションのシェイプを1つ選択してください。");
            break MAIN; //ここがうまくいかない
        }
    } catch (e) {
        alert("グラデーションのシェイプを1つ選択してください。");
        break MAIN;
    }
    var posiX = round(sel[0].position[0], 3); //X座標
    var minus = -1; //マイナス
    var posiY = round(sel[0].position[1] * minus, 3); //Y座標　負の値になるので-1を乗算
    var wid = round(sel[0].width, 3); //幅
    var hei = round(sel[0].height, 3); //高さ

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

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           ダイアログ表示とタグ、セレクタ取得
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    //▼入力ダイアログ表示
    var tagFlag = false; //フラグの初期化
    var textFlag = true;
    while (tagFlag == false) { //タグが未選択の場合繰り返す
        var myWin = new Window('dialog', '諸設定', [800, 500, 1025, 730]);
        myWin.elementText = myWin.add("statictext", [10, 10, 450, 30], "矩形か楕円か選択してください。"); //固定テキスト
        myWin.squBtn = myWin.add("radiobutton", [10, 35, 85, 65], "矩形");
        myWin.ovalBtn = myWin.add("radiobutton", [105, 35, 205, 65], "楕円");
        myWin.attriTxt = myWin.add("statictext", [10, 70, 275, 100], "属性名を選択してください。"); //固定テキスト
        myWin.dropdownList = myWin.add("dropdownlist", [10, 100, 200, 120], ["id セレクタ", "class セレクタ", ""]);
        myWin.dropdownList.selection = 0; //デフォルト表示は一番上のもの
        myWin.attriValTxt = myWin.add("statictext", [10, 150, 275, 170], "属性値を入力してください。"); //固定テキスト
        myWin.editText = myWin.add("edittext", [10, 170, 200, 190], "", {
            readonly: false
        }); //id、classセレクタだったら入力できる
        myWin.dropdownList.onChange = function () {
            if (myWin.dropdownList.selection == 2) {
                myWin.editText = myWin.add("edittext", [10, 170, 200, 190], "※属性名空欄時は入力不可", {
                    readonly: true
                }); //入力できなくする
                textFlag = false; //フラグ
            } else {
                myWin.editText = myWin.add("edittext", [10, 170, 200, 190], "", {
                    readonly: false
                }); //id、classセレクタだったら入力できる
            }
        }

        myWin.okBtn = myWin.add("button", [20, 200, 100, 220], "OK", {
            name: "ok"
        });
        myWin.cancelBottom = myWin.add("button", [120, 200, 200, 220], "キャンセル", {
            name: "cancel"
        });

        var bottomFlag = myWin.show(); //ダイアログを表示し、OK、キャンセルボタンの結果を取得

        if (bottomFlag == 2) { //キャンセルの場合処理を抜ける
            alert("キャンセルしました。");
            break MAIN;
        }
        var squBtnResult = myWin.squBtn.value; //矩形ボタン押下時true
        var obalBtnResult = myWin.ovalBtn.value; //楕円ボタン押下時true
        var dropDownListResult = myWin.dropdownList.selection.text; //ドロップダウンリストから選択したセレクタ名が返る

        var mySelName = myWin.editText.text; //入力したテキストが返る

        /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               タグ、セレクタの設定
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
        //▼セレクタ名の設定
        if (textFlag == false) {
            var selNameResult = "";
        } else if (mySelName == "") {
            var selNameResult = '="○○○○●"';
            var mySelName = '○○○○●';
        } else {
            var selNameResult = '="' + mySelName + '"';
        }

        //▼セレクタの設定
        if (dropDownListResult == "id セレクタ") {
            var selResult = "id";
            var chiceSelector = "#" + mySelName;
        } else if (dropDownListResult == "class セレクタ") {
            var selResult = "class";
            var chiceSelector = "." + mySelName;
        } else {
            var selResult = "";
        }

        //▼タグの設定
        if (squBtnResult == true) {
            var tag = "<div" + " " + selResult + selNameResult + "></div>";
            var CSSgraType = "";
            var tagFlag = true; //フラグ
        } else if (obalBtnResult == true) {
            var tag = "<div" + " " + selResult + selNameResult + "></div>";
            var CSSgraType = "border-radius:" + wid / 2 + "px /" + hei / 2 + "px;";
            var tagFlag = true; //フラグ
        } else if (squBtnResult == false && obalBtnResult == false) {
            alert("形状が選択されていません。");
            var tagFlag = false; //フラグ
        }
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           グラデーション取得
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    var graStoRedArr = []; //red配列
    var graStoGreenArr = []; //green配列
    var graStoBlueArr = []; //blue配列

    if (sel[0].fillColor.typename == "GradientColor") {
        var graSto = sel[0].fillColor.gradient.gradientStops; //グラデーションポイント
        var graDeg = round((sel[0].fillColor.angle), 1); //角度
        for (var i = 0, graStoLen = graSto.length; i < graStoLen; i++) {
            var graStoRed = graSto[i].color.red;
            var graStoGreen = graSto[i].color.green;
            var graStoBlue = graSto[i].color.blue;
            graStoRedArr.push(graStoRed);
            graStoGreenArr.push(graStoGreen);
            graStoBlueArr.push(graStoBlue);
            var graStoRedResult = graStoRedArr[i].toString(16).toUpperCase();
            var graStoRedResult = zeroPad(graStoRedResult); //red
            var graStoGreenResult = graStoGreenArr[i].toString(16).toUpperCase();
            var graStoGreenResult = zeroPad(graStoGreenResult); //green
            var graStoBlueResult = graStoBlueArr[i].toString(16).toUpperCase();
            var graStoBlueResult = zeroPad(graStoBlueResult); //blue
            var graStoColResult = "#" + graStoRedResult + graStoGreenResult + graStoBlueResult;
            var myRampPoint = round((graSto[i].rampPoint), 2); //グラデーションスライダー
            var popGraResult = graStoColResult + " " + myRampPoint + "%";
            graStoArr.push(popGraResult);
        }
        var graType = sel[0].fillColor.gradient.type; //種類
        if (graType == GradientType.LINEAR) {
            var graType = "linear";
            var fillResult = "background: -webkit-" + graType + "-gradient(" + graDeg + "deg," + graStoArr + ");"; //ベンダープレフィックス付けないとグラデーションが反転する
        } else {
            var graType = "radial";
            var fillResult = "background: -webkit-" + graType + "-gradient(circle closest-side," + graStoArr + ");";
        }
    }

    //▼CSSに書き出す
    if (textFlag == false) {
        //▼セレクタがない場合
        var selResult = 'div' + '{position:absolute;left:' + posiX + 'px;top:' + posiY + 'px;width:' + wid + 'px;height:' + hei + 'px;' + fillResult + CSSgraType + '}';
    } else {
        //▼セレクタがある場合       
        var selResult = chiceSelector + '{position:absolute;left:' + posiX + 'px;top:' + posiY + 'px;width:' + wid + 'px;height:' + hei + 'px;' + fillResult + CSSgraType + '}';
    }

    var htmlTag = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>Document</title><style>*{margin:0;padding:0;}' + selResult + '</style></head><body>' + tag + '</body></html>';

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
}