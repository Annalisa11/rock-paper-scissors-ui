const VALID_CHOICES = ['Rock', 'Paper', 'Scissors'];
const WIN_CONDITIONS = {
  Rock: 'Scissors',
  Paper: 'Rock',
  Scissors: 'Paper',
};

function computerPlay() {
  const randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  return VALID_CHOICES[randomIndex];
}

function playRound(playerSelection, computerSelection = computerPlay()) {
  const normalizedSelection = playerSelection.trim();

  if (!VALID_CHOICES.includes(normalizedSelection)) {
    throw new Error(
      `Invalid player selection: "${playerSelection}". Choose Rock, Paper, or Scissors.`,
    );
  }

  if (!VALID_CHOICES.includes(computerSelection)) {
    throw new Error(
      `Invalid computer selection: "${computerSelection}". Choose Rock, Paper, or Scissors.`,
    );
  }

  if (playerSelection === computerSelection) {
    return {
      outcome: 'draw',
      title: 'Draw!',
      detail: `Both players chose ${playerSelection}.`,
      playerSelection,
      computerSelection,
    };
  }

  if (WIN_CONDITIONS[playerSelection] === computerSelection) {
    return {
      outcome: 'player',
      title: 'You win!',
      detail: `${playerSelection} beats ${computerSelection}.`,
      playerSelection,
      computerSelection,
    };
  }

  return {
    outcome: 'computer',
    title: 'Computer wins!',
    detail: `${computerSelection} beats ${playerSelection}.`,
    playerSelection,
    computerSelection,
  };
}
