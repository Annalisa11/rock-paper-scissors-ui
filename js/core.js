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
  
  if (
    typeof playerSelection !== 'string' ||
    typeof computerSelection !== 'string'
  ) {
    throw new TypeError("Selections must be strings.");
  }

  const player = playerSelection.trim();
  const computer = computerSelection.trim();
  
  if (!VALID_CHOICES.includes(player)) {
    throw new Error(
      `Invalid player selection: "${playerSelection}". Choose Rock, Paper, or Scissors.`,
    );
  }

  if (!VALID_CHOICES.includes(computer)) {
    throw new Error(
      `Invalid computer selection: "${computerSelection}". Choose Rock, Paper, or Scissors.`,
    );
  }

  if (player === computer) {
    return {
      outcome: 'draw',
      title: 'Draw!',
      detail: `Both players chose ${player}.`,
      playerSelection: player,
      computerSelection: computer,
    };
  }

  if (WIN_CONDITIONS[player] === computer) {
    return {
      outcome: 'player',
      title: 'You win!',
      detail: `${player} beats ${computer}.`,
      playerSelection: player,
      computerSelection: computer,
    };
  }

  return {
    outcome: 'computer',
    title: 'Computer wins!',
    detail: `${computer} beats ${player}.`,
    playerSelection: player,
    computerSelection: computer,
  };
}
