//▼新規ドキュメント作成
var docWidth = 841.89; //ページの横幅。297mm
var docHeight = 595.276; //ページの縦幅。210mm
var docObj = documents.add(DocumentColorSpace.RGB, docWidth, docHeight); //RGB空スペースでドキュメント作成
var recObj = docObj.pathItems.rectangle(0, 0, 841.89, -595.276); //ドキュメントサイズに矩形を作成
recObj.filled = false; //塗りなし
recObj.stroked = false; //線なし

//▼日付を取得
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();
var saveDate = year + "年" + zeroPad02(month) + "月" + zeroPad02(day) + "日" + zeroPad02(hour) + "時" + zeroPad02(minute) + "分" + zeroPad02(second) + "秒"; //保存時の時刻を取得→ファイル名

MAIN: { //ラベル
    //▼ドキュメント操作
    var doc = app.activeDocument;

    var selFolder = Folder.selectDialog("処理するフォルダを選択してください");
    if (selFolder == null) {
        alert("キャンセルしました。");
        doc.close(); //保存しないで閉じる
        break MAIN; //処理を抜ける
    }
    var selFiles = new Array;
    var selFiles = selFolder.getFiles(); //処理前のフォルダから全てのファイルを取得
    var myLayer = doc.layers;

    //▼1番目のレイヤーの処理
    activeDocument.layers[0].name = "001"; //1番目のレイヤー名を"001"に
    myItem = myLayer[0].placedItems.add();
    myItem.file = selFiles[0];

    centerAlig(myItem.file); //「アートボードに整列、天地左右センター配置」関数実行

    //▼2番目以降のレイヤーの処理
    for (var i = 1, selFilesLength = selFiles.length; i < selFilesLength; i++) {
        myLayer = doc.layers.add();
        myLayer.name = zeroPad03([i + 1]); //2番目以降のレイヤー名を"002～"に
        myItem = myLayer.placedItems.add();
        myItem.file = selFiles[i];
        centerAlig(myItem.file); //「アートボードに整列、天地左右センター配置」関数実行
    }

    //▼ai保存
    var saveOptions = new IllustratorSaveOptions;
    with(saveOptions) { //ai保存のデフォルト設定
        pdfCompatible = true; //PDF互換ファイルを作成
        embedLinkedFiles = false; //配置した画像を埋め込まない
        embedICCProfile = true; //ICCプロファイルを埋め込む
        compressed = true; //圧縮を使用
    }

    //var saveFolder = Folder.selectDialog("保存先のフォルダを選択してください") ;
    var saveFolder = "~/Desktop/"; //saveFolder+"/"
    var saveFile = new File(saveFolder + saveDate + ".ai");
    doc.saveAs(saveFile, saveOptions);

    //▼PSD書き出し
    var exportOptions = new ExportOptionsPhotoshop();
    var type = ExportType.PHOTOSHOP;
    var saveDir = new File(saveFolder + saveDate + ".psd");
    exportOptions.antiAliasing = true;
    exportOptions.writeLayers = true;
    exportOptions.resolution = 240;
    doc.exportFile(saveDir, type, exportOptions);
var saveDir=saveDir.toString();
    doc.close(); //閉じる
   
}

    var bridgeTalk=new BridgeTalk();
    bridgeTalk.target="photoshop";
    
    //alert(saveDir);
    var openFileResult="var openFile = new File('"+saveDir+"');app.open(openFile);";
    bridgeTalk.body=openFileResult;
    bridgeTalk.send();
    //alert("処理が終わりました");

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            関数定義
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//▼アートボードに整列、天地左右センター配置。
function centerAlig() {
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
    var abIdx = app.activeDocument.artboards.getActiveArtboardIndex();
    var actAbBds = app.activeDocument.artboards[abIdx].artboardRect;
    moveObj = myItem;
    moveObj.position = new Array((actAbBds[2] - actAbBds[0]) / 2 - moveObj.width / 2, (actAbBds[3] - actAbBds[1]) / 2 + moveObj.height / 2);
    return moveObj;
}

//▼ゼロパディング3桁・レイヤー名用
function zeroPad03(num) {
    var num = ("00" + num).slice(-3);
    return num;
}

//▼ゼロパディング2桁。ファイル名用
function zeroPad02(num) {
    var num = ("00" + num).slice(-2);
    return num;
}

/*
//▼photoshop スマートオブジェクトに変換
MAIN: { //ラベル
    if (documents.length == 0) { //ファイルが開いていない場合ダイアログを表示する
        var selFile = File.openDialog("処理したいファイルを選んでください。");
        if (selFile == null) {
            alert("キャンセルされました。");
            break MAIN; //キャンセルしたら処理を抜ける
        } else {
            var openFile = new File(selFile);
            app.open(openFile);
        }
    }

    var doc = app.activeDocument;
    var _layer = doc.artLayers;

    for (var i = 0, layerLength = _layer.length; i < layerLength; i++) {
        //▼ScriptListaner使用。
        var idslct = charIDToTypeID("slct");
        var desc3 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref1 = new ActionReference();
        var idLyr = charIDToTypeID("Lyr ");
        ref1.putName(idLyr, _layer[i].name); //ここの第二引数にレイヤー数分指定。nameプロパティは必要。
        desc3.putReference(idnull, ref1);
        var idMkVs = charIDToTypeID("MkVs");
        desc3.putBoolean(idMkVs, false);
        var idLyrI = charIDToTypeID("LyrI");
        var list1 = new ActionList();
        list1.putInteger(13);
        desc3.putList(idLyrI, list1);

        executeAction(idslct, desc3, DialogModes.NO); //レイヤーを順次選択。

        var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer"); //スマートオブジェクトに変換。
        executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
    }
    activeDocument.save();
    alert("全てのレイヤーをスマートオブジェクトに変換し、\r\n保存しました。");
}
*/