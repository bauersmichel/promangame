// wuerfel.js
// Author: M. Bauer, H. Eder, B. Fugger, W. Horn, S. Richter
//
// Klasse für Würfeldarstellung und Würfelfunktionen
var GipfelSturm = GipfelSturm || {}; // Namespace-Setup
var WUERFEL_GROESSE = 50;  // Würfel-Seitenlängee in px
GipfelSturm.alle_wuerfel = {}; // globale Variable zum abspeichern aller Würfel-Objekte
var wuerfel_uid = 0;

// Würfel-Klasse
// seiten: Seitenzahl 1-n (bei sehr großen werten kann die Darstellung der Zahl zu klein werden)
// pos_x, pos_y: Position des Würfels (px)
// zeichnen: legt fest, ob der Würfel beim instanziieren gezeichnet werden soll
GipfelSturm.Wuerfel = function Wuerfel(seiten=6, pos_x=0, pos_y=0, farbe="#ffffff", zeichnen=false){
  this.uid = "wuerfel" + ++wuerfel_uid;
  this.farbe = farbe;
  this.seiten = seiten;
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.augenzahl = 1;
  this.spieler = null;
  if(zeichnen == true) {
    this.wuerfelZeichnen();
  }
  GipfelSturm.alle_wuerfel[this.uid] = this;
}

GipfelSturm.Wuerfel.prototype = {
  // Würfel einem Spieler zuweisen
  spielerZuweisen:function ( spieler ) {
    this.spieler = spieler;
  },
  // Zufälliges Würfelergebnis erzeugen und Würfel zeichnen
  wuerfeln:function () {
    this.augenzahl = Math.floor((Math.random() * this.seiten) + 1);
    console.log(this.uid + ' ' + this.augenzahl);
    this.wuerfelZeichnen();
    return this.augenzahl;
  },
  wuerfelnMitZiehen:function () {
      with (this.spieler) {
        w = this.wuerfeln()
        for (i=0; i < w; ++i) {
          if (naechster_wegpunkt) {
            figurWegpunktPositionieren(naechster_wegpunkt);
            naechster_wegpunkt = null;
          } else {
            figurWegpunktPositionieren(wegpunkt.nachfolger[0]);
          }
          if (wegpunkt.gabelung == true) break;
        }
      }
  },
  // Funktion zum Zeichnen des Würfels
  // Augenzahl 1-6 wird als Punkte dargestellt
  // Augenzahl 7-n wird als Dezimalzahl dargestellt (Grösse wird automatisch skaliert)
  wuerfelZeichnen: function(pos_x=null, pos_y=null) {
    var wuerfel = $('#' + this.uid)[0]; // pruefen ob wuerfel bereits im DOM exisiert
    if (!wuerfel) { // noch nicht im  DOM => canvasErstellen
      if(pos_x)
        this.pos_x = pos_x;
      if(pos_y)
        this.pos_y = pos_y;

      var wuerfel = canvasErstellen(this.pos_x, this.pos_y, WUERFEL_GROESSE, WUERFEL_GROESSE);
      wuerfel.id = this.uid;
      $("#spielfeld").append(wuerfel);
    }
    wuerfel.getContext('2d').clearRect(0, 0, WUERFEL_GROESSE, WUERFEL_GROESSE);
    paper.setup(wuerfel);
      with (paper) {
      var re = new Rectangle([0, 0], [WUERFEL_GROESSE, WUERFEL_GROESSE]);
      var rect = Path.Rectangle(re, 5);
      rect.fillColor = this.farbe;

      // Punkt-Positionen in Abbhängigkeit von Wüfelgröße berechen
      var punkt_m ={center: [WUERFEL_GROESSE/2, WUERFEL_GROESSE/2], radius: 5, fillColor: 'black'};
      var punkt_ol ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6], radius: 5, fillColor: 'black'};
      var punkt_ml ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6 * 3], radius: 5, fillColor: 'black'};
      var punkt_ul ={center: [WUERFEL_GROESSE/6, WUERFEL_GROESSE/6 * 5], radius: 5, fillColor: 'black'};
      var punkt_or ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6], radius: 5, fillColor: 'black'};
      var punkt_mr ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6 * 3], radius: 5, fillColor: 'black'};
      var punkt_ur ={center: [WUERFEL_GROESSE/6 * 5 , WUERFEL_GROESSE/6 * 5], radius: 5, fillColor: 'black'};
      // Zuordnung Ziffer <=> Punkte
      punkte = {1:[punkt_m],
                2:[punkt_ol,punkt_ur],
                3:[punkt_m, punkt_ol, punkt_ur],
                4:[punkt_ol, punkt_ul, punkt_or, punkt_ur],
                5:[punkt_m, punkt_ol, punkt_ul, punkt_or, punkt_ur],
                6:[punkt_ol, punkt_ml, punkt_ul, punkt_or, punkt_mr, punkt_ur],
                7:[punkt_m, punkt_ol, punkt_ml, punkt_ul, punkt_or, punkt_mr, punkt_ur]};

      if (this.augenzahl <= 6) { // Punkte zeichnen
        $.each(punkte[this.augenzahl], function (index, item) {
          var punkt = Path.Circle(item);
        });
      } else { // Zahl zeichnen
        var text = new PointText({point: [0, 0],
                                  content: this.augenzahl,
                                  fillColor: 'black',
                                  fontFamily: 'Courier New',
                                  fontWeight: 'bold',
                                  fontSize: 40
        });
        text.position = new Point (25,25);
        // Textgröße auf Würfel skalieren
        text.scale((WUERFEL_GROESSE-2) / text.bounds.width);
      }
      view.draw();
    }
  },

  wuerfelAktivieren: function() {
    $('#' + this.uid)[0].show();
  },

  wuerfelDeaktivieren: function() {
    $('#' + this.uid)[0].hide();
  },
}
