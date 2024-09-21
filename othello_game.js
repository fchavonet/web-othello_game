const cellSize = 65;
const gap = 3;

window.onload = function () {
	const othelloGameContainer = document.getElementById("othello_game_container");

	othelloGameContainer.style.width = (cellSize * 8) + (gap * 9) + "px";
	othelloGameContainer.style.height = (cellSize * 8) + (gap * 9) + "px";
}
