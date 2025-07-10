// reset.js
window.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const tokenInput = document.getElementById("temp-password");
  const newPasswordInput = document.getElementById("new-password");
  const sendBtn = document.querySelector(".full-button");
  const resetBtn = document.querySelector(".login-button");

  // 1) 임시 비밀번호(Reset Token) 요청
  sendBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (!email) return alert("이메일을 입력해주세요.");

    console.log("[RESET] Requesting reset token for:", email);
    fetch("http://3.39.89.75:8080/api/v1/auths/passwords/reset-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[RESET] reset-token response:", data);
        if (data.isSuccess) {
          alert("이메일로 임시 비밀번호(토큰)가 전송되었습니다.");
        } else {
          alert("전송 실패: " + data.message);
        }
      })
      .catch((err) => {
        console.error("[RESET] reset-token error:", err);
        alert("서버 오류로 전송 실패");
      });
  });

  // 2) 임시 비밀번호 토큰 + 새 비밀번호 제출 → 비밀번호 변경
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const resetToken = tokenInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    if (!email || !resetToken || !newPassword) {
      return alert(
        "이메일, 임시 비밀번호(토큰), 새 비밀번호를 모두 입력해주세요."
      );
    }

    const payload = { email, resetToken, newPassword };
    console.log("[RESET] Payload:", payload);

    fetch("http://3.39.89.75:8080/api/v1/auths/passwords/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("[RESET] HTTP Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[RESET] reset response:", data);
        if (data.isSuccess) {
          alert("비밀번호가 변경되었습니다. 이제 로그인 페이지로 이동합니다.");
          window.location.href = "login.html"; // 로그인 페이지로 리다이렉트
        } else {
          alert("변경 실패: " + data.message);
        }
      })
      .catch((err) => {
        console.error("[RESET] reset error:", err);
        alert("비밀번호 변경 중 오류 발생");
      });
  });
});
