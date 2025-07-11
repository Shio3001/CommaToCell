const buildArray = (
  values: string[][],
  baseX: number,
  width: number,
  cellId: number,
  fontSize: number,
  height: number,
  yIndex = 80,
  yCell = 110,
  yMargin = 10,
  comment = "data[]"
): {
  indexes: string[];
  cells: string[];
} => {
  const indexes: string[] = [];
  const cells: string[] = [];
  const maxIdx = Math.max(...values.map((row) => row.length));
  for (let idx = 0; idx < maxIdx; idx++) {
    const x = baseX + idx * width;
    indexes.push(`
      <mxCell id="${cellId++}"
              value="${idx}"
              style="text;html=1;align=center;verticalAlign=middle;
                     resizable=0;autosize=1;strokeColor=none;fillColor=none;"
              vertex="1" parent="1">
        <mxGeometry x="${x + width / 2 - 15}" y="${yIndex}" width="30" height="30" as="geometry"/>
      </mxCell>`);
  }

  values.forEach((text_line, idy) => {
    const commentCell = `<mxCell id="${cellId++}"
              value="${comment}"
              style="text;html=1;align=center;verticalAlign=middle;
                     resizable=0;autosize=1;strokeColor=none;fillColor=none;"
              vertex="1" parent="1">
        <mxGeometry x="${90 - width * 1.5}" y="${(height + yMargin) * idy + yCell}"
                    width="${width * 1.5}" height="${height}" as="geometry"/>
      </mxCell>`;

    cells.push(commentCell);

    text_line.forEach((text, jdx) => {
      const x = baseX + jdx * width;
      const y = (height + yMargin) * idy + yCell;

      if (text === "/") {
        cells.push(`
          <mxCell id="${cellId++}"
                  style="whiteSpace=wrap;html=1;aspect=fixed;
                         align=center;verticalAlign=middle;"
                  vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
          </mxCell>`);
        cells.push(`
          <mxCell id="${cellId++}" style="endArrow=none;html=1;rounded=0;" edge="1" parent="1">
            <mxGeometry width="1" height="1" relative="1" as="geometry">
              <mxPoint x="${x}" y="${y + height}" as="sourcePoint"/>
              <mxPoint x="${x + width}" y="${y}" as="targetPoint"/>
            </mxGeometry>
          </mxCell>`);
      } else {
        const numberVal = `&lt;div style=&quot;font-size:${fontSize}px;text-align:center;&quot;&gt;${text}&lt;/div&gt;`;
        cells.push(`
          <mxCell id="${cellId++}" value="${numberVal}"
                  style="whiteSpace=wrap;html=1;aspect=fixed;
                         align=center;verticalAlign=middle;"
                  vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
          </mxCell>`);
      }
    });
  });

  return {
    indexes: indexes,
    cells: cells,
  };
};
const buildBinaryTree = (
  sequenceSize: number,
  values: string[][],
  baseX: number,
  width: number,
  cellId: number,
  fontSize: number,
  height: number
): {
  cells: string[];
  indexes: string[];
} => {
  const cells: string[] = [];
  const indexes: string[] = [];

  const levelHeight = sequenceSize + 20;
  const heapSpacingY = 220;
  const centerX = 600;

  const getHeapX = (index: number): number => {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (2 ** level - 1);
    const x = centerX + (posInLevel - 2 ** (level - 1) / 2) * width * 2;
    return x;
  };

  const getHeapPos = (
    index: number,
    heapIdx: number
  ): {
    x: number;
    y: number;
  } => {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (2 ** level - 1);
    const x = centerX + (posInLevel - 2 ** (level - 1) / 2) * width * 2;
    const y = baseX + heapIdx * heapSpacingY + level * levelHeight;
    return {
      x: x,
      y: y,
    };
  };

  values.forEach((heapLine, heapIdx) => {
    const nodeIds: string[] = [];

    // ヒープラベルの作成 (a), (b), ...
    const heapLabel = String.fromCharCode(97 + heapIdx); // 97 = 'a'
    const labelText = `(${heapLabel})`;
    //heapLine の2次元目の indexが最大の値でlabelXを計算
    const maxIndex = Math.max(...heapLine.map((line) => line.length));

    const labelX = centerX - getHeapX(maxIndex) / 2;
    const labelY = baseX + heapIdx * heapSpacingY - levelHeight / 1.5;

    cells.push(`
    <mxCell id="${cellId++}"
      value="${labelText}"
      style="text;html=1;fontSize=${fontSize};align=center;verticalAlign=middle;strokeColor=none;fillColor=none;"
      vertex="1" parent="1">
      <mxGeometry x="${labelX}" y="${labelY}" width="${width}" height="${height}" as="geometry"/>
    </mxCell>`);

    heapLine.forEach((text, index) => {
      const { x, y } = getHeapPos(index, heapIdx);

      const id = cellId++;
      nodeIds.push(id.toString());

      cells.push(`
      <mxCell id="${id}" value="&lt;div style=&quot;font-size:${fontSize}px;text-align:center;&quot;&gt;${text}&lt;/div&gt;"
        style="shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;align=center;verticalAlign=middle;" vertex="1" parent="1">
        <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
      </mxCell>`);

      if (index > 0) {
        const parentIdx = Math.floor((index - 1) / 2);
        const parentId = nodeIds[parentIdx];
        cells.push(`
      <mxCell id="${cellId++}" style="endArrow=none;html=1;" edge="1" parent="1" source="${parentId}" target="${id}">
        <mxGeometry relative="1" as="geometry"/>
      </mxCell>`);
      }
    });
  });

  return {
    cells,
    indexes,
  };
};

const buildTreeFromAdjacencyList = (
  labels: string[],
  edgesRaw: string,
  baseY: number,
  width: number,
  height: number,
  fontSize: number,
  cellIdStart: number
): { cells: string[] } => {
  const cells: string[] = [];
  let cellId = cellIdStart;

  const nodeIds: string[] = [];
  const edges: Map<number, number[]> = new Map();
  const parents = new Array(labels.length).fill(null);

  // 隣接リスト解析
  const edgeList = edgesRaw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const entry of edgeList) {
    const [srcStr, dstStr] = entry.split(":").map((s) => s.trim());
    if (!srcStr || !dstStr) continue;
    const src = parseInt(srcStr);
    const dstList = dstStr.split(",").map((s) => parseInt(s));
    edges.set(src, dstList);
    dstList.forEach((dst) => (parents[dst] = src));
  }

  // ルートノード（親がいない）を探す
  const roots = labels.map((_, i) => i).filter((i) => parents[i] === null);

  // 各ノードの深さとX位置を決定
  const nodePositions: { [id: number]: { x: number; y: number } } = {};
  let globalX = 0;
  const levelHeight = height + 40;

  const assignPos = (id: number, depth: number) => {
    const children = edges.get(id) || [];

    if (children.length === 0) {
      nodePositions[id] = {
        x: globalX++ * (width + 40),
        y: baseY + depth * levelHeight,
      };
    } else {
      children.forEach((child) => assignPos(child, depth + 1));
      const childXs = children.map((child) => nodePositions[child].x);
      const avgX = (Math.min(...childXs) + Math.max(...childXs)) / 2;
      nodePositions[id] = {
        x: avgX,
        y: baseY + depth * levelHeight,
      };
    }
  };

  roots.forEach((root) => assignPos(root, 0));

  // ノード描画
  labels.forEach((label, i) => {
    const pos = nodePositions[i];
    nodeIds[i] = cellId.toString();
    cells.push(`
<mxCell id="${cellId++}" value="&lt;div style=&quot;font-size:${fontSize}px;text-align:center;&quot;&gt;${label}&lt;/div&gt;"
  style="shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;align=center;verticalAlign=middle;"
  vertex="1" parent="1">
  <mxGeometry x="${pos.x}" y="${pos.y}" width="${width}" height="${height}" as="geometry"/>
</mxCell>`);
  });

  // エッジ描画
  for (const [src, dsts] of edges.entries()) {
    for (const dst of dsts) {
      cells.push(`
<mxCell id="${cellId++}" style="endArrow=block;html=1;" edge="1" parent="1" source="${nodeIds[src]}" target="${nodeIds[dst]}">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>`);
    }
  }

  return { cells };
};

const downloadHorizontalTable = (e: MouseEvent): void => {
  const rawValues = (document.getElementById("comma_input") as HTMLInputElement).value;
  const values = rawValues.split("\n").map((r) =>
    r
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
  );

  const sequenceSize = Number((document.getElementById("square_size_input") as HTMLInputElement).value) || 40;
  const fontSize = Number((document.getElementById("font_size_input") as HTMLInputElement).value) || 25;
  const comment = (document.getElementById("comment_input") as HTMLInputElement).value;
  const mode = (document.getElementById("output_mode") as HTMLInputElement)?.value || "horizontal";

  const baseX = 90;
  const width = sequenceSize;
  const height = sequenceSize;
  const yIndex = 80;
  const yCell = 110;
  const yMargin = 10;

  let cellId = 2;

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="Generated">
    <mxGraphModel grid="1" gridSize="10" page="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
`;

  const xmlFooter = `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  const handle = (
    mode: string
  ): {
    cells: string[];
    indexes: string[];
    filename: string;
  } => {
    switch (mode) {
      case "horizontal":
        return {
          ...buildArray(values, baseX, width, cellId, fontSize, height, yIndex, yCell, yMargin, comment),
          filename: "sequence.drawio.xml",
        };
      case "heap":
        return {
          ...buildBinaryTree(sequenceSize, values, baseX, width, cellId, fontSize, height),
          filename: "heap_tree.drawio.xml",
        };
      case "tree":
        const labelLine = values[0] || [];
        const edgeLineRaw = rawValues.split("\n")[1] || "";
        return {
          ...buildTreeFromAdjacencyList(labelLine, edgeLineRaw, 100, sequenceSize, sequenceSize, fontSize, cellId),
          indexes: [],
          filename: "tree.drawio.xml",
        };
      default:
        return {
          cells: [],
          indexes: [],
          filename: "unknown_mode.drawio.xml",
        };
    }
  };

  const { indexes, cells, filename } = handle(mode);

  const fullXml = xmlHeader + indexes.join("\n") + "\n" + cells.join("\n") + xmlFooter;
  const blob = new Blob([fullXml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

document.getElementById("download-button")?.addEventListener("click", (e: MouseEvent) => {
  downloadHorizontalTable(e);
});
