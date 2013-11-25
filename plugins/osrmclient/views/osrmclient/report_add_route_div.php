<div>
<script type="text/javascript">
//<![CDATA[
function handleClick(cb) {
	if(cb.checked == true)
	{
		$.ajax({url:"<?php echo url::site();?>osrmroute/get_route",success:function(result){
			window.osrm_route = result;
			addOsrmRouteToReport(JSON.parse(result));
		}});
	} else 
	{
		removeOsrmRouteFromReport(window.osrmFeature);
	}
}
function addOsrmRouteToReport(osrmRoute)
{
	var encoded = osrmRoute.route_geometry;
	var format = new OpenLayers.Format.EncodedPolyline();
	var feature = format.read(encoded);
	feature.geometry.transform(Ushahidi.proj_4326, Ushahidi.proj_900913);
	vlayer.addFeatures(feature);
	var symbolizer = feature.layer.styleMap.createSymbolizer(feature);
	symbolizer['strokeWidth']= 5;
	feature.strokeWidth = 5;
	symbolizer['strokeColor'] = '#0033FF';
	feature.color = '#0033FF';
	
	feature.style = symbolizer;
	feature.layer.drawFeature(feature);
	window.osrmFeature = feature;
	refreshFeatures();
}

function removeOsrmRouteFromReport(feature)
{
	if(feature)
	{
		vlayer.removeFeatures(feature);
	}
}

//]]>
</script>
<input type='checkbox' onclick='handleClick(this);'> Append my route data to report
</div>
