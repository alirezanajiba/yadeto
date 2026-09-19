const modules=[
  {title:'مدیریت کاربران',desc:'حساب‌ها، وضعیت، جست‌وجو و دسترسی کاربران',icon:'users',action:'افزودن کاربر'},
  {title:'مدیریت متولدها',desc:'بررسی و مدیریت اطلاعات تولدهای ثبت‌شده',icon:'cake',action:'افزودن متولد'},
  {title:'مدیریت گروه‌ها',desc:'گروه‌های پیش‌فرض، عنوان و ترتیب نمایش',icon:'folder',action:'گروه جدید'},
  {title:'مدیریت پکیج‌ها',desc:'قیمت، مدت، محدودیت و ویژگی‌های پکیج‌ها',icon:'card',action:'پکیج جدید'},
  {title:'مدیریت اشتراک‌ها',desc:'وضعیت، اعتبار، تمدید و تغییر اشتراک',icon:'activity',action:'اشتراک جدید'},
  {title:'مدیریت تراکنش‌ها',desc:'پرداخت‌های موفق، ناموفق و بازگشت وجه',icon:'card',action:'ثبت تراکنش'},
  {title:'کدهای تخفیف',desc:'تعریف، محدودیت مصرف و گزارش استفاده',icon:'tag',action:'کد جدید'},
  {title:'مدیریت پیامک‌ها',desc:'قالب‌ها، متغیرها، موجودی و گزارش ارسال',icon:'message',action:'قالب جدید'},
  {title:'مدیریت نوتیفیکیشن‌ها',desc:'قالب اعلان و وضعیت Push Notification',icon:'bell',action:'اعلان جدید'},
  {title:'صف یادآوری‌ها',desc:'کارهای در انتظار، خطاها و تلاش مجدد',icon:'activity',action:'اجرای مجدد'},
  {title:'پیام‌های تماس با ما',desc:'درخواست‌های پشتیبانی و پاسخ مدیران',icon:'message',action:'پاسخ جدید'},
  {title:'مدیریت محتوای اپ',desc:'راهنما، درباره ما و اطلاعات تماس',icon:'file',action:'محتوای جدید'},
  {title:'گزارش‌ها و آمار',desc:'کاربران، اشتراک، پرداخت و نرخ ارسال',icon:'chart',action:'گزارش جدید'},
  {title:'مدیران و نقش‌ها',desc:'تعریف مدیر و کنترل سطح دسترسی',icon:'shield',action:'مدیر جدید'},
  {title:'تنظیمات عمومی',desc:'نسخه، سرویس‌ها، درگاه و تنظیمات پایه',icon:'settings',action:'ذخیره تغییرات'},
  {title:'گزارش فعالیت مدیران',desc:'تاریخچه اقدامات حساس و تغییرات پنل',icon:'file',action:'خروجی گزارش'},
  {title:'سلامت سیستم',desc:'وضعیت API، دیتابیس، صف و سرویس پیامک',icon:'activity',action:'بررسی مجدد'}
];
const samples=['نمونه اول','نمونه دوم','نمونه سوم','نمونه چهارم'];
const grid=document.querySelector('#moduleGrid'),search=document.querySelector('#moduleSearch'),dashboard=document.querySelector('#dashboardView'),view=document.querySelector('#moduleView'),toast=document.querySelector('#toast');
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
function render(query=''){grid.innerHTML=modules.filter(x=>x.title.includes(query)||x.desc.includes(query)).map((m,i)=>`<button class="module-card" data-index="${i}"><span class="module-icon">${icon(m.icon)}</span><span class="module-copy"><b>${m.title}</b><p>${m.desc}</p><span>ورود به بخش</span></span><svg class="chevron"><use href="#i-chevron"/></svg></button>`).join('')}
function openModule(index){const m=modules[index];if(!m)return;document.querySelector('#viewTitle').textContent=m.title;document.querySelector('#viewDescription').textContent=m.desc;document.querySelector('#primaryAction span').textContent=m.action;document.querySelector('#tableRows').innerHTML=samples.map((name,i)=>`<div class="table-row"><strong>${m.title.replace('مدیریت ','')} · ${name}</strong><span class="status">فعال</span><span>${i+1} روز پیش</span><button class="row-action">مشاهده</button></div>`).join('');dashboard.hidden=true;view.hidden=false;window.scrollTo(0,0)}
function showToast(message){toast.textContent=message;toast.hidden=false;setTimeout(()=>toast.hidden=true,2200)}
search.addEventListener('input',e=>render(e.target.value.trim()));grid.addEventListener('click',e=>{const card=e.target.closest('.module-card');if(card)openModule(Number(card.dataset.index))});document.querySelector('#backDashboard').addEventListener('click',()=>{view.hidden=true;dashboard.hidden=false});document.querySelector('#primaryAction').addEventListener('click',()=>showToast('فرم ثبت مورد جدید آماده است'));document.querySelector('.management-toolbar').addEventListener('click',e=>{if(e.target.closest('button'))showToast('ابزار انتخاب‌شده اعمال شد')});render();
