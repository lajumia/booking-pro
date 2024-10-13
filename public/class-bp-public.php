<?php 

class BP_Public{

    // Construct start
        public function __construct(){
            add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
            add_shortcode('booking_pro_form', [$this, 'render_bp_appointments_form']);
            add_shortcode('booking_pro_thank_you',[$this, 'render_bp_thank_you_page']);
            add_action('rest_api_init', [$this, 'register_rest_routes_for_appointments_form']);
            add_action('rest_api_init', [$this, 'register_rest_routes_for_submit_appointment_data']);
            add_action('rest_api_init', [$this, 'register_rest_routes_for_get_available_time_slot']);
        }
    // Construct end

    // Render form and enqueue scripts start
        public function enqueue_scripts(){
            $app_dep = require_once('views/appointments.asset.php');
            wp_enqueue_script('bp-appointments', BP_DIR_URL . 'public/views/appointments.js', $app_dep['dependencies'], $app_dep['version'], true);
            wp_enqueue_style('bp-appointments', BP_DIR_URL . 'public/assets/css/appointments-form.css', [], $app_dep['version'], 'all');

            $thank_dep = require_once('views/thankyou.asset.php');
            wp_enqueue_script('bp-thank-you', BP_DIR_URL . 'public/views/thankyou.js', $thank_dep['dependencies'], $thank_dep['version'], true);
            wp_enqueue_style('bp-thank-you', BP_DIR_URL . 'public/assets/css/thankyou.css', [], $thank_dep['version'], 'all');
            
            // Localize script to pass data to React app
            wp_localize_script('bp-appointments', 'appointmentForm', [
                'nonce' => wp_create_nonce('wp_rest'),
                'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
                'thank_you_page' => get_site_url() . '/booking-pro-thank-you/',
            ]);
        }
        public function render_bp_appointments_form(){
            return '<div id="bp-appointments-form"></div>';
        }
        public function render_bp_thank_you_page(){
            return '<div id="bp-thank-you-page"></div>';
        }
    // Render form and enqueue scripts end

    // Get appointment form data start
        public function register_rest_routes_for_appointments_form(){
            register_rest_route('booking-pro/v1', '/appointments-data', [
                'methods' => 'POST',
                'callback' => [$this, 'get_appointments_form_data'],
                'permission_callback' => '__return_true',
            ]);      
        }
        public function get_appointments_form_data(WP_REST_Request $request){
            //Check for the nonce
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

            // Fetch staff from staff table
            $staff_table = $wpdb->prefix . 'bp_staff';
            $staff = $wpdb->get_results(
                $wpdb->prepare("SELECT * FROM $staff_table WHERE status = %s", 'active')
            );

            // Fetch services from services table
            $service_table = $wpdb->prefix . 'bp_services';
            $services = $wpdb->get_results(
                $wpdb->prepare("SELECT * FROM $service_table WHERE status = %s", 'active')
            );

            
            return new WP_REST_Response([

                'staff' => $staff,
                'services' => $services,
            ],200);
            
            

        }
    // Get appointment form data end

    // Get time slot start
        public function register_rest_routes_for_get_available_time_slot(){
            register_rest_route('booking-pro/v1', '/available-time-slot', [
                'methods' => 'POST',
                'callback' => [$this, 'get_available_time_slot'],
                'permission_callback' => '__return_true',
                'args'=>[
                    'staff_id' => [
                        'required' => false,
                        'type' => 'integer',
                    ],
                    'date' => [
                        'required' => false,
                        'type' => 'string',
                    ],
                ]
            ]);      
        }
        public function get_available_time_slot(WP_REST_Request $request) {
            global $wpdb;
        
            $staff_id = intval($request['staff_id']); 
            $appointment_date = sanitize_text_field($request['date']);
        
            // Fetch all the time slots from the time slot table
            $time_slot_table = $wpdb->prefix . 'bp_appointment_time_slot';
            $appointments_table = $wpdb->prefix . 'bp_appointments';
            
            // Get all available time slots
            $all_slots = $wpdb->get_results("SELECT * FROM $time_slot_table");
        
            // Get the slots that are already booked for this staff member on the selected date
            $booked_slots = $wpdb->get_col(
                $wpdb->prepare(
                    "SELECT appointment_time FROM $appointments_table 
                    WHERE staff_id = %d AND appointment_date = %s",
                    $staff_id, $appointment_date
                )
            );
        
            // Filter out the booked slots from the available slots if there are booked slots
            if (!empty($booked_slots)) {
                $available_slots = array_filter($all_slots, function($slot) use ($booked_slots) {
                    // Cast both to integers for a proper comparison
                    return !in_array((int)$slot->id, array_map('intval', $booked_slots));
                });
            } else {
                // If no slots are booked, all slots are available
                $available_slots = $all_slots;
            }
        
            // Return the response with available slots
            return new WP_REST_Response([
                'status' => 'success',
                'data' => $available_slots
            ]);
        }
        
        
    // Get time slot end

    // Submit appointment data start
        public function register_rest_routes_for_submit_appointment_data(){
            register_rest_route('booking-pro/v1', '/submit-appointment', [
                'methods' => 'POST',
                'callback' => [$this, 'submit_appointment_callback'],
                'permission_callback' => '__return_true',

            ]);
        }
        public function submit_appointment_callback(WP_REST_Request $request){
            global $wpdb;
            
            $service_id = intval( $request['service_id'] );
            $staff_id = intval( $request['staff_id'] );
            $appointment_date = $request['appointment_date'];
            $appointment_time = intval( $request['appointment_time'] );
            $customer_name = sanitize_text_field( $request['customer_name'] );
            $customer_email = sanitize_email( $request['customer_email'] );
            $customer_phone = sanitize_text_field( $request['customer_phone'] );
            $customer_notes = sanitize_textarea_field( $request['customer_notes'] );

            $appointment_table = $wpdb->prefix . 'bp_appointments';
            $insert = $wpdb->insert(
                $appointment_table,
                [   'full_name' => $customer_name,
                    'email' => $customer_email,
                    'phone' => $customer_phone,
                    'notes' => $customer_notes,
                    'customer_id' => get_current_user_id(),
                    'staff_id' => $staff_id,
                    'service_id' => $service_id,
                    'appointment_date' => $appointment_date,
                    'appointment_time' => $appointment_time
            ],
            [ '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%s', '%d' ] // Data formats
            );

            if ( $insert ) {
                return new WP_REST_Response([
                    'status' => 'success',
                    'message' => 'Appointment submitted successfully!',
                ], 200 );
            } else {
                // Debug the database error
                $error = $wpdb->last_error;
                return new WP_REST_Response([
                    'status' => 'failed',
                    'message' => $error,
                    
                ], 500 );
            }
        }

    // Submit appointment data end    



}//class end
new BP_Public();