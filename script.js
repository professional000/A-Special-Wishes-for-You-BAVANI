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



/* ==================================
   A-Z INDIVIDUAL SCRATCH MESSAGES
================================== */

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
let scratchDown = false;
let scratchCtx = null;
let scratchLastCheck = 0;

const messageCanvas = document.getElementById("messageScratch");

function setupMessageCard() {
  renderMessage();
}

function renderMessage() {

  const [letter, heading, message] =
    alphabetMessages[messageIndex];

  document.getElementById("letterCount").textContent =
    `LETTER ${String(messageIndex + 1).padStart(2,"0")}`;

  document.getElementById("letterSymbol").textContent = letter;

  document.getElementById("letterHeading").textContent =
    `${letter} is for ${heading}`;

  document.getElementById("letterMessage").textContent = message;

  document.getElementById("messageProgress").textContent =
    `${String(messageIndex + 1).padStart(2,"0")} / 26`;

  document.getElementById("progressFill").style.width =
    `${((messageIndex + 1) / 26) * 100}%`;

  document.getElementById("scratchHint").style.display = "grid";

  document.getElementById("swipeHint").textContent =
    "Scratch to reveal your message ✨";

  messageRevealed = false;

  drawMessageScratch();
}

function drawMessageScratch() {

  const canvas = messageCanvas;
  const area = canvas.parentElement;
  const rect = area.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  scratchCtx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = scratchCtx.createLinearGradient(
    0, 0, rect.width, rect.height
  );

  gradient.addColorStop(0, "#a33ed2");
  gradient.addColorStop(.5, "#452071");
  gradient.addColorStop(1, "#bd4eaa");

  scratchCtx.globalCompositeOperation = "source-over";
  scratchCtx.fillStyle = gradient;
  scratchCtx.fillRect(0, 0, rect.width, rect.height);

  scratchCtx.fillStyle = "#ffffff";
  scratchCtx.textAlign = "center";
  scratchCtx.font = "600 12px sans-serif";

  scratchCtx.fillText(
    "SCRATCH HERE ✨",
    rect.width / 2,
    rect.height / 2 + 4
  );
}

function scratchMessage(event) {

  if (!scratchDown || messageRevealed || !scratchCtx) return;

  const rect = messageCanvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  scratchCtx.globalCompositeOperation = "destination-out";

  scratchCtx.beginPath();
  scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
  scratchCtx.fill();

  if (performance.now() - scratchLastCheck > 200) {
    scratchLastCheck = performance.now();
    checkMessageScratch();
  }
}

function checkMessageScratch() {

  if (messageRevealed || !scratchCtx) return;

  const pixels = scratchCtx.getImageData(
    0, 0, messageCanvas.width, messageCanvas.height
  ).data;

  let transparent = 0;
  let samples = 0;

  for (let i = 3; i < pixels.length; i += 4 * 32) {
    samples++;

    if (pixels[i] < 80) transparent++;
  }

  if (samples && transparent / samples > 0.42) {

    messageRevealed = true;

    scratchCtx.clearRect(
      0, 0, messageCanvas.width, messageCanvas.height
    );

    document.getElementById("scratchHint").style.display = "none";

    document.getElementById("swipeHint").textContent =
      messageIndex === 25
        ? "All 26 wishes revealed! Swipe left 💗"
        : "✨ Message revealed! Swipe left for next →";

    const rect = messageCanvas.getBoundingClientRect();

    starBurst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      18
    );
  }
}

messageCanvas.addEventListener("pointerdown", event => {

  if (messageRevealed) return;

  scratchDown = true;
  messageCanvas.setPointerCapture(event.pointerId);

  scratchMessage(event);
});

messageCanvas.addEventListener("pointermove", scratchMessage);

["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {

  messageCanvas.addEventListener(type, () => {
    scratchDown = false;
  });

});


/* SWIPE TO NEXT MESSAGE */

let swipeStartX = 0;
let swipeStartY = 0;

const messageViewport =
  document.getElementById("messageViewport");

messageViewport.addEventListener("touchstart", event => {

  swipeStartX = event.changedTouches[0].clientX;
  swipeStartY = event.changedTouches[0].clientY;

}, { passive: true });

messageViewport.addEventListener("touchend", event => {

  const dx = event.changedTouches[0].clientX - swipeStartX;
  const dy = event.changedTouches[0].clientY - swipeStartY;

  if (
    Math.abs(dx) > 55 &&
    Math.abs(dx) > Math.abs(dy) * 1.25
  ) {
    advanceMessage(dx < 0);
  }

}, { passive: true });

function advanceMessage(left) {

  if (!left || !messageRevealed) return;

  if (messageIndex < 25) {

    messageIndex++;
    renderMessage();

  } else {

    goTo(5);

  }
}


/* ==================================
   PHOTO SCRATCH REVEAL
================================== */

const photoCanvas = document.getElementById("photoScratch");

let photoCtx = null;
let photoDown = false;
let photoRevealed = false;
let photoLastCheck = 0;

function setupPhotoScratch() {

  const rect = photoCanvas.parentElement.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  photoCanvas.width = Math.round(rect.width * dpr);
  photoCanvas.height = Math.round(rect.height * dpr);

  photoCanvas.style.width = rect.width + "px";
  photoCanvas.style.height = rect.height + "px";

  photoCtx = photoCanvas.getContext("2d", {
    willReadFrequently: true
  });

  photoCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = photoCtx.createLinearGradient(
    0, 0, rect.width, rect.height
  );

  gradient.addColorStop(0, "#b43be0");
  gradient.addColorStop(.5, "#4b237c");
  gradient.addColorStop(1, "#ed64bd");

  photoCtx.fillStyle = gradient;
  photoCtx.fillRect(0, 0, rect.width, rect.height);

  photoCtx.fillStyle = "#ffffff";
  photoCtx.textAlign = "center";
  photoCtx.font = "bold 13px sans-serif";

  photoCtx.fillText(
    "SCRATCH YOUR SURPRISE ✨",
    rect.width / 2,
    rect.height / 2
  );
}

function scratchPhoto(event) {

  if (!photoDown || photoRevealed || !photoCtx) return;

  const rect = photoCanvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  photoCtx.globalCompositeOperation = "destination-out";

  photoCtx.beginPath();
  photoCtx.arc(x, y, 25, 0, Math.PI * 2);
  photoCtx.fill();

  if (performance.now() - photoLastCheck > 200) {
    photoLastCheck = performance.now();
    checkPhotoScratch();
  }
}

function checkPhotoScratch() {

  if (photoRevealed || !photoCtx) return;

  const pixels = photoCtx.getImageData(
    0, 0, photoCanvas.width, photoCanvas.height
  ).data;

  let clear = 0;
  let total = 0;

  for (let i = 3; i < pixels.length; i += 4 * 32) {

    total++;

    if (pixels[i] < 80) clear++;
  }

  if (total && clear / total > 0.45) {

    photoRevealed = true;

    photoCtx.clearRect(
      0, 0, photoCanvas.width, photoCanvas.height
    );

    document.getElementById("photoScratchHint").style.display = "none";

    document.getElementById("photoStatus").textContent =
      "Your beautiful memory is revealed! ❤️✨";

    document.getElementById("toReply").hidden = false;

    const rect = photoCanvas.getBoundingClientRect();

    starBurst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      45
    );
  }
}

photoCanvas.addEventListener("pointerdown", event => {

  if (photoRevealed) return;

  photoDown = true;
  photoCanvas.setPointerCapture(event.pointerId);

  scratchPhoto(event);
});

photoCanvas.addEventListener("pointermove", scratchPhoto);

["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {

  photoCanvas.addEventListener(type, () => {
    photoDown = false;
  });

});


/* PHOTO REVEAL NAVIGATION */

document.getElementById("toReply").addEventListener(
  "click",
  () => goTo(7)
);


/* RESIZE SUPPORT */

window.addEventListener("resize", () => {

  if (currentScreen === 4 && !messageRevealed) {
    drawMessageScratch();
  }

  if (currentScreen === 6 && !photoRevealed) {
    setupPhotoScratch();
  }

});
  

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
                                                           
