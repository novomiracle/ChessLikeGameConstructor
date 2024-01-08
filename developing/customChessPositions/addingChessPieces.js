let name = document.getElementById("name")
let chessPieceInfo = document.getElementById("add_piece")
let addingButton =  document.getElementById("add_piece_b")
let pieceContainer = document.getElementById("pieces");
let colorChooser = document.getElementById("color");
let royalties = document.getElementById("royalties");
let piece;
let htmlPieces = []
let saveButton = document.getElementById("save_button")
chessPieceInfo.addEventListener("change",(ev)=>{
	const selectedFile = event.target.files[0]; // Get the first selected file (you can handle multiple files if needed)

    if (selectedFile) {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
            // The file content is available in e.target.result
            const fileContent = e.target.result;
            console.log('File content:', fileContent);
			piece =JSON.parse(fileContent)
			piece.royal = (/true/).test(piece.royal)
            // You can now process the file content as needed
        };
        // Read the selected file as text
        fileReader.readAsText(selectedFile);
    }
	
})

addingButton.addEventListener("click",(ev)=>{
	piecesPrototypes.push(piece)
	let htmlPiece = document.createElement("div");
	htmlPiece.setAttribute("name", piece.name)
	htmlPiece.id = piece.name +"_prototype"
	htmlPiece.classList.add("prototype_div");
	htmlPiece.style.backgroundImage =  `url(${piece.image[colorChooser.value]})`
	htmlPiece.setAttribute("color",colorChooser.value)
	htmlPiece.draggable = true
	htmlPiece.addEventListener("dragstart",(ev)=>{
		ev.dataTransfer.setData("text", ev.target.id);
	})
	htmlPieces.push(htmlPiece);
	chessPieceInfo.value = ""
	pieceContainer.append(htmlPiece)
	piece = null;
})

colorChooser.addEventListener("change",(ev)=>{
	htmlPieces.forEach((el,i)=>{
		el.style.backgroundImage = `url(${piecesPrototypes[i].image[colorChooser.value]})`
		el.setAttribute("color",colorChooser.value)
	})
})

saveButton.addEventListener("click",(ev)=>{
	let content = {
		piecePrototypes:[],
		piecesOnBoard:[],
		amountOfRoyalties:parseInt(royalties.value)
	};
	piecesPrototypes.forEach((el)=>{
		content.piecePrototypes.push(el)
	})
	updateBoardArray()
	piecesOnBoard.forEach((el)=>{
		content.piecesOnBoard.push(el)
	})
	let file = new File([JSON.stringify(content)], name.value +".json", {
		type: "application/json"
	})
	const link = document.createElement("a");
	link.href = URL.createObjectURL(file);
	link.download = name.value;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
})