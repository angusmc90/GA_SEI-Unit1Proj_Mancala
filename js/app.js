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
    gameStatus = 'not started';
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
        well11 : {owner: "playerA", type: "well", pieces: 4,},
        well12 : {owner: "playerB", type: "well", pieces: 4,},
        well13 : {owner: "playerB", type: "well", pieces: 4,},
     };
     //console.log('init_GAME BOARD '+ gameBoard);

     //prep playerMove with correct data types
     playerMove = {
        playerThisTurn : 'not started',
        lastTurn : { // added thisTurn and lastTurn based on gut. Maybe there is a better way to do this or maybe something that is too much for an MVP at all
            who: 'not started',
            selectedWell : 'not started',
            numPieces : 0,
            lastWell : 'not started',
        }, 
        turnTracker : [],
     };
     //console.log('init_PLAYERMOVE '+ playerMove);

     render();
}

//>>>>>RENDER FUNCTION
function render() {
    let lastTurn = playerMove.lastTurn;
    // if the game is over, add a "game over" msg to last well, end the function here


    //return lastTurn.who === 'not started' ? break : playerMove.thisTurn = lastTurn.Who;
    //update playerMove obj
    // if the game hasn't started, just don't update turn tracker,
    // ekse if it has updateed, push the last move into the turn tracker array, and updatedgameStatus === 'not started' ? 


    //update board counters
    pieceCountEls.forEach((e) => {
        let wellNum = e.parentElement.getAttribute('id');
        e.innerText = gameBoard[wellNum].pieces;
    })

// COME BACK TO THIS ON SETTING GAME OVER WHEN DONE WITH OTHER SECTIONS
//CONVERT pieceEls TO NUMBERS and add for sum?
// GAME ENDS WHEN ONE PLAYERS SIDE IS EMPTY _ NEED TO FIX
    // //update gameStatus - not started / active / game over
    // //grab the number of pieces still in play
    // let inPlayCount = 48;
    // gameBoard.forEach((e) => {
    //     let wellType = e.
    // })
    // // use if sum of pieces in wells = 0, updateStatus to game over
    // inPlayCount = 0 ? updateStatus('game over') : 
    
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
    updateStatus('active');

    //render gameboard
    render();
}

//>>>>>>UPDATE GAME STATUS FUNCTION (move pieces function?)
function updateStatus(e) {
    return e === 'active' ? gameStatus = 'active' : gameStatus = 'game over';
}

//>>>>>>TAKE TURN FUNCTION (move pieces function?)
function takeTurn(e) {
    //copy lastTurn property to create a thisHand object to represent the actions taken this turn
    let thisHand = playerMove.lastTurn;
    thisHand.who = playerMove.playerThisTurn;

    //if this is the first move, continue onto the rest of the function, if this is the 2nd move or later, add lastTurn to turnTracker array
    //add exisitng values 
    let gameLog = playerMove.turnTracker;
    if (gameLog.length !== 0) { 
        gameLog.push(playerMove.lastTurn)
    };

    // move the pieces IN THE WELL THE USER SELECTED 
    //get id of btn clicked & use to find the well ID selected
    let btnID = e.target.id;
    let wellNumStr = 'well'+btnID.slice(3);
    console.log(wellNumStr);


    //update thisHand
    let wellSelected = gameBoard[wellNumStr];
    thisHand.selectedWell = wellNumStr;
    thisHand.numPieces = wellSelected.pieces;
    //console.log(thisHand.numPieces);
    //empty the well
    gameBoard[wellNumStr].pieces = 0;
    //find the starting well ID Num
    let startID = parseInt(btnID.slice(3)) + 1
    console.log('btnID: '+btnID+"| startID: "+startID)
    //loop through the rest of the wells, add one to each until the pieces in the hand are empty, skipping stores that are not the player's -note- use a i-- where if the number is less than 0, it starts at well 13


    console.log('---testing thisTurn function------')
    // console.log(thisHand)
    // console.log(playerMove)
    // console.log(gameBoard)
}


//>>>>>>COMPUTER TURN FUNCTION
//need a function that will take the turn on behalf of the computer

/*
============================================
peronsonal notes section
============================================

== takeTurn - running whenever i click anywhere? Conditional doesnt seem to work
== takeTurn - why did I need to make wellSelected = gameBoard[whatever]?


*/