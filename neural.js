// Neural network animated background (firing synapses)
(function(){
  const canvas = document.getElementById('neural-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], pulses = [];
  let mouseX = -1000, mouseY = -1000;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.scale(dpr, dpr);
    init();
  }
  
  function init(){
    nodes = [];
    const density = Math.min(90, Math.max(45, Math.floor((w*h)/18000)));
    for(let i=0;i<density;i++){
      nodes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25,
        r: Math.random()*1.8+1,
        phase: Math.random()*Math.PI*2
      });
    }
  }
  
  function pulse(){
    // Chance of firing a pulse between two close nodes
    if(Math.random()<0.015){
      const a = nodes[Math.floor(Math.random()*nodes.length)];
      let b=null, bd=140;
      for(let k=0;k<8;k++){
        const c = nodes[Math.floor(Math.random()*nodes.length)];
        const d = Math.hypot(a.x-c.x,a.y-c.y);
        if(d<bd && d>30){b=c;bd=d;}
      }
      if(b) pulses.push({a,b,t:0,life:1+Math.random()*0.8});
    }
  }
  
  function frame(){
    ctx.clearRect(0,0,w,h);
    const rootStyle = getComputedStyle(document.documentElement);
    const purpleRgb = rootStyle.getPropertyValue('--purple-rgb').trim() || '196,165,255';
    const pinkRgb = rootStyle.getPropertyValue('--pink-rgb').trim() || '244,114,182';
    const linkCol = `rgba(${purpleRgb},`;
    const nodeCol = `rgba(${pinkRgb},`;
    const pulseColA = `rgba(${purpleRgb},`;
    const pulseColB = `rgba(${pinkRgb},`;
    
    // Update nodes
    for(const n of nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<-20) n.x=w+20; if(n.x>w+20)n.x=-20;
      if(n.y<-20) n.y=h+20; if(n.y>h+20)n.y=-20;
      n.phase += 0.02;
    }
    
    // Draw connections
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d = Math.hypot(dx,dy);
        if(d<130){
          const alpha=(1-d/130)*0.35;
          ctx.strokeStyle=linkCol+alpha.toFixed(3)+')';
          ctx.lineWidth=0.6;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    
    // Draw nodes
    for(const n of nodes){
      const pulse = 0.5+0.5*Math.sin(n.phase);
      ctx.fillStyle=nodeCol+(0.4+0.3*pulse).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r+pulse*0.6,0,Math.PI*2); ctx.fill();
      // Glow
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*6);
      g.addColorStop(0, pulseColA+(0.25+0.15*pulse).toFixed(3)+')');
      g.addColorStop(1, pulseColA+'0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*6,0,Math.PI*2); ctx.fill();
    }
    
    // Draw traveling pulses (synaptic firings)
    for(let i=pulses.length-1;i>=0;i--){
      const p=pulses[i]; p.t+=0.015;
      if(p.t>=1){pulses.splice(i,1);continue;}
      const x=p.a.x+(p.b.x-p.a.x)*p.t, y=p.a.y+(p.b.y-p.a.y)*p.t;
      const headR=2.5+2*Math.sin(p.t*Math.PI);
      const g=ctx.createRadialGradient(x,y,0,x,y,headR*5);
      g.addColorStop(0, pulseColB+'0.8)');
      g.addColorStop(0.5, pulseColA+'0.35)');
      g.addColorStop(1, pulseColA+'0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(x,y,headR*5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=pulseColB+'0.9)';
      ctx.beginPath(); ctx.arc(x,y,headR,0,Math.PI*2); ctx.fill();
    }
    
    if(!prefersReduced) pulse();
    requestAnimationFrame(frame);
  }
  
  window.addEventListener('resize', resize);
  window.addEventListener('load', ()=>{ resize(); frame(); });
  // Kick off immediately if DOM already loaded
  if(document.readyState!=='loading'){ resize(); frame(); }
})();
