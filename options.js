/*
 * options.js
 * 
 * handles the options modal logic for the game
 * allows users to open/close the options modal, switch between settings and instructions,
 *      customize key bindings, toggle dark mode, and reset keys to their default settings
 */

// ensure event listener is added when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('option-button').addEventListener('click', openOptionsModal);

    // event listener for toggling dark mode
    const toggleButton = document.getElementById('dark-mode-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // save the theme preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // load the saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

// function to open the options modal and overlay
function openOptionsModal() {
    document.getElementById('options-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
    hideAllOptionsSections();  // ensure no sections are showing initially
}

// function to close the options modal and overlay
function closeOptionsModal() {
    document.getElementById('options-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}

// function to show the "How to Play" section and hide others
function showHowToPlay() {
    hideAllOptionsSections();
    document.getElementById('how-to-play').style.display = 'block';
}

// function to show the "Settings" section and hide others
function showSettings() {
    hideAllOptionsSections();
    document.getElementById('settings').style.display = 'block';
}

// function to hide all sections initially
function hideAllOptionsSections() {
    document.getElementById('how-to-play').style.display = 'none';
    document.getElementById('settings').style.display = 'none';
}

/*
 * 
 * CUSTOM KEY BINDS
 *   
 */

// variable to track which key is currently being customized
let currentKeyBeingChanged = null;

// function to handle key customization when a user clicks a key input
function customizeKey(action) {
    currentKeyBeingChanged = action;
    document.getElementById(`${action}-key`).value = 'Press any key...';
    
    // add a one-time keydown listener for capturing the keypress
    document.addEventListener('keydown', handleKeyChange, { once: true });
}

// function to capture and assign a new key to the action being customized
function handleKeyChange(event) {
    const key = event.code; // get the key that was pressed

    if (currentKeyBeingChanged) {
        document.getElementById(`${currentKeyBeingChanged}-key`).value = key;
        
        // Update the key binding in the KEY object or another mapping
        if (currentKeyBeingChanged === 'left') {
            KEY.LEFT = key;
        } else if (currentKeyBeingChanged === 'right') {
            KEY.RIGHT = key;
        } else if (currentKeyBeingChanged === 'up') {
            KEY.UP = key;
        } else if (currentKeyBeingChanged === 'down') {
            KEY.DOWN = key;
        } else if (currentKeyBeingChanged === 'hold') {
            KEY.HOLD = key;
        } else if (currentKeyBeingChanged === 'hardDrop') {
            KEY.SPACE = key; 
            event.preventDefault();
        } else if (currentKeyBeingChanged === 'pause') {
            KEY.ESC = key; 
        }

        updateMoves(); // update the moves object with the new key bindings

        // reset the key being changed
        currentKeyBeingChanged = null;
    }
}

// function to revert all key bindings to their default values
function revertToDefaultKeys() {
    // reset the KEY object to its default values
    Object.assign(KEY, DEFAULT_KEY);

    // update the key inputs in the settings UI
    document.getElementById('left-key').value = DEFAULT_KEY.LEFT;
    document.getElementById('right-key').value = DEFAULT_KEY.RIGHT;
    document.getElementById('down-key').value = DEFAULT_KEY.DOWN;
    document.getElementById('up-key').value = DEFAULT_KEY.UP;
    document.getElementById('hold-key').value = DEFAULT_KEY.HOLD;
    document.getElementById('hardDrop-key').value = DEFAULT_KEY.SPACE;
    document.getElementById('pause-key').value = DEFAULT_KEY.ESC;

    // update moves with the default key bindings
    updateMoves();

    // reset to light mode
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');  // store light mode as the default theme
    }
}
