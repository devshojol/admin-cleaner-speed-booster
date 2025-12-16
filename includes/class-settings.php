<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Settings management
 */
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
    // Settings are managed via REST API
  }

  /**
   * Get all settings
   */
  public function get_settings()
  {
    $defaults = $this->get_defaults();
    $settings = get_option('acsb_settings', $defaults);

    return wp_parse_args($settings, $defaults);
  }

  /**
   * Get default settings
   */
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
      'disable_heartbeat' => 'default', // default, disable, modify
      'heartbeat_frequency' => 60,
      'unload_scripts' => array(),
      'unload_styles' => array(),

      // Pro features
      'enable_analytics' => false,
      'custom_admin_logo' => '',
      'custom_admin_title' => '',
      'remove_wp_branding' => false,

      // Meta
      'version' => ACSB_VERSION,
    );
  }

  /**
   * Update settings
   */
  public function update_settings($new_settings)
  {
    $current = $this->get_settings();

    // Sanitize settings
    $sanitized = $this->sanitize_settings($new_settings);

    // Merge with current
    $updated = array_merge($current, $sanitized);

    // Update option
    return update_option('acsb_settings', $updated);
  }

  /**
   * Sanitize settings
   */
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

    return $sanitized;
  }

  /**
   * Reset to defaults
   */
  public function reset_settings()
  {
    return update_option('acsb_settings', $this->get_defaults());
  }

  /**
   * Get specific setting
   */
  public function get($key, $default = null)
  {
    $settings = $this->get_settings();
    return isset($settings[$key]) ? $settings[$key] : $default;
  }
}
