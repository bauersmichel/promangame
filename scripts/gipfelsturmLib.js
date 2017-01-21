// gipfelsturmLib.js
// Authoren: M. Bauer, H. Eder, B. Fugger, W. Horn, S. Richter
//
// Library Funktionen zur Nutzung im GipfelSturm Projekt


// Helferfunktion zum erstellen von Canvas-Elementen
// um mit diesen dann weiter zu arbeiten
function canvasErstellen(x, y, breite, hoehe) {
  // canvas vorbereiten
  var c = document.createElement('canvas');
  c.width = breite;
  c.height = hoehe;
  c.style.top = y + "px";
  c.style.left = x + "px";
  c.style.position = "absolute";
  return c;
}

// Helferfunktion zum einfachen zeichnen von Kreisen
function kreisZeichnen (x, y, durchmesser, farbe) {
  k = canvasErstellen(x, y, durchmesser, durchmesser);
  // Kreis auf canvas zeichenen (mit Paper.js-Library)
  paper.setup(k);
  with (paper) {
      r = durchmesser / 2;
      var circle = Path.Circle(new Point(r, r), r);
      circle.fillColor = farbe;
      view.draw();
  }
  return k;
}

// Helferfunktion zum einfachen erstellen von DIV-Boxen
// z.B. als Representation von Wegpunkten
function divHelfer(x, y, hoehe, breite, rand=0) {
  var d = document.createElement('div');
  d.style.left = x  + "px";
  d.style.top  = y  + "px";
  d.style.height = hoehe + "px";
  d.style.width = breite + "px";
  if (rand)
    d.style.border = "1px solid white";
  d.style.position = "absolute";
  return d;
}

// Helfer-Objekt zum anzeigen von animierten Meldungen
// Auruf z.B. meldung.rot("ein Fehler ist aufgetreten")
// Setup: ein DIV mit id="meldung" muss in hmtml eingebunden werden
var meldung = (function($){

  // schwarze Meldungsbuox anzeigen
  var schwarz = function(text){
    var mld = $('<div class="meldung schwarz"><span>'+text+'</span></div>');
    $("#meldung").append($(mld));
    $(mld).animate({"right":"12px"}, "fast");
    setInterval(function(){
      $(mld).animate({"right":"-400px"},function(){
        $(mld).remove();
      });
    },4000);
  };

  // grüne Meldungsbuox anzeigen
  var gruen = function(text){
    var mld = $('<div class="meldung gruen"><span>'+text+'</span></div>');
    $("#meldung").append($(mld));
    $(mld).animate({"right":"12px"}, "fast");
    setInterval(function(){
      $(mld).animate({"right":"-400px"},function(){
        $(mld).remove();
      });
    },4000); // ausblenden nach 4 sec
  };

  // rote Meldungsbox anzeigen
  var rot = function(text){
    var mld = $('<div class="meldung rot"><span>'+text+'</span></div>');
    $("#meldung").append($(mld));
    $(mld).animate({"right":"12px"}, "fast");
    setInterval(function(){
      $(mld).animate({"right":"-400px"},function(){
        $(mld).remove();
      });
    },4000);
  };

  // Eventhandler um Meldung durch Klick sofort auszublenden
  $(document).on('click','.meldung', function(){
      $(this).fadeOut(400,function(){ // ausblenden
        $(this).remove();
      });
  });

  return{
    schwarz: schwarz,
    gruen: gruen,
    rot: rot
  };

})(jQuery);
