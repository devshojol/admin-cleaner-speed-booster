import apiFetch from "@wordpress/api-fetch";

const API_NAMESPACE = "acsb/v1";

export const getSettings = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/settings`,
    method: "GET",
  });
};

export const updateSettings = async (settings) => {
  return apiFetch({
    path: `${API_NAMESPACE}/settings`,
    method: "POST",
    data: { settings },
  });
};

export const resetSettings = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/settings/reset`,
    method: "POST",
  });
};

export const exportSettings = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/settings/export`,
    method: "GET",
  });
};

export const importSettings = async (data) => {
  return apiFetch({
    path: `${API_NAMESPACE}/settings/import`,
    method: "POST",
    data: { data },
  });
};

export const getDashboardWidgets = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/dashboard-widgets`,
    method: "GET",
  });
};

export const getMenuItems = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/menu-items`,
    method: "GET",
  });
};

export const getScripts = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/scripts`,
    method: "GET",
  });
};

export const getStyles = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/styles`,
    method: "GET",
  });
};

export const getAnalytics = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/analytics`,
    method: "GET",
  });
};

export const resetAnalytics = async () => {
  return apiFetch({
    path: `${API_NAMESPACE}/analytics/reset`,
    method: "POST",
  });
};
