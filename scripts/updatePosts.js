document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".saved-content");

  // TODO: 실제 API 로 바꾸실 때는 fetch 로 대체하세요.
  renderSaved(savedItems);

  function renderSaved(items) {
    // map 으로 카드 하나씩 HTML 문자열로 만든 뒤, join 해서 innerHTML 에 한 번에 할당
    container.innerHTML = items
      .map(
        (item) => `
      <div class="item-card">
        <div class="card-text">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-body">${item.body}</p>
          <div class="card-tags">
            ${item.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
        <div class="card-actions">
          <label class="checkbox">
            <input type="checkbox" ${item.checked ? "checked" : ""}>
            <span class="checkmark"></span>
          </label>
          <div class="thumbnail">
            ${item.imageCount > 0 ? `+${item.imageCount}` : ""}
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
});
