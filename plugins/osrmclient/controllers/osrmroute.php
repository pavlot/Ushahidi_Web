<?php defined('SYSPATH') or die('No direct script access.');

/**
 * This controller is used to manage routes provided by OSRM service
 */

class OSRMRoute_Controller extends Template_Controller {
	public $auto_render = FALSE;
	public $template = '';
	
	var $logged_in;
	var $session;
	
	public function __construct()
	{
		parent::__construct();

		// Is the Admin Logged In?
		$this->logged_in = Auth::instance()->logged_in();
		$this->session = Session::instance();
	}
	
	public function index()
	{
		header('Content-type: application/json; charset=utf-8');
		if(isset($_REQUEST['get_route']) && $_REQUEST['get_route'] == true)
		{ 
			if(isset($_SESSION["osrm_route"]))
			{
				echo $_SESSION["osrm_route"];
			}else
			{
				echo "{}";
			}
		}
	}
	
	public function get_route()
	{
		if(isset($_SESSION["osrm_route"]))
		{
			echo $_SESSION["osrm_route"];
		}else
		{
			echo "{}";
		}
	}
	
	public function set_route()
	{
		if(isset($_REQUEST["route_json"]))
		{
			$_SESSION["osrm_route"] = $_REQUEST["route_json"];
		}
	}
	
}
