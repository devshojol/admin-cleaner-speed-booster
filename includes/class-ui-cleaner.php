<?php

namespace AdminCleaner;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * UI cleanup functionality
 */
class UI_Cleaner
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
    // Remove dashboard widgets
    add_action('wp_dashboard_setup', array($this, 'remove_dashboard_widgets'), 999);

    // Hide admin notices
    if ($this->settings->get('hide_admin_notices')) {
      add_action('admin_print_styles', array($this, 'hide_admin_notices'));
    }

    // Hide menu items
    add_action('admin_menu', array($this, 'hide_menu_items'), 999);

    // Disable Gutenberg for specific roles
    add_filter('use_block_editor_for_post_type', array($this, 'disable_gutenberg'), 10, 2);

    // Custom footer text
    if ($this->settings->get('custom_footer_text')) {
      add_filter('admin_footer_text', array($this, 'custom_footer_text'));
    }
  }

  /**
   * Remove dashboard widgets
   */
  public function remove_dashboard_widgets()
  {
    global $wp_meta_boxes;

    $widgets_to_remove = $this->settings->get('disable_dashboard_widgets', array());

    foreach ($widgets_to_remove as $widget) {
      // Parse widget ID (format: context_id_priority)
      $parts = explode('_', $widget, 3);
      if (count($parts) >= 3) {
        list($context, $id, $priority) = $parts;
        remove_meta_box($id, 'dashboard', $context);
      }
    }
  }

  /**
   * Get all dashboard widgets
   */
  public function get_dashboard_widgets()
  {
    global $wp_meta_boxes;

    $widgets = array();

    try {
      // Ensure dashboard setup is loaded
      if (! function_exists('wp_dashboard_setup')) {
        require_once ABSPATH . 'wp-admin/includes/dashboard.php';
      }

      // Trigger dashboard setup
      if (empty($wp_meta_boxes['dashboard'])) {
        wp_dashboard_setup();
      }

      // Get widgets
      if (! empty($wp_meta_boxes['dashboard']) && is_array($wp_meta_boxes['dashboard'])) {
        foreach ($wp_meta_boxes['dashboard'] as $context => $priority_boxes) {
          if (! is_array($priority_boxes)) {
            continue;
          }

          foreach ($priority_boxes as $priority => $boxes) {
            if (! is_array($boxes)) {
              continue;
            }

            foreach ($boxes as $id => $box) {
              if (! is_array($box) || empty($box['title'])) {
                continue;
              }

              $widgets[] = array(
                'id' => $id,
                'title' => strip_tags($box['title']),
                'context' => $context,
                'priority' => $priority,
                'key' => $context . '_' . $id . '_' . $priority,
              );
            }
          }
        }
      }
    } catch (\Exception $e) {
      error_log('ACSB Error getting dashboard widgets: ' . $e->getMessage());
    }

    return $widgets;
  }

  /**
   * Hide admin notices
   */
  public function hide_admin_notices()
  {
    // Don't hide notices on our own page
    $screen = get_current_screen();
    if ($screen && 'toplevel_page_admin-cleaner' === $screen->id) {
      return;
    }

    echo '<style>
            .notice, .error, .updated, .update-nag {
                display: none !important;
            }
        </style>';
  }

  /**
   * Hide menu items
   */
  public function hide_menu_items()
  {
    $current_user = wp_get_current_user();
    $user_roles = $current_user->roles;

    $hidden_items = $this->settings->get('hidden_menu_items', array());

    foreach ($hidden_items as $item) {
      // Check if this applies to current user's role
      if (isset($item['roles']) && is_array($item['roles'])) {
        $applies = false;
        foreach ($user_roles as $role) {
          if (in_array($role, $item['roles'], true)) {
            $applies = true;
            break;
          }
        }

        if ($applies && isset($item['menu_slug'])) {
          remove_menu_page($item['menu_slug']);
        }
      }
    }
  }

  /**
   * Get all admin menu items
   */
  public function get_menu_items()
  {
    global $menu;

    $items = array();

    try {
      // Ensure menu is set up
      if (empty($menu)) {
        // Menu might not be set up yet in REST context
        return $items;
      }

      if (is_array($menu)) {
        foreach ($menu as $item) {
          if (! is_array($item) || empty($item[0])) {
            continue;
          }

          // Skip separators
          if (false !== strpos($item[0], 'separator')) {
            continue;
          }

          $items[] = array(
            'title' => strip_tags($item[0]),
            'slug' => isset($item[2]) ? $item[2] : '',
            'capability' => isset($item[1]) ? $item[1] : '',
          );
        }
      }
    } catch (\Exception $e) {
      error_log('ACSB Error getting menu items: ' . $e->getMessage());
    }

    return $items;
  }

  /**
   * Disable Gutenberg for specific roles
   */
  public function disable_gutenberg($use_block_editor, $post_type)
  {
    $current_user = wp_get_current_user();
    $user_roles = $current_user->roles;

    $disabled_roles = $this->settings->get('disable_gutenberg_roles', array());

    foreach ($user_roles as $role) {
      if (in_array($role, $disabled_roles, true)) {
        return false;
      }
    }

    return $use_block_editor;
  }

  /**
   * Custom footer text
   */
  public function custom_footer_text()
  {
    $custom_text = $this->settings->get('custom_footer_text');
    return $custom_text ? esc_html($custom_text) : '';
  }
}
