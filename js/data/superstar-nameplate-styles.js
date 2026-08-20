// WWE Legacy — authored Superstar nameplate identities.
// No bundled font files are required: each identity uses system-safe stacks plus
// authored scale, slant, tracking, outline and colour treatment.
const S = (label,font,top,mid,bottom,outline,accent,glow,tracking,skew,scaleX,size,italic=false) => Object.freeze({
  label,font,top,mid,bottom,outline,accent,glow,tracking,skew,scaleX,size,italic
});

export const SUPERSTAR_NAMEPLATE_STYLES = Object.freeze({
  // SummerSlam — cyan/orange broadcast energy.
  "cm-punk": S("Straight Edge Slash",'"Arial Black", Impact, sans-serif',"#ffffff","#78e5ff","#ff9b43","#081526","#63d7ff","rgba(99,215,255,.72)",-0.045,-8,0.92,1.05,true),
  "seth-rollins": S("Visionary Neon",'"Trebuchet MS", "Arial Black", sans-serif',"#fff7ff","#ef7bff","#ff9b43","#1a0b28","#8ddcff","rgba(239,123,255,.72)",-0.035,-12,0.94,1.04,true),
  "roman-reigns": S("Tribal Steel",'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',"#ffffff","#8ee7ff","#ffb45f","#06182a","#59c7ff","rgba(89,199,255,.70)",-0.015,-3,1.02,1.10,false),
  "kevin-owens": S("Prizefighter Block",'"Arial Black", Impact, sans-serif',"#ffffff","#d9f5ff","#ff7a32","#120d10","#ff9b43","rgba(255,122,50,.66)",-0.055,0,0.90,1.06,false),
  "cody-rhodes": S("American Nightmare Crest",'Copperplate, "Copperplate Gothic Bold", "Arial Black", sans-serif',"#ffffff","#8bdfff","#ffad5f","#0d1c35","#67b9ff","rgba(103,185,255,.74)",0.015,-4,0.90,1.00,false),
  "oba-femi": S("Ruler Heavy",'Impact, "Arial Black", sans-serif',"#fff4d8","#ffb65d","#64d9ff","#17100a","#ff9d38","rgba(255,157,56,.70)",0.025,-2,1.00,1.12,false),
  "brock-lesnar": S("Beast Compression",'"Arial Black", Impact, sans-serif',"#ffffff","#ffb166","#6ecbff","#160907","#f6a253","rgba(246,162,83,.68)",-0.070,-5,0.86,1.08,true),
  "gunther": S("Ring General Serif",'Georgia, "Times New Roman", serif',"#fff8e8","#ffc36d","#76d6ff","#191006","#f6a253","rgba(246,162,83,.64)",-0.025,0,0.95,1.05,false),

  // Hall of Fame — gold/black prestige with character accents.
  "mankind": S("Boiler Room Type",'"American Typewriter", "Courier New", monospace',"#fff3c6","#e7bd55","#f5f5f5","#16110a","#e5b642","rgba(229,182,66,.66)",-0.055,-4,0.90,1.02,true),
  "hulk-hogan": S("Hulkamania Poster",'Impact, Haettenschweiler, "Arial Black", sans-serif',"#fff36d","#ffd12d","#ff6c32","#281300","#e5b642","rgba(255,209,45,.78)",-0.020,-10,1.02,1.12,true),
  "andre-the-giant": S("Giant Monument",'Georgia, "Times New Roman", serif',"#fff7d0","#e7c86a","#ffffff","#171005","#f0cf76","rgba(240,207,118,.66)",0.015,0,1.00,1.04,false),
  "randy-savage": S("Macho Flash",'"Arial Black", Impact, sans-serif',"#fff67a","#ff9f3f","#f06dff","#201006","#e5b642","rgba(240,109,255,.72)",-0.030,-13,0.93,1.08,true),
  "kane": S("Big Red Machine",'Impact, "Arial Black", sans-serif',"#fff3b0","#ff9a32","#ff3f3f","#230600","#e5b642","rgba(255,63,63,.72)",-0.035,-5,0.95,1.12,false),
  "the-undertaker": S("Deadman Gothic",'Baskerville, Georgia, "Times New Roman", serif',"#ffffff","#d9d0ff","#d0a337","#100a18","#e5b642","rgba(183,153,255,.68)",0.010,-5,0.94,1.01,true),
  "ultimate-warrior": S("Warrior Streak",'Impact, Haettenschweiler, sans-serif',"#fff66d","#ff8e3d","#d979ff","#211004","#e5b642","rgba(217,121,255,.72)",0.020,-15,0.96,1.02,true),
  "stone-cold-steve-austin": S("Stone Cold Stamp",'"Arial Black", Impact, sans-serif',"#ffffff","#d8dde3","#d0a337","#090909","#e5b642","rgba(216,221,227,.64)",-0.070,0,0.78,0.98,false),

  // Evolution — pink/violet/cyan fashion-forward energy.
  "iyo-sky": S("Skyline Razor",'"Arial Black", Impact, sans-serif',"#ffffff","#67eaff","#ff54d7","#16081d","#64e8ff","rgba(100,232,255,.76)",-0.050,-10,0.91,1.10,true),
  "bayley": S("Role Model Pop",'"Trebuchet MS", "Arial Black", sans-serif',"#ffffff","#ff8ce8","#9f75ff","#220b29","#ff54d7","rgba(255,84,215,.72)",-0.015,-5,0.96,1.06,true),
  "paige": S("Anti-Diva Ink",'Georgia, "Arial Black", serif',"#ffffff","#dba2ff","#ff54d7","#140716","#a76dff","rgba(167,109,255,.72)",-0.040,-6,0.90,1.05,true),
  "stephanie-vaquer": S("Primera Precision",'Futura, "Avenir Next", "Trebuchet MS", sans-serif',"#ffffff","#75efff","#ff62d9","#15091d","#8b6cff","rgba(117,239,255,.70)",0.010,-7,0.88,0.99,true),
  "charlotte-flair": S("Queen Luxe",'Didot, Georgia, "Times New Roman", serif',"#fffdf5","#f3d77f","#ff63dc","#211126","#ff8ee8","rgba(243,215,127,.70)",0.025,-3,0.92,1.00,true),
  "rhea-ripley": S("Mami Heavy",'Impact, "Arial Black", sans-serif',"#ffffff","#b980ff","#ff54d7","#120819","#8b6cff","rgba(185,128,255,.76)",-0.040,-8,0.98,1.12,true),
  "liv-morgan": S("Liv Neon Bubble",'"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',"#ffffff","#70eaff","#ff73dd","#1d0a23","#ff54d7","rgba(112,234,255,.72)",0.015,-4,0.94,1.05,true),
  "becky-lynch": S("The Man Flame",'"Arial Black", Impact, sans-serif',"#fff4dc","#ff9c44","#ff54d7","#210b08","#ff8ee8","rgba(255,156,68,.74)",-0.030,-11,0.94,1.07,true),

  // RAW — red/silver hard broadcast identity.
  "logan-paul": S("Maverick Flash",'"Arial Black", Impact, sans-serif',"#ffffff","#f0f3f6","#ff334b","#160508","#ef2637","rgba(239,38,55,.74)",-0.045,-9,0.92,1.08,true),
  "sol-ruca": S("Sol Surf Cut",'Futura, "Avenir Next", "Trebuchet MS", sans-serif',"#ffffff","#75e7ff","#ff3f52","#12070a","#ef2637","rgba(117,231,255,.68)",0.020,-8,0.92,1.04,true),
  "chad-gable": S("Master Grappler",'Impact, "Arial Black", sans-serif',"#ffffff","#e5e9ee","#ff4458","#130608","#ef2637","rgba(239,38,55,.66)",-0.025,-3,0.94,1.06,false),
  "raquel-rodriguez": S("Powerhouse Steel",'"Arial Black", Impact, sans-serif',"#ffffff","#cbd2da","#ff334b","#120508","#ef2637","rgba(203,210,218,.66)",-0.055,-5,0.84,0.99,true),
  "joe-hendry": S("Believe Banner",'"Trebuchet MS", "Arial Black", sans-serif',"#ffffff","#ffe085","#ff334b","#17080a","#ef2637","rgba(255,224,133,.72)",0.010,-4,0.93,1.02,true),
  "roxanne-perez": S("Prodigy Spark",'"Avenir Next", Futura, "Trebuchet MS", sans-serif',"#ffffff","#ff9cd7","#ff334b","#17070d","#ef2637","rgba(255,156,215,.72)",-0.005,-7,0.90,1.02,true),
  "austin-theory": S("Theory Chrome",'"Arial Black", Impact, sans-serif',"#ffffff","#d9dee4","#ff4a5c","#100508","#ef2637","rgba(217,222,228,.66)",-0.060,-7,0.90,1.04,true),
  "montez-ford": S("Smoke & Speed",'Impact, Haettenschweiler, sans-serif',"#ffffff","#ffcf71","#ff334b","#170704","#ef2637","rgba(255,207,113,.72)",0.010,-14,0.96,1.08,true),

  // Worlds Collide — neon green/gold with lucha energy.
  "rey-mysterio": S("619 Lucha Flash",'"Arial Black", Impact, sans-serif',"#ffffff","#83ff59","#ffd75c","#081207","#62f13f","rgba(131,255,89,.76)",-0.030,-9,0.92,1.06,true),
  "dominik-mysterio": S("Dirty Dom Edge",'Impact, "Arial Black", sans-serif',"#fff7d8","#b88cff","#73ff42","#0c0812","#62f13f","rgba(184,140,255,.72)",-0.045,-12,0.91,1.06,true),
  "penta": S("Cero Miedo Cut",'Impact, Haettenschweiler, sans-serif',"#ffffff","#7fff52","#e5b642","#071008","#62f13f","rgba(127,255,82,.76)",0.020,-14,1.00,1.14,true),
  "el-grande-americano": S("Masked Americana",'Copperplate, "Copperplate Gothic Bold", serif',"#fff9d8","#e5b642","#73ff42","#101006","#62f13f","rgba(229,182,66,.70)",-0.020,-4,0.78,0.96,false),
  "lola-vice": S("Vice Heat",'"Arial Black", Impact, sans-serif',"#ffffff","#ff78cf","#73ff42","#120812","#62f13f","rgba(255,120,207,.72)",0.005,-9,0.96,1.07,true),
  "dragon-lee": S("Dragon Speed",'Futura, "Avenir Next", "Arial Black", sans-serif',"#ffffff","#7bff59","#ffd65a","#081108","#62f13f","rgba(123,255,89,.72)",0.015,-11,0.93,1.06,true),
  "hijo-del-vikingo": S("Vikingo Flight",'"Trebuchet MS", "Arial Black", sans-serif',"#ffffff","#5ff6e8","#73ff42","#061110","#62f13f","rgba(95,246,232,.72)",-0.015,-10,0.84,0.98,true),
  "mr-iguana": S("Iguana Pop",'"Cooper Black", "Arial Black", sans-serif',"#fffda1","#73ff42","#e5b642","#0b1206","#62f13f","rgba(115,255,66,.78)",0.025,-4,0.92,1.02,false),

  // Money in the Bank — green/purple/gold jackpot identity.
  "jey-uso": S("YEET Strike",'Impact, Haettenschweiler, sans-serif',"#ffffff","#8cff5a","#f6d45a","#081506","#74ef40","rgba(116,239,64,.78)",0.025,-12,1.00,1.14,true),
  "la-knight": S("YEAH Jackpot",'"Arial Black", Impact, sans-serif',"#fff8c7","#74ef40","#b45cff","#0b1307","#74ef40","rgba(180,92,255,.74)",-0.020,-8,0.94,1.10,true),
  "alexa-bliss": S("Bliss Violet",'"Trebuchet MS", "Arial Black", sans-serif',"#ffffff","#c489ff","#74ef40","#11091a","#a855f7","rgba(196,137,255,.72)",0.010,-5,0.92,1.03,true),
  "finn-balor": S("Demon Razor",'"Arial Narrow", Impact, sans-serif',"#ffffff","#8aff57","#a855f7","#08100a","#74ef40","rgba(116,239,64,.72)",0.040,-14,1.00,1.05,true),

  // SmackDown — electric blue/white broadcast identity.
  "danhausen": S("Very Nice Gothic",'Georgia, "Times New Roman", serif',"#ffffff","#9edcff","#b59cff","#07111d","#1597ff","rgba(181,156,255,.70)",0.005,-6,0.90,1.02,true),
  "tiffany-stratton": S("Tiffy Time Luxe",'Didot, Georgia, serif',"#ffffff","#c9ebff","#ff93dc","#081321","#1597ff","rgba(255,147,220,.72)",0.020,-5,0.88,1.00,true),
  "chelsea-green": S("Hot Mess Broadcast",'"Arial Black", Impact, sans-serif',"#ffffff","#7fcaff","#ff6a86","#061120","#1597ff","rgba(127,202,255,.72)",-0.035,-10,0.88,1.02,true),
  "damian-priest": S("Archer Gothic",'Copperplate, Georgia, serif',"#ffffff","#a7e1ff","#75c8ff","#07111e","#1597ff","rgba(117,200,255,.74)",0.015,-4,0.90,1.02,false),

  // Survivor Series — orange/silver collision identity.
  "bron-breakker": S("Breakker Impact",'Impact, Haettenschweiler, sans-serif',"#ffffff","#ff9a4a","#e8edf3","#170b05","#ff6b1b","rgba(255,107,27,.76)",-0.020,-10,0.98,1.12,true),
  "drew-mcintyre": S("Scottish Blade",'Georgia, "Times New Roman", serif',"#ffffff","#e8edf3","#ff7a32","#120c08","#ff6b1b","rgba(232,237,243,.68)",0.005,-5,0.92,1.02,true),
  "randy-orton": S("Viper Chrome",'"Arial Black", Impact, sans-serif',"#ffffff","#dce2e9","#ff7431","#100a08","#ff6b1b","rgba(220,226,233,.66)",-0.055,-6,0.91,1.06,true),
  "sami-zayn": S("Underdog Banner",'"Trebuchet MS", "Arial Black", sans-serif',"#ffffff","#ffb46a","#e8edf3","#140b06","#ff6b1b","rgba(255,180,106,.70)",0.005,-5,0.93,1.03,true),
  "jacob-fatu": S("Samoan Werewolf",'Impact, "Arial Black", sans-serif',"#fff8e8","#ff6b1b","#f0f2f5","#180805","#ff6b1b","rgba(255,107,27,.78)",-0.025,-12,0.90,1.08,true),
  "solo-sikoa": S("Enforcer Block",'"Arial Black", Impact, sans-serif',"#ffffff","#cdd4dc","#ff6b1b","#100807","#ff6b1b","rgba(205,212,220,.66)",-0.050,-2,0.92,1.08,false),
  "jade-cargill": S("Storm Gold",'Futura, "Avenir Next", "Arial Black", sans-serif',"#fff7cc","#ff9f4f","#ffffff","#160c06","#ff6b1b","rgba(255,159,79,.72)",0.020,-6,0.94,1.07,true),
  "nia-jax": S("Irresistible Force",'"Arial Black", Impact, sans-serif',"#ffffff","#ff9e76","#e8edf3","#150907","#ff6b1b","rgba(255,158,118,.70)",-0.030,-5,0.92,1.06,true),

  // New Generation — yellow/cyan/magenta/purple 90s broadcast identity.
  "bret-hart": S("Hitman Neon",'"Arial Black", Impact, sans-serif',"#fff36b","#ff3ca5","#31e0d4","#1a0a32","#ffdc00","rgba(255,60,165,.78)",-0.030,-8,0.93,1.07,true),
  "shawn-michaels": S("Heartbreak Flash",'Impact, Haettenschweiler, sans-serif',"#ffffff","#ff4eb2","#ffdc00","#19092d","#31e0d4","rgba(255,78,178,.80)",0.005,-15,0.96,1.08,true),
  "razor-ramon": S("Bad Guy Chrome",'Copperplate, "Arial Black", sans-serif',"#ffffff","#31e0d4","#ffdc00","#120b29","#31e0d4","rgba(49,224,212,.78)",0.015,-5,0.91,1.06,false),
  "diesel": S("Big Daddy Cool",'Impact, Haettenschweiler, "Arial Black", sans-serif',"#fff45f","#31e0d4","#ffffff","#170b31","#ffdc00","rgba(49,224,212,.80)",0.045,-4,1.04,1.14,false),

  // Reward identities.
  "the-rock": S("Final Boss Gold",'Impact, Haettenschweiler, sans-serif',"#fff3a5","#ef3d4c","#ffffff","#220306","#e8bd65","rgba(239,61,76,.78)",-0.020,-10,0.98,1.14,true),
  "goldberg": S("Who’s Next Steel",'Impact, "Arial Black", sans-serif',"#ffffff","#d6dde4","#dfc160","#0a0a0a","#dfc160","rgba(223,193,96,.74)",-0.035,-3,0.98,1.12,false)
});

const SET_DEFAULTS = Object.freeze({
  "summerslam-series-1": S("SummerSlam Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#67b9ff","#ff9d38","#071b36","#67b9ff","rgba(93,210,255,.62)",-0.02,-6,.94,1.06,true),
  "hall-of-fame-series-1": S("Hall of Fame Signature",'Impact, "Arial Black", sans-serif',"#fff8cf","#e5b642","#ffffff","#171005","#e5b642","rgba(230,188,75,.52)",-0.02,-5,.94,1.05,true),
  "evolution-series-1": S("Evolution Signature",'"Arial Black", Impact, sans-serif',"#ffffff","#ff54d7","#8b6cff","#351044","#ff54d7","rgba(76,221,255,.55)",-0.02,-7,.94,1.05,true),
  "raw-series-1": S("RAW Signature",'"Arial Black", Impact, sans-serif',"#ffffff","#c7ccd2","#ef2637","#110305","#ef2637","rgba(238,30,48,.60)",-0.02,-6,.94,1.05,true),
  "worlds-collide-series-1": S("Worlds Collide Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#73ff42","#e5b642","#040504","#62f13f","rgba(84,255,57,.58)",-0.02,-8,.94,1.05,true),
  "money-in-the-bank-series-1": S("MITB Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#74ef40","#a855f7","#13051c","#74ef40","rgba(117,239,65,.60)",-0.02,-8,.94,1.05,true),
  "smackdown-series-1": S("SmackDown Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#75c8ff","#ffffff","#031326","#1597ff","rgba(21,151,255,.62)",-0.02,-8,.94,1.05,true),
  "survivor-series-series-1": S("Survivor Series Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#ff8a3d","#d8dee8","#041329","#ff6b1b","rgba(255,107,27,.58)",-0.02,-8,.94,1.05,true),
  "new-generation-series-1": S("New Generation Signature",'Impact, "Arial Black", sans-serif',"#fff6a8","#31e0d4","#ff3ca5","#160b36","#ffdc00","rgba(238,59,159,.58)",-0.02,-8,.94,1.05,true),
  "season-1-final-boss": S("Final Boss Signature",'Impact, "Arial Black", sans-serif',"#fff4c8","#ef3d4c","#e8bd65","#260307","#e8bd65","rgba(228,183,76,.50)",-0.02,-8,.94,1.05,true),
  "season-2-whos-next": S("Who’s Next Signature",'Impact, "Arial Black", sans-serif',"#ffffff","#dfc160","#d6dde4","#08090a","#dfc160","rgba(223,193,96,.54)",-0.02,-6,.94,1.05,false)
});

export function superstarNameplateStyleFor(superstarId, setId = "") {
  return SUPERSTAR_NAMEPLATE_STYLES[superstarId] ?? SET_DEFAULTS[setId] ?? SET_DEFAULTS["summerslam-series-1"];
}

export function superstarNameplateStyleVars(superstarId, setId = "") {
  const s = superstarNameplateStyleFor(superstarId, setId);
  const safeFont = String(s.font).replaceAll('"', "'");
  return [
    `--ss-font:${safeFont}`,
    `--ss-top:${s.top}`,
    `--ss-mid:${s.mid}`,
    `--ss-bottom:${s.bottom}`,
    `--ss-outline:${s.outline}`,
    `--ss-accent:${s.accent}`,
    `--ss-glow:${s.glow}`,
    `--ss-track:${s.tracking}em`,
    `--ss-skew:${s.skew}deg`,
    `--ss-scale:${s.scaleX}`,
    `--ss-size:${s.size}`,
    `--ss-italic:${s.italic ? "italic" : "normal"}`
  ].join(";");
}
