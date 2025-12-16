import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  ToggleControl,
  SelectControl,
  RangeControl,
  Card,
  CardBody,
  CardHeader,
  CheckboxControl,
  Spinner,
  Notice,
} from "@wordpress/components";
import { getScripts, getStyles } from "../utils/api";

const Performance = ({ settings, onChange }) => {
  const [scripts, setScripts] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setError(null);
      const [scriptList, styleList] = await Promise.all([
        getScripts(),
        getStyles(),
      ]);

      setScripts(scriptList || []);
      setStyles(styleList || []);
    } catch (error) {
      console.error("Failed to load assets:", error);
      setError(
        error.message ||
          __("Failed to load assets", "admin-cleaner-speed-booster")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScriptToggle = (handle, checked) => {
    const current = settings?.unload_scripts || [];
    const updated = checked
      ? [...current, handle]
      : current.filter((h) => h !== handle);

    onChange("unload_scripts", updated);
  };

  const handleStyleToggle = (handle, checked) => {
    const current = settings?.unload_styles || [];
    const updated = checked
      ? [...current, handle]
      : current.filter((h) => h !== handle);

    onChange("unload_styles", updated);
  };

  const isScriptUnloaded = (handle) => {
    const unloaded = settings?.unload_scripts || [];
    return unloaded.includes(handle);
  };

  const isStyleUnloaded = (handle) => {
    const unloaded = settings?.unload_styles || [];
    return unloaded.includes(handle);
  };

  // Format source URL safely
  const formatSource = (src) => {
    if (!src) return "";
    if (typeof src !== "string") return "";

    try {
      // Truncate long URLs
      if (src.length > 60) {
        return src.substring(0, 60) + "...";
      }
      return src;
    } catch (e) {
      return "";
    }
  };

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
      <Notice status="warning" isDismissible={false}>
        {__(
          "Be careful when disabling scripts and styles. Disabling the wrong ones can break your admin panel.",
          "admin-cleaner-speed-booster"
        )}
      </Notice>

      {error && (
        <Notice
          status="error"
          isDismissible={true}
          onRemove={() => setError(null)}
        >
          {error}
        </Notice>
      )}

      {/* Emojis */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Emojis", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <ToggleControl
            label={__("Disable emojis in admin", "admin-cleaner-speed-booster")}
            help={__(
              "Remove emoji detection scripts and styles from admin pages.",
              "admin-cleaner-speed-booster"
            )}
            checked={settings?.disable_emojis_admin || false}
            onChange={(value) => onChange("disable_emojis_admin", value)}
          />
        </CardBody>
      </Card>

      {/* Embeds */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Embeds", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <ToggleControl
            label={__("Disable embeds in admin", "admin-cleaner-speed-booster")}
            help={__(
              "Remove oEmbed scripts from admin pages.",
              "admin-cleaner-speed-booster"
            )}
            checked={settings?.disable_embeds_admin || false}
            onChange={(value) => onChange("disable_embeds_admin", value)}
          />
        </CardBody>
      </Card>

      {/* Heartbeat API */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Heartbeat API", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <SelectControl
            label={__("Heartbeat control", "admin-cleaner-speed-booster")}
            help={__(
              "The Heartbeat API keeps connections alive but can use server resources.",
              "admin-cleaner-speed-booster"
            )}
            value={settings?.disable_heartbeat || "default"}
            onChange={(value) => onChange("disable_heartbeat", value)}
            options={[
              {
                label: __("Default", "admin-cleaner-speed-booster"),
                value: "default",
              },
              {
                label: __("Modify frequency", "admin-cleaner-speed-booster"),
                value: "modify",
              },
              {
                label: __("Disable completely", "admin-cleaner-speed-booster"),
                value: "disable",
              },
            ]}
          />

          {settings?.disable_heartbeat === "modify" && (
            <RangeControl
              label={__(
                "Heartbeat frequency (seconds)",
                "admin-cleaner-speed-booster"
              )}
              value={settings?.heartbeat_frequency || 60}
              onChange={(value) => onChange("heartbeat_frequency", value)}
              min={15}
              max={120}
              step={5}
            />
          )}
        </CardBody>
      </Card>

      {/* Scripts */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Unload Scripts", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Advanced: Selectively disable scripts in the admin panel.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          {loading ? (
            <Spinner />
          ) : scripts.length === 0 ? (
            <Notice status="info" isDismissible={false}>
              {__("No scripts found.", "admin-cleaner-speed-booster")}
            </Notice>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scripts.map((script) => {
                const srcText = formatSource(script.src);
                return (
                  <CheckboxControl
                    key={script.handle}
                    label={`${script.handle}${srcText ? ` (${srcText})` : ""}`}
                    checked={isScriptUnloaded(script.handle)}
                    onChange={(checked) =>
                      handleScriptToggle(script.handle, checked)
                    }
                  />
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Styles */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Unload Styles", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            {__(
              "Advanced: Selectively disable stylesheets in the admin panel.",
              "admin-cleaner-speed-booster"
            )}
          </p>

          {loading ? (
            <Spinner />
          ) : styles.length === 0 ? (
            <Notice status="info" isDismissible={false}>
              {__("No styles found.", "admin-cleaner-speed-booster")}
            </Notice>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {styles.map((style) => {
                const srcText = formatSource(style.src);
                return (
                  <CheckboxControl
                    key={style.handle}
                    label={`${style.handle}${srcText ? ` (${srcText})` : ""}`}
                    checked={isStyleUnloaded(style.handle)}
                    onChange={(checked) =>
                      handleStyleToggle(style.handle, checked)
                    }
                  />
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Performance;
