// =======================================
// Johnson's Gambit - 3 Hand Monty Game
// All JavaScript logic for game.html
// =======================================

// Track how many rounds have been played in total
let totalRounds = 0;

// Track how many of those rounds the player has won
let totalWins = 0;

// ---------------------------
// Helper function: getHandName
// ---------------------------
// This function takes a hand number (1, 2, or 3)
// and returns a friendly label string to describe that hand.
function getHandName(handNumber) {
    // Variable to store the label text
    let name;

    // Use conditional logic to assign the correct name
    if (handNumber === 1) {
        // Hand 1 corresponds to the left hand
        name = "Left Hand 🖐";
    } else if (handNumber === 2) {
        // Hand 2 corresponds to the middle hand
        name = "Middle Hand ✋";
    } else if (handNumber === 3) {
        // Hand 3 corresponds to the right hand
        name = "Right Hand 🤚";
    } else {
        // Fallback for unexpected values
        name = "Unknown Hand";
    }

    // Return the computed name back to the caller
    return name;
}

// ----------------------------------
// Helper function: updateStatsDisplay
// ----------------------------------
// This function calculates the current win rate
// and writes the statistics to the statsArea div using innerHTML.
function updateStatsDisplay() {
    // Get the stats area element from the page
    const statsDiv = document.getElementById("statsArea");

    // Start with a default win rate of 0
    let winRate = 0;

    // Only calculate win rate when at least one round has been played
    if (totalRounds > 0) {
        // Compute win percentage and round to the nearest whole number
        winRate = Math.round((totalWins / totalRounds) * 100);
    }

    // Build a block of HTML showing basic statistics
    const statsHtml = `
        <p>Rounds played: <strong>${totalRounds}</strong></p>
        <p>Rounds won: <strong>${totalWins}</strong></p>
        <p>Win rate: <strong>${winRate}%</strong></p>
    `;

    // Inject the HTML into the stats area using innerHTML
    statsDiv.innerHTML = statsHtml;
}

// ----------------------------
// Main game function: playMonty
// ----------------------------
// This function runs a single round of 3 Hand Monty.
// It is called when the form is submitted.
function playMonty(event) {
    // Prevent the default form submission (which would reload the page)
    event.preventDefault();

    // Get reference to the result output div
    const resultDiv = document.getElementById("resultArea");

    // Determine which hand radio button the user selected (if any)
    const selectedHandInput = document.querySelector('input[name="hand"]:checked');

    // Get the wager input element by its id
    const wagerInput = document.getElementById("wagerAmount");

    // Convert the wager from string to a number value
    const wagerAmount = Number(wagerInput.value);

    // -----------------------------
    // Input validation using innerHTML
    // -----------------------------

    // If no radio button (hand) is selected, show an error message
    if (!selectedHandInput) {
        resultDiv.innerHTML = `
            <p class="error">Choose a hand first, strategist. Johnson's Gambit requires a decision.</p>
        `;
        // End this function early so the round does not proceed
        return false;
    }

    // If the wager is less than zero, show an error message
    if (wagerAmount < 0) {
        resultDiv.innerHTML = `
            <p class="error">Your wager cannot be negative. Even in Johnson's Gambit, the math must be fair.</p>
        `;
        // Stop any further processing of this round
        return false;
    }

    // ---------------------------------
    // Read the player's chosen hand (1–3)
    // ---------------------------------
    // Convert the selected radio value (string) into a number
    const playerHand = Number(selectedHandInput.value);

    // ---------------------------------
    // Generate a random winning hand (1–3)
    // ---------------------------------
    // Math.random() returns a decimal in [0, 1)
    // Multiply by 3, floor the result for 0–2, then add 1 for 1–3
    const winningHand = Math.floor(Math.random() * 3) + 1;

    // ---------------------------------
    // Determine win / loss and payout
    // ---------------------------------

    // Boolean that will be true if the player wins
    let playerWon = false;

    // Number representing how much the player wins or loses this round
    let payout = 0;

    // Compare the chosen hand to the winning hand
    if (playerHand === winningHand) {
        // Player guessed correctly, so they win
        playerWon = true;
        // Player gains double their wager as profit (0 if wager is 0)
        payout = wagerAmount * 2;
    } else {
        // Player guessed incorrectly, so they lose
        playerWon = false;
        // Player loses the amount they wagered
        payout = -wagerAmount;
    }

    // ---------------------------------
    // Update global statistics
    // ---------------------------------

    // Every play counts as one round
    totalRounds += 1;

    // Only increment totalWins when playerWon is true
    if (playerWon) {
        totalWins += 1;
    }

    // ---------------------------------
    // Build the result message HTML
    // ---------------------------------

    // Get descriptive names for both the player's choice and the winning hand
    const playerHandName = getHandName(playerHand);
    const winningHandName = getHandName(winningHand);

    // Text that describes the outcome
    let resultText = "";
    // CSS class used to color the outcome (win or lose)
    let resultClass = "";

    // Choose result text and class depending on win or loss
    if (playerWon) {
        resultClass = "win";
        resultText = `You WIN the gambit! The latinum was under <strong>${winningHandName}</strong>.`;
    } else {
        resultClass = "lose";
        resultText = `House outplays you this time. The latinum was under <strong>${winningHandName}</strong>.`;
    }

    // Build payout explanation block (handles positive, negative, or zero)
    const payoutText = `
        <p>Your wager: <strong>${wagerAmount}</strong> bars of latinum.</p>
        <p>This round result: <strong>${payout >= 0 ? "+" + payout : payout}</strong> bars.</p>
    `;

    // Combine all parts into the final HTML for the result area
    const fullResultHtml = `
        <p>You chose: <strong>${playerHandName}</strong></p>
        <p class="${resultClass}">${resultText}</p>
        ${payoutText}
    `;

    // Display the result by writing into the result div with innerHTML
    resultDiv.innerHTML = fullResultHtml;

    // ---------------------------------
    // Refresh statistics on the page
    // ---------------------------------
    // Call the helper function that recomputes and displays stats
    updateStatsDisplay();

    // Return false to guarantee no actual form submission occurs
    return false;
}

// -----------------------------------------
// Wire up the form submit to playMonty()
// -----------------------------------------

// Look up the form element by its id in the DOM
const montyForm = document.getElementById("montyForm");

// Assign the playMonty function to onsubmit (no addEventListener used)
montyForm.onsubmit = playMonty;

// Initialize the stats area once when the script loads
updateStatsDisplay();
