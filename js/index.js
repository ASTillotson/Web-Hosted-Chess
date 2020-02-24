'use strict';
//All of the pieces, this maintains the game state
let pieces = {
    arr: [
        {id: "A8", src: "png/brook.png", alt: "Black Rook"},
        {id: "B8", src: "png/bknight.png", alt: "Black Knight"},
        {id: "C8", src: "png/bbishop.png", alt: "Black Bishop"},
        {id: "D8", src: "png/bqueen.png", alt: "Black Queen"},
        {id: "E8", src: "png/bking.png", alt: "Black King"},
        {id: "F8", src: "png/bbishop.png", alt: "Black Bishop"},
        {id: "G8", src: "png/bknight.png", alt: "Black Knight"},
        {id: "H8", src: "png/brook.png", alt: "Black Rook"},
        {id: "A7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "B7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "C7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "D7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "E7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "F7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "G7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "H7", src: "png/bpawn.png", alt: "Black Pawn"},
        {id: "A2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "B2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "C2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "D2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "E2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "F2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "G2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "H2", src: "png/wpawn.png", alt: "White Pawn"},
        {id: "A1", src: "png/wrook.png", alt: "White Rook"},
        {id: "B1", src: "png/wknight.png", alt: "White Knight"},
        {id: "C1", src: "png/wbishop.png", alt: "White Bishop"},
        {id: "D1", src: "png/wqueen.png", alt: "White Queen"},
        {id: "E1", src: "png/wking.png", alt: "White King"},
        {id: "F1", src: "png/wbishop.png", alt: "White Bishop"},
        {id: "G1", src: "png/wknight.png", alt: "White Knight"},
        {id: "H1", src: "png/wrook.png", alt: "White Rook"}
    ],
    whiteTurn: true,
    selectedPiece: "",
    selectedPieceX: "",
    selectedPieceY: ""
}
//turns algebraic notation into coordinates, but its only needed in one instance so far so rather than returning it,
//it just sets the selected pieces x y values that are stored above.
function getCoordinates() {
    let letterToNumArr = 
        {A:1,
        B:2,
        C:3,
        D:4,
        E:5,
        F:6,
        G:7,
        H:8};
    pieces.selectedPieceX = letterToNumArr[pieces.selectedPiece.id.charAt(0)];
    pieces.selectedPieceY = pieces.selectedPiece.id.charAt(1);
}
//converts a coordinate pair between 1,1 and 8,8 to the algebraic notation of the chess board.
function getID(x, y) {
    let numToLetterArr = 
    {1:"A",
    2:"B",
    3:"C",
    4:"D",
    5:"E",
    6:"F",
    7:"G",
    8:"H"};
    return numToLetterArr[x] + y;
}
//it clears the div of the piece and then generates a whole new piece depending on which kind it is.
function makePiece(piece) {
    document.querySelector("#" + piece.id).innerHTML = "";
    let currentPiece = document.createElement("img");
    currentPiece.setAttribute("id", piece.id);
    currentPiece.setAttribute("src", piece.src);
    currentPiece.setAttribute("alt", piece.alt);
    //only adds select piece handler to the pieces whos turn it is.
    if(currentPiece.alt.substring(0, 5) == "White" && pieces.whiteTurn == true || (currentPiece.alt.substring(0, 5) == "Black" && pieces.whiteTurn == false)) {
        //select piece event listener
        currentPiece.addEventListener("click", function() {
            pieces.selectedPiece = this;
            getCoordinates();
            removeMoveHandlers();
            this.parentElement.classList.add("selected");
            if(this.alt == "Black Pawn") {
                bPawnMove();
            } else if(this.alt == "White Pawn") {
                wPawnMove();
            } else if(this.alt == "Black Rook" || this.alt == "White Rook") {
                rookMove();
            } else if(this.alt == "Black Knight" || this.alt == "White Knight") {
                knightMove();
            } else if(this.alt == "Black Bishop" || this.alt == "White Bishop") {
                bishopMove();
            } else if(this.alt == "Black King" || this.alt == "White King") {
                kingMove();
            } else if(this.alt == "Black Queen" || this.alt == "White Queen") {
                queenMove();
            } 
        });
    }
    return currentPiece;
}
//renders all the pieces on the board
function renderBoard() {
    for(let k = 0; k < pieces.arr.length; k++) {
        document.querySelector("#" + pieces.arr[k].id).appendChild(makePiece(pieces.arr[k]));
    }
}
//updates the state of the game.
function updateState(oldID, newID, targetAlt) {
    for(let i = 0; i < pieces.arr.length; i++) {
        if(targetAlt != null && pieces.arr[i].id == newID) {
            pieces.arr.splice(i, 1);
        }
        if(pieces.arr[i].id == oldID) {
            pieces.arr[i].id = newID;
            let moveText = document.createElement("p");
            moveText.textContent = pieces.arr[i].alt + " from " + oldID + " to " + newID;   
            document.querySelector(".last-moves-display").appendChild(moveText);
            if(document.querySelector(".last-moves-display").childNodes.length > 7) {
                document.querySelector(".last-moves-display").removeChild(document.querySelector(".last-moves-display").childNodes[0]);
            }
        }
    }

    renderBoard();
}
//when you select a piece, this method returns the IDs of all of the tiles the piece is capable of moving to based on
//movement instructions of that piece.
function canMove(moves, moveLimit) { 
    //make openSpotIds into an array of objects containing the array along with whether that spot was an enemy or empty tile
    let openSpotIds = [];
    for(let i = 0; i < moves.length; i += 2) {
        let encounteredPiece = false;
        let hitBarrier = false;
        let xTracker = pieces.selectedPieceX;
        let yTracker = pieces.selectedPieceY;
        let moveCounter = 0;
        while(encounteredPiece == false && hitBarrier == false && moveCounter < moveLimit) {
            moveCounter++;
            xTracker = parseInt(xTracker) + parseInt(moves[i]);
            yTracker = parseInt(yTracker) + parseInt(moves[i + 1]);
            //if theres a piece there, do what.
            if($("#" + getID(xTracker, yTracker)).find('img').length == 1) {
                encounteredPiece = true;
                let targetAlt = $("#" + getID(xTracker, yTracker)).find('img').attr("alt").substring(0, 5);
                if(targetAlt != pieces.selectedPiece.alt.substring(0, 5)) {
                    openSpotIds.push(getID(xTracker, yTracker));
                    document.querySelector("#" + getID(xTracker, yTracker)).classList.add("enemy");
                    //needs more logic for if it encounters an opposing piece to do points prolly.
                }
            } else if(xTracker > 8 || yTracker > 8) {
                hitBarrier = true;
            } else if(xTracker < 1 || yTracker < 1) {
                hitBarrier = true;
            } else {
                openSpotIds.push(getID(xTracker, yTracker));
            }
        }
    }
    return openSpotIds;
}
function canPawnMove(attackMoves, conditionalMoves) {
    let openSpotIds = [];
    for(let i = 0; i < attackMoves.length; i += 2) {
        let newX = parseInt(pieces.selectedPieceX) + parseInt(attackMoves[i]);
        let newY = parseInt(pieces.selectedPieceY) + parseInt(attackMoves[i + 1]);
        //if theres a piece there, do what.
        if($("#" + getID(newX, newY)).find('img').length == 1) {
            let targetAlt = $("#" + getID(newX, newY)).find('img').attr("alt").substring(0, 5);
            if(targetAlt != pieces.selectedPiece.alt.substring(0, 5)) {
                openSpotIds.push(getID(newX, newY));
                document.querySelector("#" + getID(newX, newY)).classList.add("enemy");
            }
        }
    }
    let newX;
    let newY;
    for(let j = 0; j < conditionalMoves.length; j += 2) {
        newX = parseInt(pieces.selectedPieceX) + parseInt(conditionalMoves[j]);
        newY = parseInt(pieces.selectedPieceY) + parseInt(conditionalMoves[j + 1]);
        if($("#" + getID(newX, newY)).find('img').length == 0) {
            openSpotIds.push(getID(newX, newY));
        }
    }
    if($("#" + getID(newX, newY)).find('img').length == 0) {
        if((pieces.selectedPiece.alt.substring(0, 5) == "Black" && pieces.selectedPieceY == 7) || (pieces.selectedPiece.alt.substring(0, 5) == "White" && pieces.selectedPieceY == 2)) {
            for(let j = 0; j < conditionalMoves.length; j += 2) {
                newX = parseInt(newX) + parseInt(conditionalMoves[j]);
                newY = parseInt(newY) + parseInt(conditionalMoves[j + 1]);
                if($("#" + getID(newX, newY)).find('img').length == 0) {
                    openSpotIds.push(getID(newX, newY));
                }
            }    
        }
    } 
    return openSpotIds;
}
//removes the event handler that is applied to all the green "canmove" tiles.
function removeMoveHandlers() {
    for(let i = 8; i >= 1; i--) {
        for(let j = 1; j <= 8; j++) {
            let divID = getID(j, i);
            document.querySelector("#" + divID).removeEventListener("click", removeLater);
            document.querySelector("#" + divID).classList.remove("canMove");
            document.querySelector("#" + divID).classList.remove("enemy");
            document.querySelector("#" + divID).classList.remove("selected");
        }
    }
}
//the callback function for the eventlisteners attached to the green "canmove" tiles
function removeLater() {
    $("#" + pieces.selectedPiece.id).find("img").remove();
    removeMoveHandlers();
    pieces.whiteTurn = !pieces.whiteTurn;
    updateState(pieces.selectedPiece.id, event.target.id, event.target.alt);
}
//creates the event listener that lets you move based on open spots.
function letMove(openSpotIds) {
    for(let i = 0; i < openSpotIds.length; i++) {
        document.querySelector("#" + openSpotIds[i]).classList.add("canMove");
        document.querySelector("#" + openSpotIds[i]).addEventListener("click", removeLater);
    }
}

//figure out later, it says you need to use http and not file///, but d3 is acting up, stackoverflow says look at express
/*function ajaxModalInfo() {
    fetch("../yourProfile.csv")
    .then(function(response) {  //when done downloading
        return response.json();  //second promise is anonymous
    })
    .then(function(data) {  //when done encoding
        console.log("made it here");
        document.querySelector(".modal-body").innerHTML = "";
        document.querySelector(".modal-body").appendChild(document.createElement("p").textContent = "Name: " + data.name);
        document.querySelector(".modal-body").appendChild(document.createElement("p").textContent = "Wins: " + data.wins);
        console.log(data); //will now be encoded as a JavaScript object!
    })
    .catch(function(err) {
        //do something with the error
        console.error(err);  //e.g., show in the console
    });
}*/
    //PLAN, MODAL WINDOW THE PAWN MAKING IT TO END OF SCREEN, RADIO BUTTON THE OPTIONS FOR THE USER, THEN SWAP THE PAWN OUT
    //FOR THEIR SELECTED PIECE, THE USUAL CREATE NEW PIECE, REMOVE OLD, ADD NEW
    
    //NEED TO:  PROPER PAWN FUNCTIONALITY, INCLUDING MODAL WINDOW SELECT OPTIONS.
    //PROGRESS: pawn works as intended, but you can't swap it out for another piece, implement later.
    //NEED TO:  SET UP POINTS AND UPDATE THE POINTS ON SCREEN
    //:--RESOLVED--::  UPDATE THE MOVE LIST IN THE SIDE MENU, BLACK PAWN FROM H7 TO H6 ETC.
    //NEED TO:  ADD MODAL WINDOWS TO PROFILE AND ENEMY PROFILE WITH AJAX FETCHED DATA FROM A MADE UP FILE. PROFILE IS NAME AND WINS ONLY.
    //NEED TO:  SET UP CHECK FUNCTIONALITY, MAYBE A FUNCTION THAT THE KING DOES EVERY RENDER TO CHECK FOR THINGS THAT CAN HIT HIM?
    //NEED TO:  SET UP CHECKMATE AND WIN FUNCTIONALITY.
    //NEED TO:  SET UP THE TIMER, IT DOES NOTHING ATM.

    //to implement pawn first move options, the pawns can't go backwards , so they'll only be in original positions once.
//black pawn movement instructions
function bPawnMove() {
    let attackMoves = [
        -1, -1,
        1, -1
    ];
    let conditionalMoves = [
        0, -1
    ];
    let openSpotIds = canPawnMove(attackMoves, conditionalMoves);
    letMove(openSpotIds);
}
//white pawn movement instructions
function wPawnMove() {
    let attackMoves = [
        -1, 1,
        1, 1
    ];
    let conditionalMoves = [
        0, 1
    ];
    let openSpotIds = canPawnMove(attackMoves, conditionalMoves);
    letMove(openSpotIds);
}
//both rook movement instructions
function rookMove() {
    let moves = [
        0, 1,
        0, -1,
        1, 0,
        -1, 0
    ];
    let moveLimit = 8;
    let openSpotIds = canMove(moves, moveLimit);
    letMove(openSpotIds);
}
//both knight movement instructions
function knightMove() {
    let moves = [
        -1, 2,
        1, 2,
        -1, -2,
        1, -2,
        -2, 1,
        -2, -1,
        2, 1,
        2, -1
    ];
    let moveLimit = 1;
    let openSpotIds = canMove(moves, moveLimit);
    letMove(openSpotIds);
}
//both bishop movement instructions
function bishopMove() {
    let moves = [
        -1, 1,
        -1, -1,
        1, 1,
        1, -1
    ];
    let moveLimit = 8;
    let openSpotIds = canMove(moves, moveLimit);
    letMove(openSpotIds);
}
//both king movement instructions
function kingMove() {
    let moves = [
        -1, 0,
        -1, -1,
        -1, 1,
        0, 1,
        0, -1,
        1, 0,
        1, -1,
        1, 1
    ];
    let moveLimit = 1;
    let openSpotIds = canMove(moves, moveLimit);
    letMove(openSpotIds);
}
//both queen movement instructions
function queenMove() {
    let moves = [
        -1, 0,
        -1, -1,
        -1, 1,
        0, 1,
        0, -1,
        1, 0,
        1, -1,
        1, 1
    ];
    let moveLimit = 8;
    let openSpotIds = canMove(moves, moveLimit);
    letMove(openSpotIds);
}
//renders the game, the PRIMARY function of this is to apply event handlers so you can select the pieces when the game loads
window.onload = function() {
//document.querySelector(".opponents-profile").addEventListener("click", ajaxModalInfo);
renderBoard();
}