<?php

/**
 * Uninstall script
 *
 * Fired when the plugin is uninstalled
 */

// Exit if accessed directly
if (! defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

// Delete options
delete_option('acsb_settings');
delete_option('acsb_safe_mode');

// Delete transients
delete_transient('acsb_analytics_cache');

// For multisite
if (is_multisite()) {
  global $wpdb;

  $blog_ids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");

  foreach ($blog_ids as $blog_id) {
    switch_to_blog($blog_id);

    delete_option('acsb_settings');
    delete_option('acsb_safe_mode');
    delete_transient('acsb_analytics_cache');

    restore_current_blog();
  }
}
