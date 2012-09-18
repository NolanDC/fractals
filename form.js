//Contains all code for handling the form stuff

$(function() {
	
	$('#add_rule').click(function() {
		var tor = $('#to_replace').val();
		var rw = $('#replace_with').val();
		addRule(tor, rw);
	});
	
	$('#render').click(function() {
		process();
		$('#url').val(generateURL());
	});
	
	$('#url').click(function() {
		this.select();
	});
	
	$('.remove').live('click', function() {
		$(this).parent().parent().slideUp(function() {
			$(this).remove();
		});
	});
	
	$('.edit').live('click', function() {
		var d = $(this).parent().parent();
		$('#to_replace').val(d.attr('replace'));
		$('#replace_with').val(d.attr('with'));
		d.slideUp(function(){
			$(this).remove();
		});
	});
	
	//Setup buttons
	$('#add_rule').button({
		icons: {secondary:'ui-icon-plus'}
	});
	
	$('#render').button( {
		icons: {secondary:'ui-icon-play'}
	});
	
	//Setup all of the proper sliders
	$('#xpos').slider({
		min: 0,
		max: canvas.width,
		value: canvas.width/2,
		change: function() {
			$('#x_value').html($(this).slider("value"));
		}
	});
	
	$('#ypos').slider({
		min: 0,
		max: canvas.height,
		value: canvas.height/2,
		change: function() {
			$('#y_value').html($(this).slider("value"));
		}
	});
	
	
	$('#start_angle').slider({
		min: 0,
		max: 360,
		value: 60,
		step: 5,
		change: function() {
			$('#start_angle_value').html($(this).slider("value"));
		}
	});	
	
	
	$('#length').slider({
		min: 1,
		max: 20,
		value: 4,
		change: function() {
			$('#length_value').html($(this).slider("value"));
		}
	});	
	
	$('#depth').slider({
		min: 1,
		max: 15,
		value: 4,
		change: function() {
			$('#depth_value').html($(this).slider("value"));
		}
	});	

	if(window.location.search.length > 0){
		parseURL();
	}else{
		//Starting rules
		$('#rule_list').prepend(ruleHTML("F", "F+A++A-F--FF-A+"));
		$('#rule_list').prepend(ruleHTML("A", "-F+AA++A+F--F-A"));		
	}
	
	//Set all default values, so I only have to change them once!
	$('#x_value').html($('#xpos').slider("value"));	
	$('#y_value').html($('#ypos').slider("value"));
	$('#length_value').html($('#length').slider("value"));
	$('#start_angle_value').html($('#start_angle').slider("value"));
	$('#depth_value').html($('#depth').slider("value"));
	
	
	
});


function parseURL() {
	var x = getQueryVariable('x', canvas.width/2) * 1;
	var y = getQueryVariable('y', canvas.height/2) * 1;
	var length = getQueryVariable('l', 4) * 1;
	var start_angle = getQueryVariable('sa', 60) * 1;
	var depth = getQueryVariable('d', 4) * 1;
	var angle = getQueryVariable('a', 60) * 1;
	var start = getQueryVariable('s', 'F');
	var rules = getQueryVariable('r', '');
	
	$('#xpos').slider('value', x);
	$('#ypos').slider('value', y);
	$('#length').slider('value', length);
	$('#start_angle').slider('value', start_angle);
	$('#depth').slider('value', depth);
	$('#angle').val(angle);
	$('#starting').val(start);
	
	rules = rules.split(',');
	for(i = 0; i < rules.length; i+=2) {
		tor = rules[i];
		rw = rules[i+1];
		addRule(tor, rw);
	}
	
}

function generateURL() {
	var str; // = window.location.origin + window.location.pathname;
	
	str = window.location.protocol + "//" + window.location.host + window.location.pathname;
	
	str += "?x=" + sliderValue('xpos') * 1;
	str += "&y=" + sliderValue('ypos') * 1;
	str += "&l=" + sliderValue('length') * 1;
	str += "&d=" + sliderValue('depth') * 1;
	str += "&sa=" + sliderValue('start_angle') * 1;
	str += "&a=" + $('#angle').val() * 1;
	str += "&s=" + $('#starting').val();
	str += "&r=";
	$('.rule').each(function(index, item) {
		var replace = $(this).attr('replace');
		var rwith = $(this).attr('with');
		str += replace + "," + rwith;
		if(index != $('.rule').length - 1) {
			str += ','			
		}
	});
	if(str[str.length-1] == ',') {
		str = str.slice(0, str.length-2);
	}
	return str;
}

function addRule(tor, rw) {
	var str = ruleHTML(tor, rw);
	if(tor.length == 1 && rw.length > 0) {
		$('#rule_list').prepend(str);
	}
	$('#to_replace').val('');
	$('#replace_with').val('');	
}

function ruleHTML(tor, rw) {
	var str = "<li class='rule' replace='" + tor + "' with='" + rw + "'>";
	str += "<div class='replace'>" + tor + "<a class='remove' title='remove' href='#'>remove</a><a class='edit' title='remove' href='#'>edit</a></div>";
	str += "<div class='with'>" + rw + "</div>";
	str +="</li>";
	return str;
}


function process() {
	var start = $('#starting').val();	
	var len = sliderValue('length') * 1;
	var start_angle = sliderValue('start_angle') * 1;
	var angle = $('#angle').val() * 1;
	var depth = sliderValue('depth') * 1;
	var xpos = sliderValue('xpos') * 1;
	var ypos = sliderValue('ypos') * 1;
	
	fractal = new LSystem(len, angle, removeSpaces(start), depth);
	rep = new LRep(fractal, xpos, ypos, start_angle);
	
	//Add each rule to fractal
	$('.rule').each(function(id) {
		var replace = $(this).attr('replace');
		var rwith = $(this).attr('with');
		r = new Rule(removeSpaces(replace), removeSpaces(rwith));
		fractal.add(r);
	});
	
	fractal.compute();
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle="rgb(0,0,0)";
}


function sliderValue(slider) {
	return $('#' + slider).slider("value");
}

//Thanks to http://www.idealog.us/2006/06/javascript_to_p.html
function getQueryVariable(variable, default_value) { 
	var query = window.location.search.substring(1);
	query = query.replace(/\%7C/g, "|").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
	
	var vars = query.split("&"); 
	for (var i=0;i<vars.length;i++) { 
		var pair = vars[i].split("="); 
		if (pair[0] == variable) { 
			return pair[1]; 
		} 
	} 
	return default_value;
}