// References to game container and layer elements.
const othelloGameContainer = document.getElementById("othello_game_container");
const gameBoardLayer = document.getElementById("game_board_layer");

// Global variables.
const cellSize = 65;
const cellBorderRadius = 2.5;
const gap = 3;

// Set container size and initialize board on window load.
window.onload = function () {
	othelloGameContainer.style.minWidth = (cellSize * 8) + (gap * 9) + "px";
	othelloGameContainer.style.minHeight = (cellSize * 8) + (gap * 9) + "px";

	drawGameBoard();
	addCornerMarkers();
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

			gameBoardLayer.appendChild(cell);
		}
	}
}

// Add corner markers to the the game board.
function addCornerMarkers() {
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
