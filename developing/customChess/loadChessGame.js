loadGameFile.addEventListener("change", (ev) => {
	const selectedFile = event.target.files[0]; // Get the first selected file (you can handle multiple files if needed)
	const fileReader = new FileReader();
	if (selectedFile) {
		fileReader.onload = (e) => {
			// The file content is available in e.target.result
			const fileContent = e.target.result;
			theGame = JSON.parse(fileContent)
			// You can now process the file content as needed
			console.log(theGame)
			theGame.piecePrototypes.forEach((pr) => {
				for (let i = 0; i < pr.movement.length; i++) {
					pr.movement[i] = JSON.parse(pr.movement[i])
//					console.log("condition",conditionToFunction(pr.movement[i].condition))
					console.log("condition",conditionToFunction(pr.movement[i].condition))
					pr.movement[i].condition =eval(conditionPrefix +conditionToFunction(pr.movement[i].condition)+conditionSufix )
					pr.movement[i].slideCondition =eval(conditionPrefix +conditionToFunction(pr.movement[i].slideCondition)+conditionSufix)
					console.log("af1",additionalEffectToFunction(pr.movement[i].applyAdditionalEffect),pr.movement[i].applyAdditionalEffect)
					pr.movement[i].applyAdditionalEffect = eval(AFPrefix + additionalEffectToFunction(pr.movement[i].applyAdditionalEffect) + AFSufix)
					//pr.movement[i].moves = JSON.parse(pr.movement[i].moves)
				}
				//need to be checked
				//console.log(pr.promote, pr.promote.split(";")[1], eval(pr.promote.split(";")[1]))
				pr.promote = {
					options: eval(pr.promote.split(";")[1]),
					condition: eval(conditionPrefix +conditionToFunction(pr.promote.split(";")[0])+conditionSufix)
				}
				pr.promote.options.forEach((prp, i) => {
					prp = theGame.piecePrototypes.find((search) => {
						//console.log(prp, search.name, theGame)
						return search.name == prp
					})
					pr.promote.options[i] = prp
					//console.log(prp, pr.promote.options)
				})
				//console.log("promotion", pr.promote)
				theGame.piecesOnBoard.forEach((piece) => {
					if (pr.name == piece.name) {
						createChessPiece(pr, {
							x: piece.x,
							y: piece.y
						}, piece.color)
					}
				})
				//console.log(pr)
			})
			updateChessBoardArray()
			if (typeof (theGame.amountOfRoyalties) == "number") {
				royaltiesNeeded = theGame.amountOfRoyalties
			}
			pieces = document.querySelectorAll(".chessPiece");

			// Add event listeners to the chess pieces for drag functionality
			pieces.forEach(piece => {
				piece.addEventListener("dragstart", handleDragStart);
			});
		}
	}
	// Read the selected file as text
	fileReader.readAsText(selectedFile);

})


function conditionToFunction(str) {
	let name = str.slice(0, str.indexOf("("));
	let args = str.slice(str.indexOf("(") + 1, closingBracket(str, str.indexOf("("), "(", ")"))
	console.log(args)
	args = splitArgs(args)
	console.log(name, args)
	switch (name) {
		case "write":
		case "number":
		case "bool":
			return `${val(args[0])}`
		case "and_or":
		case "compare":
			return `(${val(args[1]) + val(args[0]) + val(args[2])})`
		case "math_func":
			console.log()
			return `(${math_func(val(args[1]), val(args[0]), val(args[2]))})`
		case "chessboard_block":
			let opt;
			if (val(args[0]) == "exists") {
				opt = "!= 0"
			} else {
				opt =`.${val(args[0])}`
			}
			return `(chessBoardArray[findSquare(${val(args[1])})]${opt})`
		case "coordinates":
			return `{x:${val(args[0])},y:${val(args[1])}}`
		case "piece_info":
			return `piece.${val(args[0])}`
		case "x_y":
			return val(args[0]) + "." + val(args[1])
		case "position_after_moving":
			return '{"x":pos.x,"y":pos.y}'
		case "color_direction":
			return "colorDirection(piece.color)"
		case "moves":
			return "chessMove"
		case "seen_by":
			return seen_by(val(args[0]), val(args[1]), val(args[2]))
		case "chess_history":
			return chess_history()
		default:
			throw new Error(`unknown command ${name}`);
	}

}
function additionalEffectToFunction(str,func = ""){
	let name = str.slice(0, str.indexOf("("));
	let args = str.slice(str.indexOf("(") + 1, closingBracket(str, str.indexOf("("), "(", ")"))
	str = str.slice(closingBracket(str, str.indexOf("("), "(", ")")+2)
	args = splitArgs(args)
	switch(name){
		case "if":
			func += `if(${val(args[0])}){${val(args[1])}}`
			break
		case "if_else":
			func += `if(${val(args[0])}){${val(args[1])}}else{${val(args[2])}}`
			break
		case "capture":
			func += `clearSquare(findSquare(${val(args[0])}));`
			break
		case "move_to":
			func += `movePiece(chessBoard.children[findSquare(${val(args[0])})],findSquare(${val(args[1])}));`
			break
		case "create":
			func +=`createChessPiece('${val(args[0])}',${val(args[1])},sameNotColor(${val(args[2])}));`
			break
		case "set_moves":
			func += `chessMove = ${val(args[0])};`
			
	}
	console.log("func",func,str == "")
	if(str == ""){
		console.log("func cmon",func)
		return func
	}else{
		return additionalEffectToFunction(str,func)
	}
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

function val(el) {
	console.log(el)
	switch (el.name) {
		case "bc":
			//condition
			return conditionToFunction(el.value)
		case "af":
			//af
			return additionalEffectToFunction(el.value)
		default:
			return el.value
	}
}

function math_func(el1, sign, el2) {
	console.log("math",el1,el2)
	if (isStrObject(el1) && isStrObject(el2)) {
		return `{x:parseInt(${el1}.x)${sign} parseInt(${el2}.x),y:parseInt(${el1}.y) ${sign} parseInt(${el2}.y)}`
	} else if (!isStrObject(el1) && isStrObject(el2)) {
		return `{x:parseInt(${el1}) ${sign} parseInt(${el2}.x),y:parseInt(${el1}) ${sign} parseInt(${el2}.y)}`
	} else if (isStrObject(el1) && !isStrObject(el2)) {
		return `{x:parseInt(${el2}) ${sign} parseInt(${el1}.x0,y:parseInt(${el2}) ${sign} parseInt(${el1}.y)}`
	} else {
		return `parseInt(${el2}) ${sign} parseInt(${el1})`
	}
}

function seen_by(sel, input, bc) {
	let colorCheck;
	let nameCheck;
	if (sel == "same") {
		colorCheck = "item.color == piece.color"
	} else {
		colorCheck = "item.color != piece.color"
	}
	if (input == '') {
		nameCheck = ''
	} else {
		nameCheck = `&& item.type.name == ${input}`
	}
	return `checkIsSquareSeen((item)=>{return  piece.pos != pos && ${colorCheck} ${nameCheck}},${bc})`
}

function chess_history(sel, input, sel2) {
	let from;
	if (sel == "first") {
		from = ''
	} else {
		from = 'length - 1 -'
	}
	if (sel2 == "from" || sel2 == "to") {
		return `{x:chessHistory[${from} + ${input}].${sel2}.x,y:chessHistory[${from} + ${input}].${sel2}.y}`
	} else {
		return `chessHistory[${from} + ${input}].${sel2}`
	}
}
function splitArgs(el){
	let args =[]
	while(el != ""){
		args.push({
			name:el.slice(0, el.indexOf(":")),
			value:el.slice(el.indexOf("<") + 1, closingBracket(el, el.indexOf("<"), "<", ">"))
		})
		el = el.slice(closingBracket(el, el.indexOf("<"), "<", ">")+2)
	}
	return args
}
function isStrObject(str) {
    if(str[0] == "{"&& str[str.length-1] == "}"){
		return true
	}else{
		return false
	}
}