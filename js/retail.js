document.addEventListener("DOMContentLoaded", function() {
    const items = [
        { name: "Cat Toy", price: 10 },
        { name: "Cat Bed", price: 25 },
        { name: "Cat Food", price: 15 },
        { name: "Cat Scratcher", price: 20 },
        { name: "Cat Collar", price: 5 },
        { name: "Cat Tree", price: 50 },
        { name: "Cat Litter", price: 10 },
        { name: "Cat Carrier", price: 30 }
    ];

    const itemNameElement = document.getElementById("item-name");
    const itemPriceElement = document.getElementById("item-price");
    const customerPaymentElement = document.getElementById("customer-payment");
    const userInput = document.getElementById("user-input");
    const feedbackElement = document.getElementById("feedback");
    const notification = document.getElementById("notification");
    const reputationBarFill = document.querySelector(".reputation-bar-fill");
    const reputationText = document.getElementById("reputation-text");
    const currencyAmount = document.getElementById("currency-amount");

    // User Manual Elements
    const manualBtn = document.getElementById("manual-btn");
    const manualModal = document.getElementById("manual-modal");
    const closeManual = document.getElementById("close-manual");

    let reputation = 100; // Starting reputation
    let currency = 0; // Starting currency
    let currentItem = null; // Track current item details
    let currentCustomerPayment = 0; // Track current customer payment
    let inputLocked = false; // To track if input is locked

    function getRandomItem() {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    function updateRequest() {
        const item = getRandomItem();
        const customerPayment = Math.floor(Math.random() * (item.price + 50)) + item.price; // Willing to pay between item price and item price + 50

        itemNameElement.textContent = item.name;
        itemPriceElement.textContent = item.price;
        customerPaymentElement.textContent = customerPayment;
        currentItem = item;
        currentCustomerPayment = customerPayment;
        notification.classList.remove("hidden");
        setTimeout(() => notification.classList.add("hidden"), 3000); // Hide notification after 3 seconds
    }

    function updateReputation(newReputation) {
        reputation = Math.min(Math.max(newReputation, 0), 500); // Clamp reputation between 0 and 500
        const reputationPercent = (reputation / 500) * 100; // Calculate percentage for the bar
        reputationText.textContent = `Reputation: ${reputation}`;
        reputationBarFill.style.width = `${reputationPercent}%`; // Update width to reflect reputation
    }

    function updateCurrency(amount) {
        const oldCurrency = currency;
        currency += amount;
        currencyAmount.textContent = currency;

        // Animate currency amount change
        const amountDisplay = document.createElement("span");
        amountDisplay.textContent = `+${amount}`;
        amountDisplay.className = "currency-change";
        currencyAmount.parentElement.appendChild(amountDisplay); // Append above the currency amount

        setTimeout(() => {
            amountDisplay.classList.add("fade-in");
        }, 10); // Small delay to ensure the element is added before animating

        // Remove the element after animation
        setTimeout(() => {
            amountDisplay.classList.remove("fade-in");
            amountDisplay.classList.add("fade-out");
            setTimeout(() => amountDisplay.remove(), 500); // Remove element after fade-out
        }, 2000); // Duration of the fade-in effect
    }

    function handleUserInput(input) {
        if (inputLocked) return; // Prevent input handling if locked

        inputLocked = true; // Lock the input field

        const lowerCaseInput = input.toLowerCase().trim(); // Convert input to lowercase and trim whitespace

        if (currentItem === null) {
            feedbackElement.textContent = `No request available. Please wait for a new item request.`;
            feedbackElement.style.color = "orange";
            resetInputLock();
            return;
        }

        const itemPrice = currentItem.price;
        const customerPayment = currentCustomerPayment;
        const change = customerPayment - itemPrice;

        if (lowerCaseInput === "give") {
            if (change > 0) {
                feedbackElement.textContent = `You gave the item for ${itemPrice} PawMoney and gave exchange of ${change} PawMoney.`;
                feedbackElement.style.color = "green";
            } else {
                feedbackElement.textContent = `You gave the item for ${itemPrice} PawMoney. No exchange needed.`;
                feedbackElement.style.color = "green";
            }
            updateReputation(reputation + 5); // Increase reputation for "Give" option
            updateCurrency(itemPrice); // Increase currency for "Give" option
            updateRequest(); // Request a new item after handling input
        } else if (lowerCaseInput === "don't give" || lowerCaseInput === "dont give" || lowerCaseInput === "dont" || lowerCaseInput === "don't") {
            feedbackElement.textContent = `You did not give the item.`;
            feedbackElement.style.color = "red";
            updateReputation(reputation - 10); // Decrease reputation for "Don't Give" option
            updateRequest(); // Request a new item after handling input
        } else if (lowerCaseInput === "give and exchange") {
            if (change > 0) {
                feedbackElement.textContent = `You gave the item for ${itemPrice} PawMoney and gave exchange of ${change} PawMoney.`;
                feedbackElement.style.color = "green";
            } else {
                feedbackElement.textContent = `You gave the item for ${itemPrice} PawMoney. No exchange needed.`;
                feedbackElement.style.color = "green";
            }
            updateReputation(reputation + 5); // Increase reputation for "Give and Exchange" option
            updateCurrency(itemPrice); // Increase currency for "Give and Exchange" option
            updateRequest(); // Request a new item after handling input
        } else if (lowerCaseInput === "give and go") {
            feedbackElement.textContent = `You gave the item for ${itemPrice} PawMoney and received ${customerPayment} PawMoney.`;
            feedbackElement.style.color = "green";
            updateReputation(reputation - 10); // Decrease reputation for "Give and Go" option
            updateCurrency(customerPayment); // Increase currency by the full customer payment
            updateRequest(); // Request a new item after handling input
        } else {
            feedbackElement.textContent = `Invalid input. Please type 'Give', 'Don't Give', 'Give and Exchange', or 'Give and Go'.`;
            feedbackElement.style.color = "orange";
        }

        userInput.value = ''; // Clear the input field

        // Reset input lock after 2 seconds
        setTimeout(() => {
            inputLocked = false;
        }, 2000);
    }

    function resetInputLock() {
        // Reset input lock immediately
        inputLocked = false;
    }
    

    // Manual Modal Functionality
    manualBtn.addEventListener("click", function() {
        manualModal.style.display = "block";
    });

    closeManual.addEventListener("click", function() {
        manualModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === manualModal) {
            manualModal.style.display = "none";
        }
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleUserInput(userInput.value);
        }
    });

    

    // Initialize with a random item request and update reputation bar and currency
    updateRequest();
    updateReputation(reputation);
    updateCurrency(currency);
});
