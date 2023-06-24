
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");
  const completedSection = document.getElementById("completedSection");
  let tasks = [];
  let completed = [];
  
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(task => {
      task.completed = task.completed || false;
    });
    renderTasks();
  }
  if (localStorage.getItem("completed")) {
    completed = JSON.parse(localStorage.getItem("complted"))
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
      completed: false,
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
    input.value = "";
  });

  function renderTasks() {
    list_el.innerHTML = "";

    if (tasks.length === 0 && completed.length === 0) {
      const heading = document.createElement("h3");
      heading.id = "message";
      heading.textContent = "Oopsie-daisy! Looks like your task list is as empty as a black hole in outer space! ******** Get ready to conquer the world one task at a time! Let's do this! *********"
      heading.classList.add("centered-heading");
      list_el.appendChild(heading);

    } else if (tasks.length === 0 && completed.length !== 0) {
      const heading = document.createElement("h3");
      heading.id = "message";
      heading.textContent = "Yay! Good Job. You completed all you task."
      list_el.appendChild(heading);
    }
    // Render each task
    tasks.forEach(task => {
    const completion_btn = document.createElement("button");
    completion_btn.classList.add("completion-button");
    completion_btn.addEventListener("click", () => {
      render_completed_tasks(task);
      toggleCompletion(task.id);
    });
      const task_el = document.createElement("div");
      task_el.classList.add("task");
      const task_content_el = document.createElement("div");
      task_content_el.classList.add("content");
      task_content_el.textContent = task.content;

      if (task.completed) {
        task_el.classList.add("completed");
      }
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
      task_el.appendChild(completion_btn);
      task_el.appendChild(task_content_el);
      task_el.appendChild(delete_btn);
      task_el.appendChild(update_btn);
      list_el.appendChild(task_el);
    });
  }
  function render_completed_tasks(task) {
    completedSection.innerHTML = "";
    completed.push(task);
    console.log(completed);
    render_completed_task(task);
  }

  function render_completed_task() {
    completedSection.innerHTML = "";
    if (completed.length > 0) {
      const completedHeading = document.createElement("h2");
      completedHeading.id = "name";
      completedHeading.textContent = "Completed";
      completedSection.appendChild(completedHeading);
    }
    completed.forEach(task => {
      const completion_btn = document.createElement("button");
      completion_btn.classList.add("completion-button-1");
      completion_btn.addEventListener("click", () => {
        task.completed = false;
        tasks.push(task);
        delete_complete_Task(task);
        saveTasksToLocalStorage();
        renderTasks();
        render_completed_task();
      });
      const task_el = document.createElement("div");
      task_el.classList.add("task_complete");
      const task_content_el = document.createElement("div");
      task_content_el.classList.add("content_complete");
      task_content_el.textContent = task.content;

      const delete_btn = document.createElement("button");
      delete_btn.classList.add("delete-button_1");
      delete_btn.textContent = "Delete";
      delete_btn.addEventListener("click", () => {
        delete_complete_Task(task);
      });
      const update_btn = document.createElement("button");
      update_btn.classList.add("update-button_1");
      update_btn.textContent = "Update";
      update_btn.addEventListener("click", () => {
        update_complete_Task(task);
      });
      task_el.appendChild(completion_btn);
      task_el.appendChild(task_content_el);
      task_el.appendChild(delete_btn);
      task_el.appendChild(update_btn);
      completedSection.appendChild(task_el)
    })
  }
  
  function toggleCompletion(taskId) {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    taskToUpdate.completed = !taskToUpdate.completed;
    
    if (taskToUpdate.completed) {
      tasks = tasks.filter(task => task.id !== taskId); // Remove the task from the tasks array
    } else {
      completed = completed.filter(task => task.id !== taskId);
      tasks.push(taskToUpdate);
    }
    saveTasksToLocalStorage();
    renderTasks();
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
  function delete_complete_Task(task) {
    const taskIndex = completed.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      completed.splice(taskIndex, 1);
      render_completed_task();
    }
  }
  function update_complete_Task(task) {
    const newTask = prompt("Enter the updated task:", task.content);
    task.content = newTask;
    render_completed_task();
  } 
});
