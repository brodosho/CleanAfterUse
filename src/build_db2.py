import sqlite3, os, json
from library import LIB

OUT = "/mnt/user-data/outputs"
db_path = os.path.join(OUT, "gym.db")
if os.path.exists(db_path): os.remove(db_path)

SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE profile (
    id INTEGER PRIMARY KEY CHECK (id=1),
    name TEXT NOT NULL, units TEXT DEFAULT 'kg', bar_weight REAL DEFAULT 20,
    guided INTEGER DEFAULT 1, advanced INTEGER DEFAULT 0, theme TEXT DEFAULT 'auto',
    active_program INTEGER
);

-- A routine. Phase 1, Phase 2, a template from the library — all rows here.
CREATE TABLE program (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    is_template INTEGER NOT NULL DEFAULT 0,
    blurb       TEXT,
    who         TEXT,
    days_wk     INTEGER,
    equipment   TEXT,     -- machines | barbell | dumbbell | any
    level       TEXT,     -- new | returning | experienced
    source      TEXT,
    notes       TEXT,
    created     TEXT
);

CREATE TABLE workout (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    code TEXT NOT NULL, name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('main','light')),
    follows TEXT, colour TEXT, position INTEGER NOT NULL
);

CREATE TABLE exercise (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    workout_code TEXT NOT NULL,
    name TEXT NOT NULL, sets INTEGER NOT NULL, rep_scheme TEXT NOT NULL,
    rest_seconds INTEGER NOT NULL,
    body_area TEXT NOT NULL CHECK (body_area IN ('upper','lower','core','grip')),
    tracks_weight INTEGER DEFAULT 1, current_weight REAL, fixed_increment REAL,
    is_optional INTEGER DEFAULT 0, is_rotation INTEGER DEFAULT 0, is_barbell INTEGER DEFAULT 0,
    cue TEXT, sessions INTEGER DEFAULT 0, sessions_at_weight INTEGER DEFAULT 0,
    position INTEGER NOT NULL
);

CREATE TABLE progression_rule (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    min_reps INTEGER, max_reps INTEGER, upper_add REAL, lower_add REAL, label TEXT
);

CREATE TABLE schedule (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    day TEXT NOT NULL, slot TEXT NOT NULL, cardio TEXT, position INTEGER
);

CREATE TABLE session (
    id INTEGER PRIMARY KEY, program_id INTEGER, workout_code TEXT,
    performed_on TEXT NOT NULL, notes TEXT
);
CREATE TABLE set_log (
    id INTEGER PRIMARY KEY, session_id INTEGER REFERENCES session(id) ON DELETE CASCADE,
    exercise_id INTEGER, set_number INTEGER, weight REAL, reps INTEGER
);
CREATE TABLE bodyweight (id INTEGER PRIMARY KEY, on_date TEXT, kg REAL);
CREATE TABLE exercise_library (
    slug TEXT PRIMARY KEY, name TEXT NOT NULL, pattern TEXT NOT NULL,
    muscles TEXT NOT NULL, equipment TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('core','accessory')),
    area TEXT NOT NULL, is_barbell INTEGER DEFAULT 0, cue TEXT
);
CREATE TABLE cardio_option (id INTEGER PRIMARY KEY, intensity TEXT, name TEXT);
CREATE TABLE mobility (id INTEGER PRIMARY KEY, phase TEXT, name TEXT, prescription TEXT, position INTEGER);

CREATE VIEW routine_overview AS
SELECT p.name AS routine, w.code, w.name AS workout, e.position, e.name AS exercise,
       e.sets, e.rep_scheme, e.current_weight
FROM exercise e JOIN workout w ON w.program_id=e.program_id AND w.code=e.workout_code
JOIN program p ON p.id=e.program_id
ORDER BY p.id, w.position, e.position;
"""

con = sqlite3.connect(db_path)
con.executescript(SCHEMA)

C = {
"Seated Rows":"Chest tall, pull the handle to your belly button, squeeze your shoulder blades together, control it back out.",
"Barbell Row":"Hinge forward with a flat back, pull the bar to your lower ribs, elbows close to your body.",
"Bench Press":"Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.",
"Squats":"Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.",
"Lat Pulldowns":"Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.",
"Chin-ups":"Palms facing you, hang with straight arms, pull until your chin clears the bar. Use the assisted machine or a band if you need to.",
"Overhead Press":"Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.",
"Deadlift":"Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.",
"Romanian Deadlift":"Soft knees, push your hips back and slide the bar down your thighs. Stop when you feel the stretch behind your knees.",
"Leg Press":"Feet shoulder-width on the platform, lower until your knees are near 90 degrees. Never lock your knees hard at the top.",
"Chest Press Machine":"Set the seat so the handles sit at chest height. Press out smoothly, don't lock the elbows.",
"Seated Row Machine":"Chest against the pad, pull the handles to your ribs, squeeze the shoulder blades.",
"Shoulder Press Machine":"Seat height so the handles start at shoulder level. Press up without shrugging.",
"Leg Curl":"Pad just above your heels. Curl towards your backside, lower slowly.",
"Leg Extension":"Pad above your ankles. Straighten the legs, pause a beat, lower under control.",
"Goblet Squat":"Hold one dumbbell at your chest. Sit down between your hips, elbows inside your knees.",
"Dumbbell Bench Press":"Dumbbells at chest height, press up until they nearly touch. Keep your wrists straight.",
"One-arm Dumbbell Row":"One knee and hand on a bench, flat back, pull the dumbbell to your hip.",
"Dumbbell Shoulder Press":"Dumbbells at shoulder height, press overhead without arching your lower back.",
"Dumbbell Romanian Deadlift":"Soft knees, hinge at the hips, dumbbells sliding down your thighs, flat back.",
"Face pulls":"Rope at eye height. Pull towards your forehead, elbows high and wide. Light weight, slow.",
"Supermans":"Face down, lift your chest and thighs off the floor and hold.",
"Farmer's carry":"A heavy dumbbell in each hand. Stand tall, walk steady, don't lean.",
"Plate pinches":"Pinch two plates smooth-side-out between thumb and fingers. Hold.",
"Dead hang":"Hang from the bar, arms straight, shoulders pulled slightly down.",
"Tricep pushdown":"Elbows pinned to your sides. Straighten the arms, control the way back.",
"Curls":"Elbows still, no swinging. Lower slower than you lift.",
"Calf raises":"Full stretch at the bottom, pause at the top of every rep.",
"Plank":"Straight line head to heels. Squeeze your glutes so your hips don't sag.",
"Hanging leg raises":"Hang still, lift your legs without swinging. Bend the knees if it's too hard.",
"Weighted crunches":"Weight on your chest, curl your ribs towards your hips. Don't pull on your neck.",
"Hip thrust":"Shoulders on a bench, bar padded across the hips. Drive through your heels, ribs down.",
"Cable Row":"Chest tall, pull to your belly button, shoulders back.",
"Ab Machine":"Set the seat, curl your ribs down towards your hips, control the return.",
"Bulgarian Split Squat":"Back foot on a bench, drop straight down, front knee over the foot.",
}

# bands are reps BEYOND the prescribed target, not the raw rep count
STD = [(0,2,2.5,5,"You hit the target"),(3,5,5,10,"A few reps clear"),
       (6,99,7.5,15,"Well clear — bigger jump")]
GENTLE = [(0,2,1.25,2.5,"You hit the target"),(3,5,2.5,5,"A few reps clear"),
          (6,99,5,10,"Well clear — bigger jump")]
WIKI = [(0,2,1.25,2.5,"Standard r/Fitness jump"),(3,5,2.5,5,"Well clear — double it"),
        (6,99,5,10,"Far clear of the target")]

def sched(days, cardio_low="Easy cardio", cardio_hi="Intervals"):
    week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    return [(d, days.get(d,"rest"), (cardio_hi if d=="Saturday" else cardio_low if d=="Tuesday" else "")) for d in week]

# exercises meant to alternate rather than all be done in one session
ROTATE = {"Farmer's carry","Plate pinches","Dead hang",
          "Plank","Hanging leg raises","Weighted crunches"}

TEMPLATES = []

# 1 — machines, never lifted
TEMPLATES.append(dict(
 name="First time in a gym", equipment="machines", level="new", days_wk=3,
 blurb="One full-body session you repeat three times a week, all on machines. Machines hold the movement for you, so there is much less to get wrong while you learn.",
 who="You have never lifted, or it has been long enough that it feels that way.",
 source="Built on the ACSM guidance of 8–10 full-body exercises for new lifters, in the shape gyms like Gold's teach it.",
 notes="Leave a day between sessions. Add weight only when the last set feels easy.",
 rules=GENTLE,
 workouts=[("F","Full body","main",None,"#2C7A4E")],
 ex=[("F","Leg Press",2,"10",90,"lower"),("F","Chest Press Machine",2,"10",90,"upper"),
     ("F","Seated Row Machine",2,"10",90,"upper"),("F","Lat Pulldowns",2,"10",90,"upper"),
     ("F","Shoulder Press Machine",2,"10",90,"upper"),("F","Leg Curl",2,"10",90,"lower"),
     ("F","Plank",2,"20s",60,"core",0)],
 schedule=sched({"Monday":"main","Wednesday":"main","Friday":"main"})))

# 2 — r/Fitness BBR
TEMPLATES.append(dict(
 name="r/Fitness Basic Beginner Routine", equipment="barbell", level="new", days_wk=3,
 blurb="Two alternating barbell sessions, three days a week: A, B, A one week and B, A, B the next. Five movements total, so you can learn them properly.",
 who="New to barbells and happy to use a squat rack.",
 source="The r/Fitness wiki's primary recommended beginner routine.",
 notes="Run this for three months at most, then move up to something with more volume. Add 1.25 kg to upper-body lifts and 2.5 kg to lower-body lifts each time you do them; over ten reps on the last set, double it. If you cannot get fifteen reps across the three sets, drop the weight 10 percent next time.",
 rules=WIKI,
 workouts=[("A","Row · Bench · Squat","main",None,"#B7242B"),("B","Pull · Press · Deadlift","main",None,"#1C4E86")],
 ex=[("A","Barbell Row",3,"5+",150,"upper"),("A","Bench Press",3,"5+",150,"upper",1,1),
     ("A","Squats",3,"5+",150,"lower",1,1),
     ("B","Chin-ups",3,"5+",150,"upper",0),("B","Overhead Press",3,"5+",150,"upper",1,1),
     ("B","Deadlift",3,"5+",180,"lower",1,1)],
 schedule=sched({"Monday":"main","Wednesday":"main","Friday":"main"})))

# 3 — Brodie's Phase 1
TEMPLATES.append(dict(
 name="Gym Phase 1", equipment="any", level="returning", days_wk=5,
 blurb="Two main lifting days plus two light days for grip, core and arms, with cardio built in. More work than a bare beginner routine without being overwhelming.",
 who="You have a few weeks behind you and want more than three sessions.",
 source="Your own program, tidied up.",
 notes="Main lifts alternate A, B, A. Light day X always follows A and Y always follows B.",
 rules=STD,
 workouts=[("A","Row · Bench · Squat","main",None,"#B7242B"),("B","Pulldown · Press · Deadlift","main",None,"#1C4E86"),
           ("X","Grip and posterior","light","A","#2C7A4E"),("Y","Arms and core","light","B","#B58200")],
 ex=[("A","Seated Rows",3,"5+",150,"upper",1,0,50),("A","Bench Press",3,"5+",150,"upper",1,1,40),
     ("A","Squats",3,"5+",150,"lower",1,1,20),
     ("B","Lat Pulldowns",3,"5+",150,"upper",1,0,60),("B","Overhead Press",3,"5+",150,"upper",1,1,25),
     ("B","Deadlift",1,"5",180,"lower",1,1,30),
     ("X","Face pulls",3,"12",90,"upper",1,0,12.5),("X","Supermans",4,"10s",60,"core",0),
     ("X","Farmer's carry",3,"30s",90,"grip",1,0,50),("X","Plate pinches",3,"8",90,"grip",1,0,5),
     ("X","Dead hang",1,"30s",90,"grip",0),
     ("Y","Curls",3,"10",90,"upper"),("Y","Calf raises",3,"12",60,"lower"),
     ("Y","Plank",2,"30s",60,"core",0),("Y","Hanging leg raises",3,"12",60,"core",0),
     ("Y","Weighted crunches",3,"12",60,"core")],
 schedule=sched({"Friday":"main","Saturday":"light","Sunday":"main","Monday":"light","Wednesday":"main"})))

# 4 — GZCLP
TEMPLATES.append(dict(
 name="GZCLP", equipment="barbell", level="experienced", days_wk=3,
 blurb="Four rotating sessions, three a week. Each one has a heavy lift, a lighter version of another lift, and an accessory — so you get far more volume than a plain beginner routine.",
 who="You have finished a beginner routine and want the next step up.",
 source="Cody Lefever's GZCLP, the routine the r/Fitness wiki names as the usual step after the beginner program.",
 notes="Heavy lift: five sets of three, last set as many as you can. Middle lift: three sets of ten. Accessory: three sets of fifteen, last set as many as you can — add weight there once you pass twenty-five.",
 rules=STD,
 workouts=[("A1","Heavy squat","main",None,"#B7242B"),("A2","Heavy press","main",None,"#1C4E86"),
           ("B1","Heavy bench","main",None,"#6B3FA0"),("B2","Heavy deadlift","main",None,"#0F6E78")],
 ex=[("A1","Squats",5,"3+",180,"lower",1,1),("A1","Bench Press",3,"10",120,"upper",1,1),("A1","Lat Pulldowns",3,"15+",90,"upper"),
     ("A2","Overhead Press",5,"3+",180,"upper",1,1),("A2","Deadlift",3,"10",150,"lower",1,1),("A2","One-arm Dumbbell Row",3,"15+",90,"upper"),
     ("B1","Bench Press",5,"3+",180,"upper",1,1),("B1","Squats",3,"10",120,"lower",1,1),("B1","Lat Pulldowns",3,"15+",90,"upper"),
     ("B2","Deadlift",5,"3+",180,"lower",1,1),("B2","Overhead Press",3,"10",120,"upper",1,1),("B2","One-arm Dumbbell Row",3,"15+",90,"upper")],
 schedule=sched({"Monday":"main","Wednesday":"main","Friday":"main"})))

# 5 — dumbbells
TEMPLATES.append(dict(
 name="Dumbbells only", equipment="dumbbell", level="new", days_wk=3,
 blurb="A full-body session with nothing but a pair of dumbbells and a bench. Works at home or in a busy gym where the racks are always taken.",
 who="No barbell, or you would rather not use one yet.",
 source="A standard full-body dumbbell template, same movement patterns as the barbell routines.",
 notes="Repeat the same session two or three times a week with a rest day between.",
 rules=GENTLE,
 workouts=[("D","Full body","main",None,"#B58200")],
 ex=[("D","Goblet Squat",3,"10",90,"lower"),("D","Dumbbell Bench Press",3,"10",90,"upper"),
     ("D","One-arm Dumbbell Row",3,"10",90,"upper"),("D","Dumbbell Romanian Deadlift",3,"10",90,"lower"),
     ("D","Dumbbell Shoulder Press",3,"10",90,"upper"),("D","Plank",3,"30s",60,"core",0)],
 schedule=sched({"Monday":"main","Wednesday":"main","Saturday":"main"})))

# 6 — upper/lower
TEMPLATES.append(dict(
 name="Upper and lower, four days", equipment="any", level="experienced", days_wk=4,
 blurb="Two upper-body days and two lower-body days a week. More exercises per session and more room for the bits you want to bring up.",
 who="You have trained consistently for a while and want four sessions.",
 source="The standard four-day upper/lower split recommended for intermediates.",
 notes="Upper, lower, rest, upper, lower, rest, rest works well.",
 rules=STD,
 workouts=[("U","Upper body","main",None,"#1C4E86"),("L","Lower body","main",None,"#B7242B")],
 ex=[("U","Bench Press",4,"6",150,"upper",1,1),("U","Barbell Row",4,"8",150,"upper"),
     ("U","Overhead Press",3,"8",120,"upper",1,1),("U","Lat Pulldowns",3,"10",90,"upper"),
     ("U","Curls",3,"12",60,"upper"),("U","Tricep pushdown",3,"12",60,"upper"),
     ("L","Squats",4,"6",180,"lower",1,1),("L","Romanian Deadlift",3,"8",150,"lower",1,1),
     ("L","Leg Press",3,"10",120,"lower"),("L","Leg Curl",3,"12",90,"lower"),
     ("L","Calf raises",4,"12",60,"lower")],
 schedule=sched({"Monday":"main","Tuesday":"main","Thursday":"main","Friday":"main"})))

pid = 0
for t in TEMPLATES:
    pid += 1
    con.execute("INSERT INTO program (id,name,is_template,blurb,who,days_wk,equipment,level,source,notes,created)"
                " VALUES (?,?,1,?,?,?,?,?,?,?,date('now'))",
                (pid,t["name"],t["blurb"],t["who"],t["days_wk"],t["equipment"],t["level"],t["source"],t["notes"]))
    for i,(code,nm,kind,follows,col) in enumerate(t["workouts"]):
        con.execute("INSERT INTO workout (program_id,code,name,kind,follows,colour,position) VALUES (?,?,?,?,?,?,?)",
                    (pid,code,nm,kind,follows,col,i+1))
    pos = {}
    for row in t["ex"]:
        code,nm,sets,reps,rest,area = row[:6]
        tracks = row[6] if len(row)>6 else 1
        barbell = row[7] if len(row)>7 else 0
        wt = row[8] if len(row)>8 else None
        pos[code] = pos.get(code,0)+1
        rot = 1 if (t["name"]=="Gym Phase 1" and nm in ROTATE) else 0
        fixed = 5.0 if (nm=="Deadlift" and t["name"]=="Gym Phase 1") else None
        con.execute("INSERT INTO exercise (program_id,workout_code,name,sets,rep_scheme,rest_seconds,body_area,"
                    "tracks_weight,current_weight,fixed_increment,is_barbell,is_rotation,cue,position)"
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (pid,code,nm,sets,reps,rest,area,tracks,wt,fixed,barbell,rot,C.get(nm,""),pos[code]))
    for (a,b,u,l,lab) in t["rules"]:
        con.execute("INSERT INTO progression_rule (program_id,min_reps,max_reps,upper_add,lower_add,label)"
                    " VALUES (?,?,?,?,?,?)",(pid,a,b,u,l,lab))
    for i,(d,slot,cardio) in enumerate(t["schedule"]):
        con.execute("INSERT INTO schedule (program_id,day,slot,cardio,position) VALUES (?,?,?,?,?)",
                    (pid,d,slot,cardio,i+1))

con.execute("INSERT INTO profile (id,name,units,bar_weight,guided,advanced,theme,active_program)"
            " VALUES (1,'Brodie Shaw','kg',20,1,0,'auto',3)")

for inten,names in [("low",["Brisk walk","Light cycling","Elliptical","Jogging"]),
                    ("hiit",["Stationary bike","Rowing machine","Boxing","Elliptical"])]:
    con.executemany("INSERT INTO cardio_option (intensity,name) VALUES (?,?)",[(inten,n) for n in names])

pre=[("Light cardio","3–5 min"),("Arm circles, cross-directional","5 each way"),
     ("Arm circles, same direction","5 each way"),("Leg swings, front-back","5 each leg"),
     ("Leg swings, side-side","5 each leg"),("Lunge + rotation","1 each side"),
     ("Glute bridges","10–15"),("Ankle circles","10 each way")]
post=[("Standing quad stretch","30s each leg"),("Hamstring stretch","30s each way"),
      ("Butterfly stretch","30s"),("IT band stretch","30s each way"),("Wall calf stretch","30s each side"),
      ("World's greatest stretch","20s each way"),("Cobra pose","30s"),("Downward dog","30s"),("Child's pose","45s")]
con.executemany("INSERT INTO mobility (phase,name,prescription,position) VALUES ('pre',?,?,?)",
                [(n,p,i+1) for i,(n,p) in enumerate(pre)])
con.executemany("INSERT INTO mobility (phase,name,prescription,position) VALUES ('post',?,?,?)",
                [(n,p,i+1) for i,(n,p) in enumerate(post)])
con.executemany("INSERT INTO exercise_library VALUES (?,?,?,?,?,?,?,?,?)",
    [(sl,nm,pat,",".join(mus),eq,tier,area,bb,cue) for sl,nm,pat,mus,eq,tier,area,bb,cue in LIB])
con.commit()

with open(os.path.join(OUT,"gym-schema.sql"),"w") as f:
    for line in con.iterdump(): f.write(line+"\n")

def rows(q,a=()):
    cur=con.execute(q,a); cols=[d[0] for d in cur.description]
    return [dict(zip(cols,r)) for r in cur.fetchall()]

programs=[]
for p in rows("SELECT * FROM program WHERE is_template=1 ORDER BY id"):
    p["workouts"]=rows("SELECT code,name,kind,follows,colour,position FROM workout WHERE program_id=? ORDER BY position",(p["id"],))
    p["exercises"]=rows("SELECT * FROM exercise WHERE program_id=? ORDER BY workout_code,position",(p["id"],))
    p["rules"]=rows("SELECT min_reps,max_reps,upper_add,lower_add,label FROM progression_rule WHERE program_id=? ORDER BY min_reps",(p["id"],))
    p["schedule"]=rows("SELECT day,slot,cardio FROM schedule WHERE program_id=? ORDER BY position",(p["id"],))
    programs.append(p)

seed={"profile":rows("SELECT * FROM profile")[0],"templates":programs,
      "cardio":rows("SELECT intensity,name FROM cardio_option ORDER BY id"),
      "mobility":rows("SELECT phase,name,prescription,position FROM mobility ORDER BY phase,position"),
      "library":[dict(r, muscles=r["muscles"].split(",")) for r in rows("SELECT * FROM exercise_library")]}
json.dump(seed,open("/home/claude/seed.json","w"),indent=1)
print("library:",len(LIB),"| templates:",len(programs),"| exercises:",sum(len(p["exercises"]) for p in programs),
      "| db:",os.path.getsize(db_path))
con.close()
