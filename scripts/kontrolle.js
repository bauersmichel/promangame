// kontrolle.js
// Author: M. Bauer
//
// Klasse zur Steuerung des GipfelSturm-Spiels
//

var GipfelSturm = GipfelSturm || {}; // Namespace-Setub

GipfelSturm.aktiver_spieler = 0; // Globale Variable um den aktiven Spieler zu speichern

// Klasse Kontrolle
// Erstellt bei instanziierung gewünschte Anzahl von Spielern und Würfeln
// und positioniert die spieler auf dem start_wegpunkt
GipfelSturm.Kontrolle = function Krontrolle(spielerzahl, start_wegpunkt){
    var wuerfel_y = 0;  // Würfel werden untereinander angeordnet (Alternative z-Index aller Würfel verwalten)
    for (i=1; i <= spielerzahl; i++) { // Spieler und Würfel in Schleife erstellen
      var spieler = new GipfelSturm.SpielFigur();
      spieler.figurWegpunktPositionieren(start_wegpunkt);
      wuerfel_y += 60;
      var wuerfel = new GipfelSturm.Wuerfel(6, 10, wuerfel_y, spieler.farbe, false);
      wuerfel.spielerZuweisen(spieler);
    }

    this.spielzug = 0;
    this.spielerzahl = spielerzahl;
    GipfelSturm.aktiver_spieler = 0;
  }

  // Kontrolle - Methoden
  GipfelSturm.Kontrolle.prototype = {
     // aktiven spieler wecheseln
     // erhöht auch den spielzug-zähler
     naechsterSpieler:function () {
       GipfelSturm.aktiver_spieler = this.spielzug % this.spielerzahl + 1;
       meldung.gruen("Spieler " + GipfelSturm.aktiver_spieler + " ist dran!");
       this.spielzug++;
     },
     // mit dem zum aktiven Spieler gehörenden Würfel würfeln
     // und Spielfigur entsprechend ziehen
     // Erreicht Figur eine Gabelung, wird angehalten (gesteuert durch Wuerfel.wuerfelnMitZiehen())
     wuerfeln:function () {
       var spieler = GipfelSturm.alle_spieler['spieler' + GipfelSturm.aktiver_spieler]
       var wuerfel = GipfelSturm.alle_wuerfel['wuerfel' + GipfelSturm.aktiver_spieler]
       with(spieler) {
         if (wegpunkt.gabelung == true) {  // Figur steht an Gabelung
           if (naechster_wegpunkt == null) { // nächster Wegpunkt noch nicht gewählt
             $.each(wegpunkt.nachfolger, function () {this.auswahlAktivieren()}); // Nachfolger-WPs zum Auswählen aktivieren
             meldung.rot("Bitte nächsten Wegpunkt wählen!")
             return 0;
           } else {
             $.each(wegpunkt.nachfolger, function () {this.auswahlDeaktivieren()});
           }
         }
       }
       wuerfel.wuerfelnMitZiehen();
       this.naechsterSpieler();
     },
     // aktuellen Spielzustand in localStorage speichern
     speichern:function() {
       var alle_spieler = {}
       for(s in GipfelSturm.alle_spieler) {
         if (typeof GipfelSturm.alle_spieler[s] !== 'function') {
            spieler = GipfelSturm.alle_spieler[s];
            alle_spieler[spieler.spieler] = spieler.wegpunkt.uid;
         }
       }
       localStorage.alle_spieler = JSON.stringify(alle_spieler);
       localStorage.aktiver_spieler = GipfelSturm.aktiver_spieler;
       localStorage.spielzug = this.spielzug;
     },
     // aktuellen Spielzustand aus localStorage laden
     laden:function() {
       try {
         if (localStorage.alle_spieler != null) {
           var alle_spieler = JSON.parse(localStorage.alle_spieler);
           $.each(alle_spieler, function (key, value) {
               GipfelSturm.alle_spieler[key].figurWegpunktPositionieren(GipfelSturm.alle_wegpunkte[value]);
           });
           GipfelSturm.aktiver_spieler = localStorage.aktiver_spieler;
           this.spielzug = localStorage.spielzug;
        }
      } catch (e) {
        console.log(e);
      }
     },
     spielstandLoeschen:function() {
       localStorage.clear();
     }
  }
