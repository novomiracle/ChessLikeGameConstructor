let WidthBoard = 8;
let dublicateButton = document.getElementById("dublicate");
let deleteButton = document.getElementById("delete");
let context;
let contextMenu = document.getElementById("context_menu");
let idForBB = 0
let saveButton = document.getElementById("save_button")
let chessPieceName = document.getElementById("chess_piece_name").value;
let isRoyal = document.getElementById("royal")
let promotionButton = document.getElementById("add_piece_for_promotion")
let deletePromotionButton = document.getElementById("delete_piece_for_promotion")
let promotionCondition = document.getElementById("promotion_condition")
let promotionPieces = document.getElementById("promotion")
let draggableBlockTemplates = document.getElementsByClassName("block_template");
let buildingContainers = document.getElementsByClassName("building_containers");
let pathesInfo = [];
let additionalEffectBuildingBlocks = document.getElementsByClassName("AF_BB");
let movementCanvas = document.getElementById("movementVisualisation");
let addColor = document.getElementById("addColor")
let ctx = movementCanvas.getContext("2d")
let pixelSize = 12;
let movementInfo = []
let chessPieceImageUrlW = document.getElementById("chess_piece_image_url_white")
let chessPieceImageW = document.getElementById("chess_piece_image_white")
let chessPieceImageUrlB = document.getElementById("chess_piece_image_url_black")
let chessPieceImageB = document.getElementById("chess_piece_image_black")

function allPromotionPieces() {
	let rt = "";
	for (let i = 0; i < promotionPieces.children.length; i++) {
		if (i > 0) {
			rt += ", "
		}
		rt += "'" + promotionPieces.children[i].children[0].value + "'"
	}
	return rt
}
chessPieceImageUrlW.addEventListener("change", (e) => {
	chessPieceImageW.src = chessPieceImageUrlW.value
})
chessPieceImageUrlB.addEventListener("change", (e) => {
	chessPieceImageB.src = chessPieceImageUrlB.value
})
saveButton.addEventListener("click", () => {
	saveChessPiece()
})
ctx.fillStyle = "black"
ctx.font = "1px"
ctx.fillRect(Math.floor(movementCanvas.width / (2 * pixelSize)) * pixelSize, Math.floor(movementCanvas.height / (2 * pixelSize)) * pixelSize, pixelSize, pixelSize)
movementCanvas.addEventListener("click", (e) => {
	ctx.fillStyle = color
	//if the square is empty
	if (ctx.getImageData(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data.every((item) => {
			return item == 0
		})) {
		let thePath = pathesInfo.filter((item) => {
			return item.color == color
		})[0]
		ctx.fillRect(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, pixelSize, pixelSize)
		ctx.fillStyle = "black"
		ctx.fillText(thePath.num, Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize + pixelSize)
		ctx.fillStyle = color
		movementInfo.push({
			x: Math.floor(e.offsetX / pixelSize) - Math.floor(movementCanvas.width / (2 * pixelSize)),
			y: Math.floor(e.offsetY / pixelSize) - Math.floor(movementCanvas.height / (2 * pixelSize)),
			color: ctx.fillStyle,
			number: thePath.num
		})
		thePath.num++
		// if the square is taken
	}
})
promotionButton.addEventListener("click", (e) => {
	let div = document.createElement("div");
	let input = document.createElement("input");
	input.classList.add("inputClass2")
	div.append(input)
	document.getElementById("promotion").append(div)
})
deletePromotionButton.addEventListener("click", (e) => {
	document.getElementById("promotion").children[document.getElementById("promotion").children.length - 1].remove()
})
movementCanvas.addEventListener("dblclick", (e) => {
	if (!(ctx.getImageData(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[0] == 0 && ctx.getImageData(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[1] == 0 && ctx.getImageData(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[2] == 0 && ctx.getImageData(Math.floor(e.offsetX / pixelSize) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[3] == 255)) {
		//for sliding
		let theSquareInArrayIndex = movementInfo.findIndex((item) => {
			return item.x == Math.floor(e.offsetX / pixelSize) - Math.floor(movementCanvas.width / (2 * pixelSize)) && item.y == Math.floor(e.offsetY / pixelSize) - Math.floor(movementCanvas.height / (2 * pixelSize))
		})
		let thePath = pathesInfo.filter((item) => {
			let rgb = item.color.replace("rgb(", "").replace(")", "").split(",")
			for (let i = 0; i < rgb.length; i++) {
				rgb[i] = parseInt(rgb[i])
			}
			//console.log(rgbToHex(rgb), movementInfo[theSquareInArrayIndex].color)
			return rgbToHex(rgb) == movementInfo[theSquareInArrayIndex].color
		})[0]
		//console.log(thePath, pathesInfo)
		thePath.num = movementInfo[theSquareInArrayIndex].number
		let removeThose = movementInfo.filter((item) => {
			return item.color == movementInfo[theSquareInArrayIndex].color && item.number >= movementInfo[theSquareInArrayIndex].number
		})
		if (thePath.type == "slide") {
			removeThose.forEach((item) => {
				movementInfo.splice(movementInfo.findIndex((item2) => {
					return item.color == item2.color && item.number == item2.number
				}), 1)
				ctx.clearRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
			})
		} else {
			ctx.clearRect(movementInfo[theSquareInArrayIndex].x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), movementInfo[theSquareInArrayIndex].y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
			movementInfo.splice(theSquareInArrayIndex, 1)
		}

	}
})

function addPath() {
	let div = document.createElement("div");
	let colorDiv = document.createElement("div");
	let type = document.createElement("select");
	let typeJump = document.createElement("option");
	let typeSlide = document.createElement("option")
	let condition = document.createElement("div");
	let slideCondition = document.createElement("div");
	let choose = document.createElement("button");
	let deleteButton = document.createElement("button");
	let additionalEffects = document.createElement("div");
	let direction = document.createElement("select");
	let directionTrue = document.createElement("option");
	let directionFalse = document.createElement("option");


	additionalEffects.classList.add("building_containers");
	additionalEffects.classList.add("AF_BB");
	additionalEffects.classList.add("condition_container");
	condition.classList.add("building_containers");
	condition.classList.add("condition_container");
	slideCondition.classList.add("building_containers");
	slideCondition.classList.add("condition_container");
	slideCondition.classList.add("slide_condition");

	additionalEffects.style.minWidth = "200px"
	additionalEffects.style.backgroundColor = "lightbrown"
	div.style.display = "flex"
	typeSlide.value = "slide"
	typeSlide.innerHTML = "slide"
	typeJump.value = "jump"
	typeJump.innerHTML = "jump"
	directionTrue.value = "true"
	directionTrue.innerHTML = "Follow Direction"
	directionFalse.value = "false"
	directionFalse.innerHTML = "Don't Follow Direction"
	colorDiv.style.width = "50px"
	colorDiv.style.height = "50px"
	colorDiv.style.minWidth = "50px"
	colorDiv.style.minHeight = "50px"
	colorDiv.style.backgroundColor = addColor.value
	choose.innerHTML = "choose"
	deleteButton.innerHTML = "delete"

	type.append(typeSlide)
	type.append(typeJump)
	direction.append(directionFalse)
	direction.append(directionTrue)


	div.append(colorDiv)
	div.append(choose)
	div.append(type)
	div.append(direction)
	div.append(condition)
	div.append(slideCondition)
	div.append(additionalEffects)
	div.append(deleteButton)
	buildingContainers = document.getElementsByClassName("building_containers")
	document.body.append(div)
	let path = createPath(colorDiv.style.backgroundColor, type.value, elementsIntoCodeCondition(condition), elementsIntoCodeCondition(slideCondition), AFelementsIntoCode(additionalEffects), direction.value)
	type.addEventListener("change", (e) => {
		if (getComputedStyle(slideCondition).display != "none") {
			slideCondition.style.display = "none"
		} else {
			slideCondition.style.display = "block"
		}
		path.type = type.value

	})
	direction.addEventListener("change", (e) => {
		path.followDirection = direction.value
	})
	choose.addEventListener("click", (e) => {
		color = colorDiv.style.backgroundColor
	})
	deleteButton.addEventListener("click", () => {
		div.remove()
		pathesInfo.splice(pathesInfo.findIndex((item) => {
			return item.color == colorDiv.style.backgroundColor
		}))
		let rgb = colorDiv.style.backgroundColor.replace("rgb(", "").replace(")", "").split(",")
		for (let i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(rgb[i])
		}
		let removeThose = movementInfo.filter((item) => {
			return item.color == rgbToHex(rgb)
		})
		removeThose.forEach((item) => {
			movementInfo.splice(movementInfo.findIndex((item2) => {
				return item.color == item2.color && item.number == item2.number
			}), 1)
			ctx.clearRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
		})
	})



	let observerC = new MutationObserver((mutationsList, observer) => {
		// The callback function will be executed when changes are detected
		mutationsList.forEach((mutation) => {
			if (mutation.type === 'childList') {
				// Child elements have been added or removed
				path.condition = elementsIntoCodeCondition(condition)
				// You can perform your actions here in response to the changes
			}
		});
	});
	let observerSC = new MutationObserver((mutationsList, observer) => {
		// The callback function will be executed when changes are detected
		mutationsList.forEach((mutation) => {
			if (mutation.type === 'childList') {
				// Child elements have been added or removed
				path.slideCondition = elementsIntoCodeCondition(slideCondition)
				// You can perform your actions here in response to the changes
			}
		});
	});

	let observerAF = new MutationObserver((mutationsList, observer) => {
		// The callback function will be executed when changes are detected
		mutationsList.forEach((mutation) => {
			if (mutation.type === 'childList') {
				// Child elements have been added or removed
				path.additionalEffect = AFelementsIntoCode(additionalEffects)
				// You can perform your actions here in response to the changes
			}
		});
	});
	// Configure the observer to watch for childList changes
	const config = {
		childList: true,
		subtree: true
	};

	// Start observing the target element
	observerC.observe(condition, config);
	observerSC.observe(slideCondition, config);
	observerAF.observe(additionalEffects, config);

	buildingContainersUpdate();
}

function createPath(color, type, condition, slideCondition, additionalEffect, direction) {
	let path = {
		color: color,
		type: type,
		condition: condition,
		slideCondition: slideCondition,
		additionalEffect: additionalEffect,
		moves: [],
		followDirection: direction,
		num: 0
	}
	pathesInfo.push(path)
	return path
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
//
function rgbToHex(color) {
	return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

//
//function RGBAtoHEX(data) {
//	return rgbToHex(rgba2rgb([0, 0, 0, 0], data))
//}
for (let i = 0; i < draggableBlockTemplates.length; i++) {
	//console.log(draggableBlockTemplates[i])
	draggableBlockTemplates[i].addEventListener("dragstart", function (ev) {
		ev.target.id = idForBB;
		idForBB++
		ev.dataTransfer.setData("text", ev.target.id);
		//console.log(ev)
	})
}
buildingContainersUpdate()

function buildingContainersUpdate() {
	for (let i = 0; i < buildingContainers.length; i++) {
		buildingContainers[i].addEventListener("dragover", function (ev) {
			ev.preventDefault();
		})

		buildingContainers[i].addEventListener("drop", function (ev) {
			ev.preventDefault();
			//console.log(ev, ev.clientX - parseInt(getComputedStyle(ev.target).left), ev.clientY - parseInt(getComputedStyle(ev.target).top))
			var data = ev.dataTransfer.getData("text");
			//console.log(data)
			let parent = document.getElementById(data).parentElement;
			//checking is the target element isnt template and if its empty
			if (ev.target.parentElement.classList[0] != "block_template" && (ev.target.childElementCount == 0 || ev.target.classList.contains("AF_BB")) || ev.target.classList.contains("BB_storage")) {
				//checking is element block temeplate to decide to clone it or not
				if (document.getElementById(data).classList[0] == "block_template") {
					//creating clone of the building element
					let clonneBB = document.getElementById(data).cloneNode(true);
					clonneBB.classList.replace("block_template", "building_block")
					clonneBB.id = "clone" + clonneBB.id
					//adding drag event
					if (clonneBB.classList.contains("forAF")) {
						if (ev.target.classList.contains("BB_storage")) {
							clonneBB.style.position = "absolute"
						} else {
							clonneBB.style.position = "static"
						}
					} else {
						if (ev.target.classList.contains("BB_storage")) {
							clonneBB.style.position = "absolute"
						} else {
							clonneBB.style.position = "relative"
							clonneBB.style.left = null
						}
					}
					clonneBB.addEventListener("dragstart", function (ev) {
						ev.dataTransfer.setData("text", ev.target.id);
					})
					if (ev.target.classList.contains("BB_storage")) {
						clonneBB.style.left = ev.x - parseInt(getComputedStyle(ev.target).left) + "px"
						clonneBB.style.top = ev.y - parseInt(getComputedStyle(ev.target).top) + "px"
					}
					//adding the clone
					let clonePrevention = true;
					for (let i = 0; i < ev.target.children.length; i++) {
						if (ev.target.children[i].id ==
							clonneBB.id) {
							clonePrevention = false
							break
						}
					}
					if (ev.target.classList.contains("building_containers") && clonePrevention) {
						ev.target.appendChild(clonneBB);
						clonneBB.addEventListener('contextmenu', function (e) {
							e.preventDefault();
							context = clonneBB
							contextMenu.style.top = e.clientY + "px"
							contextMenu.style.left = e.clientX + "px"
							contextMenu.classList.add("visible")
						}, false)
						buildingContainers = document.getElementsByClassName("building_containers")

						//updating containers (recesive func)
						buildingContainersUpdate()
					}
				} else if (document.getElementById(data).classList[0] == "building_block") {
					if (ev.target.classList.contains("building_containers")) {
						if (document.getElementById(data).classList.contains("forAF")) {
							if (ev.target.classList.contains("BB_storage")) {
								document.getElementById(data).style.position = "absolute"
							} else {
								document.getElementById(data).style.position = "static"
							}
						} else {
							if (ev.target.classList.contains("BB_storage")) {
								document.getElementById(data).style.position = "absolute"
							} else {
								document.getElementById(data).style.position = "relative"
								document.getElementById(data).style.left = null
								document.getElementById(data).style.top = null
							}
						}
						ev.target.appendChild(document.getElementById(data));

						if (ev.target.classList.contains("BB_storage")) {
							document.getElementById(data).style.left = ev.clientX - parseInt(getComputedStyle(ev.target).left) + "px"
							document.getElementById(data).style.top = ev.clientY - parseInt(getComputedStyle(ev.target).top) + "px"
						}
					}
				}
				if (ev.target.classList.contains("BBdeleter")) {
					ev.target.innerHTML = "delete"
				}
				//				console.log("1 parent:", parent)
				//sizing from children to parent for ex parent
				do {
					if (!parent.classList.contains("condition_container")) {
						let width = 0;
						let height = 0;
						for (let i = 0; i < parent.children.length; i++) {
							if (!isNaN(parseInt(getComputedStyle(parent.children[i]).width))) {
								if (parseInt(getComputedStyle(parent.children[i]).width) < parseInt(parent.children[i].style.width)) {
									width += parseInt(parent.children[i].style.width)
								} else {
									width += parseInt(getComputedStyle(parent.children[i]).width)
								}
							}

						}
						parent.style.width = (width) + "px"
						//console.log("parent", width, parent)
						parent = parent.parentElement
					}
				} while (!parent.classList.contains("condition_container"))
				let start = ev.target
				//sizing from child to parent for new parent
				do {
					let width = 0;
					let height = 0;
					if (!start.classList.contains("if") && !start.classList.contains("if_else")) {
						for (let i = 0; i < start.children.length; i++) {
							if (!isNaN(parseInt(getComputedStyle(start.children[i]).width))) {
								if (parseInt(getComputedStyle(start.children[i]).width) < parseInt(start.children[i].style.width)) {
									width += parseInt(start.children[i].style.width)
								} else {
									width += parseInt(getComputedStyle(start.children[i]).width)
								}
							}

						}
					} else {
						let parCh = start.children;
						let if_if_else = start.children[0].children;
						for (let i = 0; i < if_if_else.length; i++) {
							if (parseInt(getComputedStyle(start.children[0].children[i]).width) < parseInt(start.children[0].children[i]).width) {
								width += parseInt(if_if_else[i].style.width)
							} else {
								width += parseInt(getComputedStyle(if_if_else[i]).width)
							}
						}
						start.children[1].style.width = width + "px"
						if (start.children[3] != null) {
							start.children[3].style.width = width + "px"
						}
					}
					let addNum = 0
					if (start.classList.contains("building_containers")) {
						addNum = 5
					}
					start.style.width = (width + addNum) + "px"
					//console.log(width, start)
					start = start.parentElement
				} while (start != null && !start.classList.contains("condition_container"))
			}
		})
	}

}

function elementsIntoCodeCondition(el) {
	let answer = "";
	//console.log("element EICC",el, el.children)
	if (el.children[0] != undefined) {
		switch (el.children[0].classList[1]) {
			case "and_or":
				answer += "( " + elementsIntoCodeCondition(el.children[0].children[0]) + " "
				answer += el.children[0].children[1].value + " "
				answer += elementsIntoCodeCondition(el.children[0].children[2]) + " )"
				return answer
				break;
			case "compare":
				if (isObjectString(elementsIntoCodeCondition(el.children[0].children[0])) && isObjectString(elementsIntoCodeCondition(el.children[0].children[2]))) {
					answer += "( parseInt(" + elementsIntoCodeCondition(el.children[0].children[0]) + ".x) " + el.children[0].children[1].value + " parseInt(" + elementsIntoCodeCondition(el.children[0].children[2]) + ".x) &&"
					answer += " parseInt(" + elementsIntoCodeCondition(el.children[0].children[0]) + ".y) " + el.children[0].children[1].value + " parseInt(" + elementsIntoCodeCondition(el.children[0].children[2]) + ".y) )"
				} else {
					answer += "( " + elementsIntoCodeCondition(el.children[0].children[0]) + " "
					answer += el.children[0].children[1].value + " "
					answer += elementsIntoCodeCondition(el.children[0].children[2]) + " )"
				}
				return answer
				break;
			case "math_func":
				if (isObjectString(elementsIntoCodeCondition(el.children[0].children[0])) && isObjectString(elementsIntoCodeCondition(el.children[0].children[2]))) {
					answer += "{ x:parseInt( " + elementsIntoCodeCondition(el.children[0].children[0]) + ".x )" + el.children[0].children[1].value + " parseInt(" + elementsIntoCodeCondition(el.children[0].children[2]) + ".x),"
					answer += "y: parseInt(" + elementsIntoCodeCondition(el.children[0].children[0]) + ".y ) " + el.children[0].children[1].value + " parseInt(" + elementsIntoCodeCondition(el.children[0].children[2]) + ".y) }"

				} else if (isObjectString(elementsIntoCodeCondition(el.children[0].children[0]))) {
					answer += "{ x:parseInt( " + elementsIntoCodeCondition(el.children[0].children[0]) + ".x )" + el.children[0].children[1].value + elementsIntoCodeCondition(el.children[0].children[2])
					answer += ", y:parseInt( " + elementsIntoCodeCondition(el.children[0].children[0]) + ".y )" + el.children[0].children[1].value + elementsIntoCodeCondition(el.children[0].children[2])
				} else if (isObjectString(elementsIntoCodeCondition(el.children[0].children[2]))) {
					answer += "{ x:parseInt( " + elementsIntoCodeCondition(el.children[0].children[2]) + ".x )" + el.children[0].children[1].value + elementsIntoCodeCondition(el.children[0].children[0])
					answer += ", y:parseInt( " + elementsIntoCodeCondition(el.children[0].children[2]) + ".y )" + el.children[0].children[1].value + elementsIntoCodeCondition(el.children[0].children[0])
				} else {
					answer += "( " + elementsIntoCodeCondition(el.children[0].children[0]) + " "
					answer += el.children[0].children[1].value + " "
					answer += elementsIntoCodeCondition(el.children[0].children[2]) + " )"
				}
				return answer
				break;
			case "chessboard_block":
				answer += "chessBoardArray[findSquare( " + elementsIntoCodeCondition(el.children[0].children[1]) + " )]"
				answer += el.children[0].children[3].value
				return answer
				break;
			case "coordinates":
				return "{x: parseInt(" + el.children[0].children[1].value + "), y: parseInt(" + el.children[0].children[3].value + ")}"
				break;
			case "piece_info":
				return "piece." + el.children[0].children[1].value
				break;
			case "true_false":
				return el.children[0].children[0].value
				break;
			case "numbers":
				return el.children[0].children[0].value
				break;
			case "write":
				return "'" + el.children[0].children[0].value + "'"
				break;
			case "position_after_moving":
				return "{x:parseInt(pos.x),y:parseInt(pos.y)}"
				break;
			case "moves":
				return "chessMove"
				break;
			case "turns":
				return "piece.allMoves"
				break;
			case "seen_by":
				answer += "checkIsSquareSeen((item)=>{return "
				answer += el.children[0].children[3].value
				answer += "&& piece.pos != pos"
				if (el.children[0].children[5].children[0].value != "") {
					answer += " && item.type.name == " + el.children[0].children[5].children[0].value
				}
				answer += "}," + elementsIntoCodeCondition(el.children[0].children[1]) + ")"
				return answer
				break;

			case "chess_history":
				if (el.children[0].children[3].value == "from" || el.children[0].children[3].value == "to") {
					answer += "{ x:parseInt(chessHistory[" + el.children[0].children[1].value + el.children[0].children[2].value + "]." + el.children[0].children[3].value + ".x),"
					answer += "{ y:parseInt(chessHistory[" + el.children[0].children[1].value + el.children[0].children[2].value + "]." + el.children[0].children[3].value + ".y)}"
				} else {
					answer += "chessHistory[" + el.children[0].children[1].value + el.children[0].children[2].value + "]." + el.children[0].children[3].value
				}
				return answer
				break;
			case "x_y":
				answer += elementsIntoCodeCondition(el.children[0].children[0]);
				answer += el.children[0].children[1].value;
				return answer
				break;
			case "color_direction":
				return "colorDirection(piece.color)"
				break;
			default:
				answer = "true"
				return answer

		}
	} else {
		answer = "false"
		return answer
	}
}

function AFelementsIntoCode(el) {
	let answer = ""
	let cond;
	let action;
	for (let i = 0; i < el.children.length; i++) {
		switch (el.children[i].classList[1]) {
			case "if":
				cond = elementsIntoCodeCondition(el.children[i].children[0].children[1]);
				action = "";
				//console.log(el.children[i].children[1])
				action += AFelementsIntoCode(el.children[i].children[1])
				//console.log(action)
				answer += "if(" + cond + "){" + action + "}"
				break;
			case "if_else":
				cond = elementsIntoCodeCondition(el.children[i].children[0].children[1]);
				action = "";
				let action2 = "";
				//console.log(el.children[i].children[1])
				//for (let j = 0; i < el.children[i].children[1].length; j++) {
				action += AFelementsIntoCode(el.children[i].children[1])
				//}
				//for (let j = 0; i < el.children[i].children[i].children[3].length; j++) {
				action2 += AFelementsIntoCode(el.children[i].children[3])
				//}
				//console.log(action)
				answer += "if(" + cond + "){" + action + "}"
				break;
			case "capture":
				answer += `clearSquare(findSquare(${elementsIntoCodeCondition(el.children[i].children[1])}));`
				break;
			case "move_to":
				answer += `movePiece(chessBoard.children[findSquare(${elementsIntoCodeCondition(el.children[i].children[1])})].children[0],findSquare(${elementsIntoCodeCondition(el.children[i].children[1])}));`
				break;
			case "create":
				answer += `createChessPiece(${el.children[i].children[1].value},${elementsIntoCodeCondition(el.children[i].children[4])},sameNotColor(${el.children[i].children[3].value},piece));`
				break;
			default:
				return ""
		}
	}
	return answer
}

function isObjectString(str) {
	str = str.trim();

	if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
		return true;
	} else {
		return false
	}
}

function movementInfoToPathesInfo() {
	pathesInfo.forEach((path) => {
		path.moves = []
		movementInfo.forEach((el) => {
			if (el.color == rgbToHexStr(path.color)) {
				let move = {
					x: el.x,
					y: el.y
				}
				console.log(move)
				path.moves.push(move)
			}
		})
	})
}

function rgbToHexStr(rgbColor) {
	// Extract RGB values from the color string
	const [r, g, b] = rgbColor.match(/\d+/g).map(Number);

	// Ensure that the input values are within the valid range (0-255)
	const clampedR = Math.min(255, Math.max(0, r));
	const clampedG = Math.min(255, Math.max(0, g));
	const clampedB = Math.min(255, Math.max(0, b));

	// Convert the clamped values to hexadecimal
	const hexR = clampedR.toString(16).padStart(2, '0');
	const hexG = clampedG.toString(16).padStart(2, '0');
	const hexB = clampedB.toString(16).padStart(2, '0');

	// Combine the hex values to create the final hex color code
	return `#${hexR}${hexG}${hexB}`;
}

function saveChessPiece() {
	chessPieceName = document.getElementById("chess_piece_name").value
	let chessPiecePrototype = {
		name: chessPieceName,
		image: {
			"white": chessPieceImageUrlW.value,
			"black": chessPieceImageUrlB.value
		},
		royal: isRoyal.value,
		promote: "ChessPiecePromotion((pos,piece)=>{return " + elementsIntoCodeCondition(promotionCondition) + "},[" + allPromotionPieces() + "])",
		movement: []
	};
	movementInfoToPathesInfo();
	pathesInfo.forEach((path) => {
		//console.log(JSON.stringify(path.moves), path.moves)
		chessPiecePrototype.movement.push("ChessPieceMovementPath(" + JSON.stringify(path.moves).replaceAll("\"", "") + ",\"" + path.type + "\",(pos,piece)=>{return " + path.condition + "},(pos,piece)=>{return " + path.slideCondition + "} , (pos,piece)=>{" + path.additionalEffect + "}," + path.followDirection + ")")
	})
	let test = JSON.stringify(chessPiecePrototype)

	let content = "let _ChessPiecePrototype_" + chessPieceName + " = " + test;
	let chessPieceFile = new File([test], "chessPiece_" + chessPieceName + ".json", {
		type: "application/json"
	})

	const link = document.createElement("a");
	link.href = URL.createObjectURL(chessPieceFile);
	link.download = name;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	//console.log(test, JSON.parse(test))
}

document.addEventListener('click', function (e) {
	e.preventDefault();
	contextMenu.classList.remove("visible")
}, false)
deleteButton.addEventListener("click", (e) => {
	context.remove();
})

dublicateButton.addEventListener("click", (e) => {
	if (context.parentElement.classList.contains("BB_storage")) {
		//console.log("checked", context)
		let clone = context.cloneNode(true);

		clone.id = "clone" + idForBB;
		clone.addEventListener("dragstart", function (ev) {
			ev.dataTransfer.setData("text", ev.target.id);
		})
		console.log(clone.style.left)
		clone.style.top = parseInt(clone.style.top) + 5 +"px"
		clone.style.left = parseInt(clone.style.left) + 5 +"px"
		idForBB++
		context.parentElement.append(clone)
	}
})
