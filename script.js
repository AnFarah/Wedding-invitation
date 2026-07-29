
const intro=document.getElementById("intro");
const book=document.getElementById("book");
const main=document.getElementById("main");
let opened=false;
function openInvite(){
 if(opened)return; opened=true;
 book.classList.add("open");
 main.classList.add("visible");
 main.setAttribute("aria-hidden","false");
 document.body.classList.remove("locked");
 setTimeout(()=>intro.classList.add("hidden"),620);
}
book.addEventListener("click",openInvite);
book.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openInvite();}});
intro.addEventListener("click",openInvite);

const target=new Date("2026-08-28T19:00:00+04:00").getTime();
function tick(){
 let d=Math.max(0,target-Date.now());
 const days=Math.floor(d/86400000); d%=86400000;
 const hours=Math.floor(d/3600000); d%=3600000;
 const minutes=Math.floor(d/60000); const seconds=Math.floor((d%60000)/1000);
 document.getElementById("days").textContent=String(days).padStart(2,"0");
 document.getElementById("hours").textContent=String(hours).padStart(2,"0");
 document.getElementById("minutes").textContent=String(minutes).padStart(2,"0");
 document.getElementById("seconds").textContent=String(seconds).padStart(2,"0");
}
tick(); setInterval(tick,1000);

document.getElementById("calendarBtn").addEventListener("click",()=>{
 const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anas Maryem Wedding//AR
BEGIN:VEVENT
UID:anas-maryem-wedding-20260828
DTSTART:20260828T150000Z
DTEND:20260828T190000Z
SUMMARY:حفل زفاف أنس ومريم
LOCATION:Oud Metha Ballroom, Mövenpick Bur Dubai, Dubai, UAE
END:VEVENT
END:VCALENDAR`;
 const url=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"}));
 const a=document.createElement("a"); a.href=url; a.download="Anas-Maryem-Wedding.ics"; a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
});

const SCRIPT_URL="YOUR_GOOGLE_APPS_SCRIPT_URL";
document.getElementById("rsvpForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const msg=document.getElementById("formMessage");
 const btn=e.submitter; const data=Object.fromEntries(new FormData(e.target).entries());
 data.timestamp=new Date().toISOString();
 if(SCRIPT_URL.includes("YOUR_GOOGLE")){
   msg.textContent="التصميم جاهز. أضف رابط Google Apps Script داخل script.js لتفعيل الحفظ.";
   return;
 }
 btn.disabled=true; btn.textContent="جارٍ الإرسال...";
 try{
   await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
   msg.textContent="شكرًا لكم، تم استلام تأكيد حضوركم.";
   e.target.reset();
 }catch(err){
   msg.textContent="تعذر الإرسال الآن، يرجى المحاولة مرة أخرى.";
 }finally{
   btn.disabled=false; btn.textContent="إرسال التأكيد";
 }
});
