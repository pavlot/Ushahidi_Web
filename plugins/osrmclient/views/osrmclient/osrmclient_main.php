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
						<a tabindex="-1" href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('c', 'fl-categories');">Clear</a>
						<a tabindex="-1" class="f-title" href="#">Route waypoints</a>
					</h3>
					<div role="tabpanel" class="f-category-box ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active">
						<ul class="filter-list fl-categories" id="category-filter-list">
							<li>
								<a href="#">									<span class="item-swatch" style="background-color: #CC0000"></span>
								<span class="item-title">All Categories</span>
								<span class="item-count" id="all_report_count">3</span>
								</a>
							</li>
							<li>
								<a href="#" class="cat_selected" id="filter_link_cat_1" title="Category 1">
								<span class="item-swatch" style="background-color: #9900CC"></span>
								<span class="item-title">Category 1</span><span class="item-count">3</span></a></li>
							<li>
								<a href="#" class="cat_selected" id="filter_link_cat_2" title="Category 2">
								<span class="item-swatch" style="background-color: #3300FF"></span>
								<span class="item-title">Category 2</span><span class="item-count">1</span></a></li>
							<li>
								<a href="#" class="cat_selected" id="filter_link_cat_3" title="Category 3">
								<span class="item-swatch" style="background-color: #663300"></span>
								<span class="item-title">Category 3</span><span class="item-count">0</span></a></li>
							<li>
								<a href="#" class="cat_selected" id="filter_link_cat_4" title="Reports from trusted reporters">
								<span class="item-swatch" style="background-color: #339900"></span>
								<span class="item-title">Trusted Reports</span><span class="item-count">0</span></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
