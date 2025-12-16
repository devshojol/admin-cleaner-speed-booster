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
 */

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

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
    $this->load_dependencies();

    register_activation_hook(ACSB_PLUGIN_FILE, array($this, 'activate'));
    register_deactivation_hook(ACSB_PLUGIN_FILE, array($this, 'deactivate'));

    add_action('plugins_loaded', array($this, 'init'), 1);
    add_action('init', array($this, 'load_textdomain'));
  }

  private function load_dependencies()
  {
    require_once ACSB_PLUGIN_DIR . 'includes/class-settings.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-performance.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-ui-cleaner.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-white-label.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-analytics.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-rest-api.php';
    require_once ACSB_PLUGIN_DIR . 'includes/class-main.php';
  }

  public function init()
  {
    Settings::get_instance();
    REST_API::get_instance();

    if (is_admin()) {
      Main::get_instance();
      Performance::get_instance();
      UI_Cleaner::get_instance();
      White_Label::get_instance();
      Analytics::get_instance();
    }
  }

  public function activate()
  {
    $defaults = array(
      // UI Cleaner
      'disable_dashboard_widgets' => array(),
      'hide_admin_notices' => false,
      'hidden_menu_items' => array(),
      'disable_gutenberg_roles' => array(),
      'custom_footer_text' => '',

      // Performance
      'disable_emojis_admin' => false,
      'disable_embeds_admin' => false,
      'disable_heartbeat' => 'default',
      'heartbeat_frequency' => 60,
      'unload_scripts' => array(),
      'unload_styles' => array(),

      // White Label
      'custom_admin_logo' => '',
      'custom_admin_logo_url' => '',
      'custom_login_logo' => '',
      'hide_wp_version' => false,
      'remove_wp_logo_admin_bar' => false,
      'custom_admin_css' => '',

      // Analytics
      'enable_analytics' => false,
      'analytics_data' => array(),

      // Meta
      'version' => ACSB_VERSION,
    );

    if (! get_option('acsb_settings')) {
      add_option('acsb_settings', $defaults);
    }
  }

  public function deactivate()
  {
    flush_rewrite_rules();
  }

  public function load_textdomain()
  {
    load_plugin_textdomain(
      'admin-cleaner-speed-booster',
      false,
      dirname(ACSB_PLUGIN_BASENAME) . '/languages'
    );
  }
}

Admin_Cleaner_Speed_Booster::get_instance();
