=== Admin Cleaner & Speed Booster ===
Contributors: devshojol
Author URI: https://shojol-islam.web.app
Tags: admin, performance, optimization, cleanup, dashboard
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Optimize your WordPress admin panel with powerful cleanup, performance, white-label, and analytics features. All free!

== Description ==

**Admin Cleaner & Speed Booster** is a comprehensive WordPress admin optimization plugin that helps you clean up clutter, boost performance, customize branding, and track usage - all without affecting your frontend site.

=  Key Features =

**UI Cleanup**
* Remove unwanted dashboard widgets
* Hide admin notices selectively
* Disable Gutenberg editor per user role
* Customize admin footer text
* Hide menu items per role

**Performance Optimization**
* Disable emojis in admin
* Disable embeds in admin
* Control Heartbeat API (disable or adjust frequency)
* Selectively unload admin scripts
* Selectively unload admin styles
* Reduce HTTP requests in admin

**White Label Customization**
* Custom login page logo
* Custom admin bar logo with link
* Hide WordPress version
* Remove WordPress logo from admin bar
* Add custom admin CSS

**Analytics Dashboard**
* Track most visited admin pages
* Monitor total scripts/styles loaded
* View usage statistics
* Reset analytics anytime

**Backup & Transfer**
* Export settings to JSON
* Import settings from JSON
* Transfer configurations between sites
* Backup before making changes

=  Why Use This Plugin? =

* **Faster Admin**: Remove unnecessary scripts and optimize performance
* **Cleaner Interface**: Hide clutter and focus on what matters
* **Professional Branding**: White-label for client sites
* **Data-Driven**: Understand your admin usage patterns
* **Safe**: Only affects admin panel, frontend stays untouched
* **Free Forever**: All features included, no premium upsells

=  Perfect For =

* Agencies managing client sites
* Developers optimizing workflows
* Site administrators reducing clutter
* Anyone wanting a faster admin experience

= 🔒 Privacy & Security =

* No external API calls
* No tracking or data collection
* All analytics stored locally
* GPL-compatible code
* No obfuscation

=  Multisite Compatible =

Works on both single sites and multisite networks.

=  Modern Technology =

Built with:
* React (WordPress components)
* REST API
* Modern WordPress standards
* Responsive design
* Accessible UI

== Installation ==

**Automatic Installation**

1. Go to Plugins → Add New
2. Search for "Admin Cleaner & Speed Booster"
3. Click "Install Now"
4. Activate the plugin

**Manual Installation**

1. Download the plugin ZIP file
2. Go to Plugins → Add New → Upload Plugin
3. Choose the ZIP file and click "Install Now"
4. Activate the plugin

**Configuration**

1. Go to "Admin Cleaner" in your WordPress admin menu
2. Configure settings across different tabs:
   - UI Cleaner: Remove widgets, hide notices
   - Performance: Optimize scripts and styles
   - White Label: Customize branding
   - Analytics: Enable tracking
   - Import/Export: Backup settings

== Frequently Asked Questions ==

= Will this affect my frontend site? =

No! All optimizations only affect the WordPress admin panel. Your frontend site, including page load times and functionality, remains completely unaffected.

= Is this plugin safe to use? =

Yes. The plugin includes safety features and all settings can be reset with one click. If something goes wrong, simply deactivate the plugin to restore defaults.

= Can I use this on client sites? =

Absolutely! The white-label features are perfect for client sites. Customize the branding to match your client's identity.

= Does it work with page builders? =

Yes. Since it only affects the admin panel, it works with all page builders including Elementor, Beaver Builder, Divi, and others.

= What happens to my settings if I deactivate? =

Settings are preserved. They're only removed if you uninstall the plugin completely.

= Can I export and import settings? =

Yes! Use the Import/Export tab to backup your settings or transfer them to another site.

= Does it slow down my site? =

No, it actually speeds up your admin panel by removing unnecessary scripts and resources.

= Is analytics data sent anywhere? =

No. All analytics data is stored locally in your WordPress database. Nothing is sent to external servers.

= Can I disable specific features? =

Yes. Every feature can be toggled on/off independently.

= Does it work with multisite? =

Yes, it works on both single sites and multisite networks.

== Screenshots ==

1. Main dashboard with all settings
2. UI Cleaner tab - Remove widgets and notices
3. Performance tab - Optimize scripts and styles
4. White Label tab - Customize branding
5. Analytics dashboard - Track admin usage
6. Import/Export tab - Backup settings

== Changelog ==

= 1.0.0 - 2024-12-16 =
* Initial release
* UI cleanup features
* Performance optimization
* White label customization
* Analytics dashboard
* Import/Export functionality
* Role-based controls
* Modern React interface

== Upgrade Notice ==

= 1.0.0 =
Initial release with all features free!

== Additional Info ==

**Development**
* GitHub: https://github.com/yourname/admin-cleaner-speed-booster
* Report bugs: https://github.com/yourname/admin-cleaner-speed-booster/issues

**Support**
* Documentation: https://example.com/docs
* Support forum: https://wordpress.org/support/plugin/admin-cleaner-speed-booster

**Credits**
Built with ❤️ using modern WordPress development practices.

== Technical Details ==

**Requirements**
* WordPress 6.0+
* PHP 8.0+
* Modern browser with JavaScript enabled

**Browser Support**
* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Edge (latest)

**Technologies Used**
* React via @wordpress/element
* WordPress REST API
* @wordpress/components
* Tailwind CSS
* Modern JavaScript (ES6+)

**Performance**
* Lazy loading of components
* Optimized database queries
* Minimal overhead
* Efficient caching

== For Developers ==

**Hooks & Filters**

`php
// Modify default settings
add_filter( 'acsb_default_settings', function( $defaults ) {
    $defaults['custom_setting'] = 'value';
    return $defaults;
} );

// Run code after settings save
add_action( 'acsb_settings_saved', function( $settings ) {
    // Your code here
} );
`

**REST API Endpoints**

* `GET /wp-json/acsb/v1/settings` - Get all settings
* `POST /wp-json/acsb/v1/settings` - Update settings
* `POST /wp-json/acsb/v1/settings/reset` - Reset to defaults
* `GET /wp-json/acsb/v1/settings/export` - Export settings
* `POST /wp-json/acsb/v1/settings/import` - Import settings
* `GET /wp-json/acsb/v1/analytics` - Get analytics data

**Contributing**

We welcome contributions! Please see our GitHub repository for contribution guidelines.

== Privacy Policy ==

This plugin does not:
* Collect any personal data
* Make external API calls
* Track user behavior outside your site
* Store cookies
* Send data to third parties

All data is stored locally in your WordPress database.
