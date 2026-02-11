// Algorithm Code Examples in Multiple Languages
const algorithmCode = {
    'bubble-sort': {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(numbers))`,
        javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(numbers));`,
        java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
    
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(numbers);
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(numbers);
    for (int num : numbers) {
        cout << num << " ";
    }
    return 0;
}`
    },
    'selection-sort': {
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
        java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
        cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`
    },
    'insertion-sort': {
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
        javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
        java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    },
    'fcfs': {
        python: `def fcfs_scheduling(processes):
    """First Come First Serve CPU Scheduling"""
    processes.sort(key=lambda x: x['arrival'])
    current_time = 0
    results = []
    
    for process in processes:
        if current_time < process['arrival']:
            current_time = process['arrival']
        
        start_time = current_time
        completion_time = start_time + process['burst']
        turnaround = completion_time - process['arrival']
        waiting = turnaround - process['burst']
        
        results.append({
            'pid': process['id'],
            'start': start_time,
            'completion': completion_time,
            'turnaround': turnaround,
            'waiting': waiting
        })
        
        current_time = completion_time
    
    return results`,
        javascript: `function fcfsScheduling(processes) {
    // Sort by arrival time
    processes.sort((a, b) => a.arrival - b.arrival);
    let currentTime = 0;
    const results = [];
    
    for (const process of processes) {
        if (currentTime < process.arrival) {
            currentTime = process.arrival;
        }
        
        const startTime = currentTime;
        const completionTime = startTime + process.burst;
        const turnaround = completionTime - process.arrival;
        const waiting = turnaround - process.burst;
        
        results.push({
            pid: process.id,
            start: startTime,
            completion: completionTime,
            turnaround: turnaround,
            waiting: waiting
        });
        
        currentTime = completionTime;
    }
    
    return results;
}`,
        java: `public class FCFSScheduling {
    public static List<Result> fcfs(List<Process> processes) {
        processes.sort(Comparator.comparingInt(p -> p.arrival));
        int currentTime = 0;
        List<Result> results = new ArrayList<>();
        
        for (Process process : processes) {
            if (currentTime < process.arrival) {
                currentTime = process.arrival;
            }
            
            int startTime = currentTime;
            int completionTime = startTime + process.burst;
            int turnaround = completionTime - process.arrival;
            int waiting = turnaround - process.burst;
            
            results.add(new Result(
                process.id, startTime, completionTime, 
                turnaround, waiting
            ));
            
            currentTime = completionTime;
        }
        
        return results;
    }
}`,
        cpp: `struct Process {
    int id, arrival, burst;
};

struct Result {
    int pid, start, completion, turnaround, waiting;
};

vector<Result> fcfsScheduling(vector<Process>& processes) {
    sort(processes.begin(), processes.end(), 
         [](const Process& a, const Process& b) {
             return a.arrival < b.arrival;
         });
    
    int currentTime = 0;
    vector<Result> results;
    
    for (const auto& process : processes) {
        if (currentTime < process.arrival) {
            currentTime = process.arrival;
        }
        
        int startTime = currentTime;
        int completionTime = startTime + process.burst;
        int turnaround = completionTime - process.arrival;
        int waiting = turnaround - process.burst;
        
        results.push_back({
            process.id, startTime, completionTime,
            turnaround, waiting
        });
        
        currentTime = completionTime;
    }
    
    return results;
}`
    }
};

// Export for use in visualizers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = algorithmCode;
}
