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

/*
 * when html is loaded
*/
$(document).ready(function() {

	$(".simplery-nojs").each(function() {
		$(this).removeClass("simplery-nojs");
		$(this).addClass("simplery");
	});

});

/*
 * when css+images are loaded
*/
$(window).load(function() {
	
	// layout
	$(".simplery").each(function() {
		$(this).simpleryBoxLayout();
	});

	// image hover
	$(".simplery li").hover(
		function() {$(this).simpleryImageHover(0);},
		function() {$(this).simpleryImageHover(1);}
	);
	
});

/*
 * when window is resized
*/
$(window).resize(function() {
	var galeries = $(".simplery");
	
	// layout
	galeries.each(function() {
		$(this).simpleryBoxResize();
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

/*
 * layout of the simplery box
*/
(function( $ ){$.fn.simpleryBoxLayout = function() {
	var galery = $(this);
	var ul = galery.find("ul");
	var li = galery.find("li");
	var img = galery.find("img");

	// fix li linebreak whitespace "bug"
	var fontSize = ul.css("font-size");
	ul.css("font-size", "0px");
	li.css("font-size", fontSize);

	// adjust size to get squares
	galery.simpleryBoxResize();

	return this;
};})( jQuery );

/*
 * resize the galery box
*/
(function( $ ){$.fn.simpleryBoxResize = function() {
	var galery = $(this);
	var li = galery.find("li");
	var img = galery.find("img");

	var blockWidth = li.width();
	
	li.each(function() {
		$(this).height(blockWidth);
	});

	// center and resize images
	img.each(function() {
		$(this).simpleryBoxResizeImage(blockWidth);

	});	



	return this;
};})( jQuery );


/*
 * hover
*/
(function( $ ){$.fn.simpleryImageHover = function(inout) {
	var li = $(this);
	var ul = li.parent();
	var galery = ul.parent();
	var img = li.find("img");

	var blockWidth = li.width();
	var ratio = Math.round(img.width() / img.height() * 10) / 10;

	if (inout == 0) {
		var hover_zoom = 0;
		if (galery.hasClass("simplery-1")) hover_zoom = hover_zoom_1;
		if (galery.hasClass("simplery-2")) hover_zoom = hover_zoom_2;
		if (galery.hasClass("simplery-3")) hover_zoom = hover_zoom_3;
		if (galery.hasClass("simplery-4")) hover_zoom = hover_zoom_4;
		if (galery.hasClass("simplery-5")) hover_zoom = hover_zoom_5;

		img.simpleryBoxResizeImage(blockWidth + hover_zoom);

		var spaceToLeft = li.offset().left + parseFloat(img.css("left"));
		var spaceToRight = $(window).width()
			- li.offset().left 
			- blockWidth
			- (((blockWidth + hover_zoom) * ratio) - blockWidth) / 2;

		if (spaceToLeft < hover_offset_border && spaceToRight > hover_offset_border) {
			img.css("left", parseFloat(img.css("left")) - spaceToLeft + hover_offset_border);
		}
		if (spaceToRight < hover_offset_border && spaceToLeft > hover_offset_border) {
			img.css("left", parseFloat(img.css("left")) + spaceToRight - hover_offset_border);
		}
		if (spaceToRight < hover_offset_border && spaceToLeft < hover_offset_border) {
			img.simpleryBoxResizeImage(blockWidth/1.5);
		}
	}
	else {
		img.simpleryBoxResizeImage(blockWidth);
	}

	return this;
};})( jQuery );


/*
 * resize image
*/
(function( $ ){$.fn.simpleryBoxResizeImage = function(width) {
	var img = $(this);
	var li = img.parent().parent();

	var blockWidth = li.width();
	var height = width;
	var ratio = Math.round(img.width() / img.height() * 10) / 10;

	// portrait
	if (ratio < 1) {
		height = width * 1 / ratio;
	}
	// landscape
	else {
		width = width * ratio;
	}
	
	img.width(width);
	img.height(height);

	img.css("left", (blockWidth - width) / 2);
	img.css("top", (blockWidth - height) / 2);

	return this;
};})( jQuery );







function hasClass(ele,cls) {return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));}
function addClass(ele,cls) {if (!this.hasClass(ele,cls)) ele.className += " "+cls;}
function removeClass(ele,cls) {if (hasClass(ele,cls)) {var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); ele.className=ele.className.replace(reg,' ');}}
function toggle(id, clname) {
	if (typeof(id) == 'string') {
		id = document.getElementById(id);
	}
	if(hasClass(id, clname)) {
		removeClass(id, clname);
	}
	else {
		addClass(id, clname);
	}
}
function toggle_nav(id, clname) {
	var elem = document.getElementById(id);
	var parent = elem.parentNode;
	var children = parent.children;
	for(var k=0; k < children.length; k++ ) {
		if(hasClass(children[k], clname)) {
			removeClass(children[k], clname);
		}
	}
	addClass(elem, clname);
}

function fullscreen(id) {
	if (typeof(id) == 'string') {
		var parent = document.getElementById(id);
		toggle(parent, 'fullscreen');
	}
	galerie_size(id);
	document.onkeyup = KeyCheck;
}
function KeyCheck() {
	//http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
	var full = document.getElementsByClassName('fullscreen');
	var KeyID = event.keyCode;
	switch(KeyID) {
		case 27:
			fullscreen(full[0].id);
			break;
		case 37:
			prev(full[0].id);
			break;
		case 39:
			next(full[0].id);
			break;
	}
}
function galerie_size(id) {
	if (typeof(id) == 'string') {
		var galerie = document.getElementById(id);
		var img = document.getElementById('img-'+id);
		var navigation = document.getElementById('navigation-'+id);
	}
	if (img) {
		if (hasClass(galerie, 'fullscreen'))
			var width = window.innerWidth;
		else 
			var width = galerie.offsetWidth;
		var height = window.innerHeight;
		if (hasClass(galerie, 'multigalerie'))
			var interface_height = navigation.offsetHeight+20;
		else
			var interface_height = 20;
		var real_image = new Image();
		real_image.src = img.src;


		if (real_image.height > real_image.width) {
			addClass(img, 'portrait');
			removeClass(img, 'landscape');
		}
		else {
			addClass(img, 'landscape');
			removeClass(img, 'portrait');
		}
		height = height - interface_height;
		width = width;
		var ratio_img = real_image.width / real_image.height;
		var ratio_window = width / height;

		img.style.top = '0px';
		if (ratio_img >= ratio_window) {
			img.style.height = width / ratio_img+'px';
			img.style.width = width + 'px';
			if (hasClass(galerie, 'fullscreen') && width / ratio_img < height) {
				img.style.top = (height - (width / ratio_img)) / 2+'px';
			}
		}
		else {
			img.style.width = height * ratio_img+'px';
			img.style.height = height + 'px';
		}
	}
}
function getOriginalWidthOfImg(img_element) {
    var t = new Image();
    t.src = (img_element.getAttribute ? img_element.getAttribute("src") : false) || img_element.src;
    return t;
}
function next(id) {
	nextprev(id, true);
}
function prev(id) {
	nextprev(id, false);
}
function nextprev(id, next) {
	var img = document.getElementById('img-'+id);
	var name_old = img.src.split('/');
	name_old = name_old[name_old.length-1];

	var nav = document.getElementById('navigation-'+id);
	var images = nav.children;
	var imagesname = new Array();
	for(var k=0; k < images.length; k++ ) {
		var name_act = images[k].name.split('/');
		imagesname[k] = name_act[name_act.length-1];
	}
	var i = pos(imagesname, name_old);

	if (next) if(i >= images.length-1) {i = 0;} else i = i+1;
	else if(i == 0) i = images.length-1; else i = i-1;
	galerie_open(id, images[i].name);
}
function pos(array, key) {
	var i = 10;
	for(var k=0; k < array.length; k++ ) {
		if (array[k] == key)
			i = k;
	}
	return i;
}
function galerie_init(id, url) {
	var galerie = document.getElementById(id);
	var marker = document.getElementById(id).firstChild;
	var img = document.createElement('img');
	img.id = 'img-'+id;
	img.src = url;

	img.setAttribute('onload', 'galerie_size(\''+id+'\')');
	galerie.insertBefore(img, marker);
}
function galerie_open(id, url) {
	var galerie = document.getElementById(id);
	if(!hasClass(galerie, 'fullscreen')) {
		fullscreen(id, "fullscreen");
	}

	var img = document.getElementById('img-'+id);

	if (!img) {
		galerie_init(id, url);
		img = document.getElementById('img-'+id);
	}
	
	var name_old = img.src.split('/');
	name_old = name_old[name_old.length-1];
	var name_new = url.split('/');
	name_new = name_new[name_new.length-1];

	var info_old = document.getElementById('info-'+id+'-'+name_old);
	removeClass(info_old, 'info_active');

	var info_new = document.getElementById('info-'+id+'-'+name_new);
	addClass(info_new, 'info_active');

	if (hasClass(info_old, 'info_show')){
		if (!hasClass(info_new, 'info_show'))
			toggle(info_new, 'info_show');
	}
	else
		if (hasClass(info_new, 'info_show'))
			toggle(info_new, 'info_show');

	var descr_old = document.getElementById('descr-'+id+'-'+name_old);
	if (descr_old) removeClass(descr_old, 'descr_active');

	var descr_new = document.getElementById('descr-'+id+'-'+name_new);
	if (descr_new) addClass(descr_new, 'descr_active');

	var nav = document.getElementById('navigation-'+id);
	var images = nav.children;
	for(var k=0; k < images.length; k++ ) {
		removeClass(images[k], 'active');
		if(images[k].name == url)
			addClass(images[k], 'active');
	}

	img.src = url;
}