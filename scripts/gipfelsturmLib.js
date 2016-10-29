function kreisZeichnen (x, y, durchmesser, farbe) {
  // canvas vorbereiten
  var c = document.createElement('canvas');

  c.width = durchmesser;
  c.height = durchmesser;
  c.style.top = y + "px";
  c.style.left = x + "px";
  c.style.position = "absolute";

  // Kreis auf canvas zeichenen (mit Paper.js-Library)
  paper.setup(c);
  with (paper) {
      r = durchmesser / 2;
      var circle = Path.Circle(new Point(r, r), r);
      circle.fillColor = farbe;
      view.draw();
  }

  return c;
}

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
