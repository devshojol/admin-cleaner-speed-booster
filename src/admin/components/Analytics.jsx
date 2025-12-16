import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Notice,
} from "@wordpress/components";
import { getAnalytics } from "../utils/api";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAnalytics();
  }, []);
  const loadAnalytics = async () => {
    try {
      const analytics = await getAnalytics();
      setData(analytics);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <Notice status="info" isDismissible={false}>
        {__(
          "Analytics features are available in the Pro version.",
          "admin-cleaner-speed-booster"
        )}
      </Notice>

      {data && (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {__("Page Load Statistics", "admin-cleaner-speed-booster")}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-wpblue">
                    {data.avgLoadTime}s
                  </div>
                  <div className="text-sm text-gray-600">
                    {__("Avg Load Time", "admin-cleaner-speed-booster")}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-wpblue">
                    {data.scriptsLoaded}
                  </div>
                  <div className="text-sm text-gray-600">
                    {__("Scripts Loaded", "admin-cleaner-speed-booster")}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-wpblue">
                    {data.stylesLoaded}
                  </div>
                  <div className="text-sm text-gray-600">
                    {__("Styles Loaded", "admin-cleaner-speed-booster")}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {__("Most Visited Pages", "admin-cleaner-speed-booster")}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Object.entries(data.pageLoads).map(([page, count]) => (
                  <div key={page} className="flex justify-between items-center">
                    <span className="capitalize">{page}</span>
                    <span className="font-semibold">
                      {count} {__("visits", "admin-cleaner-speed-booster")}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};
export default Analytics;
