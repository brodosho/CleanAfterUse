/* ---------- ELO ----------
   Three parts, each earned separately:
     strength    (0-1000) how your best lifts sit against published bodyweight standards
     consistency (0-100)  whether you actually turn up, against your own plan
     programme   (0-100)  how your routine compares with the ones advanced lifters run
   Ratios below are 1RM ÷ bodyweight at Beginner / Novice / Intermediate / Advanced / Elite,
   compiled from the ExRx performance tables, StrengthLevel's dataset and Symmetric Strength.
   They describe trained adults roughly 18-39; outside that they drift, and the app says so. */
const STANDARDS={
  squat:   {m:[0.75,1.25,1.50,2.00,2.50], f:[0.50,0.75,1.25,1.50,2.00], w:1.00, label:'Squat'},
  deadlift:{m:[1.00,1.50,2.00,2.50,3.00], f:[0.50,1.00,1.50,2.00,2.50], w:1.00, label:'Deadlift'},
  bench:   {m:[0.50,0.75,1.25,1.50,2.00], f:[0.25,0.50,0.75,1.00,1.25], w:0.90, label:'Bench press'},
  ohp:     {m:[0.35,0.55,0.80,1.10,1.40], f:[0.20,0.35,0.50,0.75,0.90], w:0.80, label:'Overhead press'},
  row:     {m:[0.50,0.75,1.00,1.25,1.50], f:[0.30,0.45,0.65,0.85,1.00], w:0.80, label:'Row'},
  pulldown:{m:[0.60,0.80,1.00,1.25,1.50], f:[0.35,0.50,0.70,0.90,1.10], w:0.70, label:'Pulldown or chin-up'},
  hinge:   {m:[0.75,1.10,1.50,1.90,2.30], f:[0.40,0.70,1.05,1.35,1.70], w:0.75, label:'Hip hinge'},
  legpress:{m:[1.20,1.80,2.50,3.20,4.00], f:[0.90,1.40,2.00,2.60,3.20], w:0.55, label:'Leg press'}
};
const TIERS=['Untrained','Beginner','Novice','Intermediate','Advanced','Elite'];
const RANKS=[
  {name:'Bronze',      min:0,    blurb:'Getting the movements down and turning up.'},
  {name:'Silver',      min:600,  blurb:'A base is forming. The lifts are moving.'},
  {name:'Gold',        min:1100, blurb:'A real training habit and honest numbers.'},
  {name:'Platinum',    min:1550, blurb:'Stronger than most people who lift at all.'},
  {name:'Diamond',     min:1950, blurb:'Well past intermediate on the main lifts.'},
  {name:'Master',      min:2300, blurb:'Advanced numbers held with a serious programme.'},
  {name:'Grandmaster', min:2650, blurb:'Elite territory. Very few people get here.'}
];
const rankFor=elo=>[...RANKS].reverse().find(r=>elo>=r.min)||RANKS[0];
function nextRank(elo){ return RANKS.find(r=>r.min>elo)||null; }

/* which standard an exercise should be judged against */
function liftKind(e){
  const n=(e.name||'').toLowerCase();
  if(/leg press|hack squat/.test(n)) return 'legpress';
  if(/squat/.test(n)) return 'squat';
  if(/deadlift/.test(n)&&!/romanian|single/.test(n)) return 'deadlift';
  if(/romanian|hip thrust|good morning|back extension/.test(n)) return 'hinge';
  if(/bench|chest press|push-?up|dip/.test(n)) return 'bench';
  if(/overhead press|shoulder press|military/.test(n)) return 'ohp';
  if(/row/.test(n)) return 'row';
  if(/pulldown|chin-?up|pull-?up/.test(n)) return 'pulldown';
  return null;
}
/* 0-1000 by interpolating between the published tiers; 200 points per tier */
function standardPoints(ratio,band){
  if(ratio<=0) return 0;
  if(ratio<band[0]) return Math.max(0,Math.round(200*ratio/band[0]));
  for(let i=0;i<band.length-1;i++){
    if(ratio<band[i+1])
      return Math.round(200*(i+1)+200*(ratio-band[i])/(band[i+1]-band[i]));
  }
  /* past Elite it keeps climbing but with diminishing return */
  return Math.min(1000,Math.round(1000+120*Math.log2(ratio/band[band.length-1])));
}
function tierName(ratio,band){
  let i=0; while(i<band.length&&ratio>=band[i]) i++;
  return TIERS[Math.min(i,TIERS.length-1)];
}

function strengthScore(){
  const kg=bodyKg(), sex=D.settings.standards;
  if(!kg||!sex||sex==='none') return null;
  const s=sex==='f'?'f':'m';
  const best={};
  (R()?.exercises||[]).forEach(e=>{
    const k=liftKind(e); if(!k||!e.tracks_weight) return;
    const hs=history(e.id);
    let top=e.current_weight?{w:e.current_weight,r:targetReps(e)||5}:null;
    hs.forEach(h=>{ if(!top||(e1rm(h.w,h.r)||0)>(e1rm(top.w,top.r)||0)) top=h; });
    if(!top||!top.w) return;
    const one=e1rm(top.w,top.r||5);
    if(!best[k]||one>best[k].one) best[k]={one,name:e.name,w:top.w,r:top.r};
  });
  const rows=Object.keys(best).map(k=>{
    const band=STANDARDS[k][s], ratio=best[k].one/kg;
    return {kind:k,label:STANDARDS[k].label,weight:STANDARDS[k].w,name:best[k].name,
      one:best[k].one,ratio:round(ratio),pts:standardPoints(ratio,band),
      tier:tierName(ratio,band),band};
  });
  if(!rows.length) return null;
  const wsum=rows.reduce((a,r)=>a+r.weight,0);
  const raw=rows.reduce((a,r)=>a+r.pts*r.weight,0)/wsum;
  /* you cannot be graded on curls alone: three big lifts is full credit */
  const bigCovered=rows.filter(r=>['squat','deadlift','bench','ohp'].includes(r.kind)).length;
  const coverage=Math.min(1,0.55+0.15*bigCovered);
  return {rows,score:Math.round(raw*coverage),coverage,bigCovered};
}
function consistencyScore(){
  const r=R(); if(!r) return {score:0,per:0,planned:0};
  const since=Date.now()-28*864e5;
  const done=L.sessions.filter(s=>new Date(s.performed_on+'T00:00:00').getTime()>=since).length;
  const planned=Math.max(1,(r.schedule||[]).filter(d=>d.code).length*(r.cycle===2?2:4));
  const ratio=Math.min(1.1,done/planned);
  return {score:Math.round(Math.min(100,ratio*100)),per:round(done/4),planned:round(planned/4),done};
}
/* how the routine compares with what advanced lifters actually run */
function programmeScore(){
  const r=R(); if(!r||!r.exercises.length) return {score:0,notes:['No routine yet']};
  const notes=[]; let s=0;
  const pats=new Set(r.exercises.map(e=>e.pattern||
    (SEED.library.find(x=>x.name===e.name)||{}).pattern).filter(Boolean));
  const need=[['squat','squat'],['hinge','hinge'],['hpush','horizontal push'],
    ['vpush','overhead press'],['hpull','row'],['vpull','pulldown or chin-up']];
  const have=need.filter(([p])=>pats.has(p));
  s+=Math.round(40*have.length/need.length);
  const missing=need.filter(([p])=>!pats.has(p)).map(x=>x[1]);
  if(missing.length) notes.push('no '+missing.join(', no '));
  const days=(r.schedule||[]).filter(d=>d.code).length/(r.cycle===2?2:1);
  s+=days>=4?25:days>=3?18:days>=2?10:4;
  if(days<3) notes.push('training '+round(days)+' days a week');
  const items=r.exercises.map(e=>({sets:e.sets,lib:SEED.library.find(x=>x.name===e.name)||{muscles:['core']}}));
  const vol={}; items.forEach(i=>(i.lib.muscles||[]).forEach((m,ix)=>vol[m]=(vol[m]||0)+i.sets*(ix?0.5:1)));
  const inRange=['chest','back','quads','hamstrings','shoulders'].filter(m=>(vol[m]||0)>=8).length;
  s+=Math.round(20*inRange/5);
  if(inRange<4) notes.push('weekly sets light on '+
    ['chest','back','quads','hamstrings','shoulders'].filter(m=>(vol[m]||0)<8).join(', '));
  const prog=r.exercises.some(e=>e.prog==='stage')||(r.rules||[]).length>=3;
  s+=prog?15:5;
  return {score:Math.min(100,s),notes,days:round(days),patterns:have.length};
}
function eloFor(){
  const st=strengthScore(), co=consistencyScore(), pr=programmeScore();
  const strengthPts=st?st.score:0;
  const c=co.score/100, p=pr.score/100;
  /* the bar is most of the score. Turning up and training sensibly multiply what the bar gives
     you, and earn a small amount on their own so a first-timer is not sitting on zero. */
  const mult=0.62+0.23*c+0.15*p;
  const lifted=Math.round(strengthPts*2.2*mult);
  const habit=Math.round(c*150), plan=Math.round(p*100);
  const elo=Math.min(3000,lifted+habit+plan);
  return {elo,rank:rankFor(elo),next:nextRank(elo),strength:st,consistency:co,programme:pr,
    parts:[{k:'What you lift',v:lifted,max:2200},
           {k:'Turning up',v:habit,max:150},
           {k:'How you train',v:plan,max:100}],
    mult:round(mult)};
}
/* concrete, ordered by what would move the number most */
function eloTips(E){
  const tips=[];
  if(!E.strength){
    tips.push('Record your bodyweight and pick which standards to compare against — without those '+
      'I can only score how you train, not how you lift.');
  } else {
    const kg=bodyKg(), s=D.settings.standards==='f'?'f':'m';
    const weakest=[...E.strength.rows].sort((a,b)=>a.pts-b.pts)[0];
    if(weakest){
      const band=STANDARDS[weakest.kind][s];
      const nextT=band.find(x=>x>weakest.ratio);
      if(nextT) tips.push(`${weakest.label} is your weakest lift against the standards `+
        `(${weakest.ratio}× bodyweight, ${weakest.tier}). Getting it to ${round(nextT*kg)} ${U()} `+
        `for a single would move you up a tier.`);
    }
    if(E.strength.bigCovered<4){
      const got=E.strength.rows.map(r=>r.kind);
      const miss=['squat','deadlift','bench','ohp'].filter(k=>!got.includes(k))
        .map(k=>STANDARDS[k].label.toLowerCase());
      tips.push(`You are only scored on ${E.strength.bigCovered} of the four main lifts. Adding `+
        `${miss.join(' and ')} would lift your score even at the same strength.`);
    }
  }
  if(E.consistency.score<80)
    tips.push(`You are averaging ${E.consistency.per} sessions a week against a plan of `+
      `${E.consistency.planned}. Turning up is worth up to 600 points on its own.`);
  E.programme.notes.forEach(n=>tips.push('Your routine has '+n+'.'));
  if(E.programme.score>=85&&E.consistency.score>=80&&E.strength&&E.strength.score>=400)
    tips.push('Programme and consistency are both strong — from here the score moves when the bar does.');
  return tips.slice(0,5);
}
/* is it time to move up a program? */
function levelUpAdvice(){
  const r=R(); if(!r) return null;
  const E=eloFor();
  const weeks=L.sessions.length?Math.max(1,Math.round(
    (Date.now()-new Date(L.sessions[L.sessions.length-1].performed_on+'T00:00:00').getTime())/(7*864e5))):0;
  const stalls=r.exercises.filter(e=>(e.sessions_at_weight||0)>=3).length;
  const beginnerish=/beginner|first time|machine|dumbbell/i.test(r.name+' '+(r.blurb||''))
    || (r.workouts.length<=2 && r.exercises.length<=8);
  if(!beginnerish) return null;
  if(weeks<6||L.sessions.length<14) return null;
  if(E.strength&&E.strength.score<380&&stalls===0) return null;
  const suggest=SEED.templates.find(t=>t.level==='experienced')||SEED.templates[3];
  return {weeks,sessions:L.sessions.length,stalls,suggest,
    why:stalls?`${stalls} lift${stalls===1?' has':'s have'} stopped moving for three sessions or more`
      :`${weeks} weeks and ${L.sessions.length} sessions in, and your lifts are still climbing`};
}
