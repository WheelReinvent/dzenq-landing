(function(){
const enc=new TextEncoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const sha=async s=>b64(await crypto.subtle.digest('SHA-256',enc.encode(s)));
const $=id=>document.getElementById(id);
const subtle=window.crypto&&crypto.subtle;
const EN=document.documentElement.lang==='en';
const L=(u,e)=>EN?e:u;

/* 1 — signature */
(async()=>{
  const ta=$('sigText'),out=$('sigVal'),v=$('sigVerdict');
  if(!subtle){v.textContent=L('Браузер не дає доступу до криптографії (потрібен https).','The browser gives no access to cryptography (https needed).');v.className='verdict warn';return}
  const kp=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
  const orig=ta.value;
  const sig=await subtle.sign({name:'ECDSA',hash:'SHA-256'},kp.privateKey,enc.encode(orig));
  out.textContent=b64(sig);
  const check=async()=>{
    const ok=await subtle.verify({name:'ECDSA',hash:'SHA-256'},kp.publicKey,sig,enc.encode(ta.value));
    v.textContent=ok?L('✓ Підпис сходиться: це саме те, що написала Оля.','✓ The signature matches: this is exactly what Olya wrote.'):L('✗ Підпис не сходиться: текст змінено після підпису.','✗ The signature doesn\'t match: the text changed after signing.');
    v.className='verdict'+(ok?'':' bad');
  };
  ta.addEventListener('input',check);check();
})();

/* 2 — key event log */
(async()=>{
  const box=$('chain'),v=$('kelVerdict');if(!subtle){v.textContent=L('Потрібен https.','https needed.');v.className='verdict warn';return}
  const evs=EN?[
    ['Birth','Key #1 · fingerprint of key #2'],
    ['Thank-yous · 14 May','3 thank-yous · tree root 7Hq…'],
    ['Key change','Key #2 · fingerprint of key #3'],
    ['Thank-yous · 2 June','1 thank-you · tree root Lc0…'],
  ]:[
    ['Народження','Ключ №1 · відбиток ключа №2'],
    ['Подяки · 14 травня','3 подяки · корінь дерева 7Hq…'],
    ['Зміна ключа','Ключ №2 · відбиток ключа №3'],
    ['Подяки · 2 червня','1 подяка · корінь дерева Lc0…'],
  ];
  const stored=[];let prev='';
  for(const [t,d] of evs){const h=await sha(prev+'|'+t+'|'+d);stored.push({prev,h});prev=h}
  const short=h=>h?h.slice(0,10)+'…':'—';
  evs.forEach(([t,d],i)=>{
    const el=document.createElement('div');el.className='ev';
    el.innerHTML=`<div class="t">${i+1} · ${t}</div><input value="${d}" aria-label="${t}"><div class="h"><span class="p">${L('попередній','previous')}: <b>${short(stored[i].prev)}</b></span><span class="s">${L('відбиток','fingerprint')}: <b>${short(stored[i].h)}</b></span></div>`;
    box.appendChild(el);
  });
  const els=[...box.children];
  const run=async()=>{
    let actual='';let firstBad=-1;
    for(let i=0;i<evs.length;i++){
      const val=els[i].querySelector('input').value;
      const h=await sha(stored[i].prev+'|'+evs[i][0]+'|'+val);
      els[i].querySelector('.s b').textContent=short(h);
      const broken=i>0&&actual!==stored[i].prev;
      els[i].classList.toggle('broken',broken);
      if(broken&&firstBad<0)firstBad=i;
      actual=h;
    }
    if(firstBad<0){v.textContent=L('✓ Ланцюг цілий: кожен запис тримає відбиток попереднього.','✓ The chain is whole: each entry holds the fingerprint of the one before.');v.className='verdict'}
    else{v.textContent=L(`✗ Запис ${firstBad} змінено — запис ${firstBad+1} більше на нього не вказує. Підробку видно одразу.`,`✗ Entry ${firstBad} was changed — entry ${firstBad+1} no longer points to it. The forgery shows at once.`);v.className='verdict bad'}
  };
  els.forEach(e=>e.querySelector('input').addEventListener('input',run));run();
})();

/* 3 — pre-rotation */
(()=>{
  const cur=$('kCur'),nx=$('kNext'),v=$('rotVerdict'),st=$('steal'),rt=$('rotate');
  let s=0;
  const set=n=>{s=n;
    cur.className='kk'+(n===1?' stolen':n===2?' dead':'');
    nx.className='kk'+(n===2?' live':' env');
    cur.querySelector('small').textContent=n===0?L('на телефоні · підписує','on the phone · signing'):n===1?L('тепер і в злодія','now the thief has it too'):L('недійсний з цього запису','void from this entry on');
    nx.querySelector('small').textContent=n===2?L('активний · відбиток №3 уже в журналі','active · #3 fingerprint already in the log'):L('у журналі — лише відбиток','in the log — only its fingerprint');
    v.textContent=n===0?L('Усе спокійно.','All quiet.'):n===1?L('Злодій може підписувати від імені власника. Поки що.','The thief can sign as the owner. For now.'):L('✓ Власник відновив ключ №2 з 12 слів. Злодієві ключ №1 більше нічого не дає.','✓ The owner restored key #2 from the 12 words. Key #1 gives the thief nothing now.');
    v.className='verdict'+(n===1?' bad':n===0?' warn':'');
    st.textContent=n===2?L('Спочатку','Start over'):L('Телефон украли','The phone is stolen');st.disabled=n===1;rt.disabled=n!==1;
  };
  st.onclick=()=>set(s===2?0:1);rt.onclick=()=>set(2);set(0);
})();
})();
