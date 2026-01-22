// -----------------------------
// Tree rendering logic
// -----------------------------
function createNode(nodeData) {
  const node = document.createElement("div");
  node.className = "tree-node";

  const box = document.createElement("div");
  box.className = "node-box";

  // Title
  const titleEl = document.createElement("div");
  titleEl.style.fontWeight = "bold";
  titleEl.style.marginBottom = "6px";
  titleEl.textContent = nodeData.title;
  box.appendChild(titleEl);

  // Multi-line details (PDF-style)
  if (nodeData.details) {
    nodeData.details.forEach(line => {
      const lineEl = document.createElement("div");
      lineEl.textContent = line;
      box.appendChild(lineEl);
    });
  }

  node.appendChild(box);

  let expanded = false;
  let childrenContainer = null;

  box.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!nodeData.children) return;

    if (!expanded) {
      childrenContainer = document.createElement("div");
      childrenContainer.className = "children";

      nodeData.children.forEach(child => {
        childrenContainer.appendChild(createNode(child));
      });

      node.appendChild(childrenContainer);
      expanded = true;
    } else {
      node.removeChild(childrenContainer);
      childrenContainer = null;
      expanded = false;
    }
  });

  return node;
}

// -----------------------------
// Load tree from JSON
// -----------------------------
function loadTree(jsonPath) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(treeData => {
      const container = document.getElementById("tree-container");
      container.innerHTML = "";
      container.appendChild(createNode(treeData));
    })
    .catch(err => {
      console.error("Failed to load tree:", err);
    });
}
