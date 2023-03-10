const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const missValue = document.querySelector('#miss-value');

let bucketCounter = 0;
let totalPizzas = 0;
let score = 0;
let timer = 60;
let timerInterval;
let pizzaInterval;
let gameInProgress = true;
let pizzaWidth = 50;
let pizzaHeight = 50;



startButton.addEventListener('click', startGame);
// Add a click event listener to the restart button
resetButton.addEventListener("click", endGameAndReset);
function startGame() {
    gameInProgress = true;
    startButton.disabled = true;
  
    // Add disabled class to start button
    startButton.classList.add('disabled');
    bucketCounter = 0;
    score = 0;
    timer = 60;
    init()
    scoreValue.textContent = score;
    timerValue.textContent = timer;
    missValue.textContent = bucketCounter;
    gameArea.innerHTML = '';
    timerInterval = setInterval(updateTimer, 1000);
   
}



function updateTimer() {
    timer--;
    timerValue.textContent = timer;
    if (timer === 0 || bucketCounter >= 10) {
        
        endGame();
    }
}


function updateBucketCounter() {
    console.log("Pizza missed!");
    bucketCounter++;
    missValue.textContent = bucketCounter;
    
  }
  

  function init() {
    if (!gameInProgress) {
      return;
    }
  
    pizzaInterval = setInterval(() => {
      createPizza();
    }, 1000);
  }
  


let pizzas = [];




function animatePizza(pizza, animationDuration, onComplete) {
    console.log("Animating pizza", pizza);
    const start = performance.now();
    let animationRequestId = null;

    function animate(currentTime) {
        if (!gameInProgress) {
            cancelAnimationFrame(animationRequestId);
            return; // stop the animation if the game has ended
        }

        const elapsedTime = currentTime - start;
        const position = (elapsedTime / animationDuration) * gameArea.offsetHeight;
        pizza.style.top = `${position}px`;
        let currentTop = parseInt(pizza.style.top);
        let currentLeft = parseInt(pizza.style.left);
        let newTop = currentTop + 10;
        let newLeft = currentLeft;
        if (newTop < gameArea.clientHeight - pizzaHeight) {
            animationRequestId = requestAnimationFrame(animate);
            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft > gameArea.clientWidth - pizzaWidth) {
                newLeft = gameArea.clientWidth - pizzaWidth;
            }
            pizza.style.top = newTop + 'px';
            pizza.style.left = newLeft + 'px';
        } else {
            // Check if the pizza has fallen off the bottom of the game area
            if (currentTop +  pizza.offsetHeight + pizzaHeight >= gameArea.clientHeight) {
                console.log("Removing pizza", pizza);
               
                
                pizza.remove();
                updateBucketCounter();
          
            } else {
                onComplete();
            }
        }
    }

    animationRequestId = requestAnimationFrame(animate);
}



function createPizza() {
    if (!gameInProgress) { // check if the game is still running
      return;
    }
  
    const pizza = document.createElement("div");
    pizza.classList.add("pizza");
    pizza.style.left = `${Math.random() * (gameArea.offsetWidth - pizzaWidth)}px`;
    pizza.style.top = `${Math.random() * (gameArea.offsetHeight - pizzaHeight)}px`;
    pizza.addEventListener("click", catchPizza);
    console.log("Adding pizza to game area", pizza);
    gameArea.appendChild(pizza);
    pizzaWidth = pizza.offsetWidth;
    pizzaHeight = pizza.offsetHeight;
  
    const animationDuration = Math.max(timer * 100 / 2, 500); // the animation should last at least 2 seconds
    console.log("Starting pizza animation", pizza);
    animatePizza(pizza, animationDuration, () => {
      // Add the pizza to the array of pizzas after the animation has completed
      pizzas.push(pizza);
    });
  }
  


  function catchPizza(event) {
    if (event.target.classList.contains("pizza") && gameInProgress) {
        const pizza = event.target;
        
        score++;
        scoreValue.textContent = score;

        // Remove the pizza from the array of pizzas
        pizzas = pizzas.filter(p => p !== event.target);

            // Add the "pop" class to the pizza to trigger the animation
        pizza.classList.add("pop");
        setTimeout(() => {
          pizza.remove();
        }, 200);

    }
}


function endGame() {
    clearInterval(timerInterval);
    clearInterval(pizzaInterval);
    gameInProgress = false;
    
    // Remove any remaining pizzas from the game area
    const remainingPizzas = document.querySelectorAll('.pizza');
    remainingPizzas.forEach(pizza => pizza.remove());
    
    pizzas = [];
    startButton.disabled = false;
   
    startButton.classList.remove('disabled');
    alert(`Game Over! Your score is ${score}.`);
  }
  
  function endGameAndReset() {
    clearInterval(timerInterval);
    clearInterval(pizzaInterval);
    gameInProgress = false;

    startButton.disabled = false;
   
    startButton.classList.remove('disabled');
  
    // Reset counter, score, and time
    bucketCounter = 0;
    score = 0;
    timer = 60;
  
    // Update counter, score, and time elements on the page
    scoreValue.textContent = score;
    timerValue.textContent = timer;
    missValue.textContent = bucketCounter;
  
    // Remove any remaining pizzas from the game area
    const remainingPizzas = document.querySelectorAll('.pizza');
    remainingPizzas.forEach(pizza => pizza.remove());
  
    pizzas = [];
    startButton.disabled = false;
    console.clear();
  
    // Restart the game
    init();

    
  }
  
  

  

  








