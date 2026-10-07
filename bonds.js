(function(){const NS='http://www.w3.org/2000/svg',H=10,L=20,W=10;
function r(s,x,y,w){const e=document.createElementNS(NS,'rect');e.setAttribute('x',x+.5);e.setAttribute('y',y+.5);e.setAttribute('width',w-1);e.setAttribute('height',H-1);e.setAttribute('rx',1);e.setAttribute('fill',w<L?'#a5452c':'#b85a3a');s.appendChild(e);}
function draw(id,f){const s=document.getElementById(id);if(!s)return;for(let row=0;row<6;row++){let x=f(row);let i=0;while(x<120){const w=typeof x==='object'?0:0;const sz=f.size(row,i);r(s,x,row*H,sz);x+=sz;i++;}}}
function mk(id,start,size){const f=start;f.size=size;draw(id,f);}
mk('b-stretcher',r=>r%2?-L/2:0,()=>L);
mk('b-english',r=>r%2?-W/2:0,(r)=>r%2?W:L);
mk('b-flemish',r=>r%2?-(L+W)/2:0,(r,i)=>i%2?W:L);
mk('b-stack',()=>0,()=>L);})();
