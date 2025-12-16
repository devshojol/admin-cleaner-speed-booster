import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  TextControl,
  ToggleControl,
  TextareaControl,
  Card,
  CardBody,
  CardHeader,
  Button,
  Notice,
} from "@wordpress/components";

const WhiteLabel = ({ settings, onChange }) => {
  const [uploadingField, setUploadingField] = useState(null);
  const [previewLoginLogo, setPreviewLoginLogo] = useState("");
  const [previewAdminLogo, setPreviewAdminLogo] = useState("");

  useEffect(() => {
    if (settings) {
      setPreviewLoginLogo(settings.custom_login_logo || "");
      setPreviewAdminLogo(settings.custom_admin_logo || "");
    }
  }, [settings]);

  const handleImageUpload = (field) => {
    if (uploadingField) return;

    // Check if wp.media is available
    if (typeof wp === "undefined" || typeof wp.media === "undefined") {
      alert(
        __(
          "WordPress media library is not available. Please make sure you are logged in.",
          "admin-cleaner-speed-booster"
        )
      );
      return;
    }

    setUploadingField(field);

    const frame = wp.media({
      title: __("Select or Upload Logo", "admin-cleaner-speed-booster"),
      button: {
        text: __("Use this image", "admin-cleaner-speed-booster"),
      },
      multiple: false,
      library: {
        type: "image",
      },
    });

    frame.on("select", () => {
      const attachment = frame.state().get("selection").first().toJSON();
      onChange(field, attachment.url);

      // Update preview immediately
      if (field === "custom_login_logo") {
        setPreviewLoginLogo(attachment.url);
      } else if (field === "custom_admin_logo") {
        setPreviewAdminLogo(attachment.url);
      }

      setUploadingField(null);
    });

    frame.on("close", () => {
      setUploadingField(null);
    });

    frame.open();
  };

  const handleUrlChange = (field, value) => {
    onChange(field, value);

    // Update preview immediately
    if (field === "custom_login_logo") {
      setPreviewLoginLogo(value);
    } else if (field === "custom_admin_logo") {
      setPreviewAdminLogo(value);
    }
  };

  const clearLogo = (field) => {
    onChange(field, "");

    if (field === "custom_login_logo") {
      setPreviewLoginLogo("");
    } else if (field === "custom_admin_logo") {
      setPreviewAdminLogo("");
    }
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

      <Notice status="info" isDismissible={false}>
        <strong>{__("Note:", "admin-cleaner-speed-booster")}</strong>{" "}
        {__(
          "After uploading logos and saving settings, you may need to refresh the page to see changes applied.",
          "admin-cleaner-speed-booster"
        )}
      </Notice>

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
              "Replace the WordPress logo on the login page with your own. Recommended size: 320x100px",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <TextControl
                  label={__("Login logo URL", "admin-cleaner-speed-booster")}
                  value={settings?.custom_login_logo || ""}
                  onChange={(value) =>
                    handleUrlChange("custom_login_logo", value)
                  }
                  placeholder="https://example.com/logo.png"
                  help={__(
                    "Enter the direct URL to your logo image",
                    "admin-cleaner-speed-booster"
                  )}
                />
              </div>
              <Button
                variant="primary"
                className="mb-4"
                onClick={() => handleImageUpload("custom_login_logo")}
                isBusy={uploadingField === "custom_login_logo"}
                disabled={uploadingField !== null}
              >
                {uploadingField === "custom_login_logo"
                  ? __("Uploading...", "admin-cleaner-speed-booster")
                  : __("Upload Logo", "admin-cleaner-speed-booster")}
              </Button>
              {previewLoginLogo && (
                <Button
                  className="mb-4"
                  variant="secondary"
                  isDestructive
                  onClick={() => clearLogo("custom_login_logo")}
                >
                  {__("Clear", "admin-cleaner-speed-booster")}
                </Button>
              )}
            </div>

            {previewLoginLogo && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {__("Preview:", "admin-cleaner-speed-booster")}
                </p>
                <div
                  className="bg-white p-4 rounded border border-gray-300 flex items-center justify-center"
                  style={{ minHeight: "120px" }}
                >
                  <img
                    src={previewLoginLogo}
                    alt="Login logo preview"
                    style={{
                      maxWidth: "320px",
                      maxHeight: "100px",
                      width: "auto",
                      height: "auto",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML +=
                        '<p class="text-red-500 text-sm">Failed to load image. Please check the URL.</p>';
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {__(
                    "This is how your logo will appear on the login page.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            )}

            {!previewLoginLogo && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {__(
                    "No logo uploaded yet. Upload or enter a URL to see preview.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            )}
          </div>
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
              "Replace the WordPress logo in the admin bar with your own. Recommended size: 20x20px (square)",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <TextControl
                  label={__(
                    "Admin bar logo URL",
                    "admin-cleaner-speed-booster"
                  )}
                  value={settings?.custom_admin_logo || ""}
                  onChange={(value) =>
                    handleUrlChange("custom_admin_logo", value)
                  }
                  placeholder="https://example.com/icon.png"
                  help={__(
                    "Enter the direct URL to your logo image",
                    "admin-cleaner-speed-booster"
                  )}
                />
              </div>
              <Button
                className="mb-4"
                variant="primary"
                onClick={() => handleImageUpload("custom_admin_logo")}
                isBusy={uploadingField === "custom_admin_logo"}
                disabled={uploadingField !== null}
              >
                {uploadingField === "custom_admin_logo"
                  ? __("Uploading...", "admin-cleaner-speed-booster")
                  : __("Upload Logo", "admin-cleaner-speed-booster")}
              </Button>
              {previewAdminLogo && (
                <Button
                  className="mb-4"
                  variant="secondary"
                  isDestructive
                  onClick={() => clearLogo("custom_admin_logo")}
                >
                  {__("Clear", "admin-cleaner-speed-booster")}
                </Button>
              )}
            </div>

            <TextControl
              label={__(
                "Logo link URL (optional)",
                "admin-cleaner-speed-booster"
              )}
              help={__(
                "Where should the logo link to? Leave empty to use default WordPress menu.",
                "admin-cleaner-speed-booster"
              )}
              value={settings?.custom_admin_logo_url || ""}
              onChange={(value) => onChange("custom_admin_logo_url", value)}
              placeholder="https://example.com"
            />

            {previewAdminLogo && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {__("Preview:", "admin-cleaner-speed-booster")}
                </p>
                <div className="bg-gray-800 p-3 rounded flex items-center gap-2">
                  <div
                    className="bg-gray-700 p-2 rounded flex items-center justify-center"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <img
                      src={previewAdminLogo}
                      alt="Admin logo preview"
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML +=
                          '<span class="text-red-500 text-xs">✗</span>';
                      }}
                    />
                  </div>
                  <span className="text-white text-sm">
                    {__("Admin Bar", "admin-cleaner-speed-booster")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {__(
                    "This is how your logo will appear in the WordPress admin bar.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            )}

            {!previewAdminLogo && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {__(
                    "No logo uploaded yet. Upload or enter a URL to see preview.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            )}
          </div>
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
                "Remove WordPress version from admin footer and meta tags for security.",
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

      {/* Testing Instructions */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">
          📝 {__("Testing Instructions", "admin-cleaner-speed-booster")}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
          <li>
            {__(
              "After saving settings, refresh the page to see admin bar logo changes",
              "admin-cleaner-speed-booster"
            )}
          </li>
          <li>
            {__(
              "To see login logo changes, log out and visit the login page",
              "admin-cleaner-speed-booster"
            )}
          </li>
          <li>
            {__(
              "Use square images (20x20px - 50x50px) for best admin bar logo results",
              "admin-cleaner-speed-booster"
            )}
          </li>
          <li>
            {__(
              "Use rectangular images (320x100px recommended) for login page logo",
              "admin-cleaner-speed-booster"
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WhiteLabel;
