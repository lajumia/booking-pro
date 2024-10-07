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

class Booking_Pro {

    public function __construct() {
        $this->define_constants();
        add_action('init', [$this, 'bp_load_require_files_for_admin']);
        add_action('init', [$this, 'bp_load_require_files_for_public']);
        register_activation_hook(__FILE__, [$this, 'bp_activate']);
    }

    // Define constants
    private function define_constants() {
        define('BP_VERSION', '1.0.0');
        define('BP_DIR_PATH', plugin_dir_path(__FILE__));
        define('BP_DIR_URL', plugin_dir_url(__FILE__));
    }

    // Load required files for admin
    public function bp_load_require_files_for_admin() {
        require_once BP_DIR_PATH . 'admin/class-bp-admin.php';
    }

    // Load required files for public
    public function bp_load_require_files_for_public() {
        require_once BP_DIR_PATH . 'public/class-bp-public.php';
    }

    // Activation hook callback
    public function bp_activate() {
        require_once BP_DIR_PATH . 'includes/class-bp-activator.php';
        BP_Activator::bp_activate();
    }
}

new Booking_Pro();
