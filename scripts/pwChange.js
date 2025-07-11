document.addEventListener("DOMContentLoaded", () => {
  const sendCodeBtn = document.getElementById("profile-email-certify-btn");
  const emailInput = document.getElementById("profile-email");

  sendCodeBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      alert("이메일을 입력해주세요.");
      emailInput.focus();
      return;
    }

    try {
      const payload = {
        email,
        type: "CHANGE_PASSWORD", // SIGNUP, CHANGE_PASSWORD, or TEMP_PASSWORD
      };

      const res = await AccessAPI.apiFetch(
        "/api/v1/auths/emailVerifications/send",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res.isSuccess) {
        console.error("인증 코드 전송 실패:", res);
        alert(`전송 실패: ${res.message}`);
        return;
      }

      alert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
    } catch (err) {
      console.error("인증 코드 전송 중 오류:", err);
      alert("인증 코드 전송 중 오류가 발생했습니다.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("profile-email-chk-btn");
  const emailInput = document.getElementById("profile-email");
  const codeInput = document.getElementById("profile-email-code");

  checkBtn.addEventListener("click", async () => {
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
      const payload = {
        email,
        authCode,
        type: "CHANGE_PASSWORD", // SIGNUP, CHANGE_PASSWORD, TEMP_PASSWORD 중 하나
      };

      const res = await AccessAPI.apiFetch(
        "/api/v1/auths/emailVerifications/check",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res.isSuccess) {
        console.error("인증 코드 검증 실패:", res);
        alert(`인증 실패: ${res.message}`);
        return;
      }

      alert("이메일 인증이 완료되었습니다.");
      // 인증 완료 후 UI 처리(버튼 비활성화 등) 원하면 여기서 해주세요.
      checkBtn.disabled = true;
      codeInput.readOnly = true;
    } catch (err) {
      console.error("인증 코드 검증 중 오류:", err);
      alert("인증 검증 중 오류가 발생했습니다.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("profile-change-submit");
  const curPwInput = document.getElementById("profile-past-pw");
  const newPwInput = document.getElementById("prfile-new-pw");
  const codeInput = document.getElementById("profile-email-code");

  submitBtn.addEventListener("click", async (e) => {
    console.log("비밀번호 변경 클릭!");

    e.preventDefault(); // form 제출 방지

    const currentPassword = curPwInput.value.trim();
    const newPassword = newPwInput.value.trim();
    const authCode = codeInput.value.trim();

    // 간단한 유효성 검사
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
    if (!authCode) {
      alert("인증 코드를 입력해주세요.");
      codeInput.focus();
      return;
    }

    try {
      const payload = { currentPassword, newPassword, authCode };

      const res = await AccessAPI.apiFetch("/api/v1/auths/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.isSuccess) {
        console.error("비밀번호 변경 실패:", res);
        alert(`변경 실패: ${res.message}`);
        return;
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      // 필요하다면 이후 로그아웃 처리나 화면 전환을 여기서 수행
    } catch (err) {
      console.error("비밀번호 변경 중 오류:", err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  });
});

console.log("pwChange.js loaded");
