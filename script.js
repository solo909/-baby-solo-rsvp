const openingScreen = document.querySelector("#opening-screen");
const openButton = document.querySelector("#open-invitation");
const invitation = document.querySelector("#invitation");
const music = document.querySelector("#background-music");
const musicControl = document.querySelector("#music-control");
const musicLabel = document.querySelector("#music-label");
const rsvpForm = document.querySelector("#rsvp-form");
const successMessage = document.querySelector("#success-message");
const guestNamesWrap = document.querySelector("#guest-names-wrap");
const guestNames = document.querySelector("#guest-names");
const attendanceOptions = document.querySelectorAll('input[name="Attending"]');

let invitationOpened = false;

function updateMusicButton(isPlaying) {
  musicControl.classList.toggle("playing", isPlaying);
  musicControl.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  musicLabel.textContent = isPlaying ? "Music on" : "Music off";
  musicControl.querySelector(".music-icon").textContent = isPlaying ? "♪" : "↻";
}

async function startMusic() {
  try {
    music.volume = 0.36;
    await music.play();
    updateMusicButton(true);
  } catch {
    updateMusicButton(false);
  }
}

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;
  openingScreen.classList.add("opening");
  invitation.removeAttribute("aria-hidden");
  document.body.classList.remove("locked");
  startMusic();

  window.setTimeout(() => {
    openingScreen.hidden = true;
    invitation.querySelector("a, button")?.focus({ preventScroll: true });
  }, 850);
}

openButton.addEventListener("click", openInvitation);

musicControl.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

music.addEventListener("pause", () => updateMusicButton(false));
music.addEventListener("play", () => updateMusicButton(true));

attendanceOptions.forEach((option) => {
  option.addEventListener("change", () => {
    const attending = option.value.startsWith("Yes") && option.checked;
    guestNamesWrap.hidden = !attending;
    guestNames.required = attending;
    if (!attending) guestNames.value = "";
  });
});

const params = new URLSearchParams(window.location.search);
if (params.get("rsvp") === "success") {
  openingScreen.hidden = true;
  invitation.removeAttribute("aria-hidden");
  document.body.classList.remove("locked");
  rsvpForm.hidden = true;
  successMessage.hidden = false;
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
