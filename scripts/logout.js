document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-link");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const res = await AccessAPI.apiFetch("/api/v1/auths/logout", {
          method: "POST",
        });

        // 로그아웃 성공 또는 이미 로그아웃된 상태
        if (res.isSuccess) {
          AccessAPI.clearToken();
          window.location.href = "../pages/login.html";
        } else {
          alert("로그아웃 실패: " + res.message);
        }
      } catch (err) {
        console.error("로그아웃 요청 실패:", err);
        AccessAPI.clearToken(); // 혹시 모를 경우 대비 토큰 정리
        window.location.href = "../pages/login.html";
      }
    });
  }
});
