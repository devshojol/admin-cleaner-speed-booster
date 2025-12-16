<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Pro features
 *
 * This is a stub for pro functionality.
 * In production, this would be a separate premium add-on.
 */
class Pro
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

    // Only run in admin
    if (! is_admin()) {
      return;
    }

    $this->init_hooks();
  }

  /**
   * Initialize hooks
   */
  private function init_hooks()
  {
    // Custom admin logo
    if ($this->settings->get('custom_admin_logo')) {
      add_action('login_head', array($this, 'custom_admin_logo'));
    }

    // Custom admin title
    if ($this->settings->get('custom_admin_title')) {
      add_filter('admin_title', array($this, 'custom_admin_title'), 10, 2);
    }

    // Remove WordPress branding
    if ($this->settings->get('remove_wp_branding')) {
      $this->remove_wp_branding();
    }

    // Register REST routes for analytics
    add_action('rest_api_init', array($this, 'register_analytics_routes'));
  }

  /**
   * Custom admin logo
   */
  public function custom_admin_logo()
  {
    $logo_url = $this->settings->get('custom_admin_logo');

    if ($logo_url) {
      echo '<style>
                #login h1 a {
                    background-image: url(' . esc_url($logo_url) . ') !important;
                    background-size: contain !important;
                    width: 100% !important;
                }
            </style>';
    }
  }

  /**
   * Custom admin title
   */
  public function custom_admin_title($admin_title, $title)
  {
    $custom_title = $this->settings->get('custom_admin_title');

    if ($custom_title) {
      return $title . ' - ' . $custom_title;
    }

    return $admin_title;
  }

  /**
   * Remove WordPress branding
   */
  private function remove_wp_branding()
  {
    // Remove version from admin footer
    add_filter('update_footer', '__return_empty_string', 999);

    // Remove WordPress logo from admin bar
    add_action('admin_bar_menu', function ($wp_admin_bar) {
      $wp_admin_bar->remove_node('wp-logo');
    }, 999);
  }

  /**
   * Register analytics REST routes
   */
  public function register_analytics_routes()
  {
    register_rest_route('acsb/v1', '/analytics', array(
      'methods' => 'GET',
      'callback' => array($this, 'get_analytics'),
      'permission_callback' => function () {
        return current_user_can('manage_options');
      },
    ));
  }

  /**
   * Get analytics data
   */
  public function get_analytics($request)
  {
    // This would track admin page loads, script usage, etc.
    // For now, return mock data
    return rest_ensure_response(array(
      'pageLoads' => array(
        'dashboard' => 150,
        'posts' => 89,
        'pages' => 45,
      ),
      'avgLoadTime' => 1.2,
      'scriptsLoaded' => 42,
      'stylesLoaded' => 28,
    ));
  }
}
