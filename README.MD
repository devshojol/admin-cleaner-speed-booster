# Build Instructions

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PHP 8.0 or higher
- WordPress 6.0 or higher

## Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development mode:**
```bash
npm run start
```

This will:
- Watch for file changes
- Compile React components
- Generate source maps
- Auto-reload on changes

3. **Access the plugin:**
- Go to WordPress Admin → Plugins
- Activate "Admin Cleaner & Speed Booster"
- Navigate to "Admin Cleaner" in sidebar

## Production Build

1. **Build optimized assets:**
```bash
npm run build
```

This will:
- Minify JavaScript
- Optimize CSS
- Remove source maps
- Generate production-ready files in `/build`

2. **Test the build:**
- Ensure no console errors
- Test all features
- Verify all tabs work
- Check mobile responsiveness

## Deployment

### For WordPress.org

1. **Prepare clean package:**
```bash
# Remove development files
rm -rf node_modules
rm -rf src
rm package.json package-lock.json
rm postcss.config.js tailwind.config.js
rm .gitignore BUILD.md

# Keep only production files
```

2. **Create ZIP:**
```bash
cd ..
zip -r admin-cleaner-speed-booster.zip admin-cleaner-speed-booster/
```

3. **Submit to WordPress.org:**
- Visit: https://wordpress.org/plugins/developers/add/
- Upload ZIP file
- Follow submission guidelines

### For GitHub

1. **Tag release:**
```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

2. **Create release:**
- Go to GitHub releases
- Create new release
- Attach ZIP file
- Add changelog

## File Structure
```
admin-cleaner-speed-booster/
├── build/                  # Compiled assets (generated)
│   ├── admin.js
│   ├── admin.css
│   └── admin.asset.php
├── includes/              # PHP classes
│   ├── class-main.php
│   ├── class-settings.php
│   ├── class-performance.php
│   ├── class-ui-cleaner.php
│   ├── class-white-label.php
│   ├── class-analytics.php
│   └── class-rest-api.php
├── src/                   # React source (dev only)
│   ├── admin/
│   │   ├── index.js
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── utils/
│   └── styles/
│       └── admin.css
├── admin-cleaner-speed-booster.php  # Main plugin file
├── uninstall.php          # Cleanup on uninstall
├── readme.txt             # WordPress.org readme
├── package.json           # npm dependencies
├── postcss.config.js      # PostCSS config
└── tailwind.config.js     # Tailwind config
```

## Testing Checklist

- [ ] All tabs load without errors
- [ ] Settings save correctly
- [ ] Settings persist after page reload
- [ ] Reset button works
- [ ] Import/export works
- [ ] Analytics tracking works
- [ ] White label features apply
- [ ] Performance optimizations work
- [ ] No JavaScript console errors
- [ ] No PHP errors in debug.log
- [ ] Responsive on mobile
- [ ] Works with block editor
- [ ] Works with classic editor
- [ ] Deactivation works cleanly
- [ ] Reactivation restores settings

## Troubleshooting

**React not loading:**
```bash
# Rebuild assets
npm run build

# Check file permissions
chmod 755 build/
```

**Settings not saving:**
```bash
# Check REST API
curl http://yoursite.local/wp-json/acsb/v1/settings

# Enable debug mode in wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

**CSS not applying:**
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Verify file exists
ls -la build/admin.css
```

## Version Management

When releasing new version:

1. Update version in:
   - `admin-cleaner-speed-booster.php` (Plugin header)
   - `readme.txt` (Stable tag)
   - `package.json` (Version)
   - Define constant `ACSB_VERSION`

2. Update changelog in `readme.txt`

3. Build production assets

4. Create Git tag

5. Submit to WordPress.org SVN
