// Get canvas and context
const canvas = document.getElementById('ecosystemCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const foodRateSlider = document.getElementById('foodRate');
const mutationRateSlider = document.getElementById('mutationRate');
const timeVal = document.getElementById('timeVal');
const creatureCount = document.getElementById('creatureCount');
const foodCount = document.getElementById('foodCount');
const avgSpeed = document.getElementById('avgSpeed');
const avgSize = document.getElementById('avgSize');
const speciesList = document.getElementById('speciesList');
const welcomeModal = document.getElementById('welcomeModal');
const startSimulationBtn = document.getElementById('startSimulationBtn');

// Simulation variables
let creatures = [];
let food = [];
let simulationRunning = false;
let frameCount = 0;
let animationFrameId;

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Utility function for random numbers and colors
const rand = (min, max) => Math.random() * (max - min) + min;
const randColor = () => `hsl(${rand(0, 360)}, 70%, 50%)`;

// Creature class
class Creature {
    constructor(x, y, parentGenome = null) {
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.age = 0;

        if (parentGenome) {
            this.genome = this.mutate(parentGenome);
        } else {
            this.genome = {
                color: randColor(),
                speed: rand(0.5, 2.5),
                size: rand(4, 10),
                sense: rand(50, 150),
                maxAge: rand(800, 1500),
                reproduceEnergy: rand(120, 180),
            };
        }
        this.applyGenome();
    }

    applyGenome() {
        this.color = this.genome.color;
        this.speed = this.genome.speed;
        this.size = this.genome.size;
        this.sense = this.genome.sense;
        this.maxAge = this.genome.maxAge;
        this.reproduceEnergy = this.genome.reproduceEnergy;
    }

    mutate(parentGenome) {
        const newGenome = JSON.parse(JSON.stringify(parentGenome));
        const mutationRate = parseFloat(mutationRateSlider.value);

        if (Math.random() < mutationRate) newGenome.speed += rand(-0.2, 0.2);
        if (Math.random() < mutationRate) newGenome.size += rand(-0.5, 0.5);
        if (Math.random() < mutationRate) newGenome.sense += rand(-10, 10);
        if (Math.random() < mutationRate) newGenome.color = randColor();

        // Clamp values to be within reasonable bounds
        newGenome.speed = Math.max(0.2, newGenome.speed);
        newGenome.size = Math.max(2, newGenome.size);
        newGenome.sense = Math.max(20, newGenome.sense);
        
        return newGenome;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Draw a "vision" circle for debugging
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.sense, 0, Math.PI * 2);
        // ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        // ctx.stroke();
    }

    update() {
        // Movement and energy loss
        const closestFood = this.findClosest(food);
        if (closestFood) {
            const angle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else { // Wander if no food is seen
            this.x += rand(-1, 1) * this.speed * 0.5;
            this.y += rand(-1, 1) * this.speed * 0.5;
        }

        this.energy -= 0.1 + (this.speed * 0.05) + (this.size * 0.02);
        this.age++;

        // Keep within bounds
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));

        // Reproduction
        if (this.energy > this.reproduceEnergy) {
            this.energy /= 2;
            creatures.push(new Creature(this.x, this.y, this.genome));
        }
    }

    findClosest(arr) {
        let closest = null;
        let closestDist = this.sense;
        for (const item of arr) {
            const dist = Math.hypot(this.x - item.x, this.y - item.y);
            if (dist < closestDist) {
                closestDist = dist;
                closest = item;
            }
        }
        return closest;
    }
}

// Food class
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'lightgreen';
        ctx.fill();
    }
}

// Simulation loop
function gameLoop() {
    if (!simulationRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn food
    if (frameCount % (25 - parseInt(foodRateSlider.value)) === 0) {
        food.push(new Food(rand(0, canvas.width), rand(0, canvas.height)));
    }

    // Update and draw food
    food.forEach(f => f.draw());

    // Update and draw creatures
    creatures.forEach((creature, i) => {
        creature.update();
        creature.draw();

        // Check for eating
        food.forEach((f, j) => {
            if (Math.hypot(creature.x - f.x, creature.y - f.y) < creature.size) {
                creature.energy += 50;
                food.splice(j, 1);
            }
        });

        // Check for death
        if (creature.energy <= 0 || creature.age > creature.maxAge) {
            creatures.splice(i, 1);
        }
    });

    // Update stats
    updateStats();

    frameCount++;
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Update UI stats
function updateStats() {
    timeVal.textContent = Math.floor(frameCount / 60);
    creatureCount.textContent = creatures.length;
    foodCount.textContent = food.length;

    if (creatures.length > 0) {
        const totalSpeed = creatures.reduce((sum, c) => sum + c.speed, 0);
        const totalSize = creatures.reduce((sum, c) => sum + c.size, 0);
        avgSpeed.textContent = (totalSpeed / creatures.length).toFixed(2);
        avgSize.textContent = (totalSize / creatures.length).toFixed(2);
        updateSpeciesList();
    } else {
        avgSpeed.textContent = '0.00';
        avgSize.textContent = '0.00';
        speciesList.innerHTML = '<p class="text-gray-400">No species present.</p>';
    }
}

function updateSpeciesList() {
    const speciesMap = new Map();
    creatures.forEach(c => {
        const color = c.genome.color;
        if (!speciesMap.has(color)) {
            speciesMap.set(color, { count: 0, genome: c.genome });
        }
        speciesMap.get(color).count++;
    });

    speciesList.innerHTML = '';
    const sortedSpecies = [...speciesMap.entries()].sort((a, b) => b[1].count - a[1].count);

    for (const [color, data] of sortedSpecies.slice(0, 5)) { // Show top 5
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 p-1 bg-gray-700/50 rounded';
        div.innerHTML = `
            <div class="w-4 h-4 rounded-full" style="background-color: ${color};"></div>
            <span>Count: ${data.count}</span>
            <span class="text-xs text-gray-400">Spd: ${data.genome.speed.toFixed(1)}</span>
            <span class="text-xs text-gray-400">Siz: ${data.genome.size.toFixed(1)}</span>
        `;
        speciesList.appendChild(div);
    }
}


// Event Listeners
startStopBtn.addEventListener('click', () => {
    simulationRunning = !simulationRunning;
    if (simulationRunning) {
        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        startStopBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
        gameLoop();
    } else {
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        startStopBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        cancelAnimationFrame(animationFrameId);
    }
});

resetBtn.addEventListener('click', () => {
    simulationRunning = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
    startStopBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    cancelAnimationFrame(animationFrameId);
    
    creatures = [];
    food = [];
    frameCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStats();
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < 5; i++) { // Spawn a small cluster
        creatures.push(new Creature(x + rand(-10, 10), y + rand(-10, 10)));
    }
    if (!simulationRunning) {
        updateStats();
        creatures.forEach(c => c.draw());
    }
});

startSimulationBtn.addEventListener('click', () => {
    welcomeModal.style.display = 'none';
});

// Initial state
updateStats();
