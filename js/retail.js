const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f0f0f0',
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

let cats = [];
let currentCat = null;
let scannedItems = [];
let totalCost = 0;
let moneyGiven = 0;
let itemText, totalCostText, moneyGivenText, changeText;

function preload() {
    // Load assets like cat sprites, item sprites, and any UI elements.
    this.load.image('cat', 'path/to/cat.png'); // Placeholder for cat image
    this.load.image('item', 'path/to/item.png'); // Placeholder for item image
}

function create() {
    // Create a few cats that will approach the cashier
    for (let i = 0; i < 3; i++) {
        let cat = this.add.sprite(100 + i * 150, 100, 'cat');
        cats.push({ sprite: cat, items: generateItems() });
    }

    // UI texts to show the total, money given, and change
    itemText = this.add.text(20, 20, 'Items:', { fontSize: '20px', fill: '#000' });
    totalCostText = this.add.text(20, 50, 'Total Cost: PawMoney 0', { fontSize: '20px', fill: '#000' });
    moneyGivenText = this.add.text(20, 80, 'Money Given: PawMoney 0', { fontSize: '20px', fill: '#000' });
    changeText = this.add.text(20, 110, 'Change: PawMoney 0', { fontSize: '20px', fill: '#000' });

    // Listen for item scan (this could be a click or hover)
    this.input.on('pointerdown', scanItem, this);

    // Add number buttons to enter PawMoney for payment and change
    createNumberButtons(this);
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
    // Create random items with prices
    let items = [];
    for (let i = 0; i < 3; i++) {
        items.push({ sprite: 'item', price: Phaser.Math.Between(1, 10) });
    }
    return items;
}

function showItems(items) {
    // Display the cat's items on the screen
    let itemList = 'Items: ';
    totalCost = 0;
    items.forEach(item => {
        itemList += `Item (${item.price} PawMoney), `;
        totalCost += item.price;
    });
    itemText.setText(itemList);
    totalCostText.setText(`Total Cost: PawMoney ${totalCost}`);
}

function scanItem() {
    // Simulate scanning an item when clicked (could be expanded with more logic)
    if (currentCat) {
        scannedItems = currentCat.items;
        showItems(scannedItems);
    }
}

function createNumberButtons(scene) {
    let startX = 600;
    let startY = 400;
    let buttonSize = 50;

    for (let i = 0; i < 10; i++) {
        let button = scene.add.text(startX + (i % 3) * buttonSize, startY + Math.floor(i / 3) * buttonSize, i, {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#ddd'
        }).setInteractive();

        button.on('pointerdown', function () {
            enterMoney(i);
        });
    }

    let enterButton = scene.add.text(startX, startY + 4 * buttonSize, 'Enter', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#00f'
    }).setInteractive();

    enterButton.on('pointerdown', finalizeTransaction);
}

function enterMoney(amount) {
    // Append the entered amount to the money given by the player
    moneyGiven = moneyGiven * 10 + amount;
    moneyGivenText.setText(`Money Given: PawMoney ${moneyGiven}`);
}

function finalizeTransaction() {
    // Calculate change and show it
    let change = moneyGiven - totalCost;
    changeText.setText(`Change: PawMoney ${change}`);
    
    // Reset for next cat
    moneyGiven = 0;
    totalCost = 0;
    scannedItems = [];
    currentCat = null;

    moneyGivenText.setText('Money Given: PawMoney 0');
    totalCostText.setText('Total Cost: PawMoney 0');
    changeText.setText('Change: PawMoney 0');
    itemText.setText('Items: ');
}
