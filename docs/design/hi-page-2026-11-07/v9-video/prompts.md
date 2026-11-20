# v9-video prompts (16 Nov 2026)

Model gpt26-sunburst. Paths relative to the brief folder. References: refs/neil-portrait.png (studio, front), refs/neil-profile.png (side profile, café), refs/neil-front-selfie.jpg, refs/neil-back.jpg (frame at 4 s of refs/src/neil-walk.mp4, back view). Sources Neil supplied 16 Nov 2026 are in refs/src/.

## character-sheet

Character reference sheet of one real man, photorealistic, consistent identity across every view, made from the reference photos (same man in all of them). Plain warm light-grey studio background, soft even daylight, no text, no labels, no logos. Five full-body views in one row, evenly spaced, same scale: 1) straight back view, 2) three-quarter back view from his left, 3) three-quarter back view from his right, 4) rear side profile (seen from behind and to the side, only the edge of his cheek, beard line and ear visible), 5) back view holding a white cappuccino cup raised toward his mouth, head tilted slightly, seen from behind at an angle. His face is never shown from the front in any view. Match him exactly: early 30s, about 180 cm, athletic muscular build with broad shoulders and defined arms, light olive skin, thick dark brown almost black curly hair, shorter at the sides and back with a natural neckline, short dark stubble beard visible along the jaw from behind. Outfit for every view: plain white crew-neck t-shirt, beige chino shorts, black round smartwatch on his left wrist, white minimal sneakers.

- 2026-11-16 character-sheet-1.png: $0.1646 measured (inputs: neil-portrait, neil-profile, neil-back, neil-front-selfie)

## character-sheet-2

Inputs: character-sheet-1.png, refs/neil-portrait.png, refs/neil-profile.png, refs/cafe-cup.png (crop of the /hi portrait plate). Changes from 1: full heads, distinct left and right three-quarter views, cappuccino cup from the plate, held in the LEFT hand (Neil, 16 Nov).

Character reference sheet of one real man, photorealistic, consistent identity across every view, made from the reference photos (same man in all of them). Plain warm light-grey studio background, soft even daylight, no text, no labels, no logos. Five full-body views in one row, evenly spaced, same scale, each figure complete from the top of his hair to his shoes with clear space above the head and below the feet: 1) straight back view, 2) three-quarter back view from his left side, 3) three-quarter back view from his right side (the opposite side to view 2), 4) rear side profile (seen from behind and to the side, only the edge of his cheek, beard line and ear visible), 5) three-quarter back view raising the cappuccino cup to his mouth with his LEFT hand, the cup being the exact white ceramic cappuccino cup from the cafe reference image, his right arm relaxed at his side, head tilted slightly. His face is never shown from the front in any view. Match him exactly: early 30s, about 180 cm, athletic muscular build with broad shoulders and defined arms, light olive skin, thick dark brown almost black curly hair, shorter at the sides and back with a natural neckline, short dark stubble beard visible along the jaw from behind. Outfit for every view: plain white crew-neck t-shirt, beige chino shorts, black round smartwatch on his left wrist, white minimal sneakers.


## character-sheet-3

Inputs: refs/neil-portrait.png, refs/neil-profile.png, refs/neil-back.jpg, refs/cafe-cup.png. Sheet 2 copied sheet 1 (its input) and kept the cup in the right hand, so sheet 1 is not an input here.

Character reference sheet of one real man, photorealistic, consistent identity across every view, made from the reference photos (same man in all of them). Plain warm light-grey studio background, soft even daylight, no text, no labels, no logos. Five full-body views in one row, evenly spaced, same scale. The figures are small enough that each one fits completely in the frame: generous empty background above the top of every head and below every shoe, nothing cropped. Views: 1) straight back view; 2) three-quarter back view, turned so we see his back and his left shoulder; 3) three-quarter back view turned the other way, so we see his back and his right shoulder; 4) rear side profile, seen from behind and to the side, only the edge of his cheek, beard line and ear visible; 5) three-quarter back view drinking from the cappuccino cup. In view 5 he holds the cup in his LEFT hand, the same hand and wrist that wear the black smartwatch, cup raised to his mouth; his right arm hangs relaxed by his side with an empty hand. The cup is the exact wide white ceramic cappuccino cup from the cafe reference image. His face is never shown from the front in any view. Match him exactly: early 30s, about 180 cm, athletic muscular build with broad shoulders and defined arms, light olive skin, thick dark brown almost black curly hair, shorter at the sides and back with a natural neckline, short dark stubble beard visible along the jaw from behind. Outfit for every view: plain white crew-neck t-shirt, beige chino shorts, black round smartwatch on his left wrist, white minimal sneakers.

- 2026-11-16 character-sheet-2.png: $0.0412 measured. Rejected: cup still in the right hand, heads cropped.
- 2026-11-17 character-sheet-3.png: $0.0412 measured (first attempt failed on a connection error, nothing billed). Cup in the left hand, full heads.

## sheet-4 (edit of character-sheet-3)

Edit this character reference sheet. Keep views 1 to 4 exactly as they are: same man, same pixels, same layout, same background. Change only view 5 (the man drinking, far right). Redraw view 5 as a realistic sip: seen three-quarter from behind, he holds the wide white cappuccino cup in his LEFT hand (the wrist with the black watch) by its handle, the cup tilted toward him with its rim centred at his lips, so from this angle his head and cheek hide most of the cup and only the outer side and base of the cup show past his jaw. His elbow is lowered and close to his body, head tipped forward slightly toward the cup, the natural way people drink from a cup. Right arm relaxed at his side. Face never seen from the front.

## frames (9:16, 864x1536)

frames/start-9x16.png: hi/plate-p.990f9ce3.jpg cropped x 160-1024, no model.

### mid-9x16 (inputs: frames/start-9x16.png, character-sheet-4.png)

Edit this photo of a cafe table by a sunlit grey wall. Keep everything exactly as it is: same framing, same light, same laptop, table, saucer and cup position. Add one person: the man from the character reference sheet, the same man as in its view 5, standing at the near side of the table on the right, seen three-quarter from behind, his back mostly to the camera, at the scale of a real person standing at this high table. He is drinking from the cup: he holds the white cappuccino cup in his LEFT hand (the wrist with the black watch) by the handle, rim centred at his lips, his head and cheek hiding most of the cup, elbow lowered, the saucer left on the table. Right arm relaxed. White crew-neck t-shirt, beige chino shorts. His face is not visible, only the edge of his cheek, beard line and ear. Same warm late-afternoon sunlight falling on him and on the wall; his shadow falls naturally on the table and floor. Photorealistic, no text.

### end-9x16 (input: frames/start-9x16.png)

Edit this photo of a cafe table by a sunlit grey wall. Keep everything exactly as it is: same framing, same light, same laptop, table, saucer, cup position and coffee. Change only the cup: someone has taken a sip, so the latte art is slightly disturbed, the coffee level is a little lower, and there is a faint thin trace of milk foam on the rim of the cup on the side facing the laptop. Subtle and realistic, nothing else changes. Photorealistic, no text, no person.


Rejected mid-9x16-1 and end-9x16-1 (frames/rejected/): the model widened the 864x1536 input to 1024x1536 and re-framed it, so the table moved between frames. Rerun on the full 1024x1536 plate (frames/plate-p.jpg), then every frame is cropped x 160-1024 the same way.
- costs: sheet-4 $0.0199, mid-1 $0.0199, end-1 $0.0340
- end-9x16.png: only the cup of end-full.png (ellipse 560,1150-780,1300, 14 px feather) pasted onto the plate, so the wall stays pixel-identical. Costs: mid-full $0.0340, end-full $0.0340.

### mid-9x16 v3 (inputs: frames/plate-p.jpg, character-sheet-4.png)

Rejected mid-2 (frames/rejected/mid-9x16-2.png): beside the table, not at it, and his cheek and beard showed, so Veo walked him past the table and turned his face (Neil, 17 Nov).

Edit this photo of a cafe table by a sunlit grey wall. Keep the wall, light, table, laptop and saucer exactly as they are. Add one person: the man from the character reference sheet (view 1, straight back view). He stands on the near side of the table, between the camera and the table, facing the wall, slightly right of the table centre, close enough that the table edge is at his hips and the table and laptop are partly hidden behind his body. His back is fully to the camera: we see the back of his head, curly hair, the back of his neck and both shoulders; his face is not visible at all, not even his cheek or beard, only the outline of one ear. He drinks from the white cappuccino cup with his LEFT hand (the wrist with the black watch), cup raised to his mouth in front of his face so it is hidden by his head, elbow lowered and close to his body; the saucer stays on the table. Right arm relaxed at his side. White crew-neck t-shirt, beige chino shorts. Realistic scale for a man at this high table, warm late-afternoon sun on his back and shoulders, soft shadow on the table. Photorealistic, no text.

- mid-full v3: $0.0199
- keys/k3-raw.png: $0.0199. Rejected: re-framed the plate wider (whole table and floor) to fit his full body, and put him beside the table.

## keys round 2: option A2 (Neil, 17 Nov): keep the plate framing, man cut at mid-thigh, standing at the right side of the table, back to camera. Prompts in keys/make.py.
- keys round 2 costs: k3 $0.0199, k4 $0.0199, k2 $0.0199 (rejected: zoomed out, full body), k5 $0.0340, k2 retry $0.0199. Paste threshold raised to 40 so the wall smudges are left out.

## plate with the cup handle to the left (Neil, 17 Nov: handle left so the left hand reaches it; he may block the cup when he is in frame)

Edit this photo. Change only the coffee cup: turn the same white cappuccino cup on its saucer so its handle points to the LEFT, toward the laptop, instead of to the right. The cup, saucer, latte art, size and position on the table stay exactly the same; the light on the cup stays consistent with the warm sun from the upper left. Everything else in the photo stays exactly as it is. Photorealistic, no text.


## keys3 (17 Nov): handle-left plate is the base; K3 is the master scene, the page plate becomes its empty version (Neil: "we can recreate the template"). First K3 stood square to the wall (keys3/rejected/k3-square.png); Neil: he must be angled slightly at the table (A2). Prompts in keys3/make.py. Costs: plate-left $0.0340, k3-square $0.0199, empty and k4 from the stopped batch about $0.05.

### k3 simple prompt (17 Nov). Rejected keys3/rejected/k3-two-handles.png: the cup showed a handle on each side of his hand (Neil). Same prompt on gpt25 and flash:

Add the man from the second image to this photo. He stands at the right side of the table, turned slightly toward it, seen from behind. He holds the coffee cup by its handle with his left hand. His face is not visible. Keep everything else in the photo the same.

- k3-gpt25.png $0.0047 (kept: one handle, angled); k3-flash.jpg $0.0508 (rejected: a second cup in his hand, and 843x1264 output). k3-two-handles $0.0199.

### k3 options 1 and 3 (Neil, 17 Nov), gpt25

Option 1 (base frames/plate-p.jpg, handle right): Add the man from the second image to this photo. He stands to the right of the coffee cup, turned slightly toward the table, seen from behind. With his left hand he holds the cup by its handle, which points toward him. His face is not visible. Keep everything else in the photo the same.

Option 3 (base frames/plate-left-raw.png, handle left, hand reaches across): Add the man from the second image to this photo. He stands to the right of the coffee cup, turned slightly toward the table, seen from behind. His left hand reaches across the front of the cup and grabs the handle on its far left side, so his hand and wrist hide most of the cup. His face is not visible. Keep everything else in the photo the same.


### k3 option 1 head variations (Neil, 17 Nov: side profile as much as the character sheet, head dipped toward the cup), gpt25 x5

Add the man from the second image to this photo. He stands to the right of the coffee cup, turned slightly toward the table, seen from behind. With his left hand he holds the cup by its handle, which points toward him. His head is turned toward the cup and dipped slightly, so we see the side of his face in profile from behind, like view 4 of the second image: the cheek, beard line and ear, but not his eyes. Keep everything else in the photo the same.


### k3-v5 likeness pass (Neil, 17 Nov: v5 is best but looks less like him). Inputs: keys3/k3-v5.png, refs/neil-profile.png, refs/neil-portrait.png

Make the man in the first image look like the real man in the other photos: the same face in side profile, nose, jawline, short beard, thick dark curly hair, skin tone and build. Keep his pose, his hand on the cup, the framing and everything else in the first image exactly the same.

- likeness pass costs: like1-3 gpt25 $0.0412 each, like4 sunburst $0.0595

## keys4 (17 Nov): master K3 = keys3/k3-v5-like1.png (Neil picked). Other poses: short prompts on gpt25 in keys4/make.py.
- keys4 costs: empty $0.0103, k2 x3 $0.0141 (try2 kept: table matches), k4 $0.0047, k5 $0.0047, end try1 $0.0180 (rejected: foam smeared over the outside of the cup).

end retry prompt: Change only the coffee in the cup: the latte art is half gone because someone took a sip, and the level is slightly lower. Leave a very small, faint brown coffee mark on the inside of the rim. The outside of the cup stays clean and white. Keep everything else in the photo the same.

### keys4 fixes (Neil, 17 Nov): K4 grip changed from K3 (palm under the cup), K5 walked toward the wall instead of off screen.

K4: The same man lifts the cup to his mouth and drinks. He keeps exactly the same grip as in this photo: his left hand holds the cup by the handle, fingers wrapped through the handle. His head is dipped toward the cup, seen from behind in side profile; we see his cheek, beard and ear but not his eye. Keep everything else in the photo the same.

K5: The same man has put the cup back on its saucer and turned his body to his right, toward the right edge of the photo. He is taking his first step to walk out of the picture on the right side, seen from behind and the side, his head facing where he is walking. The cup is on its saucer. Keep everything else in the photo the same.

- fix costs: k4 tries $0.0103, $0.0103, $0.0047; k5 tries $0.0047 x3
- picked: k4 = k4-try2, k5 = k5-try3 (Neil, 17 Nov)
