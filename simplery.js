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
 *
 */

// defines zoomfactor for each rowlength | count-1 = rowlengthOptions | should be an odd length
var hoverZoom = [0, 0, 85, 85, 85, 90, 90, 90, 90, 90, 95, 95]; 
var hover_offset_border = 10;

var rowlengthClass = 'simplery-';
var autoRowWidth = 200;

var activeGalery;
var isFullscreen = 0; // 0: false, 1: fullscreen-grid, 2: fullscreen-single
var nextImage;
var prevImage;


/*
 * TRIGGER
 *
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
	galery.each(function() {
		$(this).simpleryInitClick();
	});

	// set hover 
	galery.find("li").hover(
		function() {$(this).simpleryBoxImageHover(1);},
		function() {$(this).simpleryBoxImageHover(0);}
	);

});

// register shortcuts, additional KeyCodes: http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
$(document).keydown(function(e){
	var galeryFull = $('.simplery-fullscreen');

	var help = galeryFull.find('.simplery-help');
	if (help.is('div')) {
		if (e.which == 27) // escape
			galeryFull.simpleryHelp();
	}
	else if (isFullscreen != 0) {
		if (e.which == 27) // escape
			galeryFull.simpleryFullscreenEnd(); 
	}



	if (isFullscreen == 2) {
		if ((e.which) == 37) // left arrow
			if (prevImage.attr('src') != '')
				galeryFull.simpleryFullscreenStart(prevImage); 

		if ((e.which) == 39) // right arrow
			if (nextImage.attr('src') != '')
				galeryFull.simpleryFullscreenStart(nextImage); 

		if ((e.which) == 71) // g
			activeGalery.simpleryFullscreenStart(); 
	}
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
 *
 */

// initial layout for the simplery box
(function( $ ){$.fn.simpleryBoxLayout = function(noMenu) {
	var galery = $(this);
	var ul = galery.find("ul");
	var li = galery.find("li");
	var img = galery.find("img");

	if (!galery.data('simplery-rowlength') || galery.data('simplery-rowlength') == 'auto')
		galery.simpleryAutoRowlength();
	else
		galery.addClass(rowlengthClass + galery.data('simplery-rowlength'));

	// fix li linebreak whitespace
	var fontSize = ul.css("font-size");
	ul.css("font-size", "0px");
	li.css("font-size", fontSize);

	// add menu to header
	if (!noMenu)
		galery.simpleryAddMenu('box', galery);
	
	galery.simpleryBoxSize();

	return this;
};})( jQuery );

// define rowlength by window size
(function( $ ){$.fn.simpleryAutoRowlength = function(getNumber) {
	var galery = $(this);

	// remove rowlength classes
	for (var i = hoverZoom.length-1; i >= 1; i--)
		galery.removeClass(rowlengthClass + i.toString());

	var rowlength;
	if 		(galery.width() < 3 * autoRowWidth) 	rowlength = 3;
	else if (galery.width() < 4 * autoRowWidth) 	rowlength = 4;
	else if (galery.width() < 5 * autoRowWidth) 	rowlength = 5;
	else if (galery.width() < 6 * autoRowWidth) 	rowlength = 6;
	else if (galery.width() < 7 * autoRowWidth) 	rowlength = 7;
	else if (galery.width() < 8 * autoRowWidth) 	rowlength = 8;
	else if (galery.width() >= 8 * autoRowWidth) 	rowlength = 9;

	var add = 0;
	if (galery.data('simplery-rowlength-add'))
		add = galery.data('simplery-rowlength-add');		
 
	rowlength += add;

	// change if it should be even or odd
	if (galery.data('simplery-rowlength-even') == 'uneven' && rowlength%2 == 0)
		rowlength += 1;
	else if (galery.data('simplery-rowlength-even') == 'even' && rowlength%2 == 1)
		rowlength -= 1;
	
	// change if the calculated length is not supported
	if (rowlength > hoverZoom.length-1)
		rowlength = hoverZoom.length-1;

	if (getNumber)
		return rowlength;
	else {
		galery.addClass(rowlengthClass + rowlength.toString());
		return this;
	}
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
		$(this).simpleryBoxImageSize(parseFloat(blockWidth));
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

	// grid = 'fa-th', 'fa-th-large'
	// arrows = 'fa-chevron-left' (right, up), 'fa-chevron-circle-right', 'fa-angle-double-up', 'fa-angle-up', 'fa-caret-up'
	// play = 'fa-play', 'fa-play-circle', 'fa-youtube-play', 'fa-caret-square-o-right'
	// info = 'fa-tags', 'fa-info', 'fa-info-circle', 'fa-camera'
	// description = 'fa-align-justify', 'fa-reorder'
	// help = 'fa-question', 'fa-question-circle'


	var mode_icon = '';
	if (mode == 'box')
		mode_icon = 'fa-resize-full'; // 'fa-resize-fullscreen', 'fa-move'
	else if (mode == 'fullscreen')
		mode_icon = 'fa-resize-small';

	galery.append('<div class="simplery-menu">'
		//+ '<i class="fa fa-info simplery-menu-info"></i>'
		+ '<i class="fa '+ mode_icon +' simplery-menu-fullscreen"></i>'
		//+ '<i class="fa fa-question-circle simplery-menu-help"></i>'
		+ '<i class="fa fa-question-circle simplery-menu-help"></i>'
		+ '</div>');

	galery.find('.simplery-menu-fullscreen').each(function() {
		$(this).click(function() {
			if (mode == 'box')
				galery.simpleryFullscreenStart();
			else
				galery.simpleryFullscreenEnd();			
		})
	});
	galery.find('.simplery-menu-help').each(function() {
		$(this).click(function() {
			galery.simpleryHelp();			
		})
	});

	return this;
};})( jQuery );

// modify menu to show items for single image view
(function( $ ){$.fn.simpleryMenuActive = function() {
	var menu = $(this);
	$('<i class="fa fa-th simplery-menu-grid"></i>').insertBefore(menu.find('.simplery-menu-fullscreen'));

	menu.find('.simplery-menu-grid').each(function() {
		$(this).click(function() {
			activeGalery.simpleryFullscreenStart();
		})
	});

	return this;
};})( jQuery );


/*
 * FULLSCREEN
 *
 */

// fullscreen end
(function( $ ){$.fn.simpleryFullscreenEnd = function() {
	var body = $('body');
	body.css('overflow','auto');

	$('.simplery-fullscreen').remove();
	activeGalery = null;
	isFullscreen = 0;
	nextImage = null
	prevImage = null

	return this;
};})( jQuery );

// fullscreen start
(function( $ ){$.fn.simpleryFullscreenStart = function(single) {
	if ( ! activeGalery)
		activeGalery = $(this);
	$('.simplery-fullscreen').remove();

	var body = $('body');
	body.css('overflow','hidden');
	body.append('<div class="simplery simplery-fullscreen"></div>');	
	var galeryFull = $('.simplery-fullscreen');

	galeryFull.simpleryAddMenu('fullscreen');
	
	if (single) {
		isFullscreen = 2;
		galeryFull.simpleryFullscreenSingleInit();
		single.simpleryFullscreenSingleView();
	}
	else {
		isFullscreen = 1;
		galeryFull.simpleryFullscreenGridInit();
	}

	return this;
};})( jQuery );

// fullscreen grid single view
(function( $ ){$.fn.simpleryFullscreenGridInit = function() {
	var galeryFull = $(this);

	galeryFull.addClass('simplery-fullscreen-grid');
	if (activeGalery.data('simplery-rowlength-fullscreen')) {
		var rowlength = activeGalery.data('simplery-rowlength-fullscreen');
		galeryFull.addClass(rowlengthClass + rowlength);
	}
	else {
		galeryFull.simpleryAutoRowlength();
	}
	
	galeryFull.append(activeGalery.find('header').clone());
	galeryFull.append(activeGalery.find('ul').clone());
	galeryFull.simpleryBoxSize();

	// change links to toggle fullscreen
	galeryFull.simpleryInitClick();

	// add hover 
	var li = galeryFull.find('li');
	li.each(function() {
		$(this).hover(
			function() {$(this).simpleryBoxImageHover(1);},
			function() {$(this).simpleryBoxImageHover(0);}
		);
	});

	return this;
};})( jQuery );

// fullscreen init single view
(function( $ ){$.fn.simpleryFullscreenSingleInit = function() {
	var galeryFull = $(this);

	galeryFull.addClass('simplery-fullscreen-single');
	galeryFull.find('ul').remove();
	galeryFull.find('header').remove();

	galeryFull.find('.simplery-menu').simpleryMenuActive();
	galeryFull.append('<div class="simplery-fullscreen-active"></div>');
	galeryFull.append('<div class="simplery-fullscreen-prev"><div></div><i class="fa fa-angle-left"></i></div>');
	galeryFull.append('<div class="simplery-fullscreen-next"><div></div><i class="fa fa-angle-right"></i></div>');
	galeryFull.append('<div class="simplery-fullscreen-nav simplery simplery-fullscreen"' +
			' data-simplery-rowlength-add="3" data-simplery-rowlength-even="uneven"></div>');

	return this;
};})( jQuery );

// fullscreen view single image
(function( $ ){$.fn.simpleryFullscreenSingleView = function() {
	var img = $(this);
	var li = img.parent().parent();

	// active
	var active = $('.simplery-fullscreen-active');
	active.append('<img src="' + img.parent().attr('href') + '" />');
	var activeImg = active.find('img');
	activeImg.load(function() {
		activeImg.simpleryFullscreenSingleSize();
	});

	// next
	var next = $('.simplery-fullscreen-next');
	nextImage = img.simpleryGetNextImage('next');
	if (nextImage.attr('src') != '') {
		//next.find('div').empty().prepend('<img src="' + nextImg.attr('src') + '" />');
		next.click(function(e) {
			activeGalery.simpleryFullscreenStart(nextImage);
		});
	}
	else
		next.addClass('simplery-inactive');

	// prev
	var prev = $('.simplery-fullscreen-prev');
	prevImage = img.simpleryGetNextImage('prev');
	if (prevImage.attr('src') != '') {
		//prev.find('div').empty().prepend('<img src="' + prevImg.attr('src') + '" />');
		prev.click(function(e) {
			activeGalery.simpleryFullscreenStart(prevImage);
		});		
	}
	else
		prev.addClass('simplery-inactive');

	// nav
	img.simpleryFullscreenSingleViewNav();

	return this;
};})( jQuery );

// fullscreen single view set nav
(function( $ ){$.fn.simpleryFullscreenSingleViewNav = function() {
	var img = $(this);
	var nav = $('.simplery-fullscreen-nav');
	nav.empty();
	var rowlength = nav.simpleryAutoRowlength(true);
	var sidelength = (rowlength / 2).toFixed(0) - 1;
	
	var ul = $('<ul></ul>');

	var newLi = $('<li class="active"><a href=""></a></li>');
	var a = newLi.find('a');
	a.append(img.clone());
	ul.append(newLi);
	a.setClick(img);

	var nextImages = new Array();
	nextImages.push(img.simpleryGetNextImage('next'));//li.next().find('img');
	
	var prevImages = new Array();
	prevImages.push(img.simpleryGetNextImage('prev'));//li.prev().find('img');

	for (var i = 0; i < sidelength; i++) {
		var nextLi = $('<li><a href=""></a></li>');
		var nextA = nextLi.find('a');
		nextA.append(nextImages[i].clone());
		ul.append(nextLi);
		nextA.setClick(nextImages[i]);

		nextImages.push(nextImages[i].simpleryGetNextImage('next'));

		var prevLi = $('<li><a href=""></a></li>');
		var prevA = prevLi.find('a');
		prevA.append(prevImages[i].clone());
		ul.prepend(prevLi);
		prevA.setClick(prevImages[i]);

		prevImages.push(prevImages[i].simpleryGetNextImage('prev'));
	}

	nav.append(ul);
	nav.simpleryBoxLayout(true);

	return this;
};})( jQuery );

// set click outisde of loop to prevent closures
(function( $ ){$.fn.setClick = function(img) {
	$(this).click(function(e) {
		e.preventDefault();
		activeGalery.simpleryFullscreenStart(img);
	});

	return this;
};})( jQuery );

// fullscreen single view image size
(function( $ ){$.fn.simpleryGetNextImage = function(next) {
	var img = $(this);
	var li = img.parent().parent();
	
	var newImg = $('<img src="" />');
	if (next == 'next' && li.next().find('img').is('img')) 
		newImg = li.next().find('img');
	else if (next == 'prev' && li.prev().find('img').is('img')) 
		newImg = li.prev().find('img');

	return newImg;
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
 *
 */
function getImageRatio(width, height) {
	var num = width / height;
	return num.toFixed(1);
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
(function( $ ){$.fn.simpleryInitClick = function() {
	var galery = $(this);
	galery.find("img").each(function() {
		var img = $(this);
		var a = img.parent();

		a.click(function(e) {
			e.preventDefault();
			galery.simpleryFullscreenStart(img);
		});
	});

	return this;
};})( jQuery );

// change links to toggle fullscreen
(function( $ ){$.fn.simpleryHelp = function() {
	var galery = $(this);
	var help = galery.find('.simplery-help');
	if (help.is('div'))
		help.remove();
	else
		galery.append('<div class="simplery-help"><div class="simplery-help-bg"></div><table>'
			+ '<tr><td class="simplery-help-close" colspan="2"><a href="">close</a></td></tr>'
			+ '<tr><td class="simplery-help-key"><span>ESC</span></td> <td>Quit Galery</td></tr>'
			+ '<tr><td class="simplery-help-key"><span>&larr;</span></td> <td>Previous Image</td></tr>'
			+ '<tr><td class="simplery-help-key"><span>&rarr;</span></td> <td>Next Image</td></tr>'
			+ '<tr><td class="simplery-help-key"><span>G</span></td> <td>Switch to Grid View</td></tr>'
			+ '<tr><td class="simplery-help-info" colspan="2"><a href="http://simonnickel.de/devlog/projekte/simplery">simplery</a> by <a href="http://twitter.com/simonnickel">@simonnickel</a> | GitHub</td></tr>'
			+ '</ul></div>');

	help = galery.find('.simplery-help');
	help.find('.simplery-help-close a').click(function(e) {
		e.preventDefault();
		help.remove();
	});

	helpBg = galery.find('.simplery-help-bg');
	helpBg.click(function(e) {
		help.remove();
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


