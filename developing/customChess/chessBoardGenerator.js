//technical HTML

// Get the chessboard element 
let chessWidth = 8;
let chessHeight = 8;
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
	chessSquare.draggable = false
	chessSquare.setAttribute("y", Math.floor(squareId / chessWidth))
	chessSquare.setAttribute("x", squareId - chessWidth * Math.floor(squareId / chessWidth))
	chessBoard.append(chessSquare);
	squareId++;
}

// Create the chessboard pattern
function createChessBoard() {
	squareId = 0
	chessBoard.innerHTML = ""
	chessBoard.style.width = 80 * chessWidth + "px";
	chessBoard.style.height = 80 * chessHeight + "px";
	chessBoard.style.gridTemplateColumns = `repeat(${chessWidth}, 1fr)`
	chessBoard.style.gridTemplateRows = `repeat(${chessHeight}, 1fr)`
	let color = lightSquareColor;
	for (let i = 0; i < chessHeight; i++) {
		if (chessWidth % 2 == 0) {
			if (color == lightSquareColor) {
				color = darkSquareColor;
			} else {
				color = lightSquareColor;
			}
		}
		for (let j = 0; j < chessWidth; j++) {
			createChessSquare(color);
			if (color == lightSquareColor) {
				color = darkSquareColor;
			} else {
				color = lightSquareColor;
			}
		}
	}
}
createChessBoard()