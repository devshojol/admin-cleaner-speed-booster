<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

class Settings
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
    // Settings managed via REST API
  }

  public function get_settings()
  {
    $defaults = $this->get_defaults();
    $settings = get_option('acsb_settings', $defaults);

    return wp_parse_args($settings, $defaults);
  }

  public function get_defaults()
  {
    return array(
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
  }

  public function update_settings($new_settings)
  {
    $current = $this->get_settings();
    $sanitized = $this->sanitize_settings($new_settings);
    $updated = array_merge($current, $sanitized);

    return update_option('acsb_settings', $updated);
  }

  private function sanitize_settings($settings)
  {
    $sanitized = array();

    // UI Cleaner
    if (isset($settings['disable_dashboard_widgets']) && is_array($settings['disable_dashboard_widgets'])) {
      $sanitized['disable_dashboard_widgets'] = array_map('sanitize_text_field', $settings['disable_dashboard_widgets']);
    }

    if (isset($settings['hide_admin_notices'])) {
      $sanitized['hide_admin_notices'] = (bool) $settings['hide_admin_notices'];
    }

    if (isset($settings['hidden_menu_items']) && is_array($settings['hidden_menu_items'])) {
      $sanitized['hidden_menu_items'] = $settings['hidden_menu_items'];
    }

    if (isset($settings['disable_gutenberg_roles']) && is_array($settings['disable_gutenberg_roles'])) {
      $sanitized['disable_gutenberg_roles'] = array_map('sanitize_text_field', $settings['disable_gutenberg_roles']);
    }

    if (isset($settings['custom_footer_text'])) {
      $sanitized['custom_footer_text'] = sanitize_text_field($settings['custom_footer_text']);
    }

    // Performance
    if (isset($settings['disable_emojis_admin'])) {
      $sanitized['disable_emojis_admin'] = (bool) $settings['disable_emojis_admin'];
    }

    if (isset($settings['disable_embeds_admin'])) {
      $sanitized['disable_embeds_admin'] = (bool) $settings['disable_embeds_admin'];
    }

    if (isset($settings['disable_heartbeat'])) {
      $sanitized['disable_heartbeat'] = sanitize_text_field($settings['disable_heartbeat']);
    }

    if (isset($settings['heartbeat_frequency'])) {
      $sanitized['heartbeat_frequency'] = absint($settings['heartbeat_frequency']);
    }
    if (isset($settings['unload_scripts']) && is_array($settings['unload_scripts'])) {
      $sanitized['unload_scripts'] = array_map('sanitize_text_field', $settings['unload_scripts']);
    }
    if (isset($settings['unload_styles']) && is_array($settings['unload_styles'])) {
      $sanitized['unload_styles'] = array_map('sanitize_text_field', $settings['unload_styles']);
    }

    // White Label
    if (isset($settings['custom_admin_logo'])) {
      $sanitized['custom_admin_logo'] = esc_url_raw($settings['custom_admin_logo']);
    }

    if (isset($settings['custom_admin_logo_url'])) {
      $sanitized['custom_admin_logo_url'] = esc_url_raw($settings['custom_admin_logo_url']);
    }

    if (isset($settings['custom_login_logo'])) {
      $sanitized['custom_login_logo'] = esc_url_raw($settings['custom_login_logo']);
    }

    if (isset($settings['hide_wp_version'])) {
      $sanitized['hide_wp_version'] = (bool) $settings['hide_wp_version'];
    }

    if (isset($settings['remove_wp_logo_admin_bar'])) {
      $sanitized['remove_wp_logo_admin_bar'] = (bool) $settings['remove_wp_logo_admin_bar'];
    }

    if (isset($settings['custom_admin_css'])) {
      $sanitized['custom_admin_css'] = wp_strip_all_tags($settings['custom_admin_css']);
    }

    // Analytics
    if (isset($settings['enable_analytics'])) {
      $sanitized['enable_analytics'] = (bool) $settings['enable_analytics'];
    }

    if (isset($settings['analytics_data']) && is_array($settings['analytics_data'])) {
      $sanitized['analytics_data'] = $settings['analytics_data'];
    }

    return $sanitized;
  }

  public function reset_settings()
  {
    return update_option('acsb_settings', $this->get_defaults());
  }

  public function get($key, $default = null)
  {
    $settings = $this->get_settings();
    return isset($settings[$key]) ? $settings[$key] : $default;
  }
}
