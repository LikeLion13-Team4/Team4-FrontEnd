// scripts/pwChange.js

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    // DOM 요소 조회
    const isTemp = sessionStorage.getItem("isTemp");
    const sendCodeBtn = document.getElementById("profile-email-certify-btn");
    const emailInput = document.getElementById("profile-email");
    const checkBtn = document.getElementById("profile-email-chk-btn");
    const codeInput = document.getElementById("profile-email-code");
    const submitBtn = document.getElementById("profile-change-submit");
    const curPwInput = document.getElementById("profile-past-pw");
    const newPwInput = document.getElementById("prfile-new-pw");
    const logoutBtn = document.querySelector(".logout-link");

    // 1) 인증 코드 전송
    sendCodeBtn?.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      if (!email) {
        alert("이메일을 입력해주세요.");
        emailInput.focus();
        return;
      }
      try {
        const res = await AccessAPI.apiFetch(
          "/api/v1/auths/emailVerifications/send",
          {
            method: "POST",
            body: JSON.stringify({ email, type: "CHANGE_PASSWORD" }),
          }
        );
        if (!res.isSuccess) throw new Error(res.message);
        alert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
      } catch (err) {
        console.error("인증 코드 전송 실패:", err);
        alert(`전송 실패: ${err.message}`);
      }
    });

    // 2) 인증 코드 검증
    checkBtn?.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const authCode = codeInput.value.trim();
      if (!email) {
        alert("이메일을 입력해주세요.");
        emailInput.focus();
        return;
      }
      if (!authCode) {
        alert("인증 코드를 입력해주세요.");
        codeInput.focus();
        return;
      }
      try {
        const res = await AccessAPI.apiFetch(
          "/api/v1/auths/emailVerifications/check",
          {
            method: "POST",
            body: JSON.stringify({ email, authCode, type: "CHANGE_PASSWORD" }),
          }
        );
        if (!res.isSuccess) throw new Error(res.message);
        alert("이메일 인증이 완료되었습니다.");
        checkBtn.disabled = true;
        codeInput.readOnly = true;
      } catch (err) {
        console.error("인증 코드 검증 실패:", err);
        alert(`인증 실패: ${err.message}`);
      }
    });

    // 3) 비밀번호 변경
    submitBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      // 실시간 isTemp 재조회
      const currentIsTemp = sessionStorage.getItem("isTemp");
      const currentPassword = curPwInput.value.trim();
      const newPassword = newPwInput.value.trim();
      const authCodeVal = codeInput.value.trim();

      if (!currentPassword) {
        alert("기존 비밀번호를 입력해주세요.");
        curPwInput.focus();
        return;
      }
      if (!newPassword) {
        alert("새 비밀번호를 입력해주세요.");
        newPwInput.focus();
        return;
      }
      if (!authCodeVal) {
        alert("인증 코드를 입력해주세요.");
        codeInput.focus();
        return;
      }

      try {
        // Reset password
        const res = await AccessAPI.apiFetch("/api/v1/auths/reset-password", {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            authCode: authCodeVal,
          }),
        });
        if (!res.isSuccess) throw new Error(res.message);
        alert("비밀번호가 성공적으로 변경되었습니다.");

        // 임시 비밀번호 사용자면 자동 로그아웃
        if (currentIsTemp === "IS_TEMP_PASSWORD") {
          try {
            await AccessAPI.apiFetch("/api/v1/auths/logout", {
              method: "POST",
            });
          } catch {}
          AccessAPI.clearToken();
          alert("임시 비밀번호 상태입니다. 다시 로그인 해주세요.");
          return (window.location.href = "login.html");
        }
      } catch (err) {
        console.error("비밀번호 변경 실패:", err);
        alert(`변경 실패: ${err.message}`);
      }
    });

    // 4) 로그아웃 (비밀번호 변경 연계 없이)
    logoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentIsTemp = sessionStorage.getItem("isTemp");
      if (currentIsTemp === "IS_TEMP_PASSWORD") {
        try {
          await AccessAPI.apiFetch("/api/v1/auths/logout", { method: "POST" });
        } catch {}
        AccessAPI.clearToken();
        alert("임시 비밀번호 상태입니다. 다시 로그인 해주세요.");
        return (window.location.href = "login.html");
      }
      try {
        await AccessAPI.apiFetch("/api/v1/auths/logout", { method: "POST" });
      } catch {}
      AccessAPI.clearToken();
      window.location.href = "login.html";
    });

    console.log("pwChange.js loaded");
    ("pwChange.js loaded");
  });
})();
