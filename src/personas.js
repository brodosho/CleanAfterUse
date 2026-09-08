const fs=require('fs');
/* ---- DOM stub so the app's own code runs unmodified ---- */
const els={};
const el=id=>els[id]||=({id,innerHTML:'',textContent:'',className:'',value:'',dataset:{},
  classList:{add(){},remove(){},toggle(){}},focus(){},select(){}});
globalThis.document={getElementById:el,querySelectorAll:()=>[],addEventListener(){},
  documentElement:{dataset:{}},body:{classList:{add(){},remove(){},toggle(){}}}};
globalThis.window={scrollTo(){}}; globalThis.scrollTo=()=>{};
globalThis.matchMedia=()=>({matches:false,addEventListener(){}});
globalThis.navigator={}; globalThis.Notification=undefined;
globalThis.setInterval=()=>0; globalThis.clearInterval=()=>{};
globalThis.setTimeout=()=>0; globalThis.clearTimeout=()=>{};

let src=fs.readFileSync('/tmp/a.js','utf8');
src=src.slice(0, src.indexOf("document.addEventListener('click'"));

const HARNESS=`
const WEEKD=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function rng(seed){ let s=seed; return ()=>{ s=(s*1103515245+12345)%2147483648; return s/2147483648; }; }

function fresh(){
  D={profile:{name:'p'},settings:{units:'kg',theme:'auto',accent:'iron',guided:true,barWeight:20,
     advanced:false,notify:true,activeId:null},routines:[],cardio:SEED.cardio,mobility:SEED.mobility,
     bodyweight:[],feedback:[],schedEdit:false};
  L={sessions:[]}; entries={}; checks={}; flow=null; wiz=null;
}

function simulate(p){
  fresh();
  const rand=rng(p.seed||7);
  const issues=[];
  let r;
  if(p.tpl!==undefined) r=newRoutineFrom(SEED.templates[p.tpl]);
  else {
    const g=generateRoutine(p.a,0);
    r=newRoutineFrom(g,'My routine');
    if(g._under.length) issues.push({tag:'volume',msg:'under target: '+g._under.join(', ')});
    if(g._tight.length) issues.push({tag:'time',msg:g._tight[0]});
  }
  if(p.bw) D.bodyweight=[{on:'2026-01-01',kg:p.bw}];
  if(p.advanced) D.settings.advanced=true;
  if(p.logMode) D.settings.logMode=p.logMode;
  if(p.effort) D.settings.effort=true;
  if(p.easyWeek) D.settings.easyUntil='2099-01-01';
  if(p.fortnight){
    const w1=r.schedule.map(d=>({...d,week:1}));
    r.schedule=w1.concat(WEEKD.map(d=>{ const src=w1.find(x=>x.day===d)||{};
      return {day:d,week:2,code:src.code?r.workouts[r.workouts.length>1?1:0].code:null,cardio:''}; }));
    r.cycle=2; r.cycleStart=r.created;
  }
  let couldPair=false;
  if(p.superset){
    for(const w of r.workouts){
      const acc=exOf(w.code,r).filter(e=>!e.is_core);
      if(acc.length>=2){ acc[acc.length-2].group='s1'; acc[acc.length-1].group='s1'; couldPair=true; break; }
    }
    if(!couldPair) issues.push({tag:'nopair',
      msg:'wanted supersets but the session is too short to contain two accessories'});
  }
  // the user sets their starting weights on the first visit
  r.exercises.forEach(e=>{ if(e.tracks_weight&&e.current_weight===null)
    e.current_weight = e.is_core? (p.startCore??20) : (p.startAcc??10); });
  const start={}; r.exercises.forEach(e=>start[e.id]=e.current_weight);

  let done=0, planned=0, sameInARow=0, lastCode=null;
  for(let day=0; day<14; day++){
    const dayName=WEEKD[day%7];
    const week=(Math.floor(day/7)%2)+1;
    const slot=(r.schedule||[]).find(d=>d.day===dayName && (r.cycle===1 || (d.week||1)===week));
    if(!slot||!slot.code) continue;
    planned++;
    if(rand()<(p.missRate||0)) continue;
    const s=suggestion();
    if(!s){ issues.push({tag:'bug',msg:'no session suggested on day '+day}); continue; }
    if(s.code===lastCode){ sameInARow++; if(sameInARow>=2&&r.workouts.length>1)
      issues.push({tag:'rotation',msg:'suggested '+s.code+' three sessions running'}); }
    else sameInARow=0;
    lastCode=s.code;

    flow=buildFlow(s.code); flow.started=Date.now()-(p.mins||45)*60000; flow.extras=[];
    exOf(s.code).forEach(e=>{
      // how many reps they actually get: light weights give lots, heavy give few
      const target=parseInt(String(e.rep_scheme))||10;
      let reps=Math.round(target + (p.strong?4:1) + rand()*4 - 2);
      if(p.plateau && done>4) reps=Math.max(1,target-2);
      entries[e.id]=Math.max(0,reps);
      for(let i=1;i<=e.sets;i++) if(rand()>(p.dropSet||0)) checks['s'+e.id+'_'+i]=true;
    });
    if(p.extras&&day===3) flow.extras=[{name:'Sauna',detail:'15 min'}];
    if(p.logMode==='each') exOf(s.code).forEach(e=>{ for(let i=1;i<=e.sets;i++)
      entries['ps'+e.id+'_'+i]=Math.max(1,Number(entries[e.id])-(i===e.sets?0:1)); });
    if(p.effort) exOf(s.code).forEach(e=>{ entries['eff'+e.id]=rand()<0.3?'hard':'right'; });
    const ch=commitSession(s.code,'');
    if(!ch) issues.push({tag:'bug',msg:'session on day '+day+' logged nothing'});
    flow=null; done++;
  }

  // ---- invariants ----
  r.exercises.forEach(e=>{
    if(e.current_weight!==null&&isNaN(e.current_weight)) issues.push({tag:'bug',msg:e.name+' weight became NaN'});
    const s0=start[e.id];
    if(s0&&e.current_weight/s0>4) issues.push({tag:'runaway',
      msg:e.name+' went '+s0+' → '+e.current_weight+' kg in two weeks'});
  });
  if(p.logMode) D.settings.logMode=p.logMode;
  if(p.fortnight){
    const wk2=new Set(r.schedule.filter(d=>(d.week||1)===2&&d.code).map(d=>d.code));
    const ran=new Set(L.sessions.map(x=>x.workout_code));
    if(![...wk2].some(c=>ran.has(c))) issues.push({tag:'fortnight',msg:'week two never ran'});
  }
  if(p.easyWeek){
    const moved=r.exercises.filter(e=>start[e.id]&&e.current_weight!==start[e.id]);
    if(moved.length) issues.push({tag:'easyweek',msg:moved.length+' weights moved during an easy week'});
  }
  if(p.superset&&couldPair){
    const grouped=r.workouts.some(w=>buildFlow(w.code).order.some(st=>st.length>1));
    if(!grouped) issues.push({tag:'superset',msg:'paired exercises were not grouped'});
  }
  if(p.units){
    const before=Object.fromEntries(r.exercises.map(e=>[e.id,e.current_weight]));
    convertUnits(p.units);
    r.exercises.forEach(e=>{ start[e.id]=start[e.id]==null?null:start[e.id]*(e.current_weight/before[e.id]||1); });
    const ws=L.sessions.flatMap(x=>(x.sets||[]).map(y=>y.weight)).filter(x=>x!=null);
    if(ws.length&&Math.min(...ws)<60&&Math.max(...ws)>150)
      issues.push({tag:'units',msg:'history reads as two different units'});
  }
  if(p.logMode==='each'){
    const got=L.sessions[0]&&L.sessions[0].sets[0]&&L.sessions[0].sets[0].repsPerSet;
    if(!got||!got.filter(x=>x!==null).length) issues.push({tag:'bug',msg:'per-set reps not recorded'});
  }
  const stalled=r.exercises.filter(e=>(e.sessions_at_weight||0)>=3);
  if(stalled.length) issues.push({tag:'stall',msg:stalled.length+' lift(s) stuck 3+ sessions (now flagged with a deload button)'});
  if(!L.sessions.length) issues.push({tag:'bug',msg:'no sessions logged at all'});
  if(L.sessions.length&&!L.sessions[0].kcal&&p.bw) issues.push({tag:'bug',msg:'no energy estimate despite bodyweight'});
  if(L.sessions.length&&L.sessions[0].minutes===null) issues.push({tag:'bug',msg:'no duration recorded'});
  const anySets=L.sessions[0]&&L.sessions[0].sets.some(x=>x.setsDone===undefined);
  if(anySets) issues.push({tag:'bug',msg:'sets completed not recorded'});
  return {r,done,planned,issues,
    growth:r.exercises.filter(e=>e.tracks_weight).map(e=>({n:e.name,from:start[e.id],to:e.current_weight}))};
}
`;

eval(src + HARNESS);

/* ---------------- 30 personas ---------------- */
const P=[
 {id:1,who:'Complete beginner, 34F, machines, 3 days, wants tone',a:{how:'build',level:'new',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['legs'],cardio:'warmup',time:45},bw:68,startCore:20,startAcc:10},
 {id:2,who:'Complete beginner, 19M, gym-naive, barbell, 3 days',a:{how:'build',level:'new',goal:'muscle',days:3,when:['Monday','Wednesday','Friday'],kit:'barbell',focus:['chest','arms'],cardio:'none',time:60},bw:72,strong:1},
 {id:3,who:'70M, first time lifting, machines, 2 days, 30 min',a:{how:'build',level:'new',goal:'health',days:2,when:['Tuesday','Saturday'],kit:'machines',focus:['none'],cardio:'warmup',time:30},bw:80,startCore:10,startAcc:5},
 {id:4,who:'56M returning after 20 years, barbell, strength',a:{how:'build',level:'returning',goal:'strength',days:3,when:['Monday','Wednesday','Saturday'],kit:'barbell',focus:['none'],cardio:'none',time:60},bw:95,startCore:40},
 {id:5,logMode:'each',effort:1,who:'26M, 3 years training, 6 days PPL, sceptical',a:{how:'build',level:'experienced',goal:'muscle',days:6,when:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],kit:'barbell',focus:['none'],cardio:'none',time:90},bw:84,strong:1,startCore:60},
 {id:6,who:'30F adapting it to her own split, any kit',a:{how:'build',level:'returning',goal:'muscle',days:4,when:['Monday','Tuesday','Thursday','Friday'],kit:'any',focus:['glutes','core'],cardio:'after',time:60},bw:63},
 {id:7,who:'Shift worker, irregular days, misses half',a:{how:'build',level:'returning',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'any',focus:['none'],cardio:'none',time:45},missRate:0.5,bw:88},
 {id:8,who:'Home trainer, dumbbells only, 2 days',a:{how:'build',level:'new',goal:'muscle',days:2,when:['Tuesday','Saturday'],kit:'dumbbell',focus:['arms'],cardio:'none',time:45},bw:75},
 {id:9,who:'Postpartum, 33F, careful, machines, 3 days',a:{how:'build',level:'returning',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['core'],cardio:'warmup',time:45},bw:70,startCore:15},
 {id:10,effort:1,advanced:1,who:'Powerlifter-curious, 24M, strength, 4 days',a:{how:'build',level:'experienced',goal:'strength',days:4,when:['Monday','Tuesday','Thursday','Friday'],kit:'barbell',focus:['legs'],cardio:'none',time:90},bw:90,startCore:80,strong:1},
 {id:11,logMode:'same',who:'Cutting weight, 29F, lean goal, 5 days',a:{how:'build',level:'returning',goal:'lean',days:5,when:['Monday','Tuesday','Wednesday','Thursday','Friday'],kit:'any',focus:['none'],cardio:'after',time:60},bw:66},
 {id:12,superset:1,who:'Busy parent, 41F, 30 min slots, 3 days',a:{how:'build',level:'new',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['none'],cardio:'none',time:30},bw:74},
 {id:13,who:'Uses r/Fitness beginner routine as-is',tpl:1,bw:78,startCore:30},
 {id:14,advanced:1,who:'Uses GZCLP template',tpl:3,bw:86,startCore:60,strong:1},
 {id:15,who:'Uses the machine starter template',tpl:0,bw:92,startCore:15},
 {id:16,who:'Uses Brodie Phase 1 template',tpl:2,bw:117},
 {id:17,who:'Plateaus fast, stops progressing after a week',a:{how:'build',level:'returning',goal:'strength',days:3,when:['Monday','Wednesday','Friday'],kit:'barbell',focus:['none'],cardio:'none',time:60},plateau:1,bw:82,startCore:60},
 {id:18,who:'Very strong beginner, blows through weights',a:{how:'build',level:'new',goal:'strength',days:3,when:['Monday','Wednesday','Friday'],kit:'barbell',focus:['none'],cardio:'none',time:60},strong:1,bw:100,startCore:20},
 {id:19,who:'Drops sets often, never finishes a session',a:{how:'build',level:'new',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['none'],cardio:'none',time:45},dropSet:0.5,bw:70},
 {id:20,who:'Adds extra cardio and classes constantly',a:{how:'build',level:'returning',goal:'lean',days:3,when:['Monday','Wednesday','Friday'],kit:'any',focus:['none'],cardio:'after',time:60},extras:1,bw:79},
 {id:21,fortnight:1,who:'Trains 6 days, wants a fortnightly split',a:{how:'build',level:'experienced',goal:'muscle',days:6,when:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],kit:'any',focus:['back'],cardio:'none',time:75},bw:88,fortnight:1},
 {id:22,who:'Older lifter 68M, joint issues, machines, 3 days',a:{how:'build',level:'returning',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['legs'],cardio:'warmup',time:45},bw:85,startCore:15},
 {id:23,easyWeek:1,who:'Teen athlete 17M, sport in season, 2 days',a:{how:'build',level:'returning',goal:'strength',days:2,when:['Tuesday','Friday'],kit:'barbell',focus:['legs'],cardio:'none',time:45},bw:70,startCore:40,strong:1},
 {id:24,units:'lb',who:'Works out in pounds, US-based',a:{how:'build',level:'returning',goal:'muscle',days:4,when:['Monday','Tuesday','Thursday','Friday'],kit:'barbell',focus:['chest'],cardio:'none',time:60},bw:80,units:'lb'},
 {id:25,superset:1,who:'Very short sessions, 4 days, 30 min each',a:{how:'build',level:'returning',goal:'muscle',days:4,when:['Monday','Tuesday','Thursday','Friday'],kit:'any',focus:['none'],cardio:'none',time:30},bw:77},
 {id:26,who:'Never logs bodyweight',a:{how:'build',level:'new',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'machines',focus:['none'],cardio:'none',time:45}},
 {id:27,who:'Trains twice a day sometimes, doubles up',a:{how:'build',level:'experienced',goal:'muscle',days:5,when:['Monday','Tuesday','Wednesday','Thursday','Friday'],kit:'any',focus:['arms'],cardio:'none',time:60},bw:83,double:1},
 {id:28,who:'Only free on weekends, wants 3 sessions',a:{how:'build',level:'new',goal:'muscle',days:3,when:['Friday','Saturday','Sunday'],kit:'machines',focus:['none'],cardio:'none',time:60},bw:81},
 {id:29,who:'Comes back after a 3-week break mid-trial',a:{how:'build',level:'returning',goal:'health',days:3,when:['Monday','Wednesday','Friday'],kit:'any',focus:['none'],cardio:'none',time:45},missRate:0.75,bw:90},
 {id:30,effort:1,advanced:1,logMode:'each',who:'Perfectionist, edits everything, logs precisely',a:{how:'build',level:'experienced',goal:'strength',days:4,when:['Monday','Tuesday','Thursday','Friday'],kit:'barbell',focus:['back'],cardio:'none',time:90},bw:87,startCore:70,strong:1},
];

const tally={};
console.log('id  sessions  persona');
P.forEach(p=>{
  p.seed=p.id*13+7;
  let out;
  try{ out=simulate(p); }
  catch(e){ console.log(String(p.id).padStart(2)+'  CRASH     '+p.who+'  → '+e.message);
    (tally['crash']=tally['crash']||[]).push(p.id+': '+e.message); return; }
  const comp=out.growth.filter(g=>g.from&&g.to>g.from);
  const top=comp.sort((a,b)=>(b.to-b.from)-(a.to-a.from)).slice(0,2)
    .map(g=>g.n+' '+g.from+'→'+g.to).join(', ')||'nothing moved';
  const held=out.growth.filter(g=>g.from&&g.to===g.from).length;
  console.log(String(p.id).padStart(2)+' | '+String(out.done+'/'+out.planned).padEnd(6)+
    '| gained: '+top.padEnd(46)+'| held: '+String(held).padEnd(3)+'| '+p.who);
  out.issues.forEach(i=>{
    (tally[i.tag]=tally[i.tag]||[]).push(p.id+': '+i.msg);
  });
  const big=out.growth.filter(g=>g.from&&g.to/g.from>2.5);
  if(big.length) (tally['fastgrowth']=tally['fastgrowth']||[]).push(p.id+': '+big.map(g=>g.n+' '+g.from+'→'+g.to).join(', '));
});

console.log('\n================ FINDINGS ================');
Object.keys(tally).sort().forEach(k=>{
  console.log('\n['+k+'] ('+tally[k].length+')');
  tally[k].slice(0,6).forEach(m=>console.log('   '+m));
  if(tally[k].length>6) console.log('   …and '+(tally[k].length-6)+' more');
});
