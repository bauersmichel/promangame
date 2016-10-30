var GipfelSturm = GipfelSturm || {};
var WUERFEL_GROESSE = 50;
var alle_wuerfel = {};
var wuerfel_uid = 0;

GipfelSturm.Wuerfel = function Wuerfel(seiten=6, pos_x=0, pos_y=0, farbe="#ffffff", zeichnen=false){
  this.uid = "wuerfel" + ++wuerfel_uid;
  this.farbe = farbe;
  this.seiten = seiten;
  this.pos_x = pos_x;
  this.pos_y = pos_y;

  this.augenzahl = 1;
  if(zeichnen == true) {
    this.wuerfelZeichnen();
  }
}

GipfelSturm.Wuerfel.prototype = {
  wuerfeln:function () {

  },
  wuerfelZeichnen: function(pos_x=null, pos_y=null) {
    var dom_wuerfel = $('#' + this.uid)[0]; // pruefen ob wuerfel bereits im DOM exisiert
    if (dom_wuerfel) {

    } else { // noch nicht im  DOM => zeichnen
      if(pos_x)
        this.pos_x = pos_x;
      if(pos_y)
        this.pos_y = pos_y;

      var wuerfel = canvasErstellen(this.pos_x, this.pos_y, WUERFEL_GROESSE, WUERFEL_GROESSE);
      paper.setup(wuerfel);
      with (paper) {
        var re = new Rectangle([0, 0], [WUERFEL_GROESSE, WUERFEL_GROESSE]);
        var rect = Path.Rectangle(re, 5);
        rect.fillColor = this.farbe;

        var punkt_m ={center: [WUERFEL_GROESSE/2, WUERFEL_GROESSE/2], radius: 5, fillColor: 'black'};
        var punkt_ol ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6], radius: 5, fillColor: 'black'};
        var punkt_ml ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6 * 3], radius: 5, fillColor: 'black'};
        var punkt_ul ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6 * 5], radius: 5, fillColor: 'black'};
        var punkt_or ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6], radius: 5, fillColor: 'black'};
        var punkt_mr ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6 * 3], radius: 5, fillColor: 'black'};
        var punkt_ur ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6 * 5], radius: 5, fillColor: 'black'};

        punkte = {1:[punkt_m],
                  7:[punkt_m, punkt_ol, punkt_ml, punkt_ul, punkt_or, punkt_mr, punkt_ur]};

        $.each(punkte[7], function (index, item) {
          var punkt = Path.Circle(item);
        });
        view.draw();
      }
      wuerfel.id = this.uid;
      $("#spielfeld").append(wuerfel);
    }
  },
}
