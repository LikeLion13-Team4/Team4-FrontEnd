// ------------------------------
// 내가 쓴 댓글 렌더링 + 클릭 핸들러
// ------------------------------
const commentsContent = document.querySelector(".my-comments-content");
const commentsTpl = document.getElementById("comment-card-template");
const pagePrevCommentsBtn = document.querySelector(".page-prev-comments");
const pageNextCommentsBtn = document.querySelector(".page-next-comments");

let commentsCurrentPage = 1;
const commentsPerPage = 10;

// 팝업 요소 (기존에 선언된 것 재활용)
const postDetailOverlay = document.getElementById("post-detail-popup-overlay");
const detailTags = document.getElementById("detail-tags");
const detailTitle = document.getElementById("detail-title");
const detailBody = document.getElementById("detail-body");
const detailImages = document.getElementById("detail-images");
const detailLike = document.getElementById("detail-like");
const detailComment = document.getElementById("detail-comment");
const detailSave = document.getElementById("detail-save");
const detailCommentsList = document.getElementById("detail-comments-list");

// 더미 댓글 데이터 (실제 API/데이터로 교체)
const commentsData = Array.from({ length: 15 }, (_, i) => ({
  title: `댓글 대상 게시글 ${i + 1}`,
  body: `내가 쓴 댓글 내용 ${i + 1}`,
  tags: [`#댓글${i + 1}`, "#소통"],
  images: [], // 이미지가 있으면 URL 배열로
}));

function renderMyComments(items, page = 1) {
  commentsContent.innerHTML = "";
  const startIdx = (page - 1) * commentsPerPage;
  const endIdx = startIdx + commentsPerPage;
  const viewItems = items.slice(startIdx, endIdx);

  viewItems.forEach((item) => {
    const clone = commentsTpl.content.cloneNode(true);
    // 카드 텍스트
    clone.querySelector(".card-title").textContent = item.title;
    clone.querySelector(".card-body").textContent = item.body;
    // 태그
    const tagWrap = clone.querySelector(".card-tags");
    tagWrap.innerHTML = "";
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagWrap.append(span);
    });
    // 썸네일 카운트
    const thumb = clone.querySelector(".thumbnail");
    thumb.textContent = item.images.length > 0 ? `+${item.images.length}` : "";

    // 클릭 핸들러
    const cardEl = clone.querySelector(".item-card");
    cardEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("checkbox")) return;

      // 팝업에 데이터 주입
      detailTags.innerHTML = "";
      item.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        detailTags.appendChild(span);
      });
      detailTitle.textContent = item.title;
      detailBody.textContent = item.body;
      detailImages.innerHTML = "";
      item.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        detailImages.appendChild(img);
      });
      // 댓글 카드에선 좋아요/댓글/저장 수 표시할 내용이 없다면 기본 또는 숨김 처리
      detailLike.textContent = "";
      detailComment.textContent = "";
      detailSave.textContent = "";

      // 상세 댓글 리스트 (원글 전체 댓글 로직 자리)
      detailCommentsList.innerHTML = `
        <div class="comment-item"><span class="comment-user">유저X</span><p class="comment-text">원글 댓글 예시1</p></div>
        <div class="comment-item"><span class="comment-user">유저Y</span><p class="comment-text">원글 댓글 예시2</p></div>
      `;

      // 팝업 열기
      postDetailOverlay.classList.remove("hidden");
    });

    commentsContent.append(clone);
  });

  // 페이지 버튼 처리
  pagePrevCommentsBtn.style.display = page > 1 ? "" : "none";
  pageNextCommentsBtn.style.display = endIdx < items.length ? "" : "none";
}

// 버튼 이벤트 등록
pagePrevCommentsBtn.addEventListener("click", () => {
  if (commentsCurrentPage > 1) {
    commentsCurrentPage--;
    renderMyComments(commentsData, commentsCurrentPage);
  }
});
pageNextCommentsBtn.addEventListener("click", () => {
  if (commentsCurrentPage * commentsPerPage < commentsData.length) {
    commentsCurrentPage++;
    renderMyComments(commentsData, commentsCurrentPage);
  }
});

// 초기 렌더
renderMyComments(commentsData, commentsCurrentPage);
