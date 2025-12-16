import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Notice,
} from "@wordpress/components";
import { exportSettings, importSettings } from "../utils/api";

const ImportExport = ({ settings, onImport }) => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await exportSettings();

      // Create JSON file
      const dataStr = JSON.stringify(response, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-cleaner-settings-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setNotice({
        type: "success",
        message: __(
          "Settings exported successfully!",
          "admin-cleaner-speed-booster"
        ),
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error.message ||
          __("Failed to export settings.", "admin-cleaner-speed-booster"),
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        setImporting(true);

        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.data) {
          throw new Error(
            __("Invalid settings file format.", "admin-cleaner-speed-booster")
          );
        }

        const response = await importSettings(data.data);

        setNotice({
          type: "success",
          message:
            response.message ||
            __(
              "Settings imported successfully!",
              "admin-cleaner-speed-booster"
            ),
        });

        // Reload settings
        if (onImport) {
          setTimeout(() => onImport(), 1000);
        }
      } catch (error) {
        setNotice({
          type: "error",
          message:
            error.message ||
            __("Failed to import settings.", "admin-cleaner-speed-booster"),
        });
      } finally {
        setImporting(false);
      }
    };

    input.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          💾 {__("Backup & Restore Settings", "admin-cleaner-speed-booster")}
        </h3>
        <p className="text-sm text-green-800">
          {__(
            "Export your settings to a JSON file for backup or transfer to another site.",
            "admin-cleaner-speed-booster"
          )}
        </p>
      </div>

      {notice && (
        <Notice
          status={notice.type}
          onRemove={() => setNotice(null)}
          isDismissible
        >
          {notice.message}
        </Notice>
      )}

      {/* Export */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Export Settings", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Download all your current settings as a JSON file. Use this to backup your configuration or transfer it to another site.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <Button
            variant="primary"
            onClick={handleExport}
            isBusy={exporting}
            disabled={exporting}
          >
            {exporting
              ? __("Exporting...", "admin-cleaner-speed-booster")
              : __("Export Settings", "admin-cleaner-speed-booster")}
          </Button>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              💡{" "}
              {__(
                "The exported file contains all your settings including UI customizations, performance options, and white label configurations.",
                "admin-cleaner-speed-booster"
              )}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Import */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Import Settings", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Upload a previously exported JSON file to restore your settings. This will overwrite your current settings.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          <Button
            variant="secondary"
            onClick={handleImport}
            isBusy={importing}
            disabled={importing}
          >
            {importing
              ? __("Importing...", "admin-cleaner-speed-booster")
              : __("Import Settings", "admin-cleaner-speed-booster")}
          </Button>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️{" "}
              {__(
                "Warning: Importing will replace ALL current settings. Make sure to export your current settings first if you want to keep them!",
                "admin-cleaner-speed-booster"
              )}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("How It Works", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {__("Export", "admin-cleaner-speed-booster")}
                </h4>
                <p className="text-sm text-gray-600">
                  {__(
                    'Click "Export Settings" to download a JSON file with all your current configurations.',
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {__("Save", "admin-cleaner-speed-booster")}
                </h4>
                <p className="text-sm text-gray-600">
                  {__(
                    "Store the JSON file somewhere safe, or transfer it to another WordPress installation.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {__("Import", "admin-cleaner-speed-booster")}
                </h4>
                <p className="text-sm text-gray-600">
                  {__(
                    'Click "Import Settings" and select your JSON file to restore all settings instantly.',
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default ImportExport;
