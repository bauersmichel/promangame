// spielFigur.js
// Author: M. Bauer
//
// Klasse zur Darstellung von Spielfiguren

var GipfelSturm = GipfelSturm || {}; // Namespace-Setup
var SPIELER_GROESSE = 20; // durchmesser der Spielfiguren (nur gerade Werte verwenden)
// Spielerfarben werden automatisch beim erstellen der Figruen vergeben
// Momentan maximal 6 Figuren möglich
var SPIELER_FARBEN = ['#ff0000', '#00ff00', '#0000ff', '#aa00aa', '#1233456', '#654321'];

var spieler_zahl = 0;
GipfelSturm.alle_spieler = {}; // Globale variable zum speichern aller Spieler-Objekte

// Spielfigur Konstructor
// x, y = obere linke ecke
GipfelSturm.SpielFigur = function SpielFigur(pos_x = 0, pos_y = 0){
  this.spieler = "spieler" + ++spieler_zahl;
  this.farbe = SPIELER_FARBEN[spieler_zahl-1];
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.wegpunkt = null;  // WP auf dem der Spieler aktuell steht
  this.wuerfel = null;   // XXX notwendig ???
  this.wegpunkt_ist_gabelung = null;
  this.naechster_wegpunkt = null;

  // Figur zeichnen und auf #spielfeld platzieren
  var c = kreisZeichnen(this.pos_x, this.pos_y, SPIELER_GROESSE, this.farbe)
  c.id = this.spieler
  $('#spielfeld').append(c);
  GipfelSturm.alle_spieler[this.spieler] = this;
}

// Spielfigur-Methoden
GipfelSturm.SpielFigur.prototype = {
   // Figur (animiert) zu einem Wegpunkt ziehen
   // mit Prüfung ob WP eine Gabelung ist
   figurWegpunktPositionieren:function (wegpunkt) {
     this.wegpunkt_ist_gabelung = false;
     if (wegpunkt.nachfolger.length > 1) // => Gabelung
         this.wegpunkt_ist_gabelung = true;
     this.wegpunkt = wegpunkt;
     this.figurPositionierenAnimiert(wegpunkt.pos_x, wegpunkt.pos_y);
   },
   //figurWuerfelZuweisen:function (wuerfel) {
   //   this.wuerfel = wuerfel;
   //     wuerfel.farbe = this.farbe;
   //},

   // Figur auf x,y Position stellen
   figurPositionieren:function (pos_x, pos_y) {
      //console.log(`${this.spieler} => Positon ${pos_x} ${pos_y}`)
      this.pos_x = pos_x;
      this.pos_y = pos_y;
      xy = this.zielPositionPruefen(pos_x, pos_y, this.spieler);
      //console.log(`${this.spieler} korrigiert Positon ${xy[0]} ${xy[1]}`)
      var c = $('#' + this.spieler)[0];
      c.style.left = xy[0] + "px";
      c.style.top = xy[1] + "px";
      c.style.position = "absolute";
   },

   // figur zu x,y Position ziehen (animiert)
   // Prüft ob bereits Figuren auf dem Zielpunkt stehen und verschiebt
   // diese bei Bedarf dynamisch
   figurPositionierenAnimiert:function (pos_x, pos_y, dauer=2000, setze_pos=true) {
     //console.log(`${this.spieler} ===> Positon ${pos_x} ${pos_y}`)
     if (setze_pos) {
       this.pos_x = pos_x;
       this.pos_y = pos_y;
     }
     xy = this.zielPositionPruefen(pos_x, pos_y, this.spieler) // Rückgabe: korrigierte x,y Position
     //console.log(`${this.spieler} korrigiert Positon ${xy[0]} ${xy[1]}`)
     var c = $('#' + this.spieler);
     c.animate({"left": xy[0] + "px",
                "top":  xy[1] + "px"}, dauer);
   },
   zielPositionPruefen:function (pos_x, pos_y, spieler) {
      var spieler_in_position = [];
      $.each(GipfelSturm.alle_spieler, function (key, value) { // Schleife über alle Spieler
        if (value.spieler != spieler) {
          if (value.pos_x == pos_x && value.pos_y == pos_y) { // Prüfen ob Spieler an Zielposition
            //console.log(`${value.spieler} bereits auf Positon ${pos_x} ${pos_y}`);
            spieler_in_position.push(value);
          }
        }
      });
      // alle Spieler am Zielpunkt verschieben (kreisförmige Anordnung)
      if ( (anz = spieler_in_position.length) > 0 ) {
        //console.log(`${anz} bereits auf Positon ${pos_x} ${pos_y}`);
        var schritt = 360 / (anz + 1); // Kreisbogen / Spielerzahl auf Position
        winkel = 0
        $.each(spieler_in_position, function (index, item) {
           winkel = winkel + schritt;
           // x,y auf Kreisbogen verteilen (ACHTUNG: Umrechnung in Bogenmaß nötig)
           neues_x = SPIELER_GROESSE * Math.cos(winkel * (Math.PI / 180)) + pos_x;
           neues_y = SPIELER_GROESSE * Math.sin(winkel * (Math.PI / 180)) + pos_y;
           // Figur verschieben (rekursiv)
           item.figurPositionierenAnimiert(neues_x, neues_y, 100, false);
        });
        // neue Position der "Input-Spielfigur"
        pos_x = SPIELER_GROESSE * Math.cos(0)  + pos_x;
        pos_y = SPIELER_GROESSE * Math.sin(0)  + pos_y;

      }
      return [pos_x, pos_y];
   }
}
