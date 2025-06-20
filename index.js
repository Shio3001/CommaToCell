"use strict";
var _a;
const downloadHorizontalTable = (e) => {
    // 値の取得
    const rawValues = document.getElementById("comma_input").value;
    // 配列化
    const values = rawValues
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
    const sequenceSize = Number(document.getElementById("square_size_input").value);
    const fontSize = Number(document.getElementById("font_size_input").value);
    // レイアウト定数
    const baseX = 90;
    const y = 110;
    const width = sequenceSize;
    const height = sequenceSize;
    const spacing = 0;
    // 各セルを組み立て
    let cellId = 2;
    const cellXml = values
        .map((text, idx) => {
        const x = baseX + idx * (width + spacing);
        // フォントサイズを動的に反映し、中央に揃える
        const escapedVal = `&lt;div style=&quot;font-size:${fontSize}px;text-align:center;&quot;&gt;${text}&lt;/div&gt;`;
        return `
    <mxCell id="${cellId++}"
            value="${escapedVal}"
            style="whiteSpace=wrap;html=1;aspect=fixed;align=center;verticalAlign=middle;"
            vertex="1" parent="1">
      <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
    </mxCell>`;
    })
        .join("\n");
    // 全体 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <mxfile host="app.diagrams.net">
  <diagram name="Generated">
  <mxGraphModel grid="1" gridSize="10" page="1" pageWidth="827" pageHeight="1169">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
  ${cellXml}
  </root>
  </mxGraphModel>
  </diagram>
  </mxfile>`;
    // ダウンロード処理
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sequence.drawio.xml";
    a.click();
    URL.revokeObjectURL(url);
};
(_a = document.getElementById("download-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
    downloadHorizontalTable(e);
});
