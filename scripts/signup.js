// 생년월일 select 박스 채우기
function populateBirthSelects() {
  const yearSelect = document.getElementById("year");
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  // 연도 옵션
  for (let y = currentYear; y >= 1920; y--) {
    yearSelect.add(new Option(y, y));
  }
  // 월 옵션
  for (let m = 1; m <= 12; m++) {
    const val = String(m).padStart(2, "0");
    monthSelect.add(new Option(val, val));
  }

  function updateDays() {
    const y = parseInt(yearSelect.value);
    const m = parseInt(monthSelect.value);
    if (!y || !m) return;

    const daysInMonth = new Date(y, m, 0).getDate();
    daySelect.options.length = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const val = String(d).padStart(2, "0");
      daySelect.add(new Option(val, val));
    }
    if (currentDate <= daysInMonth) {
      daySelect.value = String(currentDate).padStart(2, "0");
    }
  }

  yearSelect.addEventListener("change", updateDays);
  monthSelect.addEventListener("change", updateDays);

  // 초기값 설정
  yearSelect.value = currentYear;
  monthSelect.value = String(currentMonth).padStart(2, "0");
  updateDays();
}

// 첫/두 번째 화면 전환
function showSecondScreen() {
  document
    .querySelectorAll(".first-panel")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".second-panel")
    .forEach((el) => el.classList.remove("hidden"));
}

// 인증 코드 전송
function sendVerificationCode() {
  const email = document.querySelector("input[type='email']").value.trim();
  if (!email) return alert("이메일을 입력해주세요.");

  const payload = { email, type: "SIGNUP" };
  console.log("[SEND] Payload:", payload);

  fetch("http://3.39.89.75:8080/api/v1/auths/emailVerifications/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("[SEND] Response:", data);
      if (data.isSuccess) alert("인증 코드가 전송되었습니다.");
      else alert("전송 실패: " + data.message);
    })
    .catch((err) => {
      console.error("[SEND] Error:", err);
      alert("서버 오류로 전송 실패");
    });
}

// 인증 코드 확인 (UI 표시용)
function verifyCodeUI() {
  const code = document.getElementById("code-input").value.trim();
  const input = document.getElementById("code-input");
  const status = document.getElementById("code-status");
  input.classList.remove("success", "error");
  status.classList.remove("success", "error");

  if (/^\d{6}$/.test(code)) {
    input.classList.add("success");
    status.classList.add("success");
    status.textContent = "형식 정상";
  } else {
    input.classList.add("error");
    status.classList.add("error");
    status.textContent = "6자리 숫자를 입력하세요";
  }
}

// 글로벌 alias로 inline onclick 호환
window.verifyCode = verifyCodeUI;

// 회원가입
function signUp() {
  const name = document
    .querySelector(".signup-form input[type='text']")
    .value.trim();
  const email = document.querySelector("input[type='email']").value.trim();
  const password = document
    .querySelector(".signup-form input[type='password']")
    .value.trim();
  const code = document.getElementById("code-input").value.trim();
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;
  const birthday = `${year}-${month}-${day}`;
  const genderEl = document.querySelector("input[name='gender']:checked");
  const gender = genderEl ? genderEl.id.toUpperCase() : null;
  const height = Number(document.getElementById("height").value.trim());
  const weight = Number(document.getElementById("weight").value.trim());

  if (!email || !password || !name || !code || !gender || !height || !weight) {
    return alert("모든 정보를 입력해주세요.");
  }

  const payload = {
    email,
    password,
    birthday,
    nickname: name,
    gender,
    height,
    weight,
    authCode: code,
  };
  console.log("[SIGNUP] Payload:", payload);

  fetch("http://3.39.89.75:8080/api/v1/auths/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log("[SIGNUP] HTTP Status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("[SIGNUP] Response:", data);
      if (data.isSuccess) alert("회원가입 성공!");
      else alert("회원가입 실패: " + data.message);
    })
    .catch((err) => {
      console.error("[SIGNUP] Error:", err);
      alert("회원가입 요청 중 오류 발생");
    });
}

// 이벤트 바인딩
window.addEventListener("DOMContentLoaded", () => {
  populateBirthSelects();
  document
    .querySelector(".next-button")
    .addEventListener("click", showSecondScreen);

  // 인증코드 받기 버튼
  const sendBtn = document.querySelector("button.inline-button");
  sendBtn.addEventListener("click", sendVerificationCode);

  // 회원가입 버튼
  document.querySelector(".login-button").addEventListener("click", signUp);
});
