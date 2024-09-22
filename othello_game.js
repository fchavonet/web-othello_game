// References to game container and layer elements.
const othelloGameContainer = document.getElementById("othello_game_container");
const gameBoardLayer = document.getElementById("game_board_layer");
const piecesLayer = document.getElementById("pieces_layer");
const validMoveLayer = document.getElementById("valid_move_layer");

// Global variables.
const cellSize = 65;
const cellBorderRadius = 2.5;
const gap = 3;

// Keeps track of the current player's turn (1: black, 2: white).
let playerTurn = 1;

// Initial pieces setup (0: empty, 1: black, 2: white).
let piecesGrid = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 2, 1, 0, 0, 0],
	[0, 0, 0, 1, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
]

// Set container size and initialize board on window load.
window.onload = function () {
	othelloGameContainer.style.minWidth = (cellSize * 8) + (gap * 9) + "px";
	othelloGameContainer.style.minHeight = (cellSize * 8) + (gap * 9) + "px";

	drawGameBoard();
	drawCornerMarkers();
	drawPieces();
	drawValidMove();
	updateScore()
}

// Create and position each cell of the game board.
function drawGameBoard() {
	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			const cell = document.createElement("div");

			cell.style.position = "absolute";
			cell.style.top = ((cellSize + gap) * row) + gap + "px";
			cell.style.left = ((cellSize + gap) * column) + gap + "px";
			cell.style.width = cellSize + "px";
			cell.style.height = cellSize + "px";
			cell.style.borderRadius = cellBorderRadius + "px";
			cell.style.backgroundColor = "var(--green)";
			cell.style.boxShadow = "inset 0 0 5px 0 rgba(0, 0, 0, 0.5)";

			// Attach click event to each cell.
			cell.setAttribute("onClick", "clickedCell(" + row + ", " + column + ")");

			gameBoardLayer.appendChild(cell);
		}
	}
}

// Draw corner markers to the the game board.
function drawCornerMarkers() {
	const cornerMarkerPositions = [
		{ top: 2, left: 2 },
		{ top: 2, left: 6 },
		{ top: 6, left: 2 },
		{ top: 6, left: 6 }
	];

	cornerMarkerPositions.forEach(position => {
		const cornerMarker = document.createElement("div");

		cornerMarker.style.position = "absolute";
		cornerMarker.style.top = ((cellSize + gap) * position.top) - (gap / 2) - 3 + "px";
		cornerMarker.style.left = ((cellSize + gap) * position.left) - (gap / 2) - 3 + "px";
		cornerMarker.style.width = "12px";
		cornerMarker.style.height = "12px";
		cornerMarker.style.borderRadius = "50%";
		cornerMarker.style.backgroundColor = "var(--black)";

		gameBoardLayer.appendChild(cornerMarker);
	});
}

// Draw pieces on the board.
function drawPieces() {
	piecesLayer.innerHTML = "";

	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			// Get the state of the piece (0: empty, 1: black, 2: white).
			const pieceState = piecesGrid[row][column];

			if (pieceState == 0) {
				continue;
			}
			else {
				const piece = document.createElement("div");

				piece.style.position = "absolute";
				piece.style.top = ((cellSize + gap) * row) + gap + 5 + "px";
				piece.style.left = ((cellSize + gap) * column) + gap + 5 + "px";
				piece.style.width = (cellSize - 10) + "px";
				piece.style.height = (cellSize - 10) + "px";

				piece.classList.add("piece");

				if (pieceState == 1) {
					piece.classList.add("black");
				}
				else if (pieceState == 2) {
					piece.classList.add("white");
				}

				piecesLayer.appendChild(piece);
			}
		}
	}
}

// Handle cell click event and toggle player turn.
function clickedCell(row, column) {
	// Prevent placing on occupied cell.
	if (piecesGrid[row][column] != 0) {
		return;
	}

	// Proceed if the move is valid.
	if (isValidMove(row, column) == true) {
		const affectedPieces = getAffectedPieces(row, column);
		flipPieces(affectedPieces);

		// Place piece for current player.
		piecesGrid[row][column] = playerTurn;

		// Switch player turn.
		if (playerTurn == 1) {
			playerTurn = 2;
		}
		else if (playerTurn == 2) {
			playerTurn = 1;
		}
	}

	drawPieces();
	drawValidMove();
	updateScore();
}

// Check if the current move is valid.
function isValidMove(row, column) {
	const affectedPieces = getAffectedPieces(row, column);

	if (affectedPieces.length == 0) {
		return false;
	}
	else {
		return true;
	}
}

// Get pieces affected (to be flipped) by the move.
function getAffectedPieces(row, column) {
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

	const affectedPieces = [];

	// Check each direction for flippable pieces.
	for (let direction of directions) {
		let couldBeAffected = [];
		let rowIterator = row + direction.rowOffset;
		let columnIterator = column + direction.columnOffset;

		// Traverse in the direction until an edge or invalid piece is found.
		while (rowIterator >= 0 && rowIterator < 8 && columnIterator >= 0 && columnIterator < 8) {
			const valueAtPosition = piecesGrid[rowIterator][columnIterator];

			// Empty cell, stop.
			if (valueAtPosition == 0) {
				break;
			}

			// Valid line, flip pieces.
			if (valueAtPosition == playerTurn) {
				affectedPieces.push(...couldBeAffected);
				break;
			}

			// Add opponent piece to list.
			couldBeAffected.push({ row: rowIterator, column: columnIterator });

			// Continue in the same direction.
			rowIterator += direction.rowOffset;
			columnIterator += direction.columnOffset;
		}
	}

	return affectedPieces;
}

// Flip pieces for the current move.
function flipPieces(affectedPieces) {
	for (let i = 0; i < affectedPieces.length; i++) {
		const piecesPosition = affectedPieces[i];

		if (piecesGrid[piecesPosition.row][piecesPosition.column] == 1) {
			piecesGrid[piecesPosition.row][piecesPosition.column] = 2;
		}
		else {
			piecesGrid[piecesPosition.row][piecesPosition.column] = 1;
		}
	}
}

//
function drawValidMove() {
	validMoveLayer.innerHTML = "";

	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			const valueAtPosition = piecesGrid[row][column];

			if (valueAtPosition == 0 && isValidMove(row, column)) {
				const validMoveMarker = document.createElement("div");

				validMoveMarker.style.position = "absolute";
				validMoveMarker.style.top = ((cellSize + gap) * row) + gap + 27.5 + "px";
				validMoveMarker.style.left = ((cellSize + gap) * column) + gap + 27.5 + "px";
				validMoveMarker.style.width = (cellSize - 55) + "px";
				validMoveMarker.style.height = (cellSize - 55) + "px";
				validMoveMarker.style.borderRadius = "50%";

				validMoveMarker.setAttribute("onClick", "clickedCell(" + row + ", " + column + ")");

				if (playerTurn == 1) {
					validMoveMarker.style.border = "2px solid var(--black)";
				}

				if (playerTurn == 2) {
					validMoveMarker.style.border = "2px solid var(--white)";
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
			const pieceState = piecesGrid[row][column];

			if (pieceState == 1) {
				black += 1; // Count black pieces.
				blackScore.innerHTML = black;
			}
			else if (pieceState == 2) {
				white += 1; // Count white pieces.
				whiteScore.innerHTML = white;
			}
		}
	}
}
