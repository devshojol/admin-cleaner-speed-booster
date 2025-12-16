<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

class REST_API
{

  private static $instance = null;
  private $namespace = 'acsb/v1';

  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  private function __construct()
  {
    add_action('rest_api_init', array($this, 'register_routes'), 5);
  }

  public function register_routes()
  {
    if (! function_exists('register_rest_route')) {
      return;
    }

    // Settings endpoints
    register_rest_route($this->namespace, '/settings', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_settings'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/settings', array(
      'methods'             => 'POST',
      'callback'            => array($this, 'update_settings'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/settings/reset', array(
      'methods'             => 'POST',
      'callback'            => array($this, 'reset_settings'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    // UI data endpoints
    register_rest_route($this->namespace, '/dashboard-widgets', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_dashboard_widgets'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/menu-items', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_menu_items'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/scripts', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_scripts'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/styles', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_styles'),
      'permission_callback' => array($this, 'check_permission'),
    ));

    register_rest_route($this->namespace, '/analytics', array(
      'methods'             => 'GET',
      'callback'            => array($this, 'get_analytics'),
      'permission_callback' => array($this, 'check_permission'),
    ));
  }

  public function check_permission()
  {
    return current_user_can('manage_options');
  }

  public function get_settings($request)
  {
    try {
      $settings = Settings::get_instance();
      return rest_ensure_response($settings->get_settings());
    } catch (\Exception $e) {
      error_log('ACSB REST Error (get_settings): ' . $e->getMessage());
      return new \WP_Error(
        'settings_error',
        __('Failed to retrieve settings.', 'admin-cleaner-speed-booster'),
        array('status' => 500)
      );
    }
  }

  public function update_settings($request)
  {
    try {
      $params = $request->get_json_params();

      if (! isset($params['settings']) || ! is_array($params['settings'])) {
        return new \WP_Error(
          'invalid_data',
          __('Invalid settings data.', 'admin-cleaner-speed-booster'),
          array('status' => 400)
        );
      }

      $settings = Settings::get_instance();
      $success = $settings->update_settings($params['settings']);

      if ($success) {
        return rest_ensure_response(array(
          'success' => true,
          'message' => __('Settings saved successfully.', 'admin-cleaner-speed-booster'),
          'settings' => $settings->get_settings(),
        ));
      }

      return new \WP_Error(
        'save_failed',
        __('Failed to save settings.', 'admin-cleaner-speed-booster'),
        array('status' => 500)
      );
    } catch (\Exception $e) {
      error_log('ACSB REST Error (update_settings): ' . $e->getMessage());
      return new \WP_Error(
        'update_error',
        __('An error occurred while updating settings.', 'admin-cleaner-speed-booster'),
        array('status' => 500)
      );
    }
  }

  public function reset_settings($request)
  {
    try {
      $settings = Settings::get_instance();
      $success = $settings->reset_settings();

      if ($success) {
        return rest_ensure_response(array(
          'success' => true,
          'message' => __('Settings reset to defaults.', 'admin-cleaner-speed-booster'),
          'settings' => $settings->get_settings(),
        ));
      }

      return new \WP_Error(
        'reset_failed',
        __('Failed to reset settings.', 'admin-cleaner-speed-booster'),
        array('status' => 500)
      );
    } catch (\Exception $e) {
      error_log('ACSB REST Error (reset_settings): ' . $e->getMessage());
      return new \WP_Error(
        'reset_error',
        __('An error occurred while resetting settings.', 'admin-cleaner-speed-booster'),
        array('status' => 500)
      );
    }
  }

  public function get_dashboard_widgets($request)
  {
    try {
      // Dashboard widgets need admin context
      // Return empty array in REST context to avoid errors
      if (! is_admin() || ! function_exists('wp_dashboard_setup')) {
        return rest_ensure_response(array());
      }

      $ui_cleaner = UI_Cleaner::get_instance();
      $widgets = $ui_cleaner->get_dashboard_widgets();

      return rest_ensure_response(is_array($widgets) ? $widgets : array());
    } catch (\Exception $e) {
      error_log('ACSB REST Error (get_dashboard_widgets): ' . $e->getMessage());
      // Return empty array instead of error
      return rest_ensure_response(array());
    }
  }

  public function get_menu_items($request)
  {
    try {
      global $menu;

      // Menu might not be available in REST context
      if (empty($menu) || ! is_array($menu)) {
        return rest_ensure_response(array());
      }

      $ui_cleaner = UI_Cleaner::get_instance();
      $items = $ui_cleaner->get_menu_items();

      return rest_ensure_response(is_array($items) ? $items : array());
    } catch (\Exception $e) {
      error_log('ACSB REST Error (get_menu_items): ' . $e->getMessage());
      // Return empty array instead of error
      return rest_ensure_response(array());
    }
  }

  public function get_scripts($request)
  {
    try {
      global $wp_scripts;

      if (empty($wp_scripts)) {
        wp_scripts();
      }

      $performance = Performance::get_instance();
      $scripts = $performance->get_registered_scripts();

      return rest_ensure_response(is_array($scripts) ? $scripts : array());
    } catch (\Exception $e) {
      error_log('ACSB REST Error (get_scripts): ' . $e->getMessage());
      return rest_ensure_response(array());
    }
  }

  public function get_styles($request)
  {
    try {
      global $wp_styles;

      if (empty($wp_styles)) {
        wp_styles();
      }

      $performance = Performance::get_instance();
      $styles = $performance->get_registered_styles();

      return rest_ensure_response(is_array($styles) ? $styles : array());
    } catch (\Exception $e) {
      error_log('ACSB REST Error (get_styles): ' . $e->getMessage());
      return rest_ensure_response(array());
    }
  }

  public function get_analytics($request)
  {
    // Mock data for now (Pro feature)
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
