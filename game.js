
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => [...board]; // ! not currently private

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    //Print in console
    const printBoard = () => {
        console.log(`${board[0]} | ${board[1]} | ${board[2]}`);
        console.log(`---------`);
        console.log(`${board[3]} | ${board[4]} | ${board[5]}`);
        console.log(`---------`);
        console.log(`${board[6]} | ${board[7]} | ${board[8]}`);
    };

    return { getBoard, resetBoard, placeMarker, printBoard };
})();

Gameboard.printBoard();



const createPlayer = (name, marker) => {
    return { name, marker };
};


const DisplayGame = (() => {

    const boardContainer = document.querySelector("#gameboard");
    const resultDisplay = document.querySelector("#result");
    const player1Input = document.querySelector("#player1-name");
    const player2Input = document.querySelector("#player2-name");
    const startButton = document.querySelector("#start-button");
    
    const displayBoard = () => {
        boardContainer.innerHTML = ""; 
        const board = Gameboard.getBoard(); 


        board.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell; // Set X or O
            cellElement.dataset.index = index; // Store index for event handling
            
            // Add click event listener to each cell
            cellElement.addEventListener("click", () => {
                GameController.playRound(index);
            });
            
            boardContainer.appendChild(cellElement);

        });
    };

    const showResult = (message) => {
        resultDisplay.textContent = message;
    };

    const getPlayerNames = () => ({
        player1: player1Input.value || "Player 1",
        player2: player2Input.value || "Player 2",
    });

    startButton.addEventListener("click", () => {
        GameController.startGame();
    });



    return { displayBoard, showResult, getPlayerNames };
})();


const GameController = (() => {
    // const player1 = createPlayer("Player 1", "X");
    // const player2 = createPlayer("Player 2", "O");

    // let currentPlayer = player1;
    // let gameOver = false;

    let player1, player2;
    let currentPlayer;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (index) => {
        if (gameOver) {
            Display.showResult("Game over! Press restart.");
            return;
        }

        if (Gameboard.placeMarker(index, currentPlayer.marker)) {
            DisplayGame.displayBoard();

            if (checkWinner()) {
                DisplayGame.showResult(`${currentPlayer.name} wins! 🎉`);
                gameOver = true;
                return;
            }

            switchPlayer();
            DisplayGame.showResult(`${currentPlayer.name}'s turn`);
        } else {
            DisplayGame.showResult("Invalid move, try again.");
        }
    };

    const checkWinner = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];

        const board = Gameboard.getBoard();

        for (let [a, b, c] of winningCombos) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }

        if (!board.includes("")) {
            DisplayGame.showResult("It's a tie! 🤝");
            gameOver = true;
            return "TIE";
        }

        return false;
    };

    const startGame = () => {
        const playerNames = DisplayGame.getPlayerNames();
        player1 = { name: playerNames.player1, marker: "X" };
        player2 = { name: playerNames.player2, marker: "O" };
        currentPlayer = player1;
        gameOver = false;

        Gameboard.resetBoard();
        DisplayGame.displayBoard();
        DisplayGame.showResult(`${currentPlayer.name}'s turn`);
    };


    return { playRound, startGame };
})();


GameController.startGame();
