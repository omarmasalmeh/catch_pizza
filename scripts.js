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
resetButton.addEventListener('click', endGameAndReset)
function startGame() {
    gameInProgress = true;
    startButton.disabled = true;
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
  
    const animationDuration = Math.max(timer * 100 / 2, 1000); // the animation should last at least 2 seconds
    console.log("Starting pizza animation", pizza);
    animatePizza(pizza, animationDuration, () => {
      // Add the pizza to the array of pizzas after the animation has completed
      pizzas.push(pizza);
    });
  }
  


  function catchPizza(event) {
    if (event.target.classList.contains("pizza") && gameInProgress) {
        event.target.remove();
        score++;
        scoreValue.textContent = score;

        // Remove the pizza from the array of pizzas
        pizzas = pizzas.filter(p => p !== event.target);

        // Add a pop animation
        const pop = document.createElement("div");
        pop.classList.add("pop");
        if (event.type === "click") {
            pop.style.top = `${event.clientY - gameArea.offsetTop - 25}px`;
            pop.style.left = `${event.clientX - gameArea.offsetLeft - 25}px`;
        } else if (event.type === "touchstart") {
            const touch = event.touches[0];
            pop.style.top = `${touch.clientY - gameArea.offsetTop - 25}px`;
            pop.style.left = `${touch.clientX - gameArea.offsetLeft - 25}px`;
        }
        gameArea.appendChild(pop);
        setTimeout(() => {
            pop.remove();
        }, 1000);
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
    alert(`Game Over! Your score is ${score}.`);
  }
  

  function endGameAndReset() {
    
    clearInterval(timerInterval);
    clearInterval(pizzaInterval);
    gameInProgress = false;
    
    // Remove any remaining pizzas from the game area
    const remainingPizzas = document.querySelectorAll('.pizza');
    remainingPizzas.forEach(pizza => pizza.remove());
    
    pizzas = [];
    startButton.disabled = false;
    
    location.reload();
  }


  








