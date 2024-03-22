let piecesPrototypes = [];
let piecesOnBoard = []
let idCount = 1;
let deleteDiv = document.getElementById("delete_place");
deleteDiv.addEventListener("drop", (ev) => {
	ev.preventDefault()
	if (document.getElementById(ev.dataTransfer.getData("text")).classList.contains("prototype_div")) {
		console.log(document.getElementById(ev.dataTransfer.getData("text")))
		piecesPrototypes.splice(piecesPrototypes.findIndex((el) => {
			return el.name == ev.dataTransfer.getData("text").name
		}), 1)
		document.getElementById(ev.dataTransfer.getData("text")).remove()
	}else{
		document.getElementById(ev.dataTransfer.getData("text")).remove()
	}
})
deleteDiv.addEventListener("dragover", (ev) => {
	ev.preventDefault()
})
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
	chessSquare.draggable = false
	chessSquare.classList = "square " + color;
	chessSquare.id = squareId;
	chessSquare.setAttribute("y", Math.floor(squareId / chessWidth))
	chessSquare.setAttribute("x", squareId - chessWidth * Math.floor(squareId / chessWidth))
	chessSquare.addEventListener("dragover", (ev) => {
		ev.preventDefault();
	})
	chessSquare.addEventListener("drop", (ev) => {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text")
		let clonneBB = document.getElementById(data).cloneNode(true);
		ev.target.innerHTML = ""
		console.log(document.getElementById(data).classList.contains("prototype_div"))
		if (document.getElementById(data).classList.contains("prototype_div")) {
			clonneBB.classList.replace("prototype_div", "piece_div")
			clonneBB.id = "piece_" + idCount
			clonneBB.addEventListener("dragstart", (ev) => {
				ev.dataTransfer.setData("text", ev.target.id);
			})
			idCount++
			ev.target.appendChild(clonneBB);
		} else {
			ev.target.appendChild(document.getElementById(data));
		}
	})

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

function updateBoardArray() {
	piecesOnBoard=[]
	chessBoard.childNodes.forEach((square, index) => {
		if (index != 0) {
			if (square.children.length != 0) {
				piecesOnBoard.push({
					name: square.children[0].attributes.name.value,
					x: parseInt(square.attributes.x.value),
					y: parseInt(square.attributes.y.value),
					color: square.children[0].attributes.color.value
				});
			}
		}
	});
}
