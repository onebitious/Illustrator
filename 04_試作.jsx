  var doc = app.activeDocument; //ドキュメント
  var obj = doc.pathItems; //ドキュメント上のオブジェクト

  var graStoArr = []; //グラデーションポイントの配列
  var graStoRedArr = []; //red配列
  var graStoGreenArr = []; //green配列
  var graStoBlueArr = []; //blue配列


  var graSto = obj[0].fillColor.gradient.gradientStops; //グラデーションポイント
  var graDeg = round((obj[0].fillColor.angle), 1); //角度
  for (var i = 0, graStoLen = graSto.length; i < graStoLen; i++) {
      var graStoRed = graSto[i].color.red;
      var graStoGreen = graSto[i].color.green;
      var graStoBlue = graSto[i].color.blue;
      graStoRedArr.push(graStoRed);
      graStoGreenArr.push(graStoGreen);
      graStoBlueArr.push(graStoBlue);
      var graStoRedResult = getColor(graStoRedArr[i]); //red
      var graStoGreenResult = getColor(graStoGreenArr[i]); //green
      var graStoBlueResult = getColor(graStoBlueArr[i]); //blue
      var graStoColResult = "#" + graStoRedResult + graStoGreenResult + graStoBlueResult; //カラーHEX値
      var myRampPoint = round((graSto[i].rampPoint), 2); //グラデーションスライダー
      var popGraResult = graStoColResult + " " + myRampPoint + "%";
      graStoArr.push(popGraResult);
  }



  var fillResult = "background: -webkit-linear-gradient(" + graDeg + "deg," + graStoArr + ");";

  function getColor(_color) { //取得した色値をHEX値、大文字、ゼロパディング
      var _color = zeroPad(_color.toString(16).toUpperCase());
      return _color;
  }