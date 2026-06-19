// BST Content
window.AlgoContentSystem.prototype.addBSTContent = function() {
    this.content.set('bst', {
        title: 'Binary Search Tree (BST)',
        definition: 'A binary tree where left subtree contains nodes with keys less than parent, right subtree contains nodes with keys greater than parent.',
        usage: 'Fast searching, dynamic sorting, database indexing, expression parsing.',
        complexity: {
            time: 'O(log n) avg, O(n) worst',
            space: 'O(n)',
            stable: 'N/A',
            inPlace: 'No'
        },
        proscons: {
            pros: ['Fast search/insert/delete', 'Maintains sorted order', 'Dynamic size', 'In-order gives sorted sequence'],
            cons: ['Can become unbalanced', 'Worst case O(n) operations', 'No constant time operations']
        },
        code: {
            python: `class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)`,
            cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else
        root->right = insert(root->right, val);
    return root;
}

TreeNode* search(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val)
        return search(root->left, val);
    return search(root->right, val);
}`,
            java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val)
        root.left = insert(root.left, val);
    else
        root.right = insert(root.right, val);
    return root;
}

public TreeNode search(TreeNode root, int val) {
    if (root == null || root.val == val) return root;
    if (val < root.val)
        return search(root.left, val);
    return search(root.right, val);
}`
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.AlgoContentSystem) {
        const contentSystem = new AlgoContentSystem();
        contentSystem.addBSTContent();
    }
});