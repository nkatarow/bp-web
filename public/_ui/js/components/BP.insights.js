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
		var self = this,
			$grid = $('.grid').isotope({
				// options
				itemSelector: '.grid-item'
			});

		$('.filter-button-group').on( 'click', 'a', function(event) {
			event.preventDefault();
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });

			$('#filter-select').empty();
			$('#filter-select').append(this.innerHTML)
			self.closeFilter();
		});

		$('#filter-select').click(function(){
    		$('#insights-filter').addClass('active');
			$('#insights-filter').css('visibility', 'visible');
			$('#header').addClass('black');
			$('#header button').hide();
			$('body').css('overflow', 'hidden');
		});

		$('#close-filter').click(function(){ self.closeFilter() });
    },

	closeFilter: function() {
		$('#insights-filter').removeClass('active');
		$('#header').removeClass('black');
		$('#header button').show();
		$('body').css('overflow', 'visible');

		setTimeout(function(){
			$('#insights-filter').css('visibility', 'hidden');
		}, 250);
	}
};
