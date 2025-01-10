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
  const rows = text.split("\n").slice(1);
  const tasks = rows.map((row) => {
    const [task, enter_time, time_needed] = row.split(",");
    const color = getRandomColor();
    return [task.trim(), +enter_time.trim(), +time_needed.trim(), color];
  });
  return tasks;
}

function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

async function processFile() {
  const input = document.getElementById("fileInput");
  if (input.files.length === 0) {
    alert("Please upload a CSV file");
    return;
  }

  const file = input.files[0];
  const tasks = await readCsvFile(file);
  drawFCFS(tasks);
  drawHRRN(tasks);
  drawSPN(tasks);
  drawRR(tasks);
  drawSRTF(tasks);
}

function drawFCFS(tasks) {
  tasks.sort((a, b) => a[1] - b[1]); // Sort tasks based on enter time
  const barsContainer = document.getElementById("barsContainerFCFS");
  barsContainer.innerHTML = "";

  let time = 0;
  let totalWaitTime = 0;

  tasks.forEach((task) => {
    const [taskName, enterTime, timeNeeded, color] = task;

    // Calculate wait time
    const waitTime = Math.max(0, time - enterTime);
    totalWaitTime += waitTime;

    // Set start and end times
    const startTime = Math.max(time, enterTime);
    const endTime = startTime + timeNeeded;

    // Create bar for the task
    const barDiv = document.createElement("div");
    barDiv.className = "bar";
    barDiv.style.backgroundColor = color;
    barDiv.style.width = timeNeeded * 50 + "px";

    barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

    barsContainer.appendChild(barDiv);
    time = endTime; // Update current time
  });

  const averageWaitTime = (totalWaitTime / tasks.length).toFixed(2);
  document.getElementById(
    "averageWaitTimeFCFS"
  ).innerText = `Average Wait Time: ${averageWaitTime} time units`;
}

function drawHRRN(tasks) {
  // Sort the tasks based on their enter time
  tasks.sort((a, b) => a[1] - b[1]);

  const barsContainer = document.getElementById("barsContainerHRRN");
  barsContainer.innerHTML = ""; // Clear previous content

  let time = 0;
  let totalWaitTime = 0;
  let completedTasks = 0;

  while (tasks.length > 0) {
    // Filter tasks that have entered the system (i.e., arrived)
    const availableTasks = tasks.filter((task) => task[1] <= time);

    if (availableTasks.length === 0) {
      // If no tasks are available, jump to the time of the next task
      time = tasks[0][1]; // Move time to the next task's enter time
      continue;
    }

    // Calculate the response ratio for each available task
    availableTasks.forEach((task) => {
      const [taskName, enterTime, timeNeeded] = task;
      const waitTime = time - enterTime;
      task.responseRatio = (waitTime + timeNeeded) / timeNeeded; // Calculate HRRN
    });

    // Sort tasks by their response ratio (highest first)
    availableTasks.sort((a, b) => b.responseRatio - a.responseRatio);

    const currentTask = availableTasks[0]; // The task to run next
    const [taskName, enterTime, timeNeeded, color] = currentTask;

    // Calculate wait time for this task
    const waitTime = time - enterTime;
    totalWaitTime += waitTime;

    // Set start and end times
    const startTime = time; // Starts as current time
    const endTime = startTime + timeNeeded;

    // Create bar for the task
    const barDiv = document.createElement("div");
    barDiv.className = "bar";
    barDiv.style.backgroundColor = color;
    barDiv.style.width = timeNeeded * 50 + "px"; // Scale width

    barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

    barsContainer.appendChild(barDiv);

    // Update time and remove task from the list
    time = endTime;
    tasks = tasks.filter((task) => task !== currentTask);
    completedTasks++; // Increment the count of completed tasks
  }

  // Calculate average wait time only if there are completed tasks
  const averageWaitTime =
    completedTasks > 0 ? (totalWaitTime / completedTasks).toFixed(2) : 0;
  document.getElementById(
    "averageWaitTimeHRRN"
  ).innerText = `Average Wait Time: ${averageWaitTime} time units`;
}

function drawSPN(tasks) {
  // Sort the tasks based on their enter time and then by time needed
  tasks.sort((a, b) => {
    if (a[1] === b[1]) {
      return a[2] - b[2]; // Sort by time needed if enter times are the same
    }
    return a[1] - b[1]; // Sort by enter time
  });

  const barsContainer = document.getElementById("barsContainerSPN");
  barsContainer.innerHTML = "";

  let time = 0;
  let totalWaitTime = 0;
  let completedTasks = 0; // Initialize completed tasks counter

  while (tasks.length > 0) {
    // Filter tasks that have entered the system (i.e., arrived)
    const availableTasks = tasks.filter((task) => task[1] <= time);

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
    const barDiv = document.createElement("div");
    barDiv.className = "bar";
    barDiv.style.backgroundColor = color;
    barDiv.style.width = timeNeeded * 50 + "px"; // Scale width

    barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

    barsContainer.appendChild(barDiv);

    // Update time and remove task from the list
    time = endTime;
    tasks = tasks.filter((task) => task !== currentTask);
    completedTasks++; // Increment the count of completed tasks
  }

  // Calculate average wait time only if there are completed tasks
  const averageWaitTime =
    completedTasks > 0 ? (totalWaitTime / completedTasks).toFixed(2) : 0;
  document.getElementById(
    "averageWaitTimeSPN"
  ).innerText = `Average Wait Time: ${averageWaitTime} time units`;
}

function drawSRTF(tasks) {
  // Sort the tasks based on enter time
  tasks.sort((a, b) => a[1] - b[1]);
  tasks.forEach((task) => task.push(task[2]));

  const barsContainer = document.getElementById("barsContainerSRTF");
  barsContainer.innerHTML = ""; // Clear previous content

  let time = 0;
  let totalWaitTime = 0;
  let completedTasks = 0;
  let readyQueue = [];
  let taskInProgress = null;
  let remainingTime = 0;
  let taskStartTime = 0; // Tracks the start time of tasks
  let task_name_next = null;

  // Continue until all tasks are completed
  while (tasks.length > 0 || readyQueue.length > 0 || taskInProgress !== null) {
    // Add tasks that have arrived to the ready queue
    while (tasks.length > 0 && tasks[0][1] <= time) {
      readyQueue.push(tasks.shift());
    }

    // If there's a task in progress, check if it should be preempted
    if (taskInProgress !== null) {
      // Sort readyQueue by remaining time of tasks (Shortest remaining time first)
      readyQueue.sort((a, b) => a[2] - b[2]);

      // Check if any task in the readyQueue has shorter remaining time than the current task
      for (let i = 0; i < readyQueue.length; i++) {
        if (readyQueue[i][2] < remainingTime) {
          // Preempt the current task and add it back to the queue
          readyQueue.push(taskInProgress);
          taskInProgress = readyQueue[i];
          remainingTime = taskInProgress[2];
          readyQueue.splice(i, 1);
          break;
        }
      }
    }

    // If no task is in progress, pick the task with the shortest remaining time
    if (taskInProgress === null && readyQueue.length > 0) {
      readyQueue.sort((a, b) => a[2] - b[2]); // Sort by remaining time
      taskInProgress = readyQueue.shift(); // Select the task with the shortest remaining time
      remainingTime = taskInProgress[2];
      taskStartTime = time; // Track the start time of the current task
    }

    if (taskInProgress !== null) {
      const [taskName, enterTime, timeNeeded, color, temp_remaining] = taskInProgress;
      if (task_name_next !== null) {
        if(task_name_next == taskName){}else{
          task_name_next = taskName
          const waitTime = time - enterTime - (temp_remaining - timeNeeded);
          totalWaitTime += waitTime;
    
          //console.log(totalWaitTime,waitTime,time,enterTime, timeNeeded, taskName);
        }

      }else{
        task_name_next = taskName
          const waitTime = time - enterTime - (temp_remaining - timeNeeded);
          totalWaitTime += waitTime;
    
          //console.log(totalWaitTime,waitTime,time,enterTime, timeNeeded, taskName);
      }
      
      

      // Create a bar for each unit of task execution
      const barDiv = document.createElement("div");
      barDiv.className = "bar";
      barDiv.style.backgroundColor = color;
      barDiv.style.width = "50px"; // Width for each time unit

      barDiv.innerHTML = `
                <div class="start-time">${time}</div>
                <div class="task-name">${taskName}</div>
                <div class="end-time">${time + 1}</div>
            `;
      barsContainer.appendChild(barDiv);

      remainingTime -= 1;
      taskInProgress[2] -= 1; // Decrease remaining time for the current task
      if (remainingTime === 0) {
        taskInProgress = null; // Task is completed
        completedTasks++; // Increment completed task count
      }
    }

    time++; // Increment time
  }

  // Calculate the average wait time
  const averageWaitTime = (totalWaitTime / completedTasks).toFixed(2);
  document.getElementById(
    "averageWaitTimeSRTF"
  ).innerText = `Average Wait Time: ${averageWaitTime} time units`;
}

function drawRR(tasks) {
  const quantum = 1; // Quantum time for RR scheduling
  tasks.sort((a, b) => a[1] - b[1]); // Sort tasks based on enter time

  const barsContainer = document.getElementById("barsContainerRR");
  barsContainer.innerHTML = ""; // Clear previous content

  let time = 0;
  let totalWaitTime = 0;
  let completedTasks = 0;
  let queue = []; // Ready queue
  let remainingTasks = [...tasks]; // Copy the task list to track remaining tasks
  let waitTimes = new Map(); // Track the wait times for each task

  while (remainingTasks.length > 0 || queue.length > 0) {
    // Add tasks that have entered the system (i.e., arrived) to the queue
    while (remainingTasks.length > 0 && remainingTasks[0][1] <= time) {
      queue.unshift(remainingTasks.shift());
    }

    if (queue.length === 0) {
      // If no tasks are in the queue, jump to the next task's enter time
      time = remainingTasks[0][1];
      continue;
    }

    // Dequeue the next task to execute
    const [taskName, enterTime, timeNeeded, color, realTimeNeeded] = queue.shift();
    const initialTimeNeeded = realTimeNeeded; // Save the original time needed for later calculation

    // Calculate wait time for this task (it has been waiting since it entered the queue)
    //const waitTime = time - enterTime;
    console.log(taskName, timeNeeded, realTimeNeeded)
    //totalWaitTime += waitTime;
    //waitTimes.set(taskName, (waitTimes.get(taskName) || 0) + waitTime);

    // Set the start and end times for this task's quantum
    const startTime = time;
    const actualQuantum = Math.min(timeNeeded, quantum);
    const endTime = startTime + actualQuantum;

    // Create a bar for this task's execution in the Gantt chart
    const barDiv = document.createElement("div");
    barDiv.className = "bar";
    barDiv.style.backgroundColor = color;
    barDiv.style.width = actualQuantum * 50 + "px"; // Scale width based on time units

    barDiv.innerHTML = `
            <div class="start-time">${startTime}</div>
            <div class="task-name">${taskName}</div>
            <div class="end-time">${endTime}</div>
        `;

    barsContainer.appendChild(barDiv);

    // Update time and check if this task is complete
    time = endTime;
    if (timeNeeded == actualQuantum){
      if (realTimeNeeded == null){
        totalWaitTime += (endTime-timeNeeded-enterTime);
      }else{
      totalWaitTime += (endTime-realTimeNeeded-enterTime);}
    }

    // If the task isn't finished, push it back into the queue with its remaining time
    if (timeNeeded > actualQuantum) {
      if(realTimeNeeded == null){
        queue.push([taskName, enterTime, timeNeeded - actualQuantum, color, timeNeeded]);
      }else{
      queue.push([taskName, enterTime, timeNeeded - actualQuantum, color, realTimeNeeded]);} // Task goes back with reduced time
    } else {
      completedTasks++;
    }
  }

  // Calculate the average wait time
  const averageWaitTime = (totalWaitTime / tasks.length).toFixed(2);
  document.getElementById(
    "averageWaitTimeRR"
  ).innerText = `Average Wait Time: ${averageWaitTime} time units`;
}
