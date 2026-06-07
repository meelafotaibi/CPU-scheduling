const AlgoGuidesDatabase = {
    "disk": {
        title: "Disk Scheduling Guide",
        concept: "Disk scheduling algorithms decide the order in which read/write head requests on a hard disk drive are serviced. Since mechanical head movements (seek time) are the slowest part of disk I/O, optimizing this order significantly improves system performance. Algorithms include FCFS (First Come First Served), SSTF (Shortest Seek Time First), SCAN (Elevator), C-SCAN, LOOK, and C-LOOK.",
        controls: {
            "Run / Pause": "Executes the seek sweep animation according to the selected algorithm.",
            "Reset": "Clears the active request queue, resets the head position, and resets the total seek time counter.",
            "Algorithm Dropdown": "Selects the algorithm: FCFS, SSTF, SCAN, C-SCAN, LOOK, or C-LOOK.",
            "Initial Head Position": "Sets the starting track cylinder of the disk head (0-199).",
            "Request Queue": "A comma-separated list of tracks (0-199) that the head needs to visit.",
            "Inject Queue Request": "Injects a request track in real-time while the sweep animation runs."
        },
        logs: "The performance log records every cylinder jump, showing the distance from the previous position and the accumulated seek time. Read the logs to see the sequence of cylinder traversal and track seeks.",
        game: {
            name: "Disk Captain Game",
            objective: "Service all incoming cylinder requests manually in the most optimal order to minimize total seek distance and beat the automated algorithm score!",
            instructions: "Click 'Disk Captain Game' in the header. Colored cylinder request tags will appear. Click on the requests in an order that minimizes head jumps. Watch your score increase for optimal moves!"
        }
    },
    "cpu-scheduling": {
        title: "CPU Scheduling Guide",
        concept: "CPU scheduling decides which process runs next when the CPU becomes idle, optimizing core metrics: Turnaround Time (TAT) and Waiting Time (WT). Algorithms include FCFS, SJF (Shortest Job First), Priority (runs highest priority), and Round Robin (gives each process a cyclic time slice/quantum).",
        controls: {
            "Run / Pause": "Starts or pauses the scheduling animation, drawing the Gantt chart in real-time.",
            "Reset": "Clears the active process table, Gantt chart, and clears stats.",
            "Algorithms Selector": "Choose between FCFS, SJF, Priority, and Round Robin.",
            "Time Quantum (for Round Robin)": "Specifies the time slice size allocated to each process.",
            "Add Process": "Injects a custom process by inputting its Arrival Time, Burst Time, and Priority.",
            "Gantt Chart": "Visualizes the timeline of which process held the CPU over time."
        },
        logs: "The log tracks CPU dispatcher context switches, process arrivals, preemption events, and process completions, with dynamic WT and TAT calculation details.",
        game: {
            name: "CPU Scheduler Challenge",
            objective: "Manually dispatch processes by choosing the correct sequence to minimize average waiting time and keep the system responsive!",
            instructions: "Enter the game mode and click the processes in the ready queue to schedule them. Try to reach the target average waiting time to win the level!"
        }
    },
    "semaphores": {
        title: "Semaphores & Dining Philosophers Guide",
        concept: "Semaphores are synchronization tools used to control access to shared resources. The Dining Philosophers problem models resource allocation conflicts where 5 philosophers need two shared forks (semaphores) to eat. If all pick up their left fork simultaneously, a deadlock occurs.",
        controls: {
            "Start / Pause": "Toggles automatic philosopher state simulation (thinking, hungry, eating).",
            "Step": "Advances the simulation one step to observe lock acquisition details.",
            "Reset": "Restores forks to free (1) and philosophers to thinking (0).",
            "Strategy Dropdown": "naive (deadlocks possible), asymmetric (prevents deadlock by reversing fork order for P0), or arbitrator (uses a token controller to prevent concurrent requests)."
        },
        logs: "The log logs P() (wait/acquire) and V() (signal/release) operations on each fork semaphore, along with philosopher state changes.",
        game: {
            name: "Deadlock Avoider Game",
            objective: "Act as the arbitrator and grant forks to hungry philosophers to feed them all without causing a deadlock freeze!",
            instructions: "Select a hungry philosopher and click 'Give Forks'. Prevent deadlocks by ensuring at most 4 philosophers hold forks concurrently. If a deadlock occurs, you lose points!"
        }
    },
    "bankers": {
        title: "Banker's Algorithm Guide",
        concept: "The Banker's Algorithm is a deadlock avoidance algorithm. When a process requests resources, the operating system simulates allocation to check if it leads to a 'Safe State'—meaning there exists a sequence in which all processes can eventually finish without running out of resources.",
        controls: {
            "Run Safety Algorithm": "Runs the safety verification sequence to check if the current state is safe.",
            "Request Resources": "Submits a request vector for a selected process to verify if it can be approved.",
            "Reset Matrices": "Restores the Allocation, Max Need, and Available resource matrices to defaults."
        },
        logs: "Logs vector comparisons (Need <= Work) step-by-step. If a process can finish, its allocated resources are returned to the Work pool.",
        game: {
            name: "Safe State Planner Game",
            objective: "Play the role of the banker! Approve requests that keep the system in a safe state, and deny unsafe requests that cause deadlocks.",
            instructions: "Processes will submit resource request vectors. Run safety checks and click 'Approve' or 'Deny'. Keep the system running without deadlock to increase your score!"
        }
    },
    "page-replacement": {
        title: "Page Replacement Guide",
        concept: "When virtual memory pages are requested but not in physical frames, a 'Page Fault' occurs. Page replacement algorithms decide which physical memory page to evict. Algorithms include FIFO (First-In-First-Out), LRU (Least Recently Used), and Optimal (evicts page that won't be used for the longest time).",
        controls: {
            "Run": "Iterates through the reference string to demonstrate page hits and misses.",
            "Reset": "Clears memory frames, page hit/miss counters, and page fault rates.",
            "Reference String Input": "Custom comma-separated list of page numbers representing memory requests."
        },
        logs: "Logs page request hits, fault evictions (e.g. 'Page X evicted for Page Y'), and current frame updates.",
        game: {
            name: "Page Fault Minimizer",
            objective: "Manually evict pages from the limited physical memory frames to achieve the lowest page fault rate!",
            instructions: "When a page fault occurs, click on one of the active pages in the memory frames to evict it and load the incoming page. Try to anticipate future page requests to mimic the Optimal algorithm!"
        }
    },
    "memory-allocation": {
        title: "Memory Allocation Guide",
        concept: "Operating systems allocate memory blocks to processes. Strategies include First Fit (places process in the first block that is large enough), Best Fit (places process in the block that leaves the least leftover space), and Worst Fit (places process in the largest block, leaving the largest leftover space).",
        controls: {
            "Allocate": "Attempts to allocate memory for the next process size in the queue.",
            "Deallocate": "Frees memory occupied by a process, merging adjacent free blocks (coalescing).",
            "Strategy": "Toggle between First Fit, Best Fit, and Worst Fit algorithms."
        },
        logs: "Logs details of searched blocks, fragmentation leftovers, coalesced blocks, and successful allocations.",
        game: {
            name: "Memory Fit Master",
            objective: "Manually allocate and deallocate memory blocks to fit all incoming processes without running out of contiguous memory!",
            instructions: "Processes of varying sizes will arrive. Click on a free memory block to allocate it to the process. Deallocate completed processes and manage fragmentation!"
        }
    },
    "deadlock-detection": {
        title: "Deadlock Detection Guide",
        concept: "Unlike avoidance, deadlock detection lets the system run normal resource allocations, periodically executing cycle detection algorithms (like Tarjan's or DFS) on a Resource Allocation Graph (RAG) to locate deadlocks.",
        controls: {
            "Detect Deadlock": "Runs DFS cycle detection on the graph, highlighting deadlocked cycles in red.",
            "Add Node / Edge": "Lets you draw custom processes (P) and resources (R) with allocation or request edges.",
            "Reset Graph": "Clears the active graph elements."
        },
        logs: "Logs the search paths of the cycle detector, listing visited nodes, back-edges, and detected circular waits.",
        game: {
            name: "Deadlock Resolver Game",
            objective: "Locate circular waits and resolve deadlocks by terminating processes or revoking resource allocations with minimal penalty!",
            instructions: "A complex resource graph will load. Scan for cycles. Click 'Resolve' and select which processes to terminate to restore the system to normal operations."
        }
    },
    "process-sync": {
        title: "Process Synchronization Guide",
        concept: "Coordinates concurrent threads using Mutex Locks and Condition Variables to prevent race conditions, famously modeled by the Producer-Consumer problem where producers write to a shared bounded buffer and consumers read from it.",
        controls: {
            "Start / Pause": "Toggles automatic producer and consumer thread execution.",
            "Produce / Consume": "Manually triggers a producer/consumer operation on the buffer.",
            "Buffer Size Slider": "Adjusts the capacity of the shared bounded queue."
        },
        logs: "Logs lock acquisitions, buffer condition checks (e.g. 'Buffer Full - Producer waiting'), and thread wakeups.",
        game: {
            name: "Synchronization Master",
            objective: "Adjust production/consumption rates and buffer capacities to maximize throughput without causing thread starvation or buffer overflows!",
            instructions: "Manage the buffer load dynamically. Click speed controls or manually produce/consume to keep the buffer at optimal occupancy (around 50%) without blocking either thread!"
        }
    },
    "bfs": {
        title: "Breadth-First Search (BFS) Guide",
        concept: "BFS is a graph traversal algorithm that explores nodes level by level, visiting all neighbor nodes at the current depth before moving to the next level. It uses a FIFO Queue and guarantees the shortest path in unweighted graphs.",
        controls: {
            "Run BFS": "Starts traversing from the selected start node.",
            "Step": "Advances the traversal queue operations one step at a time.",
            "Add Node / Edge": "Draws nodes and connections to build a custom graph.",
            "Speed Slider": "Controls animation speed."
        },
        logs: "Logs node visitations, neighbor scanning, queue pushes, and queue pops in real-time.",
        game: {
            name: "Shortest Path Finder",
            objective: "Find the shortest path to target nodes by matching the level-order traversal steps of the BFS algorithm!",
            instructions: "Click on nodes in the exact level-order BFS sequence starting from node A. Complete the traversal in minimum clicks!"
        }
    },
    "dfs": {
        title: "Depth-First Search (DFS) Guide",
        concept: "DFS explores graph nodes by going as deep as possible along each branch before backtracking. It uses a LIFO Stack (or recursion) and is ideal for topological sorting, cycle detection, and maze solving.",
        controls: {
            "Run DFS": "Starts deep traversal from the start node.",
            "Step": "Advances stack push/pop steps.",
            "Reset": "Restores graph nodes to unvisited state."
        },
        logs: "Logs active recursion stack pushes, backtracks, and visited nodes.",
        game: {
            name: "Backtrack Master",
            objective: "Trace the DFS traversal path correctly, remembering when to backtrack!",
            instructions: "Click nodes in the exact LIFO order of DFS. When reaching a dead-end, click the correct parent node to backtrack."
        }
    },
    "dijkstra": {
        title: "Dijkstra's Pathfinding Guide",
        concept: "Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative weights. It uses a priority queue to repeatedly select the unvisited node with the smallest tentative distance.",
        controls: {
            "Run Dijkstra": "Animates shortest-path search, drawing edge relaxation.",
            "Step": "Relaxes the next node's edges.",
            "Add Weighted Edge": "Draws connections with custom weight values."
        },
        logs: "Logs distance table updates, edge relaxations (e.g. 'Dist to B reduced from 10 to 6 via A'), and priority queue extracts.",
        game: {
            name: "Dijkstra's Runner",
            objective: "Relax node distances manually and find the shortest path to all nodes in record time!",
            instructions: "Select nodes in the order of their relaxed distances. Update neighbor distances on the screen and find the shortest path route!"
        }
    },
    "astar": {
        title: "A* Pathfinding Guide",
        concept: "A* is an advanced pathfinding algorithm that improves on Dijkstra's by using heuristics (estimated distance to goal) to search the graph more efficiently. It evaluates nodes using f(n) = g(n) + h(n), where g is the path cost and h is the heuristic cost.",
        controls: {
            "Run A*": "Starts path search from start to goal.",
            "Step": "Steps through open and closed list updates.",
            "Obstacles Grid": "Click/drag to draw walls that the pathfinder must navigate around."
        },
        logs: "Logs f(n), g(n), and h(n) values for visited cells, open list additions, and target detection.",
        game: {
            name: "Maze Runner",
            objective: "Draw obstacles to challenge the A* pathfinder and try to guess the most efficient path it will select!",
            instructions: "Build a maze, select start/goal nodes, and try to draw the path yourself before clicking Run to see how A* optimizes the path."
        }
    },
    "bellman-ford": {
        title: "Bellman-Ford Guide",
        concept: "Bellman-Ford computes shortest paths from a single source to all vertices, relaxing all edges V-1 times. Unlike Dijkstra's, it supports negative edge weights and detects negative cycles (which render shortest paths impossible).",
        controls: {
            "Run": "Runs the relaxation loops.",
            "Reset": "Resets distance tables."
        },
        logs: "Logs relaxation loops, showing edge weight updates and cycle checks.",
        game: {
            name: "Negative Cycle Finder",
            objective: "Identify if the loaded graph contains a negative cycle before Bellman-Ford flags it!",
            instructions: "Look at the edge weights. If a loop's weights sum to less than 0, flag it as a negative cycle to score points!"
        }
    },
    "mst": {
        title: "Minimum Spanning Tree (Prim's) Guide",
        concept: "Prim's algorithm finds a Minimum Spanning Tree (MST) for a weighted, undirected graph—connecting all vertices with the minimum total edge weight without cycles. It builds the tree node-by-node, picking the cheapest edge connecting to the active tree.",
        controls: {
            "Run": "Starts Prim's MST construction.",
            "Step": "Adds the next cheapest edge."
        },
        logs: "Logs edge weights checked, MST updates, and node connections.",
        game: {
            name: "MST Builder",
            objective: "Construct the Minimum Spanning Tree manually by selecting the correct cheapest edges!",
            instructions: "Click on the available edges that connect to the current tree. Make sure to pick the smallest edge weight and avoid creating cycles!"
        }
    },
    "kruskal": {
        title: "Minimum Spanning Tree (Kruskal's) Guide",
        concept: "Kruskal's algorithm finds the Minimum Spanning Tree by sorting all edges from cheapest to most expensive, and adding them one-by-one if they don't form a cycle, using a Disjoint Set Union (DSU) structure.",
        controls: {
            "Run": "Animates Kruskal's edge joining.",
            "Step": "Evaluates the next sorted edge."
        },
        logs: "Logs edges sorted by weight, and checks if edge insertion forms a cycle.",
        game: {
            name: "Union Find Master",
            objective: "Select edges in sorted order to build the MST without creating closed loops!",
            instructions: "Click edges in ascending weight order. Skip edges that connect already-connected components!"
        }
    },
    "topo": {
        title: "Topological Sort Guide",
        concept: "Topological Sort orders vertices of a Directed Acyclic Graph (DAG) linearly such that for every directed edge U -> V, U comes before V. It is widely used in task scheduling and compiling (dependency resolution).",
        controls: {
            "Run": "Runs Kahn's algorithm or DFS topological sort.",
            "Step": "Dequeues nodes with 0 in-degree."
        },
        logs: "Logs node in-degrees, queue status, and sorted output sequence.",
        game: {
            name: "Task Scheduler",
            objective: "Order the tasks manually by resolving their dependencies correctly!",
            instructions: "Click on nodes that have no remaining incoming arrows (dependencies). Order all tasks successfully to win!"
        }
    },
    "cycle-detection": {
        title: "Cycle Detection Guide",
        concept: "Finds cycles in directed or undirected graphs using DFS or Union-Find. In directed graphs, a cycle exists if a back-edge points to an ancestor node in the current recursion stack.",
        controls: {
            "Run": "Starts cycle check.",
            "Step": "Steps through node color codes (unvisited, visiting, completed)."
        },
        logs: "Logs recursion steps, checking if neighbors are currently in the active DFS stack.",
        game: {
            name: "Cycle Inspector",
            objective: "Find the cycle loop in the graph manually before the algorithm completes!",
            instructions: "Trace the arrows. Once you spot a closed loop, click on the nodes forming the cycle to report it!"
        }
    },
    "bubble": {
        title: "Bubble Sort Guide",
        concept: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order, 'bubbling' the largest elements to the end of the array. Time Complexity: O(N^2).",
        controls: {
            "Run / Pause": "Toggles sorting animation.",
            "Reset": "Generates a new random array.",
            "Speed Slider": "Speeds up or slows down array element swaps."
        },
        logs: "Logs index comparisons, swap actions, and marks sorted items.",
        game: {
            name: "Swap Master",
            objective: "Sort the array manually in the minimum number of swaps!",
            instructions: "Click on adjacent bars that are out of order to swap them. Bubble them up to the right position!"
        }
    },
    "selection": {
        title: "Selection Sort Guide",
        concept: "Selection Sort divides the array into sorted and unsorted parts. It repeatedly finds the minimum element from the unsorted part and swaps it to the beginning. Time Complexity: O(N^2).",
        controls: {
            "Run": "Animates selection searches and swaps."
        },
        logs: "Logs searches, tracking the current minimum index found, and final segment swaps.",
        game: {
            name: "Min Selector",
            objective: "Select the minimum item of the unsorted segment and swap it to place!",
            instructions: "Click the minimum item in the unsorted section, then click the target index to swap it."
        }
    },
    "insertion": {
        title: "Insertion Sort Guide",
        concept: "Insertion Sort builds the final sorted array one item at a time by inserting each new element into its proper position within the already sorted sub-array. Time Complexity: O(N^2).",
        controls: {
            "Run": "Animates insertion shifts."
        },
        logs: "Logs elements selected and their shifts back through the sorted segment.",
        game: {
            name: "Insert Card",
            objective: "Insert elements into the correct sorted position manually!",
            instructions: "Drag or select an element and place it in its correct relative sorted position in the left sub-array."
        }
    },
    "merge": {
        title: "Merge Sort Guide",
        concept: "Merge Sort is a Divide-and-Conquer algorithm. It recursively splits the array into halves, sorts them, and merges them back together. Time Complexity: O(N log N).",
        controls: {
            "Run": "Animates recursive splitting and merging panels."
        },
        logs: "Logs divide coordinates and merge comparisons.",
        game: {
            name: "Merge Master",
            objective: "Merge two sorted sub-arrays into a single sorted array by picking the smallest items!",
            instructions: "Compare the front items of the two merging lists and click the smaller one to place it in the merged output."
        }
    },
    "quick": {
        title: "Quick Sort Guide",
        concept: "Quick Sort selects a 'pivot' element and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. Time Complexity: O(N log N).",
        controls: {
            "Run": "Starts partition sorting."
        },
        logs: "Logs pivot selection, low/high pointers, and partition index swaps.",
        game: {
            name: "Pivot Partition",
            objective: "Sort elements around the chosen pivot manually!",
            instructions: "For the selected pivot, place all smaller elements to its left and larger elements to its right."
        }
    },
    "radix-bucket": {
        title: "Radix & Bucket Sort Guide",
        concept: "Non-comparison sorting algorithms. Radix Sort processes numbers digit by digit (from least to most significant) using counting sort. Bucket Sort distributes elements into buckets, which are then sorted individually.",
        controls: {
            "Run": "Steps through digit distributions or bucket collections."
        },
        logs: "Logs digit places (1s, 10s, 100s) and bucket assignments.",
        game: {
            name: "Bucket Classifier",
            objective: "Distribute elements into the correct buckets based on range or digit values!",
            instructions: "Click on numbers and place them in the correct bucket ranges as quickly as possible!"
        }
    },
    "binary-search": {
        title: "Binary Search Guide",
        concept: "Binary Search finds a target value in a sorted array by repeatedly dividing the search interval in half, comparing the target to the middle element. Time Complexity: O(log N).",
        controls: {
            "Run": "Starts interval splits.",
            "Target Input": "The value you want the search to find."
        },
        logs: "Logs low, mid, and high index pointers and comparisons.",
        game: {
            name: "High-Low Guesser",
            objective: "Guess the target number in minimum steps using binary search intervals!",
            instructions: "Guess target values. The game will output Higher/Lower. Always choose the exact midpoint to win optimally!"
        }
    },
    "recursion": {
        title: "Recursion Tree Guide",
        concept: "Recursion trees visualize function call branching. It shows how a problem is broken down into sub-problems (e.g. Fibonacci or Factorial), tracking the call stack and return values.",
        controls: {
            "Run": "Toggles animation of the calling tree.",
            "Function Input": "The parameters (e.g. N = 5 for Fib(N))."
        },
        logs: "Logs call stack pushes, parameter evaluations, and computed return values.",
        game: {
            name: "Stack Builder",
            objective: "Predict the return value of the recursive calls before they compute!",
            instructions: "Look at the call node. Enter the correct value returned by its child calls to build the tree!"
        }
    },
    "dp": {
        title: "Dynamic Programming Guide",
        concept: "Dynamic Programming solves complex problems by breaking them into overlapping sub-problems, storing results in memory (Memoization / Tabulation) to avoid redundant calculations. Time Complexity is reduced from O(2^N) to O(N).",
        controls: {
            "Run": "Steps through the memoized matrix/table updates."
        },
        logs: "Logs state lookups, cache hits (e.g. 'Fib(3) retrieved from cache'), and table computations.",
        game: {
            name: "Cache Filler",
            objective: "Fill the memoization cache table manually to speed up computation!",
            instructions: "Click on cells in the DP table and write the correct sub-problem solution based on adjacent cells."
        }
    },
    "trie": {
        title: "Trie (Prefix Tree) Guide",
        concept: "A Trie is a tree structure used for storing strings. Each node represents a prefix, making search and auto-complete lookups extremely fast: O(L) where L is string length.",
        controls: {
            "Insert Word": "Adds a string node-by-node into the Trie.",
            "Clear Trie": "Deletes all trie nodes."
        },
        logs: "Logs prefix checks, node creations, and End-Of-Word marks.",
        game: {
            name: "Prefix Matcher",
            objective: "Identify if words share a prefix and connect them in the trie graph!",
            instructions: "Given a list of words, find the common prefixes and draw the nodes correctly."
        }
    },
    "heap": {
        title: "Binary Heap Guide",
        concept: "A Heap is a complete binary tree maintaining the Heap Property: parent nodes are always larger than (Max-Heap) or smaller than (Min-Heap) their children, enabling O(1) minimum/maximum extracts.",
        controls: {
            "Insert": "Pushes a value and bubbles it up (heapify-up).",
            "Extract Max/Min": "Removes root and bubbles down the replacement (heapify-down)."
        },
        logs: "Logs element insertions, array index mappings, and heapify bubble swaps.",
        game: {
            name: "Heapify Bubble",
            objective: "Swap nodes manually to restore the heap property after insertion or deletion!",
            instructions: "Look at the mismatched nodes. Click and drag nodes to swap them until parent-child rules are satisfied."
        }
    },
    "avl": {
        title: "AVL Balanced Tree Guide",
        concept: "AVL is a self-balancing Binary Search Tree. The heights of two child sub-trees of any node differ by at most one. If they differ by more, tree rotations are performed (LL, RR, LR, RL) to rebalance the tree.",
        controls: {
            "Insert / Delete": "Performs BST edits and displays balance factors.",
            "Balance Factors": "Shows height difference (Left height - Right height) for every node."
        },
        logs: "Logs balance factor calculations and details rotation types performed.",
        game: {
            name: "Balance Rotator",
            objective: "Perform rotations manually to rebalance the AVL tree after insertions!",
            instructions: "Locate nodes with balance factors > 1 or < -1. Click on the node and select the correct rotation direction!"
        }
    },
    "bst": {
        title: "Binary Search Tree Guide",
        concept: "BST is a binary tree where left child nodes are smaller than the parent, and right child nodes are larger. This structure provides fast search, insertion, and deletion: O(log N) average.",
        controls: {
            "Insert / Search / Delete": "Steps through standard BST actions."
        },
        logs: "Logs key comparisons (e.g. '5 < 10, search left') and node replacements.",
        game: {
            name: "BST Validator",
            objective: "Rearrange nodes to restore correct Binary Search Tree sorting properties!",
            instructions: "Identify nodes that violate left-smaller or right-larger rules, and move them to correct spots."
        }
    },
    "stack-queue": {
        title: "Stack & Queue Guide",
        concept: "Fundamental data structures. Stacks use Last-In-First-Out (LIFO) order (via Push/Pop). Queues use First-In-First-Out (FIFO) order (via Enqueue/Dequeue).",
        controls: {
            "Push / Enqueue": "Adds an element to the LIFO stack top or FIFO queue back.",
            "Pop / Dequeue": "Removes from stack top or queue front."
        },
        logs: "Logs pointer indexes (top, front, rear) and active counts.",
        game: {
            name: "Buffer Flow Game",
            objective: "Manage task queues to process requests without stack overflows or queue timeouts!",
            instructions: "Enqueue incoming tasks. Dequeue them before they expire. Keep the stack/queue size below max limit!"
        }
    },
    "linked-list": {
        title: "Linked List Guide",
        concept: "A Linked List is a linear data structure where elements are stored in nodes. Each node contains a data field and a pointer (next reference) to the next node in the sequence.",
        controls: {
            "Add Node / Insert At": "Creates a new node and updates pointer linkages.",
            "Remove Node / Remove At": "Deallocates nodes and updates previous node pointers."
        },
        logs: "Logs pointer updates (e.g. 'Node A next pointer updated to point to Node C').",
        game: {
            name: "Pointer Joiner",
            objective: "Update node pointers manually to insert or remove items in the list successfully!",
            instructions: "Click on a node's pointer arrow and drag it to the correct target node to link them. Avoid dangling pointers!"
        }
    },
    "minimax": {
        title: "Minimax & Alpha-Beta Guide",
        concept: "Minimax is a decision-making algorithm in game theory. It maximizes own score (MAX) and minimizes opponent's score (MIN). Alpha-Beta Pruning speeds up execution by cutting off decision tree branches that are guaranteed to be worse than previously evaluated choices.",
        controls: {
            "Run Minimax": "Evaluates full tree values.",
            "Run Alpha-Beta": "Runs pruning evaluation, drawing pruned lines.",
            "New Tree": "Generates a new random decision tree."
        },
        logs: "Logs minimax evaluations, alpha/beta values, and pruning decisions.",
        game: {
            name: "Alpha-Beta Pruner",
            objective: "Identify which branches of the tree will be pruned before running the algorithm!",
            instructions: "Look at the evaluated node values. Click on branches that you believe the AI will prune to score points!"
        }
    },
    "linear-regression": {
        title: "Linear Regression Guide",
        concept: "Linear Regression finds the linear relationship (y = mx + c) between independent (x) and dependent (y) variables by fitting a straight trendline through data points, minimizing mean squared error (MSE).",
        controls: {
            "Train / Fit Line": "Performs Gradient Descent steps to adjust slope and intercept.",
            "Click Canvas": "Places custom coordinate training points."
        },
        logs: "Logs loss values (MSE), slope (m), and intercept (c) changes at each epoch.",
        game: {
            name: "Line Fitter",
            objective: "Adjust the slope and intercept dials manually to fit the data points with minimum error!",
            instructions: "Rotate the dials to align the line through the centers of the points. Check if your manual loss beats the machine!"
        }
    },
    "knn": {
        title: "K-Nearest Neighbors (KNN) Guide",
        concept: "KNN is a classification algorithm. A new data point is classified by calculating the distance to all training points and assigning the label most common among its 'K' nearest neighbors.",
        controls: {
            "Classify": "Calculates distance circles to find nearest neighbors.",
            "K-Value Slider": "Adjusts neighbor threshold count (K)."
        },
        logs: "Logs distances, sorted neighbor labels, and final voting percentages.",
        game: {
            name: "Point Classifier",
            objective: "Predict the correct class of the new query point before KNN runs!",
            instructions: "Look at the query point, scan nearby colored clusters, count the neighbors, and click the correct class button!"
        }
    },
    "kmeans": {
        title: "K-Means Clustering Guide",
        concept: "K-Means is an unsupervised clustering algorithm. It groups data points into 'K' clusters by iteratively assigning points to the nearest centroid, and recalculating centroids until convergence.",
        controls: {
            "Run K-Means": "Runs cluster iterations.",
            "Step": "Updates assignments or centroids one step.",
            "K-Centroids": "Adjusts cluster count (K)."
        },
        logs: "Logs centroid coordinate recalculations and point assignment swaps.",
        game: {
            name: "Centroid Balancer",
            objective: "Move centroids manually to align with cluster centers in minimum iterations!",
            instructions: "Click and drag centroids to the visual center of clusters. Try to achieve perfect convergence in fewer steps than the computer!"
        }
    },
    "perceptron": {
        title: "Perceptron Guide",
        concept: "A Perceptron is a single-layer artificial neuron. It classifies inputs by calculating a weighted sum and applying an activation function, updating weights based on error margins.",
        controls: {
            "Train": "Steps through weight adjustments on training points.",
            "Reset Weights": "Randomizes weight settings."
        },
        logs: "Logs input weights, biases, classification errors, and delta adjustments.",
        game: {
            name: "Weight Tuner",
            objective: "Tune weights and bias manually to draw a decision boundary line separating red and blue dots!",
            instructions: "Drag weight sliders to rotate and shift the boundary line until all red dots are on one side and blue dots on the other."
        }
    }
};

// Export to window
window.AlgoGuidesDatabase = AlgoGuidesDatabase;
