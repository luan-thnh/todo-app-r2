const TODO_LIST = JSON.parse(localStorage.getItem('todo_list'));
const todos = TODO_LIST || [];

let todoIndex = -1;
let isEditing = false;
let toggleStatus = false;

const handleShowModalMore = () => {
  const modalMore = document.querySelector('.todo__header-modal');

  const btnMore = document.querySelector('.todo__header-btn--more');
  const btnCloseModal = document.querySelector('.todo__modal-btn-close');

  btnMore.onclick = () => modalMore.classList.remove('d-none');
  btnCloseModal.onclick = () => modalMore.classList.add('d-none');
};

handleShowModalMore();

const handleShowBtnDelete = () => {
  const btnShowDeleteTasks = document.querySelectorAll('.todo__task-btn--times');
  const btnActionDeletes = document.querySelectorAll('.todo__task-item--delete');
  const btnCloseDeletes = document.querySelectorAll('.todo__task-btn--close');

  btnShowDeleteTasks.forEach((btnShowDeleteTask, index) => {
    btnShowDeleteTask.onclick = (e) => {
      e.stopPropagation();
      btnActionDeletes[index].classList.remove('d-none');
    };
  });

  btnCloseDeletes.forEach((btnCloseDelete, index) => {
    btnCloseDelete.onclick = (e) => {
      e.stopPropagation();
      btnActionDeletes[index].classList.add('d-none');
    };
  });
};

const handleSaveLocal = (todoList) => {
  localStorage.setItem('todo_list', JSON.stringify(todoList));
  renderTodos();
};

const handleAddTodo = () => {
  const todoCreateInput = document.querySelector('.todo__create-input');
  const todoValue = todoCreateInput.value.trim();

  if (!todoValue) return;

  todos.push({ title: todoValue.toString(), status: false });
  todoCreateInput.value = '';

  handleSaveLocal(todos);
};

const btnAddTodo = document.querySelector('.todo__create-btn');
btnAddTodo.onclick = handleAddTodo;

const handleDeleteTodo = (e, index) => {
  e.stopPropagation();

  todos.splice(index, 1);

  handleSaveLocal(todos);
};

const handleToggleCompleteTodo = (index) => {
  todos[index].status = !todos[index].status;

  handleSaveLocal(todos);
};

const handleClickEditTodo = (index) => {
  if (isEditing && todoIndex === index) return;

  todoIndex = index;
  isEditing = true;

  renderTodos();
};

const handleChangeEditTodo = (e) => {
  todos[todoIndex].title = e.target.value;
};

const handleEditSaveTodo = (e) => {
  e.stopPropagation();

  isEditing = false;
  todoIndex = -1;

  handleSaveLocal(todos);
};

const handleFilterStatusTodo = () => {
  toggleStatus = !toggleStatus;

  renderTodos();
};

const btnFilterStatus = document.querySelector('.todo__model-btn-toggle');
btnFilterStatus.onclick = handleFilterStatusTodo;

const renderTodos = () => {
  const taskList = document.querySelector('.todo__task-list');

  let html = todos
    .filter(({ status }) => (toggleStatus ? status === false : true))
    .map(
      ({ title, status }, index) => `
        <li class="todo__task-item d-flex">
          <label class="todo__task-label d-flex justify-content-center align-items-center" onclick="handleToggleCompleteTodo(${index})">
            <input type="checkbox" name="checkbox" id="checkbox" class="todo__task-checkbox" ${
              status ? 'checked' : ''
            }/>
          </label>
          <div
            class="todo__task-container d-flex justify-content-between w-100 position-relative"
            onclick="handleClickEditTodo( ${index})"
            title="Click to edit"
          >
            <div class="todo__task-content flex-grow-1 h-100 d-flex align-items-center">
              ${
                todoIndex === index
                  ? `
                  <div class="todo__task-edit w-100 d-flex">
                    <input type="text" value="${title}" class="todo__task-edit-input w-100" onchange="handleChangeEditTodo(event)"/>
                    <button class="todo__task-edit-btn" onclick="handleEditSaveTodo(event)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
                        <path fill="#009afe" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z" />
                      </svg>
                    </button>
                  </div>
                `
                  : `<p class="todo__task-text fw-semibold ${status ? 'done' : ''}">${title}</p>`
              }
            </div>
            <div class="todo__task-btn d-flex">
              <div class="todo__task-item--delete d-flex align-items-center d-none">
                <button class="todo__task-btn--delete" onclick="handleDeleteTodo(event,${index})">delete?</button>
                <button class="todo__task-btn--close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <button class="todo__task-btn--times">
                <i class="fa-regular fa-circle-xmark"></i>
              </button>
            </div>
          </div>
        </li>
  `
    )
    .join('');

  taskList.innerHTML = html;

  handleShowBtnDelete();
};

renderTodos();
