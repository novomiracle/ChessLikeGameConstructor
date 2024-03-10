let WidthBoard = 8;
let layerId = 0
let load = document.getElementById("load");
let dublicateButton = document.getElementById("dublicate");
let deleteButton = document.getElementById("delete");
let context;
let contextMenu = document.getElementById("context_menu");
let idForBB = 0
let saveButton = document.getElementById("save_button")
let chessPieceName = document.getElementById("chess_piece_name").value;
let isRoyal = document.getElementById("royal")
let promotionButton = document.getElementById("add_piece_for_promotion")
let movementContainer = document.getElementById("movement_container")
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
let chessPieceImageUrlW = document.getElementById("chess_piece_image_url_white")
let chessPieceImageW = document.getElementById("chess_piece_image_white")
let chessPieceImageUrlB = document.getElementById("chess_piece_image_url_black")
let chessPieceImageB = document.getElementById("chess_piece_image_black")
let currentLayerID

let proportion =  parseInt(getComputedStyle(movementCanvas).width)/movementCanvas.width

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
		let thePath = pathesInfo.find(function(e){
			return e.id == currentLayerID
		})
		ctx.fillStyle = thePath.color
		ctx.fillRect(Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / (proportion*pixelSize)) * pixelSize, pixelSize, pixelSize)
		ctx.fillStyle = "black"
		ctx.fillText(thePath.num, Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / (proportion*pixelSize)) * pixelSize + pixelSize)
		thePath.moves.push({
			x: Math.floor(e.offsetX / (proportion * pixelSize)) - Math.floor(movementCanvas.width / (2 * pixelSize)),
			y: Math.floor(e.offsetY / (proportion * pixelSize)) - Math.floor(movementCanvas.height / (2 * pixelSize)),
			color:  thePath.color,
			number: thePath.moves.length,
		})
		thePath.num++
})
promotionButton.addEventListener("click", (e) => {
	let div = document.createElement("div");
	let input = document.createElement("input");
	input.classList.add("inputClass2")
	div.append(input)
	promotionPieces.append(div)
})
deletePromotionButton.addEventListener("click", (e) => {
	document.getElementById("promotion").children[document.getElementById("promotion").children.length - 1].remove()
})
movementCanvas.addEventListener("contextmenu", (e) => {
	e.preventDefault()
	if (!(ctx.getImageData(Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / (proportion*pixelSize)) * pixelSize, 1, 1).data[0] == 0 && ctx.getImageData(Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[1] == 0 && ctx.getImageData(Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[2] == 0 && ctx.getImageData(Math.floor(e.offsetX / (proportion*pixelSize)) * pixelSize, Math.floor(e.offsetY / pixelSize) * pixelSize, 1, 1).data[3] == 255)) {
		let thePath = pathesInfo.find(function(e){
			return e.id == currentLayerID
		})
		//for sliding
		let theSquareInArrayIndex = thePath.moves.findIndex((item) => {
			return item.x == Math.floor(e.offsetX / (proportion*pixelSize)) - Math.floor(movementCanvas.width / (2 * pixelSize)) && item.y == Math.floor(e.offsetY / (proportion*pixelSize)) - Math.floor(movementCanvas.height / (2 * pixelSize))
		})
		//console.log(thePath, pathesInfo)
		thePath.num =thePath.moves[theSquareInArrayIndex].number
		let removeThose = thePath.moves.filter((item) => {
			return item.number >= thePath.moves[theSquareInArrayIndex].number
		})
		console.log(removeThose,thePath)
		if (thePath.type == "slide") {
			removeThose.forEach((item) => {
				ctx.clearRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
			})
		} else {
			ctx.clearRect(thePath[theSquareInArrayIndex].x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), thePath[theSquareInArrayIndex].y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
			thePath.splice(theSquareInArrayIndex, 1)
		}

	}
})

function addPath() {
	let visibleLayer = document.createElement("button");
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
	div.classList.add("movement_path")
	choose.value = layerId
	visibleLayer.value = layerId
	visibleLayer.innerHTML = "hide"
	deleteButton.value = layerId
	additionalEffects.classList.add("building_containers");
	additionalEffects.classList.add("AF_BB");
	additionalEffects.classList.add("condition_slot");
	condition.classList.add("building_containers");
	condition.classList.add("condition_slot");
	slideCondition.classList.add("building_containers");
	slideCondition.classList.add("condition_slot");
	slideCondition.classList.add("slide_condition");

	additionalEffects.style.minWidth = "200px"
	additionalEffects.style.backgroundColor = "lightbrown"
	typeSlide.value = "slide"
	typeSlide.innerHTML = "slide"
	typeJump.value = "jump"
	typeJump.innerHTML = "jump"
	direction.classList.add("movement_direction")
	directionTrue.value = "true"
	directionTrue.innerHTML = "Follow Direction"
	directionFalse.value = "false"
	directionFalse.innerHTML = "Don't Follow Direction"
	colorDiv.classList.add("color_div")
	colorDiv.style.width = "50px"
	colorDiv.style.height = "50px"
	colorDiv.style.minWidth = "50px"
	colorDiv.style.minHeight = "50px"
	colorDiv.style.backgroundColor = addColor.value
	choose.innerHTML = "choose"
	deleteButton.innerHTML = "delete"

	type.append(typeSlide)
	type.classList.add("movement_type")
	type.append(typeJump)
	direction.append(directionFalse)
	direction.append(directionTrue)


	div.append(colorDiv)
	div.append(visibleLayer)
	div.append(choose)
	div.append(type)
	div.append(direction)
	div.append(deleteButton)
	div.append(condition)
	div.append(slideCondition)
	div.append(additionalEffects)
	buildingContainers = document.getElementsByClassName("building_containers")
	movementContainer.append(div)
	let path = createPath(addColor.value,type.value, elementsIntoCodeCondition(condition), elementsIntoCodeCondition(slideCondition), AFelementsIntoCode(additionalEffects), direction.value)
	type.addEventListener("change", (e) => {
		if (getComputedStyle(slideCondition).display != "none") {
			slideCondition.style.display = "none"
		} else {
			slideCondition.style.display = "block"
		}
		path.type = type.value

	})
	visibleLayer.addEventListener("click",function(e){
		if(visibleLayer.innerHTML == "hide"){
			visibleLayer.innerHTML = "show"
			path.shown = false
			hideLayer(path)
		}else{
			visibleLayer.innerHTML = "hide"
			path.shown = true
		}
		updateLayers()
	})
	direction.addEventListener("change", (e) => {
		path.followDirection = direction.value
	})
	choose.addEventListener("click", function(e){
		currentLayerID = parseInt(this.value)
		showLayer(path)
		path.shown = true
		visibleLayer.innerHTML = "hide"
	})
	deleteButton.addEventListener("click", function(){
		div.remove()
		let thePath = pathesInfo.find((item) => {
			return this.value == item.id
		})
		pathesInfo.splice(pathesInfo.findIndex((item) => {
			return this.value == item.id
		}),1)
		let rgb = colorDiv.style.backgroundColor.replace("rgb(", "").replace(")", "").split(",")
		for (let i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(rgb[i])
		}
		let removeThose = thePath.moves
		
		removeThose.forEach((item) => {
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
	
	return [div,path]
}

function createPath(color, type, condition, slideCondition, additionalEffect, direction) {
	let path = {
		type: type,
		condition: condition,
		slideCondition: slideCondition,
		additionalEffect: additionalEffect,
		moves: [],
		followDirection: direction,
		num: 0,
		id:layerId,
		color:color,
		shown:true
	}
	layerId++
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
	buildingContainers = document.getElementsByClassName("building_containers");
	for (let i = 0; i < buildingContainers.length; i++) {
		buildingContainers[i].addEventListener("dragover", function (ev) {
			ev.preventDefault();
		})

		buildingContainers[i].addEventListener("drop", function (ev) {
			ev.preventDefault();
			var data = ev.dataTransfer.getData("text");
			let parent = document.getElementById(data).parentElement;
			console.log("remove",parent)
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
							//clonneBB.style.position = "absolute"
						} else {
							clonneBB.style.position = "static"
						}
					} else {
						if (ev.target.classList.contains("BB_storage")) {
							//clonneBB.style.position = "absolute"
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
						ev.target.appendChild(clonneBB)
						console.log("1",ev.target)
						clonneBB.addEventListener('contextmenu', function (e) {
							e.preventDefault();
							context = clonneBB
							contextMenu.style.top = e.clientY + "px"
							contextMenu.style.left = e.clientX + "px"
							contextMenu.classList.add("visible")
						}, false)
						buildingContainers = document.getElementsByClassName("building_containers")

						//updating containers (recursive func)
						buildingContainersUpdate()
					}
				} else if (document.getElementById(data).classList[0] == "building_block") {
					if (ev.target.classList.contains("building_containers")) {
						if (document.getElementById(data).classList.contains("forAF")) {
							if (ev.target.classList.contains("BB_storage")) {
								//document.getElementById(data).style.position = "absolute"
							} else {
								document.getElementById(data).style.position = "static"
							}
						} else {
							if (ev.target.classList.contains("BB_storage")) {
								//document.getElementById(data).style.position = "absolute"
							} else {
								document.getElementById(data).style.position = "relative"
								document.getElementById(data).style.left = null
								document.getElementById(data).style.top = null
							}
						}
						ev.target.appendChild(document.getElementById(data));
						console.log("2",ev.target)

						if (ev.target.classList.contains("BB_storage")) {
							document.getElementById(data).style.left = ev.clientX - parseInt(getComputedStyle(ev.target).left) + "px"
							document.getElementById(data).style.top = ev.clientY - parseInt(getComputedStyle(ev.target).top) + "px"
						}
					}
				}
			}
			if(this.children.length == 0){
				this.classList.remove("has_child")
				console.log("doesn't",this)
			}else{
				this.classList.add("has_child")
				console.log("has_child",this)
			}
			if(parent.children.length == 0){
				parent.classList.remove("has_child")
			}else{
				parent.classList.add("has_child")
			}
		})
	}

}

function elementsIntoCodeCondition(el) {
	let answer = "";
	let part1;
	let selector;
	let part2;
	let input;
	let selector2;
	//console.log("element EICC",el, el.children)
	if (el.children[0] != undefined) {
		let elementsChildren = el.children[0].children
		switch (el.children[0].classList[1]) {
	case "and_or":
		part1 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0)) +">"
		selector = "sel:<" + elementsChildren.findClass("selectorClass",0).value +">"
		part2 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",1))+">"
		answer = `and_or(${selector},${part1},${part2})`
		return answer
		break;
	case "compare":
		part1 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0)) +">"
		selector ="sel:<" +  elementsChildren.findClass("selectorClass",0).value + ">"
		part2 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",1)) +">"
		answer = `compare(${selector},${part1},${part2})`
		return answer
		break;
	case "math_func":
		selector ="sel:<" + elementsChildren.findClass("selectorClass",0).value +">"
		part1 ="bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0))+">"
		part2 ="bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",1))+">"
		answer = `math_func(${selector},${part1},${part2})`
		break;
	case "chessboard_block":
		selector ="sel:<" + elementsChildren.findClass("selectorClass",0).value+">"
		part1 ="bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0))+">"
		answer = `chessboard_block(${selector},${part1})`
		return answer
		break;
	case "coordinates":
		let x = "input:<" + elementsChildren.findClass("input",0).value+">"
		let y = "input:<" + elementsChildren.findClass("input",1).value+">"
		return `coordinates(${x},${y})`
		break;
	case "piece_info":
		selector ="sel:<" + elementsChildren.findClass("selectorClass",0).value+">"
		return `piece_info(${selector})`
		break;
	case "bool":
		selector ="sel:<" + elementsChildren.findClass("selectorClass",0).value+">"
		return `bool(${selector})`
		break;
	case "number":
		input = "input:<" + elementsChildren.findClass("input",0).value+">"
		return `number(${input})`
		break;
	case "write":
		input = "input:<" + elementsChildren.findClass("input",0).value+">"
		return `write(${input})`
		break;
	case "seen_by":
		selector ="sel:<" + elementsChildren.findClass("selectorClass",0).value+">"
		input ="input:<" + elementsChildren.findClass("input",0).value+">"
		part1 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0))+">"
		return `seen_by(${selector},${input},${part1})`
		break;
	case "chess_history":
		selector = "sel:<" +elementsChildren.findClass("selectorClass",0).value+">"
		input ="input:<" + elementsChildren.findClass("input",0).value +">"
		selector2 = "sel:<" +elementsChildren.findClass("selectorClass",1).value+">"
		return `chess_history(${selector},${input},${selector2})`
		break;
	case "x_y":
		part1 = "bc:<" + elementsIntoCodeCondition(elementsChildren.findClass("building_containers",0))+">"
		selector = "sel:<" +elementsChildren.findClass("selectorClass",0).value+">"
		return `x_y(${part1},${selector})`
		break;
	case "position_after_moving":
		return "position_after_moving()"
		break;
	case "moves":
		return "moves()"
		break;
	case "color_direction":
		return "color_direction()"
		break;
	default:
		answer = "bool(sel:<true>)"
		return answer

}
	} else {
		answer = "bool(sel:<false>)"
		return answer
	}
}

function AFelementsIntoCode(el) {
	let answer = ""
	let cond;
	let action;
	for (let i = 0; i < el.children.length; i++) {
		let element = el.children[i].children
		switch (el.children[i].classList[1]) {
			case "if":
				cond ="bc:<" + elementsIntoCodeCondition(element.findClass("building_containers"))+">";
				action ="af:<" + AFelementsIntoCode(element.findClass("AF_BB"))+">"
				//console.log(el.children[i].children[1])
				//console.log(action)
				answer +=`if(${cond},${action});`
				break;
			case "if_else":
				cond ="bc:<" + elementsIntoCodeCondition(element.findClass("building_containers"))+">";
				action ="af:<" + AFelementsIntoCode(element.findClass("AF_BB"))+">"

				let action2 ="af:<" + AFelementsIntoCode(element.findClass("AF_BB"),1)+">";

				answer = `if_else(${cond},${action},${action2});`
				break;
			case "capture":
				let part = "bc:<" + elementsIntoCodeCondition(element.findClass("building_containers"))+">"
				answer += `capture(${part});`
				break;
			case "move_to":
				let from ="bc:<" + elementsIntoCodeCondition(element.findClass("building_containers"))+">"
				let to ="bc:<" +elementsIntoCodeCondition(element.findClass("building_containers",1))+">"
				answer += `move_to(${from},${to});`
				break;
			case "create":
				let piece = "input:<" + element.findClass("input").value+">"
				let cords = "bc:<" + elementsIntoCodeCondition(element.findClass("building_containers"))+">"
				let color = "sel:<" + element.findClass("selectorClass").value+">"
				answer += `create(${piece},${cords},${color});`
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
	console.log(promotionCondition)
	let chessPiecePrototype = {
		name: chessPieceName,
		image: {
			"white": chessPieceImageUrlW.value,
			"black": chessPieceImageUrlB.value
		},
		royal: isRoyal.value,
		promote: elementsIntoCodeCondition(promotionCondition) + ";[" + allPromotionPieces() +"]",
		movement: [],
	};
	pathesInfo.forEach((path) => {
		//console.log(JSON.stringify(path.moves), path.moves)
//		chessPiecePrototype.movement.push("{moves:'" + JSON.stringify(path.moves) + "',type:'" + path.type + "',condition:'" + path.condition +"',slideCondition:'"+path.slideCondition+"',additionalEffect:'" + path.additionalEffect + "',follow_direction:'" + path.followDirection +"'}")
		let movement = {
			moves:path.moves,
			type:path.type,
			condition:path.condition,
			slideCondition:path.slideCondition,
			applyAdditionalEffect:path.additionalEffect,
			followDirection:path.followDirection
		}
		
		chessPiecePrototype.movement.push(JSON.stringify(movement))
	})

	let content = JSON.stringify(chessPiecePrototype);
	let chessPieceFile = new File([content], "chessPiece_" + chessPieceName + ".json", {
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
		if (clone.style.top != "") {
			clone.style.top = parseInt(clone.style.top) + 15 + "px"
		} else {
			clone.style.top = 5 + "px"
		}
		if (clone.style.left != "") {
			clone.style.left = parseInt(clone.style.left) + 15 + "px"
		} else {
			clone.style.left = 5 + "px"
		}
		idForBB++
		clone.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			context = clone
			contextMenu.style.top = e.clientY + "px"
			contextMenu.style.left = e.clientX + "px"
			contextMenu.classList.add("visible")
		}, false)
		for(let i = 0;i < clone.getElementsByClassName("building_block").length;i++){
			clone.getElementsByClassName("building_block")[i].addEventListener("dragstart", function (ev) {
				ev.dataTransfer.setData("text", ev.target.id);
			})
			clone.getElementsByClassName("building_block")[i].addEventListener('contextmenu', function (e) {
			e.preventDefault();
			context = clone
			contextMenu.style.top = e.clientY + "px"
			contextMenu.style.left = e.clientX + "px"
			contextMenu.classList.add("visible")
		}, false)
			clone.getElementsByClassName("building_block")[i].id ="clone"+idForBB
			idForBB++
			
		}
		context.parentElement.append(clone)
	}
})

function designTheDropElFromChildren(start) {
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
function hideLayer(layer){
	layer.shown = false
	layer.moves.forEach((item)=>{
		ctx.clearRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
	})
}
function showLayer(layer){
	layer.shown = true
	layer.moves.forEach((item)=>{
		ctx.fillStyle = item.color
		
		ctx.fillRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
		
		ctx.fillStyle = "black"
		ctx.fillText(item.number, item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), (item.y+1) * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2))
	})
}
function updateLayers(){
	pathesInfo.forEach((e)=>{
		if(e.shown){
			showLayer(e)
		}
	})
}
	
	
HTMLCollection.prototype.findClass = function(htmlClass,id = 0){
	let checkId = 0
	for (let i = 0 ; i < this.length; i++){
		if(this[i].classList.contains(htmlClass)){
			if(checkId == id){
				return this[i]
				break	
			}
			checkId++
		}
	}
	return undefined
}