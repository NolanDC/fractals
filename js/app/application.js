

view = {
	init: function() {
		$('#startx').text(parseInt((window.innerWidth-$('#side').width()) / 2))
		$('#starty').text(parseInt(window.innerHeight / 2))
		view.createFractal()
	},

	createFractal: function() {
		var params = Queryables.getAll()

		if(window.location.search.length == 0) 
			return

			$('#splash').hide()
			var readableParams = {
				x: parseInt(params.x),
				y: parseInt(params.y),
				initial: params.s, 
				rules: params.r.split(','),
				angleIncrement: parseInt(params.a),
				angle: parseInt(params.sa),
				iterations: parseInt(params.d),
				lineLength: parseInt(params.l)
			}

			$.extend(fractal, readableParams)
			view.setFormValues(readableParams)
			fractal.compute()
			this.update()

	},

	update: function() {
		fractal.render()
		if(fractal.index < fractal.string.length) {
			setTimeout(function(){view.update()}, 1000/30)
		}
	},

	setStartCoordinates: function() {
		$('#startx').text(lib.mouse.x)
		$('#starty').text(lib.mouse.y)
	},

	setFormValues: function(params) {
		$('#startx').text(params.x)
		$('#starty').text(params.y)
		$('#angle').val(params.angle)
		$('#increment').val(params.angleIncrement)
		$('#pattern').val(params.initial)

		$('.options .selected').removeClass('selected')
		$('#length div:contains(' + params.lineLength + ')').addClass('selected')
		$('#iterations div:contains(' + params.iterations + ')').addClass('selected')

		$('#rules').html('')
		for(var i = 0; i < params.rules.length; i+=2) {
			var html = view.templates.rule_template({replace: params.rules[i], rwith: params.rules[i+1]})
			$('#rules').append(html)
		}
	},

	getFormValues: function() {
		return {
			x: $('#startx').text() * 1,
			y: $('#starty').text() * 1,
			l: $('#length .selected').text() * 1,
			d: $('#iterations .selected').text() * 1,
			sa: $('#angle').val() * 1,
			a: $('#increment').val() * 1,
			s: $('#pattern').val(),
			r: view.getRules()
		}
	},

	getRules: function() {
		var rules = []
		$('.rule').each(function(index) {
			rules.push($(this).children('.replace').text())
			rules.push($(this).children('.with').text())
		})
		return rules
	},

	render: function() {
		var url = Queryables.compose(view.getFormValues())
		console.log(url)
		window.location = url
	}, 

	addRule: function() {
		var replace = $('#replace').val()
			, rwith = $('#with').val()
			, context = {replace: replace, rwith: rwith}

		if(replace.length && rwith.length) {
			$('#rules').append(view.templates.rule_template(context))
		}
		$('#replace, #with').val('')
	},

	templates: {
		rule_template: Handlebars.compile( $('#rule_template').html() )
	}
}

fractal = {
	x: 0,
	y: 0,
	angle: 0,
	lineLength: 4,
	angleIncrement: 60,
	positionStack: [],
	renderSpeed: 105,
	index: 0,
	
	iterations: 4,
	rules: [],
	initial: '',
	string: '',

	render: function() {
		var str = this.string.substring(this.index, Math.min(this.string.length-1, this.index+this.renderSpeed))
			, c = ''
			, px = 0
			, py = 0
		this.index += str.length
		for(var i = 0; i < str.length; i++) {
			c = str[i]
			switch(c) {
				case '-': 
					this.angle -= this.angleIncrement
					break;
				case '+':
					this.angle += this.angleIncrement
					break;
				case '[':
					this.positionStack.push({x: this.x, y: this.y, angle: this.angle})
					break;
				case ']':
					var pos = this.positionStack.pop()
					this.x = pos.x
					this.y = pos.y
					this.angle = pos.angle
					break;
				default:
					if(parseInt(c) == c) break;
					px = this.x
					py = this.y
					this.x += Math.cos(lib.degToRad(this.angle)) * this.lineLength
					this.y += Math.sin(lib.degToRad(this.angle)) * this.lineLength
					if(c.toUpperCase() == c) {
						ctx.beginPath()
							ctx.moveTo(parseInt(px), parseInt(py))
							ctx.lineTo(parseInt(this.x), parseInt(this.y))
						ctx.stroke()
					}
			}
		}
	},

	compute: function() {
		//Computes the pattern based on rules and initial pattern
		this.string = this.initial
		var ch, temp = '', rule, used

		for(var i = 0; i < this.iterations; i++) {
			for(var j = 0; j < this.string.length; j++) {
				ch = this.string.charAt(j)
				used = false
				for(var r = 0; r < this.rules.length; r+=2) {
					if(this.rules[r].charAt(0) == ch) {
						temp += this.rules[r+1]
						used = true
					}
				}
				//Add the character to the pattern if it has not been replaced by a rule
				if(used == false) {
					temp += ch
				}
			}
			this.string = temp
			temp = ''
		}		
	}
}

lib = {
	mouse: {x: 0, y: 0},
	radToDeg: function(rad) {
		return rad*180/Math.PI
	},
	degToRad: function(deg) {
		return deg*Math.PI/180
	}, 
	rand: function(low, high) {
		return Math.random() * (high-low) + low
	},
	removeSpaces: function(string) {
		return string.split(' ').join('')
	},
	setMouse: function(e) {
		this.mouse.x = e.pageX - canvas.offsetLeft
		this.mouse.y = e.pageY - canvas.offsetTop
	}
}