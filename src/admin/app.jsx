import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Spinner, Notice, Button, TabPanel } from "@wordpress/components";
import UICleaner from "./components/UICleaner";
import Performance from "./components/Performance";
import Analytics from "./components/Analytics";
import { getSettings, updateSettings, resetSettings } from "./utils/api";

const App = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      setNotice({
        type: "error",
        message: __("Failed to load settings.", "admin-cleaner-speed-booster"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateSettings(settings);

      setNotice({
        type: "success",
        message:
          response.message ||
          __("Settings saved!", "admin-cleaner-speed-booster"),
      });

      setHasChanges(false);

      // Auto-hide success notice
      setTimeout(() => setNotice(null), 3000);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error.message ||
          __("Failed to save settings.", "admin-cleaner-speed-booster"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        __(
          "Are you sure you want to reset all settings to defaults?",
          "admin-cleaner-speed-booster"
        )
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      const response = await resetSettings();

      setSettings(response.settings);
      setHasChanges(false);

      setNotice({
        type: "success",
        message: __(
          "Settings reset to defaults.",
          "admin-cleaner-speed-booster"
        ),
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: __("Failed to reset settings.", "admin-cleaner-speed-booster"),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const tabs = [
    {
      name: "ui-cleaner",
      title: __("UI Cleaner", "admin-cleaner-speed-booster"),
      className: "tab-ui-cleaner",
    },
    {
      name: "performance",
      title: __("Performance", "admin-cleaner-speed-booster"),
      className: "tab-performance",
    },
  ];

  // Add analytics tab if Pro
  if (window.acsbData?.isPro) {
    tabs.push({
      name: "analytics",
      title: __("Analytics", "admin-cleaner-speed-booster") + " (Pro)",
      className: "tab-analytics",
    });
  }
  
  return (
    <div className="wrap acsb-admin">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {__("Admin Cleaner & Speed Booster", "admin-cleaner-speed-booster")}
          </h1>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleReset} disabled={saving}>
              {__("Reset to Defaults", "admin-cleaner-speed-booster")}
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges}
              isBusy={saving}
            >
              {__("Save Changes", "admin-cleaner-speed-booster")}
            </Button>
          </div>
        </div>

        {notice && (
          <Notice
            status={notice.type}
            onRemove={() => setNotice(null)}
            className="mb-6"
          >
            {notice.message}
          </Notice>
        )}

        <div className="bg-white shadow-sm rounded-lg">
          <TabPanel className="acsb-tabs" activeClass="is-active" tabs={tabs}>
            {(tab) => {
              if (tab.name === "ui-cleaner") {
                return (
                  <UICleaner settings={settings} onChange={handleChange} />
                );
              }

              if (tab.name === "performance") {
                return (
                  <Performance settings={settings} onChange={handleChange} />
                );
              }

              if (tab.name === "analytics") {
                return <Analytics />;
              }

              return null;
            }}
          </TabPanel>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            {__(
              "Note: All optimizations apply to the admin panel only. Your frontend site is not affected.",
              "admin-cleaner-speed-booster"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
