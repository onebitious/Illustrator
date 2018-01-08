mainScript: { //処理中断のためのラベル
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ドキュメントの有無による処理判別
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    try {
        if (app.activeDocument) {
            //alert("OK");
        }
    } catch (e) {
        alert("ドキュメントが開いていません。\r\n新規ドキュメントを作成してから実行してください。");
        break mainScript; //処理を中断
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ドキュメントとアートボード
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var doc = app.activeDocument; //ドキュメント
    var board = doc.artboards; //アートボード

    var index = board.getActiveArtboardIndex(); //アートボードのインデックス
    //Retrieves the index position of the active artboard in the document's list. Returns the 0-based index.
    var boardRect = doc.artboards[index].artboardRect; //アートボードの座標
    //artboardRect:→Size and position of the artboard.

    //▼座標取得
    var X1 = boardRect[0]; //左上のX座標
    var Y1 = boardRect[1]; //左上のY座標
    var X2 = boardRect[2]; //右下のX座標
    var Y2 = boardRect[3]; //右下のY座標

    //▼アートボードの幅と高さを取得
    var boardW = X2 - X1; //アートボードの横幅
    var boardH = Y2 - Y1; //アートボードの高さ

    //▼キャンバスサイズの最大値を取得
    var canvasLimit = ((16383 - boardW) / 2 + 0.5) + boardW; //キャンバスの左右幅の最大値
    var bottomLimit = ((16383 - boardH) / 2 + 0.5 + boardH); //キャンバスの天地幅の最大値



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 入力画面ダイアログ
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var flag = false;
    while (flag == false) { //エラーの場合繰り返す
        win = new Window("dialog", "新規アートボード作成", [200, 150, 560, 280]);
        win.center(); //中央に配置
        
        //▼よこ入力欄
        win.add("statictext", [25, 20, 105, 40], "よこ ： ");
        var hNum = win.add("edittext", [70, 20, 115, 45], ""); //よこの数
        win.add("statictext", [120, 20, 135, 40], "個");
        win.add("statictext", [170, 20, 245, 40], "よこの間隔 ： "); //よこの間隔
        var hSpace = win.add("edittext", [255, 20, 315, 45], "");
        win.add("statictext", [320, 20, 345, 40], "px");

        //▼たて入力欄
        win.add("statictext", [25, 50, 105, 70], "たて ： ");
        var vNum = win.add("edittext", [70, 50, 115, 75], ""); //たての数
        win.add("statictext", [120, 50, 135, 70], "個");
        win.add("statictext", [170, 50, 245, 70], "たての間隔 ： "); //たての間隔
        var vSpace = win.add("edittext", [255, 50, 315, 75], "");
        win.add("statictext", [320, 50, 345, 70], "px");

        //▼キャンセルボタンとOKボタン
        var cancelBtn = win.add("button", [70, 90, 170, 110], "キャンセル", {
            name: "cancel"
        }); //キャンセルボタン
        var okBtn = win.add("button", [200, 90, 280, 110], "OK", {
            name: "ok"
        }); //OKボタン
        okBtn.active = true;

        //▼入力画面ダイアログ表示
        var btnResult = win.show();

        if (btnResult == 2) {
            alert("処理を中断します。");
            break mainScript; //処理を中断
        }

        var totalNum = hNum.text * vNum.text; //アートボードの総数を取得

        //▼入力画面の値を数値に型変換
        var hNumResult = parseInt(hNum.text);
        var vNumResult = parseInt(vNum.text);
        var hSpaceResult = parseInt(hSpace.text);
        var vSpaceResult = parseInt(vSpace.text);

        var totalHSize = (hSpaceResult * (hNumResult - 1)) + (hNumResult * boardW); //よこの総寸
        var totalVSize = (vSpaceResult * (vNumResult - 1)) - (vNumResult * boardH); //たての総寸

        var moveValueH = -(totalHSize / 2 - (boardW / 2)); //よこ座標の移動値
        var moveValueV = (totalVSize / 2 + (boardH / 2)); //たて座標の移動値

        //▼エラー処理
        if (isNaN(hNum.text) == true || isNaN(vNum.text) == true || isNaN(hSpace.text) == true || isNaN(vSpace.text) == true) {
            alert("数値以外が入力されています。\r\n数値を入力してください。");
        } else if (totalNum > 1001) { // CC 2017 までは100個、CC2018 から1000個まで作成可能
            alert("1000を超えるアートボードは作成できません。\r\n1000以下になるような数値を入力してください。"); //1000を超える数値の場合警告
        } else if (hNum.text == "" || vNum.text == "" || hSpace.text == "" || vSpace.text == "") { //空欄がある場合警告
            alert("空欄があります。\r\n数値を入力してください。");
        } else if (hNum.text < 1 || vNum.text < 1) {
            alert("よこ、たての入力欄には、1以上の数値を入力してください。");
        } else if (hSpace.text < 0 || vSpace.text < 0) {
            alert("よこ、たての間隔には、0以上の数値を入力してください。");
        } else if (totalHSize > 16383 || totalVSize > 16383) {
            alert("アートボードの総寸がキャンバスサイズより大きいです。\r\n再設定してください。");
        } else {　
            //▼上記のエラーがない場合
            var flag = true;

            if (totalHSize > canvasLimit && totalVSize > bottomLimit) {
                var X1 = moveValueH; //移動後の左上のX座標
                var X2 = moveValueH + boardW; //移動後の右下のX座標
                var Y1 = moveValueV; //移動後の左上のY座標
                var Y2 = moveValueV + boardH; //移動後の右下のY座標
                alert('現在のアートボードの位置ではキャンバスサイズからはみ出します。\r\n全てのアートボードがキャンバスの "天地左右" のセンターに配置されるように移動させます。');
                board.insert([X1, Y1, X2, Y2], 0);
                board.remove(1);
                board[0].name = "アートボード 1";
            } else if (totalHSize > canvasLimit) {
                var X1 = moveValueH; //移動後の左上のX座標
                var X2 = moveValueH + boardW; //移動後の右下のX座標
                alert('現在のアートボードの位置ではキャンバスサイズからはみ出します。\r\n全てのアートボードがキャンバスの "左右" のセンターに配置されるように移動させます。');
                board.insert([X1, Y1, X2, Y2], 0);
                board.remove(1);
                board[0].name = "アートボード 1";
            } else if (totalVSize > bottomLimit) {
                var Y1 = moveValueV; //移動後の左上のXY座標
                var Y2 = moveValueV + boardH; //移動後の右下のY座標
                alert('現在のアートボードの位置ではキャンバスサイズからはみ出します。\r\n全てのアートボードがキャンバスの "天地" のセンターに配置されるように移動させます。');
                board.insert([X1, Y1, X2, Y2], 0);
                board.remove(1);
                board[0].name = "アートボード 1";
            }

            //▼アートボード増加処理
            var n = 0;
            for (var i = 1; i < totalNum; i++) {
                if (hNumResult == 1) { //列数1の場合の処理
                    board.add([X1, Y1 + (boardH - vSpaceResult) * i, X2, Y2 + (boardH - vSpaceResult) * i], i); //アートボードの数だけ繰り返す
                } else { //▼列数2以上の場合の処理
                    board.add([(X1 + (boardW + hSpaceResult) * i) - n, Y1, (X2 + (boardW + hSpaceResult) * i) - n, Y2], i); //アートボードの数だけ繰り返す
                    if (board.length % hNumResult == 0) { //列数になったら折り返す
                        //▼2行目以降を下げる指定
                        var Y1 = Y2 - vSpaceResult;
                        var Y2 = Y1 + boardH;
                        if (X1 == 0) {
                            var n = (X1 + (boardW + hSpaceResult) * i) + (boardW + hSpaceResult); //原点座標がX:0,Y:0のとき
                        } else {
                            var n = (boardW + hSpaceResult) * i + (boardW + hSpaceResult); //原点座標がX:0,Y:0ではないとき
                        }
                    }
                }
            }
            //▼アートボードのリネーム処理
            for (var j = 0, boardLen = board.length; j < boardLen; j++) {
                board[j].name = "アートボード " + (j + 1);
            }
            alert("処理が終わりました。");
        }
    }
}　
