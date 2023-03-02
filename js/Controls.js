// This file contains the event listeners and what happens when keys are pressed
// KeySates object
const KeyStates = {
    d: false,
    a: false,
    space: false,
    esc: false,
    m: false
};

// Keypress detection
document.addEventListener("keydown", function onEvent(event)
{
    // Prevent repeated keystroke
    if (event.repeat) {
        return;
    }
    // Go right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = true;
    }
    // Go left
    if (event.key == "a" || event.key == "A") {
        KeyStates.a = true;
    }

    // Skip level
    if (event.key == "m" || event.key == "M") {
        KeyStates.m = true;
    }

    if (event.key == " ") {
        KeyStates.space = true;
    }

    if (event.key === "Escape") {
        KeyStates.esc = true;
    }
});

// Key release detection
document.addEventListener("keyup", function onEvent(event)
{
    // Prevent repeated keystroke
    if (event.repeat) {
        return;
    }
    // Stop right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = false;
    }
    // Stop left
    if (event.key == "a" || event.key == "A") {
        KeyStates.a = false;
    }

    // Skip level
    if (event.key == "m" || event.key == "M") {
        KeyStates.m = false;
    }

    if (event.key == " ") {
        KeyStates.space = false;
    }

    if (event.key == "Escape") {
        KeyStates.esc = false;
    }
});