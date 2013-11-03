/* Content:
 *
 	* SETTINGS
 	* TRIGGER
 	* TRIGGER
 	* FUNCTIONS
 *
 */

/*
 * SETTINGS
 */

var hoverZoom = [0, 0, 85, 85, 85, 90, 90, 90, 90]; // defines zoomfactor for each rowlength, count-1 = rowlengthOptions
var hover_offset_border = 10;

var rowlengthClass = 'simplery-';
var autoRowWidth = 200;


/*
 * TRIGGER 
 */

// when html is loaded
$(document).ready(function() {

	$(".simplery-nojs").each(function() {
		$(this).removeClass("simplery-nojs");
		$(this).addClass("simplery-box");
	});

});

// when css+images are loaded
$(window).load(function() {
	
	$(".simplery-box").each(function() {
		$(this).simpleryBoxLayout();
	});

	$(".simplery-box li").hover(
		function() {$(this).simpleryBoxImageHover(1);},
		function() {$(this).simpleryBoxImageHover(0);}
	);

});

// when window is resized
$(window).resize(function() {

	$(".simplery").each(function() {
		var galery = $(this);
		if (galery.hasClass('simplery-box') 
				&& (!galery.data('simplery-rowlength') 
				|| galery.data('simplery-rowlength') == 'auto')
			|| galery.hasClass('simplery-fullscreen')
				&& (!galery.data('simplery-rowlength-fullscreen') 
				|| galery.data('simplery-rowlength-fullscreen') == 'auto')
		) {
			galery.simpleryAutoRowlength();
		}
	});

	$(".simplery").each(function() {
		$(this).simpleryBoxSize();
	});

});

// fix iOS hover after back button, see: https://coderwall.com/p/bevnew
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    $(window).on('pageshow', function(e) {
        if (e.originalEvent.persisted) {
            window.location.reload();
        }
    });
}


/*
 * FUNCTIONS
 */

// initial layout for the simplery box
(function( $ ){$.fn.simpleryBoxLayout = function() {
	var galery = $(this);
	var ul = galery.find("ul");
	var li = galery.find("li");
	var img = galery.find("img");

	if (!galery.data('simplery-rowlength') || galery.data('simplery-rowlength') == 'auto') {
		galery.simpleryAutoRowlength();
	}
	else {
		galery.addClass(rowlengthClass + galery.data('simplery-rowlength'));
	}

	// fix li linebreak whitespace
	var fontSize = ul.css("font-size");
	ul.css("font-size", "0px");
	li.css("font-size", fontSize);

	// add menu to header
	galery.simpleryAddMenu('box');
	
	galery.simpleryBoxSize();

	return this;
};})( jQuery );

// define rowlength by window size
(function( $ ){$.fn.simpleryAutoRowlength = function() {
	var galery = $(this);

	// remove rowlength classes
	for (var i = hoverZoom.length-1; i >= 1; i--)
		galery.removeClass(rowlengthClass + i.toString());

	var rowlength;
	if (galery.width() < 3 * autoRowWidth)
		rowlength = '3';
	else if (galery.width() < 4 * autoRowWidth)
		rowlength = '4';
	else if (galery.width() < 5 * autoRowWidth)
		rowlength = '5';
	else if (galery.width() < 6 * autoRowWidth)
		rowlength = '6';
	else if (galery.width() < 7 * autoRowWidth)
		rowlength = '7';
	else if (galery.width() >= 7 * autoRowWidth)
		rowlength = '8';

	galery.addClass(rowlengthClass + rowlength.toString());

	return this;
};})( jQuery );


// size for the simplery box
(function( $ ){$.fn.simpleryBoxSize = function() {
	var galery = $(this);
	var li = galery.find("li");
	var img = galery.find("img");
	var blockWidth = li.width();

	li.each(function() {
		$(this).height(blockWidth);
	});

	img.each(function() {
		$(this).simpleryBoxImageSize(blockWidth);
	});	

	return this;
};})( jQuery );


// set size of the images in a simplery box
(function( $ ){$.fn.simpleryBoxImageSize = function(width) {
	var img = $(this);
	var li = img.parent().parent();

	var blockWidth = li.width();
	var height = width;
	var ratio = Math.round(img.width() / img.height() * 10) / 10;

	if (ratio < 1) // portrait
		height = width * 1 / ratio;
	else // landscape
		width = width * ratio;

	img.width(width);
	img.height(height);

	img.css("left", (blockWidth - width) / 2);
	img.css("top", (blockWidth - height) / 2);

	return this;
};})( jQuery );


// add menu to galery
(function( $ ){$.fn.simpleryAddMenu = function(mode) {
	var galery = $(this);

	if (mode == 'box')
		mode = 'fa-resize-full'; // 'fa-resize-fullscreen', 'fa-move'
	else if (mode == 'fullscreen')
		mode = 'fa-resize-small';

	// grid = 'fa-th', 'fa-th-large'
	// arrows = 'fa-chevron-left' (right, up), 'fa-chevron-circle-right', 'fa-angle-double-up', 'fa-angle-up', 'fa-caret-up'
	// play = 'fa-play', 'fa-play-circle', 'fa-youtube-play', 'fa-caret-square-o-right'
	// info = 'fa-tags', 'fa-info', 'fa-info-circle', 'fa-camera'
	// description = 'fa-align-justify', 'fa-reorder'
	// help = 'fa-question', 'fa-question-circle'

	galery.append('<div class="simplery-menu">'
		+ '<i class="fa fa-th simplery-menu-grid"></i>'
		+ '<i class="fa fa-info simplery-menu-info"></i>'
		+ '<i class="fa '+ mode +' simplery-menu-fullscreen"></i>'
		+ '<i class="fa fa-question-circle simplery-menu-help"></i>'
		+ '</div>');
	galery.find('.simplery-menu-fullscreen').each(function() {
		$(this).click(function() {
			galery.simpleryToggleFullscreen();
		})
	});

	return this;
};})( jQuery );


// fullscreen
(function( $ ){$.fn.simpleryToggleFullscreen = function() {
	var body = $('body');
	var galery = $(this);

	if (galery.hasClass('simplery-fullscreen')) {
		body.css('overflow','auto');
		galery.remove();
	}
	else if(galery.hasClass('simplery-box')) {
		body.css('overflow','hidden');
		body.append('<div class="simplery simplery-fullscreen"></div>');

		var galeryFullscreen = $('.simplery-fullscreen');

		if (galery.data('simplery-rowlength-fullscreen')) {
			var rowlength = galery.data('simplery-rowlength-fullscreen');
			galeryFullscreen.addClass(rowlengthClass + rowlength);
		}
		else {
			galeryFullscreen.simpleryAutoRowlength();
		}
		
		galeryFullscreen.append(galery.find('header').clone());
		galeryFullscreen.simpleryAddMenu('fullscreen');
		galeryFullscreen.append(galery.find('ul').clone());
		galeryFullscreen.simpleryBoxSize();

		// add hover 
		var li = galeryFullscreen.find('li');
		li.each(function() {
			$(this).hover(
				function() {$(this).simpleryBoxImageHover(1);},
				function() {$(this).simpleryBoxImageHover(0);}
			);
		});
	}

	return this;
};})( jQuery );


// hover
(function( $ ){$.fn.simpleryBoxImageHover = function(mouseIn) {
	var li = $(this);
	var galery = li.parent().parent();
	var img = li.find("img");

	var blockWidth = li.width();

	if (mouseIn == 1) {
		var rowlength = galery.simpleryGetRowlength();

		img.simpleryBoxImageSize(blockWidth * (hoverZoom[rowlength] * 1/100));

		// wait until transition proceeded to check if image will be outisde of window
		setTimeout(function() {
			var spaceToLeft = li.offset().left + parseFloat(img.css("left"));
			var spaceToRight = $(window).width() - img.offset().left - img.width();

			if (spaceToLeft < hover_offset_border && spaceToRight > hover_offset_border)
				img.css("left", parseFloat(img.css("left")) - spaceToLeft + hover_offset_border);
			if (spaceToRight < hover_offset_border && spaceToLeft > hover_offset_border)
				img.css("left", parseFloat(img.css("left")) + spaceToRight - hover_offset_border);
			if (spaceToRight < hover_offset_border && spaceToLeft < hover_offset_border)
				img.simpleryBoxImageSize(blockWidth/1.5);

		}, img.css('transition-duration').substring(0, 3)*1000+100);
	}
	else {
		img.simpleryBoxImageSize(blockWidth);
	}

	return this;
};})( jQuery );

// determine rowlength from class name
(function( $ ){$.fn.simpleryGetRowlength = function(mouseIn) {
	var galery = $(this);

	var rowlength = 0;
	for (var i = hoverZoom.length-1; i >= 1; i--)
		if (galery.hasClass(rowlengthClass + i))
			rowlength = i;

	return rowlength;
};})( jQuery );