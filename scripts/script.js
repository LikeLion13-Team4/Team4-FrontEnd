document.addEventListener("DOMContentLoaded", () => {
  const cols = document.querySelectorAll(".mp-col");
  let activeCol = null;

  // 1) 초기 + 버튼 생성
  cols.forEach((col) => {
    const plus = document.createElement("div");
    plus.className = "slot empty";
    plus.textContent = "+";
    col.appendChild(plus);
  });

  // 2) 모달 요소들
  const modal = document.getElementById("modal");
  const foodInput = document.getElementById("foodInput");
  const noteInput = document.getElementById("noteInput");
  const cancelBtn = modal.querySelector(".cancel");
  const addBtn = modal.querySelector(".add");

  // 3) + 버튼 클릭 → 모달 열기
  document.body.addEventListener("click", (e) => {
    const slot = e.target.closest(".slot.empty");
    if (!slot) return;
    activeCol = slot.closest(".mp-col");
    openModal();
  });

  // 4) 모달 닫기
  cancelBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // 5) 추가 버튼 → 아이템 삽입
  addBtn.onclick = () => {
    const food = foodInput.value.trim();
    if (!food) {
      foodInput.focus();
      return;
    }

    // 아이템 슬롯 만들기
    const item = document.createElement("div");
    item.className = "slot item";
    item.innerHTML = `
      <div class="food">${food}</div>
      ${
        noteInput.value.trim()
          ? `<div class="note">${noteInput.value.trim()}</div>`
          : ""
      }
    `;

    // 빈(+) 앞에 삽입하고 모달 닫기
    const plus = activeCol.querySelector(".slot.empty");
    activeCol.insertBefore(item, plus);
    closeModal();
  };

  function openModal() {
    modal.style.display = "flex";
    foodInput.value = noteInput.value = "";
    foodInput.focus();
  }
  function closeModal() {
    modal.style.display = "none";
  }
});
