<?php
/**
 * Alerts js file.
 *
 * Handles javascript stuff related  to alerts function
 *
 * PHP version 5
 * LICENSE: This source file is subject to LGPL license
 * that is available through the world-wide-web at the following URI:
 * http://www.gnu.org/copyleft/lesser.html
 * @author     Ushahidi Team <team@ushahidi.com>
 * @package    Ushahidi - https://github.com/ushahidi/Ushahidi_Web
 * @copyright  Ushahidi - http://www.ushahidi.com
 * @license    http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License (LGPL)
 */
?>

// Map reference
var map = null;
var latitude = <?php echo Kohana::config('settings.default_lat') ?>;
var longitude = <?php echo Kohana::config('settings.default_lon'); ?>;
var zoom = <?php echo Kohana::config('settings.default_zoom'); ?>;

jQuery(function($) {
	$(window).load(function(){

		<?php echo map::layers_js(FALSE); ?>
		var mapConfig = {

			// Map center
			center: {
				latitude: latitude,
				longitude: longitude
			},

			// Zoom level
			zoom: zoom,

			// Base layers
			baseLayers: <?php echo map::layers_array(FALSE); ?>
		};

		var map = new Ushahidi.Map('divMap', mapConfig);
		
		var markers = new OpenLayers.Layer.Markers( "Markers" );

		window.osrmClient = new OSRM_Client.OSRM_Client(
			{
				ushahidiMap:map,
				mapMarkersLayer:markers,
				pointsContainer:"viapoint-list"
			}
		);
		
		map._olMap.events.register("click", map._olMap , function(e){
			osrmClient.addViapointAtXY(e.xy);
		});

		map._olMap.addLayer(markers);
});
});
