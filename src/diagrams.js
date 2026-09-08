/* ---------- start / finish figures, drawn rather than photographed ---------- */
function _fig(p){
  const S='stroke="currentColor" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"';
  let o='';
  if(p.floor) o+=`<line x1="6" y1="95" x2="94" y2="95" stroke="currentColor" stroke-width="2" opacity=".35"/>`;
  if(p.bench) o+=`<rect x="${p.bench[0]}" y="${p.bench[1]}" width="${p.bench[2]}" height="${p.bench[3]}"
     fill="currentColor" opacity=".18"/>`;
  if(p.mach) o+=`<rect x="${p.mach[0]}" y="${p.mach[1]}" width="${p.mach[2]}" height="${p.mach[3]}"
     fill="currentColor" opacity=".14"/>`;
  (p.lines||[]).forEach(l=>o+=`<polyline points="${l.map(q=>q.join(',')).join(' ')}" ${S}/>`);
  if(p.bar){ const [x1,y1,x2,y2]=p.bar;
    o+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${S}/>`;
    o+=`<circle cx="${x1}" cy="${y1}" r="5" fill="currentColor" opacity=".55"/>`;
    o+=`<circle cx="${x2}" cy="${y2}" r="5" fill="currentColor" opacity=".55"/>`; }
  if(p.head) o+=`<circle cx="${p.head[0]}" cy="${p.head[1]}" r="7" ${S}/>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img">${o}</svg>`;
}
const POSES={
  squat:[
    {head:[50,20],floor:1,bar:[33,31,67,31],lines:[[[50,27],[50,56]],[[50,34],[36,31]],[[50,34],[64,31]],
      [[50,56],[44,74]],[[44,74],[44,94]],[[50,56],[57,74]],[[57,74],[57,94]]]},
    {head:[50,34],floor:1,bar:[33,45,67,45],lines:[[[50,41],[53,63]],[[50,47],[36,45]],[[50,47],[64,45]],
      [[53,63],[39,70]],[[39,70],[44,94]],[[53,63],[64,70]],[[64,70],[57,94]]]}],
  hinge:[
    {head:[50,20],floor:1,bar:[33,52,67,52],lines:[[[50,27],[50,58]],[[50,32],[42,52]],[[50,32],[58,52]],
      [[50,58],[46,76]],[[46,76],[46,94]],[[50,58],[55,76]],[[55,76],[55,94]]]},
    {head:[38,38],floor:1,bar:[27,78,61,78],lines:[[[43,42],[58,60]],[[42,46],[38,78]],[[46,44],[46,78]],
      [[58,60],[52,76]],[[52,76],[52,94]],[[58,60],[62,76]],[[62,76],[62,94]]]}],
  hpush:[
    {head:[26,52],bench:[20,60,62,7],bar:[46,30,46,74],lines:[[[33,57],[70,57]],[[40,57],[46,36]],
      [[40,57],[46,68]],[[70,57],[80,74]],[[80,74],[74,92]]]},
    {head:[26,52],bench:[20,60,62,7],bar:[46,16,46,60],lines:[[[33,57],[70,57]],[[40,57],[46,24]],
      [[40,57],[46,52]],[[70,57],[80,74]],[[80,74],[74,92]]]}],
  vpush:[
    {head:[50,22],floor:1,bar:[30,36,70,36],lines:[[[50,29],[50,60]],[[50,38],[36,36]],[[50,38],[64,36]],
      [[50,60],[44,76]],[[44,76],[44,94]],[[50,60],[57,76]],[[57,76],[57,94]]]},
    {head:[50,26],floor:1,bar:[30,10,70,10],lines:[[[50,33],[50,62]],[[50,38],[36,12]],[[50,38],[64,12]],
      [[50,62],[44,78]],[[44,78],[44,94]],[[50,62],[57,78]],[[57,78],[57,94]]]}],
  hpull:[
    {head:[36,30],floor:1,bar:[28,72,62,72],lines:[[[41,34],[58,52]],[[44,38],[45,72]],[[58,52],[52,74]],
      [[52,74],[52,94]],[[58,52],[64,74]],[[64,74],[64,94]]]},
    {head:[36,30],floor:1,bar:[28,48,62,48],lines:[[[41,34],[58,52]],[[44,38],[38,48]],[[58,52],[52,74]],
      [[52,74],[52,94]],[[58,52],[64,74]],[[64,74],[64,94]]]}],
  vpull:[
    {head:[50,34],mach:[14,6,72,5],bar:[30,14,70,14],lines:[[[50,41],[50,66]],[[50,44],[34,16]],
      [[50,44],[66,16]],[[50,66],[44,82]],[[50,66],[57,82]]]},
    {head:[50,26],mach:[14,6,72,5],bar:[30,20,70,20],lines:[[[50,33],[50,62]],[[50,38],[33,24]],
      [[50,38],[67,24]],[[50,62],[44,78]],[[50,62],[57,78]]]}],
  arms:[
    {head:[50,20],floor:1,lines:[[[50,27],[50,60]],[[50,36],[40,58]],[[50,36],[60,58]],
      [[50,60],[44,76]],[[44,76],[44,94]],[[50,60],[57,76]],[[57,76],[57,94]]],
      bar:[36,60,36,60]},
    {head:[50,20],floor:1,lines:[[[50,27],[50,60]],[[50,36],[40,52]],[[40,52],[46,38]],[[50,36],[60,52]],
      [[60,52],[54,38]],[[50,60],[44,76]],[[44,76],[44,94]],[[50,60],[57,76]],[[57,76],[57,94]]],
      bar:[46,36,54,36]}],
  calves:[
    {head:[50,22],floor:1,mach:[30,84,40,8],lines:[[[50,29],[50,58]],[[50,34],[42,56]],[[50,34],[58,56]],
      [[50,58],[46,78]],[[46,78],[46,84]],[[46,84],[38,92]],[[50,58],[55,78]],[[55,78],[55,84]],
      [[55,84],[63,92]]]},
    {head:[50,10],floor:1,mach:[30,84,40,8],lines:[[[50,17],[50,46]],[[50,22],[42,44]],[[50,22],[58,44]],
      [[50,46],[46,68]],[[46,68],[46,84]],[[50,46],[55,68]],[[55,68],[55,84]]]}],
  core:[
    {head:[22,60],floor:1,lines:[[[29,62],[78,72]],[[34,62],[32,92]],[[78,72],[74,92]]]},
    {head:[22,70],floor:1,lines:[[[29,72],[52,82]],[[52,82],[78,70]],[[34,72],[32,92]],[[78,70],[74,92]]]}],
  legpress:[
    {mach:[66,26,10,58],floor:1,head:[68,26],lines:[[[64,32],[52,62]],[[62,38],[46,50]],
      [[52,62],[34,54]],[[34,54],[30,72]],[[52,66],[36,60]],[[36,60],[32,76]]],
      bench:[24,44,10,34]},
    {mach:[66,26,10,58],floor:1,head:[68,26],lines:[[[64,32],[52,62]],[[62,38],[48,52]],
      [[52,62],[30,60]],[[30,60],[18,56]],[[52,66],[30,66]],[[30,66],[18,62]]],
      bench:[10,40,9,34]}],
  seatedknee:[
    {mach:[58,30,10,46],floor:1,head:[60,30],lines:[[[57,36],[50,58]],[[55,42],[44,52]],
      [[50,58],[36,58]],[[36,58],[36,80]],[[50,62],[38,62]],[[38,62],[38,82]]],
      bar:[34,80,34,84]},
    {mach:[58,30,10,46],floor:1,head:[60,30],lines:[[[57,36],[50,58]],[[55,42],[44,52]],
      [[50,58],[36,58]],[[36,58],[18,54]],[[50,62],[38,62]],[[38,62],[20,58]]],
      bar:[18,52,18,58]}],
  lunge:[
    {head:[50,20],floor:1,lines:[[[50,27],[50,58]],[[50,34],[42,56]],[[50,34],[58,56]],
      [[50,58],[46,76]],[[46,76],[46,94]],[[50,58],[55,76]],[[55,76],[55,94]]]},
    {head:[46,26],floor:1,lines:[[[46,33],[46,62]],[[46,38],[38,60]],[[46,38],[54,60]],
      [[46,62],[30,72]],[[30,72],[30,94]],[[46,62],[64,78]],[[64,78],[56,94]]]}]
};
const POSE_CAPS={core:['Hold this line','Hips sagging — reset'],calves:['Heels down','Up on the toes'],
  legpress:['Knees bent','Pushed out — knees soft'],seatedknee:['Start','Extended'],
  vpull:['Hanging, arms straight','Chin past the bar'],hinge:['Standing tall','Hips back, back flat']};
const PATTERN_POSE={squat:'squat',hinge:'hinge',hpush:'hpush',vpush:'vpush',hpull:'hpull',
  vpull:'vpull',arms:'arms',calves:'calves',core:'core'};
const NAME_POSE={'Bulgarian Split Squat':'lunge','Walking Lunge':'lunge','Lateral Raise':'vpush',
  'Face Pull':'hpull','Rear Delt Fly':'hpull','Shrug':'calves','Plank':'core','Dead Bug':'core',
  'Hanging Leg Raise':'core','Cable Crunch':'core','Pallof Press':'core','Ab Machine':'core',
  "Farmer's Carry":'calves','Glute Bridge':'core','Push-ups':'hpush','Cable Fly':'hpush',
  'Dumbbell Fly':'hpush','Leg Extension':'seatedknee','Leg Curl':'seatedknee',
  'Back Extension':'hinge','Leg Press':'legpress','Hack Squat Machine':'legpress',
  'Hip Thrust Machine':'hinge','Glute Machine':'hinge','Chest Press Machine':'hpush',
  'Seated Row Machine':'hpull','Shoulder Press Machine':'vpush','Goblet Squat':'squat'};
function poseFor(name,pattern){
  return NAME_POSE[name] || PATTERN_POSE[pattern] ||
    (SEED.library.find(x=>x.name===name)||{}).pattern && PATTERN_POSE[(SEED.library.find(x=>x.name===name)||{}).pattern] || null;
}
function diagram(name,pattern,startLabel,endLabel){
  const key=poseFor(name,pattern||((SEED.library.find(x=>x.name===name)||{}).pattern));
  if(!key||!POSES[key]) return '';
  const [a,b]=POSES[key];
  const caps=POSE_CAPS[key]||['Start','Finish'];
  return `<div class="figs">
    <figure><div class="fig">${_fig(a)}</div><figcaption>${startLabel||caps[0]}</figcaption></figure>
    <figure><div class="fig">${_fig(b)}</div><figcaption>${endLabel||caps[1]}</figcaption></figure>
  </div>`;
}
