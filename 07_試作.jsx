var sel=app.activeDocument.selection;//選択
var n=255;//255階調
var _array=[];//配列

var obj=sel[0].fillColor;
if(obj=="[RGBColor]"){
for(var i=0; i<=255;i++){
    _array.push(n--);
    
    }


function setRGBColor(r,g,b){
var _rgb=new RGBColor();
    _rgb.red=r;
    _rgb.green=g;
    _rgb.blue=b;
    return _rgb;
    }



    
    sel[0].fillColor=GrayColor;
    }