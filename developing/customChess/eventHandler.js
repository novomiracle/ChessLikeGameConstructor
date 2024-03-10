function checkValidityOfMove(draggedPiece, move, target, direction) {
	return draggedPiece.chessPiece.pos.x + move.x * direction === parseInt(target.getAttribute("x")) && draggedPiece.chessPiece.pos.y + move.y * direction === parseInt(target.getAttribute("y"));
}

// Get all the squares on the chessboard
let squares = document.querySelectorAll(".square");

// Add event listeners to the squares for drag and drop functionality
squares.forEach(item => {
	item.addEventListener("dragover", handleDragOver);
	item.addEventListener("drop", handleDrop);
});

// Update the chessboard array
updateChessBoardArray();

// Get all the chess pieces
var pieces = document.querySelectorAll(".chessPiece");

// Add event listeners to the chess pieces for drag functionality
pieces.forEach(piece => {
	piece.addEventListener("dragstart", handleDragStart);
});

// Variable to store the dragged piece
let draggedPiece;

// Event handler for drag start
function handleDragStart(e) {
	draggedPiece = e.target;
	console.log(e.target)
}

// Event handler for moving the piece
function handleDrop(e) {
	let path;
	//checking to make sure the piece is the one that was chosen or the first
	console.log("1", draggedPiece)
	if ((chessMove == 0 || chosenPiece == draggedPiece) && gameOn) {
		let target = e.target;
		//script to choose the square not the piece
		if (e.target.classList.contains("chessPiece")) {
			////console.log(e.target.parentElement)
			target = e.target.parentElement
		}
		//checking is a move in a "path" valid and the color of the piece is the moving color
		if (draggedPiece.chessPiece.type.movement.some((item, index) => {
				// getting the path for effects
				let direction = 1;
				if (item.followDirection) {
					direction = currentColor.direction
				}
				if (item.moves.some((move) => {
						// checking does a move is equal to the coords of square
						//console.log("finding path", checkValidityOfMove(draggedPiece, move, target, direction))
						return checkValidityOfMove(draggedPiece, move, target, direction)
					})) {
					path = index
				} else {
					return false
				}
				//checking for moves in a "path"
				//console.log("condition",item.condition({
				//					x: parseInt(target.getAttribute("x")),
				//					y: parseInt(target.getAttribute("y"))
				//				}, draggedPiece.chessPiece, chessBoardArray))
				console.log(item.condition)
				console.log(item.condition({
					x: parseInt(target.getAttribute("x")),
					y: parseInt(target.getAttribute("y"))
				}, draggedPiece.chessPiece), {
					x: parseInt(target.getAttribute("x")),
					y: parseInt(target.getAttribute("y"))
				}, draggedPiece.chessPiece)
				return item.moves.some((move, moveIndex) => {
					if (item.type == "jump") {
						//console.log("checking moves jump", checkValidityOfMove(draggedPiece, move, target, direction))
						return checkValidityOfMove(draggedPiece, move, target, direction)
					} else if (item.type == "slide") {
						//console.log("do we need to check the slide condition",moveIndex != 0)
						//console.log(moveIndex)
						if (moveIndex != 0) {
							let movesUpToTheMove = item.moves.slice(0, moveIndex)
							//console.log(movesUpToTheMove,item,moveIndex)
							return movesUpToTheMove.every((move2) => {
								let chosenSquare = {
									x: draggedPiece.chessPiece.pos.x + move2.x * direction,
									y: draggedPiece.chessPiece.pos.y + move2.y * direction
								}
								//console.log("slide Condition", item.slideCondition(chosenSquare, draggedPiece.chessPiece, chessBoardArray))
								if (item.slideCondition(chosenSquare, draggedPiece.chessPiece)) {
									return checkValidityOfMove(draggedPiece, move, target, direction)
								}
							})
						} else {
							return checkValidityOfMove(draggedPiece, move, target, direction)
						}
						//							return
						//						}
					}
					//checking the specific conditions
				}) && item.condition({
					x: parseInt(target.getAttribute("x")),
					y: parseInt(target.getAttribute("y"))
				}, draggedPiece.chessPiece);
			}) && currentColor.color === draggedPiece.chessPiece.color) {
			//if the move is first in the turn making so that the other moves will be with the same piece
			if (chessMove == 0) {
				chosenPiece = draggedPiece;
			}
			//moving/adding additional effect/ promoting/removing player/checking for win
			draggedPiece.chessPiece.type.movement[path].applyAdditionalEffect({
				x: target.getAttribute("x"),
				y: target.getAttribute("y")
			}, draggedPiece.chessPiece.turns)
			chessHistory.push({
				piece: draggedPiece.chessPiece,
				from: {
					x: draggedPiece.chessPiece.pos.x,
					y: draggedPiece.chessPiece.pos.y
				},
				to: {
					x: parseInt(target.getAttribute("x")),
					y: parseInt(target.getAttribute("y"))
				}
			})
			movePiece(draggedPiece, parseInt(target.id))
			if (draggedPiece.chessPiece.type.promote.condition({
					x: target.getAttribute("x"),
					y: target.getAttribute("y")
				}, draggedPiece.chessPiece)) {
				console.log({
					x: target.getAttribute("x"),
					y: target.getAttribute("y")
				})
				promotePiece(draggedPiece, draggedPiece.chessPiece.type.promote.options)
			}
			colorOrder.forEach((color) => {
				if (checkForRoyalties(color) < royaltiesNeeded) {
					removePlayer(color)
				}
			})
			//increasing the move counter
			chessMove++;
			draggedPiece.chessPiece.allMoves++;
			//checking are there any valid moves
			if (draggedPiece.chessPiece.type.movement.every((item) => {
					let direction = 1;
					if (item.followDirection) {
						direction = currentColor.direction
					}
					if (item.type == "jump") {
						return !item.moves.every((move) => {
							let chosenSquare = {
								x: draggedPiece.chessPiece.pos.x + move.x * direction,
								y: draggedPiece.chessPiece.pos.y + move.y * direction
							}
							if (chessBoard[chosenSquare.x + chosenSquare.y * chessWidth] != undefined) {
								return item.condition(chosenSquare, draggedPiece.chessPiece);
							} else {
								return false
							}

						});
					} else if (item.type == "slide") {
						//we check if any of the moves are valid like it's a "jump" type
						if (item.moves.some((move, index) => {
								let chosenSquare = {
									x: draggedPiece.chessPiece.pos.x + move.x * direction,
									y: draggedPiece.chessPiece.pos.y + move.y * direction
								}
								//								console.log("chosen Square 2" , chosenSquare,draggedPiece.chessPiece.pos,move,direction)
								if (chessBoard[chosenSquare.x + chosenSquare.y * chessWidth] != undefined) {
									return item.condition(chosenSquare, draggedPiece.chessPiece);
								} else {
									return false
								}

							})) {
							//we find the first move that's valid and take the index
							let fineSquare = item.moves.findIndex((move, index) => {
								let chosenSquare = {
									x: draggedPiece.chessPiece.pos.x + move.x * direction,
									y: draggedPiece.chessPiece.pos.y + move.y * direction
								}
								//								console.log("chosen Square 3" , chosenSquare)
								if (chessBoard[chosenSquare.x + chosenSquare.y * chessWidth] != undefined) {
									return item.condition(chosenSquare, draggedPiece.chessPiece);
								} else {
									return false
								}
							})
							// if its zero we return false(because we can move)
							if (fineSquare == 0) {
								return false
							} else {
								//if not, we check are the moves before it check the slide condition
								let array = item.moves.slice(0, fineSquare)
								return !array.every((move) => {
									let chosenSquare = {
										x: draggedPiece.chessPiece.pos.x + move.x * direction,
										y: draggedPiece.chessPiece.pos.y + move.y * direction
									}
									//console.log("chosen Square 4" , chosenSquare)
									if (chessBoard[chosenSquare.x + chosenSquare.y * chessWidth] != undefined) {
										return item.slideCondition(chosenSquare, draggedPiece.chessPiece);
									} else {
										return false
									}
								})
							}
						} else {
							return true
						}
					}
				})) {
				chessTurns++;
				if (currentColorIndex < colorOrder.length - 1) {
					currentColorIndex++;
				} else {
					currentColorIndex = 0;
				}
				currentColor = colorOrder[currentColorIndex];
				chessMove = 0;
			}
		}
	}
}

// Event handler for drag over
function handleDragOver(e) {
	e.preventDefault();
}
