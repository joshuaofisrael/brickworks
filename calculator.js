// Brick calculator for Brickworks. Original code.
(function(){'use strict';
var P={uk:[215,102.5,65,10],usm:[193.7,92.1,57.2,9.5],de:[240,115,71,10],au:[230,110,76,10]};
var $=function(id){return document.getElementById(id);};
var FT2=0.09290304, M3FT3=35.3147, KGLB=2.20462;
function preset(){var p=P[$('std').value];if(!p)return;$('bl').value=p[0];$('bw').value=p[1];$('bh').value=p[2];$('jt').value=p[3];}
function n(id){var v=parseFloat($(id).value);return isFinite(v)&&v>=0?v:0;}
function fmt(x,d){return x.toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:0});}
function calc(){
 var imp=$('units').value==='ft',L=n('len'),H=n('hgt'),O=n('open');
 var area=Math.max(L*H-O,0); var areaM2=imp?area*FT2:area;
 var bl=n('bl')/1000,bw=n('bw')/1000,bh=n('bh')/1000,j=n('jt')/1000;
 if(!bl||!bh||!bw){return;}
 var per=1/((bl+j)*(bh+j)), t=$('thk').value, leaves=t==='1'?1:2;
 var thick=t==='2'?2*bw+j:leaves*bw;
 var bricks=per*leaves*areaM2, buy=Math.ceil(bricks*(1+n('waste')/100));
 var mort=Math.max(areaM2*thick-bricks*bl*bw*bh,0)*(1+n('waste')/100);
 var r=parseFloat($('mix').value),dry=mort*1.3,cem=dry/(1+r)*1440,sand=dry*r/(1+r)*1600;
 $('o-area').textContent=imp?fmt(area,1)+' sq ft':fmt(area,2)+' m²';
 $('o-per').textContent=imp?fmt(per*leaves*FT2,2)+' / sq ft':fmt(per*leaves,1)+' / m²';
 $('o-net').textContent=fmt(Math.ceil(bricks),0);
 $('o-buy').textContent=fmt(buy,0);
 $('o-mortar').textContent=imp?fmt(mort*M3FT3,1)+' cu ft':fmt(mort,3)+' m³';
 $('o-cem').textContent=imp?fmt(cem*KGLB,0)+' lb':fmt(cem,0)+' kg ('+fmt(Math.ceil(cem/25),0)+' × 25 kg bags)';
 $('o-sand').textContent=imp?fmt(sand*KGLB,0)+' lb':fmt(sand,0)+' kg';
 $('math').textContent='Working: 1 ÷ (('+fmt(bl*1000,1)+' + '+fmt(j*1000,1)+' mm) × ('+fmt(bh*1000,1)+' + '+fmt(j*1000,1)+' mm)) = '+fmt(per,2)+' bricks per m² per leaf, × '+leaves+(leaves>1?' leaves':' leaf')+' × '+fmt(areaM2,2)+' m² = '+fmt(bricks,1)+' bricks, plus '+n('waste')+'% waste.';
}
$('std').addEventListener('change',function(){preset();calc();});
['bl','bw','bh','jt'].forEach(function(id){$(id).addEventListener('input',function(){$('std').value='custom';calc();});});
['units','len','hgt','open','thk','waste','mix'].forEach(function(id){$(id).addEventListener('input',calc);$(id).addEventListener('change',calc);});
preset();calc();})();
