/* ============================================================
   AMINO ACID SVG STRUCTURE RENDERER
   Draws L-amino acids in zwitterion form at pH 7.4
   ============================================================ */

function drawAAStructure(aa, opts){
  opts = opts || {};
  var width = opts.width || 280, height = opts.height || 220;
  var struct = AA_STRUCTURES[aa.abbr];
  var cx = width*0.42, cy = height*0.48;
  var bondLen = 24;
  var C = '#e2e8f0', N='#60a5fa', O='#f87171', S='#fbbf24', H='#cbd5e1';

  function T(x,y,txt,col,fs,fw,anchor){
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'middle')+'" dominant-baseline="middle" fill="'+col+'" font-size="'+(fs||12)+'" font-weight="'+(fw||600)+'" font-family="Space Grotesk, sans-serif">'+txt+'</text>';
  }
  function b(x1,y1,x2,y2,w,dbl){
    var s = '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+C+'" stroke-width="'+(w||2)+'" stroke-linecap="round"/>';
    if(dbl) s += '<line x1="'+(x1+3)+'" y1="'+(y1+3)+'" x2="'+(x2+3)+'" y2="'+(y2+3)+'" stroke="'+C+'" stroke-width="'+((w||2)-0.8)+'" stroke-linecap="round"/>';
    return s;
  }
  function wedgeSolid(x1,y1,x2,y2){
    return '<polygon points="'+x1+','+(y1-2)+' '+x2+','+(y2-5)+' '+x2+','+(y2+5)+' '+x1+','+(y1+2)+'" fill="'+C+'"/>';
  }
  function wedgeDash(x1,y1,x2,y2){
    var d=''; for(var i=0;i<6;i++){var t=i/5,xx=x1+(x2-x1)*t,yy=y1+(y2-y1)*t,wid=1+t*4;
      d+='<line x1="'+xx+'" y1="'+(yy-wid)+'" x2="'+xx+'" y2="'+(yy+wid)+'" stroke="'+C+'" stroke-width="1.2"/>';}
    return d;
  }
  function benzene(cx,cy,r,withOH,attachX,attachY,attachPtIdx){
    var pts=[], s='';
    for(var i=0;i<6;i++){var a=-Math.PI/2+i*Math.PI/3; pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});}
    for(var i=0;i<6;i++){s+=b(pts[i].x,pts[i].y,pts[(i+1)%6].x,pts[(i+1)%6].y,2,i%2===0);}
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.32)+'" fill="none" stroke="'+C+'" stroke-width="1" opacity="0.5"/>';
    // Attach to CH2
    if(attachPtIdx !== undefined){
      s+=b(attachX,attachY,pts[attachPtIdx].x,pts[attachPtIdx].y);
    }
    if(withOH){
      var bottom = pts[3];
      s+=b(bottom.x,bottom.y,bottom.x,bottom.y+bondLen*0.7);
      s+=T(bottom.x+12,bottom.y+bondLen*0.7,'OH',O,11);
    }
    return s;
  }

  var svg = '<svg viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+'" xmlns="http://www.w3.org/2000/svg">';

  // Carboxyl to the RIGHT
  var ccx = cx + bondLen, ccy = cy;
  svg += b(cx,cy,ccx,ccy);
  // Double-bond O up
  var ox1 = ccx, oy1 = ccy - bondLen*0.9;
  svg += b(ccx,ccy,ox1,oy1,2,true);
  svg += T(ox1, oy1-11, 'O', O, 12, 700);
  // Single O- down-right
  var ox2 = ccx + bondLen*0.85, oy2 = ccy + bondLen*0.45;
  svg += b(ccx,ccy,ox2,oy2);
  svg += T(ox2+10, oy2, 'O⁻', O, 12, 700);
  svg += T(ccx-3, ccy-12, 'C', C, 11, 700);

  // Amino LEFT (+H3N)
  var nx = cx-bondLen, ny=cy;
  svg += b(cx,cy,nx,ny);
  svg += T(nx+2, ny-12, 'N', N, 12, 700);
  svg += T(nx-18, ny-12, '+H', N, 10, 500, 'end');
  svg += '<text x="'+(nx-6)+'" y="'+(ny-16)+'" fill="'+N+'" font-size="9" font-family="Space Grotesk, sans-serif">3</text>';

  // Alpha C label
  svg += T(cx, cy+14, 'Cα', C, 12, 700);

  // H dashed wedge UP (back, away from viewer — L-configuration standard)
  var hx = cx - 6, hy = cy - bondLen*0.85;
  svg += wedgeDash(cx, cy-8, hx, hy);
  svg += T(hx-8, hy-6, 'H', H, 11);

  // ---- R-group ----
  var rStartX = cx+8, rStartY = cy+bondLen*0.8;
  if(aa.abbr === 'Gly'){
    // Second H (dashed) going down
    var hx2 = cx+8, hy2 = cy+bondLen*0.85;
    svg += wedgeDash(cx, cy+8, hx2, hy2);
    svg += T(hx2+10, hy2+4, 'H', H, 11);
    svg += T(cx, cy+bondLen*1.6, 'R = H — Glycine is achiral', '#8884a5', 11, 500);
  } else if(aa.abbr === 'Pro'){
    // 5-membered ring back to N
    svg += wedgeSolid(cx, cy+8, rStartX, rStartY);
    var p1 = {x:rStartX+bondLen*0.9, y:rStartY+bondLen*0.5};
    var p2 = {x:p1.x+bondLen*0.3, y:rStartY-bondLen*0.4};
    svg += b(rStartX,rStartY,p1.x,p1.y);
    svg += b(p1.x,p1.y,p2.x,p2.y);
    svg += b(p2.x,p2.y,nx+8,ny-4);
    svg += T((rStartX+p1.x)/2+10,(rStartY+p1.y)/2,'CH₂',C,10,500);
    svg += T((p1.x+p2.x)/2+10,(p1.y+p2.y)/2,'CH₂',C,10,500);
    svg += T(rStartX+10, rStartY-6, 'CH₂', C, 10,500);
    svg += T(cx, cy+bondLen*1.8, 'Ring connects back to N (imino acid)', '#8884a5', 10, 500);
  } else {
    // Draw R chain
    svg += wedgeSolid(cx, cy+8, rStartX, rStartY);
    drawRChain(svg, struct.chain, rStartX, rStartY, {dx:0.25, dy:1}, {C:C,N:N,O:O,S:S}, bondLen, b, T);
  }

  svg += '</svg>';
  return svg;
}

function drawRChain(svg, chain, sx, sy, dir, A, bondLen, b, T){
  var cx = sx, cy = sy;
  var segMap = {benzene:1,phenol:1,indole:1,imidazole:1,guanidino:1,amide:1,carboxyl:1,amine:1};

  for(var i=0;i<chain.length;i++){
    var seg = chain[i];
    if(segMap[seg.bond]){
      drawRGroup(svg, seg, cx, cy, dir, A, bondLen, b, T);
      return;
    }
    var nx = cx + dir.dx*bondLen;
    var ny = cy + dir.dy*bondLen;
    svg += b(cx,cy,nx,ny);
    var col = A.C;
    if(seg.label === 'S') col = A.S;
    var midx = (cx+nx)/2 + 8, midy = (cy+ny)/2 - 6;
    svg += T(midx, midy, seg.label, col, 11);
    if(seg.labelSub){
      var sx2 = midx+4, sy2 = midy+12;
      svg += b(midx-4,midy+4,sx2,sy2-4);
      var sc = seg.labelSub === 'OH' ? A.O : (seg.labelSub === 'SH' ? A.S : A.C);
      svg += T(sx2+10, sy2, seg.labelSub, sc, 10);
    }
    if(seg.branch){
      for(var j=0;j<seg.branch.length;j++){
        var br = seg.branch[j];
        var ang = (br.angle||30)*Math.PI/180;
        var bx = nx + Math.sin(ang)*bondLen*0.75;
        var by = ny - Math.cos(ang)*bondLen*0.75;
        svg += b(nx,ny,bx,by);
        var bc = br.label==='OH'?A.O:A.C;
        svg += T(bx + (ang>0?12:-12), by, br.label, bc, 10);
        if(br.chain){
          var bdir = {dx:Math.sign(ang)*0.4, dy:0.5};
          drawRChain(svg, br.chain, bx, by, bdir, A, bondLen*0.85, b, T);
        }
      }
    }
    cx = nx; cy = ny;
    // slight bend
    var a = Math.atan2(dir.dy, dir.dx) - 0.25;
    dir = {dx:Math.cos(a), dy:Math.sin(a)};
  }
}

function drawRGroup(svg, seg, cx, cy, dir, A, bondLen, b, T){
  var nx = cx + dir.dx*bondLen*0.35;
  var ny = cy + dir.dy*bondLen*0.35;
  var C=A.C,N=A.N,O=A.O,S=A.S;
  if(seg.bond === 'benzene'){
    svg += b(cx,cy,nx,ny);
    var rx = nx + bondLen*0.15, ry = ny + bondLen*0.7;
    svg += benzene(rx,ry,bondLen*0.55,false,nx,ny,0);
  } else if(seg.bond === 'phenol'){
    svg += b(cx,cy,nx,ny);
    var rx = nx + bondLen*0.15, ry = ny + bondLen*0.7;
    svg += benzene(rx,ry,bondLen*0.55,true,nx,ny,0);
  } else if(seg.bond === 'indole'){
    svg += b(cx,cy,nx,ny);
    var bx = nx + bondLen*0.55, by = ny + bondLen*0.1;
    var r = bondLen*0.5;
    // 6-ring
    var pts=[];
    for(var i=0;i<6;i++){var a=i*Math.PI/3; pts.push({x:bx+Math.cos(a)*r,y:by+Math.sin(a)*r});}
    for(var i=0;i<6;i++){svg+=b(pts[i].x,pts[i].y,pts[(i+1)%6].x,pts[(i+1)%6].y);}
    // 5-ring fused
    var fl = {x:pts[2].x - bondLen*0.65, y:(pts[2].y+pts[3].y)/2};
    svg += b(pts[2].x,pts[2].y,fl.x,fl.y);
    svg += b(fl.x,fl.y,pts[3].x,pts[3].y);
    svg += T(fl.x-5,fl.y,'N',N,11,700);
    svg += b(nx,ny,pts[5].x,pts[5].y);
    svg += '<text x="'+(bx+bondLen*0.2)+'" y="'+(by+bondLen+18)+'" text-anchor="middle" fill="'+N+'" font-size="9" font-family="Space Grotesk, sans-serif">Indole</text>';
  } else if(seg.bond === 'imidazole'){
    svg += b(cx,cy,nx,ny);
    var ix = nx, iy = ny + bondLen*0.8;
    var r2 = bondLen*0.55;
    var ip=[];
    for(var i=0;i<5;i++){var a=-Math.PI/2+i*2*Math.PI/5; ip.push({x:ix+Math.cos(a)*r2*1.2,y:iy+Math.sin(a)*r2});}
    for(var i=0;i<5;i++){svg+=b(ip[i].x,ip[i].y,ip[(i+1)%5].x,ip[(i+1)%5].y);}
    svg += T(ip[0].x, ip[0].y-12, 'N', N, 11, 700);
    svg += T(ip[2].x+10, ip[2].y, 'NH', N, 10, 700);
    svg += '<text x="'+ix+'" y="'+(iy+r2+14)+'" text-anchor="middle" fill="'+N+'" font-size="9" font-family="Space Grotesk, sans-serif">Imidazole (pKa ~6)</text>';
  } else if(seg.bond === 'guanidino'){
    svg += b(cx,cy,nx,ny);
    svg += T((cx+nx)/2, (cy+ny)/2 - 10, 'NH', N, 10, 500);
    var cx2 = nx + dir.dx*bondLen*0.7;
    var cy2 = ny + dir.dy*bondLen*0.25;
    svg += b(nx,ny,cx2,cy2);
    svg += T(cx2+2, cy2-10, 'C', C, 11, 700);
    // =NH2+
    var up = {x:cx2-10, y:cy2-bondLen*0.6};
    svg += b(cx2,cy2,up.x,up.y,2,true);
    svg += T(up.x-12, up.y-4, '=NH₂⁺', N, 10, 600, 'end');
    // -NH2
    var dn = {x:cx2+bondLen*0.8, y:cy2+bondLen*0.3};
    svg += b(cx2,cy2,dn.x,dn.y);
    svg += T(dn.x+12, dn.y, 'NH₂', N, 10, 500);
  } else if(seg.bond === 'amide'){
    svg += b(cx,cy,nx,ny);
    svg += T(nx+2, ny-10, 'C', C, 11, 700);
    var u={x:nx-8,y:ny-bondLen*0.6};
    svg += b(nx,ny,u.x,u.y,2,true);
    svg += T(u.x-4, u.y-10, 'O', O, 11, 700);
    var d={x:nx+14,y:ny+bondLen*0.55};
    svg += b(nx,ny,d.x,d.y);
    svg += T(d.x+14, d.y, 'NH₂', N, 10, 600);
  } else if(seg.bond === 'carboxyl'){
    svg += b(cx,cy,nx,ny);
    svg += T(nx+2, ny-10, 'C', C, 11, 700);
    var u={x:nx-10,y:ny-bondLen*0.6};
    svg += b(nx,ny,u.x,u.y,2,true);
    svg += T(u.x-4, u.y-10, 'O', O, 11, 700);
    var d={x:nx+14,y:ny+bondLen*0.35};
    svg += b(nx,ny,d.x,d.y);
    svg += T(d.x+14, d.y, 'O⁻', O, 11, 700);
  } else if(seg.bond === 'amine'){
    svg += b(cx,cy,nx,ny);
    svg += T(nx+14, ny, 'NH₃⁺', N, 11, 700);
  }
}
