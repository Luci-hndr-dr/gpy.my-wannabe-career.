
document.addEventListener("DOMContentLoaded", function() {
    const loadingscreen = document.getElementById("loadingscreen");
    const website = document.getElementById("website");
    const progress = document.getElementById("progress");
    const percentage = document.getElementById("percentage");

    const bgMusic = document.getElementById("bgMusic");
    const volumeControl = document.getElementById("volumeControl");
    const volumeValue = document.getElementById("volumeValue");

    const startSound = document.getElementById("startSound");
    const navClickSound = document.getElementById("navClickSound");

    const sfxVolumeControl = document.getElementById("sfxVolumeControl");
    const sfxVolumeValue = document.getElementById("sfxVolumeValue");

    if (sfxVolumeControl) {
        const updateSFXVolume = function() {
            const volume = sfxVolumeControl.value / 100;

            if (startSound) {
                startSound.volume = volume;
            }

            if (navClickSound) {
                navClickSound.volume = volume;
            }

            if (sfxVolumeValue) {
                sfxVolumeValue.textContent = sfxVolumeControl.value + "%";
            }
        };

        updateSFXVolume();
        sfxVolumeControl.addEventListener("input", updateSFXVolume);
    }

    if (bgMusic) {
        bgMusic.volume = volumeControl
            ? volumeControl.value / 100
            : 0.3;

        bgMusic.play().catch(function(error) {
            if (error.name !== "NotAllowedError") {
                console.error("Music playback failed:", error);
            }
        });
    }

    if (volumeControl && bgMusic) {
        volumeControl.addEventListener("input", function() {
            bgMusic.volume = volumeControl.value / 100;

            if (volumeValue) {
                volumeValue.textContent = volumeControl.value + "%";
            }
        });
    }

    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(function(error) {
                console.error("Sound effect failed:", error);
            });
        }
    }

    function startBackgroundMusic() {
        if (bgMusic && (bgMusic.paused || bgMusic.readyState === 0)) {
            bgMusic.play().catch(function(error) {
                console.error("Music playback failed:", error);
            });
        }
    }

    const mainButton = document.querySelector(".hoverimg");

    if (mainButton) {
        mainButton.addEventListener("click", function() {
            startBackgroundMusic();
            playSound(startSound);
        });
    }

    const allButtons = document.querySelectorAll("button");

    allButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            playSound(navClickSound);
        });
    });

    if (!loadingscreen || !website || !progress || !percentage) {
        console.error("Missing HTML elements!");
        return;
    }

    let count = 0;

    const loading = setInterval(function() {
        count++;

        progress.style.width = count + "%";
        percentage.textContent = count + "%";

        if (count >= 100) {
            clearInterval(loading);

            setTimeout(function() {
                website.classList.add("activescreen");
                loadingscreen.classList.add("fade-out");

                setTimeout(function() {
                    loadingscreen.style.display = "none";
                }, 800);

            }, 500);
        }
    }, 30);

    showClass("abtme1");
    setupArtworkCarousel();
    setupBehaviorsDetailsDialog();
});

function setupBehaviorsDetailsDialog() {
    const dialog = document.getElementById("behaviorsDetailsDialog");
    const openButton = document.getElementById("behaviorsDetailsButton");
    const closeButton = document.getElementById("closeBehaviorsDetails");

    if (!dialog || !openButton || !closeButton) {
        return;
    }

    openButton.addEventListener("click", function() {
        dialog.showModal();
    });

    closeButton.addEventListener("click", function() {
        dialog.close();
    });

    dialog.addEventListener("click", function(event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

function setupArtworkCarousel() {
    const track = document.querySelector(".artwork-track");
    const slides = document.querySelectorAll(".artwork-slide");
    const previousButton = document.getElementById("artworkPrev");
    const nextButton = document.getElementById("artworkNext");
    const counter = document.getElementById("artworkCounter");

    if (!track || slides.length === 0 || !previousButton || !nextButton || !counter) {
        return;
    }

    let currentPage = 0;

    function getVisibleCount() {
        return window.innerWidth <= 900 ? 1 : 3;
    }

    function getPageCount() {
        return Math.ceil(slides.length / getVisibleCount());
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const pageCount = getPageCount();
        currentPage = Math.min(currentPage, pageCount - 1);

        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = visibleCount === 1
            ? 0
            : parseFloat(getComputedStyle(track).gap) || 0;

        track.style.transform =
            "translateX(-" + (currentPage * visibleCount * (slideWidth + gap)) + "px)";
        counter.textContent = (currentPage + 1) + " / " + pageCount;
    }

    previousButton.addEventListener("click", function() {
        currentPage = (currentPage - 1 + getPageCount()) % getPageCount();
        updateCarousel();
    });

    nextButton.addEventListener("click", function() {
        currentPage = (currentPage + 1) % getPageCount();
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
}

function showScreen(screenId) {
    const currentScreen = document.querySelector(".screen.activescreen");
    const nextScreen = document.getElementById(screenId);

    if (!nextScreen || currentScreen === nextScreen || !currentScreen) {
        return;
    }

    currentScreen.style.animation = "fadeOut 0.5s ease forwards";

    setTimeout(function() {
        currentScreen.classList.remove("activescreen");
        currentScreen.style.animation = "";
        nextScreen.classList.add("activescreen");
    }, 500);
}

function showClass(className) {
    const containers = document.querySelectorAll(
        "#profile .abtme-container"
    );

    containers.forEach(function(container) {
        container.style.display = "none";
    });

    const selected = document.querySelector(
        "#profile .abtme-image." + className
    );

    if (selected) {
        selected.parentElement.style.display = "block";
    }
}
