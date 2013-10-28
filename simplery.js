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
var hover_zoom_1 = -200;
var hover_zoom_2 = -100;
var hover_zoom_3 = -14;
var hover_zoom_4 = 10;
var hover_zoom_5 = 20;
var hover_offset_border = 10;


/*
 * TRIGGER 
 */

// when html is loaded
$(document).ready(function() {

	$(".simplery-nojs").each(function() {
		$(this).removeClass("simplery-nojs");
		$(this).addClass("simplery");
	});

});

// when css+images are loaded
$(window).load(function() {
	
	$(".simplery").each(function() {
		$(this).simpleryBoxLayout();
	});

	$(".simplery li").hover(
		function() {$(this).simpleryBoxImageHover(1);},
		function() {$(this).simpleryBoxImageHover(0);}
	);

});

// when window is resized
$(window).resize(function() {

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
	var blockWidth = li.width();

	// fix li linebreak whitespace
	var fontSize = ul.css("font-size");
	ul.css("font-size", "0px");
	li.css("font-size", fontSize);
	
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

// hover
(function( $ ){$.fn.simpleryBoxImageHover = function(mouseIn) {
	var li = $(this);
	var ul = li.parent();
	var galery = ul.parent();
	var img = li.find("img");

	var blockWidth = li.width();
	var ratio = Math.round(img.width() / img.height() * 10) / 10;

	if (mouseIn == 1) {
		var hover_zoom = 0;
		if (galery.hasClass("simplery-1")) hover_zoom = hover_zoom_1;
		if (galery.hasClass("simplery-2")) hover_zoom = hover_zoom_2;
		if (galery.hasClass("simplery-3")) hover_zoom = hover_zoom_3;
		if (galery.hasClass("simplery-4")) hover_zoom = hover_zoom_4;
		if (galery.hasClass("simplery-5")) hover_zoom = hover_zoom_5;

		img.simpleryBoxImageSize(blockWidth + hover_zoom);

		// check if image is outisde of window
		var spaceToLeft = li.offset().left + parseFloat(img.css("left"));
		var spaceToRight = $(window).width() - li.offset().left - blockWidth
			- (((blockWidth + hover_zoom) * ratio) - blockWidth) / 2;

		if (spaceToLeft < hover_offset_border && spaceToRight > hover_offset_border)
			img.css("left", parseFloat(img.css("left")) - spaceToLeft + hover_offset_border);
		if (spaceToRight < hover_offset_border && spaceToLeft > hover_offset_border)
			img.css("left", parseFloat(img.css("left")) + spaceToRight - hover_offset_border);
		if (spaceToRight < hover_offset_border && spaceToLeft < hover_offset_border)
			img.simpleryBoxImageSize(blockWidth/1.5);
	}
	else {
		img.simpleryBoxImageSize(blockWidth);
	}

	return this;
};})( jQuery );

