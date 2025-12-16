<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * White label functionality
 */
class White_Label
{

  private static $instance = null;
  private $settings;

  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  private function __construct()
  {
    $this->settings = Settings::get_instance();
    $this->init_hooks();
  }

  private function init_hooks()
  {
    // Login page logo
    add_action('login_enqueue_scripts', array($this, 'login_logo_css'));
    add_filter('login_headerurl', array($this, 'login_logo_url'));
    add_filter('login_headertext', array($this, 'login_logo_title'));

    // Admin bar logo - use wp_before_admin_bar_render for better compatibility
    add_action('wp_before_admin_bar_render', array($this, 'add_admin_bar_logo_css'));
    add_action('admin_head', array($this, 'add_admin_bar_logo_css'));
    add_action('wp_head', array($this, 'add_admin_bar_logo_css'));

    // Remove/hide WP logo if needed
    if ($this->settings->get('remove_wp_logo_admin_bar')) {
      add_action('admin_bar_menu', array($this, 'remove_wp_logo'), 999);
    }

    // Hide WP version
    if ($this->settings->get('hide_wp_version')) {
      add_filter('update_footer', '__return_empty_string', 999);
      remove_action('wp_head', 'wp_generator');
      add_filter('the_generator', '__return_empty_string');
    }

    // Custom admin CSS
    add_action('admin_head', array($this, 'custom_admin_css'), 999);
  }

  /**
   * Login page logo CSS
   */
  public function login_logo_css()
  {
    $logo_url = $this->settings->get('custom_login_logo');

    if (empty($logo_url)) {
      return;
    }
?>
    <style type="text/css">
      #login h1 a,
      .login h1 a {
        background-image: url('<?php echo esc_url($logo_url); ?>') !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        width: 320px !important;
        height: 100px !important;
        padding: 0 !important;
        margin: 0 auto 25px !important;
      }
    </style>
  <?php
  }

  /**
   * Login logo URL
   */
  public function login_logo_url($url)
  {
    $custom_url = $this->settings->get('custom_admin_logo_url');
    return ! empty($custom_url) ? esc_url($custom_url) : home_url();
  }

  /**
   * Login logo title
   */
  public function login_logo_title($title)
  {
    return get_bloginfo('name');
  }

  /**
   * Add admin bar logo CSS
   */
  public function add_admin_bar_logo_css()
  {
    $logo_url = $this->settings->get('custom_admin_logo');

    if (empty($logo_url)) {
      return;
    }

    // Only output once
    static $output = false;
    if ($output) {
      return;
    }
    $output = true;
  ?>
    <style type="text/css" id="acsb-custom-logo-css">
      /* Replace WordPress logo with custom logo */
      #wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon:before {
        content: '' !important;
        background-image: url('<?php echo esc_url($logo_url); ?>') !important;
        background-size: 20px 20px !important;
        background-repeat: no-repeat !important;
        background-position: 0 6px !important;
        width: 20px !important;
        height: 32px !important;
        display: inline-block !important;
        vertical-align: top !important;
      }

      #wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon {
        width: 20px !important;
        height: 32px !important;
        font-size: 0 !important;
      }

      #wpadminbar #wp-admin-bar-wp-logo>.ab-item {
        padding: 0 7px !important;
      }
    </style>
<?php
  }

  /**
   * Remove WordPress logo completely
   */
  public function remove_wp_logo($wp_admin_bar)
  {
    $wp_admin_bar->remove_node('wp-logo');
  }

  /**
   * Custom admin CSS
   */
  public function custom_admin_css()
  {
    $css = $this->settings->get('custom_admin_css');

    if (empty($css)) {
      return;
    }

    echo '<style type="text/css" id="acsb-custom-admin-css">' . wp_strip_all_tags($css) . '</style>';
  }
}
