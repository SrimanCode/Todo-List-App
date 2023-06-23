window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");
  let tasks = [];

  // Load tasks from local storage
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = input.value;
    if (!task) {
      alert("Please fill out the task");
      return;
    }

    const newTask = {
      id: Date.now(),
      content: task,
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
    input.value = "";
  });

  function renderTasks() {
    list_el.innerHTML = "";

    // Render each task
    tasks.forEach(task => {
      const task_el = document.createElement("div");
      task_el.classList.add("task");

      const task_content_el = document.createElement("div");
      task_content_el.classList.add("content");
      task_content_el.textContent = task.content;

      const delete_btn = document.createElement("button");
      delete_btn.classList.add("delete-button");
      delete_btn.textContent = "Delete";
      delete_btn.addEventListener("click", () => {
        deleteTask(task.id);
      });

      const update_btn = document.createElement("button");
      update_btn.classList.add("update-button");
      update_btn.textContent = "Update";
      update_btn.addEventListener("click", () => {
        updateTask(task.id);
      });

      task_el.appendChild(task_content_el);
      task_el.appendChild(delete_btn);
      task_el.appendChild(update_btn);
      list_el.appendChild(task_el);
    });
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
  }

  function updateTask(taskId) {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const newTask = prompt("Enter the updated task:", taskToUpdate.content);
    if (newTask) {
      taskToUpdate.content = newTask;
      saveTasksToLocalStorage();
      renderTasks();
    }
  }
});