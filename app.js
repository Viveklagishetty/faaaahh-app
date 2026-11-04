
const $=s=>document.querySelector(s),fmt=n=>'₹'+n.toLocaleString('en-IN');
const P=d=>'<svg viewBox="0 0 24 24"><path d="'+d+'"/></svg>';
const ic={home:P('M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'),list:P('M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01'),search:P('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5'),back:P('M19 12H5M12 19l-7-7 7-7'),up:P('M12 19V5M5 12l7-7 7 7'),down:P('M12 5v14M5 12l7 7 7-7'),bm:P('M6 3h12v18l-6-4-6 4z'),share:P('M4 12v7h16v-7M12 3v12M7 8l5-5 5 5'),pin:P('M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4'),x:P('M6 6l12 12M18 6L6 18'),ok:'<svg viewBox="0 0 24 24"><path class="dw" d="M5 12.5l4.5 4.5L19 7"/></svg>',no:'<svg viewBox="0 0 24 24"><path class="dw" d="M6 6l12 12M18 6L6 18"/></svg>'};
$('#i1').innerHTML=ic.home;$('#i2').innerHTML=ic.list;
const R=[{n:'Grand Restaurant',r:4.8,km:6.7,t:'20-25',from:220,e:'🍛',g:'#E8432B,#FF9A3D',c:['Chinese','Biryani']},
{n:'Hotel Alpha',r:4.2,km:4.1,t:'18-20',from:180,e:'🍕',g:'#3B5BDB,#8A5CF6',c:['Pizza','Burger']},
{n:'Spice Court',r:4.5,km:3.2,t:'22-28',from:150,e:'🍔',g:'#1E9E4A,#A3D63C',c:['Burger','Chinese']}];
const M=[{id:'p',n:'Paneer Bhurji',p:220,v:1,e:'🧀',g:'#FFE9B8,#FFC857'},{id:'m',n:'Masala Mix',p:220,v:1,e:'🍛',g:'#FFD9C2,#FF9F6B'},{id:'e',n:'Egg Bhurji',p:220,v:0,e:'🍳',g:'#FFF3C4,#FFD84D'},{id:'c',n:'Chicken 65',p:220,v:0,e:'🍗',g:'#FFD0C7,#FF7A63'}];
const CATS=[['Pizza','🍕'],['Burger','🍔'],['Chinese','🥡'],['Biryani','🍛']];
const BAN=[{t:'Paneer feast, ₹150 off',e:'🧀',g:'#E8432B,#FF9A3D',r:0},{t:'Pizza night is on',e:'🍕',g:'#3B5BDB,#8A5CF6',r:1},{t:'Burgers in 22 mins',e:'🍔',g:'#1E9E4A,#A3D63C',r:2}];
const PAY=['Phone Pay','Google Pay','Cash on delivery'];
let scr='sp',cur=0,cart={},bk={},cat='',q='',sid,sq=1,pm=0,tmr,orders=[];
try{orders=JSON.parse(localStorage.getItem('fa_orders')||'[]')}catch(e){}
const mi=id=>M.find(x=>x.id==id);
const sub=()=>Object.keys(cart).reduce((s,i)=>s+mi(i).p*cart[i],0),cnt=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function bill(){const s=sub(),f=s?49:0,t=Math.round(s*.05),d=s>=699?150:0;return{s,f,t,d,tot:s+f+t-d}}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800)}
function go(n){scr=n;({home:rH,menu:rM,cart:rC,orders:rO}[n]||(()=>{}))();
 document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===n));
 $('#nav').classList.toggle('hid',n==='sp');
 document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.g===(n==='orders'?'orders':'home')));bar()}
/* home */
function cards(){const l=R.map((r,i)=>[r,i]).filter(([r])=>(!cat||r.c.includes(cat))&&r.n.toLowerCase().includes(q.trim().toLowerCase()));
 return l.length?l.map(([r,i])=>`<div class="rc" onclick="openR(${i})"><div class="im" style="background:linear-gradient(135deg,${r.g})"><b>${r.e}</b><span class="pill">${r.r} <s>★</s></span><span class="off">🏷️ ₹150 off above ₹699</span></div><div class="rb2"><div><h4>${r.n}</h4><p>🛵 Free Delivery</p><p>⏱ ${r.t} mins</p></div><div class="pr">Prices from<b>${fmt(r.from)}</b></div></div></div>`).join(''):'<p class="nores">No restaurants found. Try another search or category.</p>'}
function rH(){$('#home').innerHTML=`<div class="top rise"><div class="loc">${ic.pin}Hyderabad</div><div class="av">S</div></div>
<label class="sb rise" style="--d:1">${ic.search}<input id="qi" placeholder="Search" oninput="q=this.value;$('#rl').innerHTML=cards()"></label>
<div class="row rise" id="car" style="--d:2">${BAN.map(b=>`<div class="ban" style="background:linear-gradient(135deg,${b.g})"><b>${b.e}</b><h3>${b.t}</h3><button class="ow" onclick="openR(${b.r})">Order Now</button></div>`).join('')}</div>
<h3 class="sec rise" style="--d:3">Select by Category</h3>
<div class="row rise" style="--d:4">${CATS.map(c=>`<button class="chip ${cat===c[0]?'on':''}" onclick="setCat('${c[0]}',this)"><i>${c[1]}</i>${c[0]}</button>`).join('')}</div>
<h3 class="sec rise" style="--d:5">Fastest near you</h3><div class="row rise" id="rl" style="--d:6">${cards()}</div>`;$('#qi').value=q}
function setCat(c,b){cat=cat===c?'':c;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b&&cat));$('#rl').innerHTML=cards()}
function openR(i){if(i!==cur&&cnt()){cart={}}cur=i;go('menu')}
/* menu */
const ctl=id=>{const n=cart[id]||0;return n?`<div class="step"><button onclick="chg('${id}',-1,event)">−</button><b>${n}</b><button onclick="chg('${id}',1,event)">+</button></div>`:`<button class="add" onclick="chg('${id}',1,event)">ADD +</button>`};
const acts=m=>`<button class="cb2 ${bk[m.id]?'on':''}" onclick="bmk('${m.id}',this)">${ic.bm}</button><button class="cb2" onclick="shr()">${ic.share}</button>`;
function rM(){const r=R[cur];$('#menu').innerHTML=`<button class="upb rise" onclick="$('#menu').scrollTo({top:0,behavior:'smooth'})">${ic.up}</button>
<div class="mh rise" style="--d:1;background:linear-gradient(135deg,${r.g})"><h2>${r.n}</h2><span class="pill">${r.r} <s>★</s></span><div>📍 ${r.km} Km</div><div>⏱ ${r.t} mins</div><div class="big">${r.e}</div><div class="mo">🏷️ ₹150 off above ₹699</div></div>
<div class="ml"><h3>Recommended for you</h3>${M.map((m,i)=>`<div class="it rise" style="--d:${i+2}"><div><span class="vd ${m.v?'':'nv'}"></span><h4>${m.n}</h4><p>${fmt(m.p)}</p><div class="ac">${acts(m)}</div></div><div class="tile" style="background:linear-gradient(135deg,${m.g})" onclick="openS('${m.id}')">${m.e}<div class="ctl" id="c-${m.id}" onclick="event.stopPropagation()">${ctl(m.id)}</div></div></div>`).join('')}</div>`}
function bmk(id,b){bk[id]=!bk[id];b.classList.toggle('on',bk[id]);toast(bk[id]?'Saved to favourites':'Removed from favourites')}
function shr(){try{navigator.clipboard.writeText(location.href).catch(()=>{})}catch(e){}toast('Link copied')}
function chg(id,d,e){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];if(d>0&&e)fly(e.currentTarget);upd(id)}
function upd(id){const c=$('#c-'+id);if(c)c.innerHTML=ctl(id);if(scr==='cart')rC();bar()}
function fly(el){const a=el.getBoundingClientRect(),p=$('#ph').getBoundingClientRect(),d=document.createElement('div');d.className='fly';document.body.appendChild(d);
 const x=a.left+a.width/2-8,y=a.top+a.height/2-8,tx=p.left+p.width/2-8,ty=p.bottom-130;
 d.animate([{transform:`translate(${x}px,${y}px) scale(1)`,left:0,top:0},{transform:`translate(${(x+tx)/2}px,${Math.min(y,ty)-60}px) scale(1.3)`,left:0,top:0,offset:.5},{transform:`translate(${tx}px,${ty}px) scale(.3)`,left:0,top:0,opacity:.4}],{duration:650,easing:'cubic-bezier(.4,0,.3,1)'}).onfinish=()=>{d.remove();const b=$('#cb');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}}
function bar(){const n=cnt(),s=sub(),cb=$('#cb'),py=$('#pay');
 cb.classList.toggle('on',n>0&&scr==='menu');
 if(n){const left=Math.max(0,699-s);cb.innerHTML=`<div class="of">🏷️ ${left?`Add ${fmt(left)} more to get ₹150 off`:'₹150 off applied'}</div><div class="pg"><i style="width:${Math.min(100,s/699*100)}%"></i></div><button class="dk" onclick="go('cart')"><span>${n} item${n>1?'s':''} added</span><span>Continue ›</span></button>`}
 py.classList.toggle('on',n>0&&scr==='cart');
 if(n){const b=bill();py.innerHTML=`<div class="of">🏷️ ₹150 off above ₹699</div><div class="py"><button onclick="pm=(pm+1)%3;bar()"><small>Pay using ▲</small><b>${PAY[pm]}</b></button><button class="dk" onclick="place()"><span>${fmt(b.tot)}<small>Total</small></span><span>Place Order ›</span></button></div>`}}
/* sheet */
function openS(id){sid=id;sq=1;rS();$('#ov').classList.add('on');$('#sheet').classList.add('on')}
function closeS(){$('#ov').classList.remove('on');$('#sheet').classList.remove('on')}
function rS(){const m=mi(sid);$('#sheet').innerHTML=`<button class="xb" onclick="closeS()">${ic.x}</button><div class="sh"><div class="pic" style="background:linear-gradient(135deg,${m.g})"><b>${m.e}</b></div><div class="sn"><div><span class="vd ${m.v?'':'nv'}"></span><h3>${m.n}</h3></div><div class="ac">${acts(m)}</div></div><div class="sf"><div class="step"><button onclick="sqc(-1)">−</button><b>${sq}</b><button onclick="sqc(1)">+</button></div><button class="btn" onclick="addS()">Add item - ${fmt(m.p*sq)}</button></div></div>`}
function sqc(d){sq=Math.max(1,sq+d);rS()}
function addS(){cart[sid]=(cart[sid]||0)+sq;closeS();upd(sid);toast(mi(sid).n+' added')}
/* cart */
function rC(){const ids=Object.keys(cart),el=$('#cart');
 if(!ids.length){el.innerHTML=`<div class="empty"><b>🛒</b><h3>Your cart is empty</h3><p>Pick something tasty from the menu.</p><button class="btn" onclick="go('home')">Browse restaurants</button></div>`;return}
 const b=bill(),r=R[cur];
 el.innerHTML=`<div class="hd rise"><button class="rb" onclick="go('menu')">${ic.back}</button><div><b>${r.n}</b><small>Hyderabad ⌄</small></div></div>
${ids.map((id,i)=>{const m=mi(id);return `<div class="ci rise" style="--d:${i+1}"><h3><span class="vd ${m.v?'':'nv'}"></span>${m.n}</h3><div class="rt"><div class="step"><button onclick="chg('${id}',-1)">−</button><b>${cart[id]}</b><button onclick="chg('${id}',1)">+</button></div><p>${fmt(m.p*cart[id])}</p></div></div>`}).join('')}
<button class="more rise" style="--d:4" onclick="go('menu')">+ Add more items</button><hr>
<div class="inf rise" style="--d:5"><em>⏱</em><div>Delivery in 25-30 min</div></div>
<div class="inf rise" style="--d:6"><em>📍</em><div>Delivery at Home<small>123, Main Street, opp campus</small></div></div>
<div class="inf rise" style="--d:7"><em>📞</em><div>Sai, +9187654322</div></div>
<div class="bl rise" style="--d:8"><div><span>Items</span><span>${fmt(b.s)}</span></div><div><span>Delivery</span><span>${fmt(b.f)}</span></div><div><span>Taxes and charges</span><span>${fmt(b.t)}</span></div>${b.d?`<div class="gr"><span>Offer applied</span><span>-${fmt(b.d)}</span></div>`:''}<div class="tt"><span>Total bill</span><span>${fmt(b.tot)}</span></div></div>`}
/* payment */
function hdr(){return `<div class="hd2"><button class="rb" onclick="go('home')">${ic.down}</button><h3>Processing Payment</h3></div>`}
function place(){go('proc');$('#proc').innerHTML=hdr()+`<div class="res"><div class="spin"></div><h3>Confirming ${PAY[pm]}</h3><p class="cap">Please don’t close the app.</p><button class="lnk" onclick="cancelP()">Cancel order</button></div>`;tmr=setTimeout(okP,2400)}
function okP(){const b=bill(),r=R[cur];orders.unshift({r:r.n,e:r.e,items:Object.keys(cart).map(i=>cart[i]+'× '+mi(i).n).join(', '),tot:b.tot,t:Date.now()});
 try{localStorage.setItem('fa_orders',JSON.stringify(orders))}catch(e){}
 cart={};bar();$('#proc').innerHTML=hdr()+`<div class="res"><div class="badge">${ic.ok}</div><h2>Order Placed</h2><p>⏱ Delivery in 25-30 min</p><button class="btn" onclick="go('orders')">Track order</button></div>`;
 const h=$('#proc .res');['🎉','✨','🍕','🍔','🥳','🍛','🎊','⭐'].concat(['🎉','✨','🍗','🧀','🥳','🍳','🎊','⭐']).forEach((c,i)=>{const s=document.createElement('span'),a=Math.random()*6.28,d=110+Math.random()*130;s.className='cf';s.textContent=c;h.appendChild(s);s.animate([{transform:'translate(0,0) scale(.3)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-40}px) rotate(${Math.random()*360}deg) scale(1.2)`,opacity:1,offset:.6},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+120}px) scale(.8)`,opacity:0}],{duration:1500+Math.random()*600,delay:500,fill:'both',easing:'ease-out'}).onfinish=()=>s.remove()})}
function cancelP(){clearTimeout(tmr);$('#proc').innerHTML=hdr()+`<div class="res"><div class="badge bad">${ic.no}</div><h2>Order Cancelled</h2><p class="cap">Your cart is saved. You haven’t been charged.</p><button class="btn" onclick="go('cart')">Try again</button><button class="lnk" onclick="go('home')">Back to home</button></div>`}
/* orders */
function rO(){const el=$('#orders');
 if(!orders.length){el.innerHTML=`<div class="empty"><b>🍽️</b><h3>No orders yet</h3><p>Your placed orders will show up here.</p><button class="btn" onclick="go('home')">Order something</button></div>`;return}
 el.innerHTML=`<h3 class="sec rise">My orders</h3>`+orders.map((o,i)=>{const s=(Date.now()-o.t)/1000,k=s<10?1:s<25?2:3,L=['','Preparing your food','On the way','Delivered'][k];
 return `<div class="oc rise" style="--d:${i+1}"><div><h4>${o.e} ${o.r}</h4><b>${fmt(o.tot)}</b></div><p>${o.items} · ${new Date(o.t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p><div class="trk"><i class="${k>0?'d':''}"></i><i class="${k>1?'d':''}"></i><i class="${k>2?'d':''}"></i></div><div class="stt">${L}</div></div>`}).join('')}
/* boot */
const tick=()=>{$('#clk').textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false})};tick();setInterval(tick,20000);
setInterval(()=>{if(scr!=='orders')return;document.querySelectorAll('.oc').forEach((c,i)=>{const o=orders[i],s=(Date.now()-o.t)/1000,k=s<10?1:s<25?2:3;c.querySelectorAll('.trk i').forEach((t,j)=>t.classList.toggle('d',j<k));c.querySelector('.stt').textContent=['','Preparing your food','On the way','Delivered'][k]})},1000);
let bi=0;setInterval(()=>{const c=$('#car');if(scr!=='home'||!c)return;bi=(bi+1)%BAN.length;c.scrollTo({left:bi*c.children[0].offsetWidth*1.03,behavior:'smooth'})},3600);
setTimeout(()=>go('home'),2800);
