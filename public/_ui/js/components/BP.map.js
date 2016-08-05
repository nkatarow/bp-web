/*

    FILE: BP.maps.js
    DESCRIPTION: Dynamically creates google maps element with address entered in CMS
    AUTHOR(S): Nick Katarow

    DEPENDENCIES:
    - Google Maps API
    - jQuery 1.9.1

    TO DO:

*/

BP.maps = {

    init: function (addr) {
        var self = this;
        var styles = [
			{
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
					{ "visibility": "on" },
					{ "color": "#bbefff" }
				]
			},{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" },
					{ "color": "#ffffff" }
				]
			},{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" },
					{ "color": "#5ecbf7" }
				]
			}
		];

        var geocoder = new google.maps.Geocoder(styles);
        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map"} );
		var containerHeight = $('.location-map .right').outerHeight();

		$('#map-canvas').css('height', containerHeight);

        var mapOptions = {
            // center: new google.maps.LatLng(47.8106521, -122.37735520000001),
            zoom: 14,
            draggable: true,
            scrollwheel: false,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        self.codeAddress(addr, geocoder, map);
    }, // END: init


    codeAddress: function(addr, geocoder, map) {
        geocoder.geocode( {'address': addr}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                var image = {
                    url: '/_ui/img/global/map-pin.png',
                    size: new google.maps.Size(27, 33),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(13, 33)
                };

                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    position: results[0].geometry.location
                });
            } else {
                console.log('Geocode not successful!');
            }
        });
    } // END: codeAddress

}; // END: maps
