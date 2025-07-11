const postsPerPage = 10;
let currentPage = 1;
let totalPages = 1;
let currentPost = null;

// ✅ 게시글 목록 불러오기
async function loadPosts(page = 1) {
  try {
    const data = await AccessAPI.apiFetch(
      `/api/v1/posts?page=${page}&size=${postsPerPage}`
    );
    if (!data.isSuccess) {
      return alert("게시글 조회 실패: " + data.message);
    }

    const { posts: postList, currentPage: cp, totalPages: tp } = data.result;
    currentPage = cp;
    totalPages = tp;

    renderPosts(postList);
    renderPagination();
    document.getElementById("tag-title").textContent = "전체";
  } catch (err) {
    console.error("게시글 로드 중 오류:", err);
    alert("서버 오류로 게시글을 불러올 수 없습니다.");
  }
}

// ✅ 태그별 게시글 조회
async function loadPostsByTag(tag, page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
      tag,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/tag?${params}`);

    if (!data.isSuccess) {
      return alert("태그 게시글 조회 실패: " + data.message);
    }

    const { posts: tagPosts, currentPage: cp, totalPages: tp } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(tagPosts);
    renderPagination();

    // ✅ 영어 태그 → 한글 태그 변환
    const tagTextMap = {
      QUESTION: "식단 질문",
      RECOMMEND: "식단 추천",
      ANSWER: "식단 인증",
      ETC: "기타",
    };

    const koreanTag = tagTextMap[tag] || tag; // 매핑 없을 경우 그대로 표시
    document.getElementById("tag-title").textContent = `#${koreanTag}`;
  } catch (err) {
    console.error("태그 검색 중 오류:", err);
    alert("서버 오류로 게시글을 불러올 수 없습니다.");
  }
}

// ✅ 게시글 렌더링
function renderPosts(postList) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";
  const tagTextMap = {
    QUESTION: "식단 질문",
    RECOMMEND: "식단 추천",
    ANSWER: "식단 인증",
    ETC: "기타",
  };
  postList.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    const time = new Date(post.createdAt).toLocaleString();

    card.innerHTML = `
      <div class="post-header">
        <div class="profile-circle"></div>
        <div class="post-info">
          <div class="post-author">${post.authorNickname}</div>
          <div class="post-time">${time}</div>
        </div>
      </div>
      <div class="post-content">
        <p class="post-title">${post.title}</p>
        <p class="post-text">${post.content}</p>
      </div>
      <div class="post-footer">
        <div class="tags">
          ${post.tags
            .map((t) => `<span class="tag"># ${tagTextMap[t] || t}</span>`)
            .join("")}
        </div>
        ${
          post.thumbnailImageUrl
            ? `<div class="images"><img src="${post.thumbnailImageUrl}" class="thumbnail"/></div>`
            : ""
        }
      </div>
      <div class="post-actions">
        <span>❤️ ${post.likeCount}</span>
        <span>💬 ${post.commentCount}</span>
        <span>⭐ ${post.scrapCount}</span>
      </div>
    `;

    card.addEventListener("click", () => openDetailPopup(post));
    container.appendChild(card);
  });
}

// ✅ 페이지네이션
function renderPagination() {
  document.getElementById(
    "page-info"
  ).textContent = `${currentPage} / ${totalPages}`;
  const prev = document.getElementById("prev-page");
  const next = document.getElementById("next-page");

  prev.disabled = currentPage === 1;
  next.disabled = currentPage === totalPages;

  prev.onclick = () => {
    if (currentPage > 1) loadPosts(currentPage - 1);
  };
  next.onclick = () => {
    if (currentPage < totalPages) loadPosts(currentPage + 1);
  };
}

// ✅ 댓글 조회
async function fetchComments(postId) {
  try {
    const data = await AccessAPI.apiFetch(`/api/v1/posts/${postId}/comments`);
    if (!data.isSuccess) {
      console.warn("댓글 조회 실패:", data.message);
      return [];
    }
    return data.result.map((c) => ({
      id: c.commentId,
      user: c.memberNickname,
      text: c.comment,
      time: new Date(c.createdAt).toLocaleString(),
      parentId: c.parentId, // 중요
      likes: c.likeCount || 0,
      replies: [],
    }));
  } catch (err) {
    console.error("댓글 로드 중 오류:", err);
    return [];
  }
}

// ✅ 댓글 렌더링
function renderComments(comments, container, depth = 0) {
  container.innerHTML = "";

  comments.forEach((comment) => {
    const commentBox = document.createElement("div");
    commentBox.className = depth === 0 ? "comment-box" : "reply-box";

    commentBox.innerHTML = `
      <div class="comment-header">
        <div class="comment-header-left">
          <div class="profile-circle small"></div>
          <div class="comment-meta">
            <span class="comment-author">${comment.user}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
        </div>
        <div class="comment-actions">
          <button class="like-btn">공감 (${comment.likes || 0})</button>
          ${depth === 0 ? '<button class="reply-btn">대댓글</button>' : ""}
        </div>
      </div>
      <div class="comment-content">${comment.text}</div>
      <div class="reply-input-container" style="display: none;"></div>
    `; // 공감 버튼 처리
    const likeBtn = commentBox.querySelector(".like-btn");
    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        try {
          const res = await AccessAPI.apiFetch(
            `/api/v1/comments/${comment.id}/like`,
            { method: "POST" }
          );

          if (!res.isSuccess) {
            return alert("공감 실패: " + res.message);
          }

          // 공감 수를 직접 증가시켜 표시 (단순히 +1 처리)
          const currentText = likeBtn.textContent;
          const match = currentText.match(/\d+/);
          let currentCount = match ? parseInt(match[0]) : 0;
          currentCount += 1;
          likeBtn.textContent = `공감 (${currentCount})`;
        } catch (err) {
          console.error("공감 처리 중 오류:", err);
          alert("서버 오류로 공감에 실패했습니다.");
        }
      });
    }

    const replyBtn = commentBox.querySelector(".reply-btn");
    const replyContainer = commentBox.querySelector(".reply-input-container");

    if (replyBtn) {
      replyBtn.addEventListener("click", () => {
        if (replyContainer.style.display === "block") {
          replyContainer.innerHTML = "";
          replyContainer.style.display = "none";
        } else {
          replyContainer.innerHTML = `
            <input type="text" class="reply-input" placeholder="답글을 입력하세요." />
            <button class="submit-reply">등록</button>
          `;
          replyContainer.style.display = "block";

          replyContainer
            .querySelector(".submit-reply")
            .addEventListener("click", async () => {
              const text = replyContainer
                .querySelector(".reply-input")
                .value.trim();
              if (!text) return;

              try {
                // POST /api/v1/comments/{parentId}/replies 호출
                const res = await AccessAPI.apiFetch(
                  `/api/v1/comments/${comment.id}/replies`,
                  {
                    method: "POST",
                    body: JSON.stringify({ comment: text }),
                  }
                );

                if (!res.isSuccess) {
                  return alert("대댓글 등록 실패: " + res.message);
                }

                // 새로운 대댓글 요소 생성
                const replyBox = document.createElement("div");
                replyBox.className = "reply-box";
                const now = new Date().toLocaleString();
                replyBox.innerHTML = `
        <div class="comment-header">
          <div class="comment-header-left">
            <div class="profile-circle small"></div>
            <div class="comment-meta">
              <span class="comment-author">나</span>
              <span class="comment-time">${now}</span>
            </div>
          </div>
          <div class="comment-actions">
            <button class="like-btn">공감 (0)</button>
          </div>
        </div>
        <div class="comment-content">${text}</div>
      `;

                // 부모 댓글 박스에 있는 reply-wrapper에 append
                let replyWrapper = commentBox.querySelector(".reply-wrapper");
                if (!replyWrapper) {
                  replyWrapper = document.createElement("div");
                  replyWrapper.className = "reply-wrapper";
                  commentBox.appendChild(replyWrapper);
                }

                replyWrapper.appendChild(replyBox);

                // 입력창 초기화 및 닫기
                replyContainer.innerHTML = "";
                replyContainer.style.display = "none";
              } catch (err) {
                console.error("대댓글 등록 중 오류:", err);
                alert("서버 오류로 대댓글 등록에 실패했습니다.");
              }
            });
        }
      });
    }

    container.appendChild(commentBox);

    if (comment.replies && comment.replies.length) {
      const replyWrapper = document.createElement("div");
      replyWrapper.className = "reply-wrapper";
      commentBox.appendChild(replyWrapper);
      renderComments(comment.replies, replyWrapper, depth + 1);
    }
  });
}

// ✅ 게시글 상세 팝업
async function openDetailPopup(post) {
  currentPost = post;
  const tagTextMap = {
    QUESTION: "식단 질문",
    RECOMMEND: "식단 추천",
    ANSWER: "식단 인증",
    ETC: "기타",
  };

  document.getElementById("detail-author").textContent = post.authorNickname;
  document.getElementById("detail-time").textContent = new Date(
    post.createdAt
  ).toLocaleString();
  document.getElementById("detail-title").textContent = post.title;
  document.getElementById("detail-body").textContent = post.content;
  document.getElementById("detail-tags").innerHTML = post.tags
    .map((t) => `<span class="tag"># ${tagTextMap[t] || t}</span>`)
    .join("");
  document.getElementById("detail-likes-count").textContent = post.likeCount;
  document.getElementById("detail-comments-count").textContent =
    post.commentCount;
  document.getElementById("detail-saves-count").textContent = post.scrapCount;

  const imgCt = document.getElementById("detail-images");
  imgCt.innerHTML = post.thumbnailImageUrl
    ? `<img src="${post.thumbnailImageUrl}" class="detail-img"/>`
    : "";

  const comments = await fetchComments(post.postId);
  renderComments(comments, document.getElementById("detail-comments"));

  document.querySelector(".detail-overlay").classList.remove("hidden");

  document.getElementById("submit-main-comment").onclick = async () => {
    const inp = document.getElementById("main-comment-input");
    const txt = inp.value.trim();
    if (!txt) return;
    const res = await AccessAPI.apiFetch(
      `/api/v1/posts/${post.postId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ comment: txt }),
      }
    );
    if (!res.isSuccess) return alert("댓글 등록 실패: " + res.message);
    inp.value = "";
    const updated = await fetchComments(post.postId);
    renderComments(updated, document.getElementById("detail-comments"));
    document.getElementById("detail-comments-count").textContent =
      updated.length;
  };
  // ✅ 좋아요 버튼 클릭 시
  document.getElementById("like-btn").onclick = async () => {
    try {
      const res = await AccessAPI.apiFetch(
        `/api/v1/posts/${post.postId}/like`,
        {
          method: "POST",
        }
      );

      if (!res.isSuccess) {
        return alert("좋아요 실패: " + res.message);
      }

      // ✅ 응답에 따라 좋아요 수 반영
      document.getElementById("detail-likes-count").textContent =
        res.result.count;
    } catch (err) {
      console.error("좋아요 처리 중 오류:", err);
      alert("서버 오류로 좋아요에 실패했습니다.");
    }
  };
  // ✅ 스크랩 버튼 클릭 시
  document.getElementById("save-btn").onclick = async () => {
    try {
      const res = await AccessAPI.apiFetch(
        `/api/v1/posts/${post.postId}/scrap`,
        {
          method: "POST",
        }
      );

      if (!res.isSuccess) {
        return alert("스크랩 실패: " + res.message);
      }

      // ✅ 응답에 따라 스크랩 수 반영
      document.getElementById("detail-saves-count").textContent =
        res.result.count;
    } catch (err) {
      console.error("스크랩 처리 중 오류:", err);
      alert("서버 오류로 스크랩 처리에 실패했습니다.");
    }
  };

  document.querySelector(".close-detail").onclick = () => {
    document.querySelector(".detail-overlay").classList.add("hidden");
  };
}

// ✅ 스크랩 게시글 조회
async function loadScrapPosts(page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/scraps?${params}`);

    if (!data.isSuccess) {
      alert("스크랩 게시글 조회 실패: " + data.message);
      return;
    }

    const { posts: scrapPosts, currentPage: cp, totalPages: tp } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(scrapPosts);
    renderPagination();
    document.getElementById("tag-title").textContent = "저장한 게시물";
  } catch (err) {
    console.error("스크랩 게시글 로딩 오류:", err);
    alert("스크랩 게시글 불러오는 중 오류가 발생했습니다.");
  }
}

// ✅ 검색 기능
async function searchPosts(keyword, page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
      keyword,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/search?${params}`);

    if (!data.isSuccess) {
      return alert("검색 실패: " + data.message);
    }

    const {
      posts: searchResults,
      currentPage: cp,
      totalPages: tp,
    } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(searchResults);
    renderPagination();
    document.getElementById("tag-title").textContent = `"${keyword}" 검색 결과`;
  } catch (err) {
    console.error("검색 중 오류:", err);
    alert("검색 중 서버 오류가 발생했습니다.");
  }
}

// ✅ 초기 실행 및 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  loadPosts(1);

  document.getElementById("search-btn").addEventListener("click", () => {
    const keyword = document.getElementById("search-input").value.trim();
    if (!keyword) {
      alert("검색어를 입력해주세요.");
      return;
    }
    searchPosts(keyword, 1);
  });

  document.getElementById("view-scrap-posts").addEventListener("click", () => {
    loadScrapPosts(1);
  });
  document.getElementById("view-my-posts").addEventListener("click", () => {
    loadMyPosts(1);
  });
  document.querySelectorAll(".hashtags .tag").forEach((tagEl) => {
    tagEl.addEventListener("click", () => {
      const tagValue = tagEl.getAttribute("data-tag");
      loadPostsByTag(tagValue, 1);
    });
  });
  // ✅ 팝업 열기
  window.onload = function () {
    document.querySelector(".write-btn").addEventListener("click", () => {
      document.querySelector(".popup-overlay").style.display = "flex";
    });
  };

  // ✅ 팝업 닫기
  document.querySelector(".cancel-btn").addEventListener("click", () => {
    document.querySelector(".popup-overlay").style.display = "none";
  });

  // ✅ 글 작성 등록 처리
  document.querySelector(".submit-btn").addEventListener("click", async () => {
    const titleInput = document.querySelector(".popup input[type='text']");
    const contentTextarea = document.getElementById("postContent");

    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    // ✅ 선택된 태그 가져오기
    const selectedTag = document.querySelector(".popup-tags .tag.selected");
    if (!selectedTag) {
      alert("태그를 선택해주세요.");
      return;
    }

    const tagText = selectedTag.getAttribute("data-tag");
    const tagMap = {
      "식단 질문": "QUESTION",
      "식단 추천": "RECOMMEND",
      "식단 인증": "ANSWER",
      기타: "ETC",
    };
    const tag = tagMap[tagText];

    if (!title || !content) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

    try {
      const res = await AccessAPI.apiFetch("/api/v1/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          tags: [tag],
          images: [], // 이미지 안 넣을 경우 빈 배열
        }),
      });

      if (!res.isSuccess) {
        return alert("글 작성 실패: " + res.message);
      }

      alert("글이 성공적으로 등록되었습니다!");
      document.querySelector(".popup-overlay").style.display = "none";

      // 초기화
      titleInput.value = "";
      contentTextarea.value = "";
      document
        .querySelectorAll(".popup-tags .tag")
        .forEach((el) => el.classList.remove("selected"));

      // 목록 새로고침
      loadPosts(1);
    } catch (err) {
      console.error("글 등록 중 오류:", err);
      alert("서버 오류로 글 등록에 실패했습니다.");
    }
  });

  // ✅ 태그 선택 UI 처리
  document.querySelectorAll(".popup-tags .tag").forEach((tagEl) => {
    tagEl.addEventListener("click", () => {
      document
        .querySelectorAll(".popup-tags .tag")
        .forEach((el) => el.classList.remove("selected"));
      tagEl.classList.add("selected");
    });
  });

  // ✅ 글자수 실시간 표시
  document.getElementById("postContent").addEventListener("input", (e) => {
    const len = e.target.value.length;
    document.getElementById("charCount").textContent = `${len} / 2000`;
  });
});
// ✅ 내가 작성한 게시글 조회
async function loadMyPosts(page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/my?${params}`);

    if (!data.isSuccess) {
      alert("내 게시글 조회 실패: " + data.message);
      return;
    }

    const { posts: myPosts, currentPage: cp, totalPages: tp } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(myPosts);
    renderPagination();
    document.getElementById("tag-title").textContent = "내 게시물";
  } catch (err) {
    console.error("내 게시글 로딩 오류:", err);
    alert("내 게시글을 불러오는 중 오류가 발생했습니다.");
  }
}
