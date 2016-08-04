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
				$('#search-form').css('visibility', 'visible');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');
				$('.newsletter-btn').addClass('hidden');
				$('.search-btn').addClass('hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#search-form').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#search-form').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
						$('.newsletter-btn').removeClass('hidden');
						$('.search-btn').removeClass('hidden');

						setTimeout(function(){
							$('#search-form').css('visibility', 'hidden');
						}, 250);
					}
				})
			});

        	$('.newsletter-btn').click(function(event){
        		event.preventDefault();

        		$('#mc_embed_signup').addClass('active');
				$('#mc_embed_signup').css('visibility', 'visible');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');
				$('.newsletter-btn').addClass('hidden');
				$('.search-btn').addClass('hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#mc_embed_signup').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#mc_embed_signup').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
						$('.newsletter-btn').removeClass('hidden');
						$('.search-btn').removeClass('hidden');

						setTimeout(function(){
							$('#mc_embed_signup').css('visibility', 'hidden');
						}, 250);
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
