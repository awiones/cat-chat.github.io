const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'gameCanvas', // Attach Phaser game to the div with id 'gameCanvas'
    backgroundColor: '#eaeaea',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

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

let cats = [];
let currentCat = null;
let scannedItems = [];
let totalCost = 0;
let moneyGiven = 0;
let itemText, totalCostText, moneyGivenText, changeText;

function preload() {
    this.load.image('cat', 'img/logo-icon.png'); // Placeholder image path
}

function create() {
    // Create a few cats that will approach the cashier
    for (let i = 0; i < 3; i++) {
        let cat = this.add.sprite(100 + i * 150, 200, 'cat');
        cats.push({ sprite: cat, items: generateItems() });
    }

    // Set up the number buttons for entering money
    setupNumberButtons();

    // Attach DOM elements for displaying info
    itemText = document.getElementById('itemList');
    totalCostText = document.getElementById('totalCost');
    moneyGivenText = document.getElementById('moneyGiven');
    changeText = document.getElementById('change');

    // Add click functionality to scan items when the cat reaches the cashier
    this.input.on('pointerdown', scanItem, this);
}

function update() {
    // Move the current cat towards the cashier
    if (currentCat) {
        currentCat.sprite.x += 1;
        if (currentCat.sprite.x >= 600) {
            // Cat has arrived at the cashier
            showItems(currentCat.items);
        }
    } else if (cats.length > 0) {
        // Move the next cat to the cashier
        currentCat = cats.shift();
    }
}

function generateItems() {
    // Generate random items from the given list
    let randomItems = [];
    let numberOfItems = Phaser.Math.Between(1, 3);
    for (let i = 0; i < numberOfItems; i++) {
        let randomItem = items[Phaser.Math.Between(0, items.length - 1)];
        randomItems.push(randomItem);
    }
    return randomItems;
}

function showItems(items) {
    // Display the items in the UI
    let itemList = 'Items: ';
    totalCost = 0;
    items.forEach(item => {
        itemList += `${item.name} (PawMoney ${item.price}), `;
        totalCost += item.price;
    });
    itemText.innerText = itemList;
    totalCostText.innerText = `Total Cost: PawMoney ${totalCost}`;
}

function scanItem() {
    // Simulate scanning an item when clicked (currently scans all items)
    if (currentCat) {
        scannedItems = currentCat.items;
        showItems(scannedItems);
    }
}

function setupNumberButtons() {
    let buttons = document.querySelectorAll('.number-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            let value = parseInt(button.innerText);
            enterMoney(value);
        });
    });

    let enterBtn = document.getElementById('enterBtn');
    enterBtn.addEventListener('click', finalizeTransaction);
}

function enterMoney(amount) {
    // Append the entered amount to the money given by the player
    moneyGiven = moneyGiven * 10 + amount;
    moneyGivenText.innerText = `Money Given: PawMoney ${moneyGiven}`;
}

function finalizeTransaction() {
    // Calculate change and show it in the UI
    let change = moneyGiven - totalCost;
    changeText.innerText = `Change: PawMoney ${change >= 0 ? change : 'Insufficient'}`;

    // Reset for the next cat
    moneyGiven = 0;
    totalCost = 0;
    scannedItems = [];
    currentCat = null;

    moneyGivenText.innerText = 'Money Given: PawMoney 0';
    totalCostText.innerText = 'Total Cost: PawMoney 0';
    changeText.innerText = 'Change: PawMoney 0';
    itemText.innerText = 'Items: N/A';
}
