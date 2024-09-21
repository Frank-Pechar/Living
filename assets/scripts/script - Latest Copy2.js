'use strict';

// STATE DATA ARRAY
let projectObject = {
  projectId: 0,
  projectName: '',
  projectDescription: '',
  projectDueDate: '',
  tasksArray: [],
};
let projectsArray = [];
let selectedId = null;

// DOM ELEMENT CONSTANTS
const projectList = document.querySelector('.proj-list');
const addProjectBtn = document.querySelector('.proj-list__btn-add-proj');
const projListMsgNoneCreated = document.querySelector(
  '.proj-list__msg-none-created'
);

const projectDetailSection = document.querySelector('.proj-detail__section');
const projectDetailData = document.querySelector('.proj-detail__data');
const projectDelete = document.querySelector('.proj-detail__btn-delete-proj');
const projectMsgNoneSelected = document.querySelector(
  '.proj-detail__msg-none-selected'
);

const projectInputFormSection = document.querySelector('.proj-input__section');
const projectInputForm = document.querySelector('.proj-input__form');

const tasksSection = document.querySelector(
  '.tasks-display-and-input__section'
);
const taskList = document.querySelector('.task-list');
const taskInputForm = document.querySelector('.task-input__form');
const taskInputName = document.querySelector('.task-input__name');
const taskInputBtn = document.querySelector('.task-input__btn-submit-add');
const taskListMsgNoneCreated = document.querySelector(
  '.task-list__msg-none-created'
);

// INITIALIZE DISPLAY
projectInputFormSection.style.display = 'none';
projectDetailData.style.display = 'none';
tasksSection.style.display = 'none';

// EVENT LISTENERS
addProjectBtn.addEventListener('click', startAddProjectHandler);
projectInputForm.addEventListener('submit', addProjectHandler);
projectDelete.addEventListener('click', deleteProjectHandler);
taskInputForm.addEventListener('submit', addTaskHandler);

loadProjects();
displayProjects();

// START OF FUNCTIONS *******************

// DISPLAY PROJECTS LIST
function displayProjects() {
  projectList.innerHTML = '';

  loadProjects();
  const projects = projectsArray;

  projects.forEach((project) => {
    projListMsgNoneCreated.style.display = 'none';
    const projectItem = document.createElement('li');
    const projectNameBtn = document.createElement('button');
    projectNameBtn.textContent = project.projectName;
    projectNameBtn.addEventListener('click', displayProjectHandler);
    projectNameBtn.dataset.id = project.projectId;
    projectNameBtn.classList.add('proj-list__btn-display-detail');
    projectList.appendChild(projectItem);
    projectItem.appendChild(projectNameBtn);
  });
}

// START ADD PROJECT HANDLER
function startAddProjectHandler() {
  projectInputFormSection.style.display = 'block';
  projectDetailSection.style.display = 'none';
  tasksSection.style.display = 'none';
  taskList.innerHTML = '';
  projectInputForm.reset();
}

// ADD PROJECT HANDLER
function addProjectHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObject = Object.fromEntries(formData.entries());
  const { projectName, projectDescription, projectDueDate } = formObject;

  if (projectName === '') {
    alert('Please enter a project name');
    return;
  }
  if (projectDescription === '') {
    alert('Please enter a project description');
    return;
  }
  if (projectDueDate === '') {
    alert('Please enter a due date');
    return;
  }

  projectObject = {
    projectId: Math.random(),
    projectName,
    projectDescription,
    projectDueDate,
    tasksArray: [],
  };

  projectsArray.push(projectObject);
  writeProjects();
  selectedId = projectObject.projectId;
  console.log(projectsArray);
  projectInputForm.reset();
  displayProject();
  displayProjects();
}

// DELETE PROJECT HANDLER
function deleteProjectHandler(e) {
  const projectId = selectedId;
  projectsArray = projectsArray.filter(
    (project) => project.projectId != projectId
  );
  writeProjects();
  displayProjects();
  projectDetailData.style.display = 'none';
  projectDetailSection.style.display = 'block';
  tasksSection.style.display = 'none';
  projectMsgNoneSelected.style.display = 'block';
}

// DISPLAY PROJECT CONTROLLER HANDLER
function displayProjectHandler(e) {
  const project = projectsArray.find(
    (project) => project.projectId == e.target.dataset.id
  );
  if (project) {
    projectObject = project;
    displayProject();
  }
}

// DISPLAY PROJECT
function displayProject() {
  projectInputFormSection.style.display = 'none';
  projectMsgNoneSelected.style.display = 'none';
  projectDetailData.style.display = 'block';
  projectDetailSection.style.display = 'block';
  tasksSection.style.display = 'block';
  taskList.innerHTML = '';
  taskInputForm.reset();
  taskListMsgNoneCreated.style.display = 'block';

  document.querySelector('.proj-detail__name').textContent =
    projectObject.projectName;
  document.querySelector('.proj-detail__description').textContent =
    projectObject.projectDescription;
  document.querySelector('.proj-detail__due-date').textContent =
    projectObject.projectDueDate;
  selectedId = projectObject.projectId;
  projectObject.tasksArray.length > 0 && displayTasks(selectedId);
}

// DISPLAY TASKS
function displayTasks(selectedId) {
  tasksSection.style.display = 'block';
  taskList.innerHTML = '';
  if (projectObject.tasksArray.length > 0)
    taskListMsgNoneCreated.style.display = 'none';

  projectObject.tasksArray.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-list__item');
    const taskName = document.createElement('span');
    taskName.textContent = task.taskName;
    taskName.classList.add('task-list__task-name');
    const taskDeleteBtn = document.createElement('button');
    taskDeleteBtn.textContent = 'Clear';
    taskDeleteBtn.classList.add('task-list__btn-delete');
    taskDeleteBtn.addEventListener(
      'click',
      deleteTaskHandler.bind(task.taskId)
    );
    taskItem.appendChild(taskName);
    taskItem.appendChild(taskDeleteBtn);
    taskList.appendChild(taskItem);
  });
}

// ADD TASK HANDLER
function addTaskHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObject = Object.fromEntries(formData.entries());
  const { taskName } = formObject;

  if (taskName === '') {
    alert('Please enter a task name');
    return;
  }
  const newTask = {
    projectId: selectedId,
    taskId: Math.random(),
    taskName,
  };

  projectObject = projectsArray.find(
    (project) => project.projectId === selectedId
  );
  projectObject.tasksArray.push(newTask);
  writeProjects();
  taskInputForm.reset();
  displayTasks(selectedId);
}

function deleteTaskHandler() {
  projectObject.tasksArray = projectObject.tasksArray.filter(
    (t) => t.taskId !== this
  );
  displayTasks(selectedId);
}

function loadProjects() {
  const storage = localStorage.getItem('projects');
  // if there are projects then copy to state projects array
  if (storage) projectsArray = JSON.parse(storage);
}

function writeProjects() {
  clearProjects();
  localStorage.setItem('projects', JSON.stringify(projectsArray));
}

// Clears local storage from within app
function clearProjects() {
  localStorage.clear('projects');
}

// END OF FUNCTIONS *******************
