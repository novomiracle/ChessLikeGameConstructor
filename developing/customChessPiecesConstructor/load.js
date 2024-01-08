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
			let promotionP = piece.promote.split("[")[piece.promote.split("[").length - 1].replaceAll("'", "").replace("])", "").split(",")
			let promotionC = "";
			let movement = piece.movement
			movement.forEach((el,id)=>{
				let obj = {}
				el = el.slice(23,-1)
				obj.moves = eval(el.slice(0,el.indexOf("]")+1))
				el = el.slice(el.indexOf("]")+3)
				obj.type = el.slice(0,el.indexOf("\""))
				el = el.slice(el.indexOf("\"")+15)
				obj.condition = el.slice(8,closingBracket(el,0,"{","}"))
				el = el.slice(closingBracket(el,0,"{","}")+15)
				obj.slideCondition = el.slice(8,closingBracket(el,0,"{","}"))
				el = el.slice(closingBracket(el,0,"{","}")+15)
				obj.additionalEffect = el.slice(1,closingBracket(el,0,"{","}"))
				el = el.slice(closingBracket(el,0,"{","}")+2)
				obj.direction = el.slice()
				console.log(obj)
				movement[id]= obj
			})
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
			promotionC = promotionC.replace("ChessPiecePromotion((pos,piece)=>{return ", "").slice(0, -2)
			
			promotionC = codeConditionIntoElements(promotionC);
			promotionCondition.append(promotionC)
			findBCChildren(promotionC).forEach((el) => {
				designTheDropElFromChildren(el)
			})
			movement.forEach((el,i)=>{
				let htmlElement = addPath()
				htmlElement.getElementsByClassName("color_div")[0].style.backgroundColor =piece.pathColors[i]
				htmlElement.getElementsByClassName("condition_container")[0].append(codeConditionIntoElements(el.condition))
				htmlElement.getElementsByClassName("slide_condition")[0].append(codeConditionIntoElements(el.slideCondition))
				htmlElement.getElementsByClassName("movement_type")[0].value = el.type
				htmlElement.getElementsByClassName("movement_direction")[0].value = el.direction
				htmlElement.getElementsByClassName("AF_BB").append(codeIntoAFelements(el.additionalEffect))
			})
			//designTheDropElFromParents(lol);
			buildingContainersUpdate()
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
		// Read the selected file as text
		fileReader.readAsText(selectedFile);
	}
})

function codeConditionIntoElements(el) {
	let htmlElement = document.createElement("div");
	if (el == "{x:parseInt(pos.x),y:parseInt(pos.y)}") {
		htmlElement = createBB("position_after_moving")

	} else if (el == "colorDirection(piece.color)") {
		htmlElement = createBB("color_direction")

	} else if (el == "chessMove") {
		htmlElement = createBB("moves")

	} else if (el == "false") {
		htmlElement = createBB("true_false")
		htmlElement.children[0].value = "false"

	} else if (el == "true") {
		htmlElement = createBB("true_false")
		htmlElement.children[0].value = "true"

	} else if (el.endsWith(".x")) {
		let other = el.slice(0, -2)
		htmlElement = createBB("x_y")
		htmlElement.children[0].append(codeConditionIntoElements(other))
		htmlElement.children[1].value = ".x";

	} else if (el.endsWith(".y")) {
		let other = el.slice(0, -2)
		htmlElement = createBB("x_y")
		htmlElement.children[0].append(codeConditionIntoElements(other))
		htmlElement.children[1].value = ".y";

	} else if (el.startsWith("piece.")) {
		htmlElement = createBB("piece_info")
		htmlElement.children[1].value = el.replace("piece.", "")

	} else if (el.startsWith("chessBoardArray[findSquare( ")) {
		htmlElement = createBB("chessboard_block")
		closingBracket(el, 26, "(", ")")
		let part1 = el.slice(28, 28 + closingBracket(el, 26, "(", ")") - 3)
		let part2 = el.slice(27 + closingBracket(el, 26, "(", ")") + 1)
		console.log("part1", part1, "part2", part2, closingBracket(el, 26, "(", ")"))
		htmlElement.children[1].append(codeConditionIntoElements(part1))
		htmlElement.children[3].value = part2

	} else if (el.startsWith("chessHistory[")) {
		htmlElement = createBB("chess_history")
		let part1;
		if (el.startsWith("chessHistory[chessHistory.length - 1 -")) {
			part1 = "chessHistory.length - 1 -"
		}else{
			part1 = ""
		}
		let part3 = el.split("].")[1]
		let part2 = el.replace("chessHistory[","").replace(part1,"").replace("]."+part3,"")
		console.log("parts",part1,part2,part3)
		htmlElement.children[1].value = part1
		htmlElement.children[2].value = part2
		htmlElement.children[3].value = part3
	}else if(el.startsWith("checkIsSquareSeen((item)=>{return ")) {
		htmlElement = createBB("seen_by")
		htmlElement.children[3].value = el.slice(34,59)
		console.log(el.charAt(80))
		if(el.charAt(80) == "&"){
			console.log( el.slice(100,el.indexOf("}")))
			htmlElement.children[5].children[0].value = el.slice(100,el.indexOf("}"))
		}else{
			htmlElement.children[5].children[0].value = ""
		}
		htmlElement.children[1].append(codeConditionIntoElements(el.slice(el.indexOf("},")+2),-1))
	}
	else if (el.charAt(0) == "(" && el.charAt(el.length - 1) == ")") {
		console.log("br", el.slice(1, -1))
		if (inBrackets(el, "&&", "(", ")") != -1) {
			htmlElement = check1("and_or", "&&", el)


		} else if (inBrackets(el, "||", "(", ")") != -1) {
			htmlElement = check1("and_or", "||", el)

		} else if (inBrackets(el, "==", "(", ")") != -1) {
			htmlElement = check1("compare", "==", el)

		} else if (inBrackets(el, "<", "(", ")") != -1) {
			htmlElement = check1("compare", "<", el)

		} else if (inBrackets(el, ">", "(", ")") != -1) {
			htmlElement = check1("compare", ">", el)

		} else if (inBrackets(el, "+", "(", ")") != -1) {
			htmlElement = check1("math_func", "+", el)

		} else if (inBrackets(el, "-", "(", ")") != -1) {
			htmlElement = check1("math_func", "-", el)

		} else if (inBrackets(el, "*", "(", ")") != -1) {
			htmlElement = check1("math_func", "*", el)

		} else if (inBrackets(el, "/", "(", ")") != -1) {
			htmlElement = check1("math_func", "/", el)
		}


	} else if (el.charAt(0) == "{" && el.charAt(el.length - 1) == "}") {
		console.log(el.includes("+"))
		if (el.startsWith("{x:parseInt(chessHistory[")) {
			console.log("chessHistory")
			htmlElement = createBB("chess_history")
			let str = el.slice(25)
			if (str.startsWith("chessHistory.length - 1 -")) {
				htmlElement.children[1].value = "chessHistory.length - 1 -"
				str = str.slice(25)
			} else {
				htmlElement.children[1].value = ""
			}
			htmlElement.children[2].value = str.split(']')[0]
			console.log("doesnt work", str.split(']')[1].split(".x")[0])
			htmlElement.children[3].value = str.split(']')[1].split(".x")[0].replace(".", "")

		} else if (el.includes("+")) {
			htmlElement = math_func_check("+", el)

		} else if (el.includes("-")) {
			htmlElement = math_func_check("-", el)
		} else if (el.includes("*")) {
			htmlElement = math_func_check("*", el)
		} else if (el.includes("/")) {
			htmlElement = math_func_check("/", el)
		} else {
			htmlElement = createBB("coordinates")
			let part1 = el.split(",")[0].replace("{x:", "")
			let part2 = el.split(",")[1].replace(" y:", "").replace("}", "")
			htmlElement.children[1].value = part1
			htmlElement.children[3].value = part2
		}
	} else if(el.startsWith("'") && el.endsWith("'")){
		htmlElement = createBB("write")
		htmlElement.children[0] = el.slice(1,-1)
	}else{
		htmlElement = createBB("numbers")
		htmlElement.children[0] = el
	}
	return htmlElement
}

function codeIntoAFelements(e){
	let el = e;
	let elements = [];
	let htmlElement = document.createElement("div")
	if(el.startsWith("if")){
		let closingBr = closingBracket(el,2,"(",")")+2
		let closingCurlBr =closingBracket(el,closingBr+1,"{","}")+closingBr+1
		let condition = el.slice(3,closingBr)
		let action = el.slice(closingBr+2,closingCurlBr)
		
		console.log(closingCurlBr)
		if(el.slice(closingCurlBr+1).startsWith("else")){
			htmlElement = createBB("if_else")
			el = el.slice(closingCurlBr+5)
			closingCurlBr =closingBracket(el,0,"{","}")
			let action = el.slice(1,closingCurlBr)
			//htmlElement.children[3].append(codeIntoAFelements(action))
			
		}else{
			htmlElement = createBB("if")
		}
		//htmlElement.children[0].children[1].append(codeConditionIntoElements(condition))
		//htmlElement.children[1].append(codeIntoAFelements(action))
		el = el.slice(closingCurlBr+1)
		console.log(el)
		elements.push(htmlElement)
		
	}else if(el.startsWith("clearSquare(findSquare(")){
		let endStr = el.indexOf(";")
		let arg = el.slice(23,endStr-2)
		htmlElement = createBB("capture")
		htmlElement.children[1].append(codeConditionIntoElements(arg))
		el = el.slice(endStr+1)
		elements.push(htmlElement)
	}else if(el.startsWith("movePiece(chessBoard.children[findSquare(")){
		let endStr = el.indexOf(";")
		let firstBr = closingBracket(el,40,"(",")") + 40
		let part1 = el.slice(41,firstBr)
		let part2 = el.slice(firstBr+26,endStr-2)
		
		htmlElement = createBB("move_to")
		htmlElement.children[1].append(codeConditionIntoElements(part1))
		htmlElement.children[3].append(codeConditionIntoElements(part2))
		
		el = el.slice(endStr+1)
		elements.push(htmlElement)
	}else if(el.startsWith("createChessPiece(")){
		let endStr = el.indexOf(";")
		htmlElement = createBB("create")
		let part1 = el.slice(18,el.indexOf(",")-1)
		let part2 = el.slice(el.indexOf(",")+1,el.indexOf(",sameNotColor("))
		let part3 = el.slice(el.indexOf(",sameNotColor(")+14,endStr-2)
		
		htmlElement.children[1].value = part1
		htmlElement.children[4].append(codeConditionIntoElements(part2))
		htmlElement.children[3].value = part3
		
		el = el.slice(endStr+1)
		elements.push(htmlElement)
	}else{
		el = ""
	}
	if(el != ""){
		elements.concat(codeIntoAFelements(el))
	}
	return elements
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
			return i
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

function check1(el, symb, text) {
	let htmlElement;
	let checkEl = inBrackets(text, symb, "(", ")")
	let part1 = text.slice(1, checkEl).replaceAll(" ", "")
	let part2 = text.slice(checkEl + 3, text.length - 2).replaceAll(" ", "")
	htmlElement = createBB(el)
	console.log("part1", part1)
	htmlElement.children[0].append(codeConditionIntoElements(part1))
	htmlElement.children[1].value = symb;
	console.log("part2", part2)
	htmlElement.children[2].append(codeConditionIntoElements(part2))
	return htmlElement;
}

function math_func_check(symb, text) {
	let htmlElement;
	let checkEl = inBrackets(text, symb, "{", "}")
	let part1 = text.slice(1, checkEl - 4).replace("x:parseInt( ", "")
	console.log("part1", part1)
	let part2 = text.slice(checkEl + 1);
	if (part2.startsWith(" parseInt", "")) {
		part2 = part2.replace(" parseInt", "")
		part2 = part2.slice(1, closingBracket(part2, 0, "(", ")") - 2)
	} else {
		let lastPlus = inBrackets(part2, symb, "{", "}")
		part2 = part2.slice(lastPlus + 1, -1)
	}
	console.log("part2", part2)
	htmlElement = createBB("math_func")
	htmlElement.children[0].append(codeConditionIntoElements(part1))

	htmlElement.children[1].value = symb

	htmlElement.children[2].append(codeConditionIntoElements(part2))
	return htmlElement
}
