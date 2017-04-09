var doc=app.activeDocument;
var sel=doc.selection;
var obj=sel[0].fillColor;
//alert(obj);
if(obj=="[GrayColor]"){
var _color=sel[0].fillColor.gray;
    alert(myRound(_color,2));
    //obj=RGBColor;
   // alert("グレー");
    }

//~ function setGrayColor(g){
//~ var _gray=new GrayColor();
//~     _gray.gray=g;
//~     return _gray;
//~     }

function myRound(num,n){
    var _pow=Math.pow(10,n);
    return Math.round(num*_pow)/_pow;
    }