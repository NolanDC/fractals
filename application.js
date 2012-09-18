
var canvas, ctx, image;
var fractal, rep;

var DIR = {
	RIGHT:1,
	LEFT:2
}

$(function() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	//canvas.width = ctx.clientWidth-200;
	canvas.width = window.innerWidth-270;
	canvas.height = window.innerHeight;
	
	ctx.fillStyle="rgba(230,230,230,50)";
	ctx.fillStyle="rgb(0,0,0)";

	fractal = new LSystem(10, -45, "X", 6);	
	rep = new LRep(fractal, 100, 150, 0);
	
	setInterval(update, 33);
	
});

function update() {
	rep.renderNext(15);
}

function LRep(frac, x, y, angle) {
	this.pos = 0;
	this.x = x;
	this.y = y; 
	this.angle = angle;
	this.stack = new Array();
	this.frac = frac;
	
	this.hasNext = function() {
		return this.pos < this.frac.pattern.length;
	}
	
	this.nextChar = function() {
		return this.frac.pattern.charAt(this.pos++);
	}
	
	this.forward = function(draw) {
		var px = this.x;
		var py = this.y;
		this.x = this.x + Math.cos(degToRad(this.angle))*frac.length;
		this.y = this.y + Math.sin(degToRad(this.angle))*frac.length;
		if(draw == true) {
			meta('ok', true);
			ctx.beginPath();
			ctx.moveTo(parseInt(px), parseInt(py)); 
			ctx.lineTo(parseInt(this.x), parseInt(this.y));
			ctx.stroke();			
		}
	}
	
	this.rotate = function(direction) {
		if(direction == DIR.RIGHT) {
			this.angle += this.frac.angle;
		}else if(direction == DIR.LEFT) {
			this.angle -= this.frac.angle;
		}
	}
	
	this.renderNext = function(speed) {
		var c;

		for(i = 0; i < speed; i++) {
			if(this.hasNext()) {
				c = this.nextChar();			
				switch(c) {
					case '-':
						this.rotate(DIR.RIGHT);
						break;
					case '+':
						this.rotate(DIR.LEFT);
						break;
					case '[':
						this.stack.push(new Position(this.x, this.y, this.angle));
						break;
					case ']':
						pos = this.stack.pop();
						this.x = pos.x;
						this.y = pos.y;
						this.angle = pos.angle;
						break;
					default:
						if(c >= 0 && c < 10){
							break;
						}
						if(c.toUpperCase() == c) {
							this.forward(true);
						}else{
							this.forward(false);
						}
						break;
				}			
			}
		}
	}
	
}



function LSystem(length, angle, initial, depth) {
	this.length = length;
	this.depth = depth; //number of recursive applications -- too deep and it'll get slow!
	this.angle = angle; //Angle at which to turn
	this.initial = initial;
	this.rules = new Array();
	this.pattern = "";
	
	this.add = function(rule) {
		this.rules.push(rule);
	};
	
	this.compute = function() {
		var s = "", p = this.initial;
		var c, used;
		this.pattern = this.initial;
		for(i = 0; i < this.depth; i++) {
			for(j = 0; j < this.pattern.length; j++) {
				c = this.pattern.charAt(j);
				used = false;
				this.rules.forEach(function(rule, id) {
					if(rule.to_replace.charAt(0) == c) {
						s += rule.r;
						used = true;
					}
				});
				if(used == false) s+=c;
			}
			this.pattern = s;
			s = "";
		}
		return this.pattern;
	}
}


function Rule(to_r, r) {
	this.to_replace = to_r;
	this.r = r;
}

function Position(x, y, a) {
	this.x = x;
	this.y = y;
	this.angle = a;
}

function radToDeg(rad) {
	return rad*180/Math.PI;
}

function degToRad(deg) {
	return deg*Math.PI/180;
}

function rand(low, high) {
	return Math.random() * (high-low) + low;
}


function meta(info, clear) {
	if(clear == true) {
		$('#meta').html(info);
	}else {
		$('#meta').html($('#meta').html() + "<br />" + info);
	}
}

function removeSpaces(string) {
 return string.split(' ').join('');
}