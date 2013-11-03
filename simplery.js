/* Content:
 *
 	* SETTINGS
 	* TRIGGER
 	* TRIGGER
 	* LAYOUT
 	* FULLSCREEN
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
	
	var galery = $(".simplery-box");

	// prepare box layout of galery
	galery.each(function() {
		$(this).simpleryBoxLayout();
	});

	// change links to toggle fullscreen
	galery.simpleryInitClick(galery);

	// set hover 
	galery.find("li").hover(
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
			|| galery.hasClass('simplery-fullscreen-grid')
				&& (!galery.data('simplery-rowlength-fullscreen') 
				|| galery.data('simplery-rowlength-fullscreen') == 'auto')
		) {
			galery.simpleryAutoRowlength();
		}
	});

	$(".simplery-box, .simplery-fullscreen-grid").each(function() {
		$(this).simpleryBoxSize();
	});

	$('.simplery-fullscreen-active img').simpleryFullscreenSingleSize();

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
 * LAYOUT
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
	galery.simpleryAddMenu('box', galery);
	
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
	if 		(galery.width() < 3 * autoRowWidth) 	rowlength = '3';
	else if (galery.width() < 4 * autoRowWidth) 	rowlength = '4';
	else if (galery.width() < 5 * autoRowWidth) 	rowlength = '5';
	else if (galery.width() < 6 * autoRowWidth) 	rowlength = '6';
	else if (galery.width() < 7 * autoRowWidth) 	rowlength = '7';
	else if (galery.width() >= 7 * autoRowWidth) 	rowlength = '8';

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
	var ratio = getImageRatio(img.width(), img.height());

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
(function( $ ){$.fn.simpleryAddMenu = function(mode, galerySrc) {
	var galery = $(this);

	var mode_icon = '';
	if (mode == 'box')
		mode_icon = 'fa-resize-full'; // 'fa-resize-fullscreen', 'fa-move'
	else if (mode == 'fullscreen')
		mode_icon = 'fa-resize-small';

	// grid = 'fa-th', 'fa-th-large'
	// arrows = 'fa-chevron-left' (right, up), 'fa-chevron-circle-right', 'fa-angle-double-up', 'fa-angle-up', 'fa-caret-up'
	// play = 'fa-play', 'fa-play-circle', 'fa-youtube-play', 'fa-caret-square-o-right'
	// info = 'fa-tags', 'fa-info', 'fa-info-circle', 'fa-camera'
	// description = 'fa-align-justify', 'fa-reorder'
	// help = 'fa-question', 'fa-question-circle'

	galery.append('<div class="simplery-menu">'
		//+ '<i class="fa fa-info simplery-menu-info"></i>'
		+ '<i class="fa '+ mode_icon +' simplery-menu-fullscreen"></i>'
		//+ '<i class="fa fa-question-circle simplery-menu-help"></i>'
		+ '</div>');

	var fullscreens = galery.find('.simplery-menu-fullscreen');

	fullscreens.each(function() {
		$(this).click(function() {
			galery.simpleryFullscreenEnd();
			if (mode == 'box')
				galery.simpleryFullscreenStart();				
		})
	});

	return this;
};})( jQuery );

// modify menu to show items for single image view
(function( $ ){$.fn.simpleryMenuActive = function(galery) {
	var menu = $(this);
	$('<i class="fa fa-th simplery-menu-grid"></i>').insertBefore(menu.find('.simplery-menu-fullscreen'));

	menu.find('.simplery-menu-grid').each(function() {
		$(this).click(function() {
			galery.simpleryFullscreenStart();
		})
	});

	return this;
};})( jQuery );


/*
 * FULLSCREEN
 */

// fullscreen end
(function( $ ){$.fn.simpleryFullscreenEnd = function() {
	var body = $('body');
	body.css('overflow','auto');

	var galeryFullscreen = $('.simplery-fullscreen');
	galeryFullscreen.remove();

	return this;
};})( jQuery );

// fullscreen start
(function( $ ){$.fn.simpleryFullscreenStart = function(img) {
	var galery = $(this);
	galery.simpleryFullscreenEnd();

	var body = $('body');
	body.css('overflow','hidden');
	body.append('<div class="simplery simplery-fullscreen"></div>');	
	var galeryFullscreen = $('.simplery-fullscreen');

	galeryFullscreen.simpleryAddMenu('fullscreen');
	
	if (img) {
		galeryFullscreen.simpleryFullscreenSingleInit(galery, img);
		galeryFullscreen.simpleryFullscreenSingleShow(img);
	}
	else {
		galeryFullscreen.addClass('simplery-fullscreen-grid');
		if (galery.data('simplery-rowlength-fullscreen')) {
			var rowlength = galery.data('simplery-rowlength-fullscreen');
			galeryFullscreen.addClass(rowlengthClass + rowlength);
		}
		else {
			galeryFullscreen.simpleryAutoRowlength();
		}
		
		galeryFullscreen.append(galery.find('header').clone());
		galeryFullscreen.append(galery.find('ul').clone());
		galeryFullscreen.simpleryBoxSize();

		// change links to toggle fullscreen
		galeryFullscreen.simpleryInitClick(galery);

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

// fullscreen init single view
(function( $ ){$.fn.simpleryFullscreenSingleInit = function(galery, img) {
	var galeryFullscreen = $(this);

	galeryFullscreen.addClass('simplery-fullscreen-single');
	galeryFullscreen.find('ul').remove();
	galeryFullscreen.find('header').remove();

	galeryFullscreen.find('.simplery-menu').simpleryMenuActive(galery);
	galeryFullscreen.append('<div class="simplery-fullscreen-active"></div>');
	galeryFullscreen.append('<div class="simplery-fullscreen-prev"><div></div><i class="fa fa-angle-left"></i></div>');
	galeryFullscreen.append('<div class="simplery-fullscreen-next"><div></div><i class="fa fa-angle-right"></i></div>');
	galeryFullscreen.append('<div class="simplery-fullscreen-nav"></div>');

	return this;
};})( jQuery );

// fullscreen init single view
(function( $ ){$.fn.simpleryFullscreenSingleShow = function(img) {
	var galeryFullscreen = $(this);
	var li = img.parent().parent();

	// active
	var active = $('.simplery-fullscreen-active');
	active.empty();
	a = li.find("a");
	active.append('<img src="' + a.attr('href') + '" />');

	var activeImg = active.find('img');

	activeImg.load(function() {
		activeImg.simpleryFullscreenSingleSize();
	});

	// prev
	var prev = $('.simplery-fullscreen-prev');
	var prevImg = li.prev().find('img');
	//prev.find('div').empty().prepend('<img src="' + prevImg.attr('src') + '" />');
	prev.click(function(e) {
		galeryFullscreen.simpleryFullscreenSingleShow(prevImg);
	});
	
	// next
	var next = $('.simplery-fullscreen-next');
	var nextImg = li.next().find('img');
	//next.find('div').empty().prepend('<img src="' + nextImg.attr('src') + '" />');
	next.click(function(e) {
		galeryFullscreen.simpleryFullscreenSingleShow(nextImg);
	});

	return this;
};})( jQuery );

// fullscreen single view image size
(function( $ ){$.fn.simpleryFullscreenSingleSize = function() {
	var img = $(this);
	var active = $('.simplery-fullscreen-active');

	var ratioImg = getImageRatio(img.width(), img.height());
	var ratioBox = getImageRatio(active.width(), active.height());

	if (ratioImg > ratioBox) {
		img.width(active.width());
		if (img.height() > active.height()) {
			img.height(active.height());
			img.width(active.height() * ratioImg);
		}
	}
	else {
		img.height(active.height());
		if (img.width() > active.width()) {
			img.width(active.width());
			img.height(active.width() * ratioImg);
		}
	}

	// vertical center
	if (img.height() < active.height())
		img.css('top', (active.height() - img.height()) / 2);

	return this;
};})( jQuery );


 /*
 * FUNCTIONS
 */
function getImageRatio(width, height) {
	return Math.round(width / height * 10) / 10;
}

// determine rowlength from class name
(function( $ ){$.fn.simpleryGetRowlength = function(mouseIn) {
	var galery = $(this);

	var rowlength = 0;
	for (var i = hoverZoom.length-1; i >= 1; i--)
		if (galery.hasClass(rowlengthClass + i))
			rowlength = i;

	return rowlength;
};})( jQuery );


// change links to toggle fullscreen
(function( $ ){$.fn.simpleryInitClick = function(galery) {
	$(this).find("img").each(function() {
		var img = $(this);
		var a = img.parent();

		a.click(function(e) {
			e.preventDefault();
			galery.simpleryFullscreenStart(img);
		});
	});

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





