/**
 * CRT Monitor Simulator w/bonus Kanye quotes
 */

// Simple delay fn
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Get a random number between the specified range. h/t to wes bos for his demo which used these two fns
const getRandomBetween = (min = 20, max = 150, randomNumber = Math.random()) => Math.floor(randomNumber * (max - min) + min);

// Takes a block of text and 'types' it to the screen
async function typeIt(el) {
  const text = el.textContent;
  let progress = '';

  for (const letter of text) {
    progress += letter;
    el.textContent = progress;
    const { typeMin, typeMax } = el.dataset;
    const delay = getRandomBetween(typeMin, typeMax);
    await wait(delay);
  }
}

// Get our quote
const endpoint = 'https://api.kanye.rest';
const quoteEl = document.querySelector('.quote');

async function getQuote() {
  const response = await fetch(endpoint);
  const data = await response.json();
  quoteEl.textContent = `"${data.quote}"`;
}

// Gets a new quote and retypes only the quoted text
async function getNewQuote() {
  console.log('getting a new quote');
  await getQuote().catch(handleError);
  typeIt(quoteEl);
}

// Handle any API errors
function handleError(err) {
  console.log('Oh no! Anyway...');
  console.error(err);
  quoteEl.textContent = `Sorry, Kanye was busy.`;
}

// Handle slider inputs
const root = document.documentElement;

const handleDial = (e, prop) => {
  e.target.setAttribute("aria-valuenow", e.currentTarget.value);
  root.style.setProperty(`--${prop}`, `${e.currentTarget.value}px`);
}

// Handle color change input
const handleColorChange = (value) => {
  switch (value) {
    case 'green':
      root.style.setProperty(`--textcolor`, 'rgba(93, 200, 75, 1)');
      break;
    case 'topaz':
      root.style.setProperty(`--textcolor`, 'rgba(241, 162, 58, 1)');
      break;
    case 'teal':
      root.style.setProperty(`--textcolor`, 'teal');
      break;
    default:
      break;
  }
}

// Event listeners
document.querySelectorAll('.dial')
  .forEach(dial => {
    dial.addEventListener('input', (e) => handleDial(e, e.currentTarget.dataset.prop));
    dial.addEventListener('keydown', (e) => handleDial(e, e.currentTarget.dataset.prop));
  });

document.querySelectorAll('[name="colorscheme"]')
  .forEach(input => input.addEventListener('input', (e) => handleColorChange(e.currentTarget.value)));

document.querySelector('.get-new').addEventListener('click', getNewQuote);

// Simple initialization
async function init() {
  await getQuote().catch(handleError);

  // Find all text that needs to be typed out & execute
  document.querySelectorAll('[data-type]').forEach(typeIt);
}

init();
