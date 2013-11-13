<?php defined('SYSPATH') or die('No direct script access.');

/**
 * This controller is used to access OSRM client functionality
 */

class OSRMClient_Controller extends Main_Controller {
	
	/**
	 * Whether an admin console user is logged in
	 * @var bool
	 */
	var $logged_in;

	public function __construct()
	{
		parent::__construct();

		// Is the Admin Logged In?
		$this->logged_in = Auth::instance()->logged_in();
	}

	public function index()
	{
		// Cacheable Controller
		$this->is_cachable = TRUE;
		$this->template->header->this_page = 'osrmclient';
		$this->template->content = new View('osrmclient/osrmclient_main');
		// Enable the map
		$this->themes->map_enabled = TRUE;
		$this->themes->js = new View('osrmclient/map_view_js');
		// Category tree view
		$this->template->content->category_tree_view = category::get_category_tree_view();
	}
}
