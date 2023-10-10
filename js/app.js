/*

STATES ==================

*/

let gameStatus; // "gameplay state" to camputure who's turn & status
let gameBoard; // object with keys to represent the well, and objects to represent which player owns the well, well vs store, and count of pieces
let playerMove; // object that tracks who's turn it is, it was, the well selected last turn, the number of pieces taken from that well, the well that last piece was placed in, and a turn tracker array


/*

EVENT LISTENERS & DOM ELEMENTS==================

*/
const flip = document.querySelector('.restartGame');
const pieceCountEls = document.querySelectorAll('.seedCount');

// need to know when the user clicks buttons, specifically for:
// BTN 1 - START GAME - use a class for this one? so same buttons can be used for re-running init & then in future versions with a "forfiet" button, that can be the ID so it runs an game-over screen with scores first?
flip.addEventListener('click', coinFlip);



// BTN 2ish - WELL SELECTION - when the user selects which well they want to play




/*

CONTROLLERS ==================

*/

init();
//>>>>>>INIT FUNCTION
// to render a clean game board & prep for gameplay
function init() {
    //set gameStatus
    gameStatus = 'not started';
    console.log(gameStatus);

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
     console.log(gameBoard);

     //prep playerMove with correct data types
     playerMove = {
        thisTurn : 'not started',
        lastTurn : { // added thisTurn and lastTurn based on gut. Maybe there is a better way to do this or maybe something that is too much for an MVP at all
            who: 'not started',
            selectedtWell : 'not started',
            numPieces : 0,
            lastWell : 'not started',
        }, 
        turnTracker : [],
     };
     console.log(playerMove);

     render();
}

//>>>>>RENDER FUNCTION
// what renders the game board
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


    //update gameStatus - not started / active / game over
    //grab the number of pieces still in play
    let inPlayCount = 1;
    // use if sum of pieces in wells = 0, call gameOver function
    // else carry on your way
    inPlayCount > 0 ? updateStatus('Active') : updateStatus('Game Over')
    
    //Section for testing the changes to state via console
    console.log(gameBoard);
    console.log(playerMove);
    console.log(gameStatus);
}

//>>>>>>COIN FLIP FUNCTION
// function that randomly selects who starts the game
function coinFlip() {
    //Randomly assign a player to go first
    let random = Math.ceil(Math.random *2);
    random % 2 == 0 ? playerMove.thisTurn = 'playerB' : playerMove.thisTurn = 'playerA';

    //call updateStatus function
    updateStatus('Active');

    //render gameboard
    render();
}



//>>>>>>UPDATE GAME STATUS FUNCTION (move pieces function?)
function updateStatus(e) {
    return e === 'Active' ? gameStatus = 'Active' : gameStatus = 'Game Over';
}





//>>>>>>TAKE TURN FUNCTION (move pieces function?)
// move the pieces IN THE WELL THE USER SELECTED 
// starting with the very next well & going counter clock-wise ADD ONE PIECE TO THE WELL 
// for each piece IN THAT PLAYERS HAND






/*
%%%%% BUG HELP %%%%%

coinFlip - keeps assigning player A?


*/