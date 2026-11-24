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
 if(!toggle){toggle=document.createElement("button");toggle.type="button";toggle.className="sb-menu-toggle";toggle.setAttribute("aria-controls",nav.id);nav.parentNode.insertBefore(toggle,nav);}
 const setMenu=(open)=>{
  nav.classList.toggle("is-open",open);
  toggle.setAttribute("aria-expanded",open?"true":"false");
  toggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");
  toggle.innerHTML='<span aria-hidden="true">'+(open?"×":"☰")+'</span>';
 };
 setMenu(false);
 toggle.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();setMenu(toggle.getAttribute("aria-expanded")!=="true");});
 nav.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false);});
 document.addEventListener("pointerdown",e=>{if(!header.contains(e.target))setMenu(false);},{passive:true});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
}
function setupBackTop(){
 if(document.querySelector(".sb-back-top"))return;
 const b=document.createElement("button");b.type="button";b.className="sb-back-top";b.setAttribute("aria-label","Back to top");b.title="Back to top";b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';document.body.appendChild(b);
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
function setupStudyGlobe(){
 const host=document.getElementById("sb-globe");if(!host||host.dataset.ready==="true")return;
 if(typeof window.Globe!=="function"){host.innerHTML='<div class="sb-globe-fallback">The interactive globe could not load. Please use the country list below.</div>';return;}
 host.dataset.ready="true";
 const coords={CA:[56,-106],US:[39,-98],MA:[31,-7],FR:[46,2],DE:[51,10],UK:[55,-3],ES:[40,-4],NL:[52,5],AU:[-25,133],JP:[36,138]};
 const names={CA:"Canada",US:"United States",MA:"Morocco",FR:"France",DE:"Germany",UK:"United Kingdom",ES:"Spain",NL:"Netherlands",AU:"Australia",JP:"Japan"};
 const points=Object.keys(coords).map(code=>({code,name:names[code],lat:coords[code][0],lng:coords[code][1],size:0.24}));
 const globe=window.Globe()(host).globeImageUrl("https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg")
  .backgroundColor("rgba(0,0,0,0)").showAtmosphere(true).atmosphereColor("#55c9ee").atmosphereAltitude(0.18)
  .pointsData(points).pointLat(d=>d.lat).pointLng(d=>d.lng).pointRadius(d=>d.size).pointColor(() => "#63e4f4").pointAltitude(0.012)
  .onPointClick(d=>{const chip=document.querySelector('#pl [data-country="'+d.code+'"]');if(chip)chip.click();});
 const resize=()=>{if(host.clientWidth&&host.clientHeight)globe.width(host.clientWidth).height(host.clientHeight);};
 if("ResizeObserver" in window)new ResizeObserver(resize).observe(host);else window.addEventListener("resize",resize,{passive:true});
 resize();globe.pointOfView({lat:24,lng:12,altitude:2.15},0);
 globe.controls().autoRotate=true;globe.controls().autoRotateSpeed=0.28;globe.controls().enableDamping=true;globe.controls().dampingFactor=0.08;
}
function watchStudyGlobe(){
 const view=document.getElementById("v-pays");if(!view)return;
 const tryInit=()=>{if(!view.hidden)setupStudyGlobe();};
 tryInit();new MutationObserver(tryInit).observe(view,{attributes:true,attributeFilter:["hidden","class"]});
}
document.addEventListener("DOMContentLoaded",()=>{setupNav();setupBackTop();setupHomeAccordions();watchStudyGlobe();});
})();