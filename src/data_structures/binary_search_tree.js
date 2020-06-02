class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    let node = this._root;
    let parent;
    while (node) {
      parent = node;
      if (key < node.key) {
        node = node.left;
        parent.left = node;
      } else if (key > node.key) {
        node = node.right;
        parent.right = node;
      } else {
        node.value = value;
        return;
      }
    }

    node = new BSTNode({ key, value, parent, undefined, undefined });
    this._count += 1;

    if (parent?.key) {
      if (key < parent.key) {
        parent.left = node;
      } else {
        parent.right = node;
      }
    } else {
      this._root = node;
    }

    return node;
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  delete(key) {
    let node = this._root;
    let parent;
    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        parent = node.parent;
        break;
      }
    }

    if (!node) {
      return undefined;
    }
    let replacement;

    if (node.left && node.right) {
      let successor = node.right;
      
      if (successor.left) {
        while (successor.left) {
          successor = successor.left;
        }
        successor.parent.left = successor.right;
        if (successor.right) {
          successor.right.parent = successor.parent;
        }
        successor.right = node.right;
        node.right.parent = successor;
      }

      successor.left = node.left;
      successor.left.parent = successor;

      replacement = successor;

    } else {
      replacement = node.left ? node.left : node.right;
    }


    if (parent) {
      const direction = node === parent.left ? 'left' : 'right';
      parent[direction] = replacement;
    } else {
      this._root = replacement;
    }

    if (replacement) {
      replacement.parent = parent;
    }

    this._count -= 1;
    return node.value;
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;