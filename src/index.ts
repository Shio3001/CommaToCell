const downloadHorizontalTable = (e: MouseEvent): void => {
  // 値の取得
  const rawValues = (document.getElementById("comma_input") as HTMLInputElement).value;

  // 配列化
  const values = rawValues.split("\n").map((r) => {
    return r.split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "")
  });


  const sequenceSize = Number((document.getElementById("square_size_input") as HTMLInputElement).value) || 40;
  const fontSize = Number((document.getElementById("font_size_input") as HTMLInputElement).value) || 25;
  const comment = (document.getElementById("comment_input") as HTMLInputElement).value;

  // レイアウト定数
  const baseX = 90;
  const width = sequenceSize;
  const height = sequenceSize;
  const spacing = 0;

  const yIndex  =  80;  // インデックス行のY
  const yCell   = 110;  // 数値セルのY
  const yMargin = 10;

  // === 各セルを組み立て ===
  let cellId = 2;
  const cells: string[] = [];
  const indexes: string[] = [];

  const maxIdx = Math.max(...values.map(row => row.length))

  for (let idx = 0 ; idx < maxIdx ; idx ++ ){
    const x = baseX + idx * (width + spacing);
    // インデックスセル（枠なし）
    indexes.push(`
      <mxCell id="${cellId++}"
              value="${idx}"
              style="text;html=1;align=center;verticalAlign=middle;
                     resizable=0;autosize=1;strokeColor=none;fillColor=none;"
              vertex="1" parent="1">
        <mxGeometry x="${x + width / 2 - 15}"
                    y="${yIndex}" width="30" height="30" as="geometry"/>
      </mxCell>`);
  }

  values.forEach((text_line, idy) => {

    const commentCell= `<mxCell id="${cellId++}"
            value="${comment}"
            style="text;html=1;align=center;verticalAlign=middle;
                   resizable=0;autosize=1;strokeColor=none;fillColor=none;"
            vertex="1" parent="1">
      <mxGeometry x="${90 - width * 1.5}" y="${(height + yMargin) * idy + yCell}"
                  width="${width * 1.5}" height="${height}" as="geometry"/>
    </mxCell>`

    cells.push(commentCell)

    
    text_line.forEach((text , jdx) => {
      const x = baseX + jdx * (width + spacing);
      const y = (height + yMargin) * idy + yCell;
      // 数値セル（枠あり）


      if (text === '/') {
        // スラッシュ線（左下→右上）
        cells.push(`
          <mxCell id="${cellId++}"
                  style="whiteSpace=wrap;html=1;aspect=fixed;
                         align=center;verticalAlign=middle;"
                  vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}"
                        width="${width}" height="${height}" as="geometry"/>
          </mxCell>`);
        cells.push(`
          <mxCell id="${cellId++}" style="endArrow=none;html=1;rounded=0;" edge="1" parent="1">
            <mxGeometry width="1" height="1" relative="1" as="geometry">
              <mxPoint x="${x}" y="${y + height}" as="sourcePoint"/>
              <mxPoint x="${x + width}" y="${y}" as="targetPoint"/>
            </mxGeometry>
          </mxCell>`);

      }
      else{
        const numberVal = `&lt;div style=&quot;font-size:${fontSize}px;text-align:center;&quot;&gt;${text}&lt;/div&gt;`;
        cells.push(`
        <mxCell id="${cellId++}"
                value="${numberVal}"
                style="whiteSpace=wrap;html=1;aspect=fixed;
                       align=center;verticalAlign=middle;"
                vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}"
                      width="${width}" height="${height}" as="geometry"/>
        </mxCell>`);
      }

    })

  });

  // まとめて XML へ
  const cellXml = cells.join("\n");
  const indexXml = indexes.join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="Generated">
    <mxGraphModel grid="1" gridSize="10" page="1"
                  pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
        ${indexXml}
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

document.getElementById("download-button")?.addEventListener("click", (e: MouseEvent) => {
  downloadHorizontalTable(e);
});
