/* SETTINGS */

const SECRET_PASSWORD = "BAVANI";
const BIRTHDAY = new Date("2026-12-04T00:00:00+05:30");

// Testing only: true = bypass countdown
// Real birthday mode: false
const TEST_MODE = true;


/* NAVIGATION */

let currentScreen = 1;
let countdownTimer = null;

function next(number) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById("s" + number);

  if (target) {
    target.classList.add("active");
    currentScreen = number;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (number === 6) {
    requestAnimationFrame(setupScratch);
  }
}


/* MUSIC */

const music = document.getElementById("backgroundMusic");

function startMusic() {
  if (!music) return;

  music.volume = 0.45;

  const attempt = music.play();

  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(() => {
      // Browser may require another user interaction.
    });
  }
}

function startExperience() {
  startMusic();

  if (TEST_MODE) {
    next(3);
  } else {
    next(2);
    startCountdown();
  }
}


/* COUNTDOWN */

function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);

  function updateCountdown() {
    const now = new Date();
    const difference = BIRTHDAY.getTime() - now.getTime();

    if (difference <= 0) {
      clearInterval(countdownTimer);

      document.getElementById("countdownMessage").textContent =
        "The special day has arrived! ❤️";

      document.getElementById("countdownButton").hidden = false;
      return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("days").textContent =
      String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
      String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
      String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
      String(seconds).padStart(2, "0");
  }

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}


/* PASSWORD */

function checkPassword() {
  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("passwordMessage");

  if (password.toUpperCase() === SECRET_PASSWORD) {
    message.textContent = "Unlocked! Welcome ❤️";

    setTimeout(() => {
      next(4);
      showMessage(0);
    }, 500);

  } else {
    message.textContent = "Wrong password! Try again 💗";
  }
}

document.getElementById("password").addEventListener("keydown", event => {
  if (event.key === "Enter") checkPassword();
});


/* 26 UNIQUE MESSAGES */

const messages = [
  {
    letter: "A",
    emoji: "🌸",
    title: "A Beautiful Soul",
    text: "Your presence makes even ordinary moments feel special."
  },
  {
    letter: "B",
    emoji: "🦋",
    title: "Beautiful Smile",
    text: "Your smile has a special way of making everything brighter."
  },
  {
    letter: "C",
    emoji: "🌈",
    title: "Colorful Heart",
    text: "May your life always be filled with beautiful colors and happiness."
  },
  {
    letter: "D",
    emoji: "💎",
    title: "Different & Special",
    text: "There is something truly special about the person you are."
  },
  {
    letter: "E",
    emoji: "✨",
    title: "Endless Happiness",
    text: "May happiness follow you wherever your journey takes you."
  },
  {
    letter: "F",
    emoji: "🌷",
    title: "Forever Wonderful",
    text: "Never change the beautiful things that make you who you are."
  },
  {
    letter: "G",
    emoji: "🎀",
    title: "Gift of Happiness",
    text: "Some people make life beautiful simply by being in it."
  },
  {
    letter: "H",
    emoji: "🌙",
    title: "Heart of Gold",
    text: "May your kind heart always find the love and happiness it deserves."
  },
  {
    letter: "I",
    emoji: "🪄",
    title: "Incredible You",
    text: "You are one of a kind. Never underestimate your worth."
  },
  {
    letter: "J",
    emoji: "💐",
    title: "Joyful Moments",
    text: "May every new day bring you a reason to laugh and smile."
  },
  {
    letter: "K",
    emoji: "⭐",
    title: "Keep Shining",
    text: "Keep shining in your own beautiful way."
  },
  {
    letter: "L",
    emoji: "❤️",
    title: "Lots of Love",
    text: "You deserve all the love, care and kindness in this world."
  },
  {
    letter: "M",
    emoji: "🌻",
    title: "Magical Memories",
    text: "May your life be filled with memories that make your heart smile."
  },
  {
    letter: "N",
    emoji: "☁️",
    title: "Never Stop Smiling",
    text: "Even on difficult days, I hope you find a little reason to smile."
  },
  {
    letter: "O",
    emoji: "🧸",
    title: "One of a Kind",
    text: "There will never be another person exactly like you."
  },
  {
    letter: "P",
    emoji: "🦢",
    title: "Pure Happiness",
    text: "May peace, happiness and beautiful surprises fill your days."
  },
  {
    letter: "Q",
    emoji: "👑",
    title: "Queen of Dreams",
    text: "May you have the courage to follow every dream in your heart."
  },
  {
    letter: "R",
    emoji: "🌹",
    title: "Rare Beauty",
    text: "Your beauty is not just in your appearance, but in the person you are."
  },
  {
    letter: "S",
    emoji: "🫶",
    title: "Stay Special",
    text: "Always remember that you are valuable and truly special."
  },
  {
    letter: "T",
    emoji: "🦄",
    title: "Tiny Miracles",
    text: "May little moments bring you the biggest happiness."
  },
  {
    letter: "U",
    emoji: "🌺",
    title: "Unique You",
    text: "Never compare your journey with anyone else's. Your story is yours."
  },
  {
    letter: "V",
    emoji: "🕊️",
    title: "Very Precious",
    text: "May your heart always feel safe, peaceful and loved."
  },
  {
    letter: "W",
    emoji: "🎉",
    title: "Wonderful Wishes",
    text: "Wishing you a year filled with new beginnings and beautiful achievements."
  },
  {
    letter: "X",
    emoji: "💫",
    title: "Xtra Special",
    text: "You deserve extra happiness, extra smiles and extra beautiful moments."
  },
  {
    letter: "Y",
    emoji: "🌷",
    title: "Your Happiness",
    text: "May you always find reasons to be proud of yourself."
  },
  {
    letter: "Z",
    emoji: "🎂",
    title: "Zero Limits",
    text: "Dream big, smile more and make this new chapter unforgettable!"
  }
];

let messageIndex = 0;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeLocked = false;

const messageStage = document.getElementById("messageStage");
const messageCard = document.getElementById("messageCard");


function showMessage(index, direction = "left") {
  messageIndex = index;

  const item = messages[index];

  document.getElementById("messageEmoji").textContent = item.emoji;
  document.getElementById("messageLetter").textContent = item.letter;
  document.getElementById("messageTitle").textContent = item.title;
  document.getElementById("messageText").textContent = item.text;

  document.getElementById("messageCount").textContent =
    `${index + 1} / ${messages.length}`;

  document.getElementById("progressBar").style.width =
    `${((index + 1) / messages.length) * 100}%`;

  const hint = document.getElementById("swipeHint");

  hint.textContent = index === messages.length - 1
    ? "One last surprise is waiting... ✨"
    : "← Swipe to continue →";

  messageCard.classList.remove(
    "leaving-left",
    "leaving-right",
    "entering-left",
    "entering-right"
  );

  // Restart the entry animation.
  void messageCard.offsetWidth;

  messageCard.classList.add(
    direction === "left" ? "entering-left" : "entering-right"
  );
}


function changeMessage(direction) {
  if (swipeLocked || currentScreen !== 4) return;

  const nextIndex = messageIndex + direction;

  if (nextIndex < 0) return;

  if (nextIndex >= messages.length) {
    swipeLocked = true;

    messageCard.classList.add("leaving-left");

    setTimeout(() => {
      next(5);
      swipeLocked = false;
    }, 280);

    return;
  }

  swipeLocked = true;

  messageCard.classList.add(
    direction > 0 ? "leaving-left" : "leaving-right"
  );

  setTimeout(() => {
    showMessage(nextIndex, direction > 0 ? "left" : "right");
    swipeLocked = false;
  }, 180);
}


/* TOUCH SWIPE */

messageStage.addEventListener("touchstart", event => {
  if (event.touches.length !== 1) return;

  swipeStartX = event.touches[0].clientX;
  swipeStartY = event.touches[0].clientY;
}, { passive: true });


messageStage.addEventListener("touchend", event => {
  if (!event.changedTouches.length) return;

  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;

  const diffX = endX - swipeStartX;
  const diffY = endY - swipeStartY;

  // Ignore vertical scrolling gestures.
  if (Math.abs(diffX) < 45 || Math.abs(diffX) < Math.abs(diffY)) {
    return;
  }

  changeMessage(diffX < 0 ? 1 : -1);
}, { passive: true });


/* MOUSE / TRACKPAD SWIPE */

let mouseDownX = 0;
let mouseDownY = 0;

messageStage.addEventListener("pointerdown", event => {
  if (event.pointerType === "touch") return;

  mouseDownX = event.clientX;
  mouseDownY = event.clientY;
});

messageStage.addEventListener("pointerup", event => {
  if (event.pointerType === "touch") return;

  const diffX = event.clientX - mouseDownX;
  const diffY = event.clientY - mouseDownY;

  if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
    changeMessage(diffX < 0 ? 1 : -1);
  }
});


/* KEYBOARD SUPPORT */

document.addEventListener("keydown", event => {
  if (currentScreen !== 4) return;

  if (event.key === "ArrowLeft") changeMessage(-1);
  if (event.key === "ArrowRight") changeMessage(1);
});


/* GIFT ANIMATION */

let giftOpened = false;

function openGift() {
  if (giftOpened) return;

  giftOpened = true;

  document.getElementById("giftArea").classList.add("opened");

  document.getElementById("giftMessage").textContent =
    "Your special memory is waiting! 💗";

  setTimeout(() => {
    next(6);
  }, 1600);
}


/* SCRATCH PHOTO */

let scratchCanvas;
let scratchContext;
let scratchReady = false;
let isScratching = false;
let scratchMoveCount = 0;
let photoRevealed = false;


function setupScratch() {
  if (scratchReady) return;

  scratchCanvas = document.getElementById("scratchCanvas");
  const frame = document.getElementById("scratchFrame");

  const rect = frame.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  // Cap device pixel ratio to reduce canvas work on mobile.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  scratchCanvas.width = Math.round(rect.width * dpr);
  scratchCanvas.height = Math.round(rect.height * dpr);

  scratchCanvas.style.width = rect.width + "px";
  scratchCanvas.style.height = rect.height + "px";

  scratchContext = scratchCanvas.getContext("2d", {
    willReadFrequently: true
  });

  scratchContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = scratchContext.createLinearGradient(
    0, 0, rect.width, rect.height
  );

  gradient.addColorStop(0, "#55347d");
  gradient.addColorStop(.5, "#8c55ad");
  gradient.addColorStop(1, "#42306f");

  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, rect.width, rect.height);

  scratchContext.fillStyle = "#ffffff";
  scratchContext.font = "bold 20px Arial";
  scratchContext.textAlign = "center";
  scratchContext.fillText(
    "✨ Scratch to Reveal ✨",
    rect.width / 2,
    rect.height / 2
  );

  scratchReady = true;
}


function scratchPosition(event) {
  const rect = scratchCanvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}


function scratchStart(event) {
  if (photoRevealed || !scratchReady) return;

  isScratching = true;
  scratchCanvas.setPointerCapture?.(event.pointerId);

  scratchMove(event);
}


function scratchMove(event) {
  if (!isScratching || photoRevealed || !scratchReady) return;

  const point = scratchPosition(event);

  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.beginPath();
  scratchContext.arc(point.x, point.y, 23, 0, Math.PI * 2);
  scratchContext.fill();

  scratchMoveCount++;

  // Check progress occasionally, not on every pointer movement.
  if (scratchMoveCount % 18 === 0) {
    checkScratchProgress();
  }
}


function scratchEnd() {
  isScratching = false;
}


scratchCanvas = document.getElementById("scratchCanvas");

scratchCanvas.addEventListener("pointerdown", scratchStart);
scratchCanvas.addEventListener("pointermove", scratchMove);
scratchCanvas.addEventListener("pointerup", scratchEnd);
scratchCanvas.addEventListener("pointercancel", scratchEnd);
scratchCanvas.addEventListener("lostpointercapture", scratchEnd);


function checkScratchProgress() {
  if (photoRevealed || !scratchReady) return;

  const width = scratchCanvas.width;
  const height = scratchCanvas.height;

  const pixels = scratchContext.getImageData(
    0, 0, width, height
  ).data;

  let transparent = 0;
  let total = 0;

  // Sample every 16th pixel to reduce processing.
  for (let i = 3; i < pixels.length; i += 64) {
    total++;

    if (pixels[i] < 80) {
      transparent++;
    }
  }

  const percentage = (transparent / total) * 100;

  if (percentage > 48) {
    revealPhoto();
  }
}


/* PHOTO STAR EXPLOSION */

function createStar(x, y, symbol = "✨") {
  const star = document.createElement("span");

  star.className = "star";
  star.textContent = symbol;

  star.style.left = x + "px";
  star.style.top = y + "px";

  const angle = Math.random() * Math.PI * 2;
  const distance = 70 + Math.random() * 190;

  star.style.setProperty(
    "--x",
    Math.cos(angle) * distance + "px"
  );

  star.style.setProperty(
    "--y",
    Math.sin(angle) * distance + "px"
  );

  document.getElementById("starExplosion").appendChild(star);

  setTimeout(() => star.remove(), 1600);
}


function photoStarExplosion() {
  const rect = document.getElementById("scratchFrame")
    .getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const symbols = ["✨", "⭐", "💫", "🌟"];

  // Main explosion: one-time effect.
  for (let i = 0; i < 30; i++) {
    const symbol = symbols[i % symbols.length];
    createStar(centerX, centerY, symbol);
  }

  // Small corner sparkles.
  const corners = [
    [rect.left, rect.top],
    [rect.right, rect.top],
    [rect.left, rect.bottom],
    [rect.right, rect.bottom]
  ];

  corners.forEach(([x, y]) => {
    for (let i = 0; i < 4; i++) {
      createStar(x, y, "✨");
    }
  });
}


function revealPhoto() {
  if (photoRevealed) return;

  photoRevealed = true;
  isScratching = false;

  document.getElementById("photoOverlay").classList.add("hidden");

  document.getElementById("scratchMessage").textContent =
    "A beautiful memory, just for you! ❤️";

  photoStarExplosion();

  // Remove canvas after the reveal animation.
  setTimeout(() => {
    scratchCanvas.style.display = "none";
    document.getElementById("photoContinue").hidden = false;
  }, 500);
}


/* REPLY FORM */

const replyForm = document.getElementById("replyForm");

replyForm.addEventListener("submit", async event => {
  event.preventDefault();

  const button = document.getElementById("replyButton");
  const status = document.getElementById("replyStatus");

  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const response = await fetch(replyForm.action, {
      method: "POST",
      body: new FormData(replyForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      status.textContent = "Your reply has been sent successfully! ❤️";
      replyForm.reset();
      button.textContent = "Sent Successfully 💗";
    } else {
      throw new Error("Unable to send");
    }

  } catch (error) {
    status.textContent =
      "Something went wrong. Please try again.";

    button.disabled = false;
    button.textContent = "Send Your Reply ❤️";
  }
});


/* LIGHT BACKGROUND PARTICLES */

function createParticles() {
  const container = document.getElementById("particles");
  const fragment = document.createDocumentFragment();

  // Only 14 particles for mobile performance.
  for (let i = 0; i < 14; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 5 + "s";

    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

createParticles();
    
