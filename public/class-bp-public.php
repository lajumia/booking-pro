<?php 

class BP_Public{
    public function __construct(){
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_shortcode('bp-appointments-form', [$this, 'render_bp_appointments_form']);
        add_action('rest_api_init', [$this, 'register_rest_routes_for_appointments_data']);
    }

    public function enqueue_scripts(){
        $app_dep = require_once('views/appointments.asset.php');
        wp_enqueue_script('bp-appointments', BP_DIR_URL . 'public/views/appointments.js', $app_dep['dependencies'], $app_dep['version'], true);
        wp_enqueue_style('bp-appointments', BP_DIR_URL . 'public/assets/css/appointments-form.css', [], $app_dep['version'], 'all');
        
        // Localize script to pass data to React app
        wp_localize_script('bp-appointments', 'appointmentForm', [
            'nonce' => wp_create_nonce('wp_rest'),  // Generate a nonce for secure REST requests
            'api_base_url' => get_site_url() . '/wp-json/booking-pro/v1/',
        ]);

    }

    public function render_bp_appointments_form(){
        return '<div id="bp-appointments-form"></div>';
    }

    public function register_rest_routes_for_appointments_data(){
        register_rest_route('booking-pro/v1', '/appointments-data', [
            'methods' => 'POST',
            'callback' => [$this, 'get_appointments_data'],
            'permission_callback' => '__return_true',
            'args'=>[
                'staff_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'appointment_date' => [
                    'required' => false,
                    'type' => 'string',
                ],
            ]
        ]);      
    }
    public function get_appointments_data(WP_REST_Request $request){
        // Check for the nonce
        // $nonce = $request->get_header('X-WP-Nonce');

        // if (!$nonce) {
        //     return new WP_REST_Response([
        //         'status' => 'failed',
        //         'message' => 'Nonce not found in headers!',
        //     ], 403);
        // }

        // if (!wp_verify_nonce($nonce, 'wp_rest')) {
        //     return new WP_REST_Response([
        //         'status' => 'failed',
        //         'message' => 'Nonce Validation Failed!',
        //     ], 403);
        // }

        global $wpdb;
        $staff_id = intval( $request['staff_id'] );  // Staff member
        $appointment_date = sanitize_text_field( $request['appointment_date'] );  // Selected date

        // Fetch staff from staff table
        $staff_table = $wpdb->prefix . 'bp_staff';
        $staff = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $staff_table WHERE status = %s", 'active')
        );
        if(!$staff){
            return new WP_REST_Response(['message' => 'Staff not found'], 404);
        }

        // Fetch services from services table
        $service_table = $wpdb->prefix . 'bp_services';
        $services = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $service_table WHERE status = %s", 'active')
        );
        if(!$services){
            return new WP_REST_Response(['message' => 'Services not found'], 404);
        }
        

        //Fetch the time slot from the time slot table
        $time_slot_table = $wpdb->prefix . 'bp_appointment_time_slot';
        $all_slots = $wpdb->get_results("SELECT * FROM $time_slot_table");

        // Get the slots that are already booked for this staff member on the selected date
        // $booked_slots = $wpdb->get_col(
        //     $wpdb->prepare(
        //         "SELECT appointment_time_slot FROM wp_bp_appointments 
        //         WHERE staff_id = %d AND appointment_date = %s",
        //         $staff_id, $appointment_date
        //     )
        // );

        // if($booked_slots){
        //     // Filter out the booked slots from the available slots
        //     $available_slots = array_filter( $all_slots, function( $slot ) use ( $booked_slots ) {
        //         return !in_array( $slot->id, $booked_slots );
        //     });
        // }

        if($all_slots){
            return new WP_REST_Response([
                'status' => 'success',
                'staff' => $staff,
                'services' => $services,
                'slots' => $all_slots
            ]);;
        }else{
            return new WP_REST_Response([

                'staff' => $staff,
                'services' => $services,
                'slots' => "unavailable"
            ]);
        }
        

    }



}//class end
new BP_Public();