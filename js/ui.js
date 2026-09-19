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
  playerPick: document.querySelector('#player-pick'),
  computerPick: document.querySelector('#computer-pick'),
  choiceButtons: document.querySelectorAll('.choice-button'),
  helpButton: document.querySelector('.help-button'),
  helpPanel: document.querySelector('#help-panel'),
};

const choiceIcons = {
  Rock: '🪨',
  Paper: '📄',
  Scissors: '✂️',
  '?': '?',
};

function renderChoice(element, choice) {
  element.innerHTML = choiceIcons[choice] ?? choiceIcons['?'];
  element.setAttribute('aria-label', `Selected ${choice}`);
}

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
  renderChoice(ui.playerPick, roundResult.playerSelection);
  renderChoice(ui.computerPick, roundResult.computerSelection);

  ui.resultMessage.textContent = roundResult.title;
  ui.resultDetail.textContent = roundResult.detail;
}

function endGame(winner) {
  gameState.isGameOver = true;

  const winnerText = winner === 'player' ? 'You win!' : 'CPU wins!';
  setStatus(winnerText, winner === 'player' ? 'win' : 'lose');
  ui.resultMessage.textContent = winnerText;
  ui.resultDetail.textContent = `Final: ${gameState.playerScore} - ${gameState.computerScore}`;

  ui.choiceButtons.forEach((button) => {
    button.disabled = true;
  });
}

function toggleHelp() {
  const isExpanded = ui.helpButton.getAttribute('aria-expanded') === 'true';
  ui.helpButton.setAttribute('aria-expanded', String(!isExpanded));
  ui.helpPanel.hidden = isExpanded;
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
    setStatus('Draw', 'neutral');
  } else if (roundResult.outcome === 'player') {
    setStatus('You scored', 'win');
  } else {
    setStatus('CPU scored', 'lose');
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
  renderChoice(ui.playerPick, '?');
  renderChoice(ui.computerPick, '?');
  setStatus('First to 5 wins', 'neutral');
  ui.helpButton.addEventListener('click', toggleHelp);

  ui.choiceButtons.forEach((button) => {
    button.addEventListener('click', handleChoiceClick);
  });
}

initializeGame();
