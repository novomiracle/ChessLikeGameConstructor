const conditionPrefix = "(pos,piece)=>{ console.log('check condition',pos,piece);return "
const AFPrefix = "(pos,piece)=>{"
const AFSufix = "}"
const conditionSufix = "}"
let chessPieces = []
var theGame;
let loadGameFile = document.getElementById("load")
let gameOn = true;
let chessHistory = []
let chessTurns = 0;
let chessMove = 0;
let chessBoardArray = [];
let royaltiesNeeded = 1;
let playersMin = 2;
function findSquare(pos){
	console.log("square",pos,chessBoardArray[parseInt(pos.x) + parseInt(pos.y) * chessWidth])
	return parseInt(pos.x) + parseInt(pos.y) * chessWidth
}
// Function to update the chessboard array
function updateChessBoardArray() {
	chessBoardArray = [];
	chessBoard.childNodes.forEach((square, index) => {
		if (index != 0) {
			console.log(square)
			if (square.children.length == 0) {
				chessBoardArray.push(0);
			} else {
				chessBoardArray.push(square.children[0].chessPiece);
			}
		}
	});
	chessPieces = chessBoardArray.filter((item)=>{
		return item != 0
	})
}

// Variable for storing the chosen piece
let chosenPiece;

function ChessColor(color, direction = 1) {
	return {
		color: color,
		direction: direction
	}
}
// Array of colors for turn order
let colorOrder = [ChessColor("white"), ChessColor("black", -1)];

// Index of the current color in the color order
let currentColorIndex = 0;

// Current color based on the current index
let currentColor = colorOrder[currentColorIndex];

// Function to create a chess piece prototype
function createChessPiecePrototype(name, image, royal, promote, movement) {
	let chessPiecePrototype = {
		name: name,
		image: image,
		royal: royal,
		promote: promote,
		movement: movement,
	};
	return chessPiecePrototype;
}

// Function to create a chess piece
function createChessPiece(type, pos, color) {
	let htmlEl = document.createElement("div");
	//let image = document.createElement("img")
	htmlEl.classList = "chessPiece";
	htmlEl.draggable = true;
	htmlEl.style.backgroundSize = "100%"
	htmlEl.style.backgroundImage = `url(${type.image[color]})`
//	image.classList = "centered-image"
//	image.src = type.image[color]
//	image.draggable = false
	//htmlEl.append(image)
	document.getElementById(pos.x + pos.y*chessWidth).append(htmlEl);
	let chessPiece = {	
		type: type,
		pos: pos,
		color: color,
		allMoves: 0,
		turns: 0,
	};
	chessPieces.push(chessPiece)
	htmlEl.chessPiece = chessPiece;
	return htmlEl;
}

function movePiece(piece, square) {
	//console.log("moved")
	let theSquare = chessBoard.children[square]
	theSquare.append(piece)
	piece.chessPiece.pos.x = parseInt(theSquare.getAttribute("x"))
	piece.chessPiece.pos.y = parseInt(theSquare.getAttribute("y"))
	updateChessBoardArray();
}

function clearSquare(square) {
	console.log("square",square)
	chessBoard.children[square].innerHTML = ""
}

function promotePiece(Piece, options) {
	if (gameOn) {
		let promotionGrid = document.querySelector(".promotion");
		promotionGrid.style.display = "grid"
		let optionAmount = options.length;

		var numColumns = Math.ceil(Math.sqrt(optionAmount));
		var numRows = Math.ceil(optionAmount / numColumns);

		var gridTemplateColumns = "";
		var gridTemplateRows = "";
		for (let i = 0; i < numColumns; i++) {
			gridTemplateColumns += "1fr ";
		}
		for (let j = 0; j < numRows; j++) {
			gridTemplateRows += "1fr ";
		}
		promotionGrid.innerHTML = ""
		for (let i = 0; i < optionAmount; i++) {
			let option = document.createElement("div");
			option.classList = "promotionSquare"
			gameOn = false
			option.style.backgroundImage = `url(${options[i].image[Piece.chessPiece.color]})`
			option.addEventListener("click", () => {
				//if (gameOn) {
					let num = i
					Piece.style.backgroundImage = `url(${options[num].image[Piece.chessPiece.color]})`
					Piece.chessPiece.type = options[num]
					document.querySelector(".promotion").innerHTML = ""
					document.querySelector(".promotion").style.display = "none"
					gameOn = true
				//}
			})
			promotionGrid.append(option)
		}
		// Set the grid template columns and rows properties of the container
		promotionGrid.style.gridTemplateColumns = gridTemplateColumns.trim();
		promotionGrid.style.gridTemplateRows = gridTemplateRows.trim();
	}
}

function checkForRoyalties(color) {
	return chessBoardArray.filter((piece) => {
		if (piece != 0) {
			return piece.type.royal && piece.color == color.color
		} else {
			return false
		}
	})
}

function removePlayer(color) {
	//temporary
	alert(color.color + " lost")

	colorOrder = colorOrder.filter((color1) => {
		return color1 != color
	})
	if (colorOrder.length < playersMin) {
		endOfGame(colorOrder)
	}
}

function endOfGame(colors) {
	let winPromt = "";
	colors.forEach((color, index) => {
		if (index == colors.length - 1) {
			winPromt += color.color
		} else {
			winPromt += color.color + ", "
		}
	})
	alert(winPromt + " won")
	gameOn = false
}

function ChessPieceMovementPath(moves, type = "slide",
	condition = (pos, piece) => {
		return chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth].color != piece.color && chessMove < 1;
	},
	slideCondition = (pos, piece) => {
		return chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth] == 0
	},
	applyAdditionalEffect = (pos, piece) => {
		clearSquare(parseInt(pos.x)+parseInt(pos.y)*chessWidth)
	}, direction = false) {
	return {
		moves: moves,
		type: type,
		condition: condition,
		slideCondition: slideCondition,
		applyAdditionalEffect: applyAdditionalEffect,
		followDirection: direction
	}
}

function ChessPiecePromotion(condition = false, options)
{
	return {
		condition: condition,
		options: options
	}

}

function checkLegalMoves(filter,recursion = 0){
	let lookedSquares = []
	let filteredPieces = chessPieces.filter(filter)
	filteredPieces.forEach((piece) =>{
		piece.type.movement.forEach((movepath)=>{
			let direction = colorOrder.filter((item)=>{
	return item.color == piece.color
})[0].direction
			movepath.moves.forEach((move,index) =>{
				let theMove = {x:piece.pos.x + move.x * direction, y:piece.pos.y + move.y * direction}
				if((movepath.type == "jump" ||( movepath.type == "slide" && index == 0)) && chessBoardArray[theMove.x + theMove.y * chessWidth] != undefined){
					if(movepath.condition(theMove,piece)){
						lookedSquares.push({pos:theMove,piece:piece})
					}
				}else if(movepath.type == "slide" && chessBoardArray[theMove.x + theMove.y * chessWidth] != undefined){
						 let potentialmoves = []
						 if(movepath.condition(theMove,piece)){
							 let beforeTheLegalMove = movepath.moves.slice(0,index)
							 if(beforeTheLegalMove.every((before)=>{
								 return movepath.slideCondition({x:piece.pos.x + before.x * direction, y:piece.pos.y + before.y * direction},piece)
							 })){
								 lookedSquares.push({pos:theMove,piece:piece})
							 }
						 }
				}
			})
		})
	})
	recursion ++
	if(recursion <3){
		return lookedSquares
	}else{
		return false
	}
}
function checkIsSquareSeen(filter,posa,recursion = 0){
//	let allPotentialMoves = checkLegalMoves(filter)
//	return allPotentialMoves.filter((item)=>{
//		return item.pos.x == pos.x && item.pos.y == pos.y
//	})
	let lookedSquares = []
	let filteredPieces = chessPieces.filter(filter)
	filteredPieces.forEach((piece) =>{
		piece.type.movement.forEach((movepath)=>{
			let direction = colorOrder.filter((item)=>{
	return item.color == piece.color
})[0].direction
			movepath.moves.forEach((move,index) =>{
				let theMove = {x:piece.pos.x + move.x * direction, y:piece.pos.y + move.y * direction}
				if(piece.pos.x + move.x * direction == posa.x && piece.pos.y + move.y * direction == posa.y && (movepath.type == "jump" ||( movepath.type == "slide" && index == 0)) && chessBoardArray[theMove.x + theMove.y * chessWidth] != undefined){
					if(movepath.condition(theMove,piece)){
						lookedSquares.push({piece:piece})
					}
				}else if(piece.pos.x + move.x * direction == posa.x && piece.pos.y + move.y * direction == posa.y && movepath.type == "slide" && chessBoardArray[theMove.x + theMove.y * chessWidth] != undefined){
						 let potentialmoves = []
						 if(movepath.condition(theMove,piece)){
							 let beforeTheLegalMove = movepath.moves.slice(0,index)
							 if(beforeTheLegalMove.every((before)=>{
								 return movepath.slideCondition({x:piece.pos.x + before.x * direction, y:piece.pos.y + before.y * direction},piece)
							 })){
								 lookedSquares.push({piece:piece})
							 }
						 }
				}
			})
		})
	})
	recursion ++
	if(recursion <3){
		return lookedSquares
	}else{
		return false
	}
}
function sameNotColor(same,piece){
	if(same){
		return piece.color
	}else{
		return colorOrder.find((el)=>{
			el != piece.color
		}).color
	}
}
function colorDirection(color){
	console.log("color direction",colorOrder,color)
	return colorOrder.find((el)=>{
		return el.color == color
	}).direction
}
