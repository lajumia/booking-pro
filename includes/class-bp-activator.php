<?php 

class BP_Activator {
    public static function bp_activate() {
        global $wpdb;

        // Table names
        $bp_customers = $wpdb->prefix . 'bp_customers';
        $bp_staff = $wpdb->prefix . 'bp_staff';
        $bp_services = $wpdb->prefix . 'bp_services';
        $bp_appointments = $wpdb->prefix . 'bp_appointments';
        $bp_payments = $wpdb->prefix . 'bp_payments';
        $bp_notifications = $wpdb->prefix . 'bp_notifications';
        $bp_appointment_time_slot = $wpdb->prefix . 'bp_appointment_time_slot';

        $charset_collate = $wpdb->get_charset_collate();

        // SQL query to create the bp_customers table
        $sql_customers = "CREATE TABLE IF NOT EXISTS `{$bp_customers}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `phone` VARCHAR(20) DEFAULT NULL,
            `photo` VARCHAR(255) DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`)
        ) $charset_collate;";

        // SQL query to create the bp_staff table
        $sql_staff = "CREATE TABLE IF NOT EXISTS `{$bp_staff}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `profile` VARCHAR(255) NOT NULL,
            `name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `phone` VARCHAR(20) DEFAULT NULL,
            `role` VARCHAR(255) NOT NULL,
            `status` ENUM('active', 'inactive') DEFAULT 'active', 
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`)
        ) $charset_collate;";            

        // SQL query to create the bp_services table
        $sql_services = "CREATE TABLE IF NOT EXISTS `{$bp_services}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `service_name` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `price` DECIMAL(10, 2) NOT NULL,
            `duration` INT(11) NOT NULL,
            `status` ENUM('active', 'inactive') DEFAULT 'active', 
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) $charset_collate;";


        // SQL query to create the bp_appointments table
        $sql_appointments = "CREATE TABLE IF NOT EXISTS `{$bp_appointments}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `full_name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `phone` VARCHAR(20) NOT NULL,
            `notes` VARCHAR(255) NOT NULL,
            `customer_id` BIGINT(20) UNSIGNED NOT NULL,
            `staff_id` BIGINT(20) UNSIGNED NOT NULL,
            `service_id` BIGINT(20) UNSIGNED NOT NULL,
            `appointment_date` VARCHAR(255) NOT NULL,
            `appointment_time` BIGINT(20) UNSIGNED NOT NULL,
            `status` ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `customer_id` (`customer_id`),
            KEY `staff_id` (`staff_id`),
            KEY `service_id` (`service_id`)
        ) $charset_collate;";

        // SQL query to create the bp_payments table
        $sql_payments = "CREATE TABLE IF NOT EXISTS `{$bp_payments}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `customer_id` BIGINT(20) UNSIGNED NOT NULL,
            `appointment_id` BIGINT(20) UNSIGNED NOT NULL,
            `amount` DECIMAL(10, 2) NOT NULL,
            `payment_date` DATETIME NOT NULL,
            `payment_method` VARCHAR(255) NOT NULL,
            `status` ENUM('completed', 'failed', 'pending') DEFAULT 'pending',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `customer_id` (`customer_id`),
            KEY `appointment_id` (`appointment_id`)
            ) $charset_collate;";            

        // SQL query to create the bp_notifications table
        $sql_notifications = "CREATE TABLE IF NOT EXISTS `{$bp_notifications}` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` BIGINT(20) UNSIGNED NOT NULL,
            `message` TEXT NOT NULL,
            `is_read` TINYINT(1) DEFAULT 0,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `user_id` (`user_id`)
        ) $charset_collate;";

        // Sql query to create the bp_appointment_time_slot table
        $sql_appointment_time_slot = "CREATE TABLE IF NOT EXISTS `{$bp_appointment_time_slot}` (
            `id` BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `slot_time` VARCHAR(50) NOT NULL, -- e.g., '9:00 AM - 10:00 AM'
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
           
        ) $charset_collate;";
        


        // Include the required file for dbDelta()
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Execute the query to create the tables in the correct order
        dbDelta($sql_customers);
        dbDelta($sql_staff);
        dbDelta($sql_services);
        dbDelta($sql_appointments);
        dbDelta($sql_appointment_time_slot);
        dbDelta($sql_payments); 
        dbDelta($sql_notifications);

        // Add the foreign key constraints manually
        $foreign_keys_for_appointment = "ALTER TABLE `{$bp_appointments}`
        ADD CONSTRAINT `fk_customer_appointment` FOREIGN KEY (`customer_id`) REFERENCES `{$wpdb->users}` (`ID`) ON DELETE CASCADE,
        ADD CONSTRAINT `fk_staff_appointment` FOREIGN KEY (`staff_id`) REFERENCES `{$bp_staff}` (`id`) ON DELETE CASCADE,
        ADD CONSTRAINT `fk_service_appointment` FOREIGN KEY (`service_id`) REFERENCES `{$bp_services}` (`id`) ON DELETE CASCADE;";
        $wpdb->query($foreign_keys_for_appointment);

        // Add the foreign key constraints manually
        $foreign_keys_for_payment = "ALTER TABLE `{$bp_payments}`
        ADD CONSTRAINT `fk_customer_appointment` FOREIGN KEY (`customer_id`) REFERENCES `{$wpdb->users}` (`ID`) ON DELETE CASCADE,
        ADD CONSTRAINT `fk_appointment_payment` FOREIGN KEY (`appointment_id`) REFERENCES `{$bp_appointments}` (`id`) ON DELETE CASCADE;";
        $wpdb->query($foreign_keys_for_payment);

        // Insert slot time into appointment time slot table

        // Check if the table is empty
        $slot_count = $wpdb->get_var("SELECT COUNT(*) FROM $bp_appointment_time_slot");

        if ($slot_count == 0) {
            // Insert slot time into appointment time slot table
            $slot_times = [
                '9:00 AM - 10:00 AM',
                '10:00 AM - 11:00 AM',
                '11:00 AM - 12:00 PM',
                '12:00 PM - 1:00 PM',
                '1:00 PM - 2:00 PM',
                '2:00 PM - 3:00 PM',
                '3:00 PM - 4:00 PM',
                '4:00 PM - 5:00 PM',
                '5:00 PM - 6:00 PM',
                '6:00 PM - 7:00 PM',
                '7:00 PM - 8:00 PM',
                '8:00 PM - 9:00 PM'
            ];

            // Insert slots time into the table
            foreach ($slot_times as $slot_time) {
                $wpdb->insert(
                    $bp_appointment_time_slot,
                    array(
                        'slot_time' => $slot_time
                    )
                );
            }

        }

        // Create a new page with shortcode 
        $page_title = 'Booking Pro';
        $page_content = '[booking_pro_form]';
        $page_template = '';
        $page = get_page_by_title($page_title);
        if (empty($page)) {
            $page_id = wp_insert_post(
                array(
                    'post_title' => $page_title,
                    'post_content' => $page_content,
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'post_author' => 1,
                    'page_template' => $page_template
                )
            );
        }
        // Create a new page with shortcode for thank you page
        $thank_you_page_title = 'Booking Pro Thank You';
        $thank_you_page_content = '[booking_pro_thank_you]';
        $thank_you_page_template = '';
        $thank_you_page = get_page_by_title($thank_you_page_title);
        if (empty($thank_you_page)) {
            $thank_you_page_id = wp_insert_post(
                array(
                    'post_title' => $thank_you_page_title,
                    'post_content' => $thank_you_page_content,
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'post_author' => 1,
                    'page_template' => $thank_you_page_template
                )
            );
        }


        // Create custom role "BP User"
        add_role('bp_user', 'BP User', [
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
        ]);
        // Get all users
        $users = get_users();

        // Assign 'BP User' role to all existing users
        foreach ($users as $user) {
            $user->add_role('bp_user');
        }

        // Get the WordPress uploads directory path
        $upload_dir = wp_upload_dir();
        $bp_folder_path = $upload_dir['basedir'] . '/booking-pro';

        // Check if the folder exists
        if (!file_exists($bp_folder_path)) {
            // Create the directory
            wp_mkdir_p($bp_folder_path);
        }

    }//function end
}//class end
