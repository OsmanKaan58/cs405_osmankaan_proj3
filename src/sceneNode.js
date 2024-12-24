/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

function MatrixMult(a, b) {
  let result = new Array(16).fill(0);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
      }
    }
  }

  return result;
}

class SceneNode {
  constructor(meshDrawer, trs, parent = null) {
    this.meshDrawer = meshDrawer;
    this.trs = trs;
    this.parent = parent;
    this.children = [];

    if (parent) {
      this.parent.__addChild(this);
    }
  }

  __addChild(node) {
    this.children.push(node);
  }

  draw(mvp, modelView, normalMatrix, modelMatrix) {
    /**
     * @Task1 : Implement the draw function for the SceneNode class.
     */

    // Get the transformation matrix from the TRS object
    const transformationMatrix = this.trs.getTransformationMatrix();

    // Apply the transformation to the model matrix
    const transformedModel = MatrixMult(modelMatrix, transformationMatrix);

    // Update the other matrices accordingly
    const transformedModelView = MatrixMult(modelView, transformationMatrix);
    const transformedNormals = MatrixMult(normalMatrix, transformationMatrix);
    const transformedMvp = MatrixMult(mvp, transformationMatrix);

    // Draw the MeshDrawer
    this.meshDrawer.draw(
      transformedMvp,
      transformedModelView,
      transformedNormals,
      transformedModel
    );

    // Recursively draw all children
    for (let child of this.children) {
      child.draw(
        transformedMvp,
        transformedModelView,
        transformedNormals,
        transformedModel
      );
    }
  }
}
