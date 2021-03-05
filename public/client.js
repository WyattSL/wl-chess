var h = document.getElementById("highlight")
	  h.style.top = -50+"px";
	  h.style.left = -50+"px";

const game = document.getElementById("game");
var x;
var y;
for (x=8;x>=1;x--) {
	var r = document.createElement("tr"); 
	for (y=1;y<=8;y++) {
		var d = document.createElement("td");
		d.id = `piece ${x}:${y}`
		if ((x+y)/2 == Math.round((x+y)/2)) {
			d.style.backgroundColor = "#D2691E"
		} else {
			d.style.backgroundColor = "#8B4513"
		}
		r.onclick = SelPiece;
		r.appendChild(d)
		setTimeout(function(x, y) {
		    Draw(x,y,"")
			//Draw(x,y,x+":"+y)
		},1,x,y)
	}
	game.appendChild(r)
}

function LoadBoard(board) {
  Board = board; // finish laters
}

var AI = false;

if (location.href.includes("bot")) { // AI it is...
  /*
  var s = document.createElement("script");
  s.src = "/stockfish.js";
  s.onload = function() {
  */
    var o = document.createElement("script");
    o.src = "/bot.js";
    document.head.appendChild(o);
  AI = true;
  /*
  }
  document.head.appendChild(s);
  */
}


function Draw(x, y, text) {
	var e = document.getElementById("piece "+x+":"+y)
	if (text == "" && !e.className.includes("filler")) {
		e.className = e.className+" filler"
	} else if (text != "" && e.className.includes("filler")) {
		e.className = e.className.replace("filler", "")
	}
	e.innerHTML = text;
}

function log(x) {
  var y = document.createElement("p")
  y.innerHTML = x;
  document.getElementById("log").appendChild(y);
}

window.log = log;
window.onerror = function(event) {
  log("Error!")
  log(JSON.stringify(event))
}

var Board = {};

function getOffset( el ) {
	var _x = 0;
	var _y = 0;
	while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: _y, left: _x };
}

var SelectedPiece;
var MovesDB

function SelPiece(event) {
  let e = event.target;
  
  var x = Number(e.id.split(":")[0].split(" ")[1]);
  var y = Number(e.id.split(":")[1]);
  
  let sel = Board[`${x}:${y}`];
  
  if (!allowMove) return;
  
  if (SelectedPiece && (!sel || sel.color != SelectedPiece.color)) {
	if (SelectedPiece.CanMove(x, y)) {
		SelectedPiece.Move(x,y)
    document.getElementById(`piece ${x}:${y}`).style.borderStyle = "none"
    SelectedPiece = null;
	}
  } else {
	if (sel && ((turn && sel.color == 2) || (!turn && sel.color == 1))) {
	  SelectedPiece = sel;
	  
	  e.style.borderStyle = "dashed"
    e.style.borderColor = "red"
    
    MovesDB = [];
    var r;
    var c;
    var rows = game.childNodes;
    for (r=0;r<rows.length;r++) {
      var cols = rows[r].childNodes;
      for (c=0;c<cols.length;c++) {
        var col = cols[c];
        var x = col.id.split(":")[0].split(" ")[1]
        var y = col.id.split(":")[1]
        let b = Board[x+":"+y]
        if (b && b.x == sel.x && b.y == sel.y) {
          MovesDB.push(col)
          continue;
        }
        if ((!b || b.color != sel.color) && sel.CanMove(Number(x), Number(y))) {
          col.style.borderStyle = "dotted"
          if (!b) col.style.borderStyle = "solid";
          col.style.borderColor = "red";
          MovesDB.push(col)
        } else {
          col.style.borderStyle = "solid"
          col.style.borderColor = col.style.backgroundColor;
        }
      }
    }
	}
  }
}

function WinGame(color) {
  allowMove = false;
  let e = document.getElementById("bc")
  if (color == 1) {
    e.innerHTML = "White<br>wins!"
  } else {
    e.innerHTML = "Black<br>wins!"
  }
}

function Tick() {
  let w = WKPOS.split(":")
  let b = BKPOS.split(":")
  if (!allowMove) return;
  if (isCheckmate(w[0], w[1], 1) || isCheckmate(b[0],b[1],2)) {
    document.getElementById("bc").innerHTML = "Check"
  } else {
    document.getElementById("bc").innerHTML = ""
  }
}
setInterval(Tick, 500);

function NewGame() {
	new Pawn(1,2,1)
	new Pawn(2,2,1)
	new Pawn(3,2,1)
	new Pawn(4,2,1)
	new Pawn(5,2,1)
	new Pawn(6,2,1)
	new Pawn(7,2,1)
	new Pawn(8,2,1)
	
	new Pawn(1,7,2)
	new Pawn(2,7,2)
	new Pawn(3,7,2)
	new Pawn(4,7,2)
	new Pawn(5,7,2)
	new Pawn(6,7,2)
	new Pawn(7,7,2)
	new Pawn(8,7,2)
	
	new Rook(1, 1, 1)
	new Rook(8, 1, 1)
	
	new Rook(1, 8, 2)
	new Rook(8, 8, 2)
  
  new Knight(2, 1, 1)
  new Knight(7, 1, 1)
  
  new Knight(2, 8, 2)
  new Knight(7, 8, 2)
  
  new King(5,1,1)
  new King(5,8,2)
  
  new Bishop(3, 1, 1)
  new Bishop(6, 1, 1)
  
  new Bishop(3, 8, 2)
  new Bishop(6, 8, 2)
  
  new Queen(4, 1, 1)
  new Queen(4, 8, 2)
  
  turn = false;
}

function Diff(x, y) {
  return Math.abs(x-y)
}

function isCheckmate(tx,ty,color) {
   var r;
   var c;
   var rows = game.children;
   for (r=0;r<rows.length;r++) {
     var row = rows[r];
     var cols = row.children;
     for (c=0;c<cols.length;c++) {
       var col = cols[c];
       var x = col.id.split(":")[0].split(" ")[1]
       var y = col.id.split(":")[1]
       let b = Board[`${x}:${y}`]
       if (b && b.color == color) continue;
       if (b) {
         var a = b.CanMove(tx,ty,true);
         if (a == 2) continue;
         if (a) return true
       }
     }
   }
}

var WKPOS;
var BKPOS;
var turn;
var allowMove = true;

class Piece {
	constructor() {}
	Move(x,y) {
		Board[`${this.x}:${this.y}`] = null;
		Draw(this.x, this.y, "")
		Draw(x, y, this.piece)
    if (this.MoveExt) this.MoveExt(y,x)
		this.x = x;
		this.y = y;
		this.hasMoved = true
    SelectedPiece = null;
    let b = Board[`${x}:${y}`];
    if (b && b.Capture) b.Capture(x, y);
    if (b && b.CaptureExt) b.CaptureExt(x,y);
		Board[`${x}:${y}`] = this
    if (this.type == "King") {
      if (this.color ==1) {
        WKPOS = `${x}:${y}`
      } else {
        BKPOS = `${x}:${y}`
      }
    }
    var i;
    for (i=0;i<MovesDB.length;i++) {
      MovesDB[i].style.borderStyle = "solid"
      MovesDB[i].style.borderColor = MovesDB[i].style.backgroundColor
    }
    turn = !turn;
    var tx;
    var ty;
    /*
    for (tx=0;tx<=8;tx++) {
      for (ty=0;ty<=8;ty++) {
        let B = Board[`${tx}:${ty}`]
        let wx = WKPOS.split(":")[0]
        let wy = WKPOS.split(":")[1]
        let bx = BKPOS.split(":")[0]
        let by = BKPOS.split(":")[1]
        if (B.CanMove(wx, wy) || B.CanMove(bx, by)) {
          log("Check!")
          document.getElementById("bc").innerHTML = "Check"
        } else {
          document.getElemenyById("bc").innerHTML = ""
        }
      }
    }
    */
	}
  Capture(x, y) {}
}

class Pawn extends Piece {
	constructor(y, x, color) {
		super();
		Board[`${x}:${y}`] = this
		this.x = x;
		this.y = y;
		this.type = "Pawn";
		this.hasMoved = false;
		this.color = color;
    this.lastJump = false;
		if (color == 1) {
			this.piece = '♙'
		} else {
			this.piece = "♟︎"
		}
		Draw(x,y,this.piece)
	}
	CanMove(x,y) {
	   let B = Board[`${x}:${y}`];
		if (this.color == 1) {
      let b = Board[`${x-1}:${y}`]
			if (!B && this.y == y && this.x+2 == x && this.hasMoved == false) return 2;
			if (!B && this.y == y && this.x+1 == x) return 2;
			if (B && B.color == 2 && this.x+1 == x && (this.y+1 == y || this.y-1 == y)) return true;
      if (!B && b && b.color == 2 && b.type == "Pawn" && b.lastJump && this.x+1==x && (this.y+1 == y || this.y-1 == y)) return true;
		} else {
      let b = Board[`${x+1}:${y}`]
		    if (!B && this.y == y && this.x-2 == x && this.hasMoved == false) return 2;
		    if (!B && this.y == y && this.x-1 == x) return 2;
		    if (B && B.color == 1 && this.x-1 == x && (this.y+1 == y || this.y-1 == y)) return true;
        if (!B && b && b.color == 1 && b.type == "Pawn" && b.lastJump && this.x-1==x && (this.y+1 == y || this.y-1 == y)) return true;
		}
		return false;
	}
  MoveExt(y, x) {
    this.lastJump = false;
    Board[`${this.x}:${this.y}`] = null;
    if (Diff(this.x, x) > 1) this.lastJump = true;
    let B = Board[`${x}:${y}`];
    let b;
    if (this.color == 2) {
      b = Board[`${x+1}:${y}`]
    } else {
      b = Board[`${x-1}:${y}`]
    }
    if (!B && b && ((b.color == 2 && this.color == 1) || (b.color == 1 && this.color == 2))&& b.type == "Pawn" && b.lastJump) {
      Board[b.x+":"+b.y] = null;
      Draw(b.x, b.y, "")
    }
  }
}

class Queen extends Piece {
  constructor(y, x, color) {
    super();
    this.x = x;
    this.y = y;
    Board[`${x}:${y}`] = this;
    this.type = "Queen";
    this.hasMoved = false;
    this.color = color;
    if (color == 1) {
      this.piece = "♕"
    } else {
      this.piece = "♛"
    }
    Draw(x, y, this.piece)
  }
  CanMove(x, y) {
    if (Diff(this.x, x) != Diff(this.y, y)) {
      x=Number(x)
      y=Number(y);
			let B = Board[`${x}:${y}`];
			if (this.y == y) {
        var i = this.x;
        var z = x;
        if (i>x) {
          i = x;
          z = this.x;
        }
        for (i=i;z>i;i++) {
          let b = Board[`${i}:${y}`];
          if (b && !(b.x == this.x && b.y == this.y) && !(b.x == x && b.y == y)) return false;
        }
        return true;
      } else if (this.x == x) {
        var i = this.y;
        var z = y;
        if (i>z) {
          i = y;
          z = this.y;
        }
        for (i=i;z>i;i++) {
          let b = Board[`${x}:${i}`];
          if (b && !(b.x == this.x && b.y == this.y) && !(b.x == x && b.y == y)) return false;
        }
        return true;
      }
		return false;
    } else {
    if (this.x > x && this.y < y) { // lower right
      var tx = this.x-1;
      var ty = this.y+1;
      while (tx != x) {
        let b = Board[`${tx}:${ty}`];
        if (b) return false
        tx--;
        ty++;
      }
    } else if (this.x < x && this.y < y) { // upper right
      var tx = this.x+1;
      var ty = this.y+1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`];
        if (b) return false;
        tx++;
        ty++;
      }
    } else if (this.x > x && this.y > y) { // lower left
      var tx = this.x-1;
      var ty = this.y-1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`]
        if (b) return false;
        tx--;
        ty--;
      }
    } else if (this.x < x && this.y > y) {
      var tx = this.x+1;
      var ty = this.y-1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`]
        if (b) return false;
        tx++;
        ty--;
      }
    }
      return true;
    }
  }
}

class King extends Piece {
  constructor(y, x, color) {
    super();
    this.x = x;
    this.y = y;
    Board[`${x}:${y}`] = this;
    this.type = "King";
    this.hasMoved = false;
    this.color = color;
    if (color == 1) {
      this.piece = "♔"
      WKPOS = `${x}:${y}`
    } else {
      this.piece = "♚"
      BKPOS = `${x}:${y}`
    }
    Draw(x, y, this.piece)
  }
  CanMove(x, y, stackPatch) {
    if (stackPatch) return false;
    if (isCheckmate(x,y,this.color)) return false;
    if (Diff(x, this.x) > 1) return false;
    if (Diff(y, this.y) > 1) return false;
    return true;
  }
  CaptureExt(x, y) {
    if (this.color == 2) WinGame(1)
    if (this.color == 1) WinGame(2);
  }
}

class Knight extends Piece {
  constructor(y, x, color) {
    super();
    this.x = x;
    this.y = y;
    Board[`${x}:${y}`] = this;
    this.type = "Knight"
    this.hasMoved = false;
    this.color = color;
    if (color == 1) {
      this.piece = "♘"
    } else {
      this.piece = "♞"
    }
    Draw(x, y, this.piece);
  }
  CanMove(x, y) {
    if (this.x == x+1 && this.y == y+2) return true;
    if (this.x == x-1 && this.y == y-2) return true;
    if (this.x == x+2 && this.y == y+1) return true;
    if (this.x == x-2 && this.y == y-1) return true;
    if (this.x == x+1 && this.y == y-2) return true;
    if (this.x == x-1 && this.y == y+2) return true;
    if (this.x == x+2 && this.y == y-1) return true;
    if (this.x == x-2 && this.y == y+1) return true;
    return false;
  }
}

class Bishop extends Piece {
  constructor(y,x, color) {
    super();
    Board[`${x}:${y}`] = this;
    this.x = x;
    this.y = y;
    this.type = "Bishop";
    this.hasMoved = false;
    this.color = color;
    if (color == 1) {
      this.piece = "♗";
    } else {
      this.piece = "♝"
    }
    Draw(x, y, this.piece)
  }
  CanMove(x, y) {
    if (Diff(this.x, x) != Diff(this.y, y)) return false;
    if (this.x > x && this.y < y) { // lower right
      var tx = this.x-1;
      var ty = this.y+1;
      while (tx != x) {
        let b = Board[`${tx}:${ty}`];
        if (b) return false
        tx--;
        ty++;
      }
    } else if (this.x < x && this.y < y) { // upper right
      var tx = this.x+1;
      var ty = this.y+1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`];
        if (b) return false;
        tx++;
        ty++;
      }
    } else if (this.x > x && this.y > y) { // lower left
      var tx = this.x-1;
      var ty = this.y-1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`]
        if (b) return false;
        tx--;
        ty--;
      }
    } else if (this.x < x && this.y > y) {
      var tx = this.x+1;
      var ty = this.y-1;
      while (tx!=x) {
        let b = Board[`${tx}:${ty}`]
        if (b) return false;
        tx++;
        ty--;
      }
    }
    return true;
  }
}

class Rook extends Piece {
	constructor(y, x, color) {
		super();
		Board[`${x}:${y}`] = this
		this.x = x;
		this.y = y;
		this.type = "Rook";
		this.hasMoved = false;
		this.color = color;
		if (color == 1) {
			this.piece = '♖'
		} else {
			this.piece = "♜"
		}
		Draw(x,y,this.piece)
	}
	CanMove(x,y) {
    x=Number(x)
    y=Number(y);
			let B = Board[`${x}:${y}`];
			if (this.y == y) {
        var i = this.x;
        var z = x;
        if (i>x) {
          i = x;
          z = this.x;
        }
        for (i=i;z>i;i++) {
          let b = Board[`${i}:${y}`];
          if (b && !(b.x == this.x && b.y == this.y) && !(b.x == x && b.y == y)) return false;
        }
        return true;
      } else if (this.x == x) {
        var i = this.y;
        var z = y;
        if (i>z) {
          i = y;
          z = this.y;
        }
        for (i=i;z>i;i++) {
          let b = Board[`${x}:${i}`];
          if (b && !(b.x == this.x && b.y == this.y) && !(b.x == x && b.y == y)) return false;
        }
        return true;
      }
		return false;
	}
}

if (game.requestFullscreen) game.requestFullscreen();
if (game.webkitRequestFullscreen) game.webkitRequestFullscreen();
if (game.msRequestFullscreen) game.msRequestFullscrean();
setTimeout(NewGame, 3)