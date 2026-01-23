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
  titleEl.textContent = nodeData && nodeData.title != null ? String(nodeData.title) : "";
  box.appendChild(titleEl);

  // Details - robust to array OR single string OR missing
  const details = nodeData ? nodeData.details : null;

  if (Array.isArray(details)) {
    details.forEach(line => {
      const lineEl = document.createElement("div");
      lineEl.textContent = line != null ? String(line) : "";
      box.appendChild(lineEl);
    });
  } else if (typeof details === "string" && details.length > 0) {
    const lineEl = document.createElement("div");
    lineEl.textContent = details;
    box.appendChild(lineEl);
  }

  node.appendChild(box);

  let expanded = false;
  let childrenContainer = null;

  box.addEventListener("click", (e) => {
    e.stopPropagation();

    // Only expandable if children is a non-empty array
    const kids = nodeData ? nodeData.children : null;
    if (!Array.isArray(kids) || kids.length === 0) return;

    if (!expanded) {
      childrenContainer = document.createElement("div");
      childrenContainer.className = "children";

      kids.forEach(child => {
        childrenContainer.appendChild(createNode(child));
      });

      node.appendChild(childrenContainer);
      expanded = true;
    } else {
      if (childrenContainer) node.removeChild(childrenContainer);
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
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${jsonPath}`);
      return res.json();
    })
    .then(treeData => {
      const container = document.getElementById("tree-container");
      if (!container) throw new Error("Missing element with id='tree-container'");
      container.innerHTML = "";
      container.appendChild(createNode(treeData));
    })
    .catch(err => {
      console.error("Failed to load tree:", err);
    });
}
