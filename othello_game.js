// References to game container and layer elements.
const othelloGameContainer = document.getElementById("othello_game_container");
const gameBoardLayer = document.getElementById("game_board_layer");
const piecesLayer = document.getElementById("pieces_layer");

// Global variables.
const cellSize = 65;
const cellBorderRadius = 2.5;
const gap = 3;

// Keeps track of the current player's turn (1: black, 2: white).
let playerTurn = 1;

// Initial pieces setup (0: empty, 1: black, 2: white).
let pieces = [
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
			const pieceState = pieces[row][column];

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
	pieces[row][column] = playerTurn;

	if (playerTurn == 1) {
		playerTurn = 2;
	}
	else if (playerTurn = 2) {
		playerTurn = 1;
	}

	drawPieces();
}