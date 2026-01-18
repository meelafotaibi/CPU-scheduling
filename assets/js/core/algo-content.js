/**
 * algo-content.js
 * Comprehensive Content Database for AlgoVisual Hub
 * Contains Descriptions, Pros/Cons, and Multi-language Code Implementations.
 */
const AlgoContent = {
    // --- SORTING ---
    "bubble": {
        description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        pros: ["Simple logic", "No extra space", "Stable sort"],
        cons: ["O(n²) Complexity", "Slow for large data"],
        code: {
            python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]`,
            java: `void bubbleSort(int arr[]) {\n    int n = arr.length;\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;\n            }\n}`,
            cpp: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);\n}`,
            c: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;\n            }\n}`
        }
    },
    "selection": {
        description: "Selection Sort repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
        pros: ["Simple implementation", "In-place", "Performs well on small lists"],
        cons: ["O(n²) Complexity", "Unstable"],
        code: {
            python: `def selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i+1, len(arr)):\n            if arr[j] < arr[min_idx]: min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
            java: `void selectionSort(int arr[]) {\n    for (int i = 0; i < arr.length-1; i++) {\n        int min = i;\n        for (int j = i+1; j < arr.length; j++)\n            if (arr[j] < arr[min]) min = j;\n        int temp = arr[min]; arr[min] = arr[i]; arr[i] = temp;\n    }\n}`,
            cpp: `// Standard Selection Sort logic`,
            c: `// Standard Selection Sort loop`
        }
    },
    "insertion": {
        description: "Insertion Sort builds the final sorted array one item at a time.",
        pros: ["Efficient for small sets", "Stable", "Adaptive O(n)"],
        cons: ["O(n²) worst case", "Many writes"],
        code: {
            python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i-1\n        while j >= 0 and key < arr[j]:\n            arr[j+1] = arr[j]\n            j -= 1\n        arr[j+1] = key`,
            java: `void insertionSort(int arr[]) {\n    for (int i=1; i<n; ++i) {\n        int key = arr[i]; int j = i-1;\n        while (j>=0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }\n        arr[j+1] = key;\n    }\n}`,
            cpp: `// Standard Insertion Sort logic`,
            c: `// Standard Insertion Sort logic`
        }
    },
    "merge": {
        description: "Merge Sort is a Divide and Conquer algorithm that sorts halves recursively.",
        pros: ["Stable", "O(n log n) guaranteed", "Parallelizable"],
        cons: ["Space O(n)", "Recursive overhead"],
        code: {
            python: `def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr)//2\n        L = arr[:mid]; R = arr[mid:]\n        merge_sort(L); merge_sort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] < R[j]: arr[k] = L[i]; i+=1\n            else: arr[k] = R[j]; j+=1\n            k+=1\n        while i < len(L): arr[k] = L[i]; i+=1; k+=1\n        while j < len(R): arr[k] = R[j]; j+=1; k+=1`,
            java: `void merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1; int n2 = r - m;\n    int L[] = new int[n1]; int R[] = new int[n2];\n    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}`,
            cpp: `void merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1; int n2 = r - m;\n    int L[n1], R[n2];\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}`,
            c: `void merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1; int n2 = r - m;\n    int L[n1], R[n2];\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}`
        }
    },
    "quick": {
        description: "QuickSort partitions array around a pivot.",
        pros: ["Fast O(n log n)", "In-place", "Cache friendly"],
        cons: ["Unstable", "Worst case O(n²)"],
        code: {
            python: `def quick_sort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi-1)\n        quick_sort(arr, pi+1, high)`,
            java: `int partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low-1);\n    for (int j=low; j<high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;\n        }\n    }\n    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;\n    return i+1;\n}`,
            cpp: `int partition (int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low - 1);\n    for (int j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(&arr[i], &arr[j]);\n        }\n    }\n    swap(&arr[i + 1], &arr[high]);\n    return (i + 1);\n}`,
            c: `int partition (int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low - 1);\n    for (int j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int t=arr[i]; arr[i]=arr[j]; arr[j]=t;\n        }\n    }\n    int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;\n    return (i + 1);\n}`
        }
    },
    "advanced-sorting": {
        description: "Radix Sort and Bucket Sort are non-comparative sorting algorithms.",
        pros: ["Linear time O(nk)", "Stable (Radix)"],
        cons: ["Space complexity", "Specific data types only"],
        code: {
            python: `def countingSort(arr, exp1):\n    n = len(arr)\n    output = [0] * n\n    count = [0] * 10\n    for i in range(0, n): count[(arr[i] // exp1) % 10] += 1\n    for i in range(1, 10): count[i] += count[i - 1]\n    for i in range(n - 1, -1, -1):\n        output[count[(arr[i] // exp1) % 10] - 1] = arr[i]\n        count[(arr[i] // exp1) % 10] -= 1\n    for i in range(0, n): arr[i] = output[i]`,
            java: `void countSort(int arr[], int n, int exp) {\n    int output[] = new int[n];\n    int count[] = new int[10];\n    Arrays.fill(count,0);\n    for (int i=0; i<n; i++) count[ (arr[i]/exp)%10 ]++;\n    for (int i=1; i<10; i++) count[i] += count[i-1];\n    for (int i=n-1; i>=0; i--) {\n        output[count[ (arr[i]/exp)%10 ] - 1] = arr[i];\n        count[ (arr[i]/exp)%10 ]--;\n    }\n    for (int i=0; i<n; i++) arr[i] = output[i];\n}`,
            cpp: `void countSort(int arr[], int n, int exp) {\n    int output[n];\n    int count[10] = {0};\n    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;\n    for (int i = 1; i < 10; i++) count[i] += count[i - 1];\n    for (int i = n - 1; i >= 0; i--) {\n        output[count[(arr[i] / exp) % 10] - 1] = arr[i];\n        count[(arr[i] / exp) % 10]--;\n    }\n    for (int i = 0; i < n; i++) arr[i] = output[i];\n}`,
            c: `void countSort(int arr[], int n, int exp) {\n    int output[n];\n    int count[10] = {0};\n    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;\n    for (int i = 1; i < 10; i++) count[i] += count[i - 1];\n    for (int i = n - 1; i >= 0; i--) {\n        output[count[(arr[i] / exp) % 10] - 1] = arr[i];\n        count[(arr[i] / exp) % 10]--;\n    }\n    for (int i = 0; i < n; i++) arr[i] = output[i];\n}`
        }
    },
    "heap": {
        description: "Heap Sort uses a binary heap to sort elements.",
        pros: ["O(n log n)", "In-place"],
        cons: ["Unstable", "Not adaptive"],
        code: {
            python: `def heapify(arr, n, i):\n    largest = i\n    l = 2 * i + 1; r = 2 * i + 2\n    if l < n and arr[i] < arr[l]: largest = l\n    if r < n and arr[largest] < arr[r]: largest = r\n    if largest != i:\n        arr[i],arr[largest] = arr[largest],arr[i]\n        heapify(arr, n, largest)`,
            java: `void heapify(int arr[], int n, int i) {\n    int largest = i;\n    int l = 2*i + 1; int r = 2*i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;\n        heapify(arr, n, largest);\n    }\n}`,
            cpp: `void heapify(int arr[], int n, int i) {\n    int largest = i;\n    int l = 2 * i + 1; int r = 2 * i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        swap(arr[i], arr[largest]);\n        heapify(arr, n, largest);\n    }\n}`,
            c: `void heapify(int arr[], int n, int i) {\n    int largest = i;\n    int l = 2 * i + 1; int r = 2 * i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;\n        heapify(arr, n, largest);\n    }\n}`
        }
    },

    // --- DATA STRUCTURES ---
    "stack-queue": {
        description: "Stack follows LIFO (Last In First Out). Queue follows FIFO (First In First Out).",
        pros: ["Fast operations O(1)", "Simple memory model"],
        cons: ["Fixed size (Static)", "Limited access"],
        code: {
            python: `stack = []\nstack.append(1) # Push\nval = stack.pop() # Pop\n\nqueue = []\nqueue.append(1) # Enqueue\nval = queue.pop(0) # Dequeue`,
            java: `Stack<Integer> stack = new Stack<>();\nstack.push(1);\n\nQueue<Integer> q = new LinkedList<>();\nq.add(1);`,
            cpp: `std::stack<int> s;\ns.push(1);\n\nstd::queue<int> q;\nq.push(1);`,
            c: `// Stack\ntypedef struct { int items[100]; int top; } Stack;\nvoid push(Stack* s, int v) { s->items[++s->top] = v; }\nint pop(Stack* s) { return s->items[s->top--]; }\n// Queue\ntypedef struct { int items[100]; int front, rear; } Queue;\nvoid enqueue(Queue* q, int v) { q->items[++q->rear] = v; }\nint dequeue(Queue* q) { return q->items[++q->front]; }`
        }
    },
    "linked-list": {
        description: "A Singly Linked List is a linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers.",
        pros: ["Dynamic size", "Ease of insertion/deletion"],
        cons: ["Random access not allowed", "Extra memory for pointers"],
        code: {
            python: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def insert_at(self, index, data):\n        new_node = Node(data)\n        if index == 0:\n            new_node.next = self.head\n            self.head = new_node\n            return\n        curr = self.head\n        for _ in range(index - 1):\n            if curr is None: return\n            curr = curr.next\n        new_node.next = curr.next\n        curr.next = new_node\n\n    def reverse(self):\n        prev = None\n        curr = self.head\n        while curr:\n            next_n = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_n\n        self.head = prev`,
            java: `class LinkedList {\n    Node head;\n    static class Node {\n        int data;\n        Node next;\n        Node(int d) { data = d; next = null; }\n    }\n\n    void insertAt(int index, int data) {\n        Node newNode = new Node(data);\n        if (index == 0) {\n            newNode.next = head;\n            head = newNode;\n            return;\n        }\n        Node curr = head;\n        for (int i = 0; i < index - 1; i++) {\n            if (curr == null) return;\n            curr = curr.next;\n        }\n        newNode.next = curr.next;\n        curr.next = newNode;\n    }\n\n    void reverse() {\n        Node prev = null;\n        Node current = head;\n        Node next = null;\n        while (current != null) {\n            next = current.next;\n            current.next = prev;\n            prev = current;\n            current = next;\n        }\n        head = prev;\n    }\n}`,
            cpp: `struct Node {\n    int data;\n    struct Node* next;\n};\n\nvoid insertAt(Node** head_ref, int index, int new_data) {\n    Node* new_node = new Node();\n    new_node->data = new_data;\n    if (index == 0) {\n        new_node->next = *head_ref;\n        *head_ref = new_node;\n        return;\n    }\n    Node* curr = *head_ref;\n    for (int i = 0; i < index - 1 && curr != NULL; i++)\n        curr = curr->next;\n    if (curr == NULL) return;\n    new_node->next = curr->next;\n    curr->next = new_node;\n}\n\nvoid reverse(Node** head_ref) {\n    Node* prev = NULL;\n    Node* current = *head_ref;\n    Node* next = NULL;\n    while (current != NULL) {\n        next = current->next;\n        current->next = prev;\n        prev = current;\n        current = next;\n    }\n    *head_ref = prev;\n}`,
            c: `struct Node {\n    int data;\n    struct Node* next;\n};\n\nvoid insertAt(struct Node** head_ref, int index, int new_data) {\n    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));\n    new_node->data = new_data;\n    if (index == 0) {\n        new_node->next = *head_ref;\n        *head_ref = new_node;\n        return;\n    }\n    struct Node* curr = *head_ref;\n    for (int i = 0; i < index - 1 && curr != NULL; i++)\n        curr = curr->next;\n    if (curr == NULL) return;\n    new_node->next = curr->next;\n    curr->next = new_node;\n}\n\nvoid reverse(struct Node** head_ref) {\n    struct Node* prev = NULL;\n    struct Node* current = *head_ref;\n    struct Node* next = NULL;\n    while (current != NULL) {\n        next = current->next;\n        current->next = prev;\n        prev = current;\n        current = next;\n    }\n    *head_ref = prev;\n}`
        }
    },
    "bst": {
        description: "Binary Search Tree is a node-based binary tree data structure which has the following properties.",
        pros: ["Sorted traversal", "Efficient search O(log n)"],
        cons: ["Unbalanced worst case O(n)", "Complexity"],
        code: {
            python: `def insert(root, key):\n    if root is None: return Node(key)\n    if key < root.val: root.left = insert(root.left, key)\n    else: root.right = insert(root.right, key)\n    return root`,
            java: `Node insert(Node root, int key) {\n    if (root == null) { root = new Node(key); return root; }\n    if (key < root.key) root.left = insert(root.left, key);\n    else if (key > root.key) root.right = insert(root.right, key);\n    return root;\n}`,
            cpp: `struct node* insert(struct node* node, int key) {\n    if (node == NULL) return newNode(key);\n    if (key < node->key) node->left = insert(node->left, key);\n    else if (key > node->key) node->right = insert(node->right, key);\n    return node;\n}`,
            c: `struct node* insert(struct node* node, int key) {\n    if (node == NULL) return newNode(key);\n    if (key < node->key) node->left = insert(node->left, key);\n    else if (key > node->key) node->right = insert(node->right, key);\n    return node;\n}`
        }
    },
    "avl": {
        description: "AVL tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one.",
        pros: ["Guaranteed O(log n) search", "Balanced"],
        cons: ["Complex rotation logic", "Overhead on insert/delete"],
        code: {
            python: `def leftRotate(self, z):\n    y = z.right\n    T2 = y.left\n    y.left = z\n    z.right = T2\n    # Update heights...`,
            java: `Node rightRotate(Node y) {\n    Node x = y.left;\n    Node T2 = x.right;\n    x.right = y;\n    y.left = T2;\n    // Update heights return x\n}`,
            cpp: `Node *rightRotate(Node *y) {\n    Node *x = y->left; Node *T2 = x->right;\n    x->right = y; y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}`,
            c: `struct Node *rightRotate(struct Node *y) {\n    struct Node *x = y->left; struct Node *T2 = x->right;\n    x->right = y; y->left = T2;\n    // Update heights\n    return x;\n}`
        }
    },
    "trie": {
        description: "Trie is an efficient information reTrieval data structure. Using Trie, search complexities can be brought to optimal limit (key length).",
        pros: ["Fast prefix search", "Ordered iteration"],
        cons: ["High memory usage (sparse)", "Pointer overhead"],
        code: {
            python: `class TrieNode:\n    def __init__(self):\n        self.children = [None]*26\n        self.isEndOfWord = False\n\ndef insert(root, key):\n    pCrawl = root\n    for level in range(len(key)):\n        index = ord(key[level]) - ord('a')\n        if not pCrawl.children[index]:\n            pCrawl.children[index] = TrieNode()\n        pCrawl = pCrawl.children[index]\n    pCrawl.isEndOfWord = True`,
            java: `void insert(String key) {\n    int level; int length = key.length();\n    int index;\n    TrieNode pCrawl = root;\n    for (level = 0; level < length; level++) {\n        index = key.charAt(level) - 'a';\n        if (pCrawl.children[index] == null)\n            pCrawl.children[index] = new TrieNode();\n        pCrawl = pCrawl.children[index];\n    }\n    pCrawl.isEndOfWord = true;\n}`,
            cpp: `void insert(struct TrieNode *root, string key) {\n    struct TrieNode *pCrawl = root;\n    for (int i = 0; i < key.length(); i++) {\n        int index = key[i] - 'a';\n        if (!pCrawl->children[index]) pCrawl->children[index] = getNode();\n        pCrawl = pCrawl->children[index];\n    }\n    pCrawl->isEndOfWord = true;\n}`,
            c: `void insert(struct TrieNode *root, const char *key) {\n    int level; int length = strlen(key); int index;\n    struct TrieNode *pCrawl = root;\n    for (level = 0; level < length; level++) {\n        index = CHAR_TO_INDEX(key[level]);\n        if (!pCrawl->children[index]) pCrawl->children[index] = getNode();\n        pCrawl = pCrawl->children[index];\n    }\n    pCrawl->isEndOfWord = true;\n}`
        }
    },

    // --- GRAPHS ---
    "bfs": {
        description: "BFS explores neighbor nodes first, widely used for finding shortest paths in unweighted graphs.",
        pros: ["Shortest path (unweighted)", "Complete"],
        cons: ["Memory O(V)", "Slow for deep graphs"],
        code: {
            python: `def bfs(graph, start):\n    queue = [start]\n    visited = {start}\n    while queue:\n        v = queue.pop(0)\n        for n in graph[v]:\n            if n not in visited:\n                visited.add(n)\n                queue.append(n)`,
            java: `void BFS(int s, int V, LinkedList<Integer> adj[]) {\n    boolean visited[] = new boolean[V];\n    LinkedList<Integer> queue = new LinkedList<Integer>();\n    visited[s] = true;\n    queue.add(s);\n    while (queue.size() != 0) {\n        s = queue.poll();\n        System.out.print(s + " ");\n        Iterator<Integer> i = adj[s].listIterator();\n        while (i.hasNext()) {\n            int n = i.next();\n            if (!visited[n]) {\n                visited[n] = true;\n                queue.add(n);\n            }\n        }\n    }\n}`,
            cpp: `void BFS(int s, int V, list<int> *adj) {\n    bool *visited = new bool[V];\n    for(int i = 0; i < V; i++) visited[i] = false;\n    list<int> queue;\n    visited[s] = true;\n    queue.push_back(s);\n    while(!queue.empty()) {\n        s = queue.front();\n        cout << s << " ";\n        queue.pop_front();\n        for(auto i = adj[s].begin(); i != adj[s].end(); ++i) {\n            if(!visited[*i]) {\n                visited[*i] = true;\n                queue.push_back(*i);\n            }\n        }\n    }\n}`,
            c: `void BFS(int startNode, int n, int adj[][n]) {\n    int queue[n], front = 0, rear = 0;\n    int visited[n];\n    for(int i = 0; i < n; i++) visited[i] = 0;\n    visited[startNode] = 1;\n    queue[rear++] = startNode;\n    while(front < rear) {\n        int current = queue[front++];\n        printf("%d ", current);\n        for(int i = 0; i < n; i++) {\n            if(adj[current][i] == 1 && !visited[i]) {\n                visited[i] = 1;\n                queue[rear++] = i;\n            }\n        }\n    }\n}`
        }
    },
    "dfs": {
        description: "DFS explores as far as possible along each branch before backtracking.",
        pros: ["Low memory", "Good for connectivity"],
        cons: ["Not shortest path", "Infinite loops"],
        code: {
            python: `def dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    for n in graph[start] - visited:\n        dfs(graph, n, visited)`,
            java: `void DFSUtil(int v, boolean visited[], LinkedList<Integer> adj[]) {\n    visited[v] = true;\n    System.out.print(v + " ");\n    Iterator<Integer> i = adj[v].listIterator();\n    while (i.hasNext()) {\n        int n = i.next();\n        if (!visited[n]) DFSUtil(n, visited, adj);\n    }\n}`,
            cpp: `void DFSUtil(int v, bool visited[], list<int> *adj) {\n    visited[v] = true;\n    cout << v << " ";\n    list<int>::iterator i;\n    for (i = adj[v].begin(); i != adj[v].end(); ++i)\n        if (!visited[*i]) DFSUtil(*i, visited, adj);\n}`,
            c: `void DFSUtil(int v, int visited[], int n, int adj[][n]) {\n    visited[v] = 1;\n    printf("%d ", v);\n    for (int i = 0; i < n; i++)\n        if (adj[v][i] == 1 && !visited[i]) DFSUtil(i, visited, n, adj);\n}`
        }
    },
    "dijkstra": {
        description: "Finds shortest paths from source to all vertices in the given graph.",
        pros: ["Shortest path (weighted)", "Greedy efficient"],
        cons: ["No negative weights", "Slower than BFS"],
        code: {
            python: `def dijkstra(graph, start):\n    pq = [(0, start)]\n    dist = {v: float('inf') for v in graph}\n    dist[start] = 0\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, weight in graph[u].items():\n            if dist[u] + weight < dist[v]:\n                dist[v] = dist[u] + weight\n                heapq.heappush(pq, (dist[v], v))`,
            java: `void dijkstra(int graph[][], int src, int V) {\n    int dist[] = new int[V];\n    Boolean sptSet[] = new Boolean[V];\n    for (int i = 0; i < V; i++) {\n        dist[i] = Integer.MAX_VALUE;\n        sptSet[i] = false;\n    }\n    dist[src] = 0;\n    for (int count = 0; count < V - 1; count++) {\n        int u = minDistance(dist, sptSet, V);\n        sptSet[u] = true;\n        for (int v = 0; v < V; v++)\n            if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Integer.MAX_VALUE && dist[u] + graph[u][v] < dist[v])\n                dist[v] = dist[u] + graph[u][v];\n    }\n}`,
            cpp: `void dijkstra(int graph[9][9], int src) {\n    int dist[9]; bool sptSet[9];\n    for (int i = 0; i < 9; i++) dist[i] = INT_MAX, sptSet[i] = false;\n    dist[src] = 0;\n    for (int count = 0; count < 9 - 1; count++) {\n        int u = minDistance(dist, sptSet);\n        sptSet[u] = true;\n        for (int v = 0; v < 9; v++)\n            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v])\n                dist[v] = dist[u] + graph[u][v];\n    }\n}`,
            c: `void dijkstra(int graph[9][9], int src) {\n    int dist[9], sptSet[9];\n    // Similar logic to C++ using arrays\n    // Print solution\n}`
        }
    },
    "bellman-ford": {
        description: "Computes shortest paths from a single source node to all of the other nodes in a weighted digraph.",
        pros: ["Handles negative weights", "Detects negative cycles"],
        cons: ["O(VE) Slow", "Not for undirected negative edges"],
        code: {
            python: `def BellmanFord(self, src):\n    dist = [float("Inf")] * self.V\n    dist[src] = 0\n    for _ in range(self.V - 1):\n        for u, v, w in self.graph:\n             if dist[u] != float("Inf") and dist[u] + w < dist[v]:\n                 dist[v] = dist[u] + w\n    for u, v, w in self.graph:\n        if dist[u] != float("Inf") and dist[u] + w < dist[v]:\n            print("Graph contains negative weight cycle")`,
            java: `void BellmanFord(Graph graph, int src) {\n    int V = graph.V, E = graph.E;\n    int dist[] = new int[V];\n    for (int i = 0; i < V; ++i) dist[i] = Integer.MAX_VALUE;\n    dist[src] = 0;\n    for (int i = 1; i < V; ++i) {\n        for (int j = 0; j < E; ++j) {\n             int u = graph.edge[j].src;\n             int v = graph.edge[j].dest;\n             int weight = graph.edge[j].weight;\n             if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v])\n                 dist[v] = dist[u] + weight;\n        }\n    }\n}`,
            cpp: `void BellmanFord(struct Graph* graph, int src) {\n    int V = graph->V; int E = graph->E;\n    int dist[V];\n    for (int i = 0; i < V; i++) dist[i] = INT_MAX;\n    dist[src] = 0;\n    for (int i = 1; i <= V - 1; i++) {\n        for (int j = 0; j < E; j++) {\n            int u = graph->edge[j].src;\n            int v = graph->edge[j].dest;\n            int weight = graph->edge[j].weight;\n            if (dist[u] != INT_MAX && dist[u] + weight < dist[v])\n                dist[v] = dist[u] + weight;\n        }\n    }\n}`,
            c: `void BellmanFord(struct Graph* graph, int src) {\n    // Struct Edge edge[E]; same logic as C++\n    // Loop V-1 times relaxing edges\n    // Check for negative cycles\n}`
        }
    },
    "mst": {
        description: "Minimum Spanning Tree (Prim's / Kruskal's) connects all vertices with minimum total edge weight.",
        pros: ["Network design", "Clustering"],
        cons: ["O(E log V)", "Complexity"],
        code: {
            python: `def primMST(self):\n    key = [sys.maxsize] * self.V\n    parent = [None] * self.V\n    key[0] = 0\n    mstSet = [False] * self.V\n    parent[0] = -1\n    for cout in range(self.V):\n        u = self.minKey(key, mstSet)\n        mstSet[u] = True\n        for v in range(self.V):\n             if self.graph[u][v] > 0 and mstSet[v] == False and key[v] > self.graph[u][v]:\n                 key[v] = self.graph[u][v]\n                 parent[v] = u`,
            java: `void primMST(int graph[][], int V) {\n    int parent[] = new int[V];\n    int key[] = new int[V];\n    boolean mstSet[] = new boolean[V];\n    for (int i = 0; i < V; i++) {\n        key[i] = Integer.MAX_VALUE;\n        mstSet[i] = false;\n    }\n    key[0] = 0; parent[0] = -1;\n    for (int count = 0; count < V - 1; count++) {\n        int u = minKey(key, mstSet, V);\n        mstSet[u] = true;\n        for (int v = 0; v < V; v++)\n            if (graph[u][v] != 0 && !mstSet[v] && graph[u][v] < key[v]) {\n                parent[v] = u;\n                key[v] = graph[u][v];\n            }\n    }\n}`,
            cpp: `void primMST(int graph[5][5]) {\n    int parent[5], key[5];\n    bool mstSet[5];\n    for (int i = 0; i < 5; i++) key[i] = INT_MAX, mstSet[i] = false;\n    key[0] = 0; parent[0] = -1;\n    for (int count = 0; count < 5 - 1; count++) {\n        int u = minKey(key, mstSet);\n        mstSet[u] = true;\n        for (int v = 0; v < 5; v++)\n            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v])\n                parent[v] = u, key[v] = graph[u][v];\n    }\n}`,
            c: `void primMST(int graph[5][5]) {\n    int parent[5], key[5], mstSet[5];\n    // Standard Prim's logic using minimum key search\n    // Print edges in MST\n}`
        }
    },
    "topo": {
        description: "Topological Sort is linear ordering of vertices such that for every directed edge u v, vertex u comes before v in the ordering.",
        pros: ["Task scheduling", "Dependency resolution"],
        cons: ["DAG only", "Not unique"],
        code: {
            python: `def topologicalSortUtil(self, v, visited, stack):\n    visited[v] = True\n    for i in self.graph[v]:\n        if visited[i] == False:\n            self.topologicalSortUtil(i, visited, stack)\n    stack.insert(0, v)`,
            java: `void topologicalSortUtil(int v, boolean visited[], Stack<Integer> stack) {\n    visited[v] = true;\n    Integer i;\n    Iterator<Integer> it = adj[v].iterator();\n    while (it.hasNext()) {\n        i = it.next();\n        if (!visited[i]) topologicalSortUtil(i, visited, stack);\n    }\n    stack.push(new Integer(v));\n}`,
            cpp: `void topologicalSortUtil(int v, bool visited[], stack<int> &Stack) {\n    visited[v] = true;\n    list<int>::iterator i;\n    for (i = adj[v].begin(); i != adj[v].end(); ++i)\n        if (!visited[*i]) topologicalSortUtil(*i, visited, Stack);\n    Stack.push(v);\n}`,
            c: `void topologicalSortUtil(int v, int visited[], int stack[], int* top, int adj[][10], int n) {\n    visited[v] = 1;\n    for(int i=0; i<n; i++) if(adj[v][i] && !visited[i]) topologicalSortUtil(i, visited, stack, top, adj, n);\n    stack[(*top)++] = v;\n}`
        }
    },
    "cycle-detection": {
        description: "Detects cycles in Directed or Undirected graphs using DFS or Union-Find.",
        pros: ["Deadlock detection", "Infinite loop check"],
        cons: ["O(V+E)", "False positives if not careful"],
        code: {
            python: `def isCyclicUtil(self, v, visited, recStack):\n    visited[v] = True\n    recStack[v] = True\n    for neighbour in self.graph[v]:\n        if visited[neighbour] == False:\n            if self.isCyclicUtil(neighbour, visited, recStack) == True: return True\n        elif recStack[neighbour] == True: return True\n    recStack[v] = False\n    return False`,
            java: `boolean isCyclicUtil(int i, boolean[] visited, boolean[] recStack) {\n    if (recStack[i]) return true;\n    if (visited[i]) return false;\n    visited[i] = true;\n    recStack[i] = true;\n    List<Integer> children = adj.get(i);\n    for (Integer c: children)\n        if (isCyclicUtil(c, visited, recStack)) return true;\n    recStack[i] = false;\n    return false;\n}`,
            cpp: `bool isCyclicUtil(int v, bool visited[], bool *recStack) {\n    if(visited[v] == false) {\n        visited[v] = true; recStack[v] = true;\n        list<int>::iterator i;\n        for(i = adj[v].begin(); i != adj[v].end(); ++i) {\n            if ( !visited[*i] && isCyclicUtil(*i, visited, recStack) ) return true;\n            else if (recStack[*i]) return true;\n        }\n    }\n    recStack[v] = false;\n    return false;\n}`,
            c: `int isCyclicUtil(int v, int visited[], int recStack[], int n, int adj[][n]) {\n    visited[v] = 1; recStack[v] = 1;\n    for(int i=0; i<n; i++) {\n        if(adj[v][i]) {\n             if(!visited[i] && isCyclicUtil(i, visited, recStack, n, adj)) return 1;\n             else if(recStack[i]) return 1;\n        }\n    }\n    recStack[v] = 0;\n    return 0;\n}`
        }
    },
    "search": {
        description: "Linear and Binary search algorithms for finding elements in lists.",
        pros: ["Binary is O(log n)", "Linear is simple"],
        cons: ["Binary requires sorted", "Linear is O(n)"],
        code: {
            python: `def binary_search(arr, low, high, x):\n    if high >= low:\n        mid = (high + low) // 2\n        if arr[mid] == x: return mid\n        elif arr[mid] > x: return binary_search(arr, low, mid - 1, x)\n        else: return binary_search(arr, mid + 1, high, x)\n    else: return -1`,
            java: `int binarySearch(int arr[], int x) {\n    int l = 0, r = arr.length - 1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (arr[m] == x) return m;\n        if (arr[m] < x) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}`,
            cpp: `int binarySearch(int arr[], int l, int r, int x) {\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (arr[m] == x) return m;\n        if (arr[m] < x) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}`,
            c: `int binarySearch(int arr[], int l, int r, int x) {\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (arr[m] == x) return m;\n        if (arr[m] < x) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}`
        }
    },
    "recursion": {
        description: "Recursion is the process of defining a problem (or the solution to a problem) in terms of (a simpler version of) itself.",
        pros: ["Elegant code", "Good for tree/graph"],
        cons: ["Stack overflow", "Overhead"],
        code: {
            python: `def factorial(n):\n    if n == 1: return 1\n    else: return n * factorial(n-1)`,
            java: `int factorial(int n) {\n    if (n == 0) return 1;\n    else return (n * factorial(n-1));\n}`,
            cpp: `int factorial(int n) { return (n==1 || n==0) ? 1 : n * factorial(n - 1); }`,
            c: `long factorial(int n) { if (n == 0) return 1; else return(n * factorial(n-1)); }`
        }
    },
    "dp": {
        description: "Dynamic Programming is mainly an optimization over plain recursion. Idea is to store results of subproblems.",
        pros: ["Optimizes exponential to polynomial", "Avoids re-computation"],
        cons: ["Memory O(n) table", "Complex state definition"],
        code: {
            python: `def fib(n):\n    f = [0] * (n+1)\n    f[1] = 1\n    for i in range(2, n+1):\n        f[i] = f[i-1] + f[i-2]\n    return f[n]`,
            java: `int fib(int n) {\n    int f[] = new int[n+2];\n    f[0] = 0; f[1] = 1;\n    for (int i = 2; i <= n; i++) f[i] = f[i-1] + f[i-2];\n    return f[n];\n}`,
            cpp: `long long fib(int n) {\n    long long f[n + 2];\n    f[0] = 0; f[1] = 1;\n    for(int i = 2; i <= n; i++) f[i] = f[i - 1] + f[i - 2];\n    return f[n];\n}`,
            c: `long long fib(int n) {\n    long long f[n + 2];\n    f[0] = 0; f[1] = 1;\n    for(int i = 2; i <= n; i++) f[i] = f[i - 1] + f[i - 2];\n    return f[n];\n}`
        }
    },
    "astar": {
        description: "A* Search Algorithm is a path search algorithm that is best-first search using heuristics.",
        pros: ["Optimal and Complete", "Heuristics speed up search"],
        cons: ["Memory complexity", "Heuristic dependent"],
        code: {
            python: `def a_star(graph, start, goal):\n    open_set = {start}\n    g_score = {node: float('inf') for node in graph}\n    g_score[start] = 0\n    f_score = {node: float('inf') for node in graph}\n    f_score[start] = heuristic(start, goal)\n    while open_set:\n        curr = min(open_set, key=lambda node: f_score[node])\n        if curr == goal: return reconstruct_path(came_from, curr)\n        open_set.remove(curr)\n        for neighbor in graph[curr]:\n            tentative_g = g_score[curr] + dist(curr, neighbor)\n            if tentative_g < g_score[neighbor]:\n                came_from[neighbor] = curr\n                g_score[neighbor] = tentative_g\n                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)\n                open_set.add(neighbor)`,
            java: `public List<Node> aStar(Node start, Node target) {\n    PriorityQueue<Node> open = new PriorityQueue<>(Comparator.comparingDouble(n -> n.f));\n    start.g = 0; start.f = start.h;\n    open.add(start);\n    while(!open.isEmpty()) {\n        Node current = open.poll();\n        if(current == target) return reconstructPath(current);\n        for(Edge edge : current.neighbors) {\n             Node neighbor = edge.target;\n             double tempG = current.g + edge.weight;\n             if(tempG < neighbor.g) {\n                 neighbor.g = tempG; neighbor.f = neighbor.g + neighbor.h;\n                 if(!open.contains(neighbor)) open.add(neighbor);\n             }\n        }\n    }\n    return null;\n}`,
            cpp: `// Node struct with f, g, h\nvector<Node*> aStar(Node* start, Node* target) {\n    priority_queue<Node*, vector<Node*>, CompareF> openSet;\n    start->g = 0; start->f = start->h;\n    openSet.push(start);\n    while(!openSet.empty()) {\n        Node* current = openSet.top(); openSet.pop();\n        if(current == target) return reconstructPath(current);\n        for(auto& edge : current->edges) {\n            Node* neighbor = edge.target;\n            double tempG = current->g + edge.weight;\n            if(tempG < neighbor->g) {\n                neighbor->g = tempG; neighbor->f = neighbor->g + neighbor->h;\n                openSet.push(neighbor);\n            }\n        }\n    }\n    return {};\n}`,
            c: `// C implementation requires manual Heap/PriorityQueue\n// Standard A* logic: Maintain open list (min-heap) of nodes sorted by f-score\n// Loop while open list not empty\n// Extract min, relax neighbors, update f/g scores\n// Reconstruct path from parent pointers`
        }
    },

    // --- SYSTEMS ---
    "cpu-scheduling": {
        description: "CPU Scheduling determines which process runs when. FCFS is the simplest policy.",
        pros: ["Simple to implement", "No starvation"],
        cons: ["High waiting time", "Convoy effect"],
        code: {
            python: `def find_waiting_time(processes, n, bt, wt):\n    wt[0] = 0\n    for i in range(1, n):\n        wt[i] = bt[i - 1] + wt[i - 1]\n\ndef find_avg_time(processes, n, bt):\n    wt = [0] * n\n    tat = [0] * n\n    find_waiting_time(processes, n, bt, wt)\n    # TAT = bt + wt logic...`,
            java: `class FCFS {\n    void findWaitingTime(int processes[], int n, int bt[], int wt[]) {\n        wt[0] = 0;\n        for (int i = 1; i < n; i++)\n            wt[i] = bt[i - 1] + wt[i - 1];\n    }\n    void findTurnAroundTime(int processes[], int n, int bt[], int wt[], int tat[]) {\n        for (int i = 0; i < n; i++)\n            tat[i] = bt[i] + wt[i];\n    }\n}`,
            cpp: `void findWaitingTime(int processes[], int n, int bt[], int wt[]) {\n    wt[0] = 0;\n    for (int i = 1; i < n; i++)\n        wt[i] = bt[i - 1] + wt[i - 1];\n}\n\nvoid findTurnAroundTime(int processes[], int n, int bt[], int wt[], int tat[]) {\n    for (int i = 0; i < n; i++)\n        tat[i] = bt[i] + wt[i];\n}`,
            c: `void findWaitingTime(int processes[], int n, int bt[], int wt[]) {\n    wt[0] = 0;\n    for (int i = 1; i < n; i++)\n        wt[i] = bt[i - 1] + wt[i - 1];\n}\n\nvoid findTurnAroundTime(int processes[], int n, int bt[], int wt[], int tat[]) {\n    for (int i = 0; i < n; i++)\n        tat[i] = bt[i] + wt[i];\n}`
        }
    },
    "bankers": {
        description: "Banker's Algorithm tests for safety by simulating resource allocation.",
        pros: ["Deadlock avoidance", "Guarantees safety"],
        cons: ["Conservative", "Needs max demand beforehand"],
        code: {
            python: `def isSafe(avail, max_r, alloc):\n    n = len(alloc); m = len(avail)\n    need = [[max_r[i][j] - alloc[i][j] for j in range(m)] for i in range(n)]\n    finish = [False] * n\n    work = avail[:]\n    while True:\n        found = False\n        for i in range(n):\n            if not finish[i] and all(need[i][j] <= work[j] for j in range(m)):\n                for k in range(m): work[k] += alloc[i][k]\n                finish[i] = True\n                found = True\n        if not found: break\n    return all(finish)`,
            java: `boolean isSafe(int avail[], int max[][], int alloc[][], int n, int m) {\n    int[][] need = new int[n][m];\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            need[i][j] = max[i][j] - alloc[i][j];\n    boolean[] finish = new boolean[n];\n    int[] work = avail.clone();\n    int count = 0;\n    while (count < n) {\n        boolean found = false;\n        for (int i = 0; i < n; i++) {\n            if (!finish[i]) {\n                int j;\n                for (j = 0; j < m; j++)\n                    if (need[i][j] > work[j]) break;\n                if (j == m) {\n                    for (int k = 0; k < m; k++) work[k] += alloc[i][k];\n                    finish[i] = true;\n                    found = true;\n                    count++;\n                }\n            }\n        }\n        if (!found) return false;\n    }\n    return true;\n}`,
            cpp: `bool isSafe(int avail[], int max[][10], int alloc[][10], int n, int m) {\n    int need[n][10];\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            need[i][j] = max[i][j] - alloc[i][j];\n    bool finish[n] = {0};\n    int work[10];\n    for(int i=0;i<m;i++) work[i] = avail[i];\n    int count = 0;\n    while (count < n) {\n        bool found = false;\n        for (int p = 0; p < n; p++) {\n            if (!finish[p]) {\n                int j;\n                for (j = 0; j < m; j++)\n                    if (need[p][j] > work[j]) break;\n                if (j == m) {\n                    for (int k = 0; k < m; k++) work[k] += alloc[p][k];\n                    finish[p] = true;\n                    found = true;\n                    count++;\n                }\n            }\n        }\n        if (!found) return false;\n    }\n    return true;\n}`,
            c: `int isSafe(int avail[], int max[][10], int alloc[][10], int n, int m) {\n    int need[n][10], work[10], finish[n];\n    // loops similar to C++ ...\n    // Safety algorithm simulation\n    return 1;\n}`
        }
    },
    "page-replacement": {
        description: "LRU (Least Recently Used) discards the least recently used items first.",
        pros: ["Efficient for locality", "Often optimal"],
        cons: ["Complex hardware", "Overhead"],
        code: {
            python: `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cache = OrderedDict(); self.cap = capacity\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, val):\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = val\n        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
            java: `import java.util.*;\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75F, true);\n        this.capacity = capacity;\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}`,
            cpp: `class LRUCache {\n    list<int> dq;\n    unordered_map<int, list<int>::iterator> ma;\n    int c;\npublic:\n    LRUCache(int cap) : c(cap) {}\n    void refer(int x) {\n        if (ma.find(x) == ma.end()) {\n            if (dq.size() == c) {\n                int last = dq.back();\n                dq.pop_back();\n                ma.erase(last);\n            }\n        } else dq.erase(ma[x]);\n        dq.push_front(x);\n        ma[x] = dq.begin();\n    }\n};`,
            c: `// Standard Array Implementation (Simplified)\nint find(int q[], int n, int page) {\n    for(int i=0; i<n; i++) if(q[i] == page) return i;\n    return -1;\n}\nvoid lru(int pages[], int n, int capacity) {\n    int memory[capacity], count=0;\n    // LRU logic involving history tracking\n}`
        }
    },
    "memory-allocation": {
        description: "First Fit allocates the first hole that is big enough.",
        pros: ["Fastest algorithm", "Simple"],
        cons: ["External fragmentation", "Memory waste"],
        code: {
            python: `def first_fit(blockSize, m, processSize, n):\n    allocation = [-1] * n\n    for i in range(n):\n        for j in range(m):\n            if blockSize[j] >= processSize[i]:\n                allocation[i] = j\n                blockSize[j] -= processSize[i]\n                break`,
            java: `void firstFit(int blockSize[], int m, int processSize[], int n) {\n    int allocation[] = new int[n];\n    for (int i = 0; i < n; i++) allocation[i] = -1;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < m; j++) {\n            if (blockSize[j] >= processSize[i]) {\n                allocation[i] = j;\n                blockSize[j] -= processSize[i];\n                break;\n            }\n        }\n    }\n}`,
            cpp: `void firstFit(int blockSize[], int m, int processSize[], int n) {\n    int allocation[n];\n    memset(allocation, -1, sizeof(allocation));\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < m; j++) {\n            if (blockSize[j] >= processSize[i]) {\n                allocation[i] = j;\n                blockSize[j] -= processSize[i];\n                break;\n            }\n        }\n    }\n}`,
            c: `void firstFit(int blockSize[], int m, int processSize[], int n) {\n    int allocation[n];\n    for(int i=0;i<n;i++) allocation[i] = -1;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < m; j++) {\n            if (blockSize[j] >= processSize[i]) {\n                allocation[i] = j;\n                blockSize[j] -= processSize[i];\n                break;\n            }\n        }\n    }\n}`
        }
    },
    "disk": {
        description: "SSTF (Shortest Seek Time First) selects the request closest to the current head position.",
        pros: ["Better throughput than FCFS", "Lower average response time"],
        cons: ["Starvation possible", "Variance in response time"],
        code: {
            python: `def sstf(request, head):\n    if not request: return\n    l = len(request)\n    diff = [0] * l\n    for i in range(l):\n        diff[i] = abs(head - request[i])\n    # Sort by diff or find min in loop`,
            java: `void sstf(int request[], int head, int n) {\n    if (n == 0) return;\n    int diff[] = new int[n];\n    int visited[] = new int[n];\n    for(int i=0; i<n; i++) visited[i] = 0;\n    int count = 0;\n    while(count < n) {\n        int min = Integer.MAX_VALUE, index = -1;\n        for(int i=0; i<n; i++) {\n            if(visited[i] == 0) {\n                int d = Math.abs(head - request[i]);\n                if(d < min) { min = d; index = i; }\n            }\n        }\n        if(index != -1) {\n            visited[index] = 1;\n            count++;\n            head = request[index];\n            System.out.println("Seek to " + head);\n        }\n    }\n}`,
            cpp: `void sstf(int request[], int head, int n) {\n    if (n == 0) return;\n    vector<bool> visited(n, false);\n    int count = 0;\n    while(count < n) {\n        int min_dist = 1e9, index = -1;\n        for(int i=0; i<n; i++) {\n            if(!visited[i]) {\n                int d = abs(head - request[i]);\n                if(d < min_dist) { min_dist=d; index=i; }\n            }\n        }\n        if(index != -1) {\n            visited[index] = true;\n            count++;\n            head = request[index];\n            cout << "Seek to " << head << endl;\n        }\n    }\n}`,
            c: `void sstf(int request[], int head, int n) {\n    if (n == 0) return;\n    int visited[n];\n    for(int i=0; i<n; i++) visited[i] = 0;\n    int count = 0;\n    while(count < n) {\n        int min_dist = 1000000, index = -1;\n        for(int i=0; i<n; i++) {\n            if(!visited[i]) {\n                int d = abs(head - request[i]);\n                if(d < min_dist) { min_dist=d; index=i; }\n            }\n        }\n        if(index != -1) {\n            visited[index] = 1;\n            count++;\n            head = request[index];\n            printf("Seek to %d\\n", head);\n        }\n    }\n}`
        }
    },

    // --- AI ---
    "kmeans": {
        description: "K-Means Partitions data into k clusters. It minimizes within-cluster variances.",
        pros: ["Scalable", "Simple to implement"],
        cons: ["Manual K selection", "Sensitive to outliers"],
        code: {
            python: `import numpy as np\ndef kmeans(X, k, max_iters=100):\n    centroids = X[np.random.choice(X.shape[0], k, replace=False)]\n    for _ in range(max_iters):\n        labels = np.argmin(np.linalg.norm(X[:, None] - centroids, axis=2), axis=1)\n        new_centroids = np.array([X[labels == i].mean(axis=0) for i in range(k)])\n        if np.all(centroids == new_centroids): break\n        centroids = new_centroids\n    return labels, centroids`,
            java: `// 1. Initialize k centroids randomly\n// 2. Loop:\n//    Assign each point to nearest centroid (Euclidean dist)\n//    Update centroids (Mean of points)\n//    Check convergence`,
            cpp: `// Vector<Point> data\n// Struct Point { double x, y; }\n// Loop and calculation logic`,
            c: `// Array based implementation using structs`
        }
    },
    "knn": {
        description: "K-Nearest Neighbors classifies a data point based on the majority class of its 'k' nearest neighbors.",
        pros: ["No training phase", "Adapts to new data"],
        cons: ["Slow inference O(N)", "Memory intensive"],
        code: {
            python: `from collections import Counter\nimport numpy as np\ndef predict(X_train, y_train, x_test, k=3):\n    distances = [np.sqrt(np.sum((x_train - x_test)**2)) for x_train in X_train]\n    k_indices = np.argsort(distances)[:k]\n    k_nearest_labels = [y_train[i] for i in k_indices]\n    return Counter(k_nearest_labels).most_common(1)[0][0]`,
            java: `// Calculate distance from x_test to all X_train points\n// Sort by distance\n// Pick top k labels\n// Return majority`,
            cpp: `// Use vector<pair<double, int>> for distances (dist, index)\n// Sort and count top k`,
            c: `// Manual distance calc and bubble sort`
        }
    },
    "linear-regression": {
        description: "Linear Regression fits a straight line y = mx + c to the data to minimize residual error (MSE).",
        pros: ["Simple interpretation", "Fast"],
        cons: ["Linearity assumption", "Sensitive to noise"],
        code: {
            python: `import numpy as np\ndef fit(X, y):\n    # y = b0 + b1*x\n    n = len(X)\n    numer = 0; denom = 0\n    mean_x = np.mean(X); mean_y = np.mean(y)\n    for i in range(n):\n        numer += (X[i] - mean_x) * (y[i] - mean_y)\n        denom += (X[i] - mean_x) ** 2\n    b1 = numer / denom\n    b0 = mean_y - (b1 * mean_x)\n    return b0, b1`,
            java: `// Compute means\n// Loop to compute numerator (covariance) and denominator (variance)\n// Return slope and intercept`,
            cpp: `// Compute means\n// Loop for sum of squared errors`,
            c: `// Compute means\n// Loop for sum of squared errors`
        }
    },
    "minimax": {
        description: "Minimax is a backtracking algo for game theory (Tic-Tac-Toe, Chess). It minimizes the maximum loss.",
        pros: ["Optimal strategy", "Deterministic"],
        cons: ["Exponential complexity", "Impractical without pruning"],
        code: {
            python: `def minimax(node, depth, isMax):\n    if depth == 0 or game_over(node): return static_eval(node)\n    if isMax:\n        maxEva = -float('inf')\n        for child in node.children:\n             eva = minimax(child, depth-1, False)\n             maxEva = max(maxEva, eva)\n        return maxEva\n    else:\n        minEva = float('inf')\n        for child in node.children:\n             eva = minimax(child, depth-1, True)\n             minEva = min(minEva, eva)\n        return minEva`,
            java: `int minimax(Node node, int depth, boolean isMax) {\n    if(depth == 0) return eval(node);\n    if(isMax) {\n        int best = Integer.MIN_VALUE;\n        for(Node child : node.children) best = Math.max(best, minimax(child, depth-1, false));\n        return best;\n    } else {\n        int best = Integer.MAX_VALUE;\n        for(Node child : node.children) best = Math.min(best, minimax(child, depth-1, true));\n        return best;\n    }\n}`,
            cpp: `int minimax(Node* node, int depth, bool isMax) {\n    // Standard Recursive Implementation\n}`,
            c: `int minimax(struct Node* node, int depth, int isMax) {\n    // Standard Recursive Implementation\n}`
        }
    },
    "perceptron": {
        description: "Perceptron is a binary classifier that uses weights and bias: y = 1 if W.x + b > 0 else 0.",
        pros: ["Basis of Deep Learning", "Simple update rule"],
        cons: ["Cannot solve XOR", "Linear only"],
        code: {
            python: `import numpy as np\nclass Perceptron:\n    def __init__(self, lr=0.01, n_iters=1000):\n        self.lr = lr\n        self.n_iters = n_iters\n        self.weights = None\n        self.bias = None\n\n    def fit(self, X, y):\n        n_samples, n_features = X.shape\n        self.weights = np.zeros(n_features)\n        self.bias = 0\n        for _ in range(self.n_iters):\n            for idx, x_i in enumerate(X):\n                linear_output = np.dot(x_i, self.weights) + self.bias\n                y_predicted = 1 if linear_output > 0 else 0\n                update = self.lr * (y[idx] - y_predicted)\n                self.weights += update * x_i\n                self.bias += update`,
            java: `// Class with weights[]\n// Train loop: updates weights based on error\n// Predict function: dot product > threshold`,
            cpp: `// Class with vector<double> weights\n// Train loop\n// Predict function`,
            c: `// Struct Perceptron\n// Train loop\n// Predict function`
        }
    }
};

window.AlgoContent = AlgoContent;
