// Bubble Sort Content
window.AlgoContentSystem.prototype.addBubbleSortContent = function() {
    this.content.set('bubble-sort', {
        title: 'Bubble Sort',
        definition: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.',
        usage: 'Educational purposes, small datasets, nearly sorted arrays.',
        complexity: {
            time: 'O(n²)',
            space: 'O(1)',
            stable: 'Yes',
            inPlace: 'Yes'
        },
        proscons: {
            pros: ['Simple implementation', 'Stable sorting', 'In-place sorting', 'Adaptive (efficient for nearly sorted)'],
            cons: ['Poor time complexity O(n²)', 'Not suitable for large datasets', 'Many unnecessary comparisons']
        },
        code: {
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
    return arr`,
            cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
            java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
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
}`
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.AlgoContentSystem) {
        const contentSystem = new AlgoContentSystem();
        contentSystem.addBubbleSortContent();
    }
});