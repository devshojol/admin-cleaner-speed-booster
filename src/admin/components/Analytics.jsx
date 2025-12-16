import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  ToggleControl,
  Button,
} from "@wordpress/components";
import { getAnalytics, resetAnalytics } from "../utils/api";

const Analytics = ({ settings, onChange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (settings?.enable_analytics) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [settings?.enable_analytics]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analytics = await getAnalytics();
      setData(analytics);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        __(
          "Are you sure you want to reset all analytics data?",
          "admin-cleaner-speed-booster"
        )
      )
    ) {
      return;
    }

    try {
      setResetting(true);
      await resetAnalytics();
      await loadAnalytics();
    } catch (error) {
      console.error("Failed to reset analytics:", error);
    } finally {
      setResetting(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          📊 {__("Admin Analytics Dashboard", "admin-cleaner-speed-booster")}
        </h3>
        <p className="text-sm text-purple-800">
          {__(
            "Track admin page visits and resource usage. All data is stored locally.",
            "admin-cleaner-speed-booster"
          )}
        </p>
      </div>

      {/* Enable Analytics */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {__("Analytics Settings", "admin-cleaner-speed-booster")}
          </h2>
        </CardHeader>
        <CardBody>
          <ToggleControl
            label={__(
              "Enable analytics tracking",
              "admin-cleaner-speed-booster"
            )}
            help={__(
              "Track admin page visits and performance metrics. Data is stored locally in your database.",
              "admin-cleaner-speed-booster"
            )}
            checked={settings?.enable_analytics || false}
            onChange={(value) => onChange("enable_analytics", value)}
          />

          {settings?.enable_analytics && (
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={handleReset}
                isBusy={resetting}
              >
                {__("Reset Analytics Data", "admin-cleaner-speed-booster")}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {settings?.enable_analytics && (
        <>
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : data ? (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardBody>
                    <div className="text-4xl font-bold text-blue-600">
                      {data.totalScripts}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {__(
                        "Total Scripts Loaded",
                        "admin-cleaner-speed-booster"
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card className="text-center">
                  <CardBody>
                    <div className="text-4xl font-bold text-green-600">
                      {data.totalStyles}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {__("Total Styles Loaded", "admin-cleaner-speed-booster")}
                    </div>
                  </CardBody>
                </Card>

                <Card className="text-center">
                  <CardBody>
                    <div className="text-4xl font-bold text-purple-600">
                      {data.topPages?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {__("Pages Tracked", "admin-cleaner-speed-booster")}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {__(
                        "Most Visited Admin Pages",
                        "admin-cleaner-speed-booster"
                      )}
                    </h2>
                    {data.lastUpdated && (
                      <span className="text-sm text-gray-500">
                        {__("Last updated:", "admin-cleaner-speed-booster")}{" "}
                        {new Date(data.lastUpdated * 1000).toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  {data.topPages && data.topPages.length > 0 ? (
                    <div className="space-y-3">
                      {data.topPages.map((page, index) => (
                        <div
                          key={page.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{page.name}</div>
                              <div className="text-sm text-gray-500">
                                {page.id}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {page.visits}
                            </div>
                            <div className="text-xs text-gray-500">
                              {__("visits", "admin-cleaner-speed-booster")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>
                        {__(
                          "No data yet. Visit some admin pages to see analytics!",
                          "admin-cleaner-speed-booster"
                        )}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡{" "}
                  {__(
                    "Tip: Analytics data helps you understand which admin pages you use most. Use this insight to optimize your workflow!",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </div>
            </>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-500">
                  {__(
                    "Failed to load analytics data.",
                    "admin-cleaner-speed-booster"
                  )}
                </p>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {!settings?.enable_analytics && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                {__("Analytics Not Enabled", "admin-cleaner-speed-booster")}
              </h3>
              <p className="text-gray-600">
                {__(
                  "Enable analytics tracking above to start collecting data about your admin usage.",
                  "admin-cleaner-speed-booster"
                )}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
