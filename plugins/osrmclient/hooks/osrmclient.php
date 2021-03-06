<?php defined('SYSPATH') or die('No direct script access.');

class osrmclient {

	public function __construct()
	{	
		Event::add('system.pre_controller', array($this, 'add'));
	}

	public function add()
	{
		Event::add('ushahidi_filter.view_pre_render.layout', array($this, 'add_requirements'));
		Event::add('ushahidi_filter.nav_main_tabs', array($this, 'osrmclient_show_nav'));
		Event::add('ushahidi_action.report_form', array($this, 'add_route_to_report'));
	}
	
	public function add_requirements()
	{
		Requirements::js('media/js/OpenLayers.js');
		Requirements::js('plugins/osrmclient/config.js');
		Requirements::js('plugins/osrmclient/views/js/jquery.sortable.js');
		Requirements::js('plugins/osrmclient/views/js/EncodedPolyline.js');
		Requirements::js('plugins/osrmclient/views/js/reverse_providers.js');
		Requirements::js('plugins/osrmclient/views/js/osrm_routing.js');
		Requirements::css('plugins/osrmclient/views/css/osrmclient_style.css');
	}
	
	public function osrmclient_show_nav()
	{
		$menu_items=array( 
			'page' => 'osrmclient',
			'url' => url::site('osrmclient'),
			'name' => 'OSRM');
		array_push(Event::$data,$menu_items); 
	}
	
	public function add_route_to_report()
	{
		View::factory('osrmclient/report_add_route_div')->render(TRUE);
	}
}

//instatiation of hook
new osrmclient;
