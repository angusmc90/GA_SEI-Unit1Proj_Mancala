/*
STATES ==================
*/

let gameStatus; // "gameplay state" to status
let gameBoard; // object with keys to represent the well, and objects to represent which player owns the well, well vs store, and count of pieces
let playerMove; // object that tracks who's turn it is, it was, the well selected last turn, the number of pieces taken from that well, the well that last piece was placed in, and a turn tracker array


/*
EVENT LISTENERS & DOM ELEMENTS==================
*/

const flip = document.querySelector('.restartGame'); //find the flip coin button / game start button
const pieceCountEls = document.querySelectorAll('.seedCount'); //find the el where the piece counter will be
const wellSelectors = document.querySelectorAll('.playBtn');//find the play buttons

// need to know when the user clicks buttons, specifically for:
// BTN 1 - START GAME - use a class for this one? so same buttons can be used for re-running init & then in future versions with a "forfiet" button, that can be the ID so it runs an game-over screen with scores first?
flip.addEventListener('click', coinFlip);

// BTN 2ish - WELL SELECTION - when the user selects which well they want to play, take the turn
wellSelectors.forEach((e) => {
    addEventListener('click', takeTurn);
});

/*
CONTROLLERS ==================
*/

init();
//>>>>>>INIT FUNCTION
// to render a clean game board & prep for gameplay
function init() {
    //set gameStatus
    gameStatus = 'notStarted';
    //console.log('init_GAME STATUS ' + gameStatus);

    //reset the game board to starting state
    gameBoard = {
        well0 : {owner: "playerB", type: "well", pieces: 4,},
        well1 : {owner: "playerB", type: "well", pieces: 4,},
        well2 : {owner: "playerB", type: "well", pieces: 4,},
        well3 : {owner: "playerA", type: "store", pieces: 0,},
        well4 : {owner: "playerA", type: "well", pieces: 4,},
        well5 : {owner: "playerA", type: "well", pieces: 4,},
        well6 : {owner: "playerA", type: "well", pieces: 4,},
        well7 : {owner: "playerA", type: "well", pieces: 4,},
        well8 : {owner: "playerA", type: "well", pieces: 4,},
        well9 : {owner: "playerA", type: "well", pieces: 4,},
        well10 : {owner: "playerB", type: "store", pieces: 0,},
        well11 : {owner: "playerB", type: "well", pieces: 4,},
        well12 : {owner: "playerB", type: "well", pieces: 4,},
        well13 : {owner: "playerB", type: "well", pieces: 4,},
     };
     //console.log('init_GAME BOARD '+ gameBoard);

     //prep playerMove with correct data types
     playerMove = {
        playerThisTurn : 'notStarted',
        lastTurn : { // added thisTurn and lastTurn based on gut. Maybe there is a better way to do this or maybe something that is too much for an MVP at all
            who: 'notStarted',
            selectedWell : 'notStarted',
            numPieces : 0,
            lastWell : 'notStarted',
        }, 
        turnTracker : [],
     };
     //console.log('init_PLAYERMOVE '+ playerMove);

     render();
}

//>>>>>RENDER FUNCTION
function render() {
    //call checkStatus function only after first player is picked
    if (playerMove.playerThisTurn !== 'notStarted') {
        checkStatus();
        console.log('this ran')
    }

    //update board counters
    pieceCountEls.forEach((e) => {
        let wellNum = e.parentElement.getAttribute('id');
        e.innerText = gameBoard[wellNum].pieces;
    })

    //update btns based on playerTurn
    if (playerMove.playerThisTurn !== 'notStarted') {
        changeBtnDir(playerMove.playerThisTurn);
    }

    // if the game is over, add a "game over" msg to last well, end the function here
    if (gameStatus === 'gameOver') {
        // call gameOver fun
        gameOver()
    } else {
        //change to the next player
        changePlayer()
    }
    
    //Section for testing the changes to state via console
    console.log('rend_GAME BOARD---');
    console.log(gameBoard);
    console.log('rend_PLAYERMOVE----');
    console.log(playerMove);
    console.log('rend_GAME STATUS----');
    console.log(gameStatus);
}

//>>>>>>COIN FLIP FUNCTION
function coinFlip() {// function that randomly selects who goes first & makes gameplay active
    //Randomly assign a player to go first
    let flipNum = Math.ceil(Math.random()*10) % 2;
    let coinSide = flipNum === 0 ? 'heads' : 'tails';
    playerMove.playerThisTurn = coinSide === 'heads' ? 'playerB' : 'playerA';
    //console.log(playerMove.playerThisTurn);

    //call updateStatus function
    //updateStatus('active');
    checkStatus();

    //render gameboard
    render();
}

//>>>>>>CHECK STATUS FUNCTION
function checkStatus(e) {
    //build a playerA & playerB wells
    let playerAWells = 0;
    let playerBWells = 0;
    //count pieces in each row
    for (let i =0 ; i <= 13 ; i++) {
        let wellID = 'well'+i;
        let wellDeets = gameBoard[wellID]
        if (wellDeets.type == 'well' && wellDeets.owner == 'playerA'){
            playerAWells += wellDeets.pieces
        } else if (wellDeets.type == 'well' && wellDeets.owner == 'playerB'){
            playerBWells += wellDeets.pieces
        }
    }
    //if sum of either = 0, set gameStatus to game over
    //either, set to active
    gameStatus = playerAWells === 0 || playerBWells === 0 ? 'gameOver' : 'active';
}

//>>>>>>TAKE TURN FUNCTION (move pieces function?)
function takeTurn(e) {
    //create a thisHand object to represent the actions taken this turn,
    let thisHand = {};
    thisHand.who = playerMove.playerThisTurn;

    // move the pieces IN THE WELL THE USER SELECTED 
    //get id of btn clicked & use to find the well ID selected
    let btnID = e.target.id;
    let wellNumStr = 'well'+btnID.slice(3);
    //console.log(wellNumStr);


    //update thisHand
    let wellSelected = gameBoard[wellNumStr];
    thisHand.selectedWell = wellNumStr;
    thisHand.numPieces = wellSelected.pieces;
    //console.log(thisHand.numPieces);

    //update playerMove.lastTurn with info avail so far
    playerMove.lastTurn.who = thisHand.who;
    playerMove.lastTurn.numPieces = thisHand.numPieces;
    playerMove.lastTurn.selectedWell = wellNumStr;

    //empty the well
    gameBoard[wellNumStr].pieces = 0;

    //find the starting wellIDNum to start the while loop
    let startingWellIDNum = parseInt(btnID.slice(3)) - 1

    while (thisHand.numPieces > 0) {
        // define the next well we are looking at
        let thisWell = 'well'+startingWellIDNum;
        let thisWellType = gameBoard[thisWell].type;
        let thisWellOwner = gameBoard[thisWell].owner;
        // if that well is one the player can put a piece in aka is not the opp store, then add one piece to it & subtract from the hand
        if (thisWellType == 'well') {
            gameBoard[thisWell].pieces += 1;
            thisHand.numPieces -= 1;
        } else if (thisWellType == 'store' && thisWellOwner == thisHand.who) {
            gameBoard[thisWell].pieces += 1;
            thisHand.numPieces -= 1;
        };
        
        //if this is the last piece, add to lastTurn subObject to turn tracker & v2 addition of capture functionality
        if (thisHand.numPieces === 0) {
            playerMove.lastTurn.lastWell = thisWell;
        };

        // move onto next well, unless you are on well 0, in which case, set wellIDNum to 13 and contiue with loop
        startingWellIDNum = startingWellIDNum === 0 ? 13 : startingWellIDNum-1;
    };

    //push lastTurn info to turnTracker
    playerMove.turnTracker.push(playerMove.lastTurn);

    render()
}


//>>>>>>CHANGE PLAYER FUNCTION
//function to switch to the next player's turn and select from a different row of wells
function changePlayer(){
    let prevPlayer = playerMove.lastTurn.who
    //if last turn = player A, make this turn player B, & vice versa
    playerMove.playerThisTurn = prevPlayer == 'playerA' ? 'playerB' : 'playerA'

    // if player B's turn, call comp turn
    //NOTE - to update when imput of 1 or 2 player
}

//>>>>>>CHANGE BTN SELECTION FUNCTION
//function to change which set of wells is being selected from
function changeBtnDir(e) {
    console.log('change button direction fn')
    let playerID = e;
    //create an array of the btn ID numbers for the conditional to push to
    let btnIDArr = [];
    for (let i =0 ; i <= 13 ; i++) {
        let wellID = 'well'+i;
        let wellDeets = gameBoard[wellID]
        if (wellDeets.owner === playerID && wellDeets.type === 'well'){
            let btnIDStr = 'btn'+i
            btnIDArr.push(btnIDStr)
        }
    }

    //change button element id to the btn array
}

//>>>>>>COMPUTER TURN FUNCTION
//need a function that will take the turn on behalf of the computer
function compTurn(){
    console.log('this is the compTurn fn')
    //make sure to add messages before calling takeTurn function for computer
    //and before calling change player fn to switch back to user
}


//>>>>>>GAME OVER FUNCTION
//function to stop gameplay and render gameOver messaging in dom
function gameOver(){
    console.log('this is the gameOver fn')
    // dont forget to make the buttons not clickable
}

/*

TODO - 

gameover function
change player turn
make the computer turn happen - include SOMEE user interface so it doesn't just happen in a flash - ideally one for "its player b's turn" and a pop-up of their selection

============================================
peronsonal notes section
============================================

== takeTurn - running whenever i click anywhere? Conditional doesnt seem to work
== takeTurn - why did I need to make wellSelected = gameBoard[whatever]?
== takeTurn - conditional in while loop - can i combine?
== takeTurn - turnTracker keeps pushing wrong thing?

*/