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
  Rock: `
    <svg viewBox="0 0 64 64" role="img" aria-label="Rock">
      <defs>
        <linearGradient id="rockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d5d9e2" />
          <stop offset="55%" stop-color="#8ea0b7" />
          <stop offset="100%" stop-color="#586a7d" />
        </linearGradient>
      </defs>
      <path d="M21 12c10-8 27-7 35 5 7 12 4 31-9 39-10 7-25 6-34-4-9-9-8-29 8-40Zm6 10 7 2 3-8 6 3 3 8 8 5-5 7-9 2-10-2-7-8 4-9Z" fill="url(#rockGradient)"/>
      <circle cx="28" cy="24" r="4" fill="rgba(255,255,255,0.55)" />
      <circle cx="38" cy="36" r="3.5" fill="rgba(255,255,255,0.42)" />
    </svg>
  `,
  Paper: `
    <svg viewBox="0 0 64 64" role="img" aria-label="Paper">
      <defs>
        <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fefefe" />
          <stop offset="100%" stop-color="#dfe7f1" />
        </linearGradient>
      </defs>
      <path d="M18 12h22l10 10v29c0 3-2 5-5 5H18c-3 0-5-2-5-5V17c0-3 2-5 5-5Z" fill="url(#paperGradient)"/>
      <path d="M40 12v10h10" fill="none" stroke="#bfd0df" stroke-width="3" stroke-linejoin="round"/>
      <path d="M24 28h16M24 35h20M24 42h17" stroke="#8aa0b1" stroke-width="3" stroke-linecap="round"/>
      <path d="M25 16l11 11" stroke="#dfe7f1" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,
  Scissors: `
    <svg viewBox="0 0 64 64" role="img" aria-label="Scissors">
      <defs>
        <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      <g stroke-linecap="round" stroke-linejoin="round">
        <circle cx="20" cy="18" r="8" fill="none" stroke="#e2e8f0" stroke-width="4"/>
        <circle cx="44" cy="18" r="8" fill="none" stroke="#e2e8f0" stroke-width="4"/>
        <path d="M20 26 28 36 20 48" stroke="#e2e8f0" stroke-width="4"/>
        <path d="M44 26 36 36 44 48" stroke="#e2e8f0" stroke-width="4"/>
        <path d="M28 36h8" stroke="#e2e8f0" stroke-width="4"/>
        <path d="M22 18 12 12m18 6 12-8M22 18 8 26M42 18l14 8" stroke="#cbd5e1" stroke-width="3"/>
        <path d="M18 40 8 54M46 40l10 14" stroke="url(#bladeGradient)" stroke-width="5"/>
        <path d="M12 32 22 40 12 52" fill="url(#bladeGradient)"/>
        <path d="M52 32 42 40 52 52" fill="url(#bladeGradient)"/>
      </g>
    </svg>
  `,
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
