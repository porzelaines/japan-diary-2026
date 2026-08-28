(() => {
  const page = document.body.dataset.page;

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  if (page === "home") {
    const diaryKey = "japan-diary-entries-v2";
    const todoKey = "japan-diary-todos-v2";
    let entries = read(diaryKey, []);
    let todos = read(todoKey, []);

    const diaryForm = document.getElementById("diaryForm");
    const diaryEntries = document.getElementById("diaryEntries");
    const diaryDate = document.getElementById("diaryDate");
    const diaryTitle = document.getElementById("diaryTitle");
    const diaryText = document.getElementById("diaryText");

    if (diaryDate && !diaryDate.value) {
      diaryDate.value = new Date().toISOString().slice(0, 10);
    }

    function renderDiary() {
      if (!entries.length) {
        diaryEntries.innerHTML = '<div class="empty-state">Your diary entries will appear here.</div>';
        return;
      }

      diaryEntries.innerHTML = [...entries].reverse().map((entry, reverseIndex) => {
        const index = entries.length - 1 - reverseIndex;
        return `
          <article class="diary-entry">
            <div class="diary-meta">${escapeHtml(entry.date)}</div>
            <h3>${escapeHtml(entry.title)}</h3>
            <p>${escapeHtml(entry.text)}</p>
            <div class="entry-actions">
              <button class="small-button" type="button" data-delete-diary="${index}">Delete</button>
            </div>
          </article>`;
      }).join("");
    }

    diaryForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      entries.push({
        date: diaryDate.value,
        title: diaryTitle.value.trim(),
        text: diaryText.value.trim()
      });
      write(diaryKey, entries);
      diaryTitle.value = "";
      diaryText.value = "";
      renderDiary();
    });

    diaryEntries?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete-diary]");
      if (!button) return;
      entries.splice(Number(button.dataset.deleteDiary), 1);
      write(diaryKey, entries);
      renderDiary();
    });

    const todoForm = document.getElementById("todoForm");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const todoCount = document.getElementById("todoCount");

    function renderTodos() {
      todoCount.textContent = String(todos.filter((todo) => !todo.done).length);
      if (!todos.length) {
        todoList.innerHTML = '<div class="empty-state">No todos yet.</div>';
        return;
      }

      todoList.innerHTML = todos.map((todo, index) => `
        <div class="todo-item ${todo.done ? "done" : ""}">
          <input type="checkbox" data-toggle-todo="${index}" ${todo.done ? "checked" : ""} aria-label="Toggle todo">
          <span>${escapeHtml(todo.text)}</span>
          <button class="delete-button" type="button" data-delete-todo="${index}" aria-label="Delete todo">×</button>
        </div>`).join("");
    }

    todoForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;
      todos.push({ text, done: false });
      write(todoKey, todos);
      todoInput.value = "";
      renderTodos();
    });

    todoList?.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-toggle-todo]");
      if (!checkbox) return;
      todos[Number(checkbox.dataset.toggleTodo)].done = checkbox.checked;
      write(todoKey, todos);
      renderTodos();
    });

    todoList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete-todo]");
      if (!button) return;
      todos.splice(Number(button.dataset.deleteTodo), 1);
      write(todoKey, todos);
      renderTodos();
    });

    renderDiary();
    renderTodos();
  }

  if (page === "collection") {
    const form = document.getElementById("collectionForm");
    const list = document.getElementById("collectionList");
    const storageKey = form?.dataset.storageKey;
    let items = read(storageKey, []);

    function renderCollection() {
      if (!items.length) {
        list.innerHTML = '<div class="empty-state">Nothing saved here yet.</div>';
        return;
      }

      list.innerHTML = items.map((item, index) => `
        <article class="collection-card">
          <div class="card-meta">${escapeHtml(item.meta || "")}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text || "")}</p>
          <div class="card-actions">
            <button class="small-button" type="button" data-delete-item="${index}">Delete</button>
          </div>
        </article>`).join("");
    }

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = document.getElementById("itemTitle").value.trim();
      const meta = document.getElementById("itemMeta").value.trim();
      const text = document.getElementById("itemText").value.trim();
      if (!title) return;
      items.push({ title, meta, text });
      write(storageKey, items);
      form.reset();
      renderCollection();
    });

    list?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete-item]");
      if (!button) return;
      items.splice(Number(button.dataset.deleteItem), 1);
      write(storageKey, items);
      renderCollection();
    });

    renderCollection();
  }
})();
