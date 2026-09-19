const VERSION='1.1.0';
const STORAGE_KEY='yadeto.birthdays.v1';
const monthNames=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const fa=new Intl.NumberFormat('fa-IR');
const seed=[
  {id:'seed-sara',name:'سارا',day:25,month:6,year:1374,group:'دوست صمیمی',favorite:true,daysAway:3,note:'عاشق سفر و کتابه :)',avatar:'s'},
  {id:'seed-ali',name:'علی',day:28,month:6,year:1369,group:'خانواده',favorite:false,daysAway:6,note:'',avatar:'a'},
  {id:'seed-mohammad',name:'محمد',day:10,month:7,year:1376,group:'همکاران',favorite:false,daysAway:18,note:'',avatar:'m'},
  {id:'seed-maryam',name:'مریم',day:12,month:7,year:1378,group:'دوستان',favorite:true,daysAway:20,note:'',avatar:'r'}
];
const state={items:loadItems(),filter:'all',query:'',favoritesOnly:false,deferredPrompt:null,currentPage:'home'};
const qs=(s,p=document)=>p.querySelector(s);const qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const list=qs('#birthdayList'),empty=qs('#emptyState'),count=qs('#resultCount'),toast=qs('#toast');
const onboarding=qs('#onboarding'),product=qs('#product'),topbar=qs('.topbar'),bottomNav=qs('.bottom-nav'),fab=qs('#addButton');
function loadItems(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(data)?data:seed}catch{return seed}}
function saveItems(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.items))}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function icon(name){return `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`}
function formatDate(item){return `${fa.format(item.day)} ${monthNames[item.month-1]}${item.year?` ${fa.format(item.year)}`:''}`}
function dueLabel(days){if(days===0)return 'امروز';if(days===1)return 'فردا';return `${fa.format(days)} روز دیگه`}
function avatarClass(item){return `avatar-${item.avatar||['s','a','m','r'][Math.abs(item.name.length)%4]}`}
function getVisibleItems(){return state.items.filter(item=>{const q=state.query.trim();const matchesQuery=!q||item.name.includes(q)||item.group.includes(q);const matchesFavorite=!state.favoritesOnly||item.favorite;const d=Number(item.daysAway??30);const matchesFilter=state.filter==='all'||(state.filter==='today'&&d===0)||(state.filter==='week'&&d<=7)||(state.filter==='month'&&d<=31);return matchesQuery&&matchesFavorite&&matchesFilter}).sort((a,b)=>(a.daysAway??30)-(b.daysAway??30))}
function render(){const items=getVisibleItems();list.innerHTML=items.map(item=>`<button class="birthday-card" data-id="${escapeHtml(item.id)}"><span class="avatar ${avatarClass(item)}">${escapeHtml(item.name.slice(0,1))}</span><span class="birthday-info"><b>${escapeHtml(item.name)}</b><span>${formatDate(item)}</span><span>${dueLabel(Number(item.daysAway??30))}</span></span><span class="gift">${icon('gift')}</span></button>`).join('');count.textContent=`${fa.format(items.length)} متولد`;empty.hidden=items.length!==0;list.hidden=items.length===0;renderCalendar()}
function renderCalendar(){const grid=qs('#calendarGrid');if(!grid)return;const eventDays=new Set(state.items.filter(x=>x.month===7).map(x=>x.day));grid.innerHTML='<span></span>'.repeat(3)+Array.from({length:30},(_,i)=>{const day=i+1;const cls=[day===2?'today':'',eventDays.has(day)?'event':'',day===10?'coral':''].filter(Boolean).join(' ');return `<span class="${cls}">${fa.format(day)}</span>`}).join('');qs('#monthEvents').innerHTML=state.items.slice(0,4).map(item=>`<div class="month-event"><span class="avatar ${avatarClass(item)}">${escapeHtml(item.name[0])}</span><div><b>${escapeHtml(item.name)}</b><small>${fa.format(item.day)} ${monthNames[item.month-1]}</small></div><span class="gift">${icon('gift')}</span></div>`).join('')}
function showProduct(){onboarding.hidden=true;product.hidden=false;localStorage.setItem('yadeto.onboarded','1');render()}
function go(page){if(!qs(`[data-page="${page}"]`))return;state.currentPage=page;qsa('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===page));const mainPages=['home','calendar','notes','settings'];topbar.hidden=page!=='home';bottomNav.hidden=!mainPages.includes(page);fab.hidden=page!=='home';qsa('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.nav===page));window.scrollTo({top:0,behavior:'smooth'});closeDrawer()}
function showDetail(id){const item=state.items.find(x=>x.id===id);if(!item)return;const age=item.year?1405-item.year:null;qs('#detailContent').innerHTML=`<span class="avatar detail-avatar ${avatarClass(item)}">${escapeHtml(item.name[0])}</span><h2>${escapeHtml(item.name)}</h2><span class="date">${formatDate(item)} (${dueLabel(Number(item.daysAway??30))})</span><div class="quick-actions"><button class="quick-action"><span>${icon('bell')}</span>یادآوری</button><button class="quick-action"><span>${icon('note')}</span>یادداشت</button><button class="quick-action"><span>${icon('gift')}</span>ایده هدیه</button></div><article class="info-card"><h3>اطلاعات بیشتر</h3><div class="info-row">${icon('heart')}<span>رابطه</span><b>${escapeHtml(item.group)}</b></div><div class="info-row">${icon('calendar')}<span>سن</span><b>${age?`${fa.format(age)} سال`:'ثبت نشده'}</b></div><div class="info-row">${icon('note')}<span>یادداشت</span><b>${escapeHtml(item.note||'یادداشتی ثبت نشده')}</b></div></article>`;go('detail')}
let toastTimer;function showToast(message){toast.textContent=message;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,2400)}
function openDrawer(){qs('#drawer').hidden=false;qs('#drawerBackdrop').hidden=false;document.body.style.overflow='hidden'}
function closeDrawer(){qs('#drawer').hidden=true;qs('#drawerBackdrop').hidden=true;document.body.style.overflow=''}
qs('#startButton').addEventListener('click',showProduct);qs('#loginButton').addEventListener('click',showProduct);
qs('#searchInput').addEventListener('input',e=>{state.query=e.target.value;render()});
qs('#filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;state.filter=button.dataset.filter;qsa('.filter').forEach(x=>x.classList.toggle('active',x===button));render()});
qs('#favoriteButton').addEventListener('click',e=>{state.favoritesOnly=!state.favoritesOnly;e.currentTarget.innerHTML=`${icon('heart')} ${state.favoritesOnly?'نمایش همه':'منتخب‌ها'}`;render()});
list.addEventListener('click',e=>{const card=e.target.closest('.birthday-card');if(card)showDetail(card.dataset.id)});
document.addEventListener('click',e=>{const nav=e.target.closest('[data-nav]');if(nav)go(nav.dataset.nav);const target=e.target.closest('[data-go]');if(target)go(target.dataset.go)});
fab.addEventListener('click',()=>go('add'));qs('#menuButton').addEventListener('click',openDrawer);qs('#closeDrawer').addEventListener('click',closeDrawer);qs('#drawerBackdrop').addEventListener('click',closeDrawer);
qs('#birthdayForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const name=String(data.get('name')).trim();const item={id:crypto.randomUUID?.()||String(Date.now()),name,day:Number(data.get('day')),month:Number(data.get('month')),year:Number(data.get('year'))||null,group:String(data.get('group')),note:String(data.get('note')).trim(),favorite:data.get('favorite')==='on',daysAway:30,avatar:['s','a','m','r'][state.items.length%4]};state.items.push(item);saveItems();render();e.currentTarget.reset();go('home');showToast('متولد جدید با موفقیت ثبت شد')});
qsa('.save-reminder').forEach(x=>x.addEventListener('click',()=>showToast('تنظیمات یادآوری ذخیره شد')));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;qs('#installButton').hidden=false});qs('#installButton').addEventListener('click',async()=>{if(!state.deferredPrompt)return;state.deferredPrompt.prompt();await state.deferredPrompt.userChoice;state.deferredPrompt=null;qs('#installButton').hidden=true});
if('serviceWorker' in navigator){navigator.serviceWorker.register(`sw.js?v=${VERSION}`).then(reg=>{reg.update();reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)qs('#updateBanner').hidden=false})})});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload())}
qs('#updateButton').addEventListener('click',()=>navigator.serviceWorker.getRegistration().then(reg=>{if(reg?.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});else location.reload()}));
if(localStorage.getItem('yadeto.onboarded'))showProduct();
