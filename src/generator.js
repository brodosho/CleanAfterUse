/* ---------- routine generator ---------- */
const GOALS={
  strength:{label:'Getting stronger',core:{sets:5,reps:'5',rest:180},acc:{sets:3,reps:'8',rest:90}},
  muscle:  {label:'Building muscle', core:{sets:4,reps:'8',rest:150},acc:{sets:3,reps:'12',rest:75}},
  health:  {label:'Feeling fitter',  core:{sets:3,reps:'10',rest:120},acc:{sets:2,reps:'12',rest:60}},
  lean:    {label:'Leaning out',     core:{sets:3,reps:'10',rest:90},acc:{sets:3,reps:'15',rest:45}}
};
const KIT={machines:['machine','cable','bodyweight','dumbbell'],
           barbell:['barbell','dumbbell','cable','machine','bodyweight'],
           dumbbell:['dumbbell','bodyweight'],
           any:['barbell','machine','dumbbell','cable','bodyweight']};
const FOCUS={legs:['quads','hamstrings','glutes'],back:['back'],chest:['chest'],
             shoulders:['shoulders'],arms:['biceps','triceps'],core:['core'],glutes:['glutes']};
const BIG=['chest','back','shoulders','quads','hamstrings','glutes','biceps','triceps','core','calves'];
const WEEK=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DOMAIN={
  full:['chest','back','shoulders','quads','hamstrings','glutes','biceps','triceps','core','calves'],
  upper:['chest','back','shoulders','biceps','triceps'],
  lower:['quads','hamstrings','glutes','calves','core'],
  push:['chest','shoulders','triceps'],
  pull:['back','biceps'],
  legs:['quads','hamstrings','glutes','calves']
};
const TIME={setup:15,perRep:3,transition:60,warmupSet:60};
const CARDIO_MIN={none:0,warmup:0,after:12,separate:0};
function repSeconds(reps){
  const r=String(reps).replace('+','').trim();
  if(/s$/.test(r)) return (parseInt(r)||30);
  const n=parseInt(r)||10;
  return n*TIME.perRep;
}
function exMinutes(sets,reps,rest,isCore){
  const per=TIME.setup+repSeconds(reps);
  let secs=sets*per+Math.max(0,sets-1)*rest+TIME.transition;
  if(isCore) secs+=2*TIME.warmupSet;      // the two ramp sets
  return secs/60;
}
function liftMinutes(items){
  const groups={}; let total=0;
  items.forEach(i=>{
    if(i.group){ (groups[i.group]=groups[i.group]||[]).push(i); return; }
    total+=exMinutes(i.sets,i.reps,i.rest,i.tier==='core');
  });
  /* a superset pays its rest once per round, not once per exercise */
  Object.values(groups).forEach(gr=>{
    const rounds=Math.max(...gr.map(x=>x.sets));
    const work=gr.reduce((a,x)=>a+x.sets*(TIME.setup+repSeconds(x.reps)),0);
    const rest=Math.max(...gr.map(x=>x.rest));
    total+=(work+Math.max(0,rounds-1)*rest+TIME.transition)/60;
  });
  return total;
}
function sessionClock(liftMin,timing){
  const warm=timing.warmup, str=timing.stretch, car=timing.cardio;
  return {warmup:warm,lift:Math.round(liftMin),stretch:str,cardio:car,
          total:Math.round(warm+liftMin+str+car)};
}
function kitOrder(kit,level){
  if(kit==='any') return level==='new'
    ? ['machine','dumbbell','cable','bodyweight','barbell']
    : ['barbell','dumbbell','machine','cable','bodyweight'];
  return KIT[kit]||KIT.any;
}
function chooseSplit(days,level){
  const S=(code,name,plan,patterns)=>({code,name,plan,patterns});
  if(days<=2) return [S('A','Full body A','full',['squat','hpush','hpull','hinge']),
                      S('B','Full body B','full',['hinge','vpull','vpush','squat'])];
  if(days===3){
    if(level==='experienced') return [S('P','Push','push',['hpush','vpush']),
                                      S('L','Pull','pull',['vpull','hpull']),
                                      S('G','Legs','legs',['squat','hinge'])];
    return [S('A','Full body A','full',['squat','hpull','hpush','hinge']),
            S('B','Full body B','full',['hinge','vpush','vpull','squat']),
            S('C','Full body C','full',['squat','vpull','hpush','hinge'])];
  }
  if(days===4) return [S('U1','Upper body A','upper',['hpush','vpull','vpush','hpull']),
                       S('L1','Lower body A','lower',['squat','hinge']),
                       S('U2','Upper body B','upper',['vpush','hpull','hpush','vpull']),
                       S('L2','Lower body B','lower',['hinge','squat'])];
  if(days===5) return [S('U1','Upper body A','upper',['hpush','vpull','vpush','hpull']),
                       S('L1','Lower body A','lower',['squat','hinge']),
                       S('P','Push','push',['hpush','vpush']),
                       S('L2','Pull','pull',['vpull','hpull']),
                       S('G','Legs','legs',['hinge','squat'])];
  return [S('P1','Push A','push',['hpush','vpush']),S('L1','Pull A','pull',['vpull','hpull']),
          S('G1','Legs A','legs',['squat','hinge']),S('P2','Push B','push',['vpush','hpush']),
          S('L2','Pull B','pull',['hpull','vpull']),S('G2','Legs B','legs',['hinge','squat'])];
}
function spreadDays(avail,n){
  const idx=(avail&&avail.length?avail:WEEK).map(d=>WEEK.indexOf(d)).filter(i=>i>=0).sort((a,b)=>a-b);
  if(idx.length<=n) return idx.map(i=>WEEK[i]);
  const combos=(arr,k)=>k===0?[[]]:arr.flatMap((v,i)=>combos(arr.slice(i+1),k-1).map(c=>[v,...c]));
  let best=idx.slice(0,n), score=-1;
  combos(idx,n).forEach(c=>{
    const s=c.slice().sort((a,b)=>a-b);
    let min=99;
    for(let i=0;i<s.length;i++) min=Math.min(min, i===s.length-1 ? s[0]+7-s[i] : s[i+1]-s[i]);
    if(min>score){ score=min; best=s; }
  });
  return best.map(i=>WEEK[i]);
}
function slotCap(level,mins){
  const byLevel={new:5,returning:6,experienced:8}[level]||6;
  const byTime=mins<=30?4:mins<=45?6:mins<=60?7:9;
  return Math.min(byLevel,byTime);
}
function volumeTargets(level,focusMuscles){
  const base={new:[6,12],returning:[8,14],experienced:[10,18]}[level]||[8,14];
  const t={};
  BIG.forEach(m=>{
    const f=focusMuscles.includes(m);
    t[m]=[f?base[0]+2:base[0], f?base[1]+4:base[1]];
  });
  t.back=[base[0],base[1]+6];              // several muscles, handles more work
  t.calves=[Math.max(2,base[0]-4),base[1]];
  t.core=[Math.max(2,base[0]-4),base[1]+2];   // the compounds already work the trunk
  t.biceps=[Math.max(3,base[0]-3),base[1]];
  t.triceps=[Math.max(3,base[0]-3),base[1]];
  if(focusMuscles.includes('core')) t.core=[base[0],base[1]+6];
  if(focusMuscles.includes('back')) t.back=[base[0]+2,base[1]+10];
  if(focusMuscles.includes('biceps')){ t.biceps=[base[0],base[1]+4]; t.triceps=[base[0],base[1]+4]; }
  return t;
}
function weeklyVolume(sessions){
  const v={}; BIG.forEach(m=>v[m]=0);
  sessions.forEach(s=>s.items.forEach(it=>{
    it.lib.muscles.forEach((m,i)=>{ if(v[m]!==undefined) v[m]+=it.sets*(i===0?1:0.5); });
  }));
  Object.keys(v).forEach(k=>v[k]=Math.round(v[k]*10)/10);
  return v;
}
function generateRoutine(a, shuffleSeed){
  const lib=SEED.library, level=a.level||'new', goal=GOALS[a.goal]||GOALS.health;
  const order=kitOrder(a.kit||'any',level);
  const focus=(a.focus||[]).filter(f=>f!=='none').flatMap(f=>FOCUS[f]||[]);
  const days=a.days||3;
  const doorToDoor=a.time||60;
  const dflt = doorToDoor<=35?{warmup:6,stretch:5} : doorToDoor<=45?{warmup:8,stretch:8} : {warmup:9,stretch:10};
  const timing={warmup:a.warmup??dflt.warmup, stretch:a.stretch??dflt.stretch,
                cardio:CARDIO_MIN[a.cardio||'none']};
  let cardioNote=null;
  if(timing.cardio>0 && doorToDoor-timing.warmup-timing.stretch-timing.cardio<18){
    cardioNote=`${doorToDoor} minutes does not leave room for cardio after lifting, so it goes on your rest days instead`;
    timing.cardio=0;
  }
  const liftBudget=Math.max(10, doorToDoor-timing.warmup-timing.stretch-timing.cardio);
  const cap=slotCap(level,999)+(doorToDoor>=75?2:0);   // longer sessions earn a couple more slots
  const split=chooseSplit(days,level);
  const rank=e=>{ const i=order.indexOf(e.equipment); return i<0?99:i; };
  const avail=lib.filter(e=>order.includes(e.equipment));
  const used=new Set();
  const seed=shuffleSeed||0;
  const rot=arr=>{ if(!seed||arr.length<2) return arr;
    const k=seed%arr.length; return arr.slice(k).concat(arr.slice(0,k)); };
  const jitter=arr=>{ if(!seed) return arr;
    return arr.map((x,i)=>{ let h=(((i+1)*73856093)^((seed+1)*19349663))>>>0;
      h=(h^(h>>>13))>>>0; return [x,h%99991]; }).sort((p,q)=>p[1]-q[1]).map(p=>p[0]); };

  const pickCore=pattern=>{
    let pool=avail.filter(e=>e.pattern===pattern&&e.tier==='core').sort((x,y)=>rank(x)-rank(y));
    const top=pool.filter(e=>rank(e)===rank(pool[0]));
    pool=rot(jitter(top)).concat(pool);
    let e=pool.find(x=>!used.has(x.slug))||pool[0];
    if(!e){ const alt=avail.filter(x=>x.pattern===pattern).sort((x,y)=>rank(x)-rank(y));
      e=alt.find(x=>!used.has(x.slug))||alt[0]; }
    if(e) used.add(e.slug);
    return e;
  };
  const pickAcc=(domain,prefer,sUsed)=>{
    let pool=avail.filter(e=>e.tier==='accessory'&&domain.includes(e.muscles[0])&&!sUsed.has(e.slug));
    if(prefer&&prefer.length){
      const p=pool.filter(e=>prefer.includes(e.muscles[0]));
      if(p.length) pool=p;
    }
    if(!pool.length) return null;
    pool=rot(jitter(pool).sort((x,y)=>rank(x)-rank(y)));
    const e=pool.find(x=>!used.has(x.slug))||pool[0];   // fresh if possible, repeat across days is fine
    used.add(e.slug); sUsed.add(e.slug);
    return e;
  };

  const tight=[], paired=[];
  const sessions=split.map(s=>{
    const items=[], sUsed=new Set();
    const mustHave = s.plan==='full' ? Math.min(3,s.patterns.length) : 2;
    const fits=extra=>liftMinutes(items.concat(extra?[extra]:[]))<=liftBudget;

    // core lifts first — at least two, even if they eat the whole budget
    s.patterns.forEach(p=>{
      if(items.length>=Math.max(2,cap-1)) return;
      const e=pickCore(p); if(!e||sUsed.has(e.slug)) return;
      const item={lib:e,tier:'core',sets:goal.core.sets,
        reps:goal.core.reps+(level!=='new'&&items.length===0?'+':''),rest:goal.core.rest};
      if(items.length>=mustHave && !fits(item)) return;
      sUsed.add(e.slug); items.push(item);
    });

    // if the compounds alone overrun, trim rest then sets before dropping a lift
    let cutRest=false, cutSets=false;
    const trim=()=>{ let guard=0;
      while(liftMinutes(items)>liftBudget && guard++<10){
        let moved=false;
        items.forEach(i=>{ if(i.tier==='core'&&i.rest>90){ i.rest=Math.max(90,i.rest-30); moved=cutRest=true; } });
        if(!moved) items.forEach(i=>{ if(i.tier==='core'&&i.sets>3){ i.sets-=1; moved=cutSets=true; } });
        if(!moved) break;
      }
    };
    // drop the optional extras, then shorten rests and sets, and only then give up a movement
    while(liftMinutes(items)>liftBudget && items.length>mustHave){ const d=items.pop(); sUsed.delete(d.lib.slug); }
    trim();
    while(liftMinutes(items)>liftBudget && items.length>2){ const d=items.pop(); sUsed.delete(d.lib.slug); trim(); }
    if(cutRest||cutSets) tight.push(`${s.name}: ${doorToDoor} minutes is tight for ${goal.label.toLowerCase()}, so I ${
      [cutRest?'shortened the rests between sets':null,cutSets?'cut a set off each compound lift':null]
      .filter(Boolean).join(' and ')}`);

    // accessories only while there is room left on the clock
    const dom=DOMAIN[s.plan];
    while(items.length<cap){
      const e=pickAcc(dom,focus.filter(m=>dom.includes(m)),sUsed);
      if(!e) break;
      const item={lib:e,tier:'acc',sets:goal.acc.sets,reps:goal.acc.reps,rest:goal.acc.rest};
      if(!fits(item)){ sUsed.delete(e.slug); used.delete(e.slug); break; }
      items.push(item);
    }
    /* short sessions: pair two accessories rather than drop both */
    let pairN=0;
    while(items.length+2<=cap+1){
      const e1=pickAcc(dom,focus.filter(m=>dom.includes(m)),sUsed);
      if(!e1) break;
      const e2=pickAcc(dom,focus.filter(m=>dom.includes(m)),sUsed);
      if(!e2){ sUsed.delete(e1.slug); used.delete(e1.slug); break; }
      const gid='sup'+(++pairN);
      const p1={lib:e1,tier:'acc',sets:goal.acc.sets,reps:goal.acc.reps,rest:goal.acc.rest,group:gid};
      const p2={lib:e2,tier:'acc',sets:goal.acc.sets,reps:goal.acc.reps,rest:goal.acc.rest,group:gid};
      if(liftMinutes(items.concat([p1,p2]))>liftBudget){
        sUsed.delete(e1.slug); used.delete(e1.slug);
        sUsed.delete(e2.slug); used.delete(e2.slug); break;
      }
      items.push(p1,p2); paired.push(`${e1.name} with ${e2.name}`);
    }
    if(!items.some(i=>i.lib.muscles[0]==='core')){
      const e=pickAcc(['core'],[],sUsed);
      const item=e&&{lib:e,tier:'acc',sets:2,reps:'30s',rest:60};
      if(item&&fits(item)) items.push(item); else if(e){ sUsed.delete(e.slug); used.delete(e.slug); }
    }
    return {...s,items,used:sUsed,budget:liftBudget};
  });

  /* balance pass — nudge weekly sets into the evidence-backed range */
  const targets=volumeTargets(level,focus);
  const log=[];
  for(let pass=0; pass<10; pass++){
    const v=weeklyVolume(sessions);
    let changed=false;
    for(const m of BIG){
      const [lo,hi]=targets[m];
      const trained=sessions.some(s=>s.items.some(i=>i.lib.muscles.includes(m)));
      if(v[m]<lo && trained){
        const host=sessions.filter(s=>DOMAIN[s.plan].includes(m))
          .sort((x,y)=>x.items.length-y.items.length)[0];
        if(host && host.items.length<cap+2){
          const e=pickAcc([m],[m],host.used);
          const trial=e&&{lib:e,tier:'acc',sets:goal.acc.sets,reps:goal.acc.reps,rest:goal.acc.rest};
          if(trial && liftMinutes(host.items.concat([trial]))>liftBudget){
            host.used.delete(e.slug); used.delete(e.slug); continue; }
          if(e){ host.items.push(trial);
            log.push(`${m} was light at ${v[m]} sets, added ${e.name} to ${host.name}`); changed=true; }
        }
      } else if(v[m]>hi){
        for(const s of sessions){
          const i=s.items.map((it,ix)=>({it,ix})).reverse()
            .find(o=>o.it.tier==='acc'&&o.it.lib.muscles[0]===m&&s.items.length>3);
          if(i){ s.items.splice(i.ix,1); s.used.delete(i.it.lib.slug);
            log.push(`${m} was heavy at ${v[m]} sets, dropped ${i.it.lib.name} from ${s.name}`);
            changed=true; break; }
        }
      }
    }
    if(!changed) break;
  }

  const dayList=spreadDays(a.when,days);
  const chosen=sessions.slice(0,Math.max(days,1));
  /* bands are reps BEYOND the prescribed target, not the raw count */
  const rules=(level==='new'||a.goal==='health')
    ? [{min_reps:0,max_reps:2,upper_add:1.25,lower_add:2.5,label:'You hit the target'},
       {min_reps:3,max_reps:5,upper_add:2.5,lower_add:5,label:'A few reps clear'},
       {min_reps:6,max_reps:99,upper_add:5,lower_add:10,label:'Well clear — bigger jump'}]
    : [{min_reps:0,max_reps:2,upper_add:2.5,lower_add:5,label:'You hit the target'},
       {min_reps:3,max_reps:5,upper_add:5,lower_add:10,label:'A few reps clear'},
       {min_reps:6,max_reps:99,upper_add:7.5,lower_add:15,label:'Well clear — bigger jump'}];

  const workouts=chosen.map((s,i)=>({code:s.code,name:s.name,kind:'main',follows:null,
    colour:PALETTE[i%PALETTE.length],position:i+1}));
  const exercises=[];
  chosen.forEach(s=>s.items.forEach((it,i)=>exercises.push({
    workout_code:s.code,name:it.lib.name,sets:it.sets,rep_scheme:it.reps,rest_seconds:it.rest,
    body_area:it.lib.area==='core'?'core':it.lib.area,tracks_weight:it.lib.equipment==='bodyweight'?0:1,
    current_weight:null,fixed_increment:null,is_optional:0,is_rotation:0,
    is_barbell:it.lib.is_barbell,is_core:it.tier==='core'?1:0,group:it.group||null,
    cue:it.lib.cue,position:i+1})));

  const schedule=WEEK.map(d=>({day:d,slot:dayList.includes(d)?'main':'rest',
    cardio: dayList.includes(d)?'' : (WEEK.indexOf(d)%3===1?'Easy walk or cycle':'')}));

  const vol=weeklyVolume(chosen);
  const clocks=chosen.map(s=>({name:s.name,...sessionClock(liftMinutes(s.items),timing)}));
  const longest=clocks.reduce((a,b)=>b.total>a.total?b:a,clocks[0]);
  if(longest.total>doorToDoor+3) tight.push(
    `your longest session comes to about ${longest.total} minutes rather than ${doorToDoor} — `+
    `dropping another exercise would leave a whole movement out of your week`);
  const NICE={quads:'thighs',hamstrings:'back of the legs',glutes:'glutes',chest:'chest',back:'back',
    shoulders:'shoulders',biceps:'biceps',triceps:'triceps',core:'core',calves:'calves'};
  const under=BIG.filter(m=>vol[m]>0&&vol[m]<targets[m][0]-0.5).map(m=>NICE[m]);
  const untrained=['chest','back','quads','hamstrings'].filter(m=>!vol[m]);
  return {name:`My routine`,blurb:`${chosen.length} sessions a week, built around ${goal.label.toLowerCase()}.`,
    source:'Built from your answers using the r/Fitness wiki routine structure and the 10–20 weekly sets per muscle guidance.',
    notes:`Train on ${dayList.join(', ')}. Everything else is a rest day.`+
      (timing.cardio?` Cardio goes at the end of each session.`:''),
    workouts,exercises,rules,schedule,timing,
    _vol:vol,_targets:targets,_log:log.slice(0,6),_days:dayList,_clocks:clocks,_longest:longest,
    _paired:paired,
    _tight:cardioNote?[cardioNote].concat(tight):tight,_budget:liftBudget,_doorToDoor:doorToDoor,
    _under:under,_split:split.length===1?'one session':chosen.length+' sessions',_goal:goal.label,_cap:cap,
    _sessions:chosen.map(s=>({name:s.name,items:s.items.map(i=>`${i.lib.name} ${i.sets}×${i.reps}`)}))};
}
