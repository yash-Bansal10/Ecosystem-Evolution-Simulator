# Interactive Ecosystem Evolution Simulator & Explainer

This project is a self-contained, single-page web application that provides an interactive simulation of a virtual ecosystem. It's designed not only to demonstrate the principles of evolution and natural selection but also to serve as a learning tool by interactively deconstructing its own source code.

Users can watch digital creatures evolve, compete for resources, and pass on their traits, while simultaneously exploring the code concepts that power the simulation.

![Ecosystem Evolution Simulator](https://github.com/user-attachments/assets/49a59902-2b46-4e2e-9c2e-9794ff7c71a5)

**View the live Demo on my Portfolio: [https://iamyashbansal.vercel.app](https://iamyashbansal.vercel.app)**

---

## ✨ Features

* **Live Evolution Simulation:** A dynamic canvas where digital creatures are born, move, eat, reproduce, and die.
* **Interactive Controls:** Start, stop, and reset the simulation. Add new creatures with a click.
* **Real-Time Parameter Tuning:** Adjust the food spawn rate and genetic mutation rate on the fly using sliders.
* **Live Data Visualization:** A dynamic line chart powered by Chart.js tracks the population and average traits (like speed and size) over time, visually demonstrating evolutionary trends.
* **Interactive Code Explainers:**
    * **The DNA:** A section with sliders that lets you visually manipulate a creature's "genome" and see its appearance change instantly.
    * **The Engine:** An interactive flowchart of the `gameLoop()` function. Hover over each step to see the corresponding code snippet, demystifying the core animation logic.
* **Fully Responsive Design:** A clean, modern UI built with Tailwind CSS that works seamlessly on desktops, tablets, and mobile devices.
* **Zero Dependencies:** The entire application is a single `index.html` file with no external files to manage or build steps required.

---

## 🚀 How To Use

This project is designed for simplicity. To run it locally:

1.  Clone this repository or download the `index.html` file.
2.  Open the `index.html` file in any modern web browser (like Chrome, Firefox, or Edge).
3.  That's it! The simulation and explainer will be fully functional.

---

## 🛠️ Technology Stack

This application is built with vanilla web technologies, emphasizing a lightweight and accessible approach.

* **HTML5:** Structures the content and layout of the application.
* **CSS3:** Used for minor custom styling, such as the "frosted glass" effect.
* **Tailwind CSS (v3):** A utility-first CSS framework (loaded via CDN) for the entire responsive layout and component styling.
* **JavaScript (ES6+):** Powers all the simulation logic, interactivity, DOM manipulation, and state management.
* **Chart.js (v4):** A modern charting library (loaded via CDN) used to render the dynamic evolution graph on an HTML5 Canvas.

---

## 🧠 Core Concepts Explained

This project is an excellent case study for several key web development and programming concepts:

* **Object-Oriented Programming (OOP):** The simulation uses JavaScript classes (`Creature`, `Food`) as blueprints to create and manage hundreds of independent objects, each with its own properties (state) and methods (behavior).

* **HTML5 Canvas API:** All visual elements within the simulation (creatures, food) are drawn programmatically onto a `<canvas>` element. This demonstrates direct, pixel-level control for creating dynamic graphics and animations.

* **The Animation Loop (`requestAnimationFrame`):** The smooth motion is achieved via a `gameLoop` function that repeatedly clears, updates, and redraws the canvas. `requestAnimationFrame` is used to optimize this loop for performance and efficiency, synchronizing it with the browser's refresh rate.

* **DOM Manipulation:** JavaScript is used to dynamically update the content of HTML elements outside the canvas, such as the statistics panel, button text, and interactive code displays.

* **Evolutionary Algorithm (Simplified):** The core logic mimics natural selection:
    * **Genome:** Each creature has a `genome` object defining its traits.
    * **Selection:** Creatures with traits better suited for finding food gain more energy and are more likely to reproduce. Creatures that fail to find food run out of energy and "die."
    * **Inheritance & Mutation:** Offspring inherit the genome from their parent, but a small, random mutation rate can alter these traits, introducing variation into the population.

---

## 🔮 Future Enhancements

This project has a solid foundation that can be extended in many ways:

* **Predation:** Introduce a second type of creature that hunts the first.
* **Environmental Factors:** Add terrain that affects speed, or "seasons" that change the food availability.
* **Advanced Genetics:** Implement more complex traits, like camouflage (color matching the background) or energy efficiency.
* **Data Persistence:** Use `localStorage` to save the state of a simulation so it can be revisited later.

This project was created as a demonstration of building interactive, data-driven applications using modern frontend technologies. Feel free to fork, modify, and learn from it!
