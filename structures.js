/* ============================================================
   AMINO ACID STRUCTURES v3 — Textbook Fischer projection
   L-α-amino acids, zwitterionic at pH 7.4
   Orientation: COO⁻ top, R bottom, ⁺H₃N left, H right (L-config)
   Vertical bonds = dashed (away from viewer)
   Horizontal bonds = solid wedges (toward viewer)
   ============================================================ */

const ATOM = {
  C:'#e2e8f0', N:'#60a5fa', O:'#f87171', S:'#fbbf24', H:'#cbd5e1', P:'#fb923c'
};
const BOND = ATOM.C;

// Atom label helpers
function L(x,y,txt,c,fs,anc){
  return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'" dominant-baseline="central" fill="'+c+'" font-size="'+(fs||14)+'" font-weight="700" font-family="\'Space Grotesk\',sans-serif">'+txt+'</text>';
}
// sub/sup aware labels
function Chem(x,y,parts,anc,fs){
  // parts: [{t:'H',sub:'3',sup:'+'}, ...]
  let s=''; let ox=0;
  const fsBase = fs||14;
  parts.forEach((p,i)=>{
    const c = p.c || ATOM.C;
    s += '<tspan x="'+(x+ox)+'" fill="'+c+'" font-size="'+fsBase+'">'+p.t+'</tspan>';
    const w = p.t.length*fsBase*0.55;
    ox += w;
    if(p.sub){
      s += '<tspan fill="'+c+'" font-size="'+(fsBase*0.7)+'" dy="'+(fsBase*0.2)+'">'+p.sub+'</tspan>';
      ox += p.sub.length*fsBase*0.38;
      s += '<tspan dy="'+(-fsBase*0.2)+'"></tspan>';
    }
    if(p.sup){
      s += '<tspan fill="'+c+'" font-size="'+(fsBase*0.7)+'" dy="'+(-fsBase*0.3)+'">'+p.sup+'</tspan>';
      ox += p.sup.length*fsBase*0.38;
      s += '<tspan dy="'+(fsBase*0.3)+'"></tspan>';
    }
  });
  return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'" dominant-baseline="central" font-weight="700" font-family="\'Space Grotesk\',sans-serif">'+s+'</text>';
}

function line(x1,y1,x2,y2,w){
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+BOND+'" stroke-width="'+(w||2)+'" stroke-linecap="round"/>';
}
function dblLine(x1,y1,x2,y2,perp){
  var dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  var ox=-dy/len*perp, oy=dx/len*perp;
  return line(x1+ox,y1+oy,x2+ox,y2+oy)+line(x1-ox,y1-oy,x2-ox,y2-oy);
}
// Solid wedge (coming toward viewer)
function wedgeOut(x1,y1,x2,y2){
  return '<polygon points="'+x1+','+(y1-2)+' '+x2+','+(y2-7)+' '+x2+','+(y2+7)+' '+x1+','+(y1+2)+'" fill="'+BOND+'"/>';
}
// Dashed wedge (going away)
function wedgeBack(x1,y1,x2,y2){
  var s='';
  for(var i=0;i<7;i++){var t=i/6,xx=x1+(x2-x1)*t,yy=y1+(y2-y1)*t,w=1+t*6;
    s+='<line x1="'+xx+'" y1="'+(yy-w)+'" x2="'+xx+'" y2="'+(yy+w)+'" stroke="'+BOND+'" stroke-width="1.3"/>';}
  return s;
}

/* --------- Fischer-projection backbone ---------
   Places Cα at (CX,CY). Draws COO⁻ at top, H right, ⁺H₃N left,
   and leaves a vertical bond downward from Cα for the R-group.
   Returns {caX, caY, rX, rY} where rX,rY is the start of the R-chain. */
function backbone(svg, CX, CY){
  var COO_Y = CY - 44;   // carboxyl carbon
  var N_X   = CX - 54;   // nitrogen
  var H_X   = CX + 50;   // hydrogen
  var R_Y   = CY + 38;   // first R carbon beta

  // Vertical bonds (away from viewer) - drawn as plain lines in Fischer projection
  // COO⁻ bond: Cα -> C (carboxyl)
  svg.push(line(CX,CY,CX,COO_Y+8));
  // R bond will be drawn starting at (CX, R_Y); caller draws the rest.
  // Leave stub
  svg.push(line(CX,CY+8,CX,R_Y-8));

  // Carboxyl carbon
  var CCX=CX, CCY=COO_Y;
  svg.push(L(CCX+12,CCY-2,'C',ATOM.C,12,'start'));
  // =O (left double)
  var ox=CCX-20, oy=CCY-18;
  svg.push(dblLine(CCX,CCY-2,ox,oy,3));
  svg.push(L(ox-8,oy-6,'O',ATOM.O,13,'end'));
  // -O⁻ (right single)
  var o2x=CCX+22, o2y=CCY-10;
  svg.push(line(CCX+2,CCY-2,o2x,o2y));
  svg.push(Chem(o2x+10,o2y,[{t:'O',sup:'−',c:ATOM.O}],'start',13));

  // Horizontal bonds (coming toward viewer) - wedges
  // ⁺H₃N (left)
  svg.push(wedgeOut(CX,CY,N_X+8,CY));
  svg.push(Chem(N_X-8,CY,[{t:'H',sup:'+',c:ATOM.N},{t:'N',c:ATOM.N},{t:'H',sub:'3',c:ATOM.N}],'end',13));

  // H (right)
  svg.push(wedgeOut(CX,CY,H_X-8,CY));
  svg.push(L(H_X+8,CY,'H',ATOM.H,13,'start'));

  // Cα label (optional, skeletal usually omits; we label tiny for clarity)
  // svg.push(L(CX,CY+2,'Cα','#6b6980',9));

  return {caX:CX, caY:CY, topX:CX, topY:COO_Y, lX:N_X, rX:H_X, botX:CX, botY:R_Y};
}

/* ========== Per-amino-acid R-chains ==========
   Each function appends SVG elements for the R-group starting at (CX, CY) — which is
   the first atom below Cα (β-carbon for most, with a bond already drawn from Cα). */

function rGlycine(svg,b){ svg.push(L(b.botX+12,b.botY-4,'H',ATOM.H,13,'start')); }
function rAlanine(svg,b){ rMethyl(svg,b.botX,b.botY,'down'); }

function rMethyl(svg,x,y,dir){
  // CH₃ extending downward
  var mx=x, my=y+22;
  svg.push(line(x,y,mx,my));
  svg.push(Chem(mx+12,my,[{t:'CH',sub:'3',c:ATOM.C}],'start',13));
}

function rValine(svg,b){
  // CH connected to Cα, then two CH3 branches
  var bx=b.botX, by=b.botY+4;
  svg.push(L(bx+10,by,'CH',ATOM.C,11,'start'));
  // left CH3
  var lx=bx-22, ly=by+26;
  svg.push(line(bx,by,lx,ly));
  svg.push(Chem(lx-12,ly+4,[{t:'CH',sub:'3',c:ATOM.C}],'end',12));
  // right CH3
  var rx=bx+22, ry=by+26;
  svg.push(line(bx,by,rx,ry));
  svg.push(Chem(rx+12,ry+4,[{t:'CH',sub:'3',c:ATOM.C}],'start',12));
}

function rLeucine(svg,b){
  // -CH2-CH(CH3)2
  var gx=b.botX, gy=b.botY+28;
  svg.push(line(b.botX,b.botY,gx,gy-4));
  svg.push(L(gx+8,gy-10,'CH₂',ATOM.C,11,'start'));
  var bx2=gx, by2=gy+26;
  svg.push(line(gx,gy,bx2,by2-4));
  svg.push(L(bx2+10,by2,'CH',ATOM.C,11,'start'));
  var lx=bx2-22, ly=by2+22;
  svg.push(line(bx2,by2,lx,ly));
  svg.push(Chem(lx-12,ly+4,[{t:'CH',sub:'3',c:ATOM.C}],'end',12));
  var rx=bx2+22, ry=by2+22;
  svg.push(line(bx2,by2,rx,ry));
  svg.push(Chem(rx+12,ry+4,[{t:'CH',sub:'3',c:ATOM.C}],'start',12));
}

function rIsoleucine(svg,b){
  // -CH(CH3)-CH2-CH3
  var bx=b.botX, by=b.botY+6;
  svg.push(L(bx+10,by,'CH',ATOM.C,11,'start'));
  // left CH3 (on beta)
  var lx=bx-22, ly=by-6;
  svg.push(line(bx,by,lx,ly));
  svg.push(Chem(lx-12,ly,[{t:'CH',sub:'3',c:ATOM.C}],'end',12));
  // ethyl chain down-right
  var gx=bx+20, gy=by+26;
  svg.push(line(bx,by,gx,gy));
  svg.push(L(gx+8,gy-8,'CH₂',ATOM.C,11,'start'));
  var dx=gx+4, dy=gy+26;
  svg.push(line(gx,gy,dx,dy));
  svg.push(Chem(dx+12,dy,[{t:'CH',sub:'3',c:ATOM.C}],'start',12));
}

function rMethionine(svg,b){
  // -CH2-CH2-S-CH3
  var gx=b.botX, gy=b.botY+26;
  svg.push(line(b.botX,b.botY,gx,gy-4));
  svg.push(L(gx+8,gy-10,'CH₂',ATOM.C,11,'start'));
  var g2x=gx, g2y=gy+24;
  svg.push(line(gx,gy,g2x,g2y-4));
  svg.push(L(g2x+8,g2y-10,'CH₂',ATOM.C,11,'start'));
  var sx=g2x, sy=g2y+22;
  svg.push(line(g2x,g2y,sx,sy));
  svg.push(L(sx-10,sy-8,'S',ATOM.S,13,'end'));
  var mx=sx, my=sy+22;
  svg.push(line(sx,sy,mx,my));
  svg.push(Chem(mx+12,my,[{t:'CH',sub:'3',c:ATOM.C}],'start',12));
}

function rProline(svg,b){
  // Proline: R-chain loops back to N to make 5-ring. We override full backbone.
  // Handled specially below — draw propyl bridge from β-Cγ-Cδ back to N
  var bx=b.botX-6, by=b.botY+2;
  var cx=bx-8, cy=by+22;
  var dx=cx-18, dy=cy-10;
  svg.push(line(b.botX-4,b.botY,bx,by));
  svg.push(line(bx,by,cx,cy));
  svg.push(line(cx,cy,dx,dy));
  // connect to N — we need N position. In backbone N_X = CX-54, CY
  var nx=b.lX+20, ny=b.caY;
  svg.push(line(dx,dy,nx+4,ny-4));
  svg.push(L((bx+cx)/2-10,(by+cy)/2+4,'CH₂',ATOM.C,10,'end'));
  svg.push(L((cx+dx)/2-10,(cy+dy)/2,'CH₂',ATOM.C,10,'end'));
  svg.push(L((dx+nx)/2-8,(dy+ny)/2-6,'CH₂',ATOM.C,10,'end'));
}

function rSerine(svg,b){ hydroxyl(svg,b.botX,b.botY+22,'down'); }
function rThreonine(svg,b){
  // -CH(OH)-CH3
  var bx=b.botX, by=b.botY+6;
  svg.push(L(bx+10,by,'CH',ATOM.C,11,'start'));
  hydroxyl(svg,bx-22,by+6,'down-left');
  var rx=bx+22, ry=by+26;
  svg.push(line(bx,by,rx,ry));
  svg.push(Chem(rx+12,ry+4,[{t:'CH',sub:'3',c:ATOM.C}],'start',12));
}
function rCysteine(svg,b){ thiol(svg,b.botX,b.botY+22,'down'); }

function hydroxyl(svg,x,y,dir){
  var ox=x, oy=y+6;
  svg.push(line(x,y-26,ox,oy));
  svg.push(Chem(ox+12,oy,[{t:'OH',c:ATOM.O}],'start',13));
}
function thiol(svg,x,y,dir){
  var sx=x, sy=y+6;
  svg.push(line(x,y-26,sx,sy));
  svg.push(Chem(sx+12,sy,[{t:'SH',c:ATOM.S}],'start',13));
}

function rAsparagine(svg,b){ amide(svg,b.botX,b.botY+24,1); }
function rGlutamine(svg,b){
  // extra CH2 then amide
  var gx=b.botX, gy=b.botY+22;
  svg.push(line(b.botX,b.botY,gx,gy-4));
  svg.push(L(gx+8,gy-10,'CH₂',ATOM.C,11,'start'));
  amide(svg,gx,gy+22,1);
}
function amide(svg,cx,cy,len){
  svg.push(line(cx,cy-4,cx,cy));
  svg.push(L(cx+10,cy-2,'C',ATOM.C,12,'start'));
  var ux=cx-20, uy=cy-14;
  svg.push(dblLine(cx,cy,ux,uy,3));
  svg.push(L(ux-8,uy-8,'O',ATOM.O,13,'end'));
  var nx=cx+22, ny=cy+4;
  svg.push(line(cx,cy,nx,ny));
  svg.push(Chem(nx+8,ny,[{t:'NH',sub:'2',c:ATOM.N}],'start',12));
}

function rAspartate(svg,b){ carboxylate(svg,b.botX,b.botY+24); }
function rGlutamate(svg,b){
  var gx=b.botX, gy=b.botY+22;
  svg.push(line(b.botX,b.botY,gx,gy-4));
  svg.push(L(gx+8,gy-10,'CH₂',ATOM.C,11,'start'));
  carboxylate(svg,gx,gy+22);
}
function carboxylate(svg,cx,cy){
  svg.push(line(cx,cy-4,cx,cy));
  svg.push(L(cx+10,cy-2,'C',ATOM.C,12,'start'));
  var ux=cx-22, uy=cy-10;
  svg.push(dblLine(cx,cy,ux,uy,3));
  svg.push(L(ux-8,uy-8,'O',ATOM.O,13,'end'));
  var ox=cx+24, oy=cy+2;
  svg.push(line(cx,cy,ox,oy));
  svg.push(Chem(ox+8,oy,[{t:'O',sup:'−',c:ATOM.O}],'start',12));
}

function rLysine(svg,b){
  // -(CH2)4-NH3+
  var pts=[{x:b.botX,y:b.botY}];
  for(var i=1;i<=4;i++){
    pts.push({x:b.botX,y:b.botY+i*24});
    svg.push(line(pts[i-1].x,pts[i-1].y,pts[i].x,pts[i].y));
    if(i<4) svg.push(L(pts[i].x+8,pts[i].y-8,'CH₂',ATOM.C,10,'start'));
  }
  var nx=pts[4].x, ny=pts[4].y;
  svg.push(Chem(nx+12,ny,[{t:'NH',sub:'3',sup:'+',c:ATOM.N}],'start',12));
}

function rArginine(svg,b){
  // -(CH2)3-NH-C(=NH2+)NH2
  var p1={x:b.botX,y:b.botY+22};
  svg.push(line(b.botX,b.botY,p1.x,p1.y-4));
  svg.push(L(p1.x+8,p1.y-10,'CH₂',ATOM.C,10,'start'));
  var p2={x:p1.x,y:p1.y+22};
  svg.push(line(p1.x,p1.y,p2.x,p2.y-4));
  svg.push(L(p2.x+8,p2.y-10,'CH₂',ATOM.C,10,'start'));
  var p3={x:p2.x,y:p2.y+22};
  svg.push(line(p2.x,p2.y,p3.x,p3.y-4));
  svg.push(L(p3.x+8,p3.y-10,'CH₂',ATOM.C,10,'start'));
  var n1={x:p3.x,y:p3.y+22};
  svg.push(line(p3.x,p3.y,n1.x,n1.y-6));
  svg.push(L(n1.x-10,n1.y-8,'NH',ATOM.N,11,'end'));
  var cc={x:n1.x,y:n1.y+22};
  svg.push(line(n1.x,n1.y,cc.x,cc.y-4));
  svg.push(L(cc.x+10,cc.y-4,'C',ATOM.C,12,'start'));
  // =NH2+ (left)
  var ux=cc.x-24, uy=cc.y-10;
  svg.push(dblLine(cc.x,cc.y-2,ux,uy,3));
  svg.push(Chem(ux-6,uy-6,[{t:'NH',sub:'2',sup:'+',c:ATOM.N}],'end',11));
  // -NH2 (right)
  var nx=cc.x+24, ny=cc.y+4;
  svg.push(line(cc.x,cc.y,nx,ny));
  svg.push(Chem(nx+8,ny,[{t:'NH',sub:'2',c:ATOM.N}],'start',11));
}

function rHistidine(svg,b){
  // -CH2-imidazole (5-ring with two N)
  var bx=b.botX, by=b.botY+22;
  svg.push(line(b.botX,b.botY,bx,by-4));
  svg.push(L(bx+8,by-10,'CH₂',ATOM.C,11,'start'));
  // 5-member imidazole ring below
  var cx=bx, cy=by+28, r=20;
  var pts=[];
  for(var i=0;i<5;i++){
    var a=-Math.PI/2+i*2*Math.PI/5;
    pts.push({x:cx+Math.cos(a)*r*1.1,y:cy+Math.sin(a)*r});
  }
  // attach at pts[0] (top)
  svg.push(line(bx,by,pts[0].x,pts[0].y));
  for(var i=0;i<5;i++) svg.push(line(pts[i].x,pts[i].y,pts[(i+1)%5].x,pts[(i+1)%5].y));
  // double bonds
  svg.push(dblLine(pts[1].x,pts[1].y,pts[2].x,pts[2].y,2.5));
  svg.push(dblLine(pts[3].x,pts[3].y,pts[4].x,pts[4].y,2.5));
  // N atoms at positions 2 and 4 (approximate)
  svg.push(L(pts[2].x-6,pts[2].y-10,'N',ATOM.N,12));
  svg.push(Chem(pts[4].x+10,pts[4].y,[{t:'NH',c:ATOM.N}],'start',12));
}

function rPhenylalanine(svg,b){ ring6(svg,b,0); }
function rTyrosine(svg,b){ ring6(svg,b,1); }
function ring6(svg,b,withOH){
  // -CH2-benzene
  var bx=b.botX, by=b.botY+22;
  svg.push(line(b.botX,b.botY,bx,by-4));
  svg.push(L(bx+8,by-10,'CH₂',ATOM.C,11,'start'));
  // benzene ring
  var cx=bx, cy=by+42, r=22;
  var pts=[];
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*Math.PI/3;
    pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});
  }
  svg.push(line(bx,by,pts[0].x,pts[0].y));
  for(var i=0;i<6;i++){
    svg.push(line(pts[i].x,pts[i].y,pts[(i+1)%6].x,pts[(i+1)%6].y));
    if(i%2===1) svg.push(dblLine(pts[i].x,pts[i].y,pts[(i+1)%6].x,pts[(i+1)%6].y,3));
  }
  // circle inside
  // svg.push('<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.4)+'" fill="none" stroke="'+BOND+'" stroke-width="1" opacity="0.4"/>');
  if(withOH){
    var ox=pts[3].x, oy=pts[3].y+r;
    svg.push(line(pts[3].x,pts[3].y,ox,oy-2));
    svg.push(Chem(ox+10,oy+2,[{t:'OH',c:ATOM.O}],'start',12));
  }
}

function rTryptophan(svg,b){
  // -CH2-indole
  var bx=b.botX, by=b.botY+22;
  svg.push(line(b.botX,b.botY,bx,by-4));
  svg.push(L(bx+8,by-10,'CH₂',ATOM.C,11,'start'));
  // indole: benzene fused to pyrrole (5-ring with NH)
  var cx=bx-2, cy=by+46, r=18;
  // 6-member ring
  var p6=[];
  for(var i=0;i<6;i++){var a=-Math.PI/2.3+i*Math.PI/3; p6.push({x:cx+Math.cos(a)*r*1.2,y:cy+Math.sin(a)*r*1.1});}
  for(var i=0;i<6;i++){svg.push(line(p6[i].x,p6[i].y,p6[(i+1)%6].x,p6[(i+1)%6].y)); if(i%2===1)svg.push(dblLine(p6[i].x,p6[i].y,p6[(i+1)%6].x,p6[(i+1)%6].y,2.5));}
  // 5-member ring fused to p6[4]..p6[5], extending left
  var mid={x:(p6[4].x+p6[5].x)/2,y:(p6[4].y+p6[5].y)/2};
  var a5a = Math.atan2(p6[4].y-mid.y,p6[4].x-mid.x) - Math.PI/2;
  var apex = {x:mid.x-28,y:mid.y-4};
  svg.push(line(p6[4].x,p6[4].y,apex.x,apex.y));
  svg.push(line(apex.x,apex.y,p6[5].x,p6[5].y));
  svg.push(Chem(apex.x-4,apex.y-10,[{t:'NH',c:ATOM.N}],'middle',11));
  // attach beta-CH2 to p6[1]
  svg.push(line(bx,by,p6[1].x,p6[1].y));
}

// Dispatch table
const R_GROUPS = {
  Gly:rGlycine, Ala:rAlanine, Val:rValine, Leu:rLeucine, Ile:rIsoleucine,
  Met:rMethionine, Pro:rProline, Phe:rPhenylalanine, Tyr:rTyrosine, Trp:rTryptophan,
  Ser:rSerine, Thr:rThreonine, Cys:rCysteine, Asn:rAsparagine, Gln:rGlutamine,
  Asp:rAspartate, Glu:rGlutamate, Lys:rLysine, Arg:rArginine, His:rHistidine
};

function drawAAStructure(aa, opts){
  opts = opts||{};
  var W = opts.width||280, H = opts.height||240;
  var svg = [];
  svg.push('<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg" style="background:transparent;display:block;margin:0 auto;">');

  var CX=W*0.5, CY=H*0.52;
  var bb = backbone(svg,CX,CY);
  var fn = R_GROUPS[aa.abbr];
  if(fn) fn(svg,bb);

  // Glycine note
  if(aa.abbr==='Gly'){
    svg.push('<text x="'+CX+'" y="'+(H-12)+'" text-anchor="middle" fill="#8884a5" font-size="11" font-family="\'Space Grotesk\',sans-serif">Glycine: R = H (achiral)</text>');
  }

  svg.push('</svg>');
  return svg.join('');
}
