// Mortar Smash - original game for Brickworks. Written from scratch.
(function(){
'use strict';
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
function fit(){const s=Math.min(window.innerWidth/W,(window.innerHeight-90)/H,1.5);cv.style.width=W*s+'px';cv.style.height=H*s+'px';}
window.addEventListener('resize',fit);fit();
const COLORS=['#7a2e1c','#a5452c','#b85a3a','#c9744d','#d99a6c','#e8c39e'];
const pad={w:90,h:14,x:W/2-45,y:H-50,speed:7};
let ball,bricks,level=1,score=0,lives=3,state='ready',keys={},best=+(localStorage.getItem('ms_best')||0);
function resetBall(){ball={x:pad.x+pad.w/2,y:pad.y-9,r:8,vx:0,vy:0,stuck:true};}
function buildLevel(n){bricks=[];const rows=Math.min(4+n,9),cols=8,bw=(W-40)/cols,bh=22;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  if(n%3===2&&(r+c)%2)continue; if(n%3===0&&Math.abs(c-3.5)<r/2-1)continue;
  const hp=r<Math.floor(n/2)?2:1;
  bricks.push({x:20+c*bw,y:70+r*(bh+4),w:bw-4,h:bh,hp,color:COLORS[r%COLORS.length]});}
 pad.w=Math.max(60,90-n*4);resetBall();}
function launch(){if(ball.stuck){const sp=4.5+level*0.4;const a=(-Math.PI/2)+(Math.random()-.5)*0.6;ball.vx=Math.cos(a)*sp;ball.vy=Math.sin(a)*sp;ball.stuck=false;}}
function action(){if(state==='ready'){state='play';launch();}else if(state==='play'){if(ball.stuck)launch();else state='pause';}else if(state==='pause')state='play';else if(state==='over'||state==='won'){level=1;score=0;lives=3;buildLevel(1);state='ready';}else if(state==='clear'){level++;buildLevel(level);state='ready';}}
document.addEventListener('keydown',e=>{keys[e.key]=true;if(e.key===' '||e.key==='Enter'){e.preventDefault();action();}if(e.key==='p')state=state==='play'?'pause':state==='pause'?'play':state;});
document.addEventListener('keyup',e=>{keys[e.key]=false;});
function pointer(e){const r=cv.getBoundingClientRect();const x=((e.touches?e.touches[0].clientX:e.clientX)-r.left)*W/r.width;pad.x=Math.max(0,Math.min(W-pad.w,x-pad.w/2));}
cv.addEventListener('mousemove',pointer);
let touchMoved=false;
cv.addEventListener('touchstart',e=>{e.preventDefault();touchMoved=false;pointer(e);},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();touchMoved=true;pointer(e);},{passive:false});
cv.addEventListener('touchend',e=>{e.preventDefault();if(!touchMoved||state!=='play'||ball.stuck)action();},{passive:false});
cv.addEventListener('click',()=>action());
function update(){
 if(keys.ArrowLeft||keys.a)pad.x-=pad.speed; if(keys.ArrowRight||keys.d)pad.x+=pad.speed;
 pad.x=Math.max(0,Math.min(W-pad.w,pad.x));
 if(state!=='play'&&state!=='ready')return;
 if(ball.stuck){ball.x=pad.x+pad.w/2;ball.y=pad.y-ball.r-1;return;}
 const steps=3;for(let s=0;s<steps;s++){
 ball.x+=ball.vx/steps;ball.y+=ball.vy/steps;
 if(ball.x<ball.r){ball.x=ball.r;ball.vx=Math.abs(ball.vx);} if(ball.x>W-ball.r){ball.x=W-ball.r;ball.vx=-Math.abs(ball.vx);}
 if(ball.y<ball.r){ball.y=ball.r;ball.vy=Math.abs(ball.vy);}
 if(ball.vy>0&&ball.y+ball.r>=pad.y&&ball.y<pad.y+pad.h&&ball.x>pad.x-ball.r&&ball.x<pad.x+pad.w+ball.r){
  const hit=(ball.x-(pad.x+pad.w/2))/(pad.w/2),sp=Math.hypot(ball.vx,ball.vy),a=hit*1.05;
  ball.vx=sp*Math.sin(a);ball.vy=-sp*Math.cos(a);ball.y=pad.y-ball.r;}
 for(const b of bricks){if(b.hp<=0)continue;
  const cx=Math.max(b.x,Math.min(ball.x,b.x+b.w)),cy=Math.max(b.y,Math.min(ball.y,b.y+b.h)),dx=ball.x-cx,dy=ball.y-cy;
  if(dx*dx+dy*dy<=ball.r*ball.r){
   if(Math.abs(dx)>Math.abs(dy))ball.vx=-ball.vx;else ball.vy=-ball.vy;
   b.hp--;score+=b.hp>0?5:10*level;
   const sp=Math.hypot(ball.vx,ball.vy);if(sp<9){ball.vx*=1.01;ball.vy*=1.01;}
   break;}}}
 if(ball.y>H+ball.r){lives--;if(lives<=0){state='over';saveBest();}else{resetBall();state='ready';}}
 if(bricks.every(b=>b.hp<=0)){score+=100*level;saveBest();state=level>=9?'won':'clear';}}
function saveBest(){if(score>best){best=score;try{localStorage.setItem('ms_best',best);}catch(e){}}}
function drawBrick(b){ctx.fillStyle=b.hp>1?'#5a2214':b.color;ctx.fillRect(b.x,b.y,b.w,b.h);
 ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(b.x,b.y,b.w,3);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(b.x,b.y+b.h-3,b.w,3);
 if(b.hp>1){ctx.strokeStyle='#e9e2d6';ctx.strokeRect(b.x+2,b.y+2,b.w-4,b.h-4);}}
function text(t,y,size){ctx.font=`bold ${size}px Georgia`;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(t,W/2,y);}
function draw(){ctx.clearRect(0,0,W,H);
 ctx.fillStyle='#e9e2d6';ctx.font='16px Georgia';ctx.textAlign='left';ctx.fillText('Score '+score,12,26);
 ctx.textAlign='center';ctx.fillText('Level '+level+'  ·  Best '+best,W/2,26);ctx.textAlign='right';ctx.fillText('♥'.repeat(Math.max(lives,0)),W-12,26);
 bricks.forEach(b=>{if(b.hp>0)drawBrick(b);});
 ctx.fillStyle='#f2c14e';ctx.fillRect(pad.x,pad.y,pad.w,pad.h);ctx.fillStyle='#8a6a1e';ctx.fillRect(pad.x,pad.y+pad.h-4,pad.w,4);
 ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
 const msg={ready:['Mortar Smash','Space / tap to launch'],pause:['Paused','Space / tap to resume'],over:['Game Over','Score '+score+' — tap to retry'],clear:['Wall Cleared!','Tap for level '+(level+1)],won:['You demolished it all!','Score '+score+' — tap to play again']}[state];
 if(msg&&!(state==='ready'&&level>1&&false)){if(state!=='ready'){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H/2-70,W,120);}text(msg[0],H/2-20,32);text(msg[1],H/2+20,18);}}
function loop(){update();draw();requestAnimationFrame(loop);}
buildLevel(1);loop();
})();
