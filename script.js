/* 
  Project: Rock Paper Scissors Game
  Description: JavaScript logic for handling gameplay, computer choices, animations,
               and score tracking. Updates DOM elements based on player/computer choices.
  Author: Jowuan Williams
  Date: 10/1/25
*/

'use strict';

// All possible choices
const choices = ['rock','paper','scissors'];

// Image file mapping for each choice
const imgs = {
  rock: 'rock.png',
  paper: 'paper.png',
  scissors: 'scissors.png'
};

// DOM elements
const playerButtons = Array.from(document.querySelectorAll('.choice'));
const computerImg = document.getElementById('computer-img');
const thinkingEl = document.getElementById('thinking');
const resultEl = document.getElementById('result');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const tiesEl = document.getElementById('ties');
const resetBtn = document.getElementById('reset');

// Score counters
let wins=0, losses=0, ties=0;
// Timer for the "thinking shuffle"
let shuffleTimer = null;

// Add event listeners for player buttons
playerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove selection from all, highlight chosen one
    playerButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    // Start computer "thinking" animation
    startComputerTurn((computerThrow)=>{
      // After animation, decide outcome
      decideOutcome(btn.dataset.throw, computerThrow);
    });
  });
});

// Reset button
resetBtn.addEventListener('click', resetGame);

// Function: run computer's turn with animation
function startComputerTurn(done){
  thinkingEl.textContent = 'Computer is thinking…';
  if(shuffleTimer) clearInterval(shuffleTimer);

  let i = 0;
  // Shuffle between images every 0.5s
  shuffleTimer = setInterval(()=>{
    i = (i+1) % choices.length;
    computerImg.setAttribute('src', imgs[choices[i]]);
  }, 500);

  // After 3s, lock in final choice
  setTimeout(()=>{
    clearInterval(shuffleTimer);
    const final = randomChoice();
    computerImg.setAttribute('src', imgs[final]);
    thinkingEl.textContent = 'Computer chose: ' + final.toUpperCase();
    done(final);
  }, 3000);
}

// Function: pick random choice
function randomChoice(){
  return choices[Math.floor(Math.random()*choices.length)];
}

// Function: decide outcome and update scoreboard
function decideOutcome(player, computer){
  let msg = '';
  if(player === computer){
    msg = 'Tie!';
    ties++; tiesEl.textContent = String(ties);
  }else if(
    (player==='rock' && computer==='scissors') ||
    (player==='paper' && computer==='rock') ||
    (player==='scissors' && computer==='paper')
  ){
    msg = 'You win!';
    wins++; winsEl.textContent = String(wins);
  }else{
    msg = 'Computer wins.';
    losses++; lossesEl.textContent = String(losses);
  }
  resultEl.textContent = msg;
}

// Function: reset game back to start
function resetGame(){
  playerButtons.forEach(b => b.classList.remove('selected'));
  computerImg.removeAttribute('src'); // start blank instead of question.svg
  thinkingEl.textContent = 'Waiting for your choice…';
  resultEl.textContent = '—';
  wins = losses = ties = 0;
  winsEl.textContent = lossesEl.textContent = tiesEl.textContent = '0';
  if(shuffleTimer) clearInterval(shuffleTimer);
}
