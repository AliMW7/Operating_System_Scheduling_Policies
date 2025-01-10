# Scheduling Visualization Tool

## Overview
The Scheduling Visualization Tool is a web-based application designed to visualize and analyze various CPU scheduling algorithms. By uploading a CSV file containing task details, users can observe how different scheduling strategies handle task execution, visualize Gantt charts for each algorithm, and compare their performance based on average wait times.

---

## Features

### Multiple Scheduling Algorithms
Visualize and compare the following scheduling algorithms:
- **First-Come, First-Served (FCFS)**
- **Highest Response Ratio Next (HRRN)**
- **Shortest Process Next (SPN)**
- **Shortest Remaining Time First (SRTF)**
- **Round Robin (RR)**

### Gantt Chart Visualization
Each scheduling algorithm is represented with a Gantt chart, illustrating the execution timeline of tasks.

### Performance Metrics
Display the average wait time for each scheduling algorithm, allowing users to assess and compare their efficiency.

### Interactive Interface
Upload your own CSV files to test different task scenarios and observe how scheduling algorithms perform.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Usage](#usage)
3. [CSV File Format](#csv-file-format)
4. [Scheduling Algorithms Explained](#scheduling-algorithms-explained)
5. [Code Structure](#code-structure)
6. [Customization](#customization)
7. [Contributing](#contributing)
8. [License](#license)

---

## Getting Started

### Prerequisites
To run the Scheduling Visualization Tool, you need a modern web browser (e.g., Chrome, Firefox, Edge, Safari).

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/scheduling-visualization.git
```

2. **Navigate to the Project Directory**
```bash
cd scheduling-visualization
```

3. **Open the Application**

- Option 1: Double-click the `index.html` file.
- Option 2: Right-click the file and select "Open with" followed by your browser choice.

---

## Usage

### Prepare Your CSV File
Ensure your CSV file adheres to the specified format (see [CSV File Format](#csv-file-format)).

### Upload the CSV File
1. Click on the **"Choose File"** button to select your CSV file.
2. After selecting the file, click the **"Process CSV"** button to start the visualization.

### View the Results
- The application will display Gantt charts for each scheduling algorithm.
- Below each chart, the average wait time for that algorithm is shown.

---

## CSV File Format

Your CSV file should contain the following columns **without headers**:

- **Task Name**: A unique identifier for each task (e.g., Task1, Task2).
- **Arrival Time**: The time at which the task enters the scheduling queue.
- **Execution Time**: The total time required by the task for execution.

### Example
```csv
Task1,0,8
Task2,2,3
Task3,4,2
Task4,5,6
Task5,6,1
Task6,8,4
Task7,9,2
Task8,11,5
Task9,13,1
Task10,15,2
Task11,16,7
```

- **Task1** arrives at time 0 and requires 8 time units.
- **Task2** arrives at time 2 and requires 3 time units.
- And so on.

> **Note:** Ensure there are no headers in your CSV file. The application automatically skips the first line, assuming it to be headers.

---

## Scheduling Algorithms Explained

### 1. First-Come, First-Served (FCFS)
**Description:** Tasks are executed in the order they arrive without preemption.

**Characteristics:**
- Simple and easy to implement.
- Can lead to the "convoy effect," where short tasks wait for a long task to complete.

### 2. Highest Response Ratio Next (HRRN)
**Description:** Selects the task with the highest response ratio.

**Response Ratio:**
\[
\text{Response Ratio} = \frac{\text{Wait Time} + \text{Service Time}}{\text{Service Time}}
\]

**Characteristics:**
- Balances between short and long tasks.
- Reduces the chance of starvation for longer tasks.

### 3. Shortest Process Next (SPN)
**Description:** Selects the task with the shortest execution time.

**Characteristics:**
- Minimizes average wait time.
- Can cause starvation for longer tasks.

### 4. Shortest Remaining Time First (SRTF)
**Description:** Preemptive version of SPN; the task with the shortest remaining time is selected.

**Characteristics:**
- Minimizes average wait time.
- More responsive to short tasks arriving later.
- Higher overhead due to frequent context switching.

### 5. Round Robin (RR)
**Description:** Each task is given a fixed time slice (quantum) in a cyclic order.

**Quantum:** Fixed time interval (e.g., 1 time unit).

**Characteristics:**
- Fair allocation of CPU time.
- Suitable for time-sharing systems.
- Performance depends on the chosen quantum size.

---

## Code Structure

### 1. `index.html`
**Purpose:** Provides the structure of the web application.

**Components:**
- File input for uploading CSV files.
- Buttons to process the uploaded file.
- Sections to display Gantt charts and average wait times for each scheduling algorithm.
- Links to the external CSS (`style.css`) and JavaScript (`script.js`) files.

### 2. `style.css`
**Purpose:** Styles the web application, including layout, colors, and Gantt chart visuals.

**Key Elements:**
- `.bars-container`: Container for the Gantt chart bars.
- `.bar`: Individual bars representing task execution.
- `.start-time`, `.task-name`, `.end-time`: Labels within each bar.

### 3. `script.js`
**Purpose:** Contains all the JavaScript logic for processing the CSV file, executing scheduling algorithms, and rendering the visualizations.

**Key Functions:**

#### File Handling:
- `readCsvFile(file)`: Reads the uploaded CSV file.
- `parseCsv(text)`: Parses the CSV content into task objects.
- `getRandomColor()`: Generates random colors for task visualization.

#### Processing:
- `processFile()`: Orchestrates reading the file and executing all scheduling algorithms.

#### Scheduling Algorithms:
- `drawFCFS(tasks)`: Implements the FCFS algorithm.
- `drawHRRN(tasks)`: Implements the HRRN algorithm.
- `drawSPN(tasks)`: Implements the SPN algorithm.
- `drawSRTF(tasks)`: Implements the SRTF algorithm.
- `drawRR(tasks)`: Implements the RR algorithm.

---

## Customization

### Adjusting the Round Robin Quantum
By default, the Round Robin (RR) algorithm uses a quantum of 1 time unit. To modify this:

1. Open `script.js`.
2. Locate the `drawRR` function.
3. Change the `quantum` variable to your desired value.

```javascript
const quantum = 1; // Change this value as needed
```

### Styling Adjustments
To modify the appearance of the Gantt charts or other UI elements:

1. Open `style.css`.
2. Adjust the styles for classes such as `.bar`, `.bars-container`, `.start-time`, `.task-name`, and `.end-time`.

---

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, feel free to open an issue or submit a pull request.

### Steps to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
```bash
git checkout -b feature/YourFeatureName
```
3. **Commit Your Changes**
```bash
git commit -m "Add Your Feature"
```
4. **Push to the Branch**
```bash
git push origin feature/YourFeatureName
```
5. **Open a Pull Request**

---

## License
This project is licensed under the [MIT License](LICENSE).

Feel free to reach out with any questions or feedback!
