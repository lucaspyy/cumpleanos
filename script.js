
/* =========================================================
   CONFIGURACIÓN GENERAL
   ========================================================= */

const scenes = [...document.querySelectorAll(".scene")];

let current = 0;
let musicStarted = false;


/* =========================================================
   BARRA DE PROGRESO
   ========================================================= */

const progress = document.querySelector("#progress span");


/* =========================================================
   CARGAR IMÁGENES
   ========================================================= */

function setImage(el) {

    const file = el.dataset.image;

    if (!file) return;

    const img = new Image();

    img.onload = () => {

        el.style.backgroundImage = `url("images/${file}")`;

        el.classList.remove("placeholder-image");

        const text = el.querySelector?.("span");

        if (
            text &&
            el.children.length === 1 &&
            el.tagName !== "IMG"
        ) {
            text.style.display = "none";
        }
    };

    img.src = `images/${file}`;
}


document
    .querySelectorAll("[data-image]")
    .forEach(setImage);


/* =========================================================
   MÚSICA
   ========================================================= */

const music = document.querySelector("#bgMusic");
const FALLBACK_TRACK = "audio/ambient.mp3";

if (music) {
    music.volume = 0.18;
}


/* =========================================================
   MÚSICA POR CAPÍTULO (con respaldo automático)

   Cada escena puede tener un atributo data-mood
   ("intro" | "memories" | "emotional" | "ending").

   Si existe audio/<mood>.mp3, la música cambia de pista
   con un crossfade suave. Si ese archivo no existe
   (por ahora solo tenés audio/ambient.mp3), la experiencia
   NO se rompe: simplemente se queda con la pista actual
   y solo le sube/baja el volumen según el momento
   (más íntimo en las partes emotivas, más presente en
   los recuerdos).
   ========================================================= */

const MOOD_FILES = {
    intro: "audio/intro.mp3",
    memories: "audio/memories.mp3",
    emotional: "audio/emotional.mp3",
    ending: "audio/ending.mp3"
};

const MOOD_VOLUME = {
    intro: 0.22,
    memories: 0.18,
    emotional: 0.1,
    ending: 0.16
};

const availableTracks = {};

Object.keys(MOOD_FILES).forEach((mood) => {

    const probe = new Audio();

    probe.addEventListener(
        "canplaythrough",
        () => { availableTracks[mood] = true; },
        { once: true }
    );

    probe.addEventListener(
        "error",
        () => { availableTracks[mood] = false; },
        { once: true }
    );

    probe.src = MOOD_FILES[mood];

});

let currentMood = null;
let fadeTimer = null;

function fadeVolumeTo(target, ms) {

    if (!music) return;

    clearInterval(fadeTimer);

    const steps = 24;
    const stepTime = ms / steps;
    const start = music.volume;
    let i = 0;

    fadeTimer = setInterval(() => {

        i++;

        const t = i / steps;
        music.volume = Math.max(
            0,
            Math.min(1, start + (target - start) * t)
        );

        if (i >= steps) {
            clearInterval(fadeTimer);
            music.volume = target;
        }

    }, stepTime);

}

function setMood(mood) {

    if (!music || !musicStarted || !mood) return;

    if (mood === currentMood) return;

    currentMood = mood;

    const targetVolume = MOOD_VOLUME[mood] ?? 0.18;

    /*
       Si la pista específica de este capítulo existe,
       hacemos un crossfade real a esa pista.
    */

    if (availableTracks[mood]) {

        fadeVolumeTo(0.02, 500);

        setTimeout(() => {

            music.src = MOOD_FILES[mood];
            music.load();

            const playPromise = music.play();

            if (playPromise) {
                playPromise.catch(() => {});
            }

            fadeVolumeTo(targetVolume, 900);

        }, 520);

        return;
    }

    /*
       Si no existe esa pista todavía, no reiniciamos
       el audio (eso se sentiría entrecortado).
       Solo ajustamos el volumen para marcar el cambio
       de intensidad emocional.
    */

    fadeVolumeTo(targetVolume, 1200);

}


/*
   Inicia la música.
   El navegador permite esto porque esta función
   será llamada después de un clic de la usuaria.
*/

function startMusic() {

    if (!music) return;

    music.volume = 0.18;

    music.play()
        .then(() => {
            musicStarted = true;
            updateMusicButton();
            console.log("🎵 Música iniciada");
        })
        .catch((error) => {
            console.error("No se pudo reproducir la música:", error);
        });
}


/*
   Pausar música (con fade suave, no de golpe)
*/

function pauseMusic() {

    if (!music) return;

    fadeVolumeTo(0, 700);

    setTimeout(() => {
        music.pause();
    }, 720);

    updateMusicButton();
}


/*
   Botón de música
*/

const musicBtn = document.querySelector("#musicBtn");


function updateMusicButton() {

    if (!musicBtn || !music) return;

    if (music.paused) {

        musicBtn.textContent = "♫";

        musicBtn.setAttribute(
            "aria-label",
            "Reproducir música"
        );

    } else {

        musicBtn.textContent = "❚❚";

        musicBtn.setAttribute(
            "aria-label",
            "Pausar música"
        );
    }
}


if (musicBtn && music) {

    musicBtn.addEventListener("click", () => {

        if (music.paused) {

            music
                .play()
                .then(() => {

                    musicStarted = true;

                    updateMusicButton();

                })
                .catch(() => {});

        } else {

            pauseMusic();
        }

    });

}


/* =========================================================
   CAMBIO DE ESCENAS
   ========================================================= */

function showScene(index) {

    if (
        index < 0 ||
        index >= scenes.length
    ) {
        return;
    }


    scenes.forEach((scene, i) => {

        scene.classList.toggle(
            "active",
            i === index
        );

        scene.classList.remove("exit");

        if (i < index) {

            scene.classList.add("exit");

        }

    });


    current = index;


    /* Barra de progreso */

    if (progress) {

        progress.style.width =
            `${(index / (scenes.length - 1)) * 100}%`;

    }


    /* Volver arriba */

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });


    /*
       Cambiamos el ambiente musical según
       el capítulo al que entramos.
    */

    setMood(scenes[index].dataset.mood);


    /*
       Si llegamos al capítulo del video,
       apagamos la música (por si el usuario
       llegó ahí con las flechas del teclado
       y no por el botón).
    */

    if (scenes[index].classList.contains("video-scene")) {

        pauseMusic();

    }

}


/* =========================================================
   BOTONES "SIGUIENTE"
   ========================================================= */

document
    .querySelectorAll(".next")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                showScene(current + 1);

            }
        );

    });


/* =========================================================
   PSPSPS
   ========================================================= */

const spam = document.querySelector("#spamMessages");

const spamBtn = document.querySelector("#spamBtn");

let spamCount = 0;


/*
   Sonido de notificación, sintetizado en el momento
   (no necesita ningún archivo .mp3 extra).
*/

let audioCtx = null;

function playNotifPop() {

    try {

        audioCtx = audioCtx ||
            new (window.AudioContext || window.webkitAudioContext)();

        const t = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(720, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.12);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

        osc.connect(gain).connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.18);

    } catch (error) {
        /* Si el navegador bloquea audio sin interacción, lo ignoramos */
    }

}


const spamLines = [
    "pspsps",
    "pspsps",
    "pspsps",
    "pspsps",
    "pspsps",
    "pspsps",
    "pspsps"
];


function addSpam() {

    if (
        !spam ||
        spamCount >= spamLines.length
    ) {
        return;
    }


    const el = document.createElement("div");

    el.className = "spam-message";

    el.textContent =
        spamLines[spamCount];


    spam.appendChild(el);

    playNotifPop();

    spamCount++;


    if (
        spamCount <
        spamLines.length
    ) {

        setTimeout(
            addSpam,
            650
        );

    } else {

        if (spamBtn) {

            spamBtn.classList.remove(
                "hidden"
            );

            spamBtn.textContent =
                "¿QUÉ?";
        }

    }

}


setTimeout(
    addSpam,
    500
);


/* =========================================================
   BOTÓN DEL PSPSPS
   ========================================================= */

if (spamBtn) {

    spamBtn.addEventListener(
        "click",
        () => {

            if (
                spamCount <
                spamLines.length
            ) {
                return;
            }


            /*
               Primera vez que pulsa:
               mostramos la respuesta.
            */

            if (
                spamBtn.textContent === "¿QUÉ?"
            ) {

                const response =
                    document.createElement("div");

                response.className =
                    "spam-message small";

                response.textContent =
                    "Bueno, ahora sí.";

                spam.appendChild(
                    response
                );


                spamBtn.textContent =
                    "Entrar →";


                return;
            }


            /*
               Segundo clic:
               empieza oficialmente
               la experiencia.
            */

            startMusic();

            showScene(1);

        }
    );

}


/* =========================================================
   VIDEO FINAL
   ========================================================= */

const videoBtn =
    document.querySelector("#videoBtn");

const finalVideo =
    document.querySelector("#finalVideo");


if (videoBtn) {

    videoBtn.addEventListener(
        "click",
        () => {

            /*
               La música se apaga (con fade)
               antes de entrar a las pantallas
               negras previas al video.
            */

            pauseMusic();


            /*
               Vamos a la primera pantalla negra.
            */

            showScene(current + 1);

        }
    );

}


/* =========================================================
   ENTRAR AL VIDEO (después de las 2 pantallas negras)
   ========================================================= */

const enterVideoBtn =
    document.querySelector("#enterVideoBtn");

if (enterVideoBtn) {

    enterVideoBtn.addEventListener(
        "click",
        () => {

            showScene(current + 1);

            if (finalVideo) {

                finalVideo
                    .play()
                    .catch(() => {});

            }

        }
    );

}


/* =========================================================
   FINAL DEL VIDEO
   ========================================================= */

const finishBtn =
    document.querySelector("#finishBtn");


if (finishBtn) {

    finishBtn.addEventListener(
        "click",
        () => {

            showScene(current + 1);

            /*
               Después del video podemos
               volver a activar la música.
            */

            startMusic();

        }
    );

}


/* =========================================================
   TECLADO
   ========================================================= */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "ArrowRight" &&
            current > 0
        ) {

            showScene(
                Math.min(
                    current + 1,
                    scenes.length - 1
                )
            );

        }


        if (
            e.key === "ArrowLeft"
        ) {

            showScene(
                Math.max(
                    current - 1,
                    0
                )
            );

        }

    }
);


/* =========================================================
   PLAYLIST
   ========================================================= */

/*
   CAMBIÁ ESTE LINK POR EL DE TU PLAYLIST.
*/

const playlistLink =
    document.querySelector("#playlistLink");


if (playlistLink) {

    playlistLink.href =
        "https://open.spotify.com/";

}

