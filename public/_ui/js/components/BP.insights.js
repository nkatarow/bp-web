/*

    Insights Functionality
    VERSION 1.0.0
    AUTHORS: Nick Katarow

    DEPENDENCIES:
    - jQuery 1.7.2
    - BP.main.js

*/

BP.insights = {
    init: function() {
		var self = this;

		$('#filter-select').click(function(){
    		$('#insights-filter').addClass('active');
			$('#insights-filter').css('visibility', 'visible');
			$('#header').addClass('black');
			$('#header button').hide();
			$('#header .search-li').hide();
			$('#header .newsletter-li').hide();
			$('body').css('overflow', 'hidden');
		});

		$('#close-filter').click(function(){ self.closeFilter() });

		// init Isotope
		var $grid = $('.grid');

		// bind filter button click
		var $filterButtonGroup = $('.filter-button-group');
		$filterButtonGroup.on( 'click', 'a', function(event) {
			event.preventDefault();
			var filterAttr = $( this ).attr('data-filter');
			// set filter in hash
			location.hash = 'filter=' + encodeURIComponent( filterAttr );
			$grid.isotope({ filter: filterAttr });

			$('#filter-select').empty();
			$('#filter-select').append(this.innerHTML)
			self.closeFilter();
		});

		var isIsotopeInit = false;

		function onHashchange() {
			var hashFilter = self.getHashFilter();

			if ( !hashFilter && isIsotopeInit ) {
				return;
			}

			isIsotopeInit = true;
			// filter isotope
			$grid.isotope({
				itemSelector: '.grid-item',
				filter: hashFilter
			});
			// set selected class on button
			if ( hashFilter ) {
				var cleanHash;
				$filterButtonGroup.find('.is-checked').removeClass('is-checked');
				$filterButtonGroup.find('[data-filter="' + hashFilter + '"]').addClass('is-checked');

				if (hashFilter != '*') {
					cleanHash = hashFilter.replace('.', '');
				} else {
					cleanHash = 'all';
				}
				$('#filter-select').empty();
				$('#filter-select').append(document.getElementById('filter-' + cleanHash).innerHTML)
			}
		}

		$(window).on( 'hashchange', onHashchange );

		// trigger event handler to init Isotope
		onHashchange();
    },

	getHashFilter: function() {
		// get filter=filterName
		var matches = location.hash.match( /filter=([^&]+)/i );
		var hashFilter = matches && matches[1];
		return hashFilter && decodeURIComponent( hashFilter );
	},

	closeFilter: function() {
		$('#insights-filter').removeClass('active');
		$('#header').removeClass('black');
		$('#header button').show();
		$('#header .search-li').show();
		$('#header .newsletter-li').show();
		$('body').css('overflow', 'visible');

		setTimeout(function(){
			$('#insights-filter').css('visibility', 'hidden');
		}, 250);
	}
};
