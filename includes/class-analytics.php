<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Admin analytics functionality
 */
class Analytics
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

    if ($this->settings->get('enable_analytics')) {
      $this->init_hooks();
    }
  }

  private function init_hooks()
  {
    add_action('admin_init', array($this, 'track_page_load'));
  }

  public function track_page_load()
  {
    $screen = get_current_screen();

    if (! $screen) {
      return;
    }

    $analytics_data = $this->settings->get('analytics_data', array());

    if (! isset($analytics_data['page_loads'])) {
      $analytics_data['page_loads'] = array();
    }

    $page_id = $screen->id;

    if (! isset($analytics_data['page_loads'][$page_id])) {
      $analytics_data['page_loads'][$page_id] = 0;
    }

    $analytics_data['page_loads'][$page_id]++;
    $analytics_data['last_updated'] = current_time('timestamp');

    // Update settings
    $current_settings = $this->settings->get_settings();
    $current_settings['analytics_data'] = $analytics_data;
    update_option('acsb_settings', $current_settings);
  }

  public function get_analytics()
  {
    global $wp_scripts, $wp_styles;

    $analytics_data = $this->settings->get('analytics_data', array());

    $page_loads = isset($analytics_data['page_loads']) ? $analytics_data['page_loads'] : array();

    // Sort by visits
    arsort($page_loads);

    // Get top 10
    $top_pages = array_slice($page_loads, 0, 10, true);

    // Format page names
    $formatted_pages = array();
    foreach ($top_pages as $page_id => $count) {
      $formatted_pages[] = array(
        'id' => $page_id,
        'name' => $this->format_page_name($page_id),
        'visits' => $count,
      );
    }

    return array(
      'topPages' => $formatted_pages,
      'totalScripts' => is_object($wp_scripts) ? count($wp_scripts->registered) : 0,
      'totalStyles' => is_object($wp_styles) ? count($wp_styles->registered) : 0,
      'lastUpdated' => isset($analytics_data['last_updated']) ? $analytics_data['last_updated'] : null,
    );
  }

  private function format_page_name($page_id)
  {
    $names = array(
      'dashboard' => 'Dashboard',
      'edit-post' => 'Posts',
      'edit-page' => 'Pages',
      'upload' => 'Media',
      'edit-comments' => 'Comments',
      'themes' => 'Themes',
      'plugins' => 'Plugins',
      'users' => 'Users',
      'tools' => 'Tools',
      'options-general' => 'Settings',
    );

    return isset($names[$page_id]) ? $names[$page_id] : ucfirst(str_replace(array('-', '_'), ' ', $page_id));
  }

  public function reset_analytics()
  {
    $current_settings = $this->settings->get_settings();
    $current_settings['analytics_data'] = array();
    return update_option('acsb_settings', $current_settings);
  }
}
