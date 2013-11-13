<?php
/**
 * OSRM client view page.
 */
?>
<div id="content">
	<div class="content-bg">
		<div class="big-block">
			<h1> Routing service </h1>
			<div class="osrmclient_map">
				<div class="map-wrapper">
					<?php $css_class = (isset($css_class))? $css_class : "map-holder"; ?>
					<div class="<?php echo $css_class; ?>" id="divMap"></div>
				</div>
			</div>
			<div id="route_waypoints">
				<div role="tablist" class="ui-accordion ui-widget ui-helper-reset ui-accordion-icons" id="accordion">
					<h3 tabindex="0" 
					aria-selected="true" 
					aria-expanded="true" 
					role="tab" 
					class="ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top">
						<span class="ui-icon ui-icon-triangle-1-s"></span>
						<a tabindex="-1" href="#" class="small-link-button f-clear reset" onclick="window.osrmClient.clearViapoints();">Clear</a>
						<a tabindex="-1" class="f-title" href="#">Route waypoints</a>
					</h3>
					<div role="tabpanel" class="f-category-box ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active">
						<ul class="filter-list fl-categories" id="viapoint-list">
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
