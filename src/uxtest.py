from playwright.sync_api import sync_playwright
import time, json, os

APP = 'file:///tmp/app.html'
R = {}

def measure(pg, label):
    """render() timing, averaged over 40 calls"""
    return pg.evaluate("""() => {
        const t0=performance.now();
        for(let i=0;i<40;i++) render();
        return (performance.now()-t0)/40;
    }""")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width':390,'height':844})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))

    t0=time.time()
    pg.goto(APP)
    pg.wait_for_selector('#view button', timeout=5000)
    R['cold_start_ms'] = round((time.time()-t0)*1000)
    R['page_bytes'] = os.path.getsize('/tmp/app.html')

    nav = pg.evaluate("""() => {
        const n=performance.getEntriesByType('navigation')[0]||{};
        return {domContentLoaded:Math.round(n.domContentLoadedEventEnd||0),
                loadEvent:Math.round(n.loadEventEnd||0)};
    }""")
    R['nav_timing']=nav

    taps=0
    def tap(text, exact=False, wait=180):
        nonlocal_taps = None
        pg.get_by_text(text, exact=exact).first.click()
        pg.wait_for_timeout(wait)

    # ---- time to value: cold open -> first routine ----
    t0=time.time(); n=0
    for step in ['Build one around me','Never, or near enough','Feeling fitter and healthier','Three']:
        tap(step); n+=1
    for d in ['Monday','Wednesday','Friday']:
        tap(d); n+=1
    tap('Continue'); n+=1
    tap('Machines'); n+=1
    tap('Legs and glutes'); n+=1
    tap('Continue'); n+=1
    tap('No, lifting only'); n+=1
    pg.get_by_text('An hour', exact=True).first.click(); pg.wait_for_timeout(500); n+=1
    tap('Use this routine', wait=500); n+=1
    R['setup_taps']=n
    R['setup_seconds']=round(time.time()-t0,1)

    R['render_today_ms']=round(measure(pg,'today'),2)

    # ---- taps to start and log a session ----
    t0=time.time(); n=0
    tap('Start', exact=True, wait=350); n+=1
    # warm-up -> next
    pg.get_by_text('Next', exact=True).first.click(); pg.wait_for_timeout(250); n+=1
    R['render_session_ms']=round(measure(pg,'session'),2)
    # walk every exercise: tick sets, set reps, next
    steps=0
    while steps<12:
        setbtns = pg.locator('.setbtn')
        if setbtns.count()==0: break
        for i in range(setbtns.count()):
            setbtns.nth(i).click(); pg.wait_for_timeout(60); n+=1
        plus = pg.locator('.step button', has_text='＋')
        if plus.count(): 
            for _ in range(8): plus.first.click(); n+=1
            pg.wait_for_timeout(80)
        nxt = pg.get_by_text('Next', exact=True)
        if nxt.count()==0: break
        nxt.first.click(); pg.wait_for_timeout(200); n+=1
        steps+=1
    # stretches step -> summary
    for _ in range(2):
        nxt = pg.get_by_text('Next', exact=True)
        if nxt.count(): nxt.first.click(); pg.wait_for_timeout(200); n+=1
    save = pg.get_by_text('Save this session', exact=False)
    if save.count(): save.first.click(); pg.wait_for_timeout(400); n+=1
    R['session_taps']=n
    R['session_seconds']=round(time.time()-t0,1)
    R['session_logged']=pg.evaluate("() => L.sessions.length")

    # ---- tap targets and type sizes ----
    audit = pg.evaluate("""() => {
      const els=[...document.querySelectorAll('button, input, select, textarea, [role=button]')];
      let small=0, total=0, minH=999;
      els.forEach(e=>{ const r=e.getBoundingClientRect();
        if(r.width===0&&r.height===0) return;
        total++; minH=Math.min(minH,Math.round(r.height));
        if(r.height<44||r.width<44) small++; });
      const txt=[...document.querySelectorAll('#view *')].filter(e=>e.children.length===0&&e.textContent.trim());
      let tiny=0;
      txt.forEach(e=>{ const s=parseFloat(getComputedStyle(e).fontSize); if(s<13) tiny++; });
      return {interactive:total, under44:small, smallestHeight:minH,
              textNodes:txt.length, under13px:tiny};
    }""")
    R['tap_targets']=audit

    # ---- depth: taps from Today to each feature ----
    depth={}
    def depth_test(name, path):
        pg.evaluate("() => { tab='today'; chosen=null; preview=null; eloOpen=false; targetsOpen=false; editing=null; addex=null; dlg=null; render(); }")
        pg.wait_for_timeout(150); c=0
        for label, exact in path:
            loc = pg.get_by_text(label, exact=exact)
            if loc.count()==0: return None
            loc.first.click(); pg.wait_for_timeout(220); c+=1
        return c
    depth['start a session']=depth_test('start',[('Start',True)])
    depth['change an exercise']=depth_test('change',[('change ›',False)])
    depth['swap an exercise']=depth_test('swap',[('change ›',False),('Swap it for something else',False)])
    depth['see your ELO']=depth_test('elo',[('Progress',True),('see how ›',False)])
    depth['set a target']=depth_test('target',[('Plan',True),('Targets',True)])
    depth['edit the schedule']=depth_test('sched',[('Plan',True),('Change the schedule',False)])
    depth['export your data']=depth_test('export',[('Settings',True),('Export sessions as CSV',False)])
    depth['change colour']=depth_test('colour',[('Settings',True),('Ocean',True)])
    R['taps_from_today']=depth

    # ---- scroll length of the main screens ----
    lens={}
    for name, setup in [('today',"tab='today'"),('progress',"tab='progress'"),
                        ('plan',"tab='plan'"),('settings',"tab='settings'")]:
        pg.evaluate(f"() => {{ {setup}; dlg=null; eloOpen=false; targetsOpen=false; editing=null; render(); }}")
        pg.wait_for_timeout(200)
        lens[name]=pg.evaluate("() => Math.round(document.body.scrollHeight/window.innerHeight*10)/10")
    R['screens_deep']=lens

    R['page_errors']=errs or None
    b.close()

print(json.dumps(R, indent=1))
