
/* ===== CAROUSEL ===== */
function clearTimers(){carouselTimers.forEach(t=>clearInterval(t));carouselTimers=[];clearInterval(featScrollTimer);}
function initCarousels(container){
  container.querySelectorAll('.l-img, .det-gallery').forEach(cr=>{
    const imgs=cr.querySelectorAll('img'),dots=cr.querySelectorAll('.l-dots span');
    if(imgs.length<=1)return;
    let cur=0;
    const total=imgs.length;
    const show=i=>{
      cur=((i%total)+total)%total;
      imgs.forEach((m,j)=>m.classList.toggle('act',j===cur));
      dots.forEach((d,j)=>d.classList.toggle('act',j===cur));
    };
    // Auto rotate
    const t=setInterval(()=>show(cur+1),3500);
    carouselTimers.push(t);
    // Touch swipe - allow vertical scroll, only intercept horizontal swipe
    let startX=0,startY=0,isDragging=false,direction=null;
    cr.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;isDragging=true;direction=null;},{passive:true});
    cr.addEventListener('touchmove',e=>{
      if(!isDragging)return;
      const dx=Math.abs(e.touches[0].clientX-startX);
      const dy=Math.abs(e.touches[0].clientY-startY);
      if(!direction&&(dx>8||dy>8)){direction=dx>dy?'h':'v';}
      if(direction==='h')e.preventDefault();
    },{passive:false});
    cr.addEventListener('touchend',e=>{
      if(!isDragging)return;isDragging=false;
      if(direction!=='h')return;
      const diff=startX-e.changedTouches[0].clientX;
      if(Math.abs(diff)>40){
        if(diff>0)show(cur+1); else show(cur-1);
      }
    },{passive:true});
    // Click on dots
    dots.forEach((d,j)=>d.onclick=e=>{e.stopPropagation();show(j);});
  });
}

/* ===== HERO CAROUSEL ===== */
let heroIdx=0,heroTimer;
function initHero(){
  const bg=document.getElementById('heroBg');
  const dots=document.getElementById('heroDots');
  bg.innerHTML=HERO_IMGS.map((src,i)=>`<img src="${src}" alt="" class="${i===0?'active':''}" ${i>0?'loading="lazy"':''}>`).join('');
  dots.innerHTML=HERO_IMGS.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('');
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>{
    heroIdx=(heroIdx+1)%HERO_IMGS.length;
    bg.querySelectorAll('img').forEach((img,i)=>img.classList.toggle('active',i===heroIdx));
    dots.querySelectorAll('span').forEach((d,i)=>d.classList.toggle('active',i===heroIdx));
  },4000);
  // Hero touch swipe
  const heroEl=document.querySelector('.hero');
  let hStartX=0;
  heroEl.addEventListener('touchstart',e=>{hStartX=e.touches[0].clientX;},{passive:true});
  heroEl.addEventListener('touchend',e=>{
    const diff=hStartX-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){
      heroIdx=diff>0?(heroIdx+1)%HERO_IMGS.length:(heroIdx-1+HERO_IMGS.length)%HERO_IMGS.length;
      bg.querySelectorAll('img').forEach((img,i)=>img.classList.toggle('active',i===heroIdx));
      dots.querySelectorAll('span').forEach((d,i)=>d.classList.toggle('active',i===heroIdx));
    }
  },{passive:true});
}

/* ===== RENDER CARD ===== */
function renderCard(l,i,mode){
  const cat=getCat(l.catId),apt=isApt(l.catId),equip=isEquip(l.catId),rent=isRent(l.catId);
  const imgs=l.images?.length?l.images:(apt?[APT_IMGS[0]]:equip?[EQUIP_IMGS[0]]:[CAR_IMGS[0]]);
  
  let specs='';
  if(apt){
    specs=`<div class="l-spec">${ICON.bed} ${l.rooms||'—'} غرف</div><div class="l-spec">${ICON.bath} ${l.baths||'—'} حمام</div><div class="l-spec">${ICON.area} ${l.area||'—'} م²</div>`;
  }else if(equip){
    specs='';
  }else{
    specs=`<div class="l-spec">${ICON.car} ${l.carType||'—'} ${l.carModel||''}</div><div class="l-spec">${ICON.year} ${l.carYear||'—'}</div>${rent?'':`<div class="l-spec">${ICON.km} ${l.carKm?l.carKm.toLocaleString()+' كم':'—'}</div>`}`;
  }
  
  const imgHTML=imgs.map((s,j)=>`<img src="${s}" alt="${l.title}" class="${j===0?'act':''}" loading="lazy">`).join('');
  const dotsHTML=imgs.length>1?`<div class="l-dots">${imgs.map((_,j)=>`<span class="${j===0?'act':''}"></span>`).join('')}</div>`:'';
  let badgeClass=l.catId==='apt-rent'?'rent':l.catId==='apt-sale'?'sale':l.catId==='car-rent'?'car-r':l.catId==='car-sale'?'car-s':l.catId==='equip-rent'?'equip-r':'equip-s';
  const badgeLabel=cat?cat.label:'';

  // السعر بدون خصم
  const priceHTML=`<div class="l-footer">
    <div class="l-price-row">
      <span class="l-price">${fmtPrice(l.price)}${rent?'<small> / يوم</small>':''}</span>
    </div>
  </div>`;

  const featHTML=l.featured?'<div class="l-feat"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>':'';

  if(mode==='full'){
    return `<div class="l-card-full af s${Math.min((i%5)+1,5)}" onclick="viewDetail(${l.id})">
      <div class="l-img">${imgHTML}${dotsHTML}<div class="l-badge ${badgeClass}">${badgeLabel}</div>${featHTML}</div>
      <div class="l-body"><div class="l-title">${l.title}</div><div class="l-specs">${specs}</div><div class="l-loc">${ICON.pin}${l.location}، جبلة</div>${priceHTML}</div>
    </div>`;
  }
  
  return `<div class="l-card af s${Math.min((i%5)+1,5)}" onclick="viewDetail(${l.id})">
    <div class="l-img">${imgHTML}${dotsHTML}<div class="l-badge ${badgeClass}">${badgeLabel}</div>${featHTML}</div>
    <div class="l-body"><div class="l-title">${l.title}</div><div class="l-specs">${specs}</div><div class="l-loc">${ICON.pin}${l.location}، جبلة</div>${priceHTML}</div>
  </div>`;
}

/* ===== NAVIGATION ===== */
let _activeTab='home';
function navTab(tab){
  _activeTab=tab;
  // موبايل ناف
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('act'));
  const mBtn=document.querySelector(`.bnav-item[data-p="${tab}"]`);
  if(mBtn)mBtn.classList.add('act');
  // لابتوب ناف
  document.querySelectorAll('.desk-nav-btn').forEach(b=>b.classList.remove('act'));
  const dBtn=document.querySelector(`.desk-nav-btn[data-p="${tab}"]`);
  if(dBtn)dBtn.classList.add('act');

  if(tab==='home'){sC=null;sType=null;sFeatured=false;nav('home');}
  else if(tab==='all-listings'){sC=null;sType=null;sFeatured=false;nav('listings');}
  else if(tab==='cars'){sC=null;sType='car';sFeatured=false;nav('listings');}
  else if(tab==='apts'){sC=null;sType='apartment';sFeatured=false;nav('listings');}
  else if(tab==='equips'){sC=null;sType='equipment';sFeatured=false;nav('listings');}
}
function nav(page){
  clearTimers();
  if(page!=='detail'){
    const bar=document.getElementById('abBottomBar');if(bar)bar.remove();
    const ov=document.getElementById('bookConfirmOverlay');if(ov)ov.remove();
  }
  // حدث ناف اللابتوب
  document.querySelectorAll('.desk-nav-btn').forEach(b=>b.classList.remove('act'));
  if(page==='home'){const b=document.querySelector('.desk-nav-btn[data-p="home"]');if(b)b.classList.add('act');}
  else if(page==='listings'){
    const tab=sType==='car'?'cars':sType==='apartment'?'apts':sType==='equipment'?'equips':'all-listings';
    const b=document.querySelector(`.desk-nav-btn[data-p="${tab}"]`);if(b)b.classList.add('act');
  }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('act'));
  document.getElementById('page-'+page).classList.add('act');
  if(page==='home')renderHome();
  if(page==='listings')renderListings();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ===== HOME ===== */
function renderHome(){
  initHero();
  
  // Categories (merged: شقق + سيارات)
  const mergedCats=[
    {type:'apartment',label:'شقق',img:'https://i.ibb.co/ksgBPMGj/9113438c-14eb-4fe9-8d6c-4386fc39626a.webp'},
    {type:'car',label:'سيارات',img:'https://i.ibb.co/bMrmLvzv/6658e3f2-c893-49cd-a807-09940a025ff9.webp'},
    {type:'equipment',label:'معدات',img:'https://i.ibb.co/CstfTh6h/17b82bbd-6322-433a-b0fe-ac42a7effd2a.webp'}
  ];
  let catHTML='';
  mergedCats.forEach(c=>{
    const tab=c.type==='apartment'?'apts':c.type==='car'?'cars':'equips';
    catHTML+=`<div class="cat-item" onclick="sC=null;sType='${c.type}';navTab('${tab}')">
      <div class="cat-circle"><img src="${c.img}" alt="${c.label}" loading="lazy"></div>
      <div class="cat-label">${c.label}</div>
    </div>`;
  });
  document.getElementById('catGrid').innerHTML=catHTML;
  
  // Featured - كل المميزة
  document.getElementById('featScroll').innerHTML=listings.filter(l=>l.featured).map((l,i)=>renderCard(l,i)).join('');
  
  // Latest - 6 كروت
  document.getElementById('latestGrid').innerHTML=listings.slice(0,6).map((l,i)=>renderCard(l,i)).join('');
  
  setTimeout(()=>initCarousels(document.getElementById('page-home')),150);
  // تحريك تلقائي للمميزة على الموبايل فقط
  if(window.innerWidth<1024) setTimeout(()=>initFeaturedAutoScroll(),300);
}

/* ===== FEATURED AUTO-SCROLL (موبايل فقط) ===== */
let featScrollTimer=null;
function fastScrollTo(el,target,duration){
  const start=el.scrollLeft;
  const diff=target-start;
  let startTime=null;
  function step(t){
    if(!startTime)startTime=t;
    const p=Math.min((t-startTime)/duration,1);
    const ease=p<0.5?2*p*p:(1-Math.pow(-2*p+2,2)/2);
    el.scrollLeft=start+diff*ease;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function initFeaturedAutoScroll(){
  clearInterval(featScrollTimer);
  const el=document.getElementById('featScroll');
  if(!el||!el.children.length)return;
  let idx=0;
  const total=el.children.length;
  featScrollTimer=setInterval(()=>{
    idx++;
    if(idx>=total){idx=0;fastScrollTo(el,0,300);}
    else{const card=el.children[idx];if(card)fastScrollTo(el,card.offsetLeft-el.offsetLeft,300);}
  },3000);
  el.addEventListener('touchstart',()=>clearInterval(featScrollTimer),{passive:true});
  el.addEventListener('touchend',()=>{
    clearInterval(featScrollTimer);
    setTimeout(()=>initFeaturedAutoScroll(),4000);
  },{passive:true});
}
/* ===== ADVANCED FILTER SHEET ===== */
let _filters={};

function openFilterSheet(){
  buildFilterOptions();
  document.getElementById('filterOverlay').classList.add('open');
  document.getElementById('filterSheet').classList.add('open');
}
function closeFilterSheet(){
  document.getElementById('filterOverlay').classList.remove('open');
  document.getElementById('filterSheet').classList.remove('open');
}

function buildFilterOptions(){
  const type=sType;
  const typeLabels={apartment:'شقق',car:'سيارات',equipment:'معدات'};
  document.getElementById('fsTitle').textContent='فلتر'+(type?' — '+typeLabels[type]:'');
  
  // Get relevant listings for extracting unique values
  const pool=type?listings.filter(l=>getCat(l.catId).type===type):listings;
  
  let html='';
  
  // Location - always show
  const locs=[...new Set(pool.map(l=>l.location))];
  html+=buildChipSection('الموقع / الحي','loc',locs);
  
  if(type==='car'){
    const types=[...new Set(pool.map(l=>l.carType).filter(Boolean))];
    const models=[...new Set(pool.map(l=>l.carModel).filter(Boolean))];
    const classes=[...new Set(pool.map(l=>l.carClass).filter(Boolean))];
    const colors=[...new Set(pool.map(l=>l.carColor).filter(Boolean))];
    const years=[...new Set(pool.map(l=>l.carYear).filter(Boolean))].sort((a,b)=>b-a);
    html+=buildChipSection('نوع السيارة','carType',types);
    html+=buildChipSection('الموديل','carModel',models);
    html+=buildChipSection('الفئة','carClass',classes);
    html+=buildChipSection('اللون','carColor',colors);
    html+=buildChipSection('سنة الصنع','carYear',years.map(y=>y+'+'));
    html+=`<div class="fs-section"><div class="fs-label">الكيلومتراج (كم) — حد أقصى</div><input type="number" class="fs-input" id="fsKm" placeholder="حد أقصى (كم)" value="${_filters.maxKm||''}"></div>`;
  }else if(type==='apartment'){
    const rooms=[...new Set(pool.map(l=>l.rooms).filter(Boolean))].sort((a,b)=>a-b);
    const baths=[...new Set(pool.map(l=>l.baths).filter(Boolean))].sort((a,b)=>a-b);
    html+=buildChipSection('غرف النوم','rooms',rooms);
    html+=buildChipSection('الحمامات','baths',baths);
    html+=`<div class="fs-section"><div class="fs-label">المساحة (م²) — حد أدنى</div><input type="number" class="fs-input" id="fsArea" placeholder="حد أدنى (م²)" value="${_filters.minArea||''}"></div>`;
  }
  
  // Price range - always
  html+=`<div class="fs-section"><div class="fs-label">السعر — حد أقصى</div><input type="number" class="fs-input" id="fsPrice" placeholder="حد أقصى (ل.س)" value="${_filters.maxPrice||''}"></div>`;
  
  document.getElementById('fsBody').innerHTML=html;
  
  // Restore previous selections
  Object.keys(_filters).forEach(k=>{
    if(Array.isArray(_filters[k])){
      _filters[k].forEach(v=>{
        const chip=document.querySelector(`.fs-chip[data-key="${k}"][data-val="${v}"]`);
        if(chip)chip.classList.add('act');
      });
    }
  });
}

function buildChipSection(label,key,values){
  if(!values.length)return '';
  let html=`<div class="fs-section"><div class="fs-label">${label}</div><div class="fs-chips">`;
  html+=`<button class="fs-chip${!_filters[key]||!_filters[key].length?' act':''}" data-key="${key}" data-val="" onclick="toggleFilterChip(this,'${key}','')">الكل</button>`;
  values.forEach(v=>{
    const sel=_filters[key]&&_filters[key].includes(String(v));
    html+=`<button class="fs-chip${sel?' act':''}" data-key="${key}" data-val="${v}" onclick="toggleFilterChip(this,'${key}','${v}')">${v}</button>`;
  });
  html+=`</div></div>`;
  return html;
}

function toggleFilterChip(el,key,val){
  if(!val){
    // "الكل" clicked - clear this filter
    delete _filters[key];
    el.parentElement.querySelectorAll('.fs-chip').forEach(c=>c.classList.remove('act'));
    el.classList.add('act');
    return;
  }
  // Remove "الكل" active
  const allBtn=el.parentElement.querySelector('.fs-chip[data-val=""]');
  if(allBtn)allBtn.classList.remove('act');
  
  if(!_filters[key])_filters[key]=[];
  const idx=_filters[key].indexOf(val);
  if(idx>-1){
    _filters[key].splice(idx,1);
    el.classList.remove('act');
    if(!_filters[key].length){delete _filters[key];if(allBtn)allBtn.classList.add('act');}
  }else{
    _filters[key].push(val);
    el.classList.add('act');
  }
}

function clearAllFilters(){
  _filters={};
  buildFilterOptions();
}

function applyFilters(){
  // Save input values
  const kmEl=document.getElementById('fsKm');
  const areaEl=document.getElementById('fsArea');
  const priceEl=document.getElementById('fsPrice');
  if(kmEl&&kmEl.value)_filters.maxKm=parseInt(kmEl.value);else delete _filters.maxKm;
  if(areaEl&&areaEl.value)_filters.minArea=parseInt(areaEl.value);else delete _filters.minArea;
  if(priceEl&&priceEl.value)_filters.maxPrice=parseInt(priceEl.value);else delete _filters.maxPrice;
  closeFilterSheet();
  filterListings();
}

function renderListings(){
  _filters={};
  const typeLabels={apartment:'شقق',car:'سيارات',equipment:'معدات'};
  document.getElementById('listTitle').textContent=sFeatured?'إعلانات مميزة':sC?getCat(sC).label:sType?typeLabels[sType]:'جميع الإعلانات';
  if(sQ)document.getElementById('listSearch').value=sQ;
  
  const visibleCats=sType?CATS.filter(c=>c.type===sType):CATS;
  let fb=`<button class="f-btn ${!sC?'act':''}" onclick="sC=null;filterListings()">الكل</button>`;
  visibleCats.forEach(c=>{
    fb+=`<button class="f-btn ${sC===c.id?'act':''}" onclick="sC='${c.id}';filterListings()">${c.label}</button>`;
  });
  document.getElementById('filterRow').innerHTML=fb;
  filterListings();
}

function filterListings(){
  clearTimers();
  const q=document.getElementById('listSearch').value.trim();
  const filtered=listings.filter(l=>{
    const mc=!sC||l.catId===sC;
    const mt=!sType||getCat(l.catId).type===sType;
    const mf=!sFeatured||l.featured;
    const ms=!q||l.title.includes(q)||l.desc.includes(q)||l.location.includes(q)||(l.carType||'').includes(q)||(l.carModel||'').includes(q);
    if(!(mc&&mt&&mf&&ms))return false;
    
    // Advanced filters
    if(_filters.loc&&_filters.loc.length&&!_filters.loc.includes(l.location))return false;
    if(_filters.carType&&_filters.carType.length&&!_filters.carType.includes(l.carType))return false;
    if(_filters.carModel&&_filters.carModel.length&&!_filters.carModel.includes(l.carModel))return false;
    if(_filters.carClass&&_filters.carClass.length&&!_filters.carClass.includes(l.carClass))return false;
    if(_filters.carColor&&_filters.carColor.length&&!_filters.carColor.includes(l.carColor))return false;
    if(_filters.carYear&&_filters.carYear.length){
      const yrs=_filters.carYear.map(y=>parseInt(y));
      if(!yrs.some(y=>l.carYear>=y))return false;
    }
    if(_filters.rooms&&_filters.rooms.length&&!_filters.rooms.includes(String(l.rooms)))return false;
    if(_filters.baths&&_filters.baths.length&&!_filters.baths.includes(String(l.baths)))return false;
    if(_filters.maxKm&&l.carKm&&l.carKm>_filters.maxKm)return false;
    if(_filters.minArea&&l.area&&l.area<_filters.minArea)return false;
    if(_filters.maxPrice&&l.price>_filters.maxPrice)return false;
    
    return true;
  });
  
  const _visCats=sType?CATS.filter(c=>c.type===sType):CATS;
  document.querySelectorAll('#filterRow .f-btn').forEach((b,i)=>{
    if(i===0)b.classList.toggle('act',!sC);
    else b.classList.toggle('act',sC===_visCats[i-1]?.id);
  });
  
  const typeLabels={apartment:'شقق',car:'سيارات',equipment:'معدات'};
  document.getElementById('listTitle').textContent=sFeatured?'إعلانات مميزة':sC?getCat(sC).label:sType?typeLabels[sType]:'جميع الإعلانات';
  document.getElementById('listCount').textContent=filtered.length+' إعلان';
  
  if(!filtered.length){
    document.getElementById('allGrid').innerHTML='';
    document.getElementById('emptyState').style.display='block';
  }else{
    document.getElementById('emptyState').style.display='none';
    document.getElementById('allGrid').innerHTML=filtered.map((l,i)=>renderCard(l,i,'full')).join('');
    setTimeout(()=>initCarousels(document.getElementById('allGrid')),150);
  }
}

/* ===== DETAIL ===== */
function viewDetail(id){
  clearTimers();
  const l=listings.find(x=>x.id===id);if(!l)return;
  window._currentListing=l;
  const cat=getCat(l.catId),apt=isApt(l.catId),rent=isRent(l.catId);
  const equip=isEquip(l.catId);
  const imgs=l.images?.length?l.images:(apt?[APT_IMGS[0]]:equip?[EQUIP_IMGS[0]]:[CAR_IMGS[0]]);
  
  const imgHTML=imgs.map((s,j)=>`<img src="${s}" alt="${l.title}" class="${j===0?'act':''}" loading="lazy">`).join('');
  const dotsHTML=imgs.length>1?`<div class="l-dots">${imgs.map((_,j)=>`<span class="${j===0?'act':''}"></span>`).join('')}</div>`:'';
  let badgeClass=l.catId==='apt-rent'?'rent':l.catId==='apt-sale'?'sale':l.catId==='car-rent'?'car-r':l.catId==='car-sale'?'car-s':l.catId==='equip-rent'?'equip-r':'equip-s';
  
  // Remove any existing bottom bar
  const oldBar=document.getElementById('abBottomBar');
  if(oldBar)oldBar.remove();
  const oldOverlay=document.getElementById('bookConfirmOverlay');
  if(oldOverlay)oldOverlay.remove();
  
	  if(rent && apt){
	    // ===== RENTAL APARTMENTS - with Monthly/Daily toggle =====
	    let specsHTML=buildDetailSpecs(l,apt);
	    
	    document.getElementById('detWrap').innerHTML=`
	      <div class="det-gallery af">${imgHTML}${dotsHTML}
	        <button class="det-back" onclick="nav('listings')">${ICON.back}</button>
	        <button class="det-share-top" onclick="shareListing(${l.id})">${ICON.share}</button>
	      </div>
	      <div class="det-content">
	        <div class="det-title af">${l.title}</div>
	        <div class="det-meta af s1">
	          <span class="det-price" id="aptRentPrice">${fmtPrice(l.price)} <small>/ يوم</small></span>
	          <span class="det-loc" onclick="openMap('${l.location}')" style="cursor:pointer">${ICON.pin}${l.location}، جبلة</span>
	          <span class="det-cat rent">${cat.label}</span>
	        </div>
	        <div class="det-specs af s2">${specsHTML}</div>
	        ${buildMapSection(l.location)}
	        <div class="det-desc af s3">
	          <h3 class="det-desc-title">الوصف</h3>${l.desc}
	        </div>
	        <button class="det-share-btn af s3" onclick="shareListing(${l.id})" style="margin-bottom:20px">${ICON.share} مشاركة</button>

	        <!-- Monthly/Daily Toggle -->
	        <div class="rent-type-toggle af s4">
	          <button class="rt-btn act" id="rtDaily" onclick="switchRentType('daily',${l.price})">إيجار يومي</button>
	          <button class="rt-btn" id="rtMonthly" onclick="switchRentType('monthly',${l.price})">إيجار شهري</button>
	        </div>

	        <!-- Daily Calendar Section -->
	        <div id="dailySection">
	          <div class="rent-cal-layout">
	            <div class="rent-cal-main">
	              <div id="calSection" class="af s4">
	                <div class="cal-box" id="calBox">
	                  <div class="cal-grid-wrap">
	                    <div class="cal-head-title">${ICON.cal} تواريخ الحجز</div>
	                    <div class="cal-nav">
	                      <button onclick="calPrev()">${ICON.prev}</button>
	                      <div class="cal-mn" id="calMonth"></div>
	                      <button onclick="calNext()">${ICON.next}</button>
	                    </div>
	                    <div class="cal-grid" id="calGrid"></div>
	                  </div>
	                  <div class="cal-sum-wrap">
	                    <div class="cal-sum" id="calSummary" style="display:none">
	                      <div class="cal-row"><span class="cl">من</span><span class="cv" id="calFrom"></span></div>
	                      <div class="cal-row"><span class="cl">إلى</span><span class="cv" id="calTo"></span></div>
	                      <div class="cal-row"><span class="cl">المدة</span><span class="cv"><span id="calDays"></span> يوم</span></div>
	                      <div class="cal-row"><span class="cl">الإجمالي</span><span class="cv" id="calTotal"></span></div>
	                      <div style="text-align:center;margin-top:10px"><button class="cal-clear" onclick="clearCal()">مسح التواريخ</button></div>
	                    </div>
	                  </div>
	                </div>

	                <div id="bookFormSection" class="book-section af" style="display:none">
	                  <div class="bf-form-fields">
	                    <div class="bf-group"><label class="bf-label">الاسم الأول</label><input type="text" id="bfName" class="bf-input" placeholder="مثلاً: أحمد"></div>
	                    <div class="bf-group"><label class="bf-label">الكنية</label><input type="text" id="bfLast" class="bf-input" placeholder="مثلاً: علي"></div>
	                    <div class="bf-group"><label class="bf-label">رقم الهاتف</label><input type="tel" id="bfPhone" class="bf-input" placeholder="09xxxxxxxx"></div>
	                    <div class="bf-group"><label class="bf-label">العنوان <span class="opt-tag">(اختياري)</span></label><input type="text" id="bfAddress" class="bf-input" placeholder="المدينة، الحي"></div>
	                  </div>
	                  <div class="bf-form-footer">
	                    <button class="book-wa-btn" onclick="submitBooking(${l.id})">${ICON.wa} للتأكيد والاستفسار التواصل عبر واتساب</button>
	                  </div>
	                </div>
	              </div>
	            </div>
	            <div class="rent-book-sidebar">
	              <div class="rent-book-card">
	                <div class="rbc-price" id="abSidePrice">${fmtPrice(l.price)} <small>/ يوم</small></div>
	                <div class="rbc-dates" id="abSideDates">حدد التواريخ من الروزنامة</div>
	                <button class="rbc-btn" onclick="handleBookClick()">احجز الآن</button>
	              </div>
	            </div>
	          </div>
	        </div>

	        <!-- Monthly Section -->
	        <div id="monthlySection" style="display:none">
	          <div class="monthly-box af s4">
	            <h3 class="monthly-title">${ICON.cal} مدة الإيجار الشهري</h3>
	            <select class="monthly-select" id="monthlySelect" onchange="selectMonth(this.value,${l.price})">
	              <option value="">— اختر مدة الإيجار —</option>
	            </select>
	            <div class="monthly-summary" id="monthlySummary" style="display:none">
	              <div class="cal-row"><span class="cl">المدة</span><span class="cv" id="monthlyDuration"></span></div>
	              <div class="cal-row"><span class="cl">الإجمالي</span><span class="cv" id="monthlyTotal"></span></div>
	            </div>
	            <div id="monthlyBookForm" class="book-section af" style="display:none;margin-top:16px">
	              <div class="bf-form-fields">
	                <div class="bf-group"><label class="bf-label">الاسم الأول</label><input type="text" id="mbfName" class="bf-input" placeholder="مثلاً: أحمد"></div>
	                <div class="bf-group"><label class="bf-label">الكنية</label><input type="text" id="mbfLast" class="bf-input" placeholder="مثلاً: علي"></div>
	                <div class="bf-group"><label class="bf-label">رقم الهاتف</label><input type="tel" id="mbfPhone" class="bf-input" placeholder="09xxxxxxxx"></div>
	              </div>
	              <div class="bf-form-footer">
	                <button class="book-wa-btn" onclick="submitMonthlyBooking(${l.id})">${ICON.wa} للتأكيد والاستفسار التواصل عبر واتساب</button>
	              </div>
	            </div>
	          </div>
	        </div>

	      </div>`;

	    // Add bottom bar (mobile)
	    const bar=document.createElement('div');
	    bar.id='abBottomBar';
	    bar.className='rent-mobile-bar';
	    bar.innerHTML=`
	      <div style="display:flex;flex-direction:column">
	        <div style="font-size:20px;font-weight:900;color:#1B4B9E" id="abBarPrice">${fmtPrice(l.price)} <small style="font-size:12px;font-weight:500;color:#737373">/ يوم</small></div>
	        <div id="abBarDates" onclick="scrollToCal()" style="font-size:12px;color:#1B4B9E;font-weight:600;text-decoration:underline;cursor:pointer;margin-top:4px">حدد التواريخ</div>
	      </div>
	      <button onclick="handleBookClick()" style="background:linear-gradient(135deg,#1B4B9E,#143A7D);color:#fff;border:none;border-radius:14px;padding:14px 28px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(27,75,158,.3)">احجز الآن</button>`;
	    document.body.appendChild(bar);
	    
	    nav('detail');
	    setTimeout(()=>{
	      initCarousels(document.getElementById('detWrap'));
	      initCalendar(l.price);
	      initMonthlyGrid(l.price);
	    },150);
	    
	  }else if(rent){
    // ===== RENTAL (Cars & Equipment with Calendar & Booking) =====
    let specsHTML=buildDetailSpecs(l,apt);
    
    document.getElementById('detWrap').innerHTML=`
      <div class="det-gallery af">${imgHTML}${dotsHTML}
        <button class="det-back" onclick="nav('listings')">${ICON.back}</button>
        <button class="det-share-top" onclick="shareListing(${l.id})">${ICON.share}</button>
      </div>
      <div class="det-content">
        <div class="det-title af">${l.title}</div>
        <div class="det-meta af s1">
          <span class="det-price">${fmtPrice(l.price)} <small>/ يوم</small></span>
          <span class="det-loc" onclick="openMap('${l.location}')" style="cursor:pointer">${ICON.pin}${l.location}، جبلة</span>
          <span class="det-cat ${badgeClass}">${cat.label}</span>
        </div>
        <div class="det-specs af s2">${specsHTML}</div>
        <div class="det-desc af s3">
          <h3 class="det-desc-title">الوصف</h3>${l.desc}
        </div>
        <button class="det-share-btn af s3" onclick="shareListing(${l.id})" style="margin-bottom:20px">${ICON.share} مشاركة</button>

        <div class="rent-cal-layout">
          <div class="rent-cal-main">
            <div id="calSection" class="af s4">
              <div class="cal-box" id="calBox">
                <div class="cal-grid-wrap">
                  <div class="cal-head-title">${ICON.cal} تواريخ الحجز</div>
                  <div class="cal-nav">
                    <button onclick="calPrev()">${ICON.prev}</button>
                    <div class="cal-mn" id="calMonth"></div>
                    <button onclick="calNext()">${ICON.next}</button>
                  </div>
                  <div class="cal-grid" id="calGrid"></div>
                </div>
                <div class="cal-sum-wrap">
                  <div class="cal-sum" id="calSummary" style="display:none">
                    <div class="cal-row"><span class="cl">من</span><span class="cv" id="calFrom"></span></div>
                    <div class="cal-row"><span class="cl">إلى</span><span class="cv" id="calTo"></span></div>
                    <div class="cal-row"><span class="cl">المدة</span><span class="cv"><span id="calDays"></span> يوم</span></div>
                    <div class="cal-row"><span class="cl">الإجمالي</span><span class="cv" id="calTotal"></span></div>
                    <div style="text-align:center;margin-top:10px"><button class="cal-clear" onclick="clearCal()">مسح التواريخ</button></div>
                  </div>
                </div>
              </div>

              <div id="bookFormSection" class="book-section af" style="display:none">
                <div class="bf-form-fields">
                  <div class="bf-group"><label class="bf-label">الاسم الأول</label><input type="text" id="bfName" class="bf-input" placeholder="مثلاً: أحمد"></div>
                  <div class="bf-group"><label class="bf-label">الكنية</label><input type="text" id="bfLast" class="bf-input" placeholder="مثلاً: علي"></div>
                  <div class="bf-group"><label class="bf-label">رقم الهاتف</label><input type="tel" id="bfPhone" class="bf-input" placeholder="09xxxxxxxx"></div>
                  <div class="bf-group"><label class="bf-label">العنوان <span class="opt-tag">(اختياري)</span></label><input type="text" id="bfAddress" class="bf-input" placeholder="المدينة، الحي"></div>
                </div>
                <div class="bf-form-footer">
                  <button class="book-wa-btn" onclick="submitBooking(${l.id})">${ICON.wa} للتأكيد والاستفسار التواصل عبر واتساب</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rent-book-sidebar">
            <div class="rent-book-card">
              <div class="rbc-price" id="abSidePrice">${fmtPrice(l.price)} <small>/ يوم</small></div>
              <div class="rbc-dates" id="abSideDates">حدد التواريخ من الروزنامة</div>
              <button class="rbc-btn" onclick="handleBookClick()">احجز الآن</button>
            </div>
          </div>
        </div>
      </div>`;

    // Add bottom bar for car rental (mobile only)
    const bar=document.createElement('div');
    bar.id='abBottomBar';
    bar.className='rent-mobile-bar';
    bar.innerHTML=`
      <div style="display:flex;flex-direction:column">
        <div style="font-size:20px;font-weight:900;color:#1B4B9E" id="abBarPrice">${fmtPrice(l.price)} <small style="font-size:12px;font-weight:500;color:#737373">/ يوم</small></div>
        <div id="abBarDates" onclick="scrollToCal()" style="font-size:12px;color:#1B4B9E;font-weight:600;text-decoration:underline;cursor:pointer;margin-top:4px">حدد التواريخ</div>
      </div>
      <button onclick="handleBookClick()" style="background:linear-gradient(135deg,#1B4B9E,#143A7D);color:#fff;border:none;border-radius:14px;padding:14px 28px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(27,75,158,.3)">احجز الآن</button>`;
    document.body.appendChild(bar);
    
    nav('detail');
    setTimeout(()=>{
      initCarousels(document.getElementById('detWrap'));
      initCalendar(l.price);
    },150);
    
  }else{
    // ===== SALE listings - keep original style =====
    let specsHTML=buildDetailSpecs(l,apt);
    
    document.getElementById('detWrap').innerHTML=`
      <div class="det-gallery af">${imgHTML}${dotsHTML}
        <button class="det-back" onclick="nav('listings')">${ICON.back}</button>
        <button class="det-share-top" onclick="shareListing(${l.id})">${ICON.share}</button>
      </div>
      <div class="det-content">
        <div class="det-title af">${l.title}</div>
        <div class="det-meta af s1">
          <span class="det-price">${fmtPrice(l.price)}</span>
          ${l.negotiable!==undefined?`<span class="l-neg ${l.negotiable?'yes':'no'}" style="font-size:12px;padding:6px 14px;border-radius:10px">${l.negotiable?'قابل للتفاوض':'غير قابل للتفاوض'}</span>`:''}
          <span class="det-loc" onclick="openMap('${l.location}')" style="cursor:pointer">${ICON.pin}${l.location}، جبلة</span>
          <span class="det-cat ${badgeClass}">${cat.label}</span>
        </div>
	        <div class="det-specs af s2">${specsHTML}</div>
	        ${apt?buildMapSection(l.location):''}
	        <div class="det-desc-container af s3">
	          <div class="det-desc"><h3 class="det-desc-title">الوصف</h3>${l.desc}</div>
	          <div class="det-actions">
	            <!-- فورم استفسار البيع -->
	            <div class="book-section af" id="saleInquiryForm" style="margin-bottom:16px">
	              <div class="bf-form-fields">
	                <div class="bf-group"><label class="bf-label">الاسم الأول</label><input type="text" id="sifName" class="bf-input" placeholder="مثلاً: أحمد"></div>
	                <div class="bf-group"><label class="bf-label">الكنية</label><input type="text" id="sifLast" class="bf-input" placeholder="مثلاً: علي"></div>
	                <div class="bf-group"><label class="bf-label">رقم الهاتف</label><input type="tel" id="sifPhone" class="bf-input" placeholder="09xxxxxxxx"></div>
	                <div class="bf-group"><label class="bf-label">ملاحظات <span class="opt-tag">(اختياري)</span></label><input type="text" id="sifNote" class="bf-input" placeholder="أي استفسار إضافي..."></div>
	              </div>
	              <div class="bf-form-footer">
	                <button class="book-wa-btn" onclick="submitSaleInquiry(${l.id})">${ICON.wa} للتأكيد والاستفسار التواصل عبر واتساب</button>
	              </div>
	            </div>
	            <button class="det-share-btn" onclick="shareListing(${l.id})">${ICON.share} مشاركة</button>
	          </div>
	        </div>
	      </div>`;
    
    nav('detail');
    setTimeout(()=>initCarousels(document.getElementById('detWrap')),150);
  }
}

function buildDetailSpecs(l,apt){
  if(apt){
    return `
      <div class="det-sp">${ICON.bed}<div><div class="sp-label">غرف النوم</div><div class="sp-val">${l.rooms||'—'}</div></div></div>
      <div class="det-sp">${ICON.bath}<div><div class="sp-label">حمامات</div><div class="sp-val">${l.baths||'—'}</div></div></div>
      <div class="det-sp">${ICON.kitchen}<div><div class="sp-label">مطابخ</div><div class="sp-val">${l.kitchens||'—'}</div></div></div>
      <div class="det-sp">${ICON.living}<div><div class="sp-label">غرف معيشة</div><div class="sp-val">${l.living||'—'}</div></div></div>
      <div class="det-sp">${ICON.balcony}<div><div class="sp-label">شرفات</div><div class="sp-val">${l.balconies||'—'}</div></div></div>
      <div class="det-sp">${ICON.storage}<div><div class="sp-label">غرفة تخزين</div><div class="sp-val">${l.storage?'نعم':'لا'}</div></div></div>
      <div class="det-sp">${ICON.area}<div><div class="sp-label">المساحة</div><div class="sp-val">${l.area||'—'} م²</div></div></div>`;
  }else if(isEquip(l.catId)){
    return '';
  }else{
    return `
      <div class="det-sp">${ICON.car}<div><div class="sp-label">النوع</div><div class="sp-val">${l.carType||'—'}</div></div></div>
      <div class="det-sp">${ICON.model}<div><div class="sp-label">الموديل</div><div class="sp-val">${l.carModel||'—'}</div></div></div>
      <div class="det-sp">${ICON.type}<div><div class="sp-label">الفئة</div><div class="sp-val">${l.carClass||'—'}</div></div></div>
      <div class="det-sp">${ICON.color}<div><div class="sp-label">اللون</div><div class="sp-val">${l.carColor||'—'}</div></div></div>
      <div class="det-sp">${ICON.year}<div><div class="sp-label">سنة الصنع</div><div class="sp-val">${l.carYear||'—'}</div></div></div>
      ${isRent(l.catId)?'':`<div class="det-sp">${ICON.km}<div><div class="sp-label">المسافة</div><div class="sp-val">${l.carKm?l.carKm.toLocaleString()+' كم':'—'}</div></div></div>`}`;
  }
}

/* ===== MONTHLY/DAILY RENT TOGGLE ===== */
let _selectedMonths=null;
let _monthlyPrice=0;

function switchRentType(type,price){
  document.getElementById('rtDaily').classList.toggle('act',type==='daily');
  document.getElementById('rtMonthly').classList.toggle('act',type==='monthly');
  document.getElementById('dailySection').style.display=type==='daily'?'':'none';
  document.getElementById('monthlySection').style.display=type==='monthly'?'':'none';
  // Update price display
  const priceEl=document.getElementById('aptRentPrice');
  if(type==='monthly'){
    priceEl.innerHTML=fmtPrice(price*30)+' <small>/ شهر</small>';
  }else{
    priceEl.innerHTML=fmtPrice(price)+' <small>/ يوم</small>';
  }
  // Update mobile bar
  const barPrice=document.getElementById('abBarPrice');
  if(barPrice){
    if(type==='monthly') barPrice.innerHTML=fmtPrice(price*30)+' <small style="font-size:12px;font-weight:500;color:#737373">/ شهر</small>';
    else barPrice.innerHTML=fmtPrice(price)+' <small style="font-size:12px;font-weight:500;color:#737373">/ يوم</small>';
  }
}

function initMonthlyGrid(dailyPrice){
  _monthlyPrice=dailyPrice*30;
  _selectedMonths=null;
  const sel=document.getElementById('monthlySelect');
  let html='<option value="">— اختر مدة الإيجار —</option>';
  for(let i=1;i<=24;i++){
    html+=`<option value="${i}">${i} شهر</option>`;
  }
  html+=`<option value="-1">∞ مدة غير محددة</option>`;
  sel.innerHTML=html;
  document.getElementById('monthlySummary').style.display='none';
  document.getElementById('monthlyBookForm').style.display='none';
}

function selectMonth(val,dailyPrice){
  const m=parseInt(val);
  if(!val||isNaN(m)){_selectedMonths=null;document.getElementById('monthlySummary').style.display='none';document.getElementById('monthlyBookForm').style.display='none';return;}
  _selectedMonths=m;
  const mp=dailyPrice*30;
  const sum=document.getElementById('monthlySummary');
  sum.style.display='block';
  document.getElementById('monthlyBookForm').style.display='block';
  if(m===-1){
    document.getElementById('monthlyDuration').textContent='مدة غير محددة';
    document.getElementById('monthlyTotal').textContent='يُتفق عليه';
  }else{
    document.getElementById('monthlyDuration').textContent=m+' شهر';
    document.getElementById('monthlyTotal').textContent=fmtPrice(mp*m);
  }
  const barPrice=document.getElementById('abBarPrice');
  const barDates=document.getElementById('abBarDates');
  if(barPrice && m!==-1) barPrice.innerHTML=fmtPrice(mp*m)+' <small style="font-size:12px;font-weight:500;color:#737373">/ '+m+' شهر</small>';
  else if(barPrice) barPrice.innerHTML=fmtPrice(mp)+' <small style="font-size:12px;font-weight:500;color:#737373">/ شهر</small>';
  if(barDates) barDates.textContent=m===-1?'مدة مفتوحة':m+' شهر';
}

// ===== حفظ الطلب في Firestore + localStorage =====
async function _saveIncomingDeal(deal) {
  // localStorage — fallback
  try {
    const deals = JSON.parse(localStorage.getItem('tam_incoming_deals') || '[]');
    deals.unshift(deal);
    localStorage.setItem('tam_incoming_deals', JSON.stringify(deals));
  } catch(e) {}
  // Firestore — الحل الرئيسي
  try {
    const FB = window._FBSITE;
    if (!FB) return;
    const ref = await FB.addDoc(FB.collection(FB.db, 'incomingDeals'), {
      ...deal,
      createdAt: FB.serverTimestamp()
    });
    console.log('[FS] incomingDeal saved:', ref.id);
  } catch(e) { console.warn('[FS] _saveIncomingDeal:', e); }
}

function submitMonthlyBooking(id){
  const l=listings.find(x=>x.id===id)||window._currentListing;if(!l)return;
  const name=document.getElementById('mbfName').value.trim();
  const last=document.getElementById('mbfLast').value.trim();
  const phone=document.getElementById('mbfPhone').value.trim();
  if(!name||!phone){alert('يرجى تعبئة الاسم ورقم الهاتف');return;}
  if(!_selectedMonths){alert('يرجى اختيار مدة الإيجار');return;}
  const cat=getCat(l.catId);
  let msg='🔔 *طلب إيجار شهري جديد*\n';
  msg+='━━━━━━━━━━━━━━━━━\n\n';
  msg+='📌 *'+l.title+'*\n';
  msg+='🏷️ '+cat.label+'\n';
  msg+='📍 '+l.location+'، جبلة\n\n';
  msg+='📆 *تفاصيل الإيجار:*\n';
  msg+='▫️ نوع الإيجار: شهري\n';
  msg+='▫️ المدة: '+(_selectedMonths===-1?'♾️ مدة غير محددة':_selectedMonths+' شهر')+'\n';
  msg+='▫️ الإيجار الشهري: '+fmtPrice(l.price*30)+'\n';
  if(_selectedMonths>0) msg+='▫️ 💰 *الإجمالي: '+fmtPrice(l.price*30*_selectedMonths)+'*\n';
  else msg+='▫️ 💰 الإجمالي: يُتفق عليه\n';
  msg+='\n👤 *معلومات المستأجر:*\n';
  msg+='▫️ الاسم: '+name+' '+last+'\n';
  msg+='▫️ الهاتف: '+phone+'\n';
  msg+='\n✅ بانتظار التأكيد\nشكراً لكم 🙏';
  window.open('https://wa.me/'+l.phone+'?text='+encodeURIComponent(msg),'_blank');
  // حفظ الطلب في localStorage → الأدمن
  _saveIncomingDeal({
    id: 'deal_' + Date.now(),
    customerName: name + (last ? ' ' + last : ''),
    phone: phone,
    listingId: l.id,
    listingTitle: l.title,
    catId: l.catId,
    bookingType: 'rent',
    rentMode: 'monthly',
    startDate: '',
    endDate: '',
    days: 0,
    months: _selectedMonths,
    totalPrice: _selectedMonths > 0 ? l.price * 30 * _selectedMonths : 0,
    message: _selectedMonths === -1 ? 'مدة غير محددة' : '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    isNew: true,
  });
}

function closeRentDetail(){
  const bar=document.getElementById('abBottomBar');
  if(bar)bar.remove();
  nav('listings');
}

function scrollToCal(){
  const el=document.getElementById('calSection');
  if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
}

function handleBookClick(){
  if(!_calStart||!_calEnd){
    scrollToCal();
    // Flash the calendar
    const box=document.getElementById('calBox');
    if(box){box.style.borderColor='var(--primary)';box.style.boxShadow='0 0 0 3px rgba(27,75,158,.15)';setTimeout(()=>{box.style.borderColor='#f0f0f0';box.style.boxShadow='none';},1500);}
    return;
  }
  // Show booking form
  const form=document.getElementById('bookFormSection');
  if(form){
    form.style.display='block';
    form.scrollIntoView({behavior:'smooth',block:'center'});
  }
}

function submitBooking(id){
  const l=listings.find(x=>x.id===id)||window._currentListing;if(!l)return;
  const name=document.getElementById('bfName').value.trim();
  const last=document.getElementById('bfLast').value.trim();
  const phone=document.getElementById('bfPhone').value.trim();
  const address=document.getElementById('bfAddress').value.trim();
  const email=(document.getElementById('bfEmail')||{value:''}).value.trim();
  
  if(!name||!last||!phone){
    // highlight required fields
    ['bfName','bfLast','bfPhone'].forEach(fid=>{
      const el=document.getElementById(fid);
      if(!el.value.trim()){el.style.borderColor='var(--rose)';setTimeout(()=>el.style.borderColor='#f0f0f0',2000);}
    });
    return;
  }
  
  const d=(_calStart&&_calEnd)?Math.round((_calEnd-_calStart)/864e5)+1:0;
  const cat=getCat(l.catId);
  let msg='🔔 *طلب حجز جديد*\n';
  msg+='━━━━━━━━━━━━━━━━━\n\n';
  msg+='📌 *'+l.title+'*\n';
  msg+='🏷️ '+cat.label+'\n';
  msg+='📍 '+l.location+'، جبلة\n\n';
  if(_calStart&&_calEnd){
    msg+='📆 *تفاصيل الحجز:*\n';
    msg+='▫️ تاريخ البداية: '+fmtDate(_calStart)+'\n';
    msg+='▫️ تاريخ النهاية: '+fmtDate(_calEnd)+'\n';
    msg+='▫️ عدد الأيام: '+d+' يوم\n';
    msg+='▫️ السعر اليومي: '+fmtPrice(l.price)+'\n';
    msg+='▫️ 💰 *الإجمالي: '+fmtPrice(l.price*d)+'*\n\n';
  }
  msg+='👤 *معلومات المستأجر:*\n';
  msg+='▫️ الاسم: '+name+' '+last+'\n';
  msg+='▫️ الهاتف: '+phone+'\n';
  if(address)msg+='▫️ العنوان: '+address+'\n';
  if(email)msg+='▫️ الإيميل: '+email+'\n';
  msg+='\n✅ بانتظار التأكيد\nشكراً لكم 🙏';
  
  window.open('https://wa.me/'+l.phone+'?text='+encodeURIComponent(msg),'_blank');
  // حفظ الطلب في localStorage → الأدمن
  _saveIncomingDeal({
    id: 'deal_' + Date.now(),
    customerName: name + ' ' + last,
    phone: phone,
    listingId: l.id,
    listingTitle: l.title,
    catId: l.catId,
    bookingType: 'rent',
    rentMode: 'daily',
    startDate: _calStart ? _calStart.toISOString().slice(0,10) : '',
    endDate: _calEnd ? _calEnd.toISOString().slice(0,10) : '',
    days: d,
    months: 0,
    totalPrice: d > 0 ? l.price * d : 0,
    message: address || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    isNew: true,
  });
  // Show confirmation overlay
  showBookConfirm();
}

function submitSaleInquiry(id){
  const l=listings.find(x=>x.id===id)||window._currentListing;if(!l)return;
  const name=document.getElementById('sifName').value.trim();
  const last=document.getElementById('sifLast').value.trim();
  const phone=document.getElementById('sifPhone').value.trim();
  const note=(document.getElementById('sifNote')||{value:''}).value.trim();
  if(!name||!phone){
    ['sifName','sifPhone'].forEach(fid=>{
      const el=document.getElementById(fid);
      if(el&&!el.value.trim()){el.style.borderColor='var(--rose)';setTimeout(()=>el.style.borderColor='',2000);}
    });
    return;
  }
  const cat=getCat(l.catId);const apt=isApt(l.catId);const eq=isEquip(l.catId);
  let msg='🔔 *استفسار شراء جديد*\n';
  msg+='━━━━━━━━━━━━━━━━━\n\n';
  msg+='📌 *'+l.title+'*\n';
  msg+='🏷️ '+cat.label+'\n';
  msg+='💰 '+fmtPrice(l.price)+'\n';
  msg+='📍 '+l.location+'، جبلة\n\n';
  if(apt){msg+='🛏️ '+l.rooms+' غرف | 🚿 '+l.baths+' حمام | 📐 '+l.area+' م²\n';}
  else if(!eq){msg+='🚗 '+l.carType+' '+l.carModel+' | 📅 '+l.carYear+'\n';}
  msg+='\n👤 *معلومات المشتري:*\n';
  msg+='▫️ الاسم: '+name+' '+last+'\n';
  msg+='▫️ الهاتف: '+phone+'\n';
  if(note)msg+='▫️ ملاحظات: '+note+'\n';
  msg+='\n✅ بانتظار التواصل\nشكراً لكم 🙏';
  window.open('https://wa.me/'+l.phone+'?text='+encodeURIComponent(msg),'_blank');
  // حفظ الطلب → الأدمن
  _saveIncomingDeal({
    id:'deal_'+Date.now(),
    customerName: name+(last?' '+last:''),
    phone: phone,
    listingId: l.id,
    listingTitle: l.title,
    catId: l.catId,
    bookingType:'sale',
    rentMode:'',
    startDate:'', endDate:'', days:0, months:0,
    totalPrice: l.price,
    message: note,
    status:'pending',
    createdAt: new Date().toISOString(),
    isNew: true,
  });
  showBookConfirm();
}

function showBookConfirm(){
  const old=document.getElementById('bookConfirmOverlay');
  if(old)old.remove();
  const ov=document.createElement('div');
  ov.id='bookConfirmOverlay';
  ov.className='book-confirm-overlay';
  ov.innerHTML=`<div class="book-confirm-box">
    <div class="bc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <h3>تم إرسال طلب الحجز!</h3>
    <p>سيتم تأكيد الحجز من قبلنا عبر اتصال هاتفي أو رسالة واتساب أو إيميل</p>
    <button class="bc-close" onclick="document.getElementById('bookConfirmOverlay').remove()">حسناً</button>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)ov.remove();});
}

function openMap(loc){
  const q=encodeURIComponent(loc+' جبلة سوريا');
  window.open('https://www.google.com/maps/search/'+q,'_blank');
}

function buildMapSection(loc){
  const c=LOC_COORDS[loc]||{lat:35.3614,lng:35.9264};
  return `<div class="det-map-section af s2">
    <h3 class="det-map-title">${ICON.pin} موقع العقار</h3>
    <p class="det-map-sub">${loc}، جبلة</p>
    <div class="det-map-wrap" onclick="openMap('${loc}')">
      <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${c.lng-.008}%2C${c.lat-.005}%2C${c.lng+.008}%2C${c.lat+.005}&layer=mapnik" frameborder="0" scrolling="no" loading="lazy" style="width:100%;height:100%;border:0;border-radius:16px;pointer-events:none"></iframe>
      <div class="det-map-overlay">
        <div class="det-map-pin">
          <svg viewBox="0 0 24 24" fill="var(--primary)" stroke="#fff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>
        </div>
      </div>
      <button class="det-map-expand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
      </button>
    </div>
    <p class="det-map-hint">اضغط على الخريطة لفتحها في خرائط غوغل</p>
  </div>`;
}

function openWA(id){
  const l=listings.find(x=>x.id===id)||window._currentListing;if(!l)return;
  const cat=getCat(l.catId);const apt=isApt(l.catId);const rent=isRent(l.catId);const eq=isEquip(l.catId);
  let msg='السلام عليكم 👋\n';
  msg+='أنا مهتم بالإعلان التالي:\n\n';
  msg+='📌 *'+l.title+'*\n';
  msg+='🏷️ '+cat.label+'\n';
  msg+='💰 '+fmtPrice(l.price)+(rent?' / يوم':'')+'\n';
  msg+='📍 '+l.location+'، جبلة\n';
  if(apt){msg+='🛏️ '+l.rooms+' غرف | 🚿 '+l.baths+' حمام | 📐 '+l.area+' م²\n';}
  else if(!eq){msg+='🚗 '+l.carType+' '+l.carModel+' | 📅 '+l.carYear+'\n';}
  if(_calStart&&_calEnd){
    const d=Math.round((_calEnd-_calStart)/864e5)+1;
    msg+='\n📆 *تفاصيل الحجز:*\n';
    msg+='▫️ من: '+fmtDate(_calStart)+'\n';
    msg+='▫️ إلى: '+fmtDate(_calEnd)+'\n';
    msg+='▫️ المدة: '+d+' يوم\n';
    msg+='▫️ الإجمالي: '+fmtPrice(l.price*d)+'\n';
  }
  msg+='\nأرجو التواصل معي لمزيد من التفاصيل 🙏\nشكراً لكم ✨';
  window.open('https://wa.me/'+l.phone+'?text='+encodeURIComponent(msg),'_blank');
}

function shareListing(id){
  const l=listings.find(x=>x.id===id)||window._currentListing;if(!l)return;
  const cat=getCat(l.catId);const apt=isApt(l.catId);const rent=isRent(l.catId);const eq=isEquip(l.catId);
  let text='✨ *'+l.title+'* ✨\n\n';
  text+='🏷️ '+cat.label+'\n';
  text+='💰 '+fmtPrice(l.price)+(rent?' / يوم':'')+'\n';
  text+='📍 '+l.location+'، جبلة\n\n';
  if(apt){text+='🛏️ '+l.rooms+' غرف نوم\n🚿 '+l.baths+' حمام\n📐 '+l.area+' م²\n\n';}
  else if(!eq){
    text+='🚗 '+l.carType+' '+l.carModel+'\n';
    text+='📅 سنة الصنع: '+l.carYear+'\n';
    if(l.carColor)text+='🎨 اللون: '+l.carColor+'\n';
    if(!rent&&l.carKm)text+='⏱️ المسافة: '+(l.carKm).toLocaleString()+' كم\n';
    text+='\n';
  }
  if(l.desc)text+='📝 '+l.desc+'\n\n';
  text+='📲 للتواصل والاستفسار:\nwa.me/'+l.phone+'\n\n';
  text+='🔗 عبر منصة طلبك تم';
  if(navigator.share){
    navigator.share({title:l.title,text:text}).catch(()=>{});
  }else{
    navigator.clipboard.writeText(text).then(()=>{
      const btn=document.querySelector('.det-share-btn');
      if(btn){const orig=btn.innerHTML;btn.innerHTML='✓ تم النسخ!';setTimeout(()=>btn.innerHTML=orig,1500);}
    }).catch(()=>{});
  }
}

/* ===== CALENDAR ===== */
function initCalendar(price){
  _calPrice=price;const n=new Date();calY=n.getFullYear();calM=n.getMonth();_calStart=null;_calEnd=null;renderCal();
}
function calPrev(){calM--;if(calM<0){calM=11;calY--;}renderCal();}
function calNext(){calM++;if(calM>11){calM=0;calY++;}renderCal();}
function clearCal(){_calStart=null;_calEnd=null;renderCal();}
function renderCal(){
  document.getElementById('calMonth').textContent=MONTHS[calM]+' '+calY;
  const fd=new Date(calY,calM,1).getDay(),dm=new Date(calY,calM+1,0).getDate(),td=new Date();td.setHours(0,0,0,0);
  // قراءة التواريخ المحجوزة من localStorage (يتم تحديثه من Firestore)
  const _bookedDates=JSON.parse(localStorage.getItem('tam_booked')||'{}');
  const lid=window._currentListing?String(window._currentListing.id):null;
  const booked=lid?(_bookedDates[lid]||[]):[];
  let h=DAYS.map(d=>`<div class="cal-dn">${d}</div>`).join('');
  for(let i=0;i<fd;i++)h+=`<div class="cal-d emp"><span class="cd-in"></span></div>`;
  for(let d=1;d<=dm;d++){
    const dt=new Date(calY,calM,d),past=dt<td;
    const key=calY+'-'+(calM+1).toString().padStart(2,'0')+'-'+d.toString().padStart(2,'0');
    const isBooked=booked.includes(key);
    let cl='cal-d';
    if(past||isBooked)cl+=' dis';
    else if(_calStart&&_calEnd){
      const t=dt.getTime(),s=_calStart.getTime(),e=_calEnd.getTime();
      if(t===s&&t===e)cl+=' sel rs re';else if(t===s)cl+=' rs';else if(t===e)cl+=' re';else if(t>s&&t<e)cl+=' inr';
    }else if(_calStart&&dt.getTime()===_calStart.getTime())cl+=' sel';
    if(isBooked)cl+=' booked';
    h+=`<div class="${cl}" ${(past||isBooked)?'':`onclick="pickDay(${calY},${calM},${d})"`}><span class="cd-in">${d}</span></div>`;
  }
  document.getElementById('calGrid').innerHTML=h;
  const sm=document.getElementById('calSummary');
  if(_calStart&&_calEnd){
    sm.style.display='block';
    const dy=Math.round((_calEnd-_calStart)/864e5)+1;
    document.getElementById('calFrom').textContent=fmtDate(_calStart);
    document.getElementById('calTo').textContent=fmtDate(_calEnd);
    document.getElementById('calDays').textContent=dy;
    document.getElementById('calTotal').textContent=fmtPrice(_calPrice*dy);
  }else{sm.style.display='none';}
  // Update bottom bar dates and price
  const barDates=document.getElementById('abBarDates');
  const barPrice=document.getElementById('abBarPrice');
  const sidePrice=document.getElementById('abSidePrice');
  const sideDates=document.getElementById('abSideDates');
  if(_calStart&&_calEnd){
    const dy=Math.round((_calEnd-_calStart)/864e5)+1;
    if(barDates){barDates.textContent=fmtDate(_calStart)+' – '+fmtDate(_calEnd)+' ('+dy+' يوم)';barDates.style.color='#525252';}
    if(barPrice)barPrice.innerHTML=fmtPrice(_calPrice*dy)+' <small style="font-size:12px;font-weight:500;color:#737373">/ '+dy+' يوم</small>';
    if(sidePrice)sidePrice.innerHTML=fmtPrice(_calPrice*dy)+' <small>/ '+dy+' يوم</small>';
    if(sideDates)sideDates.textContent=fmtDate(_calStart)+' – '+fmtDate(_calEnd);
  }else{
    if(barDates){barDates.textContent='حدد التواريخ';barDates.style.color='#1B4B9E';}
    if(barPrice)barPrice.innerHTML=fmtPrice(_calPrice)+' <small style="font-size:12px;font-weight:500;color:#737373">/ يوم</small>';
    if(sidePrice)sidePrice.innerHTML=fmtPrice(_calPrice)+' <small>/ يوم</small>';
    if(sideDates)sideDates.textContent='حدد التواريخ من الروزنامة';
  }
}
function pickDay(y,m,d){
  const dt=new Date(y,m,d);
  if(!_calStart||(_calStart&&_calEnd)){_calStart=dt;_calEnd=null;}
  else{if(dt<_calStart){_calEnd=_calStart;_calStart=dt;}else _calEnd=dt;}
  renderCal();
}
function fmtDate(d){return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear();}

/* ===== SEARCH SUGGESTIONS ===== */
function showSuggestions(q){
  const box=document.getElementById('searchSuggestions');
  if(!box)return;
  q=q.trim();
  if(!q){box.classList.remove('open');box.innerHTML='';return;}
  
  const matched=listings.filter(l=>{
    return l.title.includes(q)||l.desc.includes(q)||l.location.includes(q)||(l.carType||'').includes(q)||(l.carModel||'').includes(q);
  }).slice(0,6);
  
  // Also match locations
  const locMatched=LOCS.filter(loc=>loc.includes(q)).slice(0,3);
  
  if(!matched.length&&!locMatched.length){box.classList.remove('open');box.innerHTML='';return;}
  
  let html='';
  locMatched.forEach(loc=>{
    html+=`<div class="sug-item" onclick="document.getElementById('heroSearch').value='${loc}';closeSuggestions();doSearch()">
      <div class="sug-icon loc"><svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg></div>
      <div class="sug-text"><h4>${loc}</h4><p>موقع</p></div>
    </div>`;
  });
  matched.forEach(l=>{
    const apt=isApt(l.catId);const eq=isEquip(l.catId);
    const sugCls=apt?'apt':eq?'equip':'car';
    const sugIcon=apt?'<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px"><path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-3 4a1 1 0 110 2 1 1 0 010-2zm-4 0a1 1 0 110 2 1 1 0 010-2zM8 6a1 1 0 110 2 1 1 0 010-2zm8 4a1 1 0 110 2 1 1 0 010-2zm-4 0a1 1 0 110 2 1 1 0 010-2zm-4 0a1 1 0 110 2 1 1 0 010-2zm4 8h-2v-4h6v4h-2z"/></svg>':eq?'<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.48.48 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px"><path d="M20.54 9.43l-1.28-3.84A2 2 0 0017.36 4H6.64a2 2 0 00-1.9 1.59L3.46 9.43A2 2 0 003 10.86V17a1 1 0 001 1h1a2 2 0 004 0h6a2 2 0 004 0h1a1 1 0 001-1v-6.14a2 2 0 00-.46-1.43zM6.5 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM5.41 10l.96-2.88A1 1 0 017.32 6.5h9.36a1 1 0 01.95.62L18.59 10H5.41zM7 4.5h10M6 3h12"/></svg>';
    html+=`<div class="sug-item" onclick="closeSuggestions();viewDetail(${l.id})">
      <div class="sug-icon ${sugCls}">${sugIcon}</div>
      <div class="sug-text"><h4>${l.title}</h4><p>${l.location} · ${fmtPrice(l.price)}</p></div>
    </div>`;
  });
  box.innerHTML=html;
  box.classList.add('open');
}
function closeSuggestions(){
  const box=document.getElementById('searchSuggestions');
  if(box){box.classList.remove('open');box.innerHTML='';}
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.search-wrap'))closeSuggestions();
});

/* ===== SEARCH ===== */
function doSearch(){sQ=document.getElementById('heroSearch').value.trim();sC=null;sType=null;nav('listings');}

/* ===== SIDE MENU ===== */
function openMenu(){
  document.getElementById('menuOverlay').classList.add('open');
  document.getElementById('sideMenu').classList.add('open');
}
function closeMenu(){
  document.getElementById('menuOverlay').classList.remove('open');
  document.getElementById('sideMenu').classList.remove('open');
}

/* ===== LAPTOP NAVIGATION ===== */
function showLaptopNav(){
  if(window.innerWidth >= 1024){
    document.querySelectorAll('.laptop-nav-item').forEach(item => item.style.display = 'flex');
  }
}
function hideLaptopNav(){
  if(window.innerWidth < 1024){
    document.querySelectorAll('.laptop-nav-item').forEach(item => item.style.display = 'none');
  }
}
window.addEventListener('resize',()=>{
  if(window.innerWidth>=1024)showLaptopNav();
  else hideLaptopNav();
});

// Init
renderHome();

/* ===== PWA INSTALL BANNER ===== */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if(!localStorage.getItem('pwa-dismissed')) showInstallBanner();
});

function showInstallBanner(){
  if(document.getElementById('installBanner')) return;
  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.id = 'installBanner';
  banner.innerHTML = `
    <button class="install-banner-close" onclick="dismissInstall()" aria-label="إغلاق">✕</button>
    <div class="install-banner-icon">
      <img src="https://i.ibb.co/qLf6SZHv/3e7b8340-6509-45e8-a95a-35cb41bef2d6.webp" alt="طلبك تم">
    </div>
    <div class="install-banner-text">
      <strong>ثبّت طلبك تم</strong>
      <span>أضفه للشاشة الرئيسية للوصول السريع</span>
    </div>
    <button class="install-banner-btn" onclick="installApp()">تثبيت</button>
  `;
  document.body.appendChild(banner);
}

function installApp(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(result => {
    deferredPrompt = null;
    hideInstallBanner();
  });
}

function dismissInstall(){
  localStorage.setItem('pwa-dismissed','1');
  hideInstallBanner();
}

function hideInstallBanner(){
  const b = document.getElementById('installBanner');
  if(b) b.remove();
}

// ===== FIREBASE INIT (الموقع الأساسي) =====
(async () => {
  try {
    const { initializeApp }       = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js");
    const { getFirestore, collection, addDoc, doc, getDoc, setDoc, onSnapshot, query, orderBy, serverTimestamp }
                                  = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js");

    const firebaseConfig = {
      apiKey:            "AIzaSyCbbswCo--QVE2YJ1sL0ukLJpESW3B83-8",
      authDomain:        "talabaktam-9f229.firebaseapp.com",
      projectId:         "talabaktam-9f229",
      storageBucket:     "talabaktam-9f229.firebasestorage.app",
      messagingSenderId: "379089138361",
      appId:             "1:379089138361:web:bc8920777d6dbfcffe6168"
    };

    const app = initializeApp(firebaseConfig);
    const db  = getFirestore(app);

    window._FBSITE = { db, collection, addDoc, doc, getDoc, setDoc, serverTimestamp };

    // ===== قراءة الإعلانات من Firestore (تحديث فوري) =====
    onSnapshot(
      query(collection(db, 'listings'), orderBy('id')),
      snap => {
        if (snap.empty) return; // إذا Firestore فارغ نبقى على البيانات المحلية
        const fsListings = [];
        snap.forEach(d => fsListings.push({ ...d.data(), _fsId: d.id }));
        if (fsListings.length > 0) {
          listings.length = 0;
          fsListings.forEach(l => listings.push(l));
          // إعادة رسم الصفحة الحالية
          if (typeof renderHome === 'function') renderHome();
        }
      },
      err => console.warn('[FS] listings:', err)
    );

    // ===== قراءة التواريخ المحجوزة من Firestore =====
    onSnapshot(
      collection(db, 'bookedDates'),
      snap => {
        try {
          const allBooked = JSON.parse(localStorage.getItem('tam_booked') || '{}');
          snap.forEach(d => { allBooked[d.id] = d.data().dates || []; });
          localStorage.setItem('tam_booked', JSON.stringify(allBooked));
          // إعادة رسم التقويم إذا كان مفتوحاً
          if (typeof renderCal === 'function' && window._currentListing) renderCal();
        } catch(e) {}
      },
      err => console.warn('[FS] bookedDates:', err)
    );

    console.log('[Firebase] ✅ Site connected');
  } catch(e) {
    console.warn('[Firebase] Init failed — running offline:', e);
  }
})();

// Service Worker registration
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
