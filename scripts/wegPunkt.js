var GipfelSturm = GipfelSturm || {};
var alle_wegpunkte = {}

var DEBUG = true;  // Falls aktiviert werden Wegpunkte als Kreise gezeichnet, falls nicht werden nur divs erstellt
var WEGPUNKT_GROSS = 60;
var WEGPUNKT_KLEIN = 30;
var wegpunkt_uuid = 0; // globaler Zähler für Wegpunkte => eindeutige ID für die einzelnen Objekte

GipfelSturm.WegPunkt = function WegPunkt(pos_x, pos_y, weg, durchmesser=WEGPUNKT_KLEIN, farbe="#ffffff") {
  this.uuid = "wegpunkt" + ++wegpunkt_uuid;  // Objektzähler bei instanziierung inkrementieren
  this.name = "";
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.weg = weg;
  this.farbe = farbe;
  this.vorgaenger = [];
  this.nachfolger = [];

  if( DEBUG ) {
    offset = (SPIELER_GROESSE/2 - durchmesser/2);
    wp = kreisZeichnen(this.pos_x + offset , this.pos_y + offset, durchmesser, farbe);
  } else {
    offset = ((SPIELER_GROESSE - durchmesser)/2)  - 1
    wp = divHelfer(this.pos_x + offset , this.pos_y + offset, durchmesser, durchmesser);
  }
  wp.id = this.uuid;
  wp.style.zIndex=-1;
  $(wp).on('click', function () {
                                alert(alle_wegpunkte[this.id].uuid);
                               });
  $('#spielfeld').append(wp);
  alle_wegpunkte[this.uuid] = this

}

GipfelSturm.WegPunkt.prototype = {
  addNachfolger:function (wegpunkt) {
    this.nachfolger.push(wegpunkt);
    wegpunkt.vorgaenger.push(this);
  },
}

GipfelSturm.WegPunktBenannt = function WegPunktBenannt(name, pos_x, pos_y, weg) {
  GipfelSturm.WegPunkt.call(this, pos_x, pos_y, weg, WEGPUNKT_GROSS);
  this.name = name;
}

GipfelSturm.WegPunktBenannt.prototype = Object.create(GipfelSturm.WegPunkt.prototype);
