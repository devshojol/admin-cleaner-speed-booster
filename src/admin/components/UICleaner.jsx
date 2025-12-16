import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  ToggleControl,
  TextControl,
  Card,
  CardBody,
  CardHeader,
  CheckboxControl,
  Spinner,
  Notice,
} from "@wordpress/components";
import { getDashboardWidgets, getMenuItems } from "../utils/api";
import RoleSelector from "./RoleSelector";

const UICleaner = ({ settings, onChange }) => {
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [widgets, menus] = await Promise.all([
        getDashboardWidgets(),
        getMenuItems(),
      ]);

      setDashboardWidgets(widgets || []);
      setMenuItems(menus || []);
    } catch (error) {
      console.error("Failed to load UI data:", error);
      setError(
        error.message ||
          __("Failed to load data", "admin-cleaner-speed-booster")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWidgetToggle = (widgetKey, checked) => {
    const current = settings?.disable_dashboard_widgets || [];
    const updated = checked
      ? [...current, widgetKey]
      : current.filter((k) => k !== widgetKey);

    onChange("disable_dashboard_widgets", updated);
  };

  const isWidgetDisabled = (widgetKey) => {
    const disabled = settings?.disable_dashboard_widgets || [];
    return disabled.includes(widgetKey);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  // Handle null settings
  if (!settings) {
    return (
      <div className="p-6">
        <Notice status="error" isDismissible={false}>
          {__(
            "Failed to load settings. Please refresh the page.",
            "admin-cleaner-speed-booster"
          )}
        </Notice>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Notice
          status="error"
          isDismissible={true}
          onRemove={() => setError(null)}
        >
          {error}
        </Notice>
      )}

      {/* Dashboard Widgets */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Dashboard Widgets", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Remove unwanted widgets from the WordPress dashboard.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          {dashboardWidgets.length === 0 ? (
            <Notice status="info" isDismissible={false}>
              {__("No dashboard widgets found.", "admin-cleaner-speed-booster")}
            </Notice>
          ) : (
            <div className="space-y-2">
              {dashboardWidgets.map((widget) => (
                <CheckboxControl
                  key={widget.key}
                  label={widget.title}
                  checked={isWidgetDisabled(widget.key)}
                  onChange={(checked) =>
                    handleWidgetToggle(widget.key, checked)
                  }
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Admin Notices */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Admin Notices", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <ToggleControl
            label={__("Hide all admin notices", "admin-cleaner-speed-booster")}
            help={__(
              "Hide update notices, plugin notices, and warnings (not recommended for all users).",
              "admin-cleaner-speed-booster"
            )}
            checked={settings?.hide_admin_notices || false}
            onChange={(value) => onChange("hide_admin_notices", value)}
          />
        </CardBody>
      </Card>

      {/* Disable Gutenberg */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Gutenberg Editor", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Disable the block editor for specific user roles.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <RoleSelector
            selectedRoles={settings?.disable_gutenberg_roles || []}
            onChange={(roles) => onChange("disable_gutenberg_roles", roles)}
            label={__(
              "Disable for these roles:",
              "admin-cleaner-speed-booster"
            )}
          />
        </CardBody>
      </Card>

      {/* Custom Footer Text */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Admin Footer Text", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <TextControl
            label={__("Custom footer text", "admin-cleaner-speed-booster")}
            help={__(
              'Replace the default "Thank you for creating with WordPress" text.',
              "admin-cleaner-speed-booster"
            )}
            value={settings?.custom_footer_text || ""}
            onChange={(value) => onChange("custom_footer_text", value)}
            placeholder={__(
              "Enter custom footer text...",
              "admin-cleaner-speed-booster"
            )}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default UICleaner;
