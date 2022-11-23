import { getCommonDb as _getCommonDb,log  } from './mermaidUtils';

let currentSection = '';
let currentTaskId = 0;

const sections = [];
const tasks = [];
const rawTasks = [];

export const getCommonDb = _getCommonDb;

export const clear = function () {
  sections.length = 0;
  tasks.length = 0;
  currentSection = '';
  rawTasks.length = 0;
  _getCommonDb().clear();
};

export const addSection = function (txt) {
  currentSection = txt;
  sections.push(txt);
};

export const getSections = function () {
  return sections;
};

export const getTasks = function () {
  let allItemsProcessed = compileTasks();
  const maxDepth = 100;
  let iterationCount = 0;
  while (!allItemsProcessed && iterationCount < maxDepth) {
    allItemsProcessed = compileTasks();
    iterationCount++;
  }

  tasks.push(...rawTasks);

  return tasks;
};

export const addTask = function (period, length, event) {

  const rawTask = {
    id: currentTaskId++,
    section: currentSection,
    type: currentSection,
    task: period,
    score : length?length:0,
    //if event is defined, then add it the events array
    events: event?[event]:[],
  };
  rawTasks.push(rawTask);
};

export const addEvent = function (event) {
 // fetch current task with currnetTaskId
  const currentTask = rawTasks.find((task) => task.id === currentTaskId - 1);
  //add event to the events array
  currentTask.events.push(event);
};


export const addTaskOrg = function (descr) {
  const newTask = {
    section: currentSection,
    type: currentSection,
    description: descr,
    task: descr,
    classes: [],
  };
  tasks.push(newTask);
};

const compileTasks = function () {
  const compileTask = function (pos) {
    return rawTasks[pos].processed;
  };

  let allProcessed = true;
  for (let i = 0; i < rawTasks.length; i++) {
    compileTask(i);

    allProcessed = allProcessed && rawTasks[i].processed;
  }
  return allProcessed;
};

export default {
  clear,
  getCommonDb,
  addSection,
  getSections,
  getTasks,
  addTask,
  addTaskOrg,
  addEvent,
};

