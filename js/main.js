const addTaskBtn = document.getElementById('addTaskBtn')
const addTaskSection = document.getElementById('addTaskSection')
const todayTasksSection = document.getElementById('todayTasksSection')
const completedTasksSection = document.getElementById('completedTasksSection')
const formCancelBtn = document.getElementById('formCancelBtn')
const hamburgerMenu = document.getElementById('hamburgerMenu')
const navContainer = document.getElementById('navContainer')
const taskList = document.getElementById('taskList')
const completedTaskList = document.getElementById('completedTaskList')
const dateSpan = document.getElementById('dateSpan')
const completedTasksPopup = document.getElementById('completedTasksPopup')
const menuCounter = document.getElementById('menuCounter')
const todoDeleteButton = document.getElementById('todoDeleteButton')
const mainSection = document.getElementById('mainSection')


function getTodosFromLocalStorage() {
    try {
       return JSON.parse(localStorage.getItem('todoData')) ?? []
    } catch {
       return [] 
    }
}

const deserializedTodoData = getTodosFromLocalStorage()

renderTodos(deserializedTodoData)

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const todoInputValue = todoInput.value
    const deserializedTodoData = getTodosFromLocalStorage()

    deserializedTodoData.unshift({
      content: todoInputValue,
      todoType: displayRadioValue(),
      isCompleted: false,
      date: new Date(),
      id: Date.now()
    })

    const serializedTodoData = JSON.stringify(deserializedTodoData)
    localStorage.setItem('todoData', serializedTodoData)

    renderTodos(deserializedTodoData);
  
    todoInput.value = ""
})

function formatDate() {
    let date = new Date()
    
    let formattedDate = date.toString().split(' ').filter((x,id) => id < 3 ).join(' ')

    return formattedDate
}

dateSpan.innerHTML = formatDate()

function getTotalTodoNumber() {
    let todoFromLocalStorage = getTodosFromLocalStorage()
    if (todoFromLocalStorage.length > 0) {
        return todoFromLocalStorage.length
    } else {
        return 0
    }
}

function getCompletedTodoNumber() {
    let todoFromLocalStorage = getTodosFromLocalStorage()
    if (todoFromLocalStorage.filter((x) => x.isCompleted).length > 0) {
       return todoFromLocalStorage.filter((x) => x.isCompleted).length 
    } else {
       return 0 
    }  
}

function computeMenuCounter() {
    return menuCounter.innerHTML = `${getCompletedTodoNumber()}/${getTotalTodoNumber()}`
}

function displayRadioValue() {
    let radioInput = document.getElementsByName('todoType');
    let radioValue = ''

    for (i = 0; i < radioInput.length; i++) {
        if (radioInput[i].checked) {
            radioValue = radioInput[i].value
        }
    }

    return radioValue
}

function renderTodoCard(todo) {
    const secondClass = `${todo.todoType.toLowerCase()}-task-container`

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.classList.add(`${secondClass}`)

    const todoDeleteButtonTypeClass = `${todo.todoType.toLowerCase()}-delete-button`
    
    taskContainer.innerHTML = `
        <div class="text-container">
            <div class="round">
                <label for="checkbox" onClick="markCompleted(${todo.id})">
                 <input 
                    type="checkbox" 
                    class="rounded-checkbox"
                    id="checkbox" ${todo.isCompleted ? 'checked' : ''}/>
                </label>
            </div>
            <p>${todo.content}</p>
        </div>

        <div class="task-type-container">
            <p>${todo.todoType}</p>
            <i class="fa-solid fa-trash-can todo-delete-button ${todoDeleteButtonTypeClass}" id="todoDeleteButton" 
            onClick="deleteTodo(${todo.id})" ></i>
        </div>
    `;

    return taskContainer;
}

function renderDefaultMessage() {
    const defaultTodoContainer = document.createElement("div")
    defaultTodoContainer.classList.add('default-todo-container')

    defaultTodoContainer.innerHTML = `
        <i class="fa-solid fa-clipboard-list fa-2xl" style="color: #CA5646;"></i>
        <h4>There are no Tasks to preview. Please click the icon below to add a new Task.</h4>
    `;

    return defaultTodoContainer;
}
  
function renderTodos(todos) {
    computeMenuCounter()
    if(!todos.length) {
        taskList.appendChild(renderDefaultMessage())
        completedTaskList.appendChild(renderDefaultMessage())
    }
    else {
        taskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        todos.forEach((todo) => {
            if(!todo.isCompleted) {
            taskList.appendChild(renderTodoCard(todo)); 
            }
            else {
                completedTaskList.appendChild(renderTodoCard(todo))
            }
        });
    }
}

addTaskBtn.addEventListener('click', () => {
    addTaskSection.classList.add('active')
    todayTasksSection.classList.add('blur')
    completedTasksSection.classList.add('blur')
})

formCancelBtn.addEventListener('click', () => {
    addTaskSection.classList.remove('active')
    todayTasksSection.classList.remove('blur')
    completedTasksSection.classList.remove('blur')
})

hamburgerMenu.addEventListener('click', () => {
    navContainer.classList.toggle('active')
    mainSection.classList.toggle('add-padding-to-main-when-hamburger-is-active')
})

function markCompleted(todoItem){
    const todoFromLocalStorage = getTodosFromLocalStorage()
    todoFromLocalStorage.map((x) => x.id === todoItem ? x.isCompleted = true : '')
    localStorage.setItem('todoData', JSON.stringify(todoFromLocalStorage))

    setTimeout(() => {
        location.reload()
      }, "500");
    
    completedTasksPopup.classList.add('active')
}

function deleteTodo(todoItem) {
    const todoFromLocalStorage = getTodosFromLocalStorage()
    const filteredTodo = todoFromLocalStorage.filter((x) => x.id !== todoItem)
    localStorage.setItem('todoData', JSON.stringify(filteredTodo))

    setTimeout(() => {
        location.reload()
      }, "200");
}