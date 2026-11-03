const projects=[
{name:'深圳市人民医院口腔医疗中心',type:'医院口腔科',cover:44,pages:[42,43,44,45,46]},
{name:'盐田区妇幼保健院口腔科',type:'医院口腔科',cover:48,pages:[48,49]},
{name:'REEVE 齿科',type:'口腔诊所',cover:4,pages:[3,4,5,6,7,8]},
{name:'恒致口腔',type:'口腔诊所',cover:10,pages:[10,11,12,13,14,15]},
{name:'冠诚口腔',type:'口腔诊所',cover:18,pages:[17,18,19,20,21,22]},
{name:'乐菲荧口腔',type:'口腔诊所',cover:25,pages:[24,25,26,27]},
{name:'乐兔口腔',type:'口腔诊所',cover:29,pages:[29,30,31,32,33]},
{name:'时代牙科',type:'口腔诊所',cover:37,pages:[35,36,37]},
{name:'青苗儿牙',type:'儿童齿科',cover:39,pages:[39,40]}];
const src=n=>`assets/page-${String(n).padStart(2,'0')}.jpg`;
const grid=document.querySelector('#projects'),detail=document.querySelector('#detail');
const detailTop=document.querySelector('#detail-top');
let current=0,lastFocus;
function render(){grid.innerHTML=projects.map((p,i)=>`<button class="project" data-project="${i}" aria-label="查看${p.name}"><div class="project-visual"><img src="assets/cover-${p.cover}.jpg" loading="lazy" alt="${p.name}空间设计"></div><div class="project-info"><div><h3>${p.name}</h3></div><span class="project-num">${String(i+1).padStart(2,'0')} / 09</span></div></button>`).join('')}
function openProject(i){
 if(closingDetail)return;
 current=i;const p=projects[i];
 document.querySelector('#project-number').textContent=String(i+1).padStart(2,'0');
 document.querySelector('#detail-type').textContent=p.type;
 document.querySelector('#detail-title').textContent=p.name;
 document.querySelector('#detail-count').textContent=p.pages.length+' 张';
 document.querySelector('#gallery').innerHTML=p.pages.map((n,j)=>`<figure><img src="${src(n)}" alt="${p.name}项目图 ${j+1}" ${j?'loading="lazy"':''}></figure>`).join('');
 document.querySelector('#next-project-name').textContent=projects[(i+1)%projects.length].name;
 if(!detail.open){lastFocus=document.activeElement;detail.showModal();document.body.style.overflow='hidden'}
 detail.scrollTop=0;detailTop.hidden=true;
 history.replaceState(null,'',`#project-${i+1}`);
 revealItems('#gallery figure',detail);
 if(!reducedMotion.matches){document.querySelector('.detail-intro').animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.3,1)'});}
 detail.style.setProperty('--reading-progress','0');
}
document.addEventListener('click',e=>{const card=e.target.closest('[data-project]');if(card)openProject(+card.dataset.project)});
let closingDetail=false;
async function closeDetail(){
 if(closingDetail||!detail.open)return;
 closingDetail=true;
 if(!reducedMotion.matches)await detail.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(12px)'}],{duration:180,easing:'ease-in'}).finished.catch(()=>{});
 detail.close();closingDetail=false;
}
document.querySelector('.close').onclick=closeDetail;
detail.addEventListener('cancel',e=>{e.preventDefault();closeDetail()});
detail.addEventListener('close',()=>{document.body.style.overflow='';history.replaceState(null,'','#work');lastFocus?.focus()});
document.querySelector('#next-project').onclick=()=>{openProject((current+1)%projects.length);document.querySelector('.close').focus({preventScroll:true})};
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
detailTop.onclick=()=>detail.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
detail.addEventListener('scroll',()=>{detailTop.hidden=detail.scrollTop<400;const range=detail.scrollHeight-detail.clientHeight;detail.style.setProperty('--reading-progress',range>0?detail.scrollTop/range:0)},{passive:true});
let pageReveal,detailReveal;
function revealItems(selector,root=null){
 const items=[...document.querySelectorAll(selector)];
 if(reducedMotion.matches||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-revealed'));return}
 if(root)detailReveal?.disconnect();else pageReveal?.disconnect();
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}})},{root,threshold:.08,rootMargin:'0px 0px 40px 0px'});
 items.forEach((el,i)=>{el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',root?'0ms':`${i%2*65}ms`);observer.observe(el)});
 if(root)detailReveal=observer;else pageReveal=observer;
}
render();revealItems('.project');const match=location.hash.match(/^#project-([1-9])$/);if(match)openProject(+match[1]-1);
const heroVideo=document.querySelector('#hero-video');
let heroVisible=false;
function syncHero(){if(!reducedMotion.matches&&!document.hidden&&heroVisible&&!detail.open)heroVideo.play().catch(()=>{});else heroVideo.pause()}
reducedMotion.addEventListener('change',syncHero);
document.addEventListener('visibilitychange',syncHero);
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncHero()},{threshold:.05}).observe(heroVideo);
new MutationObserver(syncHero).observe(detail,{attributes:true,attributeFilter:['open']});

// Fine-pointer depth remains subtle; touch and reduced-motion use a static frame.
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project').forEach(card=>{
 let frame;
 function reset(){cancelAnimationFrame(frame);card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--pan-x','0px');card.style.setProperty('--pan-y','0px')}
 card.addEventListener('pointermove',event=>{
  if(!finePointer.matches||reducedMotion.matches)return;
  const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{card.style.setProperty('--tilt-x',`${-y*1.5}deg`);card.style.setProperty('--tilt-y',`${x*1.5}deg`);card.style.setProperty('--pan-x',`${x*4}px`);card.style.setProperty('--pan-y',`${y*4}px`)});
 });
 card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);
 reducedMotion.addEventListener('change',reset);
});
