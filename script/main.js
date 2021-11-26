const currentTasks = document.getElementById("currentTasks");
const completedTasks = document.getElementById("completedTasks");
const modalForm = document.getElementById("add-task");
const dropdownMenuItem1 = document.getElementById("dropdownMenuItem1");
const inputTitle = document.getElementById("inputTitle");
const inputText = document.getElementById("inputText");
const createTaskButton = document.getElementById('createModal');
const btnSuccess = document.querySelector(".btn-success");
const up = document.querySelector(".up");
const down = document.querySelector(".down");
const darkTheme = document.querySelector(".darkTheme");
const head = window.document.getElementsByTagName("head")[0];

let editTarget = null;
let editDate = null;

const TASKS = [];

function getColorName(color) {
  switch (color) {
    case '#b75757': return 'Red';
    case '#5d9cec': return 'Blue';
    case '#b24ecf': return 'Purple';
    default: return 'Nothing';
  }
}

class Modal {
  static modalTitleElement = document.querySelector("#exampleModalLabel");
  static sucessButtonElement = document.querySelector(".success-button");

  static openEditModal(date, target) {
    const parent = target.closest(".list-group-item");
    

    const timestamp = Number(parent.getAttribute('data-custom-date'));
    const task = TASKS.find(task => task.date === timestamp);

    const colorName = getColorName(task.color)

    const priorityElement = modalForm.querySelector(`#${task.priorityValue}`);
    const colorElement = modalForm.querySelector(`#${colorName}`);
    priorityElement.setAttribute('checked', 'checked');
    colorElement.setAttribute('checked', 'checked');
  
    inputTitle.value = task.inputTitle;
    inputText.value = task.inputText;

    this.modalTitleElement.textContent = "Edit task";
    this.sucessButtonElement.textContent = "Edit task";
  
    editTarget = parent;
    editDate = date;
  }

  static openCreateModal() {
    this.modalTitleElement.textContent = "Add task";
    this.sucessButtonElement.textContent = "Add task";

    editTarget = null;
  }

  static close() {
    $("#exampleModal").modal("hide");
  }

  static getFormData() {
    const formData = Object.fromEntries(new FormData(modalForm).entries());
    // console.log(formData)
    let taskDate = this.getNewDate();

    formData.date = taskDate;
    formData.complete = false;

    return formData;
  }

  
  static getNewDate() {
    let now = new Date();
    return now.getTime();
  }

  static setPriority() {

  }
}

function add({ inputTitle, inputText, priorityValue, date, complete,color}) {
  let li = document.createElement("li");
  li.className = "list-group-item d-flex w-100 mb-2";
  li.setAttribute('data-custom-date', `${date}`);
  let dropdown = document.createElement("div");
  dropdown.className = "dropdown m-2 dropleft";
  let div = document.createElement("div");
  div.className = "dropdown-menu p-2 flex-column";
  div.setAttribute("aria-labelledby", "dropdownMenuItem1");
  let btnComplete = document.createElement("button");
  btnComplete.className = "btn btn-success w-100";
  let btnEdit = document.createElement("button");
  btnEdit.className = "btn btn-info w-100 my-2";
  let btnDelete = document.createElement("button");
  btnDelete.className = "btn btn-danger w-100";

  if (!complete) {
    btnComplete.append("Complete");
    div.append(btnComplete);
    btnEdit.append("Edit");

    btnEdit.setAttribute('data-toggle', 'modal')
    btnEdit.setAttribute('data-target', '#exampleModal')

    div.append(btnEdit);
  }

  btnDelete.append("deleteTask");
  div.append(btnDelete);

  li.innerHTML = `
        <div class="w-100 mr-2">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${inputTitle}</h5>
                <div>
                    <small class="mr-2">${priorityValue} priority</small>
                    <small class = "taskDate">${convertDate(date)}</small>
                </div>

            </div>
            <p class="mb-1 w-100">${inputText}</p>
        </div>
        <div class="dropdown m-2 dropleft">
           
            <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
                <button type="button" class="btn btn-success w-100">Complete</button>
                <button type="button" class="btn btn-info w-100 my-2">Edit</button>
                <button type="button" class="btn btn-danger w-100">deleteTask</button>
            </div>
        </div>
    `;

  dropdown.innerHTML = `
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v"></i>
        </button>
    `;

  dropdown.append(div);
  li.append(dropdown);

  if (complete) {
    li.style.backgroundColor = "rgba(40,167,69,0.8)";
    completedTasks.prepend(li);
  } else {
    li.style.backgroundColor = color;
    currentTasks.prepend(li);
  }

  btnComplete.addEventListener("click", (event) => {
    const target = event.target;
    completeTask(date, target);
  });

  btnEdit.addEventListener("click", (event) => {
    const target = event.target;
    Modal.openEditModal(date, target)
  });

  btnDelete.addEventListener("click", (event) => {
    const target = event.target;
    deleteTask(date, target);
  });
}

function deleteTask(timestamp, target) {
  let parent = target.closest(".list-group-item");

  for (let key in TASKS) {
    if (TASKS[key].date == timestamp) {
      TASKS.splice(key, 1);
    }
  }

  saved();
  counterTask();
  parent.remove();
}

function completeTask(timestamp, target) {
  let parent = target.closest(".list-group-item");

  parent.remove();

  for (let key in TASKS) {
    if (TASKS[key].date == timestamp) {
      TASKS[key].complete = true;
      add(TASKS[key]);
    }
  }

  saved();
  counterTask();
}

function edit({ inputTitle, inputText, priorityValue, color }, target, editDate) {
  let title = target.querySelector("h5");
  let text = target.querySelector("p");
  let priority = target.querySelector("small");

  target.style.backgroundColor = color;
  target.setAttribute('data-custom-date', `${editDate}`);
  target.setAttribute('data-custom-priority', `${priorityValue}`);
  title.textContent = inputTitle;
  text.textContent = inputText;
  priority.textContent = priorityValue + " priority";

  for (let key in TASKS) {
    if (TASKS[key].date == editDate) {
      TASKS[key].inputTitle = inputTitle;
      TASKS[key].inputText = inputText;
      TASKS[key].priorityValue = priorityValue;
      TASKS[key].color = color;
    }
  }

  saved();
}

function saved() {
  let serialObj = JSON.stringify(TASKS);
  localStorage.setItem("tasks", serialObj);
}

function counterTask() {
  let counter = 0;
  let all = 0;
  let returnObj = JSON.parse(localStorage.getItem("tasks"));
  let complete = document.querySelector(".completTasks");
  let noComplete = document.querySelector(".tasks");

  for (let task of returnObj) {
    if (task.complete == true) {
      counter++;
    }
    all++;
  }

  complete.textContent = `Comleted (${counter})`;
  noComplete.textContent = `ToDo (${all - counter})`;
}

function convertDate(timestamp) {
  let date = new Date(timestamp).toLocaleDateString();
  let time = new Date(timestamp).toLocaleTimeString().slice(0, -3);

  return time + " " + date;
}

function sortTAsks(i) {
  TASKS.sort(function (a, b) {
    return new Date(i * a.date) - new Date(i * b.date);
  });
  saved();
}

function changeTheme() {
  let darkTheme = document.querySelector("#darkTheme");
  if (darkTheme) {
    darkTheme.remove();
  } else {
    let style = document.createElement("link");
    style.href = "style/style.css";
    style.id = "darkTheme";
    style.rel = "stylesheet";
    head.append(style);
  }
}

function init() {
  let returnObj = JSON.parse(localStorage.getItem("tasks"));
  counterTask();

  createTaskButton.addEventListener("click", () => {
    Modal.openCreateModal();
  })

  for (let i of returnObj) {
    TASKS.push(i);
    add(i);
  }
}

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = Modal.getFormData();

  if (!editTarget) {
    add(formData);
    TASKS.push(formData);
  } else {
    edit(formData, editTarget, editDate);
  }

  modalForm.reset();
  saved();
  counterTask();

  Modal.close();
});

up.addEventListener("click", () => {
  let i = -1;
  sortTAsks(i);
  location.reload();
});

down.addEventListener("click", () => {
  let i = 1;
  sortTAsks(i);
  location.reload();
});

darkTheme.addEventListener("click", () => {
  changeTheme();
});

window.addEventListener('DOMContentLoaded', () => {
  init();
})
