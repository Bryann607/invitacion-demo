/* ============ DATOS: edita solo esta parte ============ */
const CFG={
    nombre:'Yesica', apellidos:'PACHAS YANAC', edad:50,
    fecha:'2026-10-24T20:00:00-05:00',      // año-mes-día T hora (Perú = -05:00)
    lugar:'Urb Los Viñedos Mzb7 Lt6',
    direccion:'Techo Propio, Grocio Prado',
    mapa:'https://maps.app.goo.gl/fFEDi6sPYPph6kL96',
    vestimenta:'Código de vestimenta: formal',
    frase:'Medio siglo de amor, sueños y alegrías. Acompáñame a brindar por lo vivido y por todo lo bello que está por venir.'
  };
  /* ======================================================= */
  const $=s=>document.querySelector(s),D=new Date(CFG.fecha),tz={timeZone:'America/Lima'};
  const F=(o)=>D.toLocaleDateString('es-PE',{...tz,...o});
  const val={nombre:CFG.nombre,apellidos:CFG.apellidos,frase:CFG.frase,lugar:CFG.lugar,direccion:CFG.direccion,vestimenta:CFG.vestimenta,
   mes:F({month:'long'}).toUpperCase()+'  '+F({year:'numeric'}),diasemana:F({weekday:'long'}).toUpperCase(),dia:F({day:'numeric'}),
   hora:D.toLocaleTimeString('en-US',{...tz,hour:'numeric',minute:'2-digit'}).toUpperCase()};
  document.querySelectorAll('[data-f]').forEach(e=>e.textContent=val[e.dataset.f]);
  $('#mapa').href=CFG.mapa;
  
  /* Flores (SVG generadas) */
  function flor(){let p='';for(let i=0;i<12;i++){const r=i*30;p+=`<ellipse cx="100" cy="52" rx="${i%2?14:20}" ry="${i%2?34:48}" transform="rotate(${r} 100 100)" fill="#d4af37" fill-opacity="${i%2?.28:.12}" stroke="#f3e2a9" stroke-width="1"/>`}
   for(let i=0;i<8;i++)p+=`<ellipse cx="100" cy="76" rx="9" ry="22" transform="rotate(${i*45+20} 100 100)" fill="#f3e2a9" fill-opacity=".35" stroke="#f3e2a9" stroke-width=".8"/>`;
   return `<svg viewBox="0 0 200 200">${p}<circle cx="100" cy="100" r="9" fill="#f3e2a9"/></svg>`}
  document.querySelectorAll('.flor').forEach(e=>e.innerHTML=flor());
  
  /* Escenas: aparecen al llegar; el 50 cuenta de 0 a 50 */
  let contado=false;
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');
   if(x.target.id==='s1'&&!contado){contado=true;let n=0;const t=setInterval(()=>{$('#num').textContent=++n;if(n>=CFG.edad){clearInterval(t);burst(innerWidth/2,innerHeight*.4,120)}},38)}}}),{threshold:.45});
  document.querySelectorAll('.scene').forEach(s=>io.observe(s));
  
  /* Cuenta regresiva */
  setInterval(()=>{let d=Math.max(0,D-Date.now());const u=[864e5,36e5,6e4,1e3];
   ['cd','ch','cm','cs'].forEach((id,i)=>{$('#'+id).textContent=String(Math.floor(d/u[i])).padStart(2,'0');d%=u[i]})},1000);
  
  /* Confeti y destellos */
  const cv=$('#fx'),c=cv.getContext('2d');let P=[];const COL=['#d4af37','#f3e2a9','#d9d9e0','#fff3c4'];
  const rs=()=>{cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio};rs();addEventListener('resize',rs);
  function burst(x,y,n){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=3+Math.random()*9;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,w:5+Math.random()*6,h:3+Math.random()*4,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:COL[i%4],l:1})}}
  function lluvia(){if(P.length<70&&Math.random()<.35)P.push({x:Math.random()*innerWidth,y:-10,vx:(Math.random()-.5)*.6,vy:.8+Math.random()*1.4,w:4+Math.random()*4,h:2+Math.random()*3,r:Math.random()*6,vr:(Math.random()-.5)*.1,c:COL[Math.random()*4|0],l:.6,g:0})}
  (function loop(){c.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);c.clearRect(0,0,innerWidth,innerHeight);lluvia();
   P=P.filter(p=>p.y<innerHeight+20);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.g===undefined){p.vy+=.22;p.vx*=.99}p.r+=p.vr;
    c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=p.l;c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))+1);c.restore()});requestAnimationFrame(loop)})();
  addEventListener('pointerdown',e=>burst(e.clientX,e.clientY,22));
  
  /* Apertura + música */
  const aud=$('#aud'),mus=$('#mus');
  $('#abrir').onclick=()=>{const p=$('#portada');p.classList.add('abre');burst(innerWidth/2,innerHeight/2,160);
   setTimeout(()=>{p.classList.add('fin');document.body.classList.remove('locked')},1700);
   aud.volume=.6;aud.play().then(()=>{mus.style.display='block';mus.classList.add('on')}).catch(()=>{})};
  mus.onclick=()=>{if(aud.paused){aud.play();mus.classList.add('on')}else{aud.pause();mus.classList.remove('on')}};
  