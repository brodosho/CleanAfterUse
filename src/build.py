#!/usr/bin/env python3
"""
Assembles index.html from the source pieces.

    python3 src/build.py

app.template.html carries four placeholders which are replaced with:
  __DIAG__  src/diagrams.js    the start/finish figures
  __GEN__   src/generator.js   the routine generator and time model
  __ELO__   src/elo.js         strength standards, ranks, tips
  __SEED__  src/seed.json      exercise library, templates, mobility (built by build_db2.py)

Run build_db2.py first if you have changed library.py or the templates:
    python3 src/build_db2.py
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def read(name):
    with open(os.path.join(HERE, name), encoding='utf-8') as f:
        return f.read()

def main():
    app = read('app.template.html')
    for key, fname in [('__DIAG__', 'diagrams.js'), ('__GEN__', 'generator.js'),
                       ('__ELO__', 'elo.js'), ('__SEED__', 'seed.json')]:
        if key not in app:
            sys.exit('placeholder %s missing from the template' % key)
        app = app.replace(key, read(fname))

    # the browser build stores in localStorage; the in-chat build uses a host API
    a = app.index('/* storage */')
    b = app.index('/* state */')
    app = app[:a] + """/* storage */
let persistent=true;
const store={
  async get(k){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):null; }
    catch(e){ persistent=false; return null; } },
  async set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); persistent=true; return true; }
    catch(e){ persistent=false; return false; } }
};

""" + app[b:]

    head = """<meta name="theme-color" content="#D7DAD4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#15181A" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Clean After Use">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-192.png">
"""
    app = app.replace('<title>Clean After Use</title>', head + '<title>Clean After Use</title>')
    app = app.replace('</body>', """<script>
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
</script>
</body>""")

    out = os.path.join(ROOT, 'index.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(app)
    print('wrote %s (%.0f KB)' % (out, len(app.encode()) / 1024))

if __name__ == '__main__':
    main()
