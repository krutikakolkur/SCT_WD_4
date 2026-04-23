/* =========================================
   LUMINA TO-DO — APP LOGIC
   ========================================= */

(function () {
  'use strict';

  // ── State ────────────────────────────────────
  let tasks = JSON.parse(localStorage.getItem('lumina-tasks') || '[]');
  let editingId = null;
  let currentFilter = 'all';

  // ── DOM refs ─────────────────────────────────
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const menuBtn        = document.getElementById('menuBtn');
  const mainEl         = document.getElementById('main');

  const addBtn         = document.getElementById('addBtn');
  const modalOverlay   = document.getElementById('modalOverlay');
  const modalClose     = document.getElementById('modalClose');
  const modalCancel    = document.getElementById('modalCancel');
  const modalSave      = document.getElementById('modalSave');
  const modalHeading   = document.getElementById('modal-heading');

  const taskList       = document.getElementById('taskList');
  const emptyState     = document.getElementById('emptyState');
  const filterTitle    = document.getElementById('filter-title');
  const headerDate     = document.getElementById('header-date');
  const toast          = document.getElementById('toast');

  const ringFill       = document.getElementById('ring-fill');
  const ringPct        = document.getElementById('ring-pct');
  const statSub        = document.getElementById('stat-sub');

  const badgeAll       = document.getElementById('badge-all');
  const badgePending   = document.getElementById('badge-pending');
  const badgeCompleted = document.getElementById('badge-completed');

  const inputTitle     = document.getElementById('taskTitle');
  const inputNote      = document.getElementById('taskNote');
  const inputDate      = document.getElementById('taskDate');
  const inputTime      = document.getElementById('taskTime');

  // ── Init ─────────────────────────────────────
  function init() {
    setHeaderDate();
    renderAll();
    bindEvents();
  }

  function setHeaderDate() {
    const now = new Date();
    const opts = { weekday:'long', month:'long', day:'numeric', year:'numeric' };
    headerDate.textContent = now.toLocaleDateString('en-US', opts);
  }

  // ── Events ───────────────────────────────────
  function bindEvents() {
    // Sidebar toggle (desktop)
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainEl.classList.toggle('sidebar-collapsed');
    });

    // Mobile menu
    menuBtn.addEventListener('click', toggleMobileSidebar);

    // Filter nav
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        const labels = { all: 'All Tasks', pending: 'Pending', completed: 'Completed' };
        filterTitle.textContent = labels[currentFilter];
        renderTasks();
      });
    });

    // Add / modal
    addBtn.addEventListener('click', openAddModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    modalSave.addEventListener('click', saveTask);

    // Enter to save
    inputTitle.addEventListener('keydown', e => { if (e.key === 'Enter') saveTask(); });

    // Escape to close
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Mobile backdrop click
    document.addEventListener('click', e => {
      const backdrop = document.querySelector('.sidebar-backdrop');
      if (backdrop && e.target === backdrop) closeMobileSidebar();
    });
  }

  // ── Mobile Sidebar ───────────────────────────
  function toggleMobileSidebar() {
    const isOpen = sidebar.classList.contains('mobile-open');
    isOpen ? closeMobileSidebar() : openMobileSidebar();
  }

  function openMobileSidebar() {
    sidebar.classList.add('mobile-open');
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }
    requestAnimationFrame(() => backdrop.classList.add('show'));
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (backdrop) backdrop.classList.remove('show');
  }

  // ── Modal ─────────────────────────────────────
  function openAddModal() {
    editingId = null;
    modalHeading.textContent = 'New Task';
    modalSave.textContent = 'Save Task';
    clearForm();
    openModal();
  }

  function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingId = id;
    modalHeading.textContent = 'Edit Task';
    modalSave.textContent = 'Update Task';

    inputTitle.value = task.title;
    inputNote.value  = task.note || '';
    inputDate.value  = task.date || '';
    inputTime.value  = task.time || '';

    document.querySelectorAll('input[name="priority"]').forEach(r => {
      r.checked = r.value === (task.priority || 'low');
    });

    openModal();
  }

  function openModal() {
    modalOverlay.classList.add('open');
    setTimeout(() => inputTitle.focus(), 100);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    editingId = null;
  }

  function clearForm() {
    inputTitle.value = '';
    inputNote.value  = '';
    inputDate.value  = '';
    inputTime.value  = '';
    document.querySelector('input[name="priority"][value="low"]').checked = true;
  }

  // ── Save / Edit Task ──────────────────────────
  function saveTask() {
    const title = inputTitle.value.trim();
    if (!title) {
      inputTitle.focus();
      shake(inputTitle);
      return;
    }

    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'low';

    if (editingId) {
      const idx = tasks.findIndex(t => t.id === editingId);
      if (idx > -1) {
        tasks[idx] = { ...tasks[idx], title, note: inputNote.value.trim(),
          date: inputDate.value, time: inputTime.value, priority };
        showToast('Task updated ✦');
      }
    } else {
      tasks.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        title,
        note: inputNote.value.trim(),
        date: inputDate.value,
        time: inputTime.value,
        priority,
        completed: false,
        created: Date.now()
      });
      showToast('Task added ✦');
    }

    persist();
    renderAll();
    closeModal();
  }

  // ── Complete / Delete ─────────────────────────
  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    persist();
    renderAll();
    showToast(task.completed ? 'Marked complete ◆' : 'Marked pending ◇');
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    persist();
    renderAll();
    showToast('Task removed');
  }

  // ── Render ────────────────────────────────────
  function renderAll() {
    updateBadges();
    updateStats();
    renderTasks();
  }

  function getFiltered() {
    if (currentFilter === 'pending')   return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  function renderTasks() {
    const filtered = getFiltered();

    // Remove existing cards
    document.querySelectorAll('.task-card').forEach(c => c.remove());

    // Show/hide empty
    emptyState.style.display = filtered.length ? 'none' : 'flex';

    filtered.slice().reverse().forEach((task, i) => {
      const card = buildCard(task, i);
      taskList.appendChild(card);
    });
  }

  function buildCard(task, index) {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    card.dataset.priority = task.priority || 'low';
    card.dataset.id = task.id;
    card.style.animationDelay = `${index * 0.05}s`;

    const meta = buildMeta(task);

    card.innerHTML = `
      <div class="check-wrap">
        <button class="check-btn" title="${task.completed ? 'Mark pending' : 'Mark complete'}">
          ${task.completed ? '✓' : ''}
        </button>
      </div>
      <div class="task-info">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.note ? `<div class="task-note">${escapeHtml(task.note)}</div>` : ''}
        ${meta ? `<div class="task-meta">${meta}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="action-btn edit" title="Edit">✎</button>
        <button class="action-btn delete" title="Delete">✕</button>
      </div>
    `;

    card.querySelector('.check-btn').addEventListener('click', () => toggleComplete(task.id));
    card.querySelector('.action-btn.edit').addEventListener('click', () => openEditModal(task.id));
    card.querySelector('.action-btn.delete').addEventListener('click', () => deleteTask(task.id));

    return card;
  }

  function buildMeta(task) {
    let parts = [];

    if (task.date || task.time) {
      let dtStr = '';
      if (task.date) {
        const d = new Date(task.date + 'T00:00:00');
        dtStr += d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
      }
      if (task.time) {
        const [h, m] = task.time.split(':');
        const d = new Date(); d.setHours(h, m);
        dtStr += (task.date ? ' · ' : '') + d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
      }
      parts.push(`<span class="task-datetime"><span class="icon">◷</span>${dtStr}</span>`);
    }

    const p = task.priority || 'low';
    parts.push(`<span class="priority-badge ${p}">${p}</span>`);

    return parts.join('');
  }

  // ── Stats ─────────────────────────────────────
  function updateBadges() {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending   = total - completed;

    badgeAll.textContent       = total;
    badgePending.textContent   = pending;
    badgeCompleted.textContent = completed;
  }

  function updateStats() {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pct       = total ? Math.round((completed / total) * 100) : 0;
    const circ      = 201;

    ringFill.style.strokeDashoffset = circ - (circ * pct / 100);
    ringPct.textContent = pct + '%';

    if (!total) {
      statSub.textContent = 'No tasks yet';
    } else {
      statSub.textContent = `${completed} of ${total} done`;
    }
  }

  // ── Toast ─────────────────────────────────────
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ── Helpers ───────────────────────────────────
  function persist() {
    localStorage.setItem('lumina-tasks', JSON.stringify(tasks));
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function shake(el) {
    el.style.animation = 'none';
    el.getBoundingClientRect();
    el.style.animation = 'shakeInput 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }

  // Add shake keyframe dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shakeInput {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ── Boot ─────────────────────────────────────
  init();

})();