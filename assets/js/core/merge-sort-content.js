// Merge Sort Content
window.AlgoContentSystem.prototype.addMergeSortContent = function() {
    this.content.set('merge-sort', {
        title: 'Merge Sort',
        definition: 'Divide-and-conquer algorithm that divides array into halves, sorts them separately, then merges sorted halves.',
        usage: 'Large datasets, stable sorting required, external sorting, linked lists.',
        complexity: {
            time: 'O(n log n)',
            space: 'O(n)',
            stable: 'Yes',
            inPlace: 'No'
        },
        proscons: {
            pros: ['Guaranteed O(n log n)', 'Stable sorting', 'Predictable performance', 'Good for large datasets'],
            cons: ['O(n) extra space', 'Not in-place', 'Slower for small arrays', 'More complex than simple sorts']
        },
        code: {
            python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
            cpp: `void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j])
            temp[k++] = arr[i++];
        else
            temp[k++] = arr[j++];
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left; i <= right; i++)
        arr[i] = temp[i - left];
}`,
            java: `public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

private void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j])
            temp[k++] = arr[i++];
        else
            temp[k++] = arr[j++];
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    System.arraycopy(temp, 0, arr, left, temp.length);
}`
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.AlgoContentSystem) {
        const contentSystem = new AlgoContentSystem();
        contentSystem.addMergeSortContent();
    }
});