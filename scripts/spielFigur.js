var GipfelSturm = GipfelSturm || {};

var spieler_zahl = 0;
var SPIELER_FARBEN = ['#ff0000', '#00ff00', '#0000ff', '#000000']

GipfelSturm.SpielFigur = function SpielFigur(pos_x = 0, pos_y = 0){
  spieler_zahl += 1;
  this.spieler = `spieler${spieler_zahl}`;
  this.farbe = SPIELER_FARBEN[spieler_zahl-1];
  this.pos_x = pos_x;
  this.pos_y = pos_y;

  c = document.createElement('canvas');
  c.width = 50;
  c.height = 50;
  c.style.top = this.pos_x;
  c.style.left = this.pos_y;
  c.style.position = "absolute";
  var ctx = c.getContext('2d');
  ctx.fillStyle=this.farbe;
  ctx.beginPath();
  ctx.arc(25, 25, 25, 0, 2 * Math.PI, false);
  ctx.fill();
  //ctx.fillRect(0,0,c.width, c.height);

  $('#spielfeld').append(c);
}
