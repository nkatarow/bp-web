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
			iPad = ua.match(/iPad/i),
			msie = ua.indexOf("MSIE ");

		// Since new IE versions don't even accept conditional comment, we have to sniff if it's IE via JS
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			$('body').append('<link rel="stylesheet" href="/_ui/css/IE.css" media="all">');
            $('html').addClass('ie');
        }

        self.events.parent = this;
		$(window).bind('resize', function(event) {
			self.events.windowResize({width: self.getMediaWidth()});
		});

        // Init Components
        self.nav.init();

		// Carousels
		$('.default-carousel').owlCarousel({
			// Speeds
			navSpeed: 350,
			dotSpeed: 350,

			// Navigation
			nav: true,
			dots: true,
			navText: ["<span class='icon-chevron-left'></span>","<span class='icon-chevron-right'></span>"],
			margin: 1,

			// Misc
			loop: false,
			items: 1
		});

		$('.owl-people-carousel').owlCarousel({
			// Speeds
			navSpeed: 350,
			dotSpeed: 350,

			// Navigation
			nav: true,
			dots: true,
			navText: ["<span class='icon-chevron-left'></span>","<span class='icon-chevron-right'></span>"],

			// Misc
			loop: false,

            responsive: {
                0: {
                    items: 1,
                },
                479: {
                    items: 2,
                },
                768: {
                    items: 3,
                }
            },
		});

		if ($('.insights').length || $('.people-listing').length || $('.three-insights-callout').length) { self.insights.init(); }

		if (!iPad) {
			$('img.lazy').lazyload({
				effect: 'fadeIn',
				effectspeed: 250,
				threshold: 300
			});
		} else {
			$('img.lazy').each(function(){
				$(this).attr('src',$(this).data('original'));
			});
		}

		// Scrolling animations
		window.sr = ScrollReveal({
			distance: '30px',
			duration: 750,
			scale: 1,
			mobile: true,
			reset: false,
		});

		if ($('.reveal').length) {
			sr.reveal('.reveal');

			if ($('#hero-title').length) {
				if (($('#hero-title').height() * 3.5) < $(window).height()) {
					sr.reveal('#hero-title', { reset: true, viewFactor: 1.5 });
				}
			}
		}

		if ($('.sequence').length) {
			$('.sequence').each(function(){
				sr.reveal('#' + $(this).attr('id') + ' .seq', 250);
			})
		}

        $('.smooth').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });

		if ($('.cta.locations').length) {
			$('.location-link')
				.focus(function(){
					var loc = $(this).attr('href');

					if ($('.bg').hasClass('active')) {
						$('.bg').removeClass('active');
					}
					$('.' + loc).addClass('active');
				})
				.hover(function(){
					var loc = $(this).attr('href');

					if ($('.bg').hasClass('active')) {
						$('.bg').removeClass('active');
					}
					$('.' + loc).addClass('active');
				})
		}


		// Any instance of the video module
		$('.video-module').each(function(){ self.video.init(this); });

		// Any instance of more info widget
		if($('.more-info').length) { window.moreInfo = new BP.MoreInfo(); }

        // Wrap each youtube embed in a fitvids container for responsive behavior
        $('iframe[src*="youtube.com"]').each(function() {
            $(this).wrap('<div class="fitvids"></div>');
        });

        // Init fitvids
        $(".fitvids").fitVids();
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
