const savedContent = document.querySelector(".saved-content");
const savedTpl = document.getElementById("card-template");
const pagePrevBtn = document.querySelector(".saved-mode .page-prev");
const pageNextBtn = document.querySelector(".saved-mode .page-next");

const savedData = Array.from({ length: 22 }, (_, i) => ({
  title: `저장된 카드 ${i + 1}`,
  body: `저장된 카드 본문입니다 (${i + 1})`,
  tags: [`#저장${i + 1}`, "#추천"],
  images: [],
}));

let savedCurrentPage = 1;
const savedPerPage = 10;

function renderSaved(items, page = 1) {
  savedContent.innerHTML = "";
  const startIdx = (page - 1) * savedPerPage;
  const endIdx = startIdx + savedPerPage;
  const viewItems = items.slice(startIdx, endIdx);

  viewItems.forEach((item) => {
    const clone = savedTpl.content.cloneNode(true);
    clone.querySelector(".card-title").textContent = item.title;
    clone.querySelector(".card-body").textContent = item.body;
    // 태그
    const tagWrap = clone.querySelector(".card-tags");
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagWrap.append(span);
    });
    // 이미지
    const imgWrap = clone.querySelector(".card-images");
    item.images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = item.title;
      imgWrap.append(img);
    });
    // +N
    const thumb = clone.querySelector(".thumbnail");
    if (item.images.length > 3) {
      thumb.textContent = `+${item.images.length - 3}`;
    }
    savedContent.append(clone);
  });

  // 페이지네이션 버튼 처리
  pagePrevBtn.style.display = page > 1 ? "" : "none";
  pageNextBtn.style.display = endIdx < items.length ? "" : "none";
}
