BEGIN TRANSACTION;
CREATE TABLE bodyweight (id INTEGER PRIMARY KEY, on_date TEXT, kg REAL);
CREATE TABLE cardio_option (id INTEGER PRIMARY KEY, intensity TEXT, name TEXT);
INSERT INTO "cardio_option" VALUES(1,'low','Brisk walk');
INSERT INTO "cardio_option" VALUES(2,'low','Light cycling');
INSERT INTO "cardio_option" VALUES(3,'low','Elliptical');
INSERT INTO "cardio_option" VALUES(4,'low','Jogging');
INSERT INTO "cardio_option" VALUES(5,'hiit','Stationary bike');
INSERT INTO "cardio_option" VALUES(6,'hiit','Rowing machine');
INSERT INTO "cardio_option" VALUES(7,'hiit','Boxing');
INSERT INTO "cardio_option" VALUES(8,'hiit','Elliptical');
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
INSERT INTO "exercise" VALUES(1,1,'F','Leg Press',2,'10',90,'lower',1,NULL,NULL,0,0,0,'Feet shoulder-width on the platform, lower until your knees are near 90 degrees. Never lock your knees hard at the top.',0,0,1);
INSERT INTO "exercise" VALUES(2,1,'F','Chest Press Machine',2,'10',90,'upper',1,NULL,NULL,0,0,0,'Set the seat so the handles sit at chest height. Press out smoothly, don''t lock the elbows.',0,0,2);
INSERT INTO "exercise" VALUES(3,1,'F','Seated Row Machine',2,'10',90,'upper',1,NULL,NULL,0,0,0,'Chest against the pad, pull the handles to your ribs, squeeze the shoulder blades.',0,0,3);
INSERT INTO "exercise" VALUES(4,1,'F','Lat Pulldowns',2,'10',90,'upper',1,NULL,NULL,0,0,0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.',0,0,4);
INSERT INTO "exercise" VALUES(5,1,'F','Shoulder Press Machine',2,'10',90,'upper',1,NULL,NULL,0,0,0,'Seat height so the handles start at shoulder level. Press up without shrugging.',0,0,5);
INSERT INTO "exercise" VALUES(6,1,'F','Leg Curl',2,'10',90,'lower',1,NULL,NULL,0,0,0,'Pad just above your heels. Curl towards your backside, lower slowly.',0,0,6);
INSERT INTO "exercise" VALUES(7,1,'F','Plank',2,'20s',60,'core',0,NULL,NULL,0,0,0,'Straight line head to heels. Squeeze your glutes so your hips don''t sag.',0,0,7);
INSERT INTO "exercise" VALUES(8,2,'A','Barbell Row',3,'5+',150,'upper',1,NULL,NULL,0,0,0,'Hinge forward with a flat back, pull the bar to your lower ribs, elbows close to your body.',0,0,1);
INSERT INTO "exercise" VALUES(9,2,'A','Bench Press',3,'5+',150,'upper',1,NULL,NULL,0,0,1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.',0,0,2);
INSERT INTO "exercise" VALUES(10,2,'A','Squats',3,'5+',150,'lower',1,NULL,NULL,0,0,1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.',0,0,3);
INSERT INTO "exercise" VALUES(11,2,'B','Chin-ups',3,'5+',150,'upper',0,NULL,NULL,0,0,0,'Palms facing you, hang with straight arms, pull until your chin clears the bar. Use the assisted machine or a band if you need to.',0,0,1);
INSERT INTO "exercise" VALUES(12,2,'B','Overhead Press',3,'5+',150,'upper',1,NULL,NULL,0,0,1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.',0,0,2);
INSERT INTO "exercise" VALUES(13,2,'B','Deadlift',3,'5+',180,'lower',1,NULL,NULL,0,0,1,'Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.',0,0,3);
INSERT INTO "exercise" VALUES(14,3,'A','Seated Rows',3,'5+',150,'upper',1,50.0,NULL,0,0,0,'Chest tall, pull the handle to your belly button, squeeze your shoulder blades together, control it back out.',0,0,1);
INSERT INTO "exercise" VALUES(15,3,'A','Bench Press',3,'5+',150,'upper',1,40.0,NULL,0,0,1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.',0,0,2);
INSERT INTO "exercise" VALUES(16,3,'A','Squats',3,'5+',150,'lower',1,20.0,NULL,0,0,1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.',0,0,3);
INSERT INTO "exercise" VALUES(17,3,'B','Lat Pulldowns',3,'5+',150,'upper',1,60.0,NULL,0,0,0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.',0,0,1);
INSERT INTO "exercise" VALUES(18,3,'B','Overhead Press',3,'5+',150,'upper',1,25.0,NULL,0,0,1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.',0,0,2);
INSERT INTO "exercise" VALUES(19,3,'B','Deadlift',1,'5',180,'lower',1,30.0,5.0,0,0,1,'Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.',0,0,3);
INSERT INTO "exercise" VALUES(20,3,'X','Face pulls',3,'12',90,'upper',1,12.5,NULL,0,0,0,'Rope at eye height. Pull towards your forehead, elbows high and wide. Light weight, slow.',0,0,1);
INSERT INTO "exercise" VALUES(21,3,'X','Supermans',4,'10s',60,'core',0,NULL,NULL,0,0,0,'Face down, lift your chest and thighs off the floor and hold.',0,0,2);
INSERT INTO "exercise" VALUES(22,3,'X','Farmer''s carry',3,'30s',90,'grip',1,50.0,NULL,0,1,0,'A heavy dumbbell in each hand. Stand tall, walk steady, don''t lean.',0,0,3);
INSERT INTO "exercise" VALUES(23,3,'X','Plate pinches',3,'8',90,'grip',1,5.0,NULL,0,1,0,'Pinch two plates smooth-side-out between thumb and fingers. Hold.',0,0,4);
INSERT INTO "exercise" VALUES(24,3,'X','Dead hang',1,'30s',90,'grip',0,NULL,NULL,0,1,0,'Hang from the bar, arms straight, shoulders pulled slightly down.',0,0,5);
INSERT INTO "exercise" VALUES(25,3,'Y','Curls',3,'10',90,'upper',1,NULL,NULL,0,0,0,'Elbows still, no swinging. Lower slower than you lift.',0,0,1);
INSERT INTO "exercise" VALUES(26,3,'Y','Calf raises',3,'12',60,'lower',1,NULL,NULL,0,0,0,'Full stretch at the bottom, pause at the top of every rep.',0,0,2);
INSERT INTO "exercise" VALUES(27,3,'Y','Plank',2,'30s',60,'core',0,NULL,NULL,0,1,0,'Straight line head to heels. Squeeze your glutes so your hips don''t sag.',0,0,3);
INSERT INTO "exercise" VALUES(28,3,'Y','Hanging leg raises',3,'12',60,'core',0,NULL,NULL,0,1,0,'Hang still, lift your legs without swinging. Bend the knees if it''s too hard.',0,0,4);
INSERT INTO "exercise" VALUES(29,3,'Y','Weighted crunches',3,'12',60,'core',1,NULL,NULL,0,1,0,'Weight on your chest, curl your ribs towards your hips. Don''t pull on your neck.',0,0,5);
INSERT INTO "exercise" VALUES(30,4,'A1','Squats',5,'3+',180,'lower',1,NULL,NULL,0,0,1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.',0,0,1);
INSERT INTO "exercise" VALUES(31,4,'A1','Bench Press',3,'10',120,'upper',1,NULL,NULL,0,0,1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.',0,0,2);
INSERT INTO "exercise" VALUES(32,4,'A1','Lat Pulldowns',3,'15+',90,'upper',1,NULL,NULL,0,0,0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.',0,0,3);
INSERT INTO "exercise" VALUES(33,4,'A2','Overhead Press',5,'3+',180,'upper',1,NULL,NULL,0,0,1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.',0,0,1);
INSERT INTO "exercise" VALUES(34,4,'A2','Deadlift',3,'10',150,'lower',1,NULL,NULL,0,0,1,'Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.',0,0,2);
INSERT INTO "exercise" VALUES(35,4,'A2','One-arm Dumbbell Row',3,'15+',90,'upper',1,NULL,NULL,0,0,0,'One knee and hand on a bench, flat back, pull the dumbbell to your hip.',0,0,3);
INSERT INTO "exercise" VALUES(36,4,'B1','Bench Press',5,'3+',180,'upper',1,NULL,NULL,0,0,1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.',0,0,1);
INSERT INTO "exercise" VALUES(37,4,'B1','Squats',3,'10',120,'lower',1,NULL,NULL,0,0,1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.',0,0,2);
INSERT INTO "exercise" VALUES(38,4,'B1','Lat Pulldowns',3,'15+',90,'upper',1,NULL,NULL,0,0,0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.',0,0,3);
INSERT INTO "exercise" VALUES(39,4,'B2','Deadlift',5,'3+',180,'lower',1,NULL,NULL,0,0,1,'Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.',0,0,1);
INSERT INTO "exercise" VALUES(40,4,'B2','Overhead Press',3,'10',120,'upper',1,NULL,NULL,0,0,1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.',0,0,2);
INSERT INTO "exercise" VALUES(41,4,'B2','One-arm Dumbbell Row',3,'15+',90,'upper',1,NULL,NULL,0,0,0,'One knee and hand on a bench, flat back, pull the dumbbell to your hip.',0,0,3);
INSERT INTO "exercise" VALUES(42,5,'D','Goblet Squat',3,'10',90,'lower',1,NULL,NULL,0,0,0,'Hold one dumbbell at your chest. Sit down between your hips, elbows inside your knees.',0,0,1);
INSERT INTO "exercise" VALUES(43,5,'D','Dumbbell Bench Press',3,'10',90,'upper',1,NULL,NULL,0,0,0,'Dumbbells at chest height, press up until they nearly touch. Keep your wrists straight.',0,0,2);
INSERT INTO "exercise" VALUES(44,5,'D','One-arm Dumbbell Row',3,'10',90,'upper',1,NULL,NULL,0,0,0,'One knee and hand on a bench, flat back, pull the dumbbell to your hip.',0,0,3);
INSERT INTO "exercise" VALUES(45,5,'D','Dumbbell Romanian Deadlift',3,'10',90,'lower',1,NULL,NULL,0,0,0,'Soft knees, hinge at the hips, dumbbells sliding down your thighs, flat back.',0,0,4);
INSERT INTO "exercise" VALUES(46,5,'D','Dumbbell Shoulder Press',3,'10',90,'upper',1,NULL,NULL,0,0,0,'Dumbbells at shoulder height, press overhead without arching your lower back.',0,0,5);
INSERT INTO "exercise" VALUES(47,5,'D','Plank',3,'30s',60,'core',0,NULL,NULL,0,0,0,'Straight line head to heels. Squeeze your glutes so your hips don''t sag.',0,0,6);
INSERT INTO "exercise" VALUES(48,6,'U','Bench Press',4,'6',150,'upper',1,NULL,NULL,0,0,1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.',0,0,1);
INSERT INTO "exercise" VALUES(49,6,'U','Barbell Row',4,'8',150,'upper',1,NULL,NULL,0,0,0,'Hinge forward with a flat back, pull the bar to your lower ribs, elbows close to your body.',0,0,2);
INSERT INTO "exercise" VALUES(50,6,'U','Overhead Press',3,'8',120,'upper',1,NULL,NULL,0,0,1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.',0,0,3);
INSERT INTO "exercise" VALUES(51,6,'U','Lat Pulldowns',3,'10',90,'upper',1,NULL,NULL,0,0,0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.',0,0,4);
INSERT INTO "exercise" VALUES(52,6,'U','Curls',3,'12',60,'upper',1,NULL,NULL,0,0,0,'Elbows still, no swinging. Lower slower than you lift.',0,0,5);
INSERT INTO "exercise" VALUES(53,6,'U','Tricep pushdown',3,'12',60,'upper',1,NULL,NULL,0,0,0,'Elbows pinned to your sides. Straighten the arms, control the way back.',0,0,6);
INSERT INTO "exercise" VALUES(54,6,'L','Squats',4,'6',180,'lower',1,NULL,NULL,0,0,1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees over your toes. Go as deep as you can keep a flat back.',0,0,1);
INSERT INTO "exercise" VALUES(55,6,'L','Romanian Deadlift',3,'8',150,'lower',1,NULL,NULL,0,0,1,'Soft knees, push your hips back and slide the bar down your thighs. Stop when you feel the stretch behind your knees.',0,0,2);
INSERT INTO "exercise" VALUES(56,6,'L','Leg Press',3,'10',120,'lower',1,NULL,NULL,0,0,0,'Feet shoulder-width on the platform, lower until your knees are near 90 degrees. Never lock your knees hard at the top.',0,0,3);
INSERT INTO "exercise" VALUES(57,6,'L','Leg Curl',3,'12',90,'lower',1,NULL,NULL,0,0,0,'Pad just above your heels. Curl towards your backside, lower slowly.',0,0,4);
INSERT INTO "exercise" VALUES(58,6,'L','Calf raises',4,'12',60,'lower',1,NULL,NULL,0,0,0,'Full stretch at the bottom, pause at the top of every rep.',0,0,5);
CREATE TABLE exercise_library (
    slug TEXT PRIMARY KEY, name TEXT NOT NULL, pattern TEXT NOT NULL,
    muscles TEXT NOT NULL, equipment TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('core','accessory')),
    area TEXT NOT NULL, is_barbell INTEGER DEFAULT 0, cue TEXT
);
INSERT INTO "exercise_library" VALUES('back-squat','Back Squat','squat','quads,glutes,core','barbell','core','lower',1,'Bar on your upper back, feet shoulder-width. Sit down between your hips, knees tracking over your toes. Go as deep as you can keep a flat back.');
INSERT INTO "exercise_library" VALUES('goblet-squat','Goblet Squat','squat','quads,glutes,core','dumbbell','core','lower',0,'Hold one dumbbell at your chest. Sit down between your hips, elbows inside your knees, chest tall.');
INSERT INTO "exercise_library" VALUES('leg-press','Leg Press','squat','quads,glutes','machine','core','lower',0,'Feet shoulder-width on the platform. Lower until your knees are near 90 degrees. Never slam your knees straight at the top.');
INSERT INTO "exercise_library" VALUES('hack-squat','Hack Squat Machine','squat','quads,glutes','machine','core','lower',0,'Shoulders under the pads, feet mid-platform. Lower slowly, push through the whole foot.');
INSERT INTO "exercise_library" VALUES('split-squat','Bulgarian Split Squat','squat','quads,glutes','dumbbell','accessory','lower',0,'Back foot on a bench, drop straight down, front knee tracking over the foot. Hold the rail if you wobble.');
INSERT INTO "exercise_library" VALUES('walking-lunge','Walking Lunge','squat','quads,glutes','dumbbell','accessory','lower',0,'Long step forward, back knee towards the floor, stand up through the front heel.');
INSERT INTO "exercise_library" VALUES('deadlift','Deadlift','hinge','hamstrings,glutes,back','barbell','core','lower',1,'Bar over mid-foot, shins close, flat back, chest up. Push the floor away instead of yanking. Stop the set the moment your back rounds.');
INSERT INTO "exercise_library" VALUES('romanian-deadlift','Romanian Deadlift','hinge','hamstrings,glutes','barbell','core','lower',1,'Soft knees, push your hips back and slide the bar down your thighs. Stop when you feel the stretch behind your knees.');
INSERT INTO "exercise_library" VALUES('db-rdl','Dumbbell Romanian Deadlift','hinge','hamstrings,glutes','dumbbell','core','lower',0,'Soft knees, hinge at the hips, dumbbells sliding down your thighs, back flat throughout.');
INSERT INTO "exercise_library" VALUES('hip-thrust','Hip Thrust','hinge','glutes,hamstrings','barbell','core','lower',1,'Shoulders on a bench, bar padded across the hips. Drive through your heels, squeeze at the top, keep your ribs down.');
INSERT INTO "exercise_library" VALUES('hip-thrust-m','Hip Thrust Machine','hinge','glutes,hamstrings','machine','core','lower',0,'Back against the pad, belt or bar across your hips. Drive through your heels, squeeze at the top, ribs down.');
INSERT INTO "exercise_library" VALUES('single-leg-rdl','Single-leg Romanian Deadlift','hinge','hamstrings,glutes','dumbbell','accessory','lower',0,'Stand on one leg, hinge forward reaching the dumbbell towards the floor, back flat. Hold something for balance.');
INSERT INTO "exercise_library" VALUES('glute-bridge','Glute Bridge','hinge','glutes,hamstrings','bodyweight','accessory','lower',0,'On your back, feet flat and close to your backside. Drive the hips up, squeeze, lower slowly.');
INSERT INTO "exercise_library" VALUES('back-extension','Back Extension','hinge','hamstrings,glutes,back','machine','accessory','lower',0,'Pads at your hips, fold forward with a flat back, squeeze your glutes to come up. No swinging.');
INSERT INTO "exercise_library" VALUES('leg-curl','Leg Curl','hinge','hamstrings','machine','accessory','lower',0,'Pad just above your heels. Curl towards your backside, lower slowly.');
INSERT INTO "exercise_library" VALUES('glute-bridge-m','Glute Machine','hinge','glutes','machine','accessory','lower',0,'Feet flat, drive the hips up, pause at the top, lower under control.');
INSERT INTO "exercise_library" VALUES('bench-press','Bench Press','hpush','chest,triceps,shoulders','barbell','core','upper',1,'Shoulder blades pinched back, feet flat. Bar to mid-chest, elbows about 45 degrees from your body. Use the rack safeties or ask for a spot.');
INSERT INTO "exercise_library" VALUES('db-bench','Dumbbell Bench Press','hpush','chest,triceps,shoulders','dumbbell','core','upper',0,'Dumbbells at chest height, press up until they nearly touch. Keep your wrists straight over your elbows.');
INSERT INTO "exercise_library" VALUES('chest-press-m','Chest Press Machine','hpush','chest,triceps','machine','core','upper',0,'Set the seat so the handles sit at chest height. Press out smoothly, don''t snap your elbows straight.');
INSERT INTO "exercise_library" VALUES('incline-db','Incline Dumbbell Press','hpush','chest,shoulders','dumbbell','accessory','upper',0,'Bench at about 30 degrees. Press up and slightly together, control the way down.');
INSERT INTO "exercise_library" VALUES('db-fly','Dumbbell Fly','hpush','chest','dumbbell','accessory','upper',0,'Lie back, soft elbows, open your arms wide then bring them together above your chest.');
INSERT INTO "exercise_library" VALUES('push-up','Push-ups','hpush','chest,triceps,core','bodyweight','accessory','upper',0,'Hands under your shoulders, body in a straight line. Hands on a bench makes it easier.');
INSERT INTO "exercise_library" VALUES('cable-fly','Cable Fly','hpush','chest','cable','accessory','upper',0,'Soft elbows, bring the handles together in front of your chest like you''re hugging someone.');
INSERT INTO "exercise_library" VALUES('ohp','Overhead Press','vpush','shoulders,triceps','barbell','core','upper',1,'Bar at collarbone height, stomach tight. Press up and slightly back so it finishes over your ears.');
INSERT INTO "exercise_library" VALUES('db-shoulder-press','Dumbbell Shoulder Press','vpush','shoulders,triceps','dumbbell','core','upper',0,'Dumbbells at shoulder height, press overhead without arching your lower back.');
INSERT INTO "exercise_library" VALUES('shoulder-press-m','Shoulder Press Machine','vpush','shoulders,triceps','machine','core','upper',0,'Seat height so the handles start at shoulder level. Press up without shrugging.');
INSERT INTO "exercise_library" VALUES('lateral-raise','Lateral Raise','vpush','shoulders','dumbbell','accessory','upper',0,'Light dumbbells, lift out to the sides to shoulder height with a slight bend in the elbows.');
INSERT INTO "exercise_library" VALUES('barbell-row','Barbell Row','hpull','back,biceps','barbell','core','upper',1,'Hinge forward with a flat back, pull the bar to your lower ribs, elbows close to your body.');
INSERT INTO "exercise_library" VALUES('db-row','One-arm Dumbbell Row','hpull','back,biceps','dumbbell','core','upper',0,'One knee and hand on a bench, flat back, pull the dumbbell to your hip.');
INSERT INTO "exercise_library" VALUES('seated-row-m','Seated Row Machine','hpull','back,biceps','machine','core','upper',0,'Chest against the pad, pull the handles to your ribs, squeeze your shoulder blades together.');
INSERT INTO "exercise_library" VALUES('cable-row','Cable Row','hpull','back,biceps','cable','core','upper',0,'Sit tall, pull to your belly button, shoulders back, control the return.');
INSERT INTO "exercise_library" VALUES('face-pull','Face Pull','hpull','shoulders,back','cable','accessory','upper',0,'Rope at eye height. Pull towards your forehead with elbows high and wide. Light weight, slow.');
INSERT INTO "exercise_library" VALUES('rear-delt-fly','Rear Delt Fly','hpull','shoulders,back','dumbbell','accessory','upper',0,'Hinge forward, light dumbbells, open your arms out to the sides like wings.');
INSERT INTO "exercise_library" VALUES('shrug','Shrug','hpull','back','dumbbell','accessory','upper',0,'Lift your shoulders straight up towards your ears, pause, lower slowly. No rolling.');
INSERT INTO "exercise_library" VALUES('lat-pulldown','Lat Pulldown','vpull','back,biceps','machine','core','upper',0,'Thighs under the pad. Pull the bar to your collarbone leading with the elbows. No swinging.');
INSERT INTO "exercise_library" VALUES('chin-up','Chin-ups','vpull','back,biceps','bodyweight','core','upper',0,'Palms facing you, hang with straight arms, pull until your chin clears the bar. The assisted machine or a band is fine.');
INSERT INTO "exercise_library" VALUES('straight-arm-pd','Straight-arm Pulldown','vpull','back','cable','accessory','upper',0,'Arms nearly straight, sweep the bar down to your thighs using your back, not your arms.');
INSERT INTO "exercise_library" VALUES('curl','Dumbbell Curl','arms','biceps','dumbbell','accessory','upper',0,'Elbows still at your sides, no swinging. Lower slower than you lift.');
INSERT INTO "exercise_library" VALUES('hammer-curl','Hammer Curl','arms','biceps','dumbbell','accessory','upper',0,'Palms facing each other the whole way. Elbows pinned to your sides.');
INSERT INTO "exercise_library" VALUES('tricep-pushdown','Tricep Pushdown','arms','triceps','cable','accessory','upper',0,'Elbows pinned to your sides. Straighten the arms fully, control the way back.');
INSERT INTO "exercise_library" VALUES('overhead-tricep','Overhead Tricep Extension','arms','triceps','dumbbell','accessory','upper',0,'One dumbbell behind your head, elbows pointing up, straighten the arms.');
INSERT INTO "exercise_library" VALUES('calf-raise','Calf Raise','calves','calves','machine','accessory','lower',0,'Full stretch at the bottom, pause for a second at the top of every rep.');
INSERT INTO "exercise_library" VALUES('standing-calf','Standing Calf Raise','calves','calves','dumbbell','accessory','lower',0,'Balls of your feet on a step, heels down for a stretch, up onto your toes and hold.');
INSERT INTO "exercise_library" VALUES('leg-extension','Leg Extension','squat','quads','machine','accessory','lower',0,'Pad above your ankles. Straighten the legs, pause a beat, lower under control.');
INSERT INTO "exercise_library" VALUES('plank','Plank','core','core','bodyweight','accessory','core',0,'Straight line from head to heels. Squeeze your glutes so your hips don''t sag.');
INSERT INTO "exercise_library" VALUES('hanging-leg-raise','Hanging Leg Raise','core','core','bodyweight','accessory','core',0,'Hang still, then lift your legs without swinging. Bend the knees if straight legs are too hard.');
INSERT INTO "exercise_library" VALUES('cable-crunch','Cable Crunch','core','core','cable','accessory','core',0,'Kneel facing the machine, rope by your head, curl your ribs down towards your hips.');
INSERT INTO "exercise_library" VALUES('dead-bug','Dead Bug','core','core','bodyweight','accessory','core',0,'On your back, lower opposite arm and leg slowly while keeping your lower back flat on the floor.');
INSERT INTO "exercise_library" VALUES('pallof-press','Pallof Press','core','core','cable','accessory','core',0,'Stand side-on to the cable, press the handle straight out and resist the twist.');
INSERT INTO "exercise_library" VALUES('ab-machine','Ab Machine','core','core','machine','accessory','core',0,'Set the seat, curl your ribs down towards your hips, control the return.');
INSERT INTO "exercise_library" VALUES('farmer-carry','Farmer''s Carry','core','core,back','dumbbell','accessory','core',0,'A heavy dumbbell in each hand. Stand tall, shoulders down, walk steady without leaning.');
INSERT INTO "exercise_library" VALUES('front-squat','Front Squat','squat','quads,core','barbell','core','lower',1,'Bar across the front of your shoulders, elbows high. Sit straight down, chest up.');
INSERT INTO "exercise_library" VALUES('box-squat','Box Squat','squat','quads,glutes','barbell','core','lower',1,'Sit back onto a box at about parallel, pause, then drive up. Good for learning depth.');
INSERT INTO "exercise_library" VALUES('step-up','Step-up','squat','quads,glutes','dumbbell','accessory','lower',0,'Whole foot on the bench, drive through that heel, control the way down.');
INSERT INTO "exercise_library" VALUES('sissy-squat','Sissy Squat','squat','quads','bodyweight','accessory','lower',0,'Hold a rail, lean back and bend the knees forward. Slow, small range at first.');
INSERT INTO "exercise_library" VALUES('trap-bar-deadlift','Trap Bar Deadlift','hinge','hamstrings,glutes,quads','barbell','core','lower',1,'Stand inside the frame, handles at your sides. Easier on the lower back than a straight bar.');
INSERT INTO "exercise_library" VALUES('sumo-deadlift','Sumo Deadlift','hinge','glutes,hamstrings','barbell','core','lower',1,'Wide stance, hands inside your knees. Push the floor apart as you stand.');
INSERT INTO "exercise_library" VALUES('good-morning','Good Morning','hinge','hamstrings,glutes','barbell','accessory','lower',1,'Light bar on your back, hinge forward with soft knees and a flat back. Start very light.');
INSERT INTO "exercise_library" VALUES('kettlebell-swing','Kettlebell Swing','hinge','glutes,hamstrings','dumbbell','accessory','lower',0,'Hinge, not squat. Snap the hips through and let the bell float — arms stay relaxed.');
INSERT INTO "exercise_library" VALUES('incline-bench','Incline Bench Press','hpush','chest,shoulders','barbell','core','upper',1,'Bench at about 30 degrees. Bar to the top of your chest, elbows tucked slightly.');
INSERT INTO "exercise_library" VALUES('close-grip-bench','Close-grip Bench Press','hpush','triceps,chest','barbell','core','upper',1,'Hands about shoulder width. Elbows close to your sides the whole way.');
INSERT INTO "exercise_library" VALUES('dip','Dips','hpush','chest,triceps','bodyweight','accessory','upper',0,'Lean forward slightly for chest, upright for triceps. Use the assisted machine if you need to.');
INSERT INTO "exercise_library" VALUES('machine-fly','Pec Deck','hpush','chest','machine','accessory','upper',0,'Elbows at chest height on the pads. Squeeze the handles together, control the way back.');
INSERT INTO "exercise_library" VALUES('arnold-press','Arnold Press','vpush','shoulders','dumbbell','accessory','upper',0,'Start with palms facing you, rotate outwards as you press overhead.');
INSERT INTO "exercise_library" VALUES('push-press','Push Press','vpush','shoulders,triceps','barbell','core','upper',1,'A small dip of the knees, then drive the bar overhead. Lets you handle more than a strict press.');
INSERT INTO "exercise_library" VALUES('cable-lateral','Cable Lateral Raise','vpush','shoulders','cable','accessory','upper',0,'Cable at the bottom, lift out to the side to shoulder height, slow on the way down.');
INSERT INTO "exercise_library" VALUES('chest-supported-row','Chest-supported Row','hpull','back,biceps','machine','core','upper',0,'Chest on the pad so you cannot cheat with your lower back. Pull to your ribs.');
INSERT INTO "exercise_library" VALUES('t-bar-row','T-bar Row','hpull','back,biceps','barbell','core','upper',1,'Hinge over the bar, flat back, pull the handles to your stomach.');
INSERT INTO "exercise_library" VALUES('inverted-row','Inverted Row','hpull','back,biceps','bodyweight','accessory','upper',0,'Bar at hip height, body straight, pull your chest to the bar. Bend your knees to make it easier.');
INSERT INTO "exercise_library" VALUES('neutral-pulldown','Neutral-grip Pulldown','vpull','back,biceps','machine','core','upper',0,'Palms facing each other. Easier on the shoulders than a wide grip.');
INSERT INTO "exercise_library" VALUES('pull-up','Pull-ups','vpull','back','bodyweight','core','upper',0,'Palms facing away, hang with straight arms, pull until your chin clears the bar.');
INSERT INTO "exercise_library" VALUES('preacher-curl','Preacher Curl','arms','biceps','dumbbell','accessory','upper',0,'Arms flat on the pad. No swinging is even possible, which is the point.');
INSERT INTO "exercise_library" VALUES('cable-curl','Cable Curl','arms','biceps','cable','accessory','upper',0,'Constant tension the whole way. Elbows stay at your sides.');
INSERT INTO "exercise_library" VALUES('skullcrusher','Skullcrusher','arms','triceps','barbell','accessory','upper',0,'Lying down, lower the bar to your forehead by bending only at the elbow.');
INSERT INTO "exercise_library" VALUES('dip-machine','Tricep Dip Machine','arms','triceps','machine','accessory','upper',0,'Seat set so the handles are at chest height. Press down, elbows close.');
INSERT INTO "exercise_library" VALUES('seated-calf','Seated Calf Raise','calves','calves','machine','accessory','lower',0,'Knees bent under the pad. Full stretch down, pause at the top.');
INSERT INTO "exercise_library" VALUES('ab-wheel','Ab Wheel','core','core','bodyweight','accessory','core',0,'From your knees, roll out only as far as you can keep your back flat. Very short range at first.');
INSERT INTO "exercise_library" VALUES('side-plank','Side Plank','core','core','bodyweight','accessory','core',0,'On one forearm, hips stacked and lifted. Hold, then swap sides.');
INSERT INTO "exercise_library" VALUES('russian-twist','Russian Twist','core','core','dumbbell','accessory','core',0,'Sit leaning back, feet up if you can, rotate the weight side to side under control.');
INSERT INTO "exercise_library" VALUES('hip-abduction','Hip Abduction Machine','hinge','glutes','machine','accessory','lower',0,'Sit tall, push your knees apart against the pads, pause, return slowly.');
INSERT INTO "exercise_library" VALUES('glute-kickback','Glute Kickback','hinge','glutes','machine','accessory','lower',0,'Hips square, drive one leg back and up, squeeze at the top. No arching your lower back.');
INSERT INTO "exercise_library" VALUES('kb-swing','Kettlebell Swing','hinge','glutes,hamstrings','dumbbell','accessory','lower',0,'Hinge at the hips, snap them forward. The arms just hold on — it is not a lift with the shoulders.');
INSERT INTO "exercise_library" VALUES('machine-lateral','Lateral Raise Machine','vpush','shoulders','machine','accessory','upper',0,'Pads on the outside of your arms, lift out to shoulder height, lower slowly.');
INSERT INTO "exercise_library" VALUES('assisted-pullup','Assisted Pull-up Machine','vpull','back,biceps','machine','core','upper',0,'Kneel on the pad, hang with straight arms, pull until your chin clears the bar. More assistance is a lighter pull.');
INSERT INTO "exercise_library" VALUES('reverse-crunch','Reverse Crunch','core','core','bodyweight','accessory','core',0,'On your back, knees bent, curl your hips off the floor towards your chest. Slow, not swung.');
INSERT INTO "exercise_library" VALUES('suitcase-carry','Suitcase Carry','core','core','dumbbell','accessory','core',0,'One heavy dumbbell in one hand. Walk tall without leaning away from it.');
CREATE TABLE mobility (id INTEGER PRIMARY KEY, phase TEXT, name TEXT, prescription TEXT, position INTEGER);
INSERT INTO "mobility" VALUES(1,'pre','Light cardio','3–5 min',1);
INSERT INTO "mobility" VALUES(2,'pre','Arm circles, cross-directional','5 each way',2);
INSERT INTO "mobility" VALUES(3,'pre','Arm circles, same direction','5 each way',3);
INSERT INTO "mobility" VALUES(4,'pre','Leg swings, front-back','5 each leg',4);
INSERT INTO "mobility" VALUES(5,'pre','Leg swings, side-side','5 each leg',5);
INSERT INTO "mobility" VALUES(6,'pre','Lunge + rotation','1 each side',6);
INSERT INTO "mobility" VALUES(7,'pre','Glute bridges','10–15',7);
INSERT INTO "mobility" VALUES(8,'pre','Ankle circles','10 each way',8);
INSERT INTO "mobility" VALUES(9,'post','Standing quad stretch','30s each leg',1);
INSERT INTO "mobility" VALUES(10,'post','Hamstring stretch','30s each way',2);
INSERT INTO "mobility" VALUES(11,'post','Butterfly stretch','30s',3);
INSERT INTO "mobility" VALUES(12,'post','IT band stretch','30s each way',4);
INSERT INTO "mobility" VALUES(13,'post','Wall calf stretch','30s each side',5);
INSERT INTO "mobility" VALUES(14,'post','World''s greatest stretch','20s each way',6);
INSERT INTO "mobility" VALUES(15,'post','Cobra pose','30s',7);
INSERT INTO "mobility" VALUES(16,'post','Downward dog','30s',8);
INSERT INTO "mobility" VALUES(17,'post','Child''s pose','45s',9);
CREATE TABLE profile (
    id INTEGER PRIMARY KEY CHECK (id=1),
    name TEXT NOT NULL, units TEXT DEFAULT 'kg', bar_weight REAL DEFAULT 20,
    guided INTEGER DEFAULT 1, advanced INTEGER DEFAULT 0, theme TEXT DEFAULT 'auto',
    active_program INTEGER
);
INSERT INTO "profile" VALUES(1,'Brodie Shaw','kg',20.0,1,0,'auto',3);
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
INSERT INTO "program" VALUES(1,'First time in a gym',1,'One full-body session you repeat three times a week, all on machines. Machines hold the movement for you, so there is much less to get wrong while you learn.','You have never lifted, or it has been long enough that it feels that way.',3,'machines','new','Built on the ACSM guidance of 8–10 full-body exercises for new lifters, in the shape gyms like Gold''s teach it.','Leave a day between sessions. Add weight only when the last set feels easy.','2026-09-08');
INSERT INTO "program" VALUES(2,'r/Fitness Basic Beginner Routine',1,'Two alternating barbell sessions, three days a week: A, B, A one week and B, A, B the next. Five movements total, so you can learn them properly.','New to barbells and happy to use a squat rack.',3,'barbell','new','The r/Fitness wiki''s primary recommended beginner routine.','Run this for three months at most, then move up to something with more volume. Add 1.25 kg to upper-body lifts and 2.5 kg to lower-body lifts each time you do them; over ten reps on the last set, double it. If you cannot get fifteen reps across the three sets, drop the weight 10 percent next time.','2026-09-08');
INSERT INTO "program" VALUES(3,'Gym Phase 1',1,'Two main lifting days plus two light days for grip, core and arms, with cardio built in. More work than a bare beginner routine without being overwhelming.','You have a few weeks behind you and want more than three sessions.',5,'any','returning','Your own program, tidied up.','Main lifts alternate A, B, A. Light day X always follows A and Y always follows B.','2026-09-08');
INSERT INTO "program" VALUES(4,'GZCLP',1,'Four rotating sessions, three a week. Each one has a heavy lift, a lighter version of another lift, and an accessory — so you get far more volume than a plain beginner routine.','You have finished a beginner routine and want the next step up.',3,'barbell','experienced','Cody Lefever''s GZCLP, the routine the r/Fitness wiki names as the usual step after the beginner program.','Heavy lift: five sets of three, last set as many as you can. Middle lift: three sets of ten. Accessory: three sets of fifteen, last set as many as you can — add weight there once you pass twenty-five.','2026-09-08');
INSERT INTO "program" VALUES(5,'Dumbbells only',1,'A full-body session with nothing but a pair of dumbbells and a bench. Works at home or in a busy gym where the racks are always taken.','No barbell, or you would rather not use one yet.',3,'dumbbell','new','A standard full-body dumbbell template, same movement patterns as the barbell routines.','Repeat the same session two or three times a week with a rest day between.','2026-09-08');
INSERT INTO "program" VALUES(6,'Upper and lower, four days',1,'Two upper-body days and two lower-body days a week. More exercises per session and more room for the bits you want to bring up.','You have trained consistently for a while and want four sessions.',4,'any','experienced','The standard four-day upper/lower split recommended for intermediates.','Upper, lower, rest, upper, lower, rest, rest works well.','2026-09-08');
CREATE TABLE progression_rule (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    min_reps INTEGER, max_reps INTEGER, upper_add REAL, lower_add REAL, label TEXT
);
INSERT INTO "progression_rule" VALUES(1,1,0,2,1.25,2.5,'You hit the target');
INSERT INTO "progression_rule" VALUES(2,1,3,5,2.5,5.0,'A few reps clear');
INSERT INTO "progression_rule" VALUES(3,1,6,99,5.0,10.0,'Well clear — bigger jump');
INSERT INTO "progression_rule" VALUES(4,2,0,2,1.25,2.5,'Standard r/Fitness jump');
INSERT INTO "progression_rule" VALUES(5,2,3,5,2.5,5.0,'Well clear — double it');
INSERT INTO "progression_rule" VALUES(6,2,6,99,5.0,10.0,'Far clear of the target');
INSERT INTO "progression_rule" VALUES(7,3,0,2,2.5,5.0,'You hit the target');
INSERT INTO "progression_rule" VALUES(8,3,3,5,5.0,10.0,'A few reps clear');
INSERT INTO "progression_rule" VALUES(9,3,6,99,7.5,15.0,'Well clear — bigger jump');
INSERT INTO "progression_rule" VALUES(10,4,0,2,2.5,5.0,'You hit the target');
INSERT INTO "progression_rule" VALUES(11,4,3,5,5.0,10.0,'A few reps clear');
INSERT INTO "progression_rule" VALUES(12,4,6,99,7.5,15.0,'Well clear — bigger jump');
INSERT INTO "progression_rule" VALUES(13,5,0,2,1.25,2.5,'You hit the target');
INSERT INTO "progression_rule" VALUES(14,5,3,5,2.5,5.0,'A few reps clear');
INSERT INTO "progression_rule" VALUES(15,5,6,99,5.0,10.0,'Well clear — bigger jump');
INSERT INTO "progression_rule" VALUES(16,6,0,2,2.5,5.0,'You hit the target');
INSERT INTO "progression_rule" VALUES(17,6,3,5,5.0,10.0,'A few reps clear');
INSERT INTO "progression_rule" VALUES(18,6,6,99,7.5,15.0,'Well clear — bigger jump');
CREATE TABLE schedule (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    day TEXT NOT NULL, slot TEXT NOT NULL, cardio TEXT, position INTEGER
);
INSERT INTO "schedule" VALUES(1,1,'Monday','main','',1);
INSERT INTO "schedule" VALUES(2,1,'Tuesday','rest','Easy cardio',2);
INSERT INTO "schedule" VALUES(3,1,'Wednesday','main','',3);
INSERT INTO "schedule" VALUES(4,1,'Thursday','rest','',4);
INSERT INTO "schedule" VALUES(5,1,'Friday','main','',5);
INSERT INTO "schedule" VALUES(6,1,'Saturday','rest','Intervals',6);
INSERT INTO "schedule" VALUES(7,1,'Sunday','rest','',7);
INSERT INTO "schedule" VALUES(8,2,'Monday','main','',1);
INSERT INTO "schedule" VALUES(9,2,'Tuesday','rest','Easy cardio',2);
INSERT INTO "schedule" VALUES(10,2,'Wednesday','main','',3);
INSERT INTO "schedule" VALUES(11,2,'Thursday','rest','',4);
INSERT INTO "schedule" VALUES(12,2,'Friday','main','',5);
INSERT INTO "schedule" VALUES(13,2,'Saturday','rest','Intervals',6);
INSERT INTO "schedule" VALUES(14,2,'Sunday','rest','',7);
INSERT INTO "schedule" VALUES(15,3,'Monday','light','',1);
INSERT INTO "schedule" VALUES(16,3,'Tuesday','rest','Easy cardio',2);
INSERT INTO "schedule" VALUES(17,3,'Wednesday','main','',3);
INSERT INTO "schedule" VALUES(18,3,'Thursday','rest','',4);
INSERT INTO "schedule" VALUES(19,3,'Friday','main','',5);
INSERT INTO "schedule" VALUES(20,3,'Saturday','light','Intervals',6);
INSERT INTO "schedule" VALUES(21,3,'Sunday','main','',7);
INSERT INTO "schedule" VALUES(22,4,'Monday','main','',1);
INSERT INTO "schedule" VALUES(23,4,'Tuesday','rest','Easy cardio',2);
INSERT INTO "schedule" VALUES(24,4,'Wednesday','main','',3);
INSERT INTO "schedule" VALUES(25,4,'Thursday','rest','',4);
INSERT INTO "schedule" VALUES(26,4,'Friday','main','',5);
INSERT INTO "schedule" VALUES(27,4,'Saturday','rest','Intervals',6);
INSERT INTO "schedule" VALUES(28,4,'Sunday','rest','',7);
INSERT INTO "schedule" VALUES(29,5,'Monday','main','',1);
INSERT INTO "schedule" VALUES(30,5,'Tuesday','rest','Easy cardio',2);
INSERT INTO "schedule" VALUES(31,5,'Wednesday','main','',3);
INSERT INTO "schedule" VALUES(32,5,'Thursday','rest','',4);
INSERT INTO "schedule" VALUES(33,5,'Friday','rest','',5);
INSERT INTO "schedule" VALUES(34,5,'Saturday','main','Intervals',6);
INSERT INTO "schedule" VALUES(35,5,'Sunday','rest','',7);
INSERT INTO "schedule" VALUES(36,6,'Monday','main','',1);
INSERT INTO "schedule" VALUES(37,6,'Tuesday','main','Easy cardio',2);
INSERT INTO "schedule" VALUES(38,6,'Wednesday','rest','',3);
INSERT INTO "schedule" VALUES(39,6,'Thursday','main','',4);
INSERT INTO "schedule" VALUES(40,6,'Friday','main','',5);
INSERT INTO "schedule" VALUES(41,6,'Saturday','rest','Intervals',6);
INSERT INTO "schedule" VALUES(42,6,'Sunday','rest','',7);
CREATE TABLE session (
    id INTEGER PRIMARY KEY, program_id INTEGER, workout_code TEXT,
    performed_on TEXT NOT NULL, notes TEXT
);
CREATE TABLE set_log (
    id INTEGER PRIMARY KEY, session_id INTEGER REFERENCES session(id) ON DELETE CASCADE,
    exercise_id INTEGER, set_number INTEGER, weight REAL, reps INTEGER
);
CREATE TABLE workout (
    id INTEGER PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    code TEXT NOT NULL, name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('main','light')),
    follows TEXT, colour TEXT, position INTEGER NOT NULL
);
INSERT INTO "workout" VALUES(1,1,'F','Full body','main',NULL,'#2C7A4E',1);
INSERT INTO "workout" VALUES(2,2,'A','Row · Bench · Squat','main',NULL,'#B7242B',1);
INSERT INTO "workout" VALUES(3,2,'B','Pull · Press · Deadlift','main',NULL,'#1C4E86',2);
INSERT INTO "workout" VALUES(4,3,'A','Row · Bench · Squat','main',NULL,'#B7242B',1);
INSERT INTO "workout" VALUES(5,3,'B','Pulldown · Press · Deadlift','main',NULL,'#1C4E86',2);
INSERT INTO "workout" VALUES(6,3,'X','Grip and posterior','light','A','#2C7A4E',3);
INSERT INTO "workout" VALUES(7,3,'Y','Arms and core','light','B','#B58200',4);
INSERT INTO "workout" VALUES(8,4,'A1','Heavy squat','main',NULL,'#B7242B',1);
INSERT INTO "workout" VALUES(9,4,'A2','Heavy press','main',NULL,'#1C4E86',2);
INSERT INTO "workout" VALUES(10,4,'B1','Heavy bench','main',NULL,'#6B3FA0',3);
INSERT INTO "workout" VALUES(11,4,'B2','Heavy deadlift','main',NULL,'#0F6E78',4);
INSERT INTO "workout" VALUES(12,5,'D','Full body','main',NULL,'#B58200',1);
INSERT INTO "workout" VALUES(13,6,'U','Upper body','main',NULL,'#1C4E86',1);
INSERT INTO "workout" VALUES(14,6,'L','Lower body','main',NULL,'#B7242B',2);
CREATE VIEW routine_overview AS
SELECT p.name AS routine, w.code, w.name AS workout, e.position, e.name AS exercise,
       e.sets, e.rep_scheme, e.current_weight
FROM exercise e JOIN workout w ON w.program_id=e.program_id AND w.code=e.workout_code
JOIN program p ON p.id=e.program_id
ORDER BY p.id, w.position, e.position;
COMMIT;
