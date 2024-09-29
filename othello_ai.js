////////// OTHELLO GAME AI BEHAVIOR \\\\\\\\\\

function aiTurn() {
    let validMoves = [];

    // Iterate through the grid to find all valid moves for the AI (player 2).
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            // If the cell is empty, check if it's a valid move for the AI.
            if (discsGrid[row][column] === 0) {
                let originalPlayerTurn = playerTurn;

                // Temporarily set AI as the current player.
                playerTurn = 2;

                // If valid, store the move and its potential score (number of discs affected).
                if (isValidMove(row, column)) {
                    let affectedDiscs = getAffectedDiscs(row, column);
                    validMoves.push({
                        row: row,
                        column: column,
                        affectedDiscs: affectedDiscs,
                        score: affectedDiscs.length
                    });
                }

                // Restore the original player's turn.
                playerTurn = originalPlayerTurn;
            }
        }
    }

    // If no valid moves are found, switch back to player 1's turn.
    if (validMoves.length === 0) {
        playerTurn = 1;
        isAiTurn = false;

        // Check if the game is over or pass the turn.
        gameOver();
        return;
    }

    // Find the highest score among all valid moves.
    let maxScore = -1;

    for (let i = 0; i < validMoves.length; i++) {
        if (validMoves[i].score > maxScore) {
            maxScore = validMoves[i].score;
        }
    }

    // Collect all moves that have the maximum score.
    let bestMoves = [];

    for (let i = 0; i < validMoves.length; i++) {
        if (validMoves[i].score === maxScore) {
            bestMoves.push(validMoves[i]);
        }
    }

    // Randomly select one of the best moves (if multiple).
    let randomIndex = Math.floor(Math.random() * bestMoves.length);
    let bestMove = bestMoves[randomIndex];

    // Place the AI disc and flip the affected discs on the board.
    discsGrid[bestMove.row][bestMove.column] = 2;
    flipDiscs(bestMove.affectedDiscs);

    playerTurn = 1;
    aiLastMoveRow = bestMove.row;
    aiLastMoveColumn = bestMove.column;

    drawDiscs();
    drawValidMoves();

    updateScore();
    checkGameStatus();

    isAiTurn = false;
}
