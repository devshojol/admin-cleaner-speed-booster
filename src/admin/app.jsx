import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Spinner, Notice, Button, TabPanel } from "@wordpress/components";
import UICleaner from "./components/UICleaner";
import Performance from "./components/Performance";
import Analytics from "./components/Analytics";
import WhiteLabel from "./components/WhiteLabel";
import ImportExport from "./components/ImportExport";
import { getSettings, updateSettings, resetSettings } from "./utils/api";

const App = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

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
      title: __("UI Cleaner 🧹", "admin-cleaner-speed-booster"),
    },
    {
      name: "performance",
      title: __("Performance ⚡", "admin-cleaner-speed-booster"),
    },
    {
      name: "white-label",
      title: __("White Label 🎨", "admin-cleaner-speed-booster"),
    },
    {
      name: "analytics",
      title: __("Analytics 📊", "admin-cleaner-speed-booster"),
    },
    {
      name: "import-export",
      title: __("Import/Export 💾", "admin-cleaner-speed-booster"),
    },
  ];

  return (
    <div className="wrap acsb-admin">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {__(
                  "Admin Cleaner & Speed Booster",
                  "admin-cleaner-speed-booster"
                )}
              </h1>
              <p className="text-gray-600">
                {__(
                  "Optimize your WordPress admin panel - All features included free!",
                  "admin-cleaner-speed-booster"
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleReset}
                disabled={saving}
              >
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

          {hasChanges && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️{" "}
                {__("You have unsaved changes.", "admin-cleaner-speed-booster")}
              </p>
            </div>
          )}
        </div>

        {/* Notices */}
        {notice && (
          <Notice
            status={notice.type}
            onRemove={() => setNotice(null)}
            className="mb-6"
            isDismissible
          >
            {notice.message}
          </Notice>
        )}

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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

              if (tab.name === "white-label") {
                return (
                  <WhiteLabel settings={settings} onChange={handleChange} />
                );
              }

              if (tab.name === "analytics") {
                return (
                  <Analytics settings={settings} onChange={handleChange} />
                );
              }

              if (tab.name === "import-export") {
                return (
                  <ImportExport settings={settings} onImport={loadSettings} />
                );
              }

              return null;
            }}
          </TabPanel>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            ℹ️{" "}
            {__(
              "All optimizations apply to the admin panel only. Your frontend site is not affected.",
              "admin-cleaner-speed-booster"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
