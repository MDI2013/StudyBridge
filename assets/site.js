(()=>{"use strict";
function setupNav(){
 const header=document.querySelector("header");if(!header)return;
 let nav=header.querySelector("nav");if(!nav){nav=document.createElement("nav");header.appendChild(nav);}
 nav.className="sb-site-nav";nav.setAttribute("aria-label","Main navigation");nav.id="studybridge-site-nav";
 const page=location.pathname.split("/").pop()||"index.html";
 const view=new URLSearchParams(location.search).get("view");
 const items=[
  ["Home","index.html","home",page==="index.html"&&!view],
  ["Universities","index.html?view=unis","unis",page==="index.html"&&view==="unis"],
  ["Country guide","index.html?view=pays","pays",page==="index.html"&&view==="pays"],
  ["My shortlist","index.html?view=fav","fav",page==="index.html"&&view==="fav"],
  ["My checklist","index.html?view=plan","plan",page==="index.html"&&view==="plan"],
  ["Scholarships","scholarships.html","scholarships",page==="scholarships.html"],
  ["Programmes","programmes.html","programmes",page==="programmes.html"],
  ["My profile","profile.html","profile",page==="profile.html"],
  ["Application tracker","tracker.html","tracker",page==="tracker.html"]
 ];
 nav.innerHTML=items.map(([label,href,key,active])=>'<a href="'+href+'"'+(active?' aria-current="page"':'')+'>'+label+'</a>').join("");
 nav.classList.add("sb-site-nav");
 let toggle=header.querySelector(".sb-menu-toggle");
 if(!toggle){toggle=document.createElement("button");toggle.type="button";toggle.className="sb-menu-toggle";toggle.setAttribute("aria-controls",nav.id);toggle.setAttribute("aria-expanded","false");toggle.innerHTML='<span aria-hidden="true">☰</span><span>Menu</span>';nav.parentNode.insertBefore(toggle,nav);}
 toggle.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open));});
 nav.addEventListener("click",()=>{nav.classList.remove("is-open");toggle.setAttribute("aria-expanded","false");});
}
function setupBackTop(){
 if(document.querySelector(".sb-back-top"))return;
 const b=document.createElement("button");b.type="button";b.className="sb-back-top";b.setAttribute("aria-label","Back to top");b.title="Back to top";b.textContent="↑";document.body.appendChild(b);
 const update=()=>b.classList.toggle("is-visible",window.scrollY>420);
 window.addEventListener("scroll",update,{passive:true});update();
 b.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
}
function setupHomeAccordions(){
 if(!location.pathname.endsWith("index.html")&&!(/\/$/.test(location.pathname)))return;
 const home=document.querySelector("#v-home");if(!home||home.dataset.mobileSectionsReady)return;
 const steps=home.querySelector(".steps"),stats=home.querySelector(".stats"),pop=home.querySelector("#pop"),popTitle=pop&&pop.previousElementSibling;
 function wrap(node,title){
  if(!node||node.parentElement.tagName==="DETAILS")return;
  const d=document.createElement("details");d.className="sb-home-accordion";
  const s=document.createElement("summary");s.textContent=title;d.appendChild(s);node.parentNode.insertBefore(d,node);d.appendChild(node);
 }
 wrap(steps,"How StudyBridge works");
 if(stats)wrap(stats,"StudyBridge at a glance");
 if(pop&&popTitle&&popTitle.matches("h2")){const d=document.createElement("details");d.className="sb-home-accordion";d.appendChild(popTitle);const s=document.createElement("summary");s.textContent="Popular study destinations";d.insertBefore(s,popTitle);pop.parentNode.insertBefore(d,pop);d.appendChild(pop);}
 const accordions=[...home.querySelectorAll(".sb-home-accordion")];
 const sync=()=>accordions.forEach(d=>{if(window.innerWidth>720)d.open=true;else d.open=false;});
 sync();window.addEventListener("resize",sync,{passive:true});
 home.dataset.mobileSectionsReady="true";
}
document.addEventListener("DOMContentLoaded",()=>{setupNav();setupBackTop();setupHomeAccordions();});
})();