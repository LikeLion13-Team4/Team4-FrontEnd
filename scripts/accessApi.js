// scripts/accessApi.js
(function (global) {
  const STORAGE_KEY = "accessToken";

  function getToken() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setToken(token) {
    localStorage.setItem(STORAGE_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * @param {string} path  API 경로 (예: '/api/v1/auths/login')
   * @param {object} options fetch 옵션 (method, body 등)
   * @returns {Promise<object>} JSON 응답
   */
  async function apiFetch(path, options = {}) {
    const baseUrl = "https://hyunseok.store/swagger-ui/index.html#/";
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(baseUrl + path, {
      ...options,
      headers,
    });

    // 401 Unauthorized 처리
    if (res.status === 401) {
      clearToken();
      window.location.href = "../index.html";
      throw new Error("Unauthorized");
    }

    return res.json();
  }

  // 전역 네임스페이스로 노출
  global.AccessAPI = {
    getToken,
    setToken,
    clearToken,
    apiFetch,
  };
})(window);
