<?php
/*
Plugin Name: Booking Pro
Plugin URI: https://github.com/lajumia/booking-pro
Description: Booking Pro is a powerful booking system that helps service-based businesses manage their appointments with ease. Whether you run a spa, salon, or consulting firm, Booking Pro offers a flexible solution to manage appointments, staff schedules, services, and payments. Enjoy seamless integration with WordPress and a user-friendly admin panel built with React for fast and smooth operation.
Version: 1.0.0
Author: Md Laju Miah
Author URI: https://www.upwork.com/freelancers/~0149190c8d83bae2e2
License: GPLv2 or later
Text Domain: bp
Domain Path: /languages
*/

if (!defined('ABSPATH')) {
    exit;
}

define('BP_VERSION', '1.0.0');
define('BP_DIR_PATH', plugin_dir_path(__FILE__));
define('BP_DIR_URL', plugin_dir_url(__FILE__));

// Activation and deactivation hooks
require_once BP_DIR_PATH . 'includes/class-bp-activator.php';
register_activation_hook(__FILE__, ['BP_Activator', 'bp_activate']);





class Booking_Pro{

    public function __construct(){
        add_action('init',[$this,'bp_load_require_files']);
        
    }   

    public function bp_load_require_files(){
        require_once BP_DIR_PATH . 'admin/class-bp-admin.php';
    }
    

    
}
new Booking_Pro();