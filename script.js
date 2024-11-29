function readCsvFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const data = parseCsv(text);
            resolve(data);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

function parseCsv(text) {
    const rows = text.split('\n').slice(1);
    const tasks = rows.map(row => {
        const [task, enter_time, time_needed] = row.split(',');
        const color = getRandomColor();
        return [task.trim(), +enter_time.trim(), +time_needed.trim(), color];
    });
    return tasks;
}

function getRandomColor() {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
}

async function processFile() {
    const input = document.getElementById('fileInput');
    if (input.files.length === 0) {
        alert('Please upload a CSV file');
        return;
    }
    
    const file = input.files[0];
    const tasks = await readCsvFile(file);
    drawFCFS(tasks);
    drawSPN(tasks);
    drawSRTF(tasks);
}

function drawFCFS(tasks) {
    tasks.sort((a, b) => a[1] - b[1]); // Sort tasks based on enter time
    const barsContainer = document.getElementById('barsContainerFCFS');
    barsContainer.innerHTML = '';
    
    let time = 0;
    let totalWaitTime = 0;

    tasks.forEach(task => {
        const [taskName, enterTime, timeNeeded, color] = task;

        // Calculate wait time
        const waitTime = Math.max(0, time - enterTime);
        totalWaitTime += waitTime;

        // Set start and end times
        const startTime = Math.max(time, enterTime);
        const endTime = startTime + timeNeeded;
        
        // Create bar for the task
        const barDiv = document.createElement('div');
        barDiv.className = 'bar';
        barDiv.style.backgroundColor = color;
        barDiv.style.width = (timeNeeded*50) + 'px';

        barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

        barsContainer.appendChild(barDiv);
        time = endTime; // Update current time
    });

    const averageWaitTime = (totalWaitTime / tasks.length).toFixed(2);
    document.getElementById('averageWaitTimeFCFS').innerText = `Average Wait Time: ${averageWaitTime} time units`;
}


function drawSPN(tasks) {
    // Sort the tasks based on their enter time and then by time needed
    tasks.sort((a, b) => {
        if (a[1] === b[1]) {
            return a[2] - b[2]; // Sort by time needed if enter times are the same
        }
        return a[1] - b[1]; // Sort by enter time
    });

    const barsContainer = document.getElementById('barsContainerSPN');
    barsContainer.innerHTML = '';

    let time = 0;
    let totalWaitTime = 0;
    let completedTasks = 0; // Initialize completed tasks counter

    while (tasks.length > 0) {
        // Filter tasks that have entered the system (i.e., arrived)
        const availableTasks = tasks.filter(task => task[1] <= time);
        
        if (availableTasks.length === 0) {
            // If no tasks are available, jump to the time of the next task
            time = tasks[0][1]; // Move time to the next task's enter time
            continue;
        }

        // Sort available tasks by time needed (SPN logic)
        availableTasks.sort((a, b) => a[2] - b[2]);
        const currentTask = availableTasks[0]; // The task to run next

        const [taskName, enterTime, timeNeeded, color] = currentTask;

        // Calculate wait time for this task
        const waitTime = time - enterTime;
        totalWaitTime += waitTime;

        // Set start and end times
        const startTime = time; // Starts as current time
        const endTime = startTime + timeNeeded;

        // Create bar for the task
        const barDiv = document.createElement('div');
        barDiv.className = 'bar';
        barDiv.style.backgroundColor = color;
        barDiv.style.width = (timeNeeded * 50) + 'px'; // Scale width

        barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

        barsContainer.appendChild(barDiv);

        // Update time and remove task from the list
        time = endTime;
        tasks = tasks.filter(task => task !== currentTask);
        completedTasks++; // Increment the count of completed tasks
    }

    // Calculate average wait time only if there are completed tasks
    const averageWaitTime = completedTasks > 0 ? (totalWaitTime / completedTasks).toFixed(2) : 0;
    document.getElementById('averageWaitTimeSPN').innerText = `Average Wait Time: ${averageWaitTime} time units`;
}



function drawSRTF(tasks) {

}