<?php

class BP_Admin
{
    // Construct for hook start
        public function __construct() {
            add_action('init', [$this, 'bp_user_set_role']);
            add_action('admin_menu', [$this, 'bp_admin_menu_register']);
            add_action('admin_enqueue_scripts', [$this, 'bp_admin_enqueue_scripts']);
            add_action('rest_api_init', [$this, 'bp_register_rest_routes']);
        }
        
        // Register all REST API routes in one function
        public function bp_register_rest_routes() {
            // Customer routes
            $this->bp_register_rest_routes_create_customer();
            $this->bp_register_rest_routes_get_all_customer();
            $this->bp_register_rest_routes_delete_customer();
        
            // Staff routes
            $this->bp_register_rest_routes_create_staff();
            $this->bp_register_rest_routes_get_staff();
            $this->bp_register_rest_routes_delete_staff();
            $this->bp_register_rest_routes_update_staff();
        
            // Service routes
            $this->bp_register_rest_routes_create_service();
            $this->bp_register_rest_routes_get_services();
            $this->bp_register_rest_routes_delete_service();
            $this->bp_register_rest_routes_update_service();

            // Appointments routes
            $this->bp_register_rest_routes_get_appointments();
            $this->bp_register_rest_routes_get_appointment_time_slot();
            $this->bp_register_rest_routes_update_appointment_status();
            $this->bp_register_rest_routes_delete_appointment();

            // Calender page routes
            $this->bp_register_rest_routes_get_appointments_by_status();

            // Dashboard page routes
            $this->bp_register_rest_routes_get_appointments_overview();
            $this->bp_register_rest_routes_get_upcomming_appointments();
            $this->bp_register_rest_routes_get_appointments_data_for_chart();
            $this->bp_register_rest_routes_get_revenue_data_for_chart();

            // Settings page routes
            $this->bp_register_rest_routes_get_time_slots();
            $this->bp_register_rest_routes_remove_time_slot();
            $this->bp_register_rest_routes_add_time_slot();

        }
    //Construct for hook end


    //Set all user role to bp_user start 
        public function bp_user_set_role(){
            $users = get_users();

            // Assign 'BP User' role to all existing users
            foreach ($users as $user) {
                $user->add_role('bp_user');
            }
        }
    //Set all user role to bp_user end


    // Register admin menu and print root element start
        public function bp_admin_menu_register(){
            $icon_url = BP_DIR_URL . 'admin/assets/images/bp-admin-logo.png';
            add_menu_page('Booking Pro', 'Booking Pro', 'manage_options', 'bp', [$this, 'bp_render_page'], $icon_url, 20);
            $submenus = [
                ['Dashboard', 'bp-dashboard'],
                ['Calender', 'bp-calender'],
                ['Appointments', 'bp-appointments'],
                ['Services', 'bp-services'],
                ['Staff', 'bp-staff'],
                ['Customers', 'bp-customers'],
                ['Notifications', 'bp-notifications'],
                ['Add-ons', 'bp-addons'],
                ['Settings', 'bp-settings']
            ];
            foreach ($submenus as $submenu) {
                add_submenu_page('bp', $submenu[0], $submenu[0], 'manage_options', $submenu[1], [$this, 'bp_render_page']);
            }
            remove_submenu_page('bp', 'bp');
        }
    
        public function bp_render_page() {
            $current_page = $_GET['page'];
            // Dynamically render the appropriate root div based on the slug
            echo '<div id="' . esc_attr($current_page) . '-root"></div>';
        }
    // Register admin menu and print root element end    


    // Print every admin page under specific page start
        public function bp_admin_enqueue_scripts($hook){
            
            if($hook == 'booking-pro_page_bp-dashboard'){

                $dash_dep = require_once('views/dashboard.asset.php');
                wp_enqueue_script('bp-dashboard', BP_DIR_URL . 'admin/views/dashboard.js', $dash_dep['dependencies'],$dash_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $dash_dep['version']);  
                
                // Localize script to pass data to React app
                wp_localize_script('bp-dashboard', 'bookingProDashboard', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'dashboardPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);
            
            }elseif($hook == 'booking-pro_page_bp-appointments'){

                $app_dep = require_once('views/appointments.asset.php');
                wp_enqueue_script('bp-appointments', BP_DIR_URL . 'admin/views/appointments.js', $app_dep['dependencies'], $app_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $app_dep['version']);
                wp_enqueue_style ('bp-appointments', BP_DIR_URL . 'admin/assets/css/appointments.css', [], $app_dep['version']);
                wp_enqueue_style ('bp-tostify', BP_DIR_URL.'admin/assets/css/ReactTostify.css', [], $app_dep['version']);
                wp_enqueue_style ('bp-services', BP_DIR_URL.'admin/assets/css/staff.css', [], $app_dep['version']);
                
                // Localize script to pass data to React app
                wp_localize_script('bp-appointments', 'bookingProAppointment', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'appointmentPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);

            }elseif($hook == 'booking-pro_page_bp-calender'){

                $cal_dep = require_once('views/calender.asset.php');
                wp_enqueue_script('bp-calender', BP_DIR_URL . 'admin/views/calender.js', $cal_dep['dependencies'], $cal_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $cal_dep['version']); 
                wp_enqueue_style('bp-big-calender', BP_DIR_URL . 'admin/assets/css/react-big-calender.css', [], $cal_dep['version']);
                wp_enqueue_style ('bp-calender', BP_DIR_URL . 'admin/assets/css/calender.css', [], $cal_dep['version']);
                wp_enqueue_style ('bp-appointment-dedails-modal', BP_DIR_URL.'admin/assets/css/AppointmentDetailsModal.css', [], $cal_dep['version']);

                // Localize script to pass data to React app
                wp_localize_script('bp-calender', 'bookingProCalender', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'calenderPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);
            
            }elseif($hook == 'booking-pro_page_bp-services'){

                $ser_dep = require_once('views/services.asset.php');
                wp_enqueue_script('bp-services', BP_DIR_URL . 'admin/views/services.js', $ser_dep['dependencies'], $ser_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $ser_dep['version']);
                wp_enqueue_style ('bp-services', BP_DIR_URL . 'admin/assets/css/services.css', [], $ser_dep['version']);
                wp_enqueue_style ('bp-tostify', BP_DIR_URL.'admin/assets/css/ReactTostify.css', [], $ser_dep['version']);
                
                // Localize script to pass data to React app
                wp_localize_script('bp-services', 'bookingProService', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'servicePageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);      
                      
            }elseif($hook == 'booking-pro_page_bp-staff'){

                $sta_dep = require_once('views/staff.asset.php');
                wp_enqueue_script('bp-staff', BP_DIR_URL . 'admin/views/staff.js', $sta_dep['dependencies'], $sta_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $sta_dep['version']);
                wp_enqueue_style('bp-staff', BP_DIR_URL . 'admin/assets/css/staff.css', [], $sta_dep['version']);
                wp_enqueue_style ('bp-tostify', BP_DIR_URL.'admin/assets/css/ReactTostify.css',[],$sta_dep['version']);
                
                // Localize script to pass data to React app
                wp_localize_script('bp-staff', 'bookingProStaff', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'staffPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);                

            }elseif($hook == 'booking-pro_page_bp-customers'){

                $cus_dep = require_once('views/customers.asset.php');
                wp_enqueue_script('bp-customers', BP_DIR_URL . 'admin/views/customers.js', $cus_dep['dependencies'], $cus_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $cus_dep['version']);  
                wp_enqueue_style ('bp-customers', BP_DIR_URL . 'admin/assets/css/customers.css', [], $cus_dep['version']);
                wp_enqueue_style ('bp-tostify', BP_DIR_URL.'admin/assets/css/ReactTostify.css',[],$cus_dep['version']);

                // Localize script to pass data to React app
                wp_localize_script('bp-customers', 'bookingProNonce', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'customersPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);

            }elseif($hook == 'booking-pro_page_bp-notifications'){

                $not_dep = require_once('views/notifications.asset.php');
                wp_enqueue_script('bp-notifications', BP_DIR_URL . 'admin/views/notifications.js', $not_dep['dependencies'], $not_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $not_dep['version']);

                // Localize script to pass data to React app
                wp_localize_script('bp-notifications', 'bookingProNotifications', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'notificationsPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);

            }elseif($hook == 'booking-pro_page_bp-addons'){

                $add_dep = require_once('views/addons.asset.php');
                wp_enqueue_script('bp-addons', BP_DIR_URL . 'admin/views/addons.js', $add_dep['dependencies'], $add_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $add_dep['version']);

                // Localize script to pass data to React app
                wp_localize_script('bp-addons', 'bookingProAddons', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'addonsPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);

            }elseif($hook == 'booking-pro_page_bp-settings'){

                $set_dep = require_once('views/settings.asset.php');
                wp_enqueue_script('bp-settings', BP_DIR_URL . 'admin/views/settings.js', $set_dep['dependencies'], $set_dep['version'], true);
                wp_enqueue_style ('bp-dashboard', BP_DIR_URL . 'admin/assets/css/dashboard.css', [], $set_dep['version']);
                wp_enqueue_style ('bp-settings', BP_DIR_URL . 'admin/assets/css/settings.css', [], $set_dep['version']);
                wp_enqueue_style ('bp-tostify', BP_DIR_URL.'admin/assets/css/ReactTostify.css', [], $set_dep['version']);

                // Localize script to pass data to React app
                wp_localize_script('bp-settings', 'bookingProSettings', [
                    'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
                    'settingsPageUrl' => admin_url('admin.php?page='),
                    'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                ]);

            }else{
                return;
            }
                

            
        }
    // Print every admin page under specific page end


    //Register REST API routes for customer page start
        
        //Create customer
        public function bp_register_rest_routes_create_customer() {
            register_rest_route('booking-pro/v1', '/add-bp-user', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_add_bp_user_callback'],
                'permission_callback' => '__return_true',
            ]);
        }
        public function bp_add_bp_user_callback(WP_REST_Request $request) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'unset',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }
            
            // Get form data
            $params = $request->get_file_params();
            $first_name = sanitize_text_field($request['first_name']);
            $last_name = sanitize_text_field($request['last_name']);
            $email = sanitize_email($request['email']);
            $phone = sanitize_text_field($request['phone']);
            $profile_photo = $params['profile_photo'];

            // Check if email exists
            if (email_exists($email)) {
                return new WP_REST_Response([
                'status' => 'exist',
                'message' => 'Your email is already exist!',
            ], 409);
            }

            // Create the user
            $user_id = wp_insert_user([
                'user_login' => $email,
                'user_email' => $email,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'role' => 'bp_user',
                'meta_input' => [
                    'mobile' => $phone,

                ],
            ]);

            // Check if the user creation failed
            if (is_wp_error($user_id)) {
                return new WP_REST_Response([
                'status' => 'failed',
                'message' => 'User creation failed!',
            ], 500);;
            }

            // Handle photo upload
            if ($profile_photo && !empty($profile_photo['name'])) {
                require_once(ABSPATH . 'wp-admin/includes/file.php');
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                require_once(ABSPATH . 'wp-admin/includes/media.php');

                // Upload and attach the photo to the user
                $attachment_id = media_handle_upload('profile_photo', 0);
                if (!is_wp_error($attachment_id)) {
                    update_user_meta($user_id, 'profile_photo', $attachment_id);
                }
            }

            return new WP_REST_Response([
                'status' => 'success',
                'message' => 'User created successfylly!',
            ], 200);;
        }
    
        //Get all customers
        public function bp_register_rest_routes_get_all_customer() {
            register_rest_route('booking-pro/v1', '/bp-users', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_all_bp_user_callback'],
                'permission_callback' => '__return_true', // Only admin can create users
                'args' => [
                    'page' => [
                        'required' => false,
                        'default' => 1,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                    'limit' => [
                        'required' => false,
                        'default' => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    'search' => [
                        'required' => false,
                        'sanitize_callback' => 'sanitize_text_field', // Sanitize the search query
                    ],
                ],

            ]);
        }
        public function bp_get_all_bp_user_callback(WP_REST_Request $request) {


            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], status: 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            // Get pagination parameters from the request
            $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
            $limit = $request->get_param('limit') ? intval($request->get_param('limit')) : 10;
            $search = $request->get_param('search') ? sanitize_text_field($request->get_param('search')) : '';
            $offset = ($page - 1) * $limit;

            // Query users with 'bp_user' role and apply pagination
            $args = [
                'role' => 'bp_user',
                'number' => $limit,  // Limit users per page
                'offset' => $offset, // Start from this offset
            ];
            if (!empty($search)) {
                $args['search'] = '*' . esc_attr($search) . '*';
                $args['search_columns'] = ['user_login', 'user_email', 'display_name']; // Add fields to search in
            }

            $users = get_users($args);
            $user_data = [];

            foreach ($users as $user) {
                // Get the attachment ID for the user's profile photo
                $attachment_id = get_user_meta($user->ID, 'profile_photo', true);

                // Get the profile photo URL
                $profile_photo_url = !empty($attachment_id) ? wp_get_attachment_url($attachment_id) : '';

                // Collect user data
                $user_data[] = [
                    'id' => $user->ID,
                    'name' => $user->display_name,
                    'email' => $user->user_email,
                    'phone' => get_user_meta($user->ID, 'mobile', true),
                    'profile_photo' => $profile_photo_url,
                ];
            }

            // Get total number of users with 'bp_user' role for pagination
            $total_users = count(get_users(['role' => 'bp_user']));

            // Calculate total pages
            $total_pages = ceil($total_users / $limit);

            // If users are found, return the data along with pagination info
            if ($user_data) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $user_data,
                    'total_pages' => $total_pages,
                    'current_page' => $page,
                    'total_users' => $total_users,
                    'limit'=> $limit,
                ], 200);
            } else {
                // If no users are found
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No users found!',
                ], 200);
            }
            
        }
        
        //Delete customers
        public function bp_register_rest_routes_delete_customer() {
            register_rest_route('booking-pro/v1', '/delete-bp-user/(?P<id>\d+)', [
                'methods'  => 'DELETE',
                'callback' => [$this, 'bp_delete_bp_user_callback'],
                'permission_callback' => function() {
                    return current_user_can('manage_options');} // Only admin can delete users
            ]);
        }
        public function bp_delete_bp_user_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }
            
            $user_id = $request['id']; // Extract the user ID from the request

            // Get user data by ID
            $user = get_userdata($user_id);
            // Ensure the function wp_delete_user() is available by running in the admin context
            if ( ! function_exists( 'wp_delete_user' ) ) {
                require_once( ABSPATH . 'wp-admin/includes/user.php' );
            }

            // Check if the user exists
            if ( ! $user_id || ! get_userdata( $user_id ) ) {
                return new WP_REST_Response( [
                    'status' => 'error',
                    'message' => 'User not found or invalid user ID',
                ], 404 );
            }
            // Check if user is also administrator
            if ( in_array( 'administrator', (array) $user->roles ) ) {
                return new WP_REST_Response( [
                    'status' => 'failed',
                    'message' => 'Cannot delete administrators',
                ], 403 );
            }
            
            // Attempt to delete the user
            if ( wp_delete_user( $user_id ) ) {
                return new WP_REST_Response( [
                    'status' => 'success',
                    'message' => 'User deleted successfully!',
                ], 200 );
            } else {
                return new WP_REST_Response( [
                    'status' => 'error',
                    'message' => 'Failed to delete user',
                ], 500 );
            }
        }

    //Register REST API routes for customer page end
    

    //Register REST API routes for staff page start
        //Create staff
        public function bp_register_rest_routes_create_staff() {
            register_rest_route('booking-pro/v1', '/create-staff', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_create_staff_callback'],
                'permission_callback' => '__return_true',
            ]);
        }
        public function bp_create_staff_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            // Get form data
            $params = $request->get_file_params();
            $full_name = sanitize_text_field($request['full_name']);
            $email = sanitize_email($request['email']);
            $phone = sanitize_text_field($request['phone']);
            $role = sanitize_text_field($request['role']);
            $profile_photo = $params['profile_photo'];
            $profile_photo_url = '';

            // Get the WordPress uploads directory path
            $upload_dir = wp_upload_dir();
            $bp_folder_path = $upload_dir['basedir'] . '/booking-pro';  // Folder path

            // Ensure the 'booking-pro' folder exists
            if (!file_exists($bp_folder_path)) {
                wp_mkdir_p($bp_folder_path);
            }

            // Check if file is uploaded
            if ($profile_photo && !empty($profile_photo['name'])) {

                // Set up the target file path inside 'booking-pro'
                $target_file = $bp_folder_path . '/' . basename($profile_photo['name']);

                // Move the uploaded file to the 'booking-pro' directory
                if (move_uploaded_file($profile_photo['tmp_name'], $target_file)) {
                    // Generate the URL to the uploaded file
                    $profile_photo_url = $upload_dir['baseurl'] . '/booking-pro/' . basename($profile_photo['name']);

                }
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No file provided',
                ], 400);
            };

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_staff';

            // Check if email is exist in $table_name
            $existing_user = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE email = %s", $email));
            if($existing_user){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Email already exist!',
                ], 403);
            }

            
            // Insert data into the database
            $insert_date = $wpdb->insert(
                $table_name,
                array(
                    'profile' => $profile_photo_url,
                    'name' => $full_name,
                    'email' => $email,
                    'phone' => $phone,
                    'role' => $role,
                )
            );

            if($insert_date){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Staff created successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to create staff!',
                ], 500);
            }
        }

        //Get staff
        public function bp_register_rest_routes_get_staff() {
            register_rest_route('booking-pro/v1', '/get-staff', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_staff_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'page' => [
                        'required' => false,
                        'default' => 1,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                    'limit' => [
                        'required' => false,
                        'default' => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    'search' => [
                        'required' => false,
                        'sanitize_callback' => 'sanitize_text_field', // Sanitize the search query
                    ],
                ],

            ]);
        }
        public function bp_get_staff_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            // Get pagination parameters from the request
            $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
            $limit = $request->get_param('limit') ? intval($request->get_param('limit')) : 10;
            $search = $request->get_param('search') ? sanitize_text_field($request->get_param('search')) : '';
            $offset = ($page - 1) * $limit;            

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_staff';
            //$staff = $wpdb->get_results("SELECT * FROM $table_name");
            // Base SQL query
            $sql = "SELECT * FROM $table_name";

            // Add search functionality if a search term is provided
            if (!empty($search)) {
                $sql .= $wpdb->prepare(" WHERE name LIKE %s OR email LIKE %s", '%' . $wpdb->esc_like($search) . '%', '%' . $wpdb->esc_like($search) . '%');
            }

            // Add LIMIT and OFFSET for pagination
            $sql .= $wpdb->prepare(" LIMIT %d OFFSET %d", $limit, $offset);

            // Execute the query
            $staff = $wpdb->get_results($sql);

            // Get total number of records (for pagination)
            $total_staff = $wpdb->get_var("SELECT COUNT(*) FROM $table_name" . (!empty($search) ? $wpdb->prepare(" WHERE name LIKE %s OR email LIKE %s", '%' . $wpdb->esc_like($search) . '%', '%' . $wpdb->esc_like($search) . '%') : ''));

            // Calculate total pages
            $total_pages = ceil($total_staff / $limit);

            // Return the response with pagination info
            if (!empty($staff)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $staff,
                    'total_pages' => $total_pages,
                    'current_page' => $page,
                    'total_staff' => $total_staff,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No staff members found',
                ], 200);
            }

        }

        //Delete staff
        public function bp_register_rest_routes_delete_staff() {
            register_rest_route('booking-pro/v1', '/delete-staff/(?P<id>\d+)', [
                'methods'  => 'DELETE',
                'callback' => [$this, 'bp_delete_staff_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'required' => true,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                ],
            ]);
        }
        public function bp_delete_staff_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $user_id = $request['id']; // Extract the user ID from the request

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_staff';

            // Check if user is exist in $table_name
            $existing_user = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $user_id));
            if(!$existing_user){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Staff not found!',
                ], 404);
            }

            // Attempt to delete the user
            $delete_user = $wpdb->delete(
                $table_name,
                array(
                    'id' => $user_id,
                )
            );

            if($delete_user){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Staff deleted successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to delete staff!',
                ], 500);
            }
        }

        //Update staff
        public function bp_register_rest_routes_update_staff() {
            register_rest_route('booking-pro/v1', '/update-staff/(?P<id>\d+)', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_update_staff_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'required' => true,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                ],
            ]);
        }
        public function bp_update_staff_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            
            $user_id = $request['id']; // Extract the user ID from the request
            $full_name = sanitize_text_field($request['full_name']);
            $email = sanitize_email($request['email']);
            $phone = sanitize_text_field($request['phone']);
            $status = sanitize_text_field($request['status']);
            

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_staff';

            // Check if user is exist in $table_name
            $existing_user = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $user_id));
            if(!$existing_user){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Staff not found!',
                ], 404);
            }

            // Update data into the database
            $update_date = $wpdb->update(
                $table_name,
                array(
                    'name' => $full_name,
                    'email' => $email,
                    'phone' => $phone,
                    'status' => $status,
                ),
                array(
                    'id' => $user_id,
                )
            );

            if($update_date){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Staff updated successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to update staff!',
                ], 500);
            }
        }
            
    //Register REST API routes for staff page end


    // Register REST API routes for service page start
        
        //Create service
        public function bp_register_rest_routes_create_service() {
            register_rest_route('booking-pro/v1', '/create-service', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_create_service_callback'],
                'permission_callback' => '__return_true',
            ]);
        }
        public function bp_create_service_callback( $request ) {
                        // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');
            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }
            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $service_name = sanitize_text_field($request['service_name']);
            $service_description = sanitize_text_field($request['service_description']);
            $service_price = floatval($request['service_price']);
            $service_duration = intval($request['service_duration']);            

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_services';

            $insert_date = $wpdb->insert(
                $table_name,
                array(
                    'service_name' => $service_name,
                    'description' => $service_description,
                    'price' => $service_price,
                    'duration' => $service_duration,
                )
            );

            if($insert_date){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Service created successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to create service!',
                ], 500);
            }
        }

        //Get services
        public function bp_register_rest_routes_get_services() {
            register_rest_route('booking-pro/v1', '/get-services', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_services_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'page' => [
                        'required' => false,
                        'default' => 1,
                        'sanitize_callback' => 'absint', 
                    ],
                    'limit' => [
                        'required' => false,
                        'default' => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    
                ],

            ]);
        }
        public function bp_get_services_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');
            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }
            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            // Get pagination parameters from the request
            $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
            $limit = $request->get_param('limit') ? intval($request->get_param('limit')) : 10;
            $offset = ($page - 1) * $limit; 

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_services';
            $sql = "SELECT * FROM $table_name";
            $sql .= " LIMIT $limit OFFSET $offset";
            $services = $wpdb->get_results($sql);
            $total_services = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            $total_pages = ceil($total_services / $limit);

            if(!empty($services)){
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $services,
                    'total_pages' => $total_pages,
                    'current_page' => $page,
                    'total_services' => $total_services,
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No services found!',
                    
                ], 200);
            }

            
        }

        //Delete Service
        public function bp_register_rest_routes_delete_service() {
            register_rest_route('booking-pro/v1', '/delete-service/(?P<id>\d+)', [
                'methods'  => 'DELETE',
                'callback' => [$this, 'bp_delete_service_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'required' => true,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                ],
            ]);
        }
        public function bp_delete_service_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $service_id = $request['id']; // Extract the service ID from the request

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_services';

            // Check if service is exist in $table_name
            $existing_service = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $service_id));
            if(!$existing_service){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Service not found!',
                ], 404);
            }

            // Attempt to delete the service
            $delete_service = $wpdb->delete(
                $table_name,
                array(
                    'id' => $service_id,
                )
            );

            if($delete_service){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Service deleted successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to delete service!',
                ], 500);
            }
        }

        //Update Service
        public function bp_register_rest_routes_update_service() {
            register_rest_route('booking-pro/v1', '/update-service', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_update_service_callback'],
                'permission_callback' => '__return_true',
                
            ]);
        }
        public function bp_update_service_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $service_id = intval($request['service_id']); // Extract the service ID from the request
            $service_name = sanitize_text_field($request['service_name']);
            $service_description = sanitize_text_field($request['service_description']);
            $service_price = floatval($request['service_price']);
            $service_duration = intval($request['service_duration']);
            $service_status = sanitize_text_field($request['service_status']);

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_services';

            // Check if service is exist in $table_name
            $existing_service = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $service_id));
            if(!$existing_service){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Service not found!',
                ], 404);
            }

            // Update data into the database
            $update_service = $wpdb->update(
                $table_name,
                array(
                    'service_name' => $service_name,
                    'description' => $service_description,
                    'price' => $service_price,
                    'duration' => $service_duration,
                    'status'=> $service_status,
                ),
                array(
                    'id' => $service_id,
                )
            );

            if($update_service){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Service updated successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to update service!',
                ], 500);
            }
        }
    // Register REST API routes for service page end

    
    // Register REST API routes for appointment page start
        public function bp_register_rest_routes_get_appointments() {
            register_rest_route('booking-pro/v1', '/get-appointments', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_appointments_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'page' => [
                        'required' => false,
                        'default' => 1,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                    'limit' => [
                        'required' => false,
                        'default' => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    'search' => [
                        'required' => false,
                        'sanitize_callback' => 'sanitize_text_field', // Sanitize the search query
                    ],
                ],

            ]);
        }
        public function bp_get_appointments_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            // Get pagination parameters from the request
            $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
            $limit = $request->get_param('limit') ? intval($request->get_param('limit')) : 10;
            $search = $request->get_param('search') ? sanitize_text_field($request->get_param('search')) : '';
            $offset = ($page - 1) * $limit; 

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_appointments';

            $sql = "SELECT * FROM $table_name";

            // Add search functionality if a search term is provided
            if (!empty($search)) {
                $sql .= $wpdb->prepare(" WHERE full_name LIKE %s OR email LIKE %s", '%' . $wpdb->esc_like($search) . '%', '%' . $wpdb->esc_like($search) . '%');
            }

            // Add LIMIT and OFFSET for pagination
            $sql .= $wpdb->prepare(" LIMIT %d OFFSET %d", $limit, $offset);

            $appointments = $wpdb->get_results($sql);

            // Get total number of records (for pagination)
            $total_appointments = $wpdb->get_var("SELECT COUNT(*) FROM $table_name" . (!empty($search) ? $wpdb->prepare(" WHERE full_name LIKE %s OR email LIKE %s", '%' . $wpdb->esc_like($search) . '%', '%' . $wpdb->esc_like($search) . '%') : ''));

            // Calculate total pages
            $total_pages = ceil($total_appointments / $limit);

            // Return the response with pagination info
            if (!empty($appointments)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $appointments,
                    'total_pages' => $total_pages,
                    'current_page' => $page,
                    'total_appointments' => $total_appointments,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No Apointments  found',
                ], 500);
            }
        }

        public function bp_register_rest_routes_get_appointment_time_slot(){
            register_rest_route('booking-pro/v1', '/get-appointment-time-slot', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_appointment_time_slot_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'appointment_date' => [
                        'required' => false,
                        'sanitize_callback' => 'sanitize_text_field', // Sanitize the appointment date
                    ],
                ],

            ]);        
        }
        public function bp_get_appointment_time_slot_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            
            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_appointment_time_slot';

            $sql = "SELECT * FROM $table_name";

            $appointment_time_slots = $wpdb->get_results($sql);

            if (!empty($appointment_time_slots)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $appointment_time_slots,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No Apointment time slot  found',
                ], 500);
            }
        }

        public function bp_register_rest_routes_update_appointment_status() {
            register_rest_route('booking-pro/v1', '/update-appointment-status', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_update_appointment_status_callback'],
                'permission_callback' => '__return_true',

            ]);
        }
        public function bp_update_appointment_status_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $appointment_id = intval($request['appointment_id']); // Extract the appointment ID from the request
            $appointment_status = sanitize_text_field($request['appointment_status']);

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_appointments';

            // Check if appointment is exist in $table_name
            $existing_appointment = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $appointment_id));
            if(!$existing_appointment){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Appointment not found!',
                ], 404);
            }

            // Update data into the database
            $update_appointment = $wpdb->update(
                $table_name,
                array(
                    'status' => $appointment_status,
                ),
                array(
                    'id' => $appointment_id,
                )
            );

            if($update_appointment){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Appointment status updated successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to update. Please change appointment status!',
                ], 200);
            }
        }

        public function bp_register_rest_routes_delete_appointment() {
            register_rest_route('booking-pro/v1', '/delete-appointment', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_delete_appointment_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'required' => true,
                        'sanitize_callback' => 'absint', // Ensures the value is a positive integer.
                    ],
                ],
            ]);
        }
        public function bp_delete_appointment_callback( $request ) {
            // Check for the nonce
            $nonce = $request->get_header('X-WP-Nonce');

            if (!$nonce) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce not found in headers!',
                ], 403);
            }

            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Nonce Validation Failed!',
                ], 403);
            }

            $appointment_id = $request->get_param('id');;  // Extract the appointment ID from the url parameter

            global $wpdb;
            $table_name = $wpdb->prefix . 'bp_appointments';

            // Check if appointment is exist in $table_name
            $existing_appointment = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $appointment_id));
            if(!$existing_appointment){
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Appointment not found!',
                ], 404);
            }

            // Delete data from the database
            $delete_appointment = $wpdb->delete(
                $table_name,
                array(
                    'id' => $appointment_id,
                )
            );

            if($delete_appointment){
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Appointment deleted successfully!',
                ], 200);
            }else{
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to delete appointment!',
                ], 500);
            }
        }
        
    // Register REST API routes for appointment page end 

    // Register REST API routes for calender page start
        public function bp_register_rest_routes_get_appointments_by_status(){
            register_rest_route('booking-pro/v1', '/get-appointments-by-status', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_appointments_by_status_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_appointments_by_status_callback( $request ) {
            // Check for the nonce


            global $wpdb;
            $table_appointments = $wpdb->prefix . 'bp_appointments';
            $table_time_slots = $wpdb->prefix . 'bp_appointment_time_slot';
            
            // Join the bp_appointments table with the appointment_time_slot table to get the slot_time instead of time ID
            $sql = "
                SELECT 
                    a.id, 
                    a.full_name, 
                    a.appointment_date, 
                    t.slot_time AS appointment_time 
                FROM $table_appointments AS a
                JOIN $table_time_slots AS t 
                ON a.appointment_time = t.id
                WHERE a.status = 'scheduled'
            ";
            
            $appointments = $wpdb->get_results($sql);
            


            if (!empty($appointments)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $appointments,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No Apointments  found',
                ], 500);
            }

            
        }
    // Register REST API routes for calender page end

    // Register REST API routes for dashboard page start
        public function bp_register_rest_routes_get_appointments_overview(){
            register_rest_route('booking-pro/v1', '/get-appointments-overview', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_appointments_overview_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_appointments_overview_callback($request) {
            global $wpdb;
            $table_appointments = $wpdb->prefix . 'bp_appointments';
            $table_services = $wpdb->prefix . 'bp_services'; // Assuming this is the services table
        
            // SQL query to get appointment overview including total revenue from completed appointments
            $sql = "
                SELECT
                    COUNT(a.id) AS total_appointments,
                    SUM(CASE WHEN a.status = 'scheduled' THEN 1 ELSE 0 END) AS scheduled_appointments,
                    SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) AS completed_appointments,
                    SUM(CASE WHEN a.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_appointments,
                    COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price END), 0) AS total_revenue
                FROM $table_appointments AS a
                LEFT JOIN $table_services AS s ON a.service_id = s.id
            ";
        
            $appointments_overview = $wpdb->get_row($sql);
        
            // Get the count of all customers from the WordPress users table with the role 'bp_user'
            $total_customers = count(get_users(array(
                'role' => 'bp_user', 
                'exclude' => get_users(array('role' => 'administrator', 'fields' => 'ID')), // Exclude administrator IDs
                'fields' => 'ID' // Only get user IDs for counting
            )));
        
            // Add the total customers to the appointments overview object
            if (!empty($appointments_overview)) {
                $appointments_overview->total_customers = $total_customers; // Add total customers
        
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $appointments_overview, // Include the updated overview with total customers
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No appointments found',
                ], 500);
            }
        }

        public function bp_register_rest_routes_get_upcomming_appointments(){
            register_rest_route('booking-pro/v1', '/get-upcomming-appointments', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_upcomming_appointments_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_upcomming_appointments_callback($request) {
            global $wpdb;
            $table_appointments = $wpdb->prefix . 'bp_appointments';
            $table_services = $wpdb->prefix . 'bp_services'; // Assuming you have this table
            $table_staff = $wpdb->prefix . 'bp_staff'; // Assuming you have this table
            $table_time_slots = $wpdb->prefix . 'bp_appointment_time_slot';
        
            $sql = "
                SELECT
                    a.id AS appointment_id,
                    a.full_name AS customer_name,  -- Using full_name directly from appointments
                    s.service_name,
                    st.name AS staff_name,
                    s.duration AS service_duration,
                    s.price AS service_price,  -- Get the price from the services table
                    a.appointment_date,
                    t.slot_time AS appointment_time
                FROM $table_appointments AS a
                JOIN $table_services AS s ON a.service_id = s.id  -- Join with services table
                JOIN $table_staff AS st ON a.staff_id = st.id  -- Join with staff table
                JOIN $table_time_slots AS t ON a.appointment_time = t.id  -- Join with time slots table
                WHERE a.status = 'scheduled'
                ORDER BY a.appointment_date ASC, a.appointment_time ASC
                LIMIT 5
            ";
        
            $appointments = $wpdb->get_results($sql);
        
            if (!empty($appointments)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $appointments,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No Appointments found',
                ], 500);
            }
        }

        public function bp_register_rest_routes_get_appointments_data_for_chart(){
            register_rest_route('booking-pro/v1', '/get-appointments-chart', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_appointments_chart_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_appointments_chart_callback($request) {
            global $wpdb;
            $table_appointments = $wpdb->prefix . 'bp_appointments';
        
            // Query to get appointment counts grouped by date
            $sql = "
                SELECT 
                    DATE(a.appointment_date) AS appointment_date,
                    COUNT(a.id) AS appointment_count
                FROM $table_appointments AS a
                WHERE a.status = 'scheduled'
                GROUP BY DATE(a.appointment_date)
                ORDER BY DATE(a.appointment_date) ASC
            ";
        
            // Execute the query and get results
            $appointments_data = $wpdb->get_results($sql);
        
            // If data is found, return it in the expected format
            if (!empty($appointments_data)) {
                $formatted_data = [];
        
                // Format data for chart.js frontend
                foreach ($appointments_data as $row) {
                    $formatted_data[] = [
                        'date' => date('j M', strtotime($row->appointment_date)), // Format date as '1 Sep', '2 Sep', etc.
                        'appointments' => intval($row->appointment_count), // Count of appointments
                    ];
                }
        
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $formatted_data, // Pass formatted data
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No Appointments found',
                ], 500);
            }
        }

        public function bp_register_rest_routes_get_revenue_data_for_chart(){
            register_rest_route('booking-pro/v1', '/get-revenue-chart', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_revenue_chart_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_revenue_chart_callback($request) {
            global $wpdb;
            $table_appointments = $wpdb->prefix . 'bp_appointments';
            $table_services = $wpdb->prefix . 'bp_services';
        
            // Query to get the total revenue grouped by appointment date
            $sql = "
                SELECT 
                    DATE(a.appointment_date) AS revenue_date,
                    SUM(s.price) AS total_revenue
                FROM $table_appointments AS a
                JOIN $table_services AS s ON a.service_id = s.id
                WHERE a.status = 'completed' -- Only completed appointments should count towards revenue
                GROUP BY DATE(a.appointment_date)
                ORDER BY DATE(a.appointment_date) ASC
            ";
        
            // Execute the query and get results
            $revenue_data = $wpdb->get_results($sql);
        
            // Check if we have data and format it for the frontend
            if (!empty($revenue_data)) {
                $formatted_data = [];
        
                foreach ($revenue_data as $row) {
                    $formatted_data[] = [
                        'date' => date('j M', strtotime($row->revenue_date)), // Format date as '1 Sep', '2 Sep'
                        'revenue' => floatval($row->total_revenue), // Ensure the revenue is a float
                    ];
                }
        
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $formatted_data, // Pass formatted data
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No revenue data found',
                ], 500);
            }
        }
        
        
        
        
        
        
    // Register REST API routes for dashboard page end

    // Register REST API routes for settings page start
        // Get slots
        public function bp_register_rest_routes_get_time_slots(){
            register_rest_route('booking-pro/v1', '/get-time-slots', [
                'methods'  => 'GET',
                'callback' => [$this, 'bp_get_time_slots_callback'],
                'permission_callback' => '__return_true',

            ]);

        }
        public function bp_get_time_slots_callback($request) {
            global $wpdb;
            $table_time_slots = $wpdb->prefix . 'bp_appointment_time_slot';

            $sql = "SELECT * FROM $table_time_slots";
            $time_slots = $wpdb->get_results($sql);

            if (!empty($time_slots)) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'data' => $time_slots,
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'No time slots found',
                ], 500);
            }
        }

        // Register remove slots REST route
        public function bp_register_rest_routes_remove_time_slot(){
            register_rest_route('booking-pro/v1', '/remove-time-slot/(?P<id>\d+)', [
                'methods'  => 'DELETE',
                'callback' => [$this, 'bp_remove_time_slot_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'required' => true,
                        'sanitize_callback' => 'absint', // Ensure the value is a positive integer
                    ],
                ],
            ]);
        }
        public function bp_remove_time_slot_callback($request) {
            global $wpdb;
            $table_time_slots = $wpdb->prefix . 'bp_appointment_time_slot';

            $slot_id = $request['id'];

            // Check if the slot exists before attempting to delete
            $slot_exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_time_slots WHERE id = %d", $slot_id));

            if (!$slot_exists) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Time slot does not exist',
                ], 404);
            }

            // Attempt to delete the time slot
            $result = $wpdb->delete($table_time_slots, ['id' => $slot_id]);

            if ($result !== false) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Time slot removed successfully',
                ], 200);
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to remove time slot',
                ], 500);
            }
        }

        // Register add slots REST route
        public function bp_register_rest_routes_add_time_slot(){
            register_rest_route('booking-pro/v1', '/add-time-slot', [
                'methods'  => 'POST',
                'callback' => [$this, 'bp_add_time_slot_callback'],
                'permission_callback' => '__return_true',
            ]);
        }
        public function bp_add_time_slot_callback($request) {
            global $wpdb;
            $table_time_slots = $wpdb->prefix . 'bp_appointment_time_slot';

            $slot_time = $request['slot_time'];

            // Check if the slot time already exists
            $slot_exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_time_slots WHERE slot_time = %s", $slot_time));

            if ($slot_exists) {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Time slot already exists',
                ], 200); 
            }

            // Insert the new time slot
            $result = $wpdb->insert($table_time_slots, ['slot_time' => $slot_time]);

            if ($result !== false) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Time slot added successfully',
                ], 201); // 201 Created
            } else {
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => 'Failed to add time slot',
                ], 500);
            }
        }

        // Register update slots REST route

    // Register REST API routes for settings page end
        
}
new BP_Admin();