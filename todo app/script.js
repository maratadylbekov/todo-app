const state = {
  tasks: [],
  filter: 'all',
  sort: {
    date: null,
    priority: null
  }
};

const elements = {
  taskInput: document.getElementById('task-text'),
  taskAdd: document.getElementById('add-task'),
  taskDate: document.getElementById('task-date'),
  tasksList: document.getElementById('tasks-list'),
  clearCompleted: document.getElementById('clear-done'),
  emptyState: document.getElementById('empty-state'),
  todaysDate: document.querySelector('header p'),
  countAll: document.querySelector('.counter-all'),
  countCompleted: document.querySelector('.counter-completed'),
  countActive: document.querySelector('.counter-active'),
  filters: document.querySelectorAll('.filter-btn'),
  sortByDate: document.getElementById('by-date'),
  sortByPriority: document.getElementById('by-priority')
}

const todaysDate = () => {
  elements.todaysDate.textContent = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(' г.', '');
}

const initInputHandlers = () => {
  elements.taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') {
      elements.taskInput.value = '';
      elements.taskInput.blur();
    }
  });
}

const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(state.tasks));

const loadTasks = () => {
  const saved = localStorage.getItem('tasks');

  if (saved) {
    state.tasks.length = 0;
    state.tasks.push(...JSON.parse(saved));
  }
}

const countTasks = () => {
  const all = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const active = state.tasks.filter(t => !t.completed).length;

  elements.countAll.textContent = all;
  elements.countCompleted.textContent = completed;
  elements.countActive.textContent = active;
}

const handleClearCompleted = () => {
  state.tasks = state.tasks.filter(t => !t.completed);
  updateApp();
}

const updateApp = () => {
  saveTasks();
  renderTasks();
}

const toggleEmptyState = (tasks) => {
  if (!tasks.length) {
    if (state.filter === 'done') elements.emptyState.textContent = 'Нет выполненных задач';
    else if (state.filter === 'undone') elements.emptyState.textContent = 'Нет активных задач';
    else elements.emptyState.textContent = 'Нет задач';
    elements.emptyState.classList.remove('hidden');
    elements.tasksList.classList.add('hidden');
  } else {
    elements.emptyState.classList.add('hidden');
    elements.tasksList.classList.remove('hidden');
  }
}

const handleFilter = (btn) => {
  elements.filters.forEach(filterBtn => filterBtn.classList.remove('active'));
  btn.classList.add('active');
  state.filter = btn.dataset.filter;
  renderTasks();
}

const getFilteredTasks = () => {
  switch (state.filter) {
    case 'undone': return state.tasks.filter(t => !t.completed);
    case 'done': return state.tasks.filter(t => t.completed);
    default: return state.tasks;
  }
}

const toggleSort = (type) => {
  if (type === 'date') {
    state.sort.priority = null;

    if (state.sort.date === null) state.sort.date = 'asc';
    else if (state.sort.date === 'asc') state.sort.date = 'desc';
    else state.sort.date = null;
  }

  if (type === 'priority') {
    state.sort.date = null;

    if (state.sort.priority === null) state.sort.priority = 'asc';
    else if (state.sort.priority === 'asc') state.sort.priority = 'desc';
    else state.sort.priority = null;
  }

  renderTasks();
}

const sortTasks = (tasks) => {
  let sorted = [...tasks];

  if (state.sort.date) {
    sorted.sort((a, b) => {
      const hasDateA = a.date && a.date.trim() !== '';
      const hasDateB = b.date && b.date.trim() !== '';

      if (!hasDateA && !hasDateB) return 0;
      if (!hasDateA) return state.sort.date === 'asc' ? 1 : -1;
      if (!hasDateB) return state.sort.date === 'asc' ? -1 : 1;

      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return state.sort.date === 'asc' ? dateA - dateB : dateB - dateA;
    });

  }

  if (state.sort.priority) {
    const priorityWeight = { low: 1, medium: 2, high: 3 };

    sorted.sort((a, b) => {
      const weightA = priorityWeight[a.priority];
      const weightB = priorityWeight[b.priority];

      return state.sort.priority === 'asc' ? weightA - weightB : weightB - weightA;
    });
  }

  return sorted;
}

function renderTask(task) {
  const taskContainer = document.createElement('li');
  taskContainer.classList.add('todo-item');

  const taskCheckbox = document.createElement('input');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.checked = task.completed;

  const taskName = document.createElement('span');
  taskName.classList.add('todo-name');
  taskName.textContent = task.name;

  const date = document.createElement('span');
  date.textContent = task.date || 'Нет даты';
  date.classList.add('todo-date');

  const taskPriority = document.createElement('select');
  taskPriority.options.add(new Option('Низкий', 'low'));
  taskPriority.options.add(new Option('Средний', 'medium'));
  taskPriority.options.add(new Option('Высокий', 'high'));
  taskPriority.value = task.priority;

  taskContainer.classList.add(`priority-${task.priority}`);

  taskPriority.addEventListener('change', () => {
    task.priority = taskPriority.value;
    updateApp();
  });

  const taskDelete = document.createElement('button');
  taskDelete.textContent = 'Удалить';
  taskDelete.classList.add('todo-delete');

  taskName.addEventListener('click', () => {
    const name = task.name;

    if (task.completed) return;

    const input = document.createElement('input');
    input.value = name;
    taskName.replaceWith(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        task.name = input.value.trim() || name;
        updateApp();
      }
      if (e.key === 'Escape') {
        input.value = name;
        input.blur();
      }
    });

    input.addEventListener('blur', () => {
      task.name = input.value.trim() || name;
      updateApp();
    });
  });

  taskCheckbox.addEventListener('change', () => {
    task.completed = taskCheckbox.checked;
    updateApp();
  });

  if (task.completed) {
    taskName.classList.add('completed');
  }

  taskDelete.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== task.id);

    updateApp();
  });

  taskContainer.append(taskCheckbox, taskName, date, taskPriority, taskDelete);
  elements.tasksList.append(taskContainer);
}

function renderTasks() {
  elements.tasksList.innerHTML = '';

  let tasks = getFilteredTasks();
  tasks = sortTasks(tasks);

  tasks.forEach(task => {
    renderTask(task);
  })

  toggleEmptyState(tasks);
  countTasks();
}

function addTask() {
  const taskName = elements.taskInput.value.trim();
  const date = elements.taskDate.value;
  if (!taskName) {
    elements.taskInput.value = '';
    elements.taskInput.focus();
    return;
  }

  const newTask = {
    name: taskName,
    id: Date.now(),
    completed: false,
    priority: 'low',
    date: date
  }

  state.tasks.unshift(newTask);

  elements.taskInput.value = '';
  elements.taskInput.focus();
  elements.taskDate.value = '';
  updateApp();
}

todaysDate();
initInputHandlers();
loadTasks();
renderTasks();

elements.sortByDate.addEventListener('click', () => toggleSort('date'));
elements.sortByPriority.addEventListener('click', () => toggleSort('priority'));
elements.filters.forEach(btn => btn.addEventListener('click', () => handleFilter(btn)));
elements.clearCompleted.addEventListener('click', handleClearCompleted);
elements.taskAdd.addEventListener('click', addTask);