const infoCard = document.querySelector(".info-card");
const btnEdit = infoCard.querySelector(".btn-edit");
const btnSave = infoCard.querySelector(".btn-save");
const viewMode = infoCard.querySelector(".view-mode");
const editMode = infoCard.querySelector(".edit-mode");

btnEdit.addEventListener("click", () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
});

btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  // 1) 서버에 저장하는 AJAX 호출 등 처리
  // 2) 저장 완료 시 다시 조회 모드로
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");

  // (선택) view-mode 내부 텍스트 갱신
});

const editBtn = document.querySelector(".pic-edit-btn");
const overlay = document.getElementById("modal-overlay");
const editModal = document.getElementById("edit-modal");
const closeModal = editModal.querySelector(".modal-close");
const cancelBtn = document.getElementById("cancel-btn");
const fileInput = document.getElementById("profile-file-input");
const uploadBtn = editModal.querySelector(".file-upload-btn");
const previewImage = document.getElementById("preview-image");
const deleteBtn = document.getElementById("delete-current");

// 모달 열기
function openModal() {
  overlay.classList.remove("hidden");
  editModal.classList.remove("hidden");
}

// 모달 닫기
function closeModalFn() {
  overlay.classList.add("hidden");
  editModal.classList.add("hidden");
  previewImage.src = ""; // 미리보기 리셋
}
editBtn.addEventListener("click", openModal);
overlay.addEventListener("click", closeModalFn);
closeModal.addEventListener("click", closeModalFn);
cancelBtn.addEventListener("click", closeModalFn);

// 파일 선택 트리거
uploadBtn.addEventListener("click", () => fileInput.click());

// 파일 미리보기
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => (previewImage.src = reader.result);
  reader.readAsDataURL(file);
});

// 현재 사진 삭제
deleteBtn.addEventListener("click", () => {
  previewImage.src = "";
  fileInput.value = null;
});

document.addEventListener("DOMContentLoaded", () => {
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = document.querySelector(".mode.edit-mode");
  const accountMode = document.querySelector(".mode.account-mode");

  // 뷰 → 계정 설정
  document
    .querySelector(".view-mode .right-btn")
    .addEventListener("click", () => {
      viewMode.classList.add("hidden");
      accountMode.classList.remove("hidden");
    });

  // (선택) 계정 설정 → 다시 뷰로 돌아가기
  document
    .querySelector(".account-mode .bodyInfoIcon h2")
    .addEventListener("click", () => {
      accountMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });

  // (기존) 뷰 → 프로필 수정
  document
    .querySelector(".view-mode .btn-edit")
    .addEventListener("click", () => {
      viewMode.classList.add("hidden");
      editMode.classList.remove("hidden");
    });

  // (선택) 수정 모드 → 뷰 복귀
  document
    .querySelector(".edit-mode .btn-save")
    .addEventListener("click", (e) => {
      e.preventDefault();
      editMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = document.querySelector(".mode.edit-mode");
  const accountMode = document.querySelector(".mode.account-mode");
  const backBtn = document.querySelector(".account-arrow-btn");

  backBtn.addEventListener("click", () => {
    // 조회 모드 보이기
    viewMode.classList.remove("hidden");
    // 다른 모드 숨기기
    editMode.classList.add("hidden");
    accountMode.classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewSection = document.querySelector(".account-view");
  const editSection = document.querySelector(".account-edit");
  const editBtn = viewSection.querySelector(".btn-edit");
  const backBtn = document.querySelector(".account-arrow-btn");

  // ① 조회 → 수정
  editBtn.addEventListener("click", () => {
    viewSection.classList.add("hidden");
    editSection.classList.remove("hidden");
  });

  // ② 수정 → 조회 (뒤로가기 or 저장 후)
  backBtn.addEventListener("click", () => {
    editSection.classList.add("hidden");
    viewSection.classList.remove("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.querySelector(".delete-account");
  const overlay = document.getElementById("confirm-overlay");
  const modal = document.getElementById("confirm-modal");
  const cancelBtn = document.getElementById("confirm-cancel");
  const confirmBtn = document.getElementById("confirm-delete");

  // 모달 열기
  deleteBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  });

  // 모달 닫기 (취소)
  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });

  // 실제 삭제 처리 (예시: form 제출 등)
  confirmBtn.addEventListener("click", () => {
    // TODO: 여기서 서버에 삭제 요청을 보내거나
    //       form.submit(), AJAX 호출 등을 실행하세요.

    // 일단 모달 닫기
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });

  // 오버레이 클릭해도 모달 닫히게 (선택)
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await AccessAPI.apiFetch("/api/v1/members");
    console.log("API 응답 전체:", data);

    if (data.isSuccess && data.result) {
      const { nickname, email, gender, birthday, height, weight, imageUrl } =
        data.result;

      // 🔹 프로필 카드 영역 채우기
      // 프로필 카드 영역 채우기
      document.getElementById("nick-name").textContent = nickname;
      document.getElementById("gender").textContent =
        gender === "MALE" ? "남" : "여";
      document.getElementById("height").textContent = `${height} cm`;
      document.getElementById("weight").textContent = `${weight} kg`;

      // 나이 계산
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      document.getElementById("age").textContent = `만 ${age}세`;

      // 프로필 배경 이미지 (div) 설정
      const profilePic = document.querySelector(".profile-pic");
      if (imageUrl && profilePic) {
        profilePic.style.backgroundImage = `url(${imageUrl})`;
        profilePic.style.backgroundSize = "cover";
        profilePic.style.backgroundPosition = "center";
      }

      const profilePic2 = document.querySelector(".profile-pic2");
      if (imageUrl && profilePic2) {
        profilePic2.style.backgroundImage = profilePic.style.backgroundImage;
        profilePic2.style.backgroundSize = profilePic.style.backgroundSize;
        profilePic2.style.backgroundPosition =
          profilePic.style.backgroundPosition;
      }

      // account-view 폼 초기값
      document.getElementById("account-nickname").value = nickname;
      document.getElementById("account-email").value = email;
      document.getElementById("account-password").value = "************";
    } else {
      alert("회원 정보를 불러오지 못했습니다.");
      console.error("API 실패 응답:", data);
    }
  } catch (err) {
    alert("서버와 통신 중 오류가 발생했습니다.");
    console.error("회원 정보 요청 실패:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("confirm-overlay");
  const confirmModal = document.getElementById("confirm-modal");
  const deletedModal = document.getElementById("deleted-modal");
  const cancelBtn = document.getElementById("confirm-cancel");
  const deleteBtn = document.getElementById("confirm-delete");

  // (기존) 취소
  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
  });

  // 삭제 확정
  deleteBtn.addEventListener("click", () => {
    // 1) 확인 모달 숨기기
    confirmModal.classList.add("hidden");

    // 2) 성공 모달 표시
    deletedModal.classList.remove("hidden");

    // 3) 약간의 딜레이 후 오버레이·성공 모달 모두 닫기 (예: 2초 뒤)
    setTimeout(() => {
      overlay.classList.add("hidden");
      deletedModal.classList.add("hidden");
      // (선택) 이곳에 추가 동작: 예를 들어 로그아웃, 리다이렉트 등
    }, 2000);
  });

  // 오버레이 클릭해도 모든 모달 닫기
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
    deletedModal.classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // “계정 설정” 버튼만 잡기 (클래스, 텍스트, id 등 원하는 방식)
  const accountTabBtn = document.querySelector(
    ".panel-group-detail .tab:first-child"
  );
  // .profile-mode 내의 각 모드 선택
  const viewMode = document.querySelector(".profile-mode .view-mode");
  const editMode = document.querySelector(".profile-mode .edit-mode");
  const accountMode = document.querySelector(".profile-mode .account-mode");

  accountTabBtn.addEventListener("click", function () {
    // 계정설정만 보이고 나머지는 숨김
    viewMode.classList.add("hidden");
    editMode.classList.add("hidden");
    accountMode.classList.remove("hidden");
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // AccessAPI.apiFetch 사용
    const json = await AccessAPI.apiFetch("/api/v1/members");
    const imageUrl = json.result.imageUrl;
    if (imageUrl) {
      const picDiv = document.querySelector(".profile-pic-edit");
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "프로필 사진";
      img.classList.add("profile-pic");
      // 크기나 스타일은 CSS 클래스(.profile-pic)에서 정의
      picDiv.insertBefore(img, picDiv.querySelector(".pic-edit-btn"));
    }
  } catch (err) {
    console.error("회원 정보 로드 실패:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("birth-year");
  const monthSelect = document.getElementById("birth-month");
  const daySelect = document.getElementById("birth-day");

  // 1) 연도 옵션 채우기 (예: 1900년 ~ 올해)
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = `${y}년`;
    yearSelect.appendChild(opt);
  }

  // 2) 월 옵션 채우기 (1월 ~ 12월)
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = `${m}월`;
    monthSelect.appendChild(opt);
  }

  // 3) 일(day) 옵션 채우기 위한 함수
  function updateDays() {
    const year = parseInt(yearSelect.value, 10);
    const month = parseInt(monthSelect.value, 10);
    if (!year || !month) return;

    // 해당 월의 마지막 일 계산
    const lastDay = new Date(year, month, 0).getDate();

    // 기존 day 옵션 제거
    daySelect.innerHTML = "";

    // 1일 ~ lastDay일 옵션 추가
    for (let d = 1; d <= lastDay; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = `${d}일`;
      daySelect.appendChild(opt);
    }
  }

  // 4) 초기 day 채우기 (현재 연·월 선택값이 없으므로 기본값 세팅 후 호출)
  //    기본 선택: 올해, 1월
  yearSelect.value = currentYear;
  monthSelect.value = 1;
  updateDays();

  // 5) 연도·월 변경 시 day 재생성
  yearSelect.addEventListener("change", updateDays);
  monthSelect.addEventListener("change", updateDays);
});

document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.querySelector("form.mode.edit-mode");
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = editForm;
  const btnEdit = document.querySelector(".btn-edit");
  const btnSave = editForm.querySelector("#profile-edit-btn");
  const btnCancel = editForm.querySelector(".btn-cancel"); // 편집 취소 버튼이 있다면

  // 1) 편집 버튼 클릭하면 edit-mode 보이기
  btnEdit.addEventListener("click", () => {
    viewMode.classList.add("hidden");
    editMode.classList.remove("hidden");
  });

  // 2) 편집 폼 submit 핸들러
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // (1) 폼 값 수집
    const birthday = [
      editForm.birthYear.value,
      editForm.birthMonth.value.padStart(2, "0"),
      editForm.birthDay.value.padStart(2, "0"),
    ].join("-");

    const gender = editForm.gender.value === "M" ? "MALE" : "FEMALE";
    const height = parseFloat(editForm.height.value) || 0;
    const weight = parseFloat(editForm.weight.value) || 0;

    try {
      // (2) PATCH 요청
      const res = await AccessAPI.apiFetch("/api/v1/members/account", {
        method: "PATCH",
        body: JSON.stringify({ birthday, gender, height, weight }),
      });

      if (res.isSuccess) {
        // 모달 전환
        confirmModal.classList.add("hidden");
        deletedModal.classList.remove("hidden");

        // 2초 후 닫고 리디렉션 또는 로그아웃 처리
        setTimeout(() => {
          overlay.classList.add("hidden");
          deletedModal.classList.add("hidden");
          // 👉 예: 로그아웃 처리 후 메인 페이지로 이동
          AccessAPI.clearToken();
          window.location.href = "/pages/index.html";
        }, 2000);
      } else {
        alert("계정 삭제 실패: " + res.message);

      if (!res.isSuccess) {
        throw new Error(res.message || "업데이트 실패");
      }

      // (3) 뷰 모드의 텍스트 갱신
      // gender
      const genderText = gender === "MALE" ? "남" : "여";
      document.getElementById("gender").textContent = genderText;
      // age 계산 예시 (생일로부터 만 나이 계산)
      const [y, m, d] = birthday.split("-");
      const birthDate = new Date(+y, +m - 1, +d);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      document.getElementById("age").textContent = age;
      // height, weight
      document.getElementById("height").textContent = `${height}cm`;
      document.getElementById("weight").textContent = `${weight}kg`;

      // (4) 모드 전환
      editMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
      alert("신체 정보가 업데이트되었습니다.");
    } catch (err) {
      console.error("신체 정보 수정 에러:", err);
      alert("정보 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  });

  // 3) 취소 버튼(있다면) 핸들러: 편집 모드 닫기
  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      editMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });
  }
});

  });
});
