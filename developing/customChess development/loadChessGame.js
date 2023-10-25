loadGameFile.addEventListener("change", (ev) => {
	const selectedFile = event.target.files[0]; // Get the first selected file (you can handle multiple files if needed)
	const fileReader = new FileReader();
	if (selectedFile) {
		fileReader.onload = (e) => {
			// The file content is available in e.target.result
			const fileContent = e.target.result;
			theGame = JSON.parse(fileContent)
			// You can now process the file content as needed
			theGame.piecePrototypes.forEach((pr) => {

				for (let i = 0; i < pr.movement.length; i++) {
					pr.movement[i] = eval(pr.movement[i])
				}
				//need to be checked
				pr.promote = eval(pr.promote)
				pr.promote.options.forEach((prp,i) => {
					prp = theGame.piecePrototypes.find((search) => {
						console.log(prp,search.name,theGame)
						return search.name == prp
					})
					pr.promote.options[i] = prp
					console.log(prp,pr.promote.options)
				})
				console.log("promotion",pr.promote)
				theGame.piecesOnBoard.forEach((piece) => {
					if (pr.name == piece.name) {
						createChessPiece(pr, {
							x: piece.x,
							y: piece.y
						}, piece.color)
					}
				})
			})
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
