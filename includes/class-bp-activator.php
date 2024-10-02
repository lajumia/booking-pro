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
            `customer_id` BIGINT(20) UNSIGNED NOT NULL,
            `staff_id` BIGINT(20) UNSIGNED DEFAULT NULL,
            `service_id` BIGINT(20) UNSIGNED DEFAULT NULL,
            `appointment_date` DATETIME NOT NULL,
            `status` ENUM('pending', 'confirmed', 'completed', 'canceled') DEFAULT 'pending',
            `payment_status` ENUM('paid', 'unpaid') DEFAULT 'unpaid',
            `notes` TEXT DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
            
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
            KEY `appointment_id` (`appointment_id`),
            CONSTRAINT `fk_customer_payment` FOREIGN KEY (`customer_id`) REFERENCES `{$bp_customers}` (`id`) ON DELETE CASCADE,
            CONSTRAINT `fk_appointment_payment` FOREIGN KEY (`appointment_id`) REFERENCES `{$bp_appointments}` (`id`) ON DELETE CASCADE
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

        // Include the required file for dbDelta()
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Execute the query to create the tables in the correct order
        dbDelta($sql_customers);
        dbDelta($sql_staff);
        dbDelta($sql_services);
        dbDelta($sql_appointments);
        dbDelta($sql_payments); 
        dbDelta($sql_notifications);


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
