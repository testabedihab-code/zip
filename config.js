/* ===== DATA ===== */
const CATS=[
  {id:'apt-rent',label:'شقق للإيجار',type:'apartment',action:'rent',color:'#0D9488',img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop'},
  {id:'apt-sale',label:'شقق للبيع',type:'apartment',action:'sale',color:'#1B4B9E',img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop'},
  {id:'car-rent',label:'سيارات للإيجار',type:'car',action:'rent',color:'#7C3AED',img:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&h=200&fit=crop'},
  {id:'car-sale',label:'سيارات للبيع',type:'car',action:'sale',color:'#E11D48',img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop'},
  {id:'equip-rent',label:'معدات للإيجار',type:'equipment',action:'rent',color:'#D97706',img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop'},
  {id:'equip-sale',label:'معدات للبيع',type:'equipment',action:'sale',color:'#B45309',img:'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=200&h=200&fit=crop'}
];
const LOCS=['وسط جبلة','الكورنيش','حي الزهراء','حي القلعة','حي الشيخ ضاهر','حي المشروع','حي البرج','حي الجامع الكبير','ضواحي جبلة','طريق اللاذقية'];
const LOC_COORDS={
  'وسط جبلة':{lat:35.3614,lng:35.9264},
  'الكورنيش':{lat:35.3580,lng:35.9200},
  'حي الزهراء':{lat:35.3640,lng:35.9300},
  'حي القلعة':{lat:35.3625,lng:35.9250},
  'حي الشيخ ضاهر':{lat:35.3650,lng:35.9270},
  'حي المشروع':{lat:35.3670,lng:35.9310},
  'حي البرج':{lat:35.3600,lng:35.9280},
  'حي الجامع الكبير':{lat:35.3618,lng:35.9258},
  'ضواحي جبلة':{lat:35.3700,lng:35.9350},
  'طريق اللاذقية':{lat:35.3750,lng:35.9400},
};
const MONTHS=['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'];
const DAYS=['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

const HERO_IMGS=[
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop',
];

const APT_IMGS=[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
];
const CAR_IMGS=[
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop'
];
const EQUIP_IMGS=[
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop'
];

let listings=[
  {id:1,catId:'apt-rent',title:'شقة مفروشة مطلة على البحر',price:150000,location:'الكورنيش',desc:'شقة مفروشة بالكامل، إطلالة بحرية مميزة، طابق ثالث مع مصعد.\nمناسبة للعائلات الصغيرة. تشمل الأجرة الماء والإنترنت.',phone:'963930991965',featured:true,images:[APT_IMGS[0],APT_IMGS[1],APT_IMGS[2]],rooms:2,baths:1,area:85,kitchens:1,balconies:1,living:1,storage:0},
  {id:2,catId:'apt-sale',title:'شقة فاخرة في وسط المدينة',price:85000000,location:'وسط جبلة',desc:'شقة 120 متر مربع، 3 غرف نوم، صالون كبير، مطبخ مجهز.\nموقع مميز قرب جميع الخدمات.',phone:'963930991965',featured:true,images:[APT_IMGS[3],APT_IMGS[4],APT_IMGS[0]],rooms:3,baths:2,area:120,kitchens:1,balconies:2,living:1,storage:1,negotiable:true},
  {id:3,catId:'car-rent',title:'كيا سيراتو 2022 للإيجار اليومي',price:150000,location:'وسط جبلة',desc:'سيارة نظيفة جداً، فل كامل، أوتوماتيك.\nالإيجار يشمل التأمين.',phone:'963930991965',featured:true,images:[CAR_IMGS[0],CAR_IMGS[1],CAR_IMGS[2]],carType:'كيا',carModel:'سيراتو',carYear:2022,carKm:25000,carColor:'أبيض',carClass:'سيدان'},
  {id:4,catId:'car-sale',title:'هيونداي أكسنت 2019 للبيع',price:45000000,location:'حي المشروع',desc:'محرك 1600cc، قطعت 45000 كم فقط، بحالة ممتازة.',phone:'963930991965',featured:false,images:[CAR_IMGS[3],CAR_IMGS[4],CAR_IMGS[0]],carType:'هيونداي',carModel:'أكسنت',carYear:2019,carKm:45000,carColor:'فضي',carClass:'سيدان',negotiable:false},
  {id:5,catId:'apt-rent',title:'استوديو مفروش قرب الجامعة',price:80000,location:'حي الزهراء',desc:'استوديو مفروش بالكامل، مناسب للطلاب.\nيتضمن إنترنت ومياه.',phone:'963930991965',featured:false,images:[APT_IMGS[1],APT_IMGS[2],APT_IMGS[4]],rooms:1,baths:1,area:40,kitchens:1,balconies:0,living:0,storage:0},
  {id:6,catId:'apt-sale',title:'شقة طابقية مع حديقة خاصة',price:120000000,location:'ضواحي جبلة',desc:'شقة طابقية 200 متر مربع مع حديقة خاصة 80 متر.\n4 غرف نوم، 2 حمام.',phone:'963930991965',featured:true,images:[APT_IMGS[4],APT_IMGS[3],APT_IMGS[1]],rooms:4,baths:2,area:200,kitchens:2,balconies:3,living:2,storage:1,negotiable:true},
  {id:7,catId:'car-rent',title:'سوزوكي سويفت 2021 للإيجار',price:100000,location:'حي البرج',desc:'سيارة اقتصادية مناسبة للتنقل اليومي. أوتوماتيك، تكييف.',phone:'963930991965',featured:false,images:[CAR_IMGS[1],CAR_IMGS[2],CAR_IMGS[3]],carType:'سوزوكي',carModel:'سويفت',carYear:2021,carKm:30000,carColor:'أحمر',carClass:'هاتشباك'},
  {id:8,catId:'car-sale',title:'تويوتا كامري 2020 فل كامل',price:75000000,location:'طريق اللاذقية',desc:'فل كامل، فتحة سقف، جلد، كاميرا خلفية.\nصيانة وكالة منتظمة.',phone:'963930991965',featured:true,images:[CAR_IMGS[4],CAR_IMGS[0],CAR_IMGS[2]],carType:'تويوتا',carModel:'كامري',carYear:2020,carKm:35000,carColor:'أسود',carClass:'سيدان',negotiable:true},
  {id:9,catId:'apt-rent',title:'شقة عائلية واسعة 3 غرف',price:200000,location:'حي القلعة',desc:'شقة واسعة مناسبة للعائلات، قريبة من المدارس والسوق.',phone:'963930991965',featured:false,images:[APT_IMGS[2],APT_IMGS[0],APT_IMGS[3]],rooms:3,baths:1,area:130,kitchens:1,balconies:1,living:1,storage:0},
  {id:10,catId:'car-sale',title:'شيفروليه أفيو 2018 نظيفة',price:28000000,location:'وسط جبلة',desc:'سيارة نظيفة، محرك 1500cc، جير عادي.',phone:'963930991965',featured:false,images:[CAR_IMGS[2],CAR_IMGS[4],CAR_IMGS[1]],carType:'شيفروليه',carModel:'أفيو',carYear:2018,carKm:60000,carColor:'أزرق',carClass:'سيدان',negotiable:false},
  {id:11,catId:'equip-rent',title:'حفارة كاتربيلر للإيجار اليومي',price:500000,location:'ضواحي جبلة',desc:'حفارة كاتربيلر 320 بحالة ممتازة.\nمناسبة لأعمال الحفر والتسوية.\nالإيجار يشمل السائق.',phone:'963930991965',featured:true,images:[EQUIP_IMGS[0],EQUIP_IMGS[1],EQUIP_IMGS[2]]},
  {id:12,catId:'equip-sale',title:'رافعة شوكية تويوتا للبيع',price:35000000,location:'طريق اللاذقية',desc:'رافعة شوكية تويوتا، حمولة 3 طن.\nصيانة دورية منتظمة، بحالة جيدة جداً.',phone:'963930991965',featured:true,images:[EQUIP_IMGS[2],EQUIP_IMGS[3],EQUIP_IMGS[4]],negotiable:true},
  {id:13,catId:'equip-rent',title:'خلاطة باطون للإيجار',price:200000,location:'وسط جبلة',desc:'خلاطة باطون سعة 750 لتر.\nمناسبة لمشاريع البناء المتوسطة والكبيرة.',phone:'963930991965',featured:false,images:[EQUIP_IMGS[1],EQUIP_IMGS[0],EQUIP_IMGS[3]]},
  {id:14,catId:'equip-sale',title:'مولدة كهرباء 50 كيلوواط',price:18000000,location:'حي المشروع',desc:'مولدة كهرباء ديزل 50KW.\nساعات تشغيل قليلة، مع كفالة.',phone:'963930991965',featured:false,images:[EQUIP_IMGS[4],EQUIP_IMGS[2],EQUIP_IMGS[0]],negotiable:false},
  {id:15,catId:'equip-rent',title:'كمبريسور هواء صناعي للإيجار',price:100000,location:'حي الزهراء',desc:'كمبريسور هواء صناعي متنقل.\nمناسب لأعمال الدهان والتنظيف الصناعي.',phone:'963930991965',featured:true,images:[EQUIP_IMGS[3],EQUIP_IMGS[1],EQUIP_IMGS[4]]},
];

let sC=null, sType=null, sQ='', sFeatured=false, carouselTimers=[];
let calY,calM,_calStart=null,_calEnd=null,_calPrice=0;

const getCat=id=>CATS.find(c=>c.id===id);
const isApt=id=>getCat(id)?.type==='apartment';
const isEquip=id=>getCat(id)?.type==='equipment';
const isCar=id=>getCat(id)?.type==='car';
const isRent=id=>id?.includes('rent');
const fmtPrice=p=>{
  if(p>=1e6)return(p/1e6).toFixed(p%1e6===0?0:1)+' مليون ل.س';
  if(p>=1e3)return(p/1e3).toFixed(0)+' ألف ل.س';
  return p+' ل.س';
};

/* ===== SVG ICONS ===== */
const ICON={
  bed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
  bath:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/></svg>',
  area:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.54 9.43l-1.28-3.84A2 2 0 0017.36 4H6.64a2 2 0 00-1.9 1.59L3.46 9.43A2 2 0 003 10.86V17a1 1 0 001 1h1a2 2 0 004 0h6a2 2 0 004 0h1a1 1 0 001-1v-6.14a2 2 0 00-.46-1.43z"/><circle cx="6.5" cy="14.5" r="1.5"/><circle cx="17.5" cy="14.5" r="1.5"/><path d="M5.41 10l.96-2.88A1 1 0 017.32 6.5h9.36a1 1 0 01.95.62L18.59 10H5.41z"/><line x1="7" y1="4.5" x2="17" y2="4.5"/></svg>',
  model:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  year:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  km:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  chevL:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevR:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  kitchen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
  balcony:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18"/><path d="M5 13v8"/><path d="M19 13v8"/><path d="M12 13v8"/><path d="M3 21h18"/><path d="M6 3v4"/><path d="M18 3v4"/><rect x="4" y="7" width="16" height="6" rx="2"/></svg>',
  living:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3"/><path d="M2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-4 0v2H6v-2a2 2 0 00-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>',
  storage:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
	  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
	  color:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
	  type:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.48.48 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"/><circle cx="12" cy="12" r="3"/></svg>',
	  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
	  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
	};
