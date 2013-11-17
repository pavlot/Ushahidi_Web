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
						<ul class="osrmclient_viapoints" id="viapoint-list">
							<!-- Do not remove this code, it is here for debug purposes -->
							<!--li>
								<div class="viapoint">
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint1 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
								</div>
							</li>
							<li style="clear:both;margin-top:10px;">
								<div class="viapoint">
									<img src = "plugins/osrmclient/media/img/marker.png" class="viapoint-marker"></img>
									<div class = "viapoint-info"> 
										<div>Some viapoint2 address, wery long location. Wery long location name for few lines.</div>
										<div class="coordinates"> lat:333.33333 lon: 333.33333</div>
									</div>
								</div>
							</li-->
						</ul>
						<script>
							function GetIndex(sender)
								{   
									var aElements = sender.parentNode.parentNode.getElementsByTagName("li");
									var aElementsLength = aElements.length;

									var index;
									for (var i = 0; i < aElementsLength; i++)
									{
										if (aElements[i] == sender) //this condition is never true
										{
											index = i;
											return index;
										}
									}
								};
							$('#viapoint-list').sortable( { forcePlaceholderSize: true }).bind('sortupdate', function(e, ui) {
								//ui.item contains the current dragged element.
								//Triggered when the user stopped sorting and the DOM position has changed.
								alert(GetIndex(ui.item.context));
							});
						</script>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
