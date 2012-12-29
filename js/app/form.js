//Contains all code for handling the form stuff
var canvas, ctx

$(function() {

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	//canvas.width = ctx.clientWidth-200;
	canvas.width = window.innerWidth-270;
	canvas.height = window.innerHeight-4;

	ctx.fillStyle="rgb(0,0,0)";

	view.init()
	
	$(document).mousemove(function(e){
		lib.setMouse(e);
	});	
	
	$(canvas).on('click', function() {
		view.setStartCoordinates()
	})

	$('.setting .options').on('click', '> div', function() {
		$option = $(this)
		$option.parent().children('.selected').removeClass('selected')
		$option.addClass('selected')
		return false
	})

	$('#render').on('click', function() {
		view.render()
		return false
	})

	$('#addrule').on('click', function() {
		view.addRule()
		return false
	})

	$('#rules').on('click', '.rule .remove', function() {
		$(this).closest('.rule').fadeOut(function() {
			$(this).remove()
		})
		return false
	})

	$('#rules').on('click', '.rule .edit', function() {
		$(this).closest('.rule').fadeOut(function() {
			$('#replace').val($(this).children('.replace').text())
			$('#with').val($(this).children('.with').text())
			$(this).remove()
		})
		return false
	})

	$('.focus_select').on('click', function() {
		$(this).select()
	})
});
