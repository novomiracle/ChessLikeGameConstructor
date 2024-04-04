load.addEventListener("change", function (ev) {
	const selectedFile = ev.target.files[0]; // Get the first selected file (you can handle multiple files if needed)

	if (selectedFile) {
		const fileReader = new FileReader();

		fileReader.onload = (e) => {
			// The file content is available in e.target.result
			const fileContent = e.target.result;
			let piece = JSON.parse(fileContent)
			isRoyal.value = piece.royal
			document.getElementById("chess_piece_name").value = piece.name
			chessPieceImageUrlW.value = piece.image.white
			chessPieceImageUrlB.value = piece.image.black
			chessPieceImageW.src = piece.image.white
			chessPieceImageB.src = piece.image.black
			console.log(piece.promote)
			let promotionP = piece.promote.split("[")[piece.promote.split("[").length - 1].replaceAll("'", "").replace("]", "").split(",")
			let promotionC = piece.promote.split("[")[0].slice(0, -1);
			let movement = piece.movement
			promotionCondition.append(codeConditionIntoElements(promotionC))
			console.log("piece", piece.promote, promotionC)
			movement.forEach((el, id) => {
				movement[id] = JSON.parse(el)
			})
			console.log("movement", movement)
			piece.promote.split("[").forEach((el, i) => {
				console.log(i, piece.promote.split("[").length - 1)
				if (i != piece.promote.split("[").length - 1) {
					if (i == 0) {
						promotionC += el
					} else {
						promotionC += "[" + el
					}
				}
			})
			//			promotionC = codeConditionIntoElements(promotionC);
			//			promotionCondition.append(promotionC)

			movement.forEach((el, i) => {
				let path = addPath()
				let htmlElement = path[0]
				console.log("el", el)
				if (el.moves.length > 0) {
					htmlElement.getElementsByClassName("color_div")[0].style.backgroundColor = el.moves[el.moves.length - 1].color
				} else {
					htmlElement.getElementsByClassName("color_div")[0].style.backgroundColor = "red"
				}
				htmlElement.getElementsByClassName("condition_slot")[0].append(codeConditionIntoElements(el.condition))

				htmlElement.getElementsByClassName("slide_condition")[0].append(codeConditionIntoElements(el.slideCondition))
				htmlElement.getElementsByClassName("movement_type")[0].value = el.type
				if (el.type == "jump") {
					htmlElement.getElementsByClassName("slide_condition")[0].style.display = "none"
				} else {
					htmlElement.getElementsByClassName("slide_condition")[0].style.display = "block"
				}
				htmlElement.getElementsByClassName("movement_direction")[0].value = el.followDirection
				console.log("af check 2024", el.applyAdditionalEffect)
				codeIntoAFelements(el.applyAdditionalEffect).forEach((e) => {
					htmlElement.getElementsByClassName("AF_BB")[0].append(e)
				})
				console.log("path", path[1])
				if (el.moves.length > 0) {
					path[1].color = el.moves[el.moves.length - 1].color
					path[1].num = el.moves[el.moves.length - 1].number + 1
				} else {
					path[1].color = "red"
					path[1].num = 0
				}
				path[1].moves = path[1].moves.concat(el.moves)
				console.log("path2", path[1])
				el.moves.forEach((item) => {
					console.log(item)
					ctx.fillStyle = item.color
					ctx.fillRect(item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), item.y * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2), pixelSize, pixelSize)
					ctx.fillStyle = "black"
					ctx.fillText(item.number, item.x * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.width / 2), (item.y + 1) * pixelSize - pixelSize / 2 + Math.floor(movementCanvas.height / 2))
				})
			})
			//let promotionC =
			promotionP.forEach((el) => {
				if (el != "") {
					let div = document.createElement("div");
					let input = document.createElement("input");
					input.classList.add("inputClass2")
					div.append(input)
					input.value = el
					promotionPieces.append(div)
				}
			})
			//"ChessPiecePromotion((pos,piece)=>{return false},[])"
			// You can now process the file content as needed
		};
		buildingContainersUpdate()
		// Read the selected file as text
		fileReader.readAsText(selectedFile);
	}
})


function codeIntoAFelements(el) {
	let elements = []
	while (el != "") {
		let type = el.slice(0, el.indexOf("("))
		let htmlElement = createBB(type)
		let args = el.slice(el.indexOf("(") + 1, closingBracket(el, el.indexOf("("), "(", ")"))
		el = el.slice(closingBracket(el, el.indexOf("("), "(", ")") + 2)
		argsToCode(args, htmlElement)
		elements.push(htmlElement)
		htmlElement.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			contextMenu.style.top = e.clientY - parseInt(getComputedStyle(htmlElement.parentElement).top) + "px"
			contextMenu.style.left = e.clientX - parseInt(getComputedStyle(htmlElement.parentElement).left) + "px"
			contextMenu.classList.add("visible")
		})
	}
	return elements
}

function codeConditionIntoElements(el) {
	let type = el.slice(0, el.indexOf("("))
	let htmlElement = createBB(type)
	let args = el.slice(el.indexOf("(") + 1, closingBracket(el, el.indexOf("("), "(", ")"))
	console.log("ccie htmlEl", htmlElement, el)
	argsToCode(args, htmlElement)
	htmlElement.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		contextMenu.style.top = e.clientY - parseInt(getComputedStyle(htmlElement.parentElement).top) + "px"
		contextMenu.style.left = e.clientX - parseInt(getComputedStyle(htmlElement.parentElement).left) + "px"
		contextMenu.classList.add("visible")
	})
	htmlElement.addEventListener("dragstart", function (ev) {
			ev.dataTransfer.setData("text", ev.target.id);
			const rect = ev.target.getBoundingClientRect();
			offsetX = ev.x - rect.x;
			offsetY = ev.y - rect.y;
		})
	return htmlElement
}

function argsToCode(args, htmlEl, selI = 0, bcI = 0, inputI = 0, afI = 0) {
	if (htmlEl != undefined) {
		if (args[0] == ",") {
			args = args.slice(1)
		}
		console.log("args", args)
		let type = args.slice(0, args.indexOf(":"))
		let arg = args.slice(args.indexOf(":") + 2, closingBracket(args, args.indexOf("<"), "<", ">"))
		console.log(arg)
		let elements = htmlEl.children
		console.log("elements,htmlEl", elements, htmlEl, type, arg)
		switch (type) {
			case "sel":
				elements.findClass("selectorClass", selI).value = arg
				selI++
				break
			case "input":
				elements.findClass("input", inputI).value = arg
				inputI++
				break
			case "bc":
				elements.findClass("building_containers", bcI).append(codeConditionIntoElements(arg))
				hasChild(elements.findClass("building_containers", bcI))
				bcI++
				break
			case "af":
				codeIntoAFelements(arg).forEach((e) => {
					elements.findClass("AF_BB", afI).append(e)
				})
				hasChild(elements.findClass("AF_BB", afI))
				afI++
				break
		}
		if (args.slice(closingBracket(args, args.indexOf("<"), "<", ">") + 1) != "") {
			argsToCode(args.slice(closingBracket(args, args.indexOf("<"), "<", ">") + 1), htmlEl, selI, bcI, inputI, afI)
		}
	}

}

function countSymbol(str, char) {
	let b = 0;
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) == char) {
			b++
		}
	}
	return b
}

function removeOpenBrackets(str, char, char2) {
	let removeChar = countSymbol(str, char) - countSymbol(str, char2);
	let returnStr = str;
	console.log(removeChar)
	for (let i = 0; i < removeChar; i++) {
		returnStr = returnStr.slice(returnStr.indexOf(char) + 1)
	}
	return returnStr
}

function inBrackets(text, spl, br1, br2) {
	let allSpl = search_word(text, spl);
	let theChosenOne = [];
	allSpl.forEach((item) => {
		let textBefore = text.slice(0, item)
		let textAfter = text.slice(item + spl.length)
		if (countSymbol(textBefore, br1) > countSymbol(textBefore, br2) || countSymbol(textAfter, br2) > countSymbol(textAfter, br1)) {
			theChosenOne.push(item)
		}
	})
	return theChosenOne[0];
}

function inBracketsLast(text, spl, br1, br2) {
	let allSpl = search_word(text, spl);
	let theChosenOne = [];
	allSpl.forEach((item) => {
		let textBefore = text.slice(0, item)
		let textAfter = text.slice(item + spl.length)
		if (countSymbol(textBefore, br1) > countSymbol(textBefore, br2) || countSymbol(textAfter, br2) > countSymbol(textAfter, br1)) {
			theChosenOne.push(item)
		}
	})
	return theChosenOne[theChosenOne.length - 1];
}

function closingBracket(text, theBrIndex, br1, br2) {
	let str = text.slice(theBrIndex)
	let count = 0
	for (let i = 0; i < str.length; i++) {
		if (str[i] == br1) {
			count++
		} else if (str[i] == br2) {
			count--
		}
		if (count == 0) {
			return i + theBrIndex
			break
		}
	}
}

function search_word(text, word) {

	let y = 0;
	let arr = [];
	for (i = 0; i < text.length; i++) {
		if (text[i] == word[0]) {
			for (j = i; j < i + word.length; j++) {
				if (text[j] == word[j - i]) {
					y++;
				}
				if (y == word.length) {
					arr.push(i)
				}
			}
			y = 0;
		}
	}
	return arr;
}

function createBB(id) {
	for (let i = 0; i < draggableBlockTemplates.length; i++) {
		if (draggableBlockTemplates[i].classList.contains(id)) {
			let clone = draggableBlockTemplates[i].cloneNode(true);
			clone.classList.replace("block_template", "building_block")
			clone.id = "clone" + idForBB;
			idForBB++
			clone.addEventListener("dragstart", function (ev) {
				ev.dataTransfer.setData("text", ev.target.id);
			})
			clone.addEventListener('contextmenu', function (e) {
				e.preventDefault();
				context = clone
				contextMenu.style.top = e.clientY + "px"
				contextMenu.style.left = e.clientX + "px"
				contextMenu.classList.add("visible")
			}, false)
			return clone
			break
		}
	}
}

function findBCChildren(el) {
	let children = []
	for (let i = 0; i < el.querySelectorAll('.building_containers').length; i++) {
		if (el.querySelectorAll('.building_containers')[i].querySelectorAll('.building_containers').length == 0) {
			children.push(el.querySelectorAll('.building_containers')[i])
		} else {
			children.concat(findBCChildren(el.querySelectorAll('.building_containers')[i]))
		}
	}
	return children
}


function hasChild(el) {
	if (el.children.length == 0) {
		el.classList.remove("has_child")
	} else {
		el.classList.add("has_child")
	}
}
