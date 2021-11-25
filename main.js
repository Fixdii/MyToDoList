const currentTasks = document.querySelector("#currentTasks");
const completedTasks = document.querySelector("#completedTasks");
const addTask = document.querySelector("#add-task");
const dropdownMenuItem1 = document.querySelector("#dropdownMenuItem1");
const inputTitle = document.querySelector("#inputTitle");
const inputText = document.querySelector("#inputText");
const exampleModalLabel = document.querySelector("#exampleModalLabel");
const eddTask = document.querySelector(".add-task");
const btnSuccess = document.querySelector(".btn-success");

let isEdit = false;
let editTarget = null;

const TASKS = [];

addTask.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());
  let taskDate = date.getDate();

  exampleModalLabel.textContent = "Add task";
  eddTask.textContent = "Add task";

  formData.date = taskDate;
  formData.complete = false;

  if (!isEdit) {
    setTask.add(formData);
    TASKS.push(formData);
  } else {
    setTask.edit(formData, editTarget);
  }

  addTask.reset();
  setTask.saved();

  $("#exampleModal").modal("hide");
});

const setTask = {
  add({ inputTitle, inputText, gridRadios, date, complete }) {
    let li = document.createElement("li");
    li.className = "list-group-item d-flex w-100 mb-2";
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
      div.append(btnEdit);
    }

    btnDelete.append("Delete");
    div.append(btnDelete);

    li.innerHTML = `
        <div class="w-100 mr-2">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${inputTitle}</h5>
                <div>
                    <small class="mr-2">${gridRadios} priority</small>
                    <small class = "taskDate">${date}</small>
                </div>

            </div>
            <p class="mb-1 w-100">${inputText}</p>
        </div>
        <div class="dropdown m-2 dropleft">
           
            <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
                <button type="button" class="btn btn-success w-100">Complete</button>
                <button type="button" class="btn btn-info w-100 my-2">Edit</button>
                <button type="button" class="btn btn-danger w-100">Delete</button>
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
      completedTasks.append(li);
    } else {
      currentTasks.append(li);
    }

    btnComplete.addEventListener("click", (event) => {
      const target = event.target;
      this.complete(target);
    });

    btnEdit.addEventListener("click", (event) => {
      const target = event.target;
      this.createEditModal(target);
    });

    btnDelete.addEventListener("click", (event) => {
      const target = event.target;
      this.delete(target);
    });
  },
  delete(target) {
    let parent = target.closest(".list-group-item");
    let title = parent.querySelector("h5");
    let text = parent.querySelector("p");
    let date = parent.querySelector(".taskDate");

    for (let key in TASKS) {
      if (
        TASKS[key].inputTitle == title.textContent &&
        TASKS[key].inputText == text.textContent &&
        TASKS[key].date == date.textContent
      ) {
        TASKS.splice(key, 1);
      }
    }

    this.counterTask();
    this.saved();
    parent.remove();
  },
  complete(target) {
    let parent = target.closest(".list-group-item");
    let title = parent.querySelector("h5");
    let text = parent.querySelector("p");
    let date = parent.querySelector(".taskDate");

    completedTasks.append(parent);
    parent.style.backgroundColor = "rgba(40,167,69,0.8)";

    for (let key in TASKS) {
      if (
        TASKS[key].inputTitle == title.textContent &&
        TASKS[key].inputText == text.textContent &&
        TASKS[key].date == date.textContent
      ) {
        TASKS[key].complete = true;
      }
    }

    this.counterTask();
    this.saved();
  },
  edit({ inputTitle, inputText, gridRadios }, target) {
    let title = target.querySelector("h5");
    let text = target.querySelector("p");
    let priority = target.querySelector("small");
    let date = target.querySelector(".taskDate");

    title.textContent = inputTitle;
    text.textContent = inputText;
    priority.textContent = gridRadios + " priority";

    for (let key in TASKS) {
      if (TASKS[key].date == date.textContent) {
        TASKS[key].inputTitle = inputTitle;
        TASKS[key].inputText = inputText;
        TASKS[key].gridRadios = gridRadios;
      }
    }

    editTarget = null;
    isEdit = false;

    this.saved();
  },
  createEditModal(target) {
    let parent = target.closest(".list-group-item");
    let title = parent.querySelector("h5");
    let text = parent.querySelector("p");

    inputTitle.value = title.textContent;
    inputText.value = text.textContent;

    exampleModalLabel.textContent = "Edit task";
    eddTask.textContent = "Edit task";

    isEdit = true;
    editTarget = parent;

    $("#exampleModal").modal("show");
  },
  saved() {
    let serialObj = JSON.stringify(TASKS);
    localStorage.setItem("tasks", serialObj);
  },
  counterTask(){
    let counter = 0;
    let all = 0;
    let returnObj = JSON.parse(localStorage.getItem("tasks"));
    let complete = document.querySelector(".completTasks")
    let noComplete = document.querySelector(".tasks")

    for(let task of returnObj){
        console.log();
        if(task.complete == true){
            counter++;
        }
        all++;
    }

    complete.textContent = `Comleted (${counter})`;
    noComplete.textContent = `ToDo (${all-counter})`;
  }
};

const date = {
  getDate() {
    let now = new Date();
    let date = now.toLocaleDateString();
    let time = new Date().toLocaleTimeString().slice(0, -3);

    return time + " " + date;
  },
};

const init = () => {
  let returnObj = JSON.parse(localStorage.getItem("tasks"));
  setTask.counterTask();
  for (let i of returnObj) {
    TASKS.push(i);
    setTask.add(i);
  }
};

init();