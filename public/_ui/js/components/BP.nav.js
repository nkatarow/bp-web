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
        if (BP.getMediaWidth() < 700) {
            self.mobileOn();
        } else {
            self.mobileOff();
        }

        // $('.search-btn').click(function(event){
        // 	event.preventDefault();
		//
        // 	if (!self.isMobile) {
        // 		$('#search-form').addClass('active');
		//
        // 		if (!self.triggerInserted) {
        // 			$('#search-form form').prepend(self.elSearchClose);
        // 			self.triggerInserted = true;
        // 		} else {
        // 			self.elSearchClose.show();
        // 		}
        // 	}
		//
		// 	setTimeout(function(){
		//         $('#q').focus();
		// 	}, 250);
        // });
        // $('.newsletter-btn').click(function(event){
        // 	event.preventDefault();
		//
        // 	if (!self.isMobile) {
        // 		$('#mc_embed_signup').addClass('active');
		//
        // 		if (!self.triggerInserted) {
        // 			$('#mc_embed_signup form').prepend(self.elNewsletterClose);
        // 			self.triggerInserted = true;
        // 		} else {
        // 			self.elNewsletterClose.show();
        // 		}
        // 	}
		//
		// 	setTimeout(function(){
		//         $('#mce-EMAIL').focus();
		// 	}, 250);
        // });

        // self.elSearchClose.click(function(event){
        // 	event.preventDefault();
		//
        // 	if (!self.isMobile) {
        // 		$('#search-form').removeClass('active');
        // 		self.elSearchClose.hide();
        // 	}
        // });

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
    }
};