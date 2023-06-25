
let userName = "";
if (localStorage.getItem("name") === null || localStorage.getItem("name") === "null") {
  const userName = prompt("Please enter your name:");
  localStorage.setItem("name", userName);
  let userElement = document.querySelector(".user");
  userElement.textContent = userName + "'s ";
} else {
  userName = localStorage.getItem("name");
}

//this code changes the Name in the todo list application if the user presses "Change Name"
document.getElementById("change_name").addEventListener("click", () => {
  userName = prompt("Please enter your name:");
  localStorage.setItem("name", userName);
  if (userName !== null) {
    let userElement = document.querySelector(".user");
    userElement.textContent = userName + "'s ";
  }
});

if (userName !== null || userName != "null") {
  let userElement = document.querySelector(".user");
  userElement.textContent = userName + "'s ";
}

let user = document.getElementsByClassName("user");
user.textContent = userName;

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
    completed = JSON.parse(localStorage.getItem("completed"));
    render_completed_task();
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
      date: "Select a date",
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

    tasks.forEach(task => {
    const completion_btn = document.createElement("button");
    completion_btn.classList.add("completion-button");
    completion_btn.addEventListener("click", () => {
      render_completed_tasks(task);
      toggleCompletion(task.id);
    });

    //for selecting time and due dates
      const date_btn = document.createElement('input');
      date_btn.id = "date-time";
      date_btn.type = 'text';
      date_btn.value = task.date || "";
      date_btn.classList.add('flatpickr-input');
      date_btn.addEventListener("mousedown", () => {
        flatpickr(date_btn, {
          dateFormat: 'Y-m-d',
          onClose: function (selectedDates) {
            const selectedDate = selectedDates[0];
            const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
            task.date = formattedDate;
            saveTasksToLocalStorage();
          }
        });

      });
      
      //content
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
      task_el.appendChild(date_btn);
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

      const date_btn = document.createElement('input');
      date_btn.id = "date-time1";
      date_btn.type = 'text';
      date_btn.value = task.date;
      
    
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
      if (task.date != "Select a date") {
        task_el.appendChild(date_btn);
      }
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
    localStorage.setItem("completed", JSON.stringify(completed));
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
      saveTasksToLocalStorage();
      render_completed_task();
    }
  }
  function update_complete_Task(task) {
    const newTask = prompt("Enter the updated task:", task.content);
    task.content = newTask;
    saveTasksToLocalStorage();
    render_completed_task();
  } 
});
