class h{constructor(e){this.ctx=e,this.canvas=e.canvas,this.transformCoordinate()}transformCoordinate(){const{ctx:e,canvas:s}=this;e.translate(s.width/2,s.height/2),e.scale(1,-1)}drawAxis(e="#333"){const{canvas:s}=this;this.drawLine([-s.width/2,0],[s.width/2,0],e),this.drawLine([0,s.height/2],[0,-s.height/2],e)}drawLine(e,s,a,o="4px"){const{ctx:t}=this;t.beginPath(),t.save(),t.lineWidth=o,t.strokeStyle=a,t.moveTo(...e),t.lineTo(...s),t.stroke(),t.restore(),t.closePath()}drawText(e,s,a,o="#333",t="16px serif"){const{ctx:i}=this;i.beginPath(),i.save(),i.font=t,i.scale(1,-1),i.fillStyle=o,i.fillText(`${e}`,s,a),i.restore()}strokePolygon(e,s,a=!0){const{ctx:o}=this;o.beginPath(),o.moveTo(...e[0]);for(let t=1;t<e.length;t++)o.lineTo(...e[t]);a&&o.closePath(),s&&(o.strokeStyle=s),o.stroke()}fillPolygon(e,{fillStyle:s="red",close:a=!1,rule:o="nonzero"}={}){const{ctx:t}=this;t.beginPath(),t.moveTo(...e[0]);for(let i=1;i<e.length;i++)t.lineTo(...e[i]);a&&t.closePath(),t.fillStyle=s,t.fill(o)}}export{h as C};