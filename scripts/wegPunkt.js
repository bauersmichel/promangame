// wegPunkt.js
// Authoren: M. Bauer, H. Eder, B. Fugger, W. Horn, S. Richter
//
// Klasse zur Darstellung von Wegpunktnamen
// ermöglicht DEBUG darstellung von Wegpunktnamen
// ACHTUNG: Hintergrundbild (Spielplan) muss über z-Index < -2: nach ganz hinten gesetzt werden

var GipfelSturm = GipfelSturm || {}; // Namespace-Setup
GipfelSturm.alle_wegpunkte = {}; // Globale Variable zum speichern aller Wegpunkte

var DEBUG = false;  // Falls aktiviert, werden Wegpunkte als Kreise gezeichnet, falls nicht werden nur divs erstellt
var WEGPUNKT_GROSS = 60; // nur gerade Werte verwenden
var WEGPUNKT_KLEIN = 30; // nur gerade Werte verwenden
var wegpunkt_uid = 0; // globaler Zähler für Wegpunkte => eindeutige ID für die einzelnen Objekte

// Wegpunkt Konstruktor
// pos_x, pos_y: obere linke Ecke
GipfelSturm.WegPunkt = function WegPunkt(pos_x, pos_y, weg, durchmesser=WEGPUNKT_KLEIN, farbe="#ffffff") {
  this.uid = "wegpunkt" + ++wegpunkt_uid;  // Objektzähler bei instanziierung inkrementieren
  this.name = "";
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.weg = weg;
  this.farbe = farbe;
  this.vorgaenger = [];
  this.nachfolger = [];
  this.gabelung = false;

  // Wegpunkt zeichnen oder "nur" DIV-Container erstellen
  if( DEBUG ) {
    offset = (SPIELER_GROESSE/2 - durchmesser/2);
    wp = kreisZeichnen(this.pos_x + offset , this.pos_y + offset, durchmesser, farbe);
  } else {
    offset = ((SPIELER_GROESSE - durchmesser)/2)  - 1
    wp = divHelfer(this.pos_x + offset , this.pos_y + offset, durchmesser, durchmesser);
  }
  wp.id = this.uid;
  wp.style.zIndex=-1;

  // selektor für wegpunkt (zur auswahl des nächsten WP bei Gabelung)
  // erstellt einen roten Kreis (im DEBUG-Modus) hinter dem Wegpunkt
  offset_selektor = (SPIELER_GROESSE/2 - durchmesser/2);
  var selektor = kreisZeichnen(this.pos_x + offset - 5 , this.pos_y + offset - 5, durchmesser + 10, 'red');
  selektor.id = "selektor_" + this.uid;
  selektor.style.zIndex=-2;

  //$(wp).on('click', function () {
  //                              alert(alle_wegpunkte[this.id].uid);
  //                             });

  // Wegpunkt im Spielfeld platzieren
  $('#spielfeld').append(wp);
  $('#spielfeld').append(selektor);
  $('#' + selektor.id).hide();
  GipfelSturm.alle_wegpunkte[this.uid] = this;

}

// Wegpunkt Methoden
GipfelSturm.WegPunkt.prototype = {
  addNachfolger:function (wegpunkt) {
    this.nachfolger.push(wegpunkt);
    wegpunkt.vorgaenger.push(this);
    if (this.nachfolger.length > 1)
        this.gabelung = true;
  },
  // Wegpunkt auswählbar machen
  // Zeigt einen roten kreis bei MouseOver
  auswahlAktivieren:function () {
    var uid = this.uid;
    $('#' + uid).on('mouseenter', function() {
      $('#selektor_' + uid).show();
    });
    $('#' + uid).on('mouseleave', function() {
      $('#selektor_' + uid).hide();
    });
    $('#' + uid).on('click', function() {  // Klicken setzt .naechster_wegpunkt des aktiven Spielers auf diesen WP
      GipfelSturm.alle_spieler['spieler' + GipfelSturm.aktiver_spieler].naechster_wegpunkt = GipfelSturm.alle_wegpunkte[uid];
      meldung.gruen(uid + " gewählt! Bitte würfeln!");
    });

  },
  auswahlDeaktivieren:function () {
    $('#' + this.uid).off('mouseenter');
    $('#' + this.uid).off('mouseleave');
    $('#' + this.uid).off('click');
    $('#selektor_' + this.uid).hide();
  }

}

GipfelSturm.WegPunktBenannt = function WegPunktBenannt(name, pos_x, pos_y, weg) {
  GipfelSturm.WegPunkt.call(this, pos_x, pos_y, weg, WEGPUNKT_GROSS);
  this.name = name;
}

GipfelSturm.WegPunktBenannt.prototype = Object.create(GipfelSturm.WegPunkt.prototype);
