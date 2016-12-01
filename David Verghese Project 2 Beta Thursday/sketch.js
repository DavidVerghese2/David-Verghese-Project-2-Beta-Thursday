/*There's this scratchy noise that's annoying. I'm not sure if I can get rid of it using p5.  
It might be possible to edit the song to reduce the noise. 

I'd like to find ways to apply the effects in a more musical way. 

//I'm going to to create a virtual instrument, so that the user can play along. 

"You just changed the value of \"filter\", which was a p5 function. 
This could cause problems later if you're not careful."

--I keep getting this message whenever I adjust the effects. 

*/

var osc;
var notes = [];
var ionian = [];
var i;
var fft, mic;
var filterFreq, filterRes;
var delay;

function preload() {
  forest = loadImage("forest2.png");
  medicine = loadSound("Joji - Medicine.mp3");
  medicinedry = loadSound("Joji - Medicine.mp3");
}

function setup() {
  var i = 0;
  var b = 2;
  createCanvas(600, 600);
  rainy = new Raindrop(30, 30, 2, 2, 1, 0, 1, "lowpass");
  bloo = new Raindrop(50, 50, -2, 3, 0, 0, 4, "tempo");
  pan = new Raindrop(300, 50, -2, 3, 0, 0, 4, "panning");
  osc = new p5.Oscillator();
  osc.setType('sawtooth');
  osc.freq(480);
  osc.amp(0, 0);
  //osc.start();
  medicine.loop();
  medicinedry.loop(); // two versions of the same file. One has effects, the other doesn't. This
  // can create some interesting sounds

  // delay doesn't seem to change the sound much. Is it because medicine is a long file?
  delay = new p5.Delay();
  delay.process(medicine, .12, .7, 2300);
  delay.setType('pingPong'); // a stereo effect

  reverb = new p5.Reverb();
  //reverb.process(medicine, 6, 0.2);

  reverb.amp(10);

  notes[0] = 261.63; // c4
  notes[1] = 277.18;
  notes[2] = 293.66; //d4
  notes[3] = 311.13;
  notes[4] = 329.63; //e4
  notes[5] = 349.23; //f4
  notes[6] = 369.99;
  notes[7] = 391.1; //g4
  notes[8] = 415.3;
  notes[9] = 440; //a4
  notes[10] = 466.16;
  notes[11] = 493.88; //b4
  notes[12] = 523.25; //c5
  notes[13] = 554.4; //c#5
  notes[14] = 587.33;

  ionian[0] = notes[0 + b]; //root    MAJOR scale
  ionian[1] = notes[2 + b];
  ionian[2] = notes[4 + b]; //major 3
  ionian[3] = notes[5 + b];
  ionian[4] = notes[7 + b]; //5th
  ionian[5] = notes[9 + b];
  ionian[6] = notes[11 + b]; //major 7th
  ionian[7] = notes[12 + b];



}

function draw() {
  image(forest, 0, 0, width, height);

  if (keyIsPressed === true) {  // this doesn't make any sound
    if (key === 'a') {
      osc.amp(0.1, 0.5);
      osc.freq(ionian[0]);
    }
    if (key === 's') {
      osc.amp(0.1, 0.5);
      osc.freq(ionian[1]);
    }
    if (key === 'd') {
      osc.amp(0.1, 0.5);
      osc.freq(ionian[2]);
    }
    if (key === 'f') {
      osc.amp(0.1, 0.5);
      osc.freq(ionian[3]);
    }
  }


  filter = new p5.LowPass(); // FILTER
  medicine.disconnect();
  medicine.connect(filter);

  filterFreq = map(rainy.position.x, 0, width, 10, 20000);
  filterRes = map(rainy.position.y, 0, height, 15, 5);
  filter.set(filterFreq, filterRes);


  var delTime = map(mouseY, 0, width, 2.0, .01);
  delTime = constrain(delTime, 2.0, .2);
  //console.log(delTime);
  delay.delayTime(delTime);

  var speed = map(bloo.position.x, 0, 80, .9, 1); // changing the rate changes the pitch too
  //speed = constrain(speed, 0.01, 4);
  medicine.rate(speed);

  var speed2 = map(bloo.position.x, 0, 80, .9, 1);
  speed = constrain(speed, 0.01, 4);
  medicinedry.rate(speed);

  var panning = map(pan.position.x, 0., 300, -1.0, 1.0);
  medicine.pan(panning);

  var panning = map(pan.position.x, 0., 300, -1.0, 1.0);
  medicinedry.pan(panning);

  rainy.update();
  rainy.display();

  bloo.update();
  bloo.display();

  pan.update();
  pan.display();


}

function Raindrop(x, y, a, b, c, d, e, f) {
  this.position = createVector(x, y)
  this.velocity = createVector(a, b);
  this.acceleration = createVector(c, d);

  this.update = function() {
    if ((this.position.x < width) && (this.position.y < height) && (this.position.x > 0) && (this.position.y > 0)) {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration / e);
    } else {
      this.velocity.x = this.velocity.x * -1;
      this.velocity.y = this.velocity.y * -1;
      this.position.add(this.velocity);
    }
  }

  this.display = function() {
    fill(127, 0, 30);
    rect(this.position.x, this.position.y, 100, 100);
    textSize(20);
    fill(20);
    text(f, this.position.x, this.position.y + 40);

  }

  this.text = function() {
    textSize(20);
    text(f, this.position.x, this.position.y + 40);
  }

}