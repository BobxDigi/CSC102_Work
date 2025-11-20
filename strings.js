// =======================================
// strings.js
// Author: J. Johnson II
// Description: Validation logic for Security Gate SG1.
//              Checks combined name length and ZIP code format
//              before revealing a secret message using innerHTML.
// =======================================

// ---------------------------
// Helper function: isFiveDigitZip
// ---------------------------
// This function takes a string representing a ZIP code
// and returns true if it is exactly 5 numeric digits (0-9),
// otherwise it returns false.
function isFiveDigitZip(zipString) {
    // Define a regular expression that matches exactly 5 digits.
    // ^ and $ ensure we match the entire string from start to end.
    // \d{5} means "exactly 5 numeric digit characters".
    const zipPattern = /^\d{5}$/;

    // Test the supplied string against our pattern and return the result.
    return zipPattern.test(zipString);
}

// ---------------------------
// Main function: handleSecurityForm
// ---------------------------
// This function runs when the form is submitted.
// It validates first name, last name, and ZIP code.
// If any validation fails, it shows an error via innerHTML and stops.
// If all validations pass, it displays a secret message.
function handleSecurityForm(event) {
    // Prevent the form from performing a normal submit (page reload).
    event.preventDefault();

    // Get a reference to the message area div where we show feedback to the user.
    const messageArea = document.getElementById("messageArea");

    // Get the first name input element by its id and read its current text value.
    const firstNameInput = document.getElementById("firstName");
    // Use trim() to remove any leading or trailing spaces from the input.
    const firstName = firstNameInput.value.trim();

    // Get the last name input element by its id and read its current text value.
    const lastNameInput = document.getElementById("lastName");
    // Use trim() again to remove extra spaces.
    const lastName = lastNameInput.value.trim();

    // Get the ZIP code input element by its id and read its current text value.
    const zipInput = document.getElementById("zipCode");
    // Trim the ZIP code value as well.
    const zipCode = zipInput.value.trim();

    // Combine the first name, a single space, and the last name into one full name string.
    const fullName = firstName + " " + lastName;

    // -----------------------------
    // Validate the combined name
    // -----------------------------

    // First, check if the user provided both a first and last name.
    if (firstName.length === 0 || lastName.length === 0) {
        // If either name is empty, show an error message using innerHTML.
        messageArea.innerHTML = `
            <p class="error">
                Validation error: Please enter both your first and last names to continue.
            </p>
        `;
        // Stop here so the rest of the function does not execute.
        return false;
    }

    // Next, check if the full name length is greater than 20 characters.
    if (fullName.length > 20) {
        // If the name is too long, warn the user and do not continue.
        messageArea.innerHTML = `
            <p class="error">
                Validation error: Your full name is ${fullName.length} characters long, which exceeds the 20 character limit.
                Please shorten your name to gain access to SG1.
            </p>
        `;
        // Stop here to prevent revealing the secret message.
        return false;
    }

    // -----------------------------
    // Validate the ZIP code format
    // -----------------------------

    // Use our helper function to determine if the ZIP code is valid.
    const zipIsValid = isFiveDigitZip(zipCode);

    // If the ZIP code is not valid, show an error message.
    if (!zipIsValid) {
        // Inform the user that the ZIP must be exactly 5 numeric digits.
        messageArea.innerHTML = `
            <p class="error">
                Validation error: ZIP code must contain exactly 5 digits (0-9) with no spaces or letters.
            </p>
        `;
        // Stop here so we do not display the secret message.
        return false;
    }

    // -----------------------------
    // All validations passed
    // -----------------------------

    // Build a personalized secret message for the user using template literals.
    const secretHtml = `
        <p class="success">
            Clearance granted, ${fullName}. ZIP code ${zipCode} verified for Security Gate SG1.
        </p>
        <p>
            SG1 Secret Message:<br>
            <em>
                "In cyber security and in life, the strongest defense is constant learning,
                careful validation, and never trusting unchecked input."
            </em>
        </p>
    `;

    // Use innerHTML to inject the secret message into the message area div.
    messageArea.innerHTML = secretHtml;

    // Return false to ensure no default submit behavior occurs.
    return false;
}

// -----------------------------------------
// Wire up the form submit to handleSecurityForm()
// -----------------------------------------

// Get a reference to the form element using its id.
const securityForm = document.getElementById("securityForm");

// Assign our handler function to the form's onsubmit property.
// Note: This does NOT use addEventListener, satisfying assignment rules.
securityForm.onsubmit = handleSecurityForm;
