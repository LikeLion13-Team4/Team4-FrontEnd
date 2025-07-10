// — 기존 saved 렌더링 코드 생략 —

// 섹션 참조
const savedSection = document.querySelector(".info-card.saved-mode");
const detailSection = document.querySelector(".info-card.detail-mode");

// 뒤로가기 버튼
const backBtn = detailSection.querySelector(".back-btn");

// 상세 보기 채우는 함수
function fillDetail(item) {
  // 제목/본문
  detailSection.querySelector(".detail-title").textContent = item.title;
  detailSection.querySelector(".detail-body").textContent = item.body;

  // 태그
  const tagWrap = detailSection.querySelector(".header-info .tags");
  tagWrap.innerHTML = "";
  item.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    tagWrap.append(span);
  });

  // 이미지
  const imgWrap = detailSection.querySelector(".image-thumbs");
  imgWrap.innerHTML = "";
  item.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = item.title;
    imgWrap.append(img);
  });
}

// 리스트 클릭 → 상세 보기 열기
savedSection.querySelector(".saved-content").addEventListener("click", (e) => {
  const card = e.target.closest(".item-card");
  if (!card) return;

  // 클릭한 카드가 몇 번째인지 찾고, 그 인덱스의 데이터를 꺼냄
  const cards = Array.from(savedSection.querySelectorAll(".item-card"));
  const idx = cards.indexOf(card);
  const item = savedData[idx];

  // 상세 데이터 채우기
  fillDetail(item);

  // 화면 토글: 리스트 숨기고 상세 보기 보이기
  savedSection.classList.add("hidden");
  detailSection.classList.remove("hidden");
});

// 뒤로가기 클릭 → 리스트로 복귀
backBtn.addEventListener("click", () => {
  detailSection.classList.add("hidden");
  savedSection.classList.remove("hidden");
});
