/**
 * bst.js - Binary Search Tree logic.
 */
class BSTAlgo {
    constructor(engine) {
        this.engine = engine;
        this.root = null;
    }

    insert(val) {
        const newNode = { value: val, left: null, right: null, x: 0, y: 0 };
        if (!this.root) {
            this.root = newNode;
        } else {
            this._insertNode(this.root, newNode);
        }
        this.layout();
    }

    _insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) node.left = newNode;
            else this._insertNode(node.left, newNode);
        } else {
            if (!node.right) node.right = newNode;
            else this._insertNode(node.right, newNode);
        }
    }

    layout() {
        if (!this.root) return;
        const canvasWidth = this.engine.canvas.width;
        this._computeLayout(this.root, canvasWidth / 2, 80, canvasWidth / 4);
        this.engine.draw();
    }

    _computeLayout(node, x, y, xOffset) {
        if (!node) return;
        node.x = x;
        node.y = y;
        if (node.left) this._computeLayout(node.left, x - xOffset, y + 80, xOffset / 2);
        if (node.right) this._computeLayout(node.right, x + xOffset, y + 80, xOffset / 2);
    }

    draw() {
        this._drawNode(this.root);
    }

    _drawNode(node) {
        if (!node) return;

        if (node.left) {
            this.engine.drawArrow(node.x, node.y, node.left.x, node.left.y);
            this._drawNode(node.left);
        }
        if (node.right) {
            this.engine.drawArrow(node.x, node.y, node.right.x, node.right.y);
            this._drawNode(node.right);
        }

        this.engine.drawNode(node.x, node.y, node.value);
    }
}
