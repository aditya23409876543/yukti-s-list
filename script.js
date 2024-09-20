/// Variables to store notes by date
const notesByDate = {};

// Load tasks and notes from localStorage on page load
window.onload = function() {
    loadTasks();
    loadNotes();
};

// Show the dashboard and hide the landing page
function enterDashboard() {
    document.querySelector('.landing-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
}

// Show the task modal
function addTask() {
    document.getElementById('task-modal').style.display = 'flex';
}

// Close the task modal
function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// Save a new task
function saveTask() {
    const taskName = document.getElementById('task-name').value;
    const taskDetails = document.getElementById('task-details').value;

    if (taskName && taskDetails) {
        const task = { name: taskName, details: taskDetails, completed: false };
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        
        // Clear the modal inputs and close it
        document.getElementById('task-name').value = '';
        document.getElementById('task-details').value = '';
        closeModal();
    } else {
        alert('Please fill out both fields.');
    }
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    renderTasks(tasks);
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Render tasks
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.className = 'task-checkbox';
        taskCheckbox.checked = task.completed;
        taskCheckbox.onclick = function() {
            toggleTaskCompleted(this);
        };

        const taskLabel = document.createElement('label');

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.name;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.details;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteTask(this);
        };

        taskLabel.appendChild(taskTitle);
        taskLabel.appendChild(taskDescription);

        taskCard.appendChild(taskCheckbox);
        taskCard.appendChild(taskLabel);
        taskCard.appendChild(deleteButton);

        taskList.appendChild(taskCard);
    });
}

// Toggle task completion
function toggleTaskCompleted(checkbox) {
    const taskCard = checkbox.closest('.task-card');
    const tasks = getTasks();
    const taskIndex = Array.from(taskCard.parentNode.children).indexOf(taskCard);
    tasks[taskIndex].completed = checkbox.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if (checkbox.checked) {
        taskCard.classList.add('completed');
    } else {
        taskCard.classList.remove('completed');
    }
}

// Delete a task
function deleteTask(deleteButton) {
    const taskCard = deleteButton.closest('.task-card');
    const tasks = getTasks();
    const taskIndex = Array.from(taskCard.parentNode.children).indexOf(taskCard);
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskCard.remove();
}

// Delete all tasks
function deleteAllTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clears all tasks
    localStorage.removeItem('tasks'); // Clear tasks from localStorage
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Show the tasks section and hide the notes section
function showTasksSection() {
    document.getElementById('tasks-section').style.display = 'block';
    document.getElementById('notes-section').style.display = 'none';
}

// Show the notes section and hide the tasks section
function showNotesSection() {
    document.getElementById('tasks-section').style.display = 'none';
    document.getElementById('notes-section').style.display = 'block';
}

// Show the note modal
function addNote() {
    document.getElementById('note-modal').style.display = 'flex';
}

// Close the note modal
function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
}

// Save a new note
function saveNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteDate = document.getElementById('note-date').value;
    const noteContent = document.getElementById('note-content').value;

    if (noteTitle && noteDate && noteContent) {
        const noteKey = `${noteDate}-${noteTitle}`; // Unique key combining date and title
        notesByDate[noteKey] = { title: noteTitle, content: noteContent };

        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        const noteHeader = document.createElement('div');
        noteHeader.className = 'note-header';

        const noteDateTitle = document.createElement('h3');
        noteDateTitle.textContent = `${noteDate} - ${noteTitle}`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteNote(this);
        };

        noteHeader.appendChild(noteDateTitle);
        noteHeader.appendChild(deleteButton);

        const noteDescription = document.createElement('p');
        noteDescription.textContent = noteContent;

        noteCard.appendChild(noteHeader);
        noteCard.appendChild(noteDescription);

        document.getElementById('notes-list').appendChild(noteCard);

        // Clear the modal inputs and close it
        document.getElementById('note-title').value = '';
        document.getElementById('note-date').value = '';
        document.getElementById('note-content').value = '';
        closeNoteModal();
    } else {
        alert('Please provide title, date, and note content.');
    }
}

// Load notes from localStorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    for (const key in notes) {
        const note = notes[key];
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        const noteHeader = document.createElement('div');
        noteHeader.className = 'note-header';

        const noteDateTitle = document.createElement('h3');
        noteDateTitle.textContent = key;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteNote(this);
        };

        noteHeader.appendChild(noteDateTitle);
        noteHeader.appendChild(deleteButton);

        const noteDescription = document.createElement('p');
        noteDescription.textContent = note.content;

        noteCard.appendChild(noteHeader);
        noteCard.appendChild(noteDescription);

        document.getElementById('notes-list').appendChild(noteCard);
    }
}

// Save notes to localStorage
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notesByDate));
}

// Delete a note
function deleteNote(deleteButton) {
    const noteCard = deleteButton.closest('.note-card');
    const noteDateTitle = noteCard.querySelector('.note-header h3').textContent;
    delete notesByDate[noteDateTitle];
    saveNotesToLocalStorage(); // Update localStorage
    noteCard.remove();
}
