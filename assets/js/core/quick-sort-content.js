// Quick Sort Content
window.AlgoContentSystem.prototype.addQuickSortContent = function() {
    this.content.set('quick-sort', {
        title: 'Quick Sort',
        definition: 'Divide-and-conquer algorithm that picks a pivot element and partitions array around it, then recursively sorts subarrays.',
        usage: 'General purpose sorting, in-place sorting needed, average case performance important.',
        complexity: {
            time: 'O(n log n) avg, O(n²) worst',
            space: 'O(log n)',
            stable: 'No',
            inPlace: 'Yes'
        },
        proscons: {
            pros: ['Fast average case', 'In-place sorting', 'Cache efficient', 'Widely used in practice'],
            cons: ['Unstable sort', 'O(n²) worst case', 'Poor performance on sorted arrays', 'Recursive overhead']
        },
        code: {
            python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
            cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
            java: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.AlgoContentSystem) {
        const contentSystem = new AlgoContentSystem();
        contentSystem.addQuickSortContent();
    }
});