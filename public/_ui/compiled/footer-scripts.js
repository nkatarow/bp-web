/*

    FILE: app.main.js
    DESCRIPTION: Basic App functions and config
    AUTHOR(S): Nick Katarow

    DEPENDENCIES:
    - jQuery 1.9.1

    TO DO:

*/
var BP = window.BP || {};

$(document).ready(function(){
    BP.init();
});

window.BP = {
	init: function() {
		var self = this,
			ua = window.navigator.userAgent,
			msie = ua.indexOf("MSIE ");

		// Since new IE versions don't even accept conditional comment, we have to sniff if it's IE via JS
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			$('body').append('<link rel="stylesheet" href="/_ui/css/IE.css" media="all">');
            $('html').addClass('ie');
        }

        self.events.parent = this;

        // Init Components
        self.nav.init();


	},
    events: {
        windowResize: function (event) {
            var self = this.parent,
                i,
                ii;

            if (event.width >= 1056 && self.nav.isMobile) {
                self.nav.mobileOff();
            } else if (event.width < 1056 && !self.nav.isMobile) {
                self.nav.mobileOn();
            }
        }
    },
    getMediaWidth: function () {
        var self = this,
            width;

        if (typeof matchMedia !== 'undefined') {
            width = self.bruteForceMediaWidth();
        } else {
            width = window.innerWidth || document.documentElement.clientWidth;
        }

        return width;
    },
    bruteForceMediaWidth: function () {
        var i = 0,
            found = false;

        while (!found) {
            if (matchMedia('(width: ' + i + 'px)').matches) {
                found = true;
            } else {
                i++;
            }

            // Prevent infinite loop if something goes horribly wrong
            if (i === 9999) {
                break;
            }
        }

        return i;
    }
};

/*

	Slinky
	A light-weight, responsive, mobile-like navigation menu plugin for jQuery
	Built by Ali Zahid
	Published under the MIT license

*/

;(function($) {
	$.fn.slinky = function(options) {
		// Setup plugin defaults

		var settings = $.extend({
			label: 'Back',
			title: false,
			speed: 300,
			resize: true
		}, options);

		// Convenience method for navigation animation

		var move = function(menu, next, callback) {
			var left = Math.round(parseInt(menu.get(0).style.left)) || 0;

			// Use multiples of 100% for responsive animation

			menu.css('left', -Math.abs(next ? left - 100 : left + 100) + '%');

			// Callback after animation is finished

			if (typeof callback === 'function') {
				setTimeout(callback, settings.speed);
			}
		};

		// Convenience method for resizing menu

		var resize = function(menu, content) {
			menu.height(content.outerHeight());
		};

		return this.each(function() {
			// The root node is where animation happens

			var menu = $(this),
				root = menu.children().first();

			// Set CSS animation duration

			menu.css('transition-duration', settings.speed + 'ms');
			root.css('transition-duration', settings.speed + 'ms');

			// Add .next class to links with sub menus

			$('a + ul', menu).prev().addClass('next');

			// Add header for back button and title

			$('li > ul', menu).prepend('<li class="header">');
			//$('li > ul', menu).append('<li class="footer">');



			// Add back links with appropriate labels

			if (!settings.title && settings.label === true) {
				// Create a link with label from parent

				$('li > ul', menu).each(function() {
					var label = $(this).parent().find('a').first().text(),
						backLink = $('<a>').text(label).prop('href', '#').addClass('back');

					$('> .header', this).append(backLink);
					// $('> .footer', this).append(backLink);
				});
			} else {
				// Create a link with the label from settings

				var label = $(this).parent().find('a').first().text(),
					backLink = $('<a>').text(settings.label).prop('href', '#').addClass('back');

				// $('.footer', menu).append(backLink);
				$('.header', menu).append(backLink);
			}


			// Add title

			// if (settings.title === true) {
			// 	// Create a label with title from the parent
			//
			// 	$('li > ul', menu).each(function() {
			// 		var label = $(this).parent().find('a').first().text(),
			// 			title = $('<h2>').text(label);
			//
			// 		$('> .header', this).append(title);
			// 	});
			// }

			// Setup navigation

			$('a', menu).on('click', function(e) {
				var a = $(this);

				// Disable navigation if link has hash
				// else proceed to URL

				if (/#/.test(this.href)) {
					e.preventDefault();
				}

				// Animate forward or backward
				// Resize menu height to match content, if required

				if (a.hasClass('next')) {
					a.next().show();

					move(root, true);

					if (settings.resize) {
						resize(menu, a.next());
					}
				} else if (a.hasClass('back')) {
					move(root, false, function() {
						a.parent().parent().hide();
					});

					if (settings.resize) {
						resize(menu, a.parent().parent().parents('ul'));
					}
				}
			});
		});

		return this;
	};
}(jQuery));

/*

    Navigation Component
    VERSION 1.0.0
    AUTHORS: Nick Katarow, Gavin Suntop

    DEPENDENCIES:
    - jQuery 1.7.2
    - BP.main.js

*/

BP.nav = {
    init: function () {
        // fn init
        var self = this,
			prev = 0,
            key;

        // ELEMENTS
        self.elPrimaryTrigger       = $('<button class="hamburger hamburger--spin" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');
        self.elPrimaryMenu          = $('#primary');
        self.elSearchClose			= $('<a href="#" class="search-close"></a>');
        self.elNewsletterClose			= $('<a href="#" class="newsletter-close"></a>');

        // PROPERTIES
        self.isMobile           = false;
        self.visibleMenu        = null;
        self.triggersInserted   = false;

        // SETUP
        if (BP.getMediaWidth() < 1056) {
            self.mobileOn();
        } else {
            self.mobileOff();
        }

		if ($('.hero').length) {
			$('#header').addClass('transparent');

			$(window).on('scroll', function(){
				if (!self.checkVisible($('.hero'))) {
					$('#header').removeClass('transparent');
				} else {
					$('#header').addClass('transparent');
				}
			});
		}

		$(window).on('scroll', function(){
			var scrollTop = $(window).scrollTop();
			$('#header').toggleClass('hidden', scrollTop > prev);
			prev = scrollTop;
		});

    	if (!self.isMobile) {
        	$('.search-btn').click(function(event){
        		event.preventDefault();

        		$('#search-form').addClass('active');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#search-form').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#search-form').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
					}
				})
			});

        	$('.newsletter-btn').click(function(event){
        		event.preventDefault();

        		$('#mc_embed_signup').addClass('active');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#mc_embed_signup').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#mc_embed_signup').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
					}
				})
			});
		}


        // OBJECTS
        self.menus = {
            primary: {
                $menu: self.elPrimaryMenu,
                $trigger: self.elPrimaryTrigger
            }
        };

        // EVENT DELEGATION
        function bindTrigger(trigger, menuName) {
            trigger.click(function (event) {
                event.preventDefault();

                if (self.visibleMenu !== menuName) {
                    self.showNav(menuName);
                } else {
                    self.hideNav(menuName);
                }
            });
        }

        for (key in self.menus) {
            bindTrigger(self.menus[key].$trigger, key);
        }
    },
    mobileOn: function () {
        // fn mobileOn
        var self = this;

		console.log('mobileon');

        if (!self.triggersInserted) {
            self.elPrimaryMenu.before(self.elPrimaryTrigger);

            self.triggersInserted = true;
        } else {
            self.elPrimaryTrigger.show();
        }

        self.elPrimaryMenu.addClass('slinky-menu');

        if (!self.slinkyInitiated) {
            self.elPrimaryMenu.slinky({
            	title: true,
            	speed: 250,
            	resize: false
            });

            self.slinkyInitiated = true;
        }

        self.isMobile = true;
    },
    mobileOff: function () {
        // fn mobileOff
        var self = this;
		console.log('mobileoff');

        self.elPrimaryMenu.removeClass('slinky-menu');

        if (self.triggersInserted) {
            self.elPrimaryTrigger.hide();
        }

        self.isMobile = false;
    },

    hideNav: function (menu) {
        // fn hideNav
        var self = this;

		$('header').removeClass('active');
        self.menus[self.visibleMenu].$menu.removeClass('active');
        self.menus[self.visibleMenu].$trigger.removeClass('is-active');
        self.visibleMenu = null;
    },
    showNav: function (menu) {
        // fn showNav
        var self = this;

        if (self.visibleMenu !== null) {
            self.hideNav(self.visibleMenu);
        }

		$('header').addClass('active');
        self.menus[menu].$menu.addClass('active');
        self.menus[menu].$trigger.addClass('is-active');
        self.visibleMenu = menu;
    },
    checkVisible: function( elm, evalType ) {
        evalType = evalType || "visible";

        var vpH = $(window).height(), // Viewport Height
            st = $(window).scrollTop(), // Scroll Top
            y = $(elm).offset().top - 80,
            elementHeight = $(elm).height();

        if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
        if (evalType === "above") return ((y < (vpH + st)));
    }
};
