<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Performance optimizations (admin only)
 */
class Performance
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
    // Disable emojis in admin
    if ($this->settings->get('disable_emojis_admin')) {
      $this->disable_emojis();
    }

    // Disable embeds in admin
    if ($this->settings->get('disable_embeds_admin')) {
      $this->disable_embeds();
    }

    // Heartbeat control
    $heartbeat = $this->settings->get('disable_heartbeat', 'default');
    if ('disable' === $heartbeat) {
      $this->disable_heartbeat();
    } elseif ('modify' === $heartbeat) {
      $this->modify_heartbeat();
    }

    // Unload scripts and styles
    add_action('admin_enqueue_scripts', array($this, 'unload_assets'), 999);
  }

  /**
   * Disable emojis
   */
  private function disable_emojis()
  {
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
  }

  /**
   * Disable embeds
   */
  private function disable_embeds()
  {
    add_action('admin_init', function () {
      wp_dequeue_script('wp-embed');
    });
  }

  /**
   * Disable heartbeat
   */
  private function disable_heartbeat()
  {
    add_action('admin_init', function () {
      wp_deregister_script('heartbeat');
    }, 1);
  }

  /**
   * Modify heartbeat frequency
   */
  private function modify_heartbeat()
  {
    add_filter('heartbeat_settings', function ($settings) {
      $frequency = $this->settings->get('heartbeat_frequency', 60);
      $settings['interval'] = $frequency;
      return $settings;
    });
  }

  /**
   * Unload specific scripts and styles
   */
  public function unload_assets()
  {
    // Get scripts to unload
    $unload_scripts = $this->settings->get('unload_scripts', array());
    foreach ($unload_scripts as $handle) {
      wp_dequeue_script($handle);
      wp_deregister_script($handle);
    }

    // Get styles to unload
    $unload_styles = $this->settings->get('unload_styles', array());
    foreach ($unload_styles as $handle) {
      wp_dequeue_style($handle);
      wp_deregister_style($handle);
    }
  }

  /**
   * Get all registered scripts
   */
  public function get_registered_scripts()
  {
    global $wp_scripts;

    $scripts = array();

    try {
      if (! empty($wp_scripts->registered) && is_array($wp_scripts->registered)) {
        foreach ($wp_scripts->registered as $handle => $script) {
          // Ensure src is a string
          $src = '';
          if (isset($script->src)) {
            $src = is_string($script->src) ? $script->src : '';
          }

          $scripts[] = array(
            'handle' => (string) $handle,
            'src' => $src,
          );
        }
      }
    } catch (\Exception $e) {
      error_log('ACSB Error getting scripts: ' . $e->getMessage());
    }

    return $scripts;
  }

  /**
   * Get all registered styles
   */
  public function get_registered_styles()
  {
    global $wp_styles;

    $styles = array();

    try {
      if (! empty($wp_styles->registered) && is_array($wp_styles->registered)) {
        foreach ($wp_styles->registered as $handle => $style) {
          // Ensure src is a string
          $src = '';
          if (isset($style->src)) {
            $src = is_string($style->src) ? $style->src : '';
          }

          $styles[] = array(
            'handle' => (string) $handle,
            'src' => $src,
          );
        }
      }
    } catch (\Exception $e) {
      error_log('ACSB Error getting styles: ' . $e->getMessage());
    }

    return $styles;
  }
}
