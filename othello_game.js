////////// OTHELLO GAME BEHAVIOR \\\\\\\\\\

// References to game container and layer elements.
const othelloGameContainer = document.getElementById("othello_game_container");
const gameBoardLayer = document.getElementById("game_board_layer");
const discsLayer = document.getElementById("discs_layer");
const validMoveLayer = document.getElementById("valid_move_layer");

// Retrieve the selected game mode from localStorage.
let selectedMode = localStorage.getItem("selectedMode");

// If no mode is selected, default to "single_player".
if (!selectedMode) {
	selectedMode = "single_player";
}

// Log the selected mode to the console.
console.log("Selected mode:", selectedMode);

// Variables.
let cellSize;
let cellBorderRadius;
let cellGap;
let cornerMarkerSize;
let validMoveMarkerSize;
let validMoveMarkerBorderRadius;

// Keeps track of the current player's turn (1: black, 2: white).
let playerTurn = 1;

// Flag to indicate if it's AI's turn.
let isAiTurn = false;

// Variables to store the row and column of the AI's last move.
let aiLastMoveRow = null;
let aiLastMoveColumn = null;

// Initial discs setup (0: empty, 1: black, 2: white).
let discsGrid = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 2, 1, 0, 0, 0],
	[0, 0, 0, 1, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
];

function updateBoardSize(cellSize) {
	cellBorderRadius = cellSize / 25;
	cellGap = cellSize / 20;
	cornerMarkerSize = cellSize / 5;
	validMoveMarkerSize = cellSize / 5;
	validMoveMarkerBorderRadius = cellSize / 30;
}

function resizeAndRedrawBoard() {
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	// Adjust cell size based on screen width.
	if (windowWidth <= 576) {
		cellSize = 40;
		updateBoardSize(cellSize);
	} else if (windowWidth <= 768) {
		cellSize = 55;
		updateBoardSize(cellSize);
	} else if (windowWidth <= 992) {
		cellSize = 60;
		updateBoardSize(cellSize);
	} else {
		cellSize = 65;
		updateBoardSize(cellSize);
	}

	// Adjust cell size based on screen height.
	if (windowHeight <= 400) {
		cellSize = 25;
		updateBoardSize(cellSize);
	}

	// Update container dimensions.
	othelloGameContainer.style.minWidth = (cellSize * 8) + (cellGap * 9) + "px";
	othelloGameContainer.style.minHeight = (cellSize * 8) + (cellGap * 9) + "px";

	// Clear existing board.
	gameBoardLayer.innerHTML = "";

	// Redraw board elements.
	drawGameBoard();
	drawCornerMarkers();
	drawDiscs();
	drawValidMoves();
}

// Initialize the game and handle resizing when the window loads.
window.onload = function () {
	resizeAndRedrawBoard();
	updateScore();
	checkGameStatus();
	window.addEventListener("resize", resizeAndRedrawBoard);
};

// Create and position each cell of the game board.
function drawGameBoard() {
	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			const cell = document.createElement("div");

			cell.style.position = "absolute";
			cell.style.top = ((cellSize + cellGap) * row) + cellGap + "px";
			cell.style.left = ((cellSize + cellGap) * column) + cellGap + "px";
			cell.style.width = cellSize + "px";
			cell.style.height = cellSize + "px";
			cell.style.borderRadius = cellBorderRadius + "px";
			cell.style.backgroundColor = "var(--green)";
			cell.style.boxShadow = "inset 0 0 5px 0 rgba(0, 0, 0, 0.5)";

			// Attach click event to each cell.
			cell.addEventListener("click", function () {
				clickedCell(row, column);
			});

			gameBoardLayer.appendChild(cell);
		}
	}
}

// Draw corner markers on the game board.
function drawCornerMarkers() {
	const cornerMarkerPositions = [
		{ top: 2, left: 2 },
		{ top: 2, left: 6 },
		{ top: 6, left: 2 },
		{ top: 6, left: 6 }
	];

	cornerMarkerPositions.forEach(function (position) {
		const cornerMarker = document.createElement("div");

		cornerMarker.style.position = "absolute";
		cornerMarker.style.top = ((cellSize + cellGap) * position.top) + (cellGap / 2) - (cornerMarkerSize / 2) + "px";
		cornerMarker.style.left = ((cellSize + cellGap) * position.left) + (cellGap / 2) - (cornerMarkerSize / 2) + "px";
		cornerMarker.style.width = cornerMarkerSize + "px";
		cornerMarker.style.height = cornerMarkerSize + "px";
		cornerMarker.style.borderRadius = "50%";
		cornerMarker.style.backgroundColor = "var(--black)";

		gameBoardLayer.appendChild(cornerMarker);
	});
}

// Draw discs on the board.
function drawDiscs() {
	discsLayer.innerHTML = "";

	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			// Get the state of the disc (0: empty, 1: black, 2: white).
			const discState = discsGrid[row][column];

			if (discState === 0) {
				continue;
			} else {
				const disc = document.createElement("div");

				disc.style.position = "absolute";
				disc.style.top = ((cellSize + cellGap) * row) + cellGap + 5 + "px";
				disc.style.left = ((cellSize + cellGap) * column) + cellGap + 5 + "px";
				disc.style.width = (cellSize - 10) + "px";
				disc.style.height = (cellSize - 10) + "px";

				disc.classList.add("disc");

				if (discState === 1) {
					disc.classList.add("black");
				} else if (discState === 2) {
					disc.classList.add("white");
				}

				// Highlight the last move made by AI.
				if (row === aiLastMoveRow && column === aiLastMoveColumn) {
					disc.classList.add("highlighted_disc");
				}

				discsLayer.appendChild(disc);
			}
		}
	}
}

// Handle cell click event and toggle player turn.
function clickedCell(row, column) {
	// Prevent placing on occupied cell.
	if (discsGrid[row][column] != 0) {
		return;
	}

	// Prevent clicking when it's AI's turn.
	if (isAiTurn) {
		return;
	}

	// Proceed if the move is valid.
	if (isValidMove(row, column)) {
		const affectedDiscs = getAffectedDiscs(row, column);
		flipDiscs(affectedDiscs);

		// Place disc for current player.
		discsGrid[row][column] = playerTurn;

		// Switch player turn.
		if (playerTurn === 1) {
			playerTurn = 2;
		} else if (playerTurn === 2) {
			playerTurn = 1;
		}

		// If it's AI's turn, trigger AI move.
		if (playerTurn === 2 && selectedMode === "single_player") {
			isAiTurn = true;
			setTimeout(function () {
				aiTurn();
			}, 500); // Delay AI move.
		}

		drawDiscs();
		drawValidMoves();
		updateScore();
		checkGameStatus();
	}
}

// Check if the current move is valid.
function isValidMove(row, column) {
	const affectedDiscs = getAffectedDiscs(row, column);

	if (affectedDiscs.length === 0) {
		return false;
	} else {
		return true;
	}
}

// Get discs affected (to be flipped) by the move.
function getAffectedDiscs(row, column) {
	const directions = [
		{ rowOffset: -1, columnOffset: 0 },  // Up.
		{ rowOffset: 0, columnOffset: 1 },   // Right.
		{ rowOffset: 1, columnOffset: 0 },   // Bottom.
		{ rowOffset: 0, columnOffset: -1 },  // Left.
		{ rowOffset: -1, columnOffset: 1 },  // Upper-right diagonal.
		{ rowOffset: 1, columnOffset: 1 },   // Bottom-right diagonal.
		{ rowOffset: -1, columnOffset: -1 }, // Upper-left diagonal.
		{ rowOffset: 1, columnOffset: -1 }   // Bottom-left diagonal.
	];

	const affectedDiscs = [];

	// Check each direction for flippable discs.
	for (let i = 0; i < directions.length; i++) {
		const direction = directions[i];
		let couldBeAffected = [];
		let rowIterator = row + direction.rowOffset;
		let columnIterator = column + direction.columnOffset;

		// Traverse in the direction until an edge or invalid disc is found.
		while (rowIterator >= 0 && rowIterator < 8 && columnIterator >= 0 && columnIterator < 8) {
			const valueAtPosition = discsGrid[rowIterator][columnIterator];

			// Empty cell, stop.
			if (valueAtPosition === 0) {
				break;
			}

			// Valid line, flip discs.
			if (valueAtPosition === playerTurn) {
				if (couldBeAffected.length > 0) {
					affectedDiscs.push(...couldBeAffected);
				}
				break;
			}

			// Add opponent disc to list.
			couldBeAffected.push({ row: rowIterator, column: columnIterator });

			// Continue in the same direction.
			rowIterator += direction.rowOffset;
			columnIterator += direction.columnOffset;
		}
	}

	return affectedDiscs;
}

// Flip discs for the current move.
function flipDiscs(affectedDiscs) {
	for (let i = 0; i < affectedDiscs.length; i++) {
		const discsPosition = affectedDiscs[i];

		if (discsGrid[discsPosition.row][discsPosition.column] === 1) {
			discsGrid[discsPosition.row][discsPosition.column] = 2;
		} else {
			discsGrid[discsPosition.row][discsPosition.column] = 1;
		}
	}
}

// Highlight valid moves for the current player.
function drawValidMoves() {
	validMoveLayer.innerHTML = "";

	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			const cell = gameBoardLayer.children[row * 8 + column];
			const valueAtPosition = discsGrid[row][column];

			cell.style.cursor = "default";

			if (valueAtPosition === 0 && isValidMove(row, column)) {
				cell.style.cursor = "pointer";

				const validMoveMarker = document.createElement("div");

				validMoveMarker.style.position = "absolute";
				validMoveMarker.style.top = ((cellSize + cellGap) * row) + cellGap + (cellSize / 2) - (validMoveMarkerSize / 2) + "px";
				validMoveMarker.style.left = ((cellSize + cellGap) * column) + cellGap + (cellSize / 2) - (validMoveMarkerSize / 2) + "px";
				validMoveMarker.style.width = validMoveMarkerSize + "px";
				validMoveMarker.style.height = validMoveMarkerSize + "px";
				validMoveMarker.style.borderRadius = "50%";
				validMoveMarker.style.cursor = "pointer";

				validMoveMarker.addEventListener("click", function () {
					clickedCell(row, column);
				});

				if (playerTurn === 1) {
					validMoveMarker.style.border = validMoveMarkerBorderRadius + "px solid var(--black)";
				}

				if (playerTurn === 2) {
					validMoveMarker.style.border = validMoveMarkerBorderRadius + "px solid var(--white)";
				}

				validMoveLayer.appendChild(validMoveMarker);
			}
		}
	}
}

// Update the score based on the current state of the board.
function updateScore() {
	const blackScore = document.getElementById("black_score");
	const whiteScore = document.getElementById("white_score");

	let black = 0;
	let white = 0;

	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			const discState = discsGrid[row][column];

			if (discState === 1) {
				black += 1; // Count black discs.
			} else if (discState === 2) {
				white += 1; // Count white discs.
			}
		}
	}

	blackScore.innerHTML = black;
	whiteScore.innerHTML = white;

	return { black, white };
}

// Check if the current player can move.
function canPlayerMove() {
	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			if (discsGrid[row][column] === 0 && isValidMove(row, column)) {
				return true;
			}
		}
	}
	return false;
}

// Check the game status and manage turn transitions or game over scenarios.
function checkGameStatus() {
	// Check if the current player can move.
	let currentPlayerCanMove = canPlayerMove();

	if (currentPlayerCanMove) {
		// Current player can move, continue the game.
		drawValidMoves();
		return;
	} else {
		// Current player cannot move, check if the other player can move.
		let otherPlayer;

		if (playerTurn === 1) {
			otherPlayer = 2;
		} else {
			otherPlayer = 1;
		}

		// Check if the other player can move without changing the playerTurn yet.
		let originalPlayerTurn = playerTurn;
		playerTurn = otherPlayer;
		let otherPlayerCanMove = canPlayerMove();

		if (otherPlayerCanMove) {

			// Other player can move, display message and continue.
			playerTurn = otherPlayer; // Confirm the change of turn.

			setTimeout(function () {
				if (originalPlayerTurn === 1) {
					alert("The player with the ⚫️ discs cannot play and must pass his turn.");
				} else {
					alert("The player with the ⚪️ discs cannot play and must pass his turn.");
				}
			}, 0);

			drawValidMoves();

			// If it's AI's turn, trigger AI move.
			if (playerTurn === 2 && selectedMode === "single_player") {
				isAiTurn = true;
				setTimeout(function () {
					aiTurn();
				}, 500); // Delay AI move.
			}

			return;
		} else {
			// Neither player can move, the game is over.
			playerTurn = originalPlayerTurn;
			let scores = updateScore();
			let black = scores.black;
			let white = scores.white;

			setTimeout(function () {
				if (black > white) {
					alert("The winner is the player with the ⚫️ discs!");
				} else if (white > black) {
					alert("The winner is the player with the ⚪️ discs!");
				} else {
					alert("It's a Tie!");
				}

				// Remove "highlighted_disc" class from all discs.
				let highlightedDiscs = document.querySelectorAll(".highlighted_disc");
				highlightedDiscs.forEach(function (disc) {
					disc.classList.remove("highlighted_disc");
				});
			}, 0);

			return; // Game over.
		}
	}
}

// Restart the game to the initial state and redraw the board.
function restartGame() {
	discsGrid = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 2, 1, 0, 0, 0],
		[0, 0, 0, 1, 2, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];

	playerTurn = 1;
	aiLastMoveRow = null;
	aiLastMoveColumn = null;

	drawDiscs();
	drawValidMoves();
	updateScore();
}
