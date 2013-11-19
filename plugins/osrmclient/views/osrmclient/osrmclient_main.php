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
				<div class="ui-accordion ui-widget ui-helper-reset ui-accordion-icons" id="accordion">
					<h3
					class="ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top">
						<span class="ui-icon ui-icon-triangle-1-s"></span>
						<a tabindex="-1" href="#" class="small-link-button f-clear reset" onclick="window.osrmClient.clearViapoints();">Clear</a>
						<a tabindex="-1" class="f-title" href="#">Route waypoints</a>
					</h3>
					<div class="f-category-box ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active">
						<ul class="osrmclient_viapoints" id="viapoint-list">
							<!-- Do not remove this code, it is here for debug purposes -->
							<!--li>
								<div>
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint1 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
									<div>
										<img src = "plugins/osrmclient/media/img/arrow_up.png" class="viapoint-manage"></img>
										<img src = "plugins/osrmclient/media/img/cancel.png" class="viapoint-manage"></img>
										<img src = "plugins/osrmclient/media/img/arrow_down.png" class="viapoint-manage"></img>
									</div>
								</div>
							</li>
							<li style="clear:both;margin-top:10px;">
								<div>
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint2 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
								</div>
							</li-->
						</ul>
					</div>
					<h3  
					class="ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top">
						<span class="ui-icon ui-icon-triangle-1-s"></span>
						<!--a tabindex="-1" href="#" class="small-link-button f-clear reset" onclick="window.osrmClient.clearViapoints();">Clear</a-->
						<a tabindex="-1" class="f-title" href="#">Route instructions</a>
					</h3>
					<div class="f-category-box ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active">
						<ul class="osrmclient_viapoints" id="instruction-list">
							<!-- Do not remove this code, it is here for debug purposes -->
							<!--li>
								<div>
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint1 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
									<div>
										<img src = "plugins/osrmclient/media/img/arrow_up.png" class="viapoint-manage"></img>
										<img src = "plugins/osrmclient/media/img/cancel.png" class="viapoint-manage"></img>
										<img src = "plugins/osrmclient/media/img/arrow_down.png" class="viapoint-manage"></img>
									</div>
								</div>
							</li>
							<li style="clear:both;margin-top:10px;">
								<div>
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint2 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
								</div>
							</li-->
						</ul>
					</div>
				</div>
			</div>		
			<script>
					$( "#accordion" ).accordion();
			</script>
		</div>
	</div>
</div>
