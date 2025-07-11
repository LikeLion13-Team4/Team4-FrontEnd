// scripts/reset.js
window.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const codeInput = document.getElementById("temp-password");
  const sendCodeBtn = document.querySelector(".full-button");
  const getTempPwBtn = document.querySelector(".login-button");

  // ✅ 1. 인증코드 이메일 전송 (토큰 없이)
  sendCodeBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) return alert("이메일을 입력해주세요.");

    try {
      const res = await fetch(
        "http://3.39.89.75:8080/api/v1/auths/emailVerifications/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            email,
            type: "TEMP_PASSWORD",
          }),
        }
      );

      const data = await res.json();
      if (data.isSuccess) {
        alert("6자리 인증 코드가 이메일로 전송되었습니다.");
      } else {
        alert("인증 코드 전송 실패: " + data.message);
      }
    } catch (err) {
      console.error("인증 코드 전송 오류:", err);
      alert("서버 오류로 인증 코드 전송에 실패했습니다.");
    }
  });

  // ✅ 2. 인증 코드로 임시 비밀번호 요청 (AccessAPI 사용)
  getTempPwBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const authCode = codeInput.value.trim();

    if (!email || !authCode) {
      return alert("이메일과 인증 코드를 모두 입력해주세요.");
    }

    try {
      const res = await fetch(
        "http://3.39.89.75:8080/api/v1/auths/reset-temp-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            email,
            authCode,
          }),
        }
      );

      const data = await res.json();
      if (data.isSuccess) {
        alert(
          "임시 비밀번호가 이메일로 전송되었습니다. 로그인 후 꼭 변경해주세요."
        );
        window.location.href = "login.html";
      } else {
        alert("임시 비밀번호 발급 실패: " + data.message);
      }
    } catch (err) {
      console.error("임시 비밀번호 발급 오류:", err);
      alert("서버 오류로 임시 비밀번호 요청에 실패했습니다.");
    }
  });
});
