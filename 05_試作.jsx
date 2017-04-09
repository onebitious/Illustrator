var doc=app.activeDocument;
var sel=doc.selection;

var _color=sel[0].fillColor.typename;


if(_color=="GrayColor"){
    _color="RGBColor";
  }
