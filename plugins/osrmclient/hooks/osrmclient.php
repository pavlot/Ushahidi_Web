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
	}
	
	public function add_requirements()
	{
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
}

//instatiation of hook
new osrmclient;
