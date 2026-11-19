"use strict";

/* BAVANI - GALAXY LOVE */

const CONFIG = {
  birthdayISO: "2026-12-04T00:00:00+05:30",
  testMode: true, // true = test immediately
  secretPin: "041206",
  formspreeEndpoint: "https://formspree.io/f/xzepljrz",
  photo: "bavani-photo.jpg"
};

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll(".screen")];

let currentScreen = 1;

function goTo(number) {
  currentScreen = number;

  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === number - 1);
  });

  window.scrollTo({top:0,behavior:"smooth"});

  if (number === 4) setupMessageCard();
  if (number === 6) buildPuzzle();
}

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    goTo(Number(button.dataset.go));
  });
});

$("heroGift").addEventListener("click", () => goTo(2));

$("heroGift").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") goTo(2);
});


/* MUSIC */

const music = $("bgMusic");
const musicToggle = $("musicToggle");

async function toggleMusic() {
  try {
    if (music.paused) {
      await music.play();
      musicToggle.classList.add("playing");
      musicToggle.querySelector("span").textContent = "Music ON";
    } else {
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.querySelector("span").textContent = "Music OFF";
    }
  } catch (error) {
    musicToggle.querySelector("span").textContent = "Add music file";
  }
}

musicToggle.addEventListener("click", toggleMusic);


/* REAL TIME COUNTDOWN */

const birthdayTime = new Date(CONFIG.birthdayISO).getTime();

function updateCountdown() {
  const button = $("countContinue");

  if (CONFIG.testMode) {
    $("days").textContent = "000";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";

    $("countStatus").textContent =
      "🧪 TEST MODE is ON — your surprise is ready!";

    button.disabled = false;
    button.textContent = "TEST OPEN SURPRISE ✨";
    return;
  }

  const remaining = birthdayTime - Date.now();

  if (remaining <= 0) {
    $("days").textContent = "000";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";

    $("countStatus").textContent =
      "🎂 It's your special day, Bavani! ❤️";

    button.disabled = false;
    button.textContent = "OPEN YOUR SURPRISE ❤️";
    return;
  }

  const total = Math.floor(remaining / 1000);

  $("days").textContent =
    String(Math.floor(total / 86400)).padStart(3,"0");

  $("hours").textContent =
    String(Math.floor((total % 86400) / 3600)).padStart(2,"0");

  $("minutes").textContent =
    String(Math.floor((total % 3600) / 60)).padStart(2,"0");

  $("seconds").textContent =
    String(total % 60).padStart(2,"0");

  $("countStatus").textContent =
    "Counting every second until 04 December 2026 ❤️";

  button.disabled = true;
  button.textContent = "WAIT FOR MIDNIGHT";
}

$("countContinue").addEventListener("click", () => {
  if (CONFIG.testMode || Date.now() >= birthdayTime) {
    goTo(3);
  }
});

updateCountdown();
setInterval(updateCountdown,1000);


/* PIN KEYPAD */

let pin = "";

function paintPin() {
  [...$("pinDots").children].forEach((dot,index) => {
    dot.classList.toggle("filled",index < pin.length);
  });
}

$("keypad").addEventListener("click",event => {
  const key = event.target.closest("button")?.dataset.key;
  if (!key) return;

  $("pinError").textContent = "";

  if (key === "clear") pin = "";
  else if (key === "back") pin = pin.slice(0,-1);
  else if (pin.length < 6) pin += key;

  paintPin();
});

function unlock() {
  if (pin === CONFIG.secretPin) {
    $("pinError").textContent = "";
    pin = "";
    paintPin();
    goTo(4);
  } else {
    $("pinError").textContent =
      pin.length ? "That code isn't quite right. Try again 💗" :
      "Enter your six-digit secret code.";

    pin = "";
    paintPin();
  }
}

$("unlockPin").addEventListener("click",unlock);


/* A-Z MESSAGES */

const alphabetMessages = [
  ["A","Always","A beautiful soul deserves endless happiness. ❤️"],
  ["B","Be Bright","Be happy, keep smiling and let your light shine. ✨"],
  ["C","Create","Create beautiful memories wherever life takes you. 🌸"],
  ["D","Dream","Dream big. You deserve every beautiful thing. 💖"],
  ["E","Every Moment","Every moment of your life should hold a little magic. 🌟"],
  ["F","Find Joy","Find happiness in even the smallest things. 🦋"],
  ["G","Glow","Good things and beautiful days are waiting for you. 🎀"],
  ["H","Happiness","Happiness looks beautiful on you. 😊"],
  ["I","Imagine","Imagine a life filled with endless smiles. 💕"],
  ["J","Just Be You","Just keep being the wonderful person you are. 🌷"],
  ["K","Keep Shining","Keep shining like the brightest star. ⭐"],
  ["L","Live Fully","Let your dreams slowly become your reality. 💫"],
  ["M","Magic","May your heart always be filled with love. ❤️"],
  ["N","Never Stop","Never stop smiling, Bavani. 🥰"],
  ["O","Only Good","Only beautiful moments should fill your life. 🌹"],
  ["P","Peace","Peace, love and happiness always follow you. 🕊️"],
  ["Q","Quiet Joy","Quiet moments can hold the sweetest memories. 💗"],
  ["R","Remember","Remember, you are truly special. 🎁"],
  ["S","Smile","Smile more, worry less and enjoy life. 🌻"],
  ["T","Today","Today is all about celebrating you. 🎂"],
  ["U","Unforgettable","Unforgettable memories make life beautiful. 💝"],
  ["V","Valuable","Very special people deserve magical moments. ✨"],
  ["W","Wishes","Wishing you a lifetime of happiness. 💐"],
  ["X","Xtra Love","Xtra happiness and love for you today. 💓"],
  ["Y","You","You deserve a whole world of happiness. 🌍"],
  ["Z","Zero Limits","Zero limits to your dreams and happiness. 🌈"]
];

let messageIndex = 0;
let messageRevealed = false;
let scratchCtx = null;
let scratchDown = false;
let scratchLastCheck = 0;

function setupMessageCard() {
  renderMessage();
}

function renderMessage() {
  const [letter,heading,message] = alphabetMessages[messageIndex];

  $("letterCount").textContent =
    `LETTER ${String(messageIndex+1).padStart(2,"0")}`;

  $("letterSymbol").textContent = letter;
  $("letterHeading").textContent = `${letter} is for ${heading}`;
  $("letterMessage").textContent = message;

  $("messageProgress").textContent =
    `${String(messageIndex+1).padStart(2,"0")} / 26`;

  $("progressFill").style.width =
    `${((messageIndex+1)/26)*100}%`;

  $("scratchHint").style.display = "grid";

  $("swipeHint").textContent =
    messageIndex === 25 ?
    "You're at the final letter 💗" :
    "After revealing, swipe left to continue →";

  messageRevealed = false;
  drawScratchCover();
}

function drawScratchCover() {
  const canvas = $("messageScratch");
  const wrap = $("scratchLayerWrap");
  const rect = wrap.getBoundingClientRect();

  const dpr = Math.min(window.devicePixelRatio || 1,1.5);

  canvas.width = Math.max(1,Math.round(rect.width*dpr));
  canvas.height = Math.max(1,Math.round(rect.height*dpr));

  canvas.style.width = rect.width+"px";
  canvas.style.height = rect.height+"px";

  scratchCtx = canvas.getContext("2d",{willReadFrequently:true});

  scratchCtx.setTransform(dpr,0,0,dpr,0,0);

  const gradient = scratchCtx.createLinearGradient(
    0,0,rect.width,rect.height
  );

  gradient.addColorStop(0,"#a33ed2");
  gradient.addColorStop(.5,"#452071");
  gradient.addColorStop(1,"#bd4eaa");

  scratchCtx.fillStyle = gradient;
  scratchCtx.fillRect(0,0,rect.width,rect.height);

  scratchCtx.fillStyle = "rgba(255,255,255,.9)";
  scratchCtx.textAlign = "center";
  scratchCtx.font = "600 12px DM Sans";
  scratchCtx.fillText(
    "SCRATCH HERE ✨",
    rect.width/2,
    rect.height/2+4
  );
}

function scratchAt(event) {
  if (!scratchDown || messageRevealed || !scratchCtx) return;

  const canvas = $("messageScratch");
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX-rect.left;
  const y = event.clientY-rect.top;

  scratchCtx.globalCompositeOperation = "destination-out";
  scratchCtx.beginPath();
  scratchCtx.arc(x,y,19,0,Math.PI*2);
  scratchCtx.fill();

  if (performance.now()-scratchLastCheck > 180) {
    scratchLastCheck = performance.now();
    checkScratchProgress();
  }
}

function checkScratchProgress() {
  const canvas = $("messageScratch");

  if (!scratchCtx || !canvas.width || messageRevealed) return;

  const pixels = scratchCtx.getImageData(
    0,0,canvas.width,canvas.height
  ).data;

  let clear = 0;
  let samples = 0;

  const step = 4*36;

  for (let i=3;i<pixels.length;i+=step) {
    samples++;
    if (pixels[i]<70) clear++;
  }

  if (samples && clear/samples>.43) {
    messageRevealed = true;

    scratchCtx.clearRect(0,0,canvas.width,canvas.height);

    $("scratchHint").style.display = "none";

    $("swipeHint").textContent =
      messageIndex === 25 ?
      "All 26 wishes revealed — swipe left to continue 💗" :
      "Now swipe left for the next letter →";

    starBurst(
      canvas.getBoundingClientRect().left+canvas.clientWidth/2,
      canvas.getBoundingClientRect().top+35,
      10
    );
  }
}

const scratchCanvas = $("messageScratch");

scratchCanvas.addEventListener("pointerdown",event => {
  if (messageRevealed) return;

  scratchDown = true;
  scratchCanvas.setPointerCapture(event.pointerId);
  scratchAt(event);
});

scratchCanvas.addEventListener("pointermove",scratchAt);

["pointerup","pointercancel","lostpointercapture"].forEach(name => {
  scratchCanvas.addEventListener(name,() => scratchDown=false);
});


/* SWIPE NAVIGATION */

let swipeStartX = 0;
let swipeStartY = 0;

$("messageViewport").addEventListener("touchstart",event => {
  swipeStartX = event.changedTouches[0].clientX;
  swipeStartY = event.changedTouches[0].clientY;
},{passive:true});

$("messageViewport").addEventListener("touchend",event => {
  const dx = event.changedTouches[0].clientX-swipeStartX;
  const dy = event.changedTouches[0].clientY-swipeStartY;

  if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.25) {
    advanceMessage(dx<0);
  }
},{passive:true});

let mouseStartX = null;

$("messageViewport").addEventListener("pointerdown",event => {
  if (event.pointerType==="mouse") mouseStartX=event.clientX;
});

$("messageViewport").addEventListener("pointerup",event => {
  if (mouseStartX!==null) {
    const dx=event.clientX-mouseStartX;
    if (Math.abs(dx)>65) advanceMessage(dx<0);
    mouseStartX=null;
  }
});

function advanceMessage(left) {
  if (!left || !messageRevealed) return;

  if (messageIndex<25) {
    messageIndex++;
    renderMessage();
  } else {
    goTo(5);
  }
}


/* FINAL GIFT */

function openFinalGift() {
  $("finalGift").textContent="💝";
  $("revealedNote").hidden=false;
  $("openFinalGift").hidden=true;

  starBurst(
    window.innerWidth/2,
    window.innerHeight/2,
    28
  );
}

$("openFinalGift").addEventListener("click",openFinalGift);
$("finalGift").addEventListener("click",openFinalGift);

$("finalGift").addEventListener("keydown",event => {
  if (event.key==="Enter" || event.key===" ") openFinalGift();
});

$("toPuzzle").addEventListener("click",()=>goTo(6));


/* PHOTO PUZZLE */

let puzzleOrder=[];
let selectedPiece=null;

function shuffleArray(array) {
  const copy=[...array];

  for (let i=copy.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }

  return copy;
}

function buildPuzzle() {
  puzzleOrder=shuffleArray([0,1,2,3,4,5,6,7,8]);

  if (puzzleOrder.every((value,index)=>value===index)) {
    puzzleOrder=[1,0,2,3,4,5,6,7,8];
  }

  selectedPiece=null;
  $("puzzleWin").hidden=true;
  renderPuzzle();
}

function renderPuzzle() {
  const board=$("puzzleBoard");
  board.innerHTML="";

  puzzleOrder.forEach((piece,position) => {
    const tile=document.createElement("button");

    tile.type="button";
    tile.className="puzzle-piece";
    tile.setAttribute("aria-label",`Puzzle piece ${position+1}`);

    const row=Math.floor(piece/3);
    const col=piece%3;

    tile.style.backgroundPosition=`${col*50}% ${row*50}%`;

    if (selectedPiece===position) tile.classList.add("selected");

    tile.addEventListener("click",()=>choosePuzzlePiece(position));

    board.appendChild(tile);
  });

  const correct=puzzleOrder.filter(
    (piece,index)=>piece===index
  ).length;

  $("puzzleCount").textContent=`${correct} / 9 pieces in place`;

  if (correct===9) {
    $("puzzleWin").hidden=false;
    starBurst(window.innerWidth/2,window.innerHeight/2,45);
  }
}

function choosePuzzlePiece(position) {
  if (selectedPiece===null) {
    selectedPiece=position;
  } else if (selectedPiece===position) {
    selectedPiece=null;
  } else {
    [puzzleOrder[selectedPiece],puzzleOrder[position]] =
    [puzzleOrder[position],puzzleOrder[selectedPiece]];

    selectedPiece=null;
  }

  renderPuzzle();
}

$("shufflePuzzle").addEventListener("click",buildPuzzle);
$("toReply").addEventListener("click",()=>goTo(7));


/* FORMSPREE REPLY */

$("replyForm").addEventListener("submit",async event => {
  event.preventDefault();

  const status=$("formStatus");
  const sendButton=$("sendReply");
  const message=$("replyMessage").value.trim();

  if (!message) {
    status.textContent="Write a little message first ❤️";
    return;
  }

  if (
    !CONFIG.formspreeEndpoint ||
    CONFIG.formspreeEndpoint.includes("YOUR_FORM_ID")
  ) {
    status.textContent="Add your Formspree endpoint in script.js first.";
    return;
  }

  sendButton.disabled=true;
  status.textContent="Sending your message... 💌";

  try {
    const response=await fetch(CONFIG.formspreeEndpoint,{
      method:"POST",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name:$("replyName").value.trim()||"Bavani",
        message,
        subject:"A birthday surprise reply from Bavani"
      })
    });

    if (!response.ok) throw new Error("Form submission failed");

    status.textContent="Your message has been sent with love! ❤️";
    $("replyMessage").value="";
  } catch(error) {
    status.textContent="Couldn't send right now. Check your internet or Formspree settings.";
    sendButton.disabled=false;
  }
});


/* LIGHTWEIGHT STARFIELD */

const starCanvas=$("starField");
const starCtx=starCanvas.getContext("2d");

let stars=[];
let canvasWidth=0;
let canvasHeight=0;
let animationFrame=0;

function resizeStarfield() {
  const dpr=Math.min(window.devicePixelRatio||1,1.25);

  canvasWidth=window.innerWidth;
  canvasHeight=window.innerHeight;

  starCanvas.width=Math.floor(canvasWidth*dpr);
  starCanvas.height=Math.floor(canvasHeight*dpr);

  starCanvas.style.width=canvasWidth+"px";
  starCanvas.style.height=canvasHeight+"px";

  starCtx.setTransform(dpr,0,0,dpr,0,0);

  const count=Math.min(48,Math.max(22,Math.floor(canvasWidth/9)));

  stars=Array.from({length:count},()=>({
    x:Math.random()*canvasWidth,
    y:Math.random()*canvasHeight,
    r:Math.random()*1.25+.35,
    alpha:Math.random()*.55+.2,
    phase:Math.random()*Math.PI*2,
    speed:Math.random()*.012+.003
  }));
}

function drawStars() {
  starCtx.clearRect(0,0,canvasWidth,canvasHeight);

  const time=performance.now()*.001;

  for (const star of stars) {
    const alpha=star.alpha*(
      .65+.35*Math.sin(time*star.speed*50+star.phase)
    );

    starCtx.fillStyle=`rgba(255,220,255,${alpha})`;
    starCtx.beginPath();
    starCtx.arc(star.x,star.y,star.r,0,Math.PI*2);
    starCtx.fill();
  }

  animationFrame=requestAnimationFrame(drawStars);
}

resizeStarfield();
drawStars();

window.addEventListener("resize",()=>{
  cancelAnimationFrame(animationFrame);
  resizeStarfield();
  drawStars();
},{passive:true});


/* STAR EXPLOSION */

function starBurst(x,y,amount=18) {
  const symbols=["✦","✧","★","✨"];

  for (let i=0;i<amount;i++) {
    const particle=document.createElement("span");

    particle.textContent=symbols[i%symbols.length];

    particle.style.cssText=`
      position:fixed;
      left:${x}px;
      top:${y}px;
      z-index:50;
      pointer-events:none;
      color:${i%2?"#ffd98a":"#ff9be8"};
      font-size:${10+Math.random()*13}px;
      text-shadow:0 0 9px currentColor;
      transition:transform .75s ease-out,opacity .75s ease-out;
    `;

    document.body.appendChild(particle);

    const angle=Math.random()*Math.PI*2;
    const distance=35+Math.random()*85;

    requestAnimationFrame(()=>{
      particle.style.transform=`
        translate(
          ${Math.cos(angle)*distance}px,
          ${Math.sin(angle)*distance}px
        )
        rotate(${Math.random()*180}deg)
        scale(.3)
      `;

      particle.style.opacity="0";
    });

    setTimeout(()=>particle.remove(),850);
  }
}

window.addEventListener("orientationchange",()=>{
  if (currentScreen===4) {
    setTimeout(drawScratchCover,180);
  }
});
                                                           
