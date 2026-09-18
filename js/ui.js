const gameState = {
  playerScore: 0,
  computerScore: 0,
  isGameOver: false,
};

const ui = {
  playerScore: document.querySelector('#player-score'),
  computerScore: document.querySelector('#computer-score'),
  status: document.querySelector('#game-status'),
  resultMessage: document.querySelector('#result-message'),
  resultDetail: document.querySelector('#result-detail'),
  choiceButtons: document.querySelectorAll('.choice-button'),
};

function updateScoreboard() {
  ui.playerScore.textContent = String(gameState.playerScore);
  ui.computerScore.textContent = String(gameState.computerScore);
}

function setStatus(message, tone = 'neutral') {
  ui.status.textContent = message;
  ui.status.style.color =
    tone === 'win' ? '#22c55e' : tone === 'lose' ? '#ef4444' : '#fbbf24';
}

function renderRoundResult(roundResult) {
  ui.resultMessage.textContent = roundResult.title;
  ui.resultDetail.textContent = `${roundResult.detail} You chose ${roundResult.playerSelection}. Computer chose ${roundResult.computerSelection}.`;
}

function endGame(winner) {
  gameState.isGameOver = true;

  const winnerText = winner === 'player' ? 'You win the game!' : 'Computer wins the game!';
  setStatus(winnerText, winner === 'player' ? 'win' : 'lose');
  ui.resultMessage.textContent = winnerText;
  ui.resultDetail.textContent = `Final score: Player ${gameState.playerScore} - ${gameState.computerScore} Computer.`;

  ui.choiceButtons.forEach((button) => {
    button.disabled = true;
  });
}

function handleChoiceClick(event) {
  const button = event.currentTarget;
  const playerSelection = button.dataset.choice;

  if (gameState.isGameOver) {
    return;
  }

  const computerSelection = computerPlay();
  const roundResult = playRound(playerSelection, computerSelection);

  if (roundResult.outcome === 'player') {
    gameState.playerScore += 1;
  } else if (roundResult.outcome === 'computer') {
    gameState.computerScore += 1;
  }

  updateScoreboard();
  renderRoundResult(roundResult);

  if (roundResult.outcome === 'draw') {
    setStatus('It was a draw. Play again!');
  } else if (roundResult.outcome === 'player') {
    setStatus('Point to you!', 'win');
  } else {
    setStatus('Computer takes the point.', 'lose');
  }

  if (gameState.playerScore >= 5) {
    endGame('player');
    return;
  }

  if (gameState.computerScore >= 5) {
    endGame('computer');
  }
}

function initializeGame() {
  updateScoreboard();
  setStatus('First to 5 points wins.');

  ui.choiceButtons.forEach((button) => {
    button.addEventListener('click', handleChoiceClick);
  });
}

initializeGame();