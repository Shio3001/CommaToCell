(function(){const m=document.createElement("link").relList;if(m&&m.supports&&m.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function d(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=d(e);fetch(e.href,t)}})();const q=g=>{const d=document.getElementById("comma_input").value.split(`
`).map(o=>o.split(",").map(l=>l.trim()).filter(l=>l!=="")),s=Number(document.getElementById("square_size_input").value)||40,e=Number(document.getElementById("font_size_input").value)||25,t=document.getElementById("comment_input").value,r=90,n=s,i=s,h=0,b=80,y=110,f=10;let a=2;const c=[],$=[],z=Math.max(...d.map(o=>o.length));for(let o=0;o<z;o++){const l=r+o*(n+h);$.push(`
      <mxCell id="${a++}"
              value="${o}"
              style="text;html=1;align=center;verticalAlign=middle;
                     resizable=0;autosize=1;strokeColor=none;fillColor=none;"
              vertex="1" parent="1">
        <mxGeometry x="${l+n/2-15}"
                    y="${b}" width="30" height="30" as="geometry"/>
      </mxCell>`)}d.forEach((o,l)=>{const I=`<mxCell id="${a++}"
            value="${t}"
            style="text;html=1;align=center;verticalAlign=middle;
                   resizable=0;autosize=1;strokeColor=none;fillColor=none;"
            vertex="1" parent="1">
      <mxGeometry x="${90-n*1.5}" y="${(i+f)*l+y}"
                  width="${n*1.5}" height="${i}" as="geometry"/>
    </mxCell>`;c.push(I),o.forEach((w,O)=>{const u=r+O*(n+h),p=(i+f)*l+y;if(w==="/")c.push(`
          <mxCell id="${a++}"
                  style="whiteSpace=wrap;html=1;aspect=fixed;
                         align=center;verticalAlign=middle;"
                  vertex="1" parent="1">
            <mxGeometry x="${u}" y="${p}"
                        width="${n}" height="${i}" as="geometry"/>
          </mxCell>`),c.push(`
          <mxCell id="${a++}" style="endArrow=none;html=1;rounded=0;" edge="1" parent="1">
            <mxGeometry width="1" height="1" relative="1" as="geometry">
              <mxPoint x="${u}" y="${p+i}" as="sourcePoint"/>
              <mxPoint x="${u+n}" y="${p}" as="targetPoint"/>
            </mxGeometry>
          </mxCell>`);else{const P=`&lt;div style=&quot;font-size:${e}px;text-align:center;&quot;&gt;${w}&lt;/div&gt;`;c.push(`
        <mxCell id="${a++}"
                value="${P}"
                style="whiteSpace=wrap;html=1;aspect=fixed;
                       align=center;verticalAlign=middle;"
                vertex="1" parent="1">
          <mxGeometry x="${u}" y="${p}"
                      width="${n}" height="${i}" as="geometry"/>
        </mxCell>`)}})});const E=c.join(`
`),L=`<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="Generated">
    <mxGraphModel grid="1" gridSize="10" page="1"
                  pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
        ${$.join(`
`)}
        ${E}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,G=new Blob([L],{type:"application/xml"}),v=URL.createObjectURL(G),x=document.createElement("a");x.href=v,x.download="sequence.drawio.xml",x.click(),URL.revokeObjectURL(v)};var C;(C=document.getElementById("download-button"))==null||C.addEventListener("click",g=>{q()});
