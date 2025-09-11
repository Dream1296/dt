type myNode = {
  id: string;
  parent_id: string | null;
};

type NodeIndexValue = {
  selectedIndex: number;
  childCount: number;
  branchLengths: number[]; // 每个子节点的链路长度
};

type NodeIndex = Map<string, NodeIndexValue>;

function xuanran(
  dataArr: myNode[],
  root_id: string,
  vList: myNode[],
  nodeIndex: NodeIndex
): void {
  // 建立 parent -> children 的索引
  const parentMap = new Map<string, myNode[]>();
  for (const node of dataArr) {
    if (node.parent_id) {
      if (!parentMap.has(node.parent_id)) {
        parentMap.set(node.parent_id, []);
      }
      parentMap.get(node.parent_id)!.push(node);
    }
  }

  function computeBranchLength(nodeId: string): number {
    const children = parentMap.get(nodeId) || [];
    if (children.length === 0) return 1;

    // 对所有子节点递归计算长度
    const lengths = children.map(child => computeBranchLength(child.id));

    // 同时把结果写入 nodeIndex
    const currentValue = nodeIndex.get(nodeId);
    nodeIndex.set(nodeId, {
      selectedIndex: currentValue?.selectedIndex ?? 0,
      childCount: children.length,
      branchLengths: lengths,
    });

    // 当前节点的长度 = 1 + 选中子节点的长度
    const selectedIndex = nodeIndex.get(nodeId)!.selectedIndex;
    return 1 + lengths[selectedIndex];
  }

  function traverse(currentId: string) {
    const currentNode = dataArr.find(n => n.id === currentId);
    if (!currentNode) return;

    vList.push(currentNode);

    const children = parentMap.get(currentNode.id) || [];
    if (children.length === 0) return;

    const nodeInfo = nodeIndex.get(currentNode.id)!;
    const selectedIndex = nodeInfo.selectedIndex;
    traverse(children[selectedIndex].id);
  }

  // 第一步：先计算所有节点的 branchLengths 并更新 nodeIndex
  computeBranchLength(root_id);

  // 第二步：再从 root_id 开始沿着 nodeIndex.selectedIndex 生成 vList
  traverse(root_id);
}

// -------- 示例 --------
const dataArr: myNode[] = [
  { id: "a", parent_id: null },
  { id: "c", parent_id: "a" },
  { id: "q", parent_id: "c" },
  { id: "p", parent_id: "c" },
  { id: "x", parent_id: "q" },
  { id: "y", parent_id: "p" },
];

const vList: myNode[] = [];
const nodeIndex: NodeIndex = new Map();

xuanran(dataArr, "a", vList, nodeIndex);

console.log("vList:", vList.map(n => n.id));
console.log("nodeIndex:");
for (const [id, info] of nodeIndex.entries()) {
  console.log(
    id,
    "selected:", info.selectedIndex,
    "childCount:", info.childCount,
    "branchLengths:", info.branchLengths
  );
}
