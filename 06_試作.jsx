var sel=app.activeDocument.selection;
var obj=sel[0].fillColor;
if(obj=="[GrayColor]"){
    
    sel[0].fillColor.mode=RGBColor;
    //alert("グレー");
    }

//~ function setGrayColor(g){
//~ var _gray=new GrayColor();
//~     _gray.gray=g;
//~     return _gray;
//~     }
