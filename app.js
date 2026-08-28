(() => {
  const c = window.siteContent;
  const stateKey = "japan-diary-2026";
  const saved = JSON.parse(localStorage.getItem(stateKey) || "{}");

  const setText = (id, value) => document.getElementById(id).textContent = value;
  const setHtml = (id, value) => document.getElementById(id).innerHTML = value;

  setText("brand", c.brand);
  document.getElementById("nav").innerHTML = c.nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");

  setText("eyebrow", c.hero.eyebrow);
  setHtml("heroTitle", c.hero.titleHtml);
  setText("heroLead", c.hero.lead);
  setText("heroCaption", c.hero.caption);
  setText("noteTitle", c.hero.noteTitle);
  setText("noteText", c.hero.noteText);
  setText("stamp", c.hero.stamp);
  setText("progressLabel", c.progressLabel);

  setText("weeksTitle", c.weeks.title);
  setText("weeksIntro", c.weeks.intro);
  document.getElementById("weeksGrid").innerHTML = c.weeks.items.map(item => `
    <article class="week">
      <small>${item.number}</small>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <em>${item.mood}</em>
    </article>`).join("");

  setText("wishlistTitle", c.wishlist.title);
  setText("wishlistIntro", c.wishlist.intro);
  document.getElementById("wishlistGrid").innerHTML = c.wishlist.lists.map((list, listIndex) => `
    <div class="card">
      <h3>${list.title}</h3>
      <p>${list.intro}</p>
      ${list.tasks.map((task, taskIndex) => {
        const id = `wish-${listIndex}-${taskIndex}`;
        return `<div class="task"><input id="${id}" type="checkbox"><label for="${id}">${task}</label></div>`;
      }).join("")}
      <form class="add-row" data-list="${listIndex}">
        <input placeholder="Lorem ipsum…" aria-label="Add item">
        <button type="submit">+</button>
      </form>
      <div class="custom-tasks" data-custom-list="${listIndex}"></div>
    </div>`).join("");

  setText("routineTitle", c.routine.title);
  setText("routineIntro", c.routine.intro);
  document.getElementById("routineGrid").innerHTML = c.routine.items.map(([time, text]) => `
    <div class="time">${time}</div><div class="text">${text}</div>`).join("");

  setText("vlogTitle", c.vlog.title);
  setText("vlogIntro", c.vlog.intro);
  setText("vlogCoverSmall", c.vlog.coverSmall);
  setText("vlogCoverTitle", c.vlog.coverTitle);
  setText("vlogCoverText", c.vlog.coverText);
  setText("shotsTitle", c.vlog.shotsTitle);
  setText("shotsIntro", c.vlog.shotsIntro);
  document.getElementById("shotGrid").innerHTML = c.vlog.shots.map(([title, text]) => `
    <div class="shot"><b>${title}</b><span>${text}</span></div>`).join("");

  setText("workTitle", c.work.title);
  setText("workIntro", c.work.intro);
  document.getElementById("workGrid").innerHTML = `
    <div class="card">
      <h3>${c.work.left.title}</h3>
      <div class="routine">${c.work.left.rows.map(([time, text]) => `<div class="time">${time}</div><div class="text">${text}</div>`).join("")}</div>
    </div>
    <div class="card">
      <h3>${c.work.right.title}</h3>
      ${c.work.right.tasks.map((task, i) => `<div class="task"><input id="work-${i}" type="checkbox"><label for="work-${i}">${task}</label></div>`).join("")}
    </div>`;

  setText("notesTitle", c.notes.title);
  setText("notesIntro", c.notes.intro);
  document.getElementById("dailyNotes").placeholder = c.notes.placeholder;
  setText("notesHint", c.notes.hint);
  setText("footerLeft", c.footer[0]);
  setText("footerRight", c.footer[1]);

  const customLists = saved.customLists || c.wishlist.lists.map(() => []);

  function renderCustomLists() {
    document.querySelectorAll("[data-custom-list]").forEach(target => {
      const listIndex = Number(target.dataset.customList);
      target.innerHTML = customLists[listIndex].map((item, itemIndex) => {
        const id = `custom-${listIndex}-${itemIndex}`;
        return `<div class="task"><input id="${id}" type="checkbox" ${item.done ? "checked" : ""}><label for="${id}">${item.text}</label></div>`;
      }).join("");
    });
  }

  function save() {
    const checks = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => checks[cb.id] = cb.checked);
    localStorage.setItem(stateKey, JSON.stringify({ checks, notes: document.getElementById("dailyNotes").value, customLists }));
  }

  function applySavedChecks() {
    Object.entries(saved.checks || {}).forEach(([id, checked]) => {
      const el = document.getElementById(id);
      if (el) el.checked = checked;
    });
  }

  function updateProgress() {
    const boxes = [...document.querySelectorAll('.task input[type="checkbox"]')];
    const done = boxes.filter(box => box.checked).length;
    const pct = boxes.length ? Math.round(done / boxes.length * 100) : 0;
    document.getElementById("progressFill").style.width = `${pct}%`;
    document.getElementById("progressNum").textContent = `${pct}%`;
  }

  document.querySelectorAll(".add-row").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;
      const listIndex = Number(form.dataset.list);
      customLists[listIndex].push({ text, done: false });
      input.value = "";
      renderCustomLists();
      attachCheckboxListeners();
      save();
      updateProgress();
    });
  });

  function attachCheckboxListeners() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.dataset.bound) return;
      cb.dataset.bound = "1";
      cb.addEventListener("change", () => {
        if (cb.id.startsWith("custom-")) {
          const parts = cb.id.split("-");
          const listIndex = Number(parts[1]);
          const itemIndex = Number(parts[2]);
          customLists[listIndex][itemIndex].done = cb.checked;
        }
        save();
        updateProgress();
      });
    });
  }

  document.getElementById("dailyNotes").value = saved.notes || "";
  document.getElementById("dailyNotes").addEventListener("input", save);

  renderCustomLists();
  applySavedChecks();
  attachCheckboxListeners();
  updateProgress();
})();