let _ChessPiecePrototype_rook = createChessPiecePrototype(
	"rook",
	{
	"white": "https://www.chess.com/chess-themes/pieces/neo/150/wr.png",
	"black": "https://www.chess.com/chess-themes/pieces/neo/150/br.png"
}, false, {condition:() =>{false}}, [
	ChessPieceMovementPath([{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0}]),
	ChessPieceMovementPath([{x:-1,y:0},{x:-2,y:0},{x:-3,y:0},{x:-4,y:0},{x:-5,y:0},{x:-6,y:0},{x:-7,y:0}]),
	ChessPieceMovementPath([{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:0,y:5},{x:0,y:6},{x:0,y:7}]),
	ChessPieceMovementPath([{x:0,y:-1},{x:0,y:-2},{x:0,y:-3},{x:0,y:-4},{x:0,y:-5},{x:0,y:-6},{x:0,y:-7}])
])
let _ChessPiecePrototype_bishop =createChessPiecePrototype("bishop",{
	"white":"https://www.chess.com/chess-themes/pieces/neo/150/wb.png",
	"black":"https://www.chess.com/chess-themes/pieces/neo/150/bb.png"},false,{condition:() =>{false}},[
	ChessPieceMovementPath([{x:1,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]),
	ChessPieceMovementPath([{x:-1,y:1},{x:-2,y:2},{x:-3,y:3},{x:-4,y:4},{x:-5,y:5},{x:-6,y:6},{x:-7,y:7}]),
	ChessPieceMovementPath([{x:1,y:-1},{x:2,y:-2},{x:3,y:-3},{x:4,y:-4},{x:5,y:-5},{x:6,y:-6},{x:7,y:-7}]),
	ChessPieceMovementPath([{x:-1,y:-1},{x:-2,y:-2},{x:-3,y:-3},{x:-4,y:-4},{x:-5,y:-5},{x:-6,y:-6},{x:-7,y:-7}])
])
//let chessPromotion2 = createChessPiecePrototype("pro2", "", false, [], movement2);

let _ChessPiecePrototype_knight = createChessPiecePrototype("knight",{
	"white":"https://www.chess.com/chess-themes/pieces/neo/150/wn.png",
	"black":"https://www.chess.com/chess-themes/pieces/neo/150/bn.png"
},false,{condition:() =>{false}},[
	ChessPieceMovementPath([{x:1,y:2},{x:-1,y:2},{x:1,y:-2},{x:-1,y:-2},{x:2,y:1},{x:-2,y:1},{x:2,y:-1},{x:-2,y:-1}],"jump")
])
let _ChessPiecePrototype_king = createChessPiecePrototype("king",{
	"white":"https://www.chess.com/chess-themes/pieces/neo/150/wk.png",
	"black":"https://www.chess.com/chess-themes/pieces/neo/150/bk.png"
},true,{condition:()=>{return false}},[
	ChessPieceMovementPath([{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:1,y:0},{x:-1,y:0}],"jump"),
	ChessPieceMovementPath([{x:2,y:0}],"jump",(pos, piece) => {
		return chessBoardArray[findSquare(pos)] == 0 && 
		chessBoardArray[findSquare({x:pos.x-1,y:pos.y})] == 0 && 
		chessMove < 1 &&
		piece.allMoves == 0 && 
		chessBoardArray[findSquare({x:7,y:pos.y})].type.name == "rook" &&
		chessBoardArray[findSquare({x:7,y:pos.y})].allMoves == 0 &&
		chessBoardArray[findSquare({x:7,y:pos.y})].color == piece.color &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},pos).length == 0 &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},{x:pos.x-1,y:pos.y}).length == 0 &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},piece.pos).length == 0
	},()=>{},(pos,piece)=>{
		movePiece(chessBoard.children[findSquare({x:parseInt(pos.x)+1,y:pos.y})].children[0],findSquare({x:parseInt(pos.x)-1,y:pos.y}))
	}),
	ChessPieceMovementPath([{x:-2,y:0}],"jump",(pos,piece)=>{
		return chessBoardArray[findSquare(pos)] == 0 &&
		chessBoardArray[findSquare({x:pos.x-1,y:pos.y})] == 0 && 
		chessMove < 1 && 
		piece.allMoves == 0 &&
		chessBoardArray[findSquare({x:0,y:pos.y})].type.name == "rook" &&
		chessBoardArray[findSquare({x:0,y:pos.y})].allMoves == 0 &&
		chessBoardArray[findSquare({x:7,y:pos.y})].color == piece.color &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},{x:pos.x+1,y:pos.y}).length == 0 &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},piece.pos).length == 0 &&
		checkIsSquareSeen((item)=>{return item.color != piece.color},pos).length == 0
	},()=>{},(pos,piece)=>{
		movePiece(chessBoard.children[findSquare({x:parseInt(pos.x)-2,y:pos.y})].children[0],findSquare({x:parseInt(pos.x)+1,y:pos.y}))
	})
])
let _ChessPiecePrototype_queen = createChessPiecePrototype(
	"queen",
	{
	"white": "https://www.chess.com/chess-themes/pieces/neo/150/wq.png",
	"black": "https://www.chess.com/chess-themes/pieces/neo/150/bq.png"
}, false, {condition:() =>{false}}, [
	ChessPieceMovementPath([{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0}]),
	ChessPieceMovementPath([{x:-1,y:0},{x:-2,y:0},{x:-3,y:0},{x:-4,y:0},{x:-5,y:0},{x:-6,y:0},{x:-7,y:0}]),
	ChessPieceMovementPath([{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:0,y:5},{x:0,y:6},{x:0,y:7}]),
	ChessPieceMovementPath([{x:0,y:-1},{x:0,y:-2},{x:0,y:-3},{x:0,y:-4},{x:0,y:-5},{x:0,y:-6},{x:0,y:-7},]),
	ChessPieceMovementPath([{x:1,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]),
	ChessPieceMovementPath([{x:-1,y:1},{x:-2,y:2},{x:-3,y:3},{x:-4,y:4},{x:-5,y:5},{x:-6,y:6},{x:-7,y:7}]),
	ChessPieceMovementPath([{x:1,y:-1},{x:2,y:-2},{x:3,y:-3},{x:4,y:-4},{x:5,y:-5},{x:6,y:-6},{x:7,y:-7}]),
	ChessPieceMovementPath([{x:-1,y:-1},{x:-2,y:-2},{x:-3,y:-3},{x:-4,y:-4},{x:-5,y:-5},{x:-6,y:-6},{x:-7,y:-7}])
])
let _ChessPiecePrototype_pawn = createChessPiecePrototype("pawn",{
	"white": "https://www.chess.com/chess-themes/pieces/neo/150/wp.png",
	"black": "https://www.chess.com/chess-themes/pieces/neo/150/bp.png"
},false,{condition:(pos,piece)=>{return pos.y == 0 || pos.y == 7},options:[_ChessPiecePrototype_rook,_ChessPiecePrototype_queen,_ChessPiecePrototype_bishop,_ChessPiecePrototype_knight]},[
	ChessPieceMovementPath([{x:0,y:-1}],"jump",
		function(pos,piece){
			return chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth] == 0 && chessMove < 1;
	},()=>{},()=>{},true),
	ChessPieceMovementPath([{x:0,y:-2}],"jump",
		function(pos,piece){
			return chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth] == 0 && chessMove < 1 && piece.allMoves == 0;
	},()=>{},()=>{},true),
	ChessPieceMovementPath([{x:1,y:-1},{x:-1,y:-1}],"jump",
		function(pos,piece){
			return chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth].color != piece.color && chessBoardArray[parseInt(pos.x)+parseInt(pos.y)*chessWidth]!=0 && chessMove < 1;
	},()=>{},function(pos, piece){
		clearSquare(parseInt(pos.x)+parseInt(pos.y)*chessWidth)
	},true),
	ChessPieceMovementPath([{x:1,y:-1},{x:-1,y:-1}],"jump",
		function(pos,piece){
			if(chessHistory!= 0){
				return (chessHistory[chessHistory.length-1].piece.type.name == "pawn" && (chessHistory[chessHistory.length-1].from.y == 1 || chessHistory[chessHistory.length-1].from.y ==6) && (chessHistory[chessHistory.length-1].to.y == 3 || chessHistory[chessHistory.length-1].to.y == 4) && (chessHistory[chessHistory.length-1].to.x == pos.x)) && chessMove < 1
			}else{
				return false
			}
	},()=>{},(pos,piece)=>{
		let direction = colorOrder.filter((item)=>{
	return item.color == chessPieces[0].chessPiece.color
})[0].direction
		clearSquare(parseInt(pos.x)+(parseInt(pos.y) + direction)*chessWidth)
	},true)
])
let piece = createChessPiecePrototype("test",{
	"white": "https://www.chess.com/chess-themes/pieces/neo/150/wq.png",
	"black": "https://www.chess.com/chess-themes/pieces/neo/150/bq.png"
},false,{condition:() =>{return false}},[ChessPieceMovementPath([{x:2,y:0},{x:-2,y:0}],"jump",(pos,piece)=>{
	 return checkIsSquareSeen((item)=>{return item != piece.color},pos)
})])
//createChessPiece(chessPrototype, 36, "black");
createChessPiece(_ChessPiecePrototype_rook, {x:0,y:7}, "white")
createChessPiece(_ChessPiecePrototype_rook, {x:7,y:7}, "white")
createChessPiece(_ChessPiecePrototype_rook, {x:0,y:0}, "black")
createChessPiece(_ChessPiecePrototype_rook, {x:7,y:0}, "black")
createChessPiece(_ChessPiecePrototype_knight,{x:6,y:7}, "white")
createChessPiece(_ChessPiecePrototype_knight,{x:1,y:7}, "white")
createChessPiece(_ChessPiecePrototype_knight, {x:1,y:0}, "black")
createChessPiece(_ChessPiecePrototype_knight, {x:6,y:0}, "black")
createChessPiece(_ChessPiecePrototype_bishop,{x:2,y:7},"white")
createChessPiece(_ChessPiecePrototype_bishop,{x:5,y:7},"white")
createChessPiece(_ChessPiecePrototype_bishop,{x:2,y:0},"black")
createChessPiece(_ChessPiecePrototype_bishop,{x:5,y:0},"black")
createChessPiece(_ChessPiecePrototype_king,{x:4,y:0},"black")
createChessPiece(_ChessPiecePrototype_king,{x:4,y:7},"white")
createChessPiece(_ChessPiecePrototype_queen, {x:3,y:7}, "white")
createChessPiece(_ChessPiecePrototype_queen, {x:3,y:0}, "black")
for(let i = 0; i < 8; i++){
	createChessPiece(_ChessPiecePrototype_pawn, {x:i,y:6}, "white")
	createChessPiece(_ChessPiecePrototype_pawn, {x:i,y:1}, "black")
}
updateChessBoardArray()
//console.log(checkLegalMove())