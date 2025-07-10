// 전역 변수
const postsPerPage = 10;
let currentPage = 1;
let filteredTag = null;
let currentPost = null;

// 게시글 더미 데이터 (댓글 포함)
const posts = [
  {
    author: "유저a",
    time: "3분 전",
    title: "ㅇㅇ, ㅇㅇ, ㅇㅇ으로 만들 수 있는 메뉴 추천합니다.",
    body: "여기 저기 여기 저기 이렇게 저렇게 이렇게 저렇게 하면 됨.",
    tags: ["식단 추천", "식단 인증"],
    imageCount: 8,
    comments: [
      {
        user: "댓글러1",
        text: "좋은 정보 감사합니다!",
        time: "2분 전",
        replies: [],
      },
      { user: "댓글러2", text: "이거 해볼게요!", time: "1분 전", replies: [] },
    ],
    likes: 4,
    saves: 0,
    liked: false,
    saved: false,
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    author: `유저${i + 1}`,
    time: `${i + 1}시간 전`,
    title: `${i + 1}번째 식단 추천`,
    body: `내용 예시입니다.`,
    tags: ["식단 질문"],
    imageCount: i + 2,
    comments: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      user: `댓글${j + 1}`,
      text: `${j + 1}번째 댓글입니다.`,
      time: "1시간 전",
      replies: [],
    })),
    likes: i,
    saves: i * 2,
    liked: false,
    saved: false,
  })),
];

function renderPosts(postList) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";

  const filteredPosts = filteredTag
    ? postList.filter((p) => p.tags.includes(filteredTag))
    : postList;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  const currentPosts = filteredPosts.slice(startIdx, endIdx);

  currentPosts.forEach((post, index) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.index = startIdx + index;

    card.innerHTML = `
      <div class="post-header">
        <div class="profile-circle"></div>
        <div class="post-info">
          <div class="post-author">${post.author}</div>
          <div class="post-time">${post.time}</div>
        </div>
      </div>
      <div class="post-content">
        <p class="post-title">${post.title}</p>
        <p class="post-text">${post.body}</p>
      </div>
      <div class="post-footer">
        <div class="tags">
          ${post.tags
            .map((tag) => `<span class="tag"># ${tag}</span>`)
            .join("")}
        </div>
        <div class="images">
          ${[...Array(Math.min(post.imageCount, 2))]
            .map(() => '<div class="img-box">IMG</div>')
            .join("")}
          ${
            post.imageCount > 2
              ? `<div class="img-box">+${post.imageCount - 2}</div>`
              : ""
          }
        </div>
      </div>
      <div class="post-actions">
        <span>❤️ ${post.likes}</span>
        <span>💬 ${getTotalComments(post)}</span>
        <span>⭐ ${post.saves}</span>
      </div>
    `;

    card.addEventListener("click", () => openDetailPopup(post));
    container.appendChild(card);
  });

  renderPagination(totalPages);
}
function getTotalComments(post) {
  return (
    post.comments.length +
    post.comments.reduce((acc, c) => acc + c.replies.length, 0)
  );
}

function renderPagination(totalPages) {
  let pagination = document.querySelector(".pagination");
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.className = "pagination";
    document.querySelector(".community-wrapper").appendChild(pagination);
  }
  pagination.innerHTML = `
    <button ${
      currentPage === 1 ? "disabled" : ""
    } class="page-btn prev">◀</button>
    <span class="page-info">${currentPage} / ${totalPages}</span>
    <button ${
      currentPage === totalPages ? "disabled" : ""
    } class="page-btn next">▶</button>
  `;

  pagination.querySelector(".prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts(posts);
    }
  });

  pagination.querySelector(".next").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts(posts);
    }
  });
}

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
          <button class="like-btn">공감</button>
          ${depth === 0 ? '<button class="reply-btn">대댓글</button>' : ""}
        </div>
      </div>
      <div class="comment-content">${comment.text}</div>
      <div class="reply-input-container" style="display: none;"></div>
    `;

    const replyBtn = commentBox.querySelector(".reply-btn");
    const replyContainer = commentBox.querySelector(".reply-input-container");

    if (replyBtn) {
      replyBtn.addEventListener("click", () => {
        if (replyContainer.innerHTML) {
          replyContainer.innerHTML = "";
          replyContainer.style.display = "none";
        } else {
          replyContainer.style.display = "block";
          replyContainer.innerHTML = `
            <input type="text" class="reply-input" placeholder="답글을 입력하세요." />
            <button class="submit-reply">등록</button>
          `;

          replyContainer
            .querySelector(".submit-reply")
            .addEventListener("click", () => {
              const text = replyContainer
                .querySelector(".reply-input")
                .value.trim();
              if (!text) return;

              const reply = { user: "나", time: "방금 전", text, replies: [] };
              comment.replies.push(reply);

              // 👇 이거 중요! currentPost를 다시 참조해서 반영
              const postIndex = posts.findIndex((p) => p === currentPost);
              if (postIndex !== -1) {
                posts[postIndex] = currentPost;
              }

              const totalCommentCount =
                currentPost.comments.length +
                currentPost.comments.reduce(
                  (acc, c) => acc + c.replies.length,
                  0
                );

              document.getElementById("detail-comments-count").textContent =
                totalCommentCount;

              renderPosts(posts);
              openDetailPopup(currentPost);
            });
        }
      });
    }

    container.appendChild(commentBox);

    if (comment.replies && comment.replies.length > 0) {
      const replyWrap = document.createElement("div");
      replyWrap.className = "reply-wrapper";
      renderComments(comment.replies, replyWrap, depth + 1);
      commentBox.appendChild(replyWrap);
    }
  });
}

function openDetailPopup(post) {
  currentPost = post;

  document.getElementById("detail-author").textContent = post.author;
  document.getElementById("detail-time").textContent = post.time;
  document.getElementById("detail-title").textContent = post.title;
  document.getElementById("detail-body").textContent = post.body;
  document.getElementById("detail-tags").innerHTML = post.tags
    .map((tag) => `<span class="tag"># ${tag}</span>`)
    .join("");

  const imageContainer = document.getElementById("detail-images");

  if (post.imageCount > 5) {
    imageContainer.innerHTML = `
      <div class="image-carousel-wrapper">
        <button class="arrow left">◀</button>
        <div class="image-carousel">
          ${Array.from(
            { length: post.imageCount },
            () => `<div class="img-box">IMG</div>`
          ).join("")}
        </div>
        <button class="arrow right">▶</button>
      </div>
    `;

    const carousel = imageContainer.querySelector(".image-carousel");
    imageContainer.querySelector(".arrow.left").onclick = () => {
      carousel.scrollBy({ left: -300, behavior: "smooth" });
    };
    imageContainer.querySelector(".arrow.right").onclick = () => {
      carousel.scrollBy({ left: 300, behavior: "smooth" });
    };
  } else {
    imageContainer.innerHTML = `
      <div class="image-carousel-static">
        ${Array.from(
          { length: post.imageCount },
          () => `<div class="img-box">IMG</div>`
        ).join("")}
      </div>
    `;
  }

  document.getElementById("detail-likes-count").textContent = post.likes;
  document.getElementById("detail-saves-count").textContent = post.saves;
  document.getElementById("detail-comments-count").textContent =
    getTotalComments(currentPost);

  renderComments(post.comments, document.getElementById("detail-comments"));

  document.querySelector(".detail-overlay").classList.remove("hidden");

  const likeBtn = document.getElementById("like-btn");
  likeBtn.classList.toggle("clicked", post.liked);
  likeBtn.textContent = "좋아요";
  likeBtn.onclick = function () {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    if (post.likes < 0) post.likes = 0;
    document.getElementById("detail-likes-count").textContent = post.likes;
    this.classList.toggle("clicked", post.liked);
    renderPosts(posts);
  };

  const saveBtn = document.getElementById("save-btn");
  saveBtn.classList.toggle("clicked", post.saved);
  saveBtn.textContent = "저장";
  saveBtn.onclick = function () {
    post.saved = !post.saved;
    post.saves += post.saved ? 1 : -1;
    if (post.saves < 0) post.saves = 0;
    document.getElementById("detail-saves-count").textContent = post.saves;
    this.classList.toggle("clicked", post.saved);
    renderPosts(posts);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  renderPosts(posts);
  const postContentInput = document.getElementById("postContent");
  const charCount = document.getElementById("charCount");

  if (postContentInput && charCount) {
    postContentInput.addEventListener("input", () => {
      charCount.textContent = `${postContentInput.value.length} / 2000`;
    });
  }
  document.querySelectorAll(".hashtags .tag").forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
      filteredTag = tagBtn.dataset.tag;
      currentPage = 1;
      document.getElementById("tag-title").textContent = `# ${filteredTag}`;
      renderPosts(posts);
    });
  });

  document.querySelector(".write-btn").addEventListener("click", () => {
    document.querySelector(".popup-overlay").style.display = "flex";
  });

  document.querySelector(".cancel-btn").addEventListener("click", () => {
    document.querySelector(".popup-overlay").style.display = "none";
  });

  document.querySelector(".close-detail").addEventListener("click", () => {
    document.querySelector(".detail-overlay").classList.add("hidden");
  });

  document
    .getElementById("submit-main-comment")
    .addEventListener("click", () => {
      const input = document.getElementById("main-comment-input");
      const text = input.value.trim();
      if (!text) return;
      currentPost.comments.push({
        user: "나",
        time: "방금 전",
        text,
        replies: [],
      });
      input.value = "";
      document.getElementById("detail-comments-count").textContent =
        currentPost.comments.length;
      renderPosts(posts);
      openDetailPopup(currentPost);
    });
});
