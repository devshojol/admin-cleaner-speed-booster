import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  TextControl,
  ToggleControl,
  TextareaControl,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@wordpress/components";

const WhiteLabel = ({ settings, onChange }) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleImageUpload = (field) => {
    if (uploadingLogo) return;

    const frame = wp.media({
      title: __("Select or Upload Logo", "admin-cleaner-speed-booster"),
      button: {
        text: __("Use this logo", "admin-cleaner-speed-booster"),
      },
      multiple: false,
    });

    frame.on("select", () => {
      const attachment = frame.state().get("selection").first().toJSON();
      onChange(field, attachment.url);
    });

    frame.open();
  };

  if (!settings) {
    return (
      <div className="p-6">
        <p>{__("Loading...", "admin-cleaner-speed-booster")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🎨 {__("White Label Your Admin", "admin-cleaner-speed-booster")}
        </h3>
        <p className="text-sm text-blue-800">
          {__(
            "Customize the WordPress admin interface with your own branding. Perfect for client sites!",
            "admin-cleaner-speed-booster"
          )}
        </p>
      </div>

      {/* Custom Login Logo */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Login Page Logo", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Replace the WordPress logo on the login page with your own.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextControl
                label={__("Login logo URL", "admin-cleaner-speed-booster")}
                value={settings?.custom_login_logo || ""}
                onChange={(value) => onChange("custom_login_logo", value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => handleImageUpload("custom_login_logo")}
            >
              {__("Upload Logo", "admin-cleaner-speed-booster")}
            </Button>
          </div>

          {settings?.custom_login_logo && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {__("Preview:", "admin-cleaner-speed-booster")}
              </p>
              <img
                src={settings.custom_login_logo}
                alt="Login logo preview"
                className="max-w-xs border border-gray-300 rounded"
                style={{ maxHeight: "80px" }}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Custom Admin Bar Logo */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Admin Bar Logo", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Replace the WordPress logo in the admin bar with your own.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <TextControl
                label={__("Admin bar logo URL", "admin-cleaner-speed-booster")}
                value={settings?.custom_admin_logo || ""}
                onChange={(value) => onChange("custom_admin_logo", value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => handleImageUpload("custom_admin_logo")}
            >
              {__("Upload Logo", "admin-cleaner-speed-booster")}
            </Button>
          </div>

          <TextControl
            label={__(
              "Logo link URL (optional)",
              "admin-cleaner-speed-booster"
            )}
            help={__(
              "Where should the logo link to? Leave empty for default.",
              "admin-cleaner-speed-booster"
            )}
            value={settings?.custom_admin_logo_url || ""}
            onChange={(value) => onChange("custom_admin_logo_url", value)}
            placeholder="https://example.com"
          />

          {settings?.custom_admin_logo && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {__("Preview:", "admin-cleaner-speed-booster")}
              </p>
              <img
                src={settings.custom_admin_logo}
                alt="Admin logo preview"
                className="max-w-xs border border-gray-300 rounded"
                style={{ maxHeight: "20px" }}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* WordPress Branding */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("WordPress Branding", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <ToggleControl
              label={__(
                "Remove WordPress logo from admin bar",
                "admin-cleaner-speed-booster"
              )}
              help={__(
                "Hide the WordPress logo menu in the top left corner.",
                "admin-cleaner-speed-booster"
              )}
              checked={settings?.remove_wp_logo_admin_bar || false}
              onChange={(value) => onChange("remove_wp_logo_admin_bar", value)}
            />

            <ToggleControl
              label={__(
                "Hide WordPress version",
                "admin-cleaner-speed-booster"
              )}
              help={__(
                "Remove WordPress version from admin footer and meta tags.",
                "admin-cleaner-speed-booster"
              )}
              checked={settings?.hide_wp_version || false}
              onChange={(value) => onChange("hide_wp_version", value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Custom Admin CSS */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Custom Admin CSS", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Add custom CSS to style the WordPress admin area.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <TextareaControl
            label={__("Custom CSS", "admin-cleaner-speed-booster")}
            help={__(
              "Advanced: Add custom CSS rules. Use carefully!",
              "admin-cleaner-speed-booster"
            )}
            value={settings?.custom_admin_css || ""}
            onChange={(value) => onChange("custom_admin_css", value)}
            rows={8}
            placeholder=".wp-admin { background: #f0f0f0; }"
          />

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️{" "}
              {__(
                "Warning: Invalid CSS can break your admin panel. Test carefully!",
                "admin-cleaner-speed-booster"
              )}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default WhiteLabel;
