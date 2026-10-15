
/* Lines 1–10: Connect JavaScript to HTML elements */

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskInput");
const taskPriority = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const taskDueDate = document.getElementById("task-due-date");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchTask = document.getElementById("search-task");
const filterPriority = document.getElementById("filter-priority");


/* Lines 13–14: Load previously saved tasks */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* Lines 17–43: Add a new task */

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();
    taskForm.reset();
});


/* Lines 46 onwards: Display, search and filter tasks */

function displayTasks() {
    taskList.innerHTML = "";

    const searchText = searchTask.value.toLowerCase().trim();
    const selectedPriority = filterPriority.value;

    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;

        return matchesSearch && matchesPriority;
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        const taskText = document.createElement("span");

        taskText.textContent =
            task.title + " - " + task.priority + " priority";

        if (task.dueDate) {
            taskText.textContent += " - Due: " + task.dueDate;
        }

        if (task.completed) {
            taskText.classList.add("completed");
        }

        /* Complete or Undo button */

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.type = "button";

        completeButton.addEventListener("click", function () {
            task.completed = !task.completed;

            saveTasks();
            displayTasks();
        });

        /* Delete button */

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        /* Add elements to the webpage */

        li.appendChild(taskText);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    /* Update task counters */

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = tasks.filter(function (task) {
        return task.completed;
    }).length;

    pendingTasks.textContent = tasks.filter(function (task) {
        return !task.completed;
    }).length;
}


/* Save tasks in browser storage */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* Display saved tasks when the page opens */

displayTasks();


/* Search and priority filter events */

searchTask.addEventListener("input", displayTasks);

filterPriority.addEventListener("change", displayTasks);
