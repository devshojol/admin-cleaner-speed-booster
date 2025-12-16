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

    if (! is_admin()) {
      return;
    }

    $this->init_hooks();
  }

  private function init_hooks()
  {
    // Custom login logo
    if ($this->settings->get('custom_login_logo')) {
      add_action('login_enqueue_scripts', array($this, 'custom_login_logo'));
    }

    // Custom admin logo
    if ($this->settings->get('custom_admin_logo')) {
      add_action('admin_head', array($this, 'custom_admin_logo'));
    }

    // Hide WP version
    if ($this->settings->get('hide_wp_version')) {
      add_filter('update_footer', '__return_empty_string', 999);
      remove_action('wp_head', 'wp_generator');
    }

    // Remove WP logo from admin bar
    if ($this->settings->get('remove_wp_logo_admin_bar')) {
      add_action('admin_bar_menu', array($this, 'remove_wp_logo'), 999);
    }

    // Custom admin CSS
    if ($this->settings->get('custom_admin_css')) {
      add_action('admin_head', array($this, 'custom_admin_css'));
    }
  }

  public function custom_login_logo()
  {
    $logo_url = $this->settings->get('custom_login_logo');
?>
    <style>
      #login h1 a {
        background-image: url('<?php echo esc_url($logo_url); ?>') !important;
        background-size: contain !important;
        width: 100% !important;
        height: 80px !important;
      }
    </style>
  <?php
  }

  public function custom_admin_logo()
  {
    $logo_url = $this->settings->get('custom_admin_logo');
    $logo_link = $this->settings->get('custom_admin_logo_url') ?: admin_url();
  ?>
    <style>
      #wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon:before {
        background-image: url('<?php echo esc_url($logo_url); ?>') !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        content: '' !important;
        width: 20px !important;
        height: 20px !important;
      }

      #wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon {
        width: 20px !important;
        height: 20px !important;
      }
    </style>
<?php
  }

  public function remove_wp_logo($wp_admin_bar)
  {
    $wp_admin_bar->remove_node('wp-logo');
  }

  public function custom_admin_css()
  {
    $css = $this->settings->get('custom_admin_css');
    if ($css) {
      echo '<style>' . wp_strip_all_tags($css) . '</style>';
    }
  }
}
