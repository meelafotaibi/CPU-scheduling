// Complete Algorithm Content System
class CompleteAlgoContentSystem extends AlgoContentSystem {
    constructor() {
        super();
        this.addAllAlgorithms();
    }

    addAllAlgorithms() {
        // Graph Algorithms
        this.addGraphAlgorithms();
        // Sorting Algorithms  
        this.addSortingAlgorithms();
        // Tree Algorithms
        this.addTreeAlgorithms();
        // Search Algorithms
        this.addSearchAlgorithms();
        // OS Algorithms
        this.addOSAlgorithms();
        // AI/ML Algorithms
        this.addAIAlgorithms();
    }

    addGraphAlgorithms() {
        this.content.set('astar', {
            title: 'A* Search Algorithm',
            definition: 'Best-first search algorithm that uses heuristics to find optimal path efficiently.',
            usage: 'Pathfinding, game AI, robotics, GPS navigation.',
            complexity: { time: 'O(b^d)', space: 'O(b^d)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Optimal with admissible heuristic', 'Efficient pathfinding', 'Widely applicable'],
                cons: ['Requires good heuristic', 'Memory intensive', 'Complex implementation']
            },
            code: { python: 'def astar(start, goal, h):\n    # A* implementation', cpp: '// A* in C++', java: '// A* in Java' }
        });

        this.content.set('bellman-ford', {
            title: 'Bellman-Ford Algorithm',
            definition: 'Finds shortest paths from source to all vertices, handles negative weights.',
            usage: 'Negative weight graphs, currency arbitrage, network routing.',
            complexity: { time: 'O(VE)', space: 'O(V)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Handles negative weights', 'Detects negative cycles', 'Simple implementation'],
                cons: ['Slower than Dijkstra', 'O(VE) time complexity', 'Not suitable for large graphs']
            },
            code: { python: 'def bellman_ford(graph, source):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('kruskal', {
            title: "Kruskal's Algorithm",
            definition: 'Finds minimum spanning tree by sorting edges and using union-find.',
            usage: 'Network design, clustering, circuit design.',
            complexity: { time: 'O(E log E)', space: 'O(V)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Optimal MST', 'Works with disconnected graphs', 'Edge-based approach'],
                cons: ['Requires sorting edges', 'Union-find complexity', 'Not suitable for dense graphs']
            },
            code: { python: 'def kruskal(edges, vertices):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('topo', {
            title: 'Topological Sort',
            definition: 'Linear ordering of vertices in DAG where each directed edge goes from earlier to later vertex.',
            usage: 'Task scheduling, dependency resolution, course prerequisites.',
            complexity: { time: 'O(V + E)', space: 'O(V)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Solves ordering problems', 'Detects cycles', 'Linear time complexity'],
                cons: ['Only works on DAGs', 'Multiple valid orderings', 'Requires cycle detection']
            },
            code: { python: 'def topological_sort(graph):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }

    addSortingAlgorithms() {
        this.content.set('insertion', {
            title: 'Insertion Sort',
            definition: 'Builds sorted array one element at a time by inserting each element in correct position.',
            usage: 'Small datasets, nearly sorted arrays, online sorting.',
            complexity: { time: 'O(n²)', space: 'O(1)', stable: 'Yes', inPlace: 'Yes' },
            proscons: {
                pros: ['Simple implementation', 'Efficient for small arrays', 'Adaptive', 'Stable'],
                cons: ['O(n²) worst case', 'Not suitable for large datasets', 'Many shifts required']
            },
            code: { python: 'def insertion_sort(arr):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('selection', {
            title: 'Selection Sort',
            definition: 'Finds minimum element and swaps with first position, repeats for remaining array.',
            usage: 'Educational purposes, memory-constrained environments.',
            complexity: { time: 'O(n²)', space: 'O(1)', stable: 'No', inPlace: 'Yes' },
            proscons: {
                pros: ['Simple implementation', 'In-place sorting', 'Minimal swaps'],
                cons: ['O(n²) always', 'Not stable', 'Not adaptive', 'Poor performance']
            },
            code: { python: 'def selection_sort(arr):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('heap', {
            title: 'Heap Sort',
            definition: 'Uses binary heap data structure to sort array in O(n log n) time.',
            usage: 'Guaranteed O(n log n), priority queues, embedded systems.',
            complexity: { time: 'O(n log n)', space: 'O(1)', stable: 'No', inPlace: 'Yes' },
            proscons: {
                pros: ['Guaranteed O(n log n)', 'In-place sorting', 'No worst case degradation'],
                cons: ['Not stable', 'Poor cache performance', 'Complex implementation']
            },
            code: { python: 'def heap_sort(arr):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }

    addTreeAlgorithms() {
        this.content.set('avl', {
            title: 'AVL Tree',
            definition: 'Self-balancing binary search tree where heights of subtrees differ by at most 1.',
            usage: 'Databases, file systems, balanced search operations.',
            complexity: { time: 'O(log n)', space: 'O(n)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Guaranteed O(log n)', 'Self-balancing', 'Efficient searches'],
                cons: ['Complex rotations', 'Extra storage for heights', 'Slower insertions than BST']
            },
            code: { python: 'class AVLNode:\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('trie', {
            title: 'Trie (Prefix Tree)',
            definition: 'Tree data structure for storing strings where each path represents a word.',
            usage: 'Autocomplete, spell checkers, IP routing, word games.',
            complexity: { time: 'O(m)', space: 'O(ALPHABET_SIZE * N * M)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Fast prefix searches', 'Space efficient for common prefixes', 'Easy autocomplete'],
                cons: ['High memory usage', 'Complex implementation', 'Cache unfriendly']
            },
            code: { python: 'class TrieNode:\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }

    addSearchAlgorithms() {
        this.content.set('binary-search', {
            title: 'Binary Search',
            definition: 'Efficiently finds target in sorted array by repeatedly dividing search space in half.',
            usage: 'Searching sorted arrays, finding boundaries, optimization problems.',
            complexity: { time: 'O(log n)', space: 'O(1)', stable: 'N/A', inPlace: 'Yes' },
            proscons: {
                pros: ['Very fast O(log n)', 'Simple implementation', 'Space efficient'],
                cons: ['Requires sorted array', 'Not suitable for linked lists', 'Insertion/deletion expensive']
            },
            code: { python: 'def binary_search(arr, target):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('linear-search', {
            title: 'Linear Search',
            definition: 'Sequentially checks each element until target is found or array ends.',
            usage: 'Unsorted arrays, small datasets, simple implementations.',
            complexity: { time: 'O(n)', space: 'O(1)', stable: 'N/A', inPlace: 'Yes' },
            proscons: {
                pros: ['Works on unsorted arrays', 'Simple implementation', 'No preprocessing needed'],
                cons: ['O(n) time complexity', 'Inefficient for large arrays', 'No early termination optimization']
            },
            code: { python: 'def linear_search(arr, target):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }

    addOSAlgorithms() {
        this.content.set('page-replacement', {
            title: 'Page Replacement Algorithms',
            definition: 'Algorithms to decide which memory pages to swap out when memory is full.',
            usage: 'Operating systems, virtual memory management, caching systems.',
            complexity: { time: 'O(n)', space: 'O(k)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Essential for OS', 'Various strategies available', 'Improves memory utilization'],
                cons: ['Complex implementation', 'Performance varies by workload', 'Overhead of tracking']
            },
            code: { python: 'def lru_page_replacement(pages, capacity):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('bankers', {
            title: "Banker's Algorithm",
            definition: 'Deadlock avoidance algorithm that checks if resource allocation leads to safe state.',
            usage: 'Operating systems, resource allocation, deadlock prevention.',
            complexity: { time: 'O(n²m)', space: 'O(nm)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Prevents deadlock', 'Safe resource allocation', 'Well-defined algorithm'],
                cons: ['Conservative approach', 'Requires advance knowledge', 'High time complexity']
            },
            code: { python: 'def bankers_algorithm(processes, resources):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }

    addAIAlgorithms() {
        this.content.set('minimax', {
            title: 'Minimax Algorithm',
            definition: 'Decision-making algorithm for turn-based games that minimizes maximum possible loss.',
            usage: 'Game AI, decision trees, competitive scenarios.',
            complexity: { time: 'O(b^d)', space: 'O(bd)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Optimal play guarantee', 'Works for any zero-sum game', 'Clear decision logic'],
                cons: ['Exponential time complexity', 'Requires complete game tree', 'Memory intensive']
            },
            code: { python: 'def minimax(node, depth, maximizing):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });

        this.content.set('knn', {
            title: 'K-Nearest Neighbors',
            definition: 'Classification algorithm that assigns class based on majority vote of k nearest neighbors.',
            usage: 'Classification, regression, recommendation systems, pattern recognition.',
            complexity: { time: 'O(nd)', space: 'O(n)', stable: 'N/A', inPlace: 'No' },
            proscons: {
                pros: ['Simple implementation', 'No training required', 'Works with any distance metric'],
                cons: ['Computationally expensive', 'Sensitive to irrelevant features', 'Memory intensive']
            },
            code: { python: 'def knn_classify(train_data, test_point, k):\n    # Implementation', cpp: '// C++ code', java: '// Java code' }
        });
    }
}

// Replace the original system
window.AlgoContentSystem = CompleteAlgoContentSystem;