<?php

/**
 * Plugin Name: Admin Cleaner & Speed Booster
 * Description: Optimize WordPress admin panel by removing clutter and improving performance. Frontend unaffected.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: SHOJOL ISLAM
 * Author URI: https://shojol-islam.web.app/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: admin-cleaner-speed-booster
 * Domain Path: /languages
 */

namespace AdminCleaner;

// Prevent direct access
if (! defined('ABSPATH')) {
  exit;
}

// Define plugin constants
define('ACSB_VERSION', '1.0.0');
define('ACSB_PLUGIN_FILE', __FILE__);
define('ACSB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ACSB_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ACSB_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main plugin class
 */
class Admin_Cleaner_Speed_Booster
{

  private static $instance = null;

  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  private function __construct()
  {
    // Load dependencies immediately
    $this->load_dependencies();

    // Register activation/deactivation hooks
    register_activation_hook(ACSB_PLUGIN_FILE, array($this, 'activate'));
    register_deactivation_hook(ACSB_PLUGIN_FILE, array($this, 'deactivate'));

    // Initialize on plugins_loaded with high priority
    add_action('plugins_loaded', array($this, 'init'), 1);

    // Load text domain
    add_action('init', array($this, 'load_textdomain'));
  }

  /**
   * Load required files
   */
  private function load_dependencies()
  {
    require_once ACSB_PLUGIN_DIR . 'includes/class-settings.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-performance.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-ui-cleaner.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-rest-api.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-main.php';

    // Load Pro features if available
    if (file_exists(ACSB_PLUGIN_DIR . 'includes/class-pro.php')) {
      require_once ACSB_PLUGIN_DIR . 'includes/class-pro.php';
    }
  }

  /**
   * Initialize plugin
   */
  public function init()
  {
    // Initialize settings first
    Settings::get_instance();

    // Initialize REST API early
    REST_API::get_instance();

    // Only initialize admin components in admin
    if (is_admin()) {
      Main::get_instance();
      Performance::get_instance();
      UI_Cleaner::get_instance();

      // Initialize Pro features if available
      if (class_exists('AdminCleaner\Pro')) {
        Pro::get_instance();
      }
    }
  }

  /**
   * Plugin activation
   */
  public function activate()
  {
    // Set default options
    $defaults = array(
      'disable_dashboard_widgets' => array(),
      'hide_admin_notices' => false,
      'hidden_menu_items' => array(),
      'disable_gutenberg_roles' => array(),
      'custom_footer_text' => '',
      'disable_emojis_admin' => false,
      'disable_embeds_admin' => false,
      'disable_heartbeat' => 'default',
      'heartbeat_frequency' => 60,
      'unload_scripts' => array(),
      'unload_styles' => array(),
      'version' => ACSB_VERSION,
    );

    if (! get_option('acsb_settings')) {
      add_option('acsb_settings', $defaults);
    }

    // Create safe mode recovery option
    if (! get_option('acsb_safe_mode')) {
      add_option('acsb_safe_mode', false);
    }

    // Flush rewrite rules
    flush_rewrite_rules();
  }

  /**
   * Plugin deactivation
   */
  public function deactivate()
  {
    // Flush rewrite rules
    flush_rewrite_rules();
  }

  /**
   * Load text domain
   */
  public function load_textdomain()
  {
    load_plugin_textdomain(
      'admin-cleaner-speed-booster',
      false,
      dirname(ACSB_PLUGIN_BASENAME) . '/languages'
    );
  }
}

// Initialize plugin immediately
Admin_Cleaner_Speed_Booster::get_instance();
