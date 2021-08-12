const taskContainer = document.querySelector(".task__container");
let globalTaskData = [];

const generateHTML = (taskData) => {
  return ` <div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card">
  <div class="card-header gap-2 d-flex justify-content-end">
    <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)" >
      <i class="fal fa-pencil" name=${taskData.id}></i>
    </button>
    <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
      <i class="far fa-trash-alt" name=${taskData.id}></i>
    </button>
  </div>
  <div class="card-body">
    <img
      src=${taskData.image}
      alt="image"
      class="card-img"
      style="height:170px;"
    />
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">
      ${taskData.description}
    </p>
    <span class="badge bg-primary">${taskData.type}</span>
  </div>
  <div class="card-footer">
    <button class="btn btn-outline-primary"name=${taskData.id} data-bs-toggle="modal" data-bs-target="#showtask" onclick="generateHTMLmodal.apply(this, arguments)">Open Task</button>
  </div>
</div>
</div>`;
};

const saveToLocalStorage = () =>
  localStorage.setItem("taskyCA", JSON.stringify({ card: globalTaskData }));

const insertToDOM = (content) =>
  taskContainer.insertAdjacentHTML("beforeend", content);

const addNewCard = () => {
  // get task data
  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  globalTaskData.push(taskData);

  saveToLocalStorage();

  const newCard = generateHTML(taskData);

  insertToDOM(newCard);

  // clear the form
  document.getElementById("taskTitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};
const generateHTMLmodal = (event) => {
  const targetID = event.target.getAttribute("name");
  let taskimage;
  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  parentElement = event.target.parentNode.parentNode;
  taskimage = parentElement.childNodes[3].childNodes[1].src;
  taskTitle = parentElement.childNodes[3].childNodes[3].innerHTML;
  taskDescription = parentElement.childNodes[3].childNodes[5].innerHTML;
  taskType = parentElement.childNodes[3].childNodes[7].innerHTML;

  globalTaskData.filter((task) => {
    if (task.id === targetID) {
      document.querySelector(".show-modal").innerHTML = ` <div>
<img src="${taskimage}" alt="This is an image"style="width:100%;">
</div>
<h5 class="card-title mt-4">${taskTitle}</h5>
<p class="card-text">${taskDescription}</p>
<span class="badge bg-primary">${taskType}</span> `;
    }
  });

};

const loadExistingCards = () => {
  // check localstorage
  const getData = localStorage.getItem("taskyCA");

  // parse JSON data, if exist
  if (!getData) return;

  const taskCards = JSON.parse(getData);

  globalTaskData = taskCards.card;

  globalTaskData.map((taskData) => {
    const newCard = generateHTML(taskData);
    insertToDOM(newCard);
  });

  return;
};

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTask = globalTaskData.filter((task) => task.id !== targetID);
  globalTaskData = removeTask;

  saveToLocalStorage();

  // access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editCard = (event) => {
  const elementType = event.target.tagName;
  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }
  
  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
  submitButton.removeAttribute("data-bs-toggle");
};

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  console.log({ updatedData, targetID });

  const updateGlobalTasks = globalTaskData.map((task) => {
    if (task.id === targetID) {
      console.log({ ...task, ...updatedData });
      return { ...task, ...updatedData };
    }
    return task;
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open Task";
  submitButton.setAttribute("data-bs-toggle","modal");
};

// Strigify
// JS object -> JSON

// Parse
// JSON -> JS objects

// contenteditable = "true"
const tasksearch = () => {
  // get task data
  searchtext = document.getElementById("searchtext").value.toLowerCase();
  console.log(searchtext);
  if (searchtext == "") {
    taskContainer.innerHTML = "";
    loadExistingCards();
  }
  else {
    const searchTask = globalTaskData.filter((task) => task.title.toLowerCase() === searchtext);
    if (searchTask){
    taskContainer.innerHTML = "";
    searchTask.map((taskData) => {
      const newCard = generateHTML(taskData);
      insertToDOM(newCard);
    });
  }else{
    loadExistingCards();
  }
  }
};