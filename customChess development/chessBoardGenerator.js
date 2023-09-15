//technical HTML

// Get the chessboard element 
let chessWidth = 8;

let chessBoard = document.getElementById("chessboard");

// Define colors for light and dark squares
let lightSquareColor = "white";
let darkSquareColor = "black";

// Counter for square IDs
let squareId = 0;

// Function to create a chess square with the given color
function createChessSquare(color) {
	let chessSquare = document.createElement("div");
	chessSquare.classList = "square " + color;
	chessSquare.id = squareId;
	chessSquare.setAttribute("y", Math.floor(squareId / chessWidth))
	chessSquare.setAttribute("x", squareId - chessWidth * Math.floor(squareId / chessWidth))
	chessBoard.append(chessSquare);
	squareId++;
}

// Create the chessboard pattern
for (let i = 0; i < 4; i++) {
	for (let j = 0; j < 4; j++) {
		createChessSquare(lightSquareColor);
		createChessSquare(darkSquareColor);
	}
	for (let j = 0; j < 4; j++) {
		createChessSquare(darkSquareColor);
		createChessSquare(lightSquareColor);
	}
}
