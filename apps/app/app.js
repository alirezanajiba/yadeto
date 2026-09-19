const VERSION='1.0.0';
const STORAGE_KEY='yadeto.birthdays.v1';
const monthNames=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const fa=new Intl.NumberFormat('fa-IR');
const seed=[
  {id:'seed-sara',name:'سارا',day:25,month:6,year:1374,group:'دوستان',favorite:true,daysAway:3},
  {id:'seed-ali',name:'علی',day:28,month:6,year:1369,group:'خانواده',favorite:false,daysAway:6},
  {id:'seed-mohammad',name:'محمد',day:10,month:7,year:1376,group:'همکاران',favorite:false,daysAway:18},
  {id:'seed-maryam',name:'مریم',day:12,month:7,year:1378,group:'دوستان',favorite:true,daysAway:20}
];
const state={items:loadItems(),filter:'all',query:'',favoritesOnly:false,deferredPrompt:null};
const list=document.querySelector('#birthdayList');const empty=document.querySelector('#emptyState');const count=document.querySelector('#resultCount');const sheet=document.querySelector('#addSheet');const backdrop=document.querySelector('#sheetBackdrop');const toast=document.querySelector('#toast');
function loadItems(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(data)?data:seed}catch{return seed}}
function saveItems(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.items))}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(item){return `${fa.format(item.day)} ${monthNames[item.month-1]}${item.year?` ${fa.format(item.year)}`:''}`}
function dueLabel(days){if(days===0)return 'امروز';if(days===1)return 'فردا';return `${fa.format(days)} روز دیگه`}
function getVisibleItems(){return state.items.filter(item=>{const q=state.query.trim();const matchesQuery=!q||item.name.includes(q)||item.group.includes(q);const matchesFavorite=!state.favoritesOnly||item.favorite;const d=Number(item.daysAway??30);const matchesFilter=state.filter==='all'||(state.filter==='today'&&d===0)||(state.filter==='week'&&d<=7)||(state.filter==='month'&&d<=31);return matchesQuery&&matchesFavorite&&matchesFilter}).sort((a,b)=>(a.daysAway??30)-(b.daysAway??30))}
function render(){const items=getVisibleItems();list.innerHTML=items.map(item=>`<article class="birthday-card" data-id="${escapeHtml(item.id)}"><div class="avatar" aria-hidden="true">${item.favorite?'★':'♡'}</div><div class="birthday-info"><b>${escapeHtml(item.name)}</b><span>${formatDate(item)} · ${dueLabel(Number(item.daysAway??30))}</span></div><button class="gift" type="button" aria-label="جزئیات ${escapeHtml(item.name)}">🎁</button></article>`).join('');count.textContent=`${fa.format(items.length)} متولد`;empty.hidden=items.length!==0;list.hidden=items.length===0}
function openSheet(){sheet.hidden=false;backdrop.hidden=false;document.body.style.overflow='hidden';setTimeout(()=>sheet.querySelector('input')?.focus(),50)}
function closeSheet(){sheet.hidden=true;backdrop.hidden=true;document.body.style.overflow=''}
let toastTimer;function showToast(message){toast.textContent=message;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,2600)}
document.querySelector('#searchInput').addEventListener('input',e=>{state.query=e.target.value;render()});
document.querySelector('#filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;state.filter=button.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===button));render()});
document.querySelector('#favoriteButton').addEventListener('click',e=>{state.favoritesOnly=!state.favoritesOnly;e.currentTarget.textContent=state.favoritesOnly?'نمایش همه':'منتخب‌ها ☆';render()});
document.querySelector('#addButton').addEventListener('click',openSheet);document.querySelector('#closeSheet').addEventListener('click',closeSheet);backdrop.addEventListener('click',closeSheet);
document.querySelector('#birthdayForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const item={id:crypto.randomUUID?.()||String(Date.now()),name:String(data.get('name')).trim(),day:Number(data.get('day')),month:Number(data.get('month')),year:Number(data.get('year'))||null,group:String(data.get('group')),favorite:data.get('favorite')==='on',daysAway:30};state.items.push(item);saveItems();render();e.currentTarget.reset();closeSheet();showToast('متولد جدید ثبت شد')});
document.querySelectorAll('.nav-item:not(.active)').forEach(button=>button.addEventListener('click',()=>showToast('این بخش در نسخه بعدی فعال می‌شود')));list.addEventListener('click',e=>{const card=e.target.closest('.birthday-card');if(card)showToast('صفحه جزئیات متولد در حال تکمیل است')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;document.querySelector('#installButton').hidden=false});document.querySelector('#installButton').addEventListener('click',async()=>{if(!state.deferredPrompt)return;state.deferredPrompt.prompt();await state.deferredPrompt.userChoice;state.deferredPrompt=null;document.querySelector('#installButton').hidden=true});
if('serviceWorker' in navigator){navigator.serviceWorker.register(`sw.js?v=${VERSION}`).then(reg=>{reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)document.querySelector('#updateBanner').hidden=false})})});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload())}
document.querySelector('#updateButton').addEventListener('click',()=>navigator.serviceWorker.getRegistration().then(reg=>reg?.waiting?.postMessage({type:'SKIP_WAITING'})));render();
