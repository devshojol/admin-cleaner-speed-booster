<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Main admin functionality
 */
class Main
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
    add_action('admin_menu', array($this, 'add_admin_menu'));
    add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    add_filter('plugin_action_links_' . ACSB_PLUGIN_BASENAME, array($this, 'add_action_links'));
  }

  /**
   * Add admin menu page
   */
  public function add_admin_menu()
  {
    add_menu_page(
      __('Admin Cleaner', 'admin-cleaner-speed-booster'),
      __('Admin Cleaner', 'admin-cleaner-speed-booster'),
      'manage_options',
      'admin-cleaner',
      array($this, 'render_admin_page'),
      'dashicons-admin-tools',
      80
    );
  }

  /**
   * Render admin page
   */
  public function render_admin_page()
  {
    echo '<div id="acsb-admin-root"></div>';
  }

  /**
   * Enqueue admin assets
   */
  public function enqueue_admin_assets($hook)
  {
    // Only load on our plugin page
    if ('toplevel_page_admin-cleaner' !== $hook) {
      return;
    }

    // Enqueue built React app
    $asset_file = ACSB_PLUGIN_DIR . 'build/index.asset.php';

    if (! file_exists($asset_file)) {
      return;
    }

    $asset = require $asset_file;

    // Enqueue script
    wp_enqueue_script(
      'acsb-admin',
      ACSB_PLUGIN_URL . 'build/index.js',
      $asset['dependencies'],
      $asset['version'],
      true
    );

    // Enqueue styles
    wp_enqueue_style(
      'acsb-admin',
      ACSB_PLUGIN_URL . 'build/index.css',
      array('wp-components'),
      $asset['version']
    );

    // Pass data to React
    wp_localize_script(
      'acsb-admin',
      'acsbData',
      array(
        'nonce' => wp_create_nonce('wp_rest'),
        'apiUrl' => rest_url('acsb/v1'),
        'isPro' => class_exists('AdminCleaner\Pro'),
        'roles' => $this->get_available_roles(),
        'currentUser' => wp_get_current_user()->user_login,
      )
    );
  }

  /**
   * Get available WordPress roles
   */
  private function get_available_roles()
  {
    global $wp_roles;

    $roles = array();
    foreach ($wp_roles->roles as $role_key => $role) {
      $roles[] = array(
        'value' => $role_key,
        'label' => $role['name'],
      );
    }

    return $roles;
  }

  /**
   * Add plugin action links
   */
  public function add_action_links($links)
  {
    $settings_link = sprintf(
      '<a href="%s">%s</a>',
      admin_url('admin.php?page=admin-cleaner'),
      __('Settings', 'admin-cleaner-speed-booster')
    );

    array_unshift($links, $settings_link);

    return $links;
  }
}
