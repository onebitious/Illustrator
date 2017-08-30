/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
変数定義とエラー処理
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
var myDoc = app.activeDocument; //ドキュメント
var mySel = myDoc.selection; //選択しているテキストフレーム

MAIN: {
    try { //エラー処理
        if (mySel.length == 0 || mySel.constructor.name == "TextRange") {
            alert("テキストフレームを選択してください。");
            break MAIN;
        }
    } catch (e) {
        break MAIN;
    }

    var myPara = myDoc.selection[0].paragraphs; //選択しているフレームの段落スタイル
    var myParaStyle = myDoc.paragraphStyles; //ドキュメントの段落スタイル

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       配列定義
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    var myHTMLArray = []; //HTMLタグ用配列
    var myCSSArray = []; //CSS用配列
    var myPropArray = []; //CSSプロパティ用配列
    var mySizeArray = []; //サイズ用配列
    var myFontFamilyArray = []; //フォントファミリー用配列
    var myFontWeightArray = []; //フォントウェイト用配列
    var myColorArray = []; //カラー用配列
    var myLeadingArray = []; //行送り用配列
    var myJustificationArray = []; //行揃え用配列
    var sort = []; //重複処理関数内の配列

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       関数定義
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    function zeroPad(myNum) { //ゼロパディング
        var myNum = ('00' + myNum).slice(-2);
        return myNum;
    }

    function myRound(number, n) { //四捨五入
        var myPow = Math.pow(10, n);
        return Math.round(number * myPow) / myPow;
    }

    function myOverLap(sort, array) { //重複処理
        var flag;
        sort.push(array[0]);

        for (var i = 0; i < array.length; i++) {
            flag = true;
            for (var j = 0; j < sort.length; j++) {
                if (array[i] === sort[j]) {
                    flag = false;
                }
            }

            if (flag) {
                sort.push(array[i]);
            }
        }
        return sort;
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Illustrator2HTML
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    for (var i = 0; i < mySel.length; i++) {
        var myCont = mySel[i].contents; //コンテンツ内容全体

        var myParaLen = mySel[i].paragraphs.length; //段落数を取得
        for (var j = 0; j < myParaLen; j++) {
            var myPraContents = mySel[i].paragraphs[j].contents; //段落ごとのコンテンツを取得

            var myParaName = mySel[i].paragraphs[j].paragraphStyles[0].name; //コンテンツごとの段落スタイル名（タグ名）を取得
            myCSSArray.push(myParaName); //配列に追加

            var myStartTag = "<" + myParaName + ">"; //開始タグ
            var myEndTag = "</" + myParaName + ">"; //終了タグ       
            var myHTMLSentence = myStartTag + myPraContents + myEndTag; //開始タグ＋コンテンツ＋終了タグ
            myHTMLArray.push(myHTMLSentence); //配列に追加

            var myFontSize = myPara[j].size; //サイズ 
            var myFontSize = "font-size: " + myRound(myFontSize, 2) + "px;"; //myFontSizeに四捨五入関数実行
            mySizeArray.push(myFontSize); //配列に追加

            var myFontFamily = myPara[j].textFont.family; //フォントファミリー。※ps名が取得できない 20170102課題
            var myFontFamily = "font-family: " + myFontFamily + ";";
            myFontFamilyArray.push(myFontFamily); //配列に追加

            var myFontWeight = myPara[j].textFont.style; //フォントウェイト
            var myFontWeight = "font-weight: " + myFontWeight + ";";
            myFontWeightArray.push(myFontWeight); //配列に追加

            var myColorRed = myPara[j].fillColor.red.toString(16).toUpperCase(); //red値を取得（大文字のHEX値）
            var myColorRed = zeroPad(myColorRed); //ゼロパディング関数実行
            var myColorGreen = myPara[j].fillColor.green.toString(16).toUpperCase(); //green値を取得（大文字のHEX値）
            var myColorGreen = zeroPad(myColorGreen); //ゼロパディング関数実行
            var myColorBlue = myPara[j].fillColor.blue.toString(16).toUpperCase(); //blue値を取得（大文字のHEX値）
            var myColorBlue = zeroPad(myColorBlue); //ゼロパディング関数実行
            var myColor = "color: #" + myColorRed + myColorGreen + myColorBlue + ";"; //rgb値として取得
            myColorArray.push(myColor); //配列に追加

            var myJustification = myPara[j].justification; //行揃え
            switch (myJustification) {
            case Justification.LEFT:
                myJustification = "text-align: left;";
                break;
            case Justification.CENTER:
                myJustification = "text-align: center;";
                break;
            case Justification.RIGHT:
                myJustification = "text-align: right;";
                break;
            case Justification.FULLJUSTIFYLASTLINELEFT:
                myJustification = "text-align: justify;";
                break;
            }
            myJustificationArray.push(myJustification); //配列に追加

            var myParaLeading = myPara[j].paragraphs[0].leading; //段落から行送り値取得
            var myLeading = "line-height: " + myRound(myParaLeading, 2) + "px;";
            myLeadingArray.push(myLeading); //配列に追加
        }
    }

    for (var m = 0, myCSSArrayLen = myCSSArray.length; m < myCSSArrayLen; m++) {
        var myCSSResult = myCSSArray[m] + "{" + mySizeArray[m] + myFontFamilyArray[m] + myFontWeightArray[m] + myColorArray[m] + myLeadingArray[m] + myJustificationArray[m] + "margin: 0;" + "}"; //CSS生成
        myPropArray.push(myCSSResult); //配列に追加  
    }

    var myHTMLArray = myHTMLArray.toString(); //HTMLタグ用配列を文字列に変換　※変数上書き
    var myHTMLArray = myHTMLArray.replace(/,/g, ""); //文字列化したCSVのカンマを削除
    var myPropArray = myOverLap(sort, myPropArray).toString(); //CSS用配列に重複関数実行し、文字列に変換　※変数上書き
    var myPropArray = myPropArray.replace(/,/g, ""); //文字列化したCSVのカンマを削除

    var MyHTMLRessult = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>Document</title><style>' + myPropArray + '</style></head><body>' + myHTMLArray + '</body></html>'; //HTML生成

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       ファイル保存
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    (function () { //無名関数を定義し実行
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
            fileObj.writeln(MyHTMLRessult); //書き出すテキストを連結
            fileObj.close();
            alert("処理が終わりました。");
        }
    })();
}