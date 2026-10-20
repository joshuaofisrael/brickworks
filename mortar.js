// Mortar calculator for Mortar Smash. Original code.
(function(){'use strict';
var P={uk:[215,102.5,65,10],usm:[193.7,92.1,57.2,9.5],de:[240,115,71,10],au:[230,110,76,10]};
var $=function(id){return document.getElementById(id);};
var FT2=0.09290304,M3FT3=35.3147,KGLB=2.20462;
function v(id){var x=parseFloat($(id).value);return isFinite(x)&&x>=0?x:0;}
function fmt(x,d){return x.toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:0});}
function calc(){
 var p=P[$('m-std').value],l=p[0]/1e3,w=p[1]/1e3,h=p[2]/1e3,j=p[3]/1e3,t=$('m-thk').value==='2'?2:1;
 var per=1/((l+j)*(h+j)),perm2=per*t,wallT=t===2?2*w+j:w,m2=wallT-perm2*l*w*h;
 var imp=$('m-std').value==='usm',by=$('m-by').value,q=v('m-q'),waste=v('m-w')/100,r=parseFloat($('m-mix').value);
 $('m-ql').textContent=by==='bricks'?'Number of bricks':(imp?'Wall face area (sq ft)':'Wall face area (m²)');
 var area=by==='bricks'?q/perm2:(imp?q*FT2:q),bricks=area*perm2;
 var wet=area*m2*(1+waste),dry=wet*1.3,cem=dry/(1+r)*1440,sand=dry*r/(1+r)*1600;
 $('m-o-b').textContent=fmt(Math.ceil(bricks-1e-9),0)+(by==='bricks'?'':' bricks');
 $('m-o-wet').textContent=imp?fmt(wet*M3FT3,1)+' cu ft ('+fmt(wet,3)+' m³)':fmt(wet,3)+' m³';
 $('m-o-cem').textContent=imp?fmt(cem*KGLB,0)+' lb ('+fmt(cem,0)+' kg)':fmt(cem,0)+' kg ('+fmt(Math.ceil(cem/25-1e-9),0)+' × 25 kg bags)';
 $('m-o-sand').textContent=imp?fmt(sand*KGLB,0)+' lb ('+fmt(sand/1000,2)+' t)':fmt(sand,0)+' kg ('+fmt(sand/1000,2)+' t)';
 $('m-math').textContent='Working: '+fmt(m2*1000,1)+' litres of wet mortar per m² of wall ('+fmt(m2/perm2*1e6,0)+' ml per brick) × '+fmt(area,2)+' m², plus '+fmt(waste*100,0)+'% waste = '+fmt(wet,3)+' m³ wet. Dry volume ×1.3 = '+fmt(dry,3)+' m³, split 1 : '+r+' cement : sand at 1,440 and 1,600 kg/m³.';
}
['m-std','m-thk','m-by','m-q','m-w','m-mix'].forEach(function(id){$(id).addEventListener('input',calc);$(id).addEventListener('change',calc);});
calc();})();
