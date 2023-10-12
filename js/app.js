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
const wellSelectors = document.querySelectorAll('.playBtn'); //find the play buttons

// need to know when the user clicks buttons, specifically for:
// BTN 1 - START GAME - use a class for this one? so same buttons can be used for re-running init & then in future versions with a "forfiet" button, that can be the ID so it runs an game-over screen with scores first?
flip.addEventListener('click', coinFlip);

// BTN "2" - WELL SELECTION - when the user selects which well they want to play, take the turn
wellSelectors.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        console.log(e.target)
        takeTurn(e.target.id) // we are passing the ID directly into the function here
    });
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
    console.log('==RENDER==')
    //call checkStatus function only after first player is picked
    if (playerMove.playerThisTurn !== 'notStarted') {
        checkStatus();
    }

    //update board counters
    pieceCountEls.forEach((e) => {
        let wellNum = e.parentElement.getAttribute('id');
        e.innerText = gameBoard[wellNum].pieces;
    })
    
    let firstTurn = playerMove.turnTracker.length > 0 ? false : true;
// add a line about going again if the last piece is the well    
    //let goAgain = 
    // if the game is over, add a "game over" msg to last well, end the function here
    if (gameStatus === 'gameOver') {
        // call gameOver fun
        gameOver()
    } else if (gameStatus === 'active' && firstTurn === false ) {
        //change to the next player
        changePlayer()
    }
    
    //Section for testing the changes to state via console
    console.log('=====RENDER FUNCTION PRINT BEGIN')
    console.log('GAME BOARD---');
    console.log(gameBoard);
    console.log('PLAYERMOVE----');
    console.log(playerMove);
    console.log('GAME STATUS----');
    console.log(gameStatus);
    console.log('=====RENDER FUNCTION PRINT END')
}

//>>>>>>COIN FLIP FUNCTION
function coinFlip() {// function that randomly selects who goes first & makes gameplay active
    console.log('==COIN FLIP==')
    //Randomly assign a player to go first
    let flipNum = Math.ceil(Math.random()*10) % 2;
    let coinSide = flipNum === 0 ? 'heads' : 'tails';
    playerMove.playerThisTurn = coinSide === 'heads' ? 'playerB' : 'playerA';
    //console.log(playerMove.playerThisTurn);

    //call updateStatus function
    //updateStatus('active');
    checkStatus();

    //display message to the user on who's turn it is
    gameplayMsg(playerMove.playerThisTurn);

    //set OG button direction
    changeBtnDir(playerMove.playerThisTurn);

    //render gameboard
    render();
}

//>>>>>>CHECK STATUS FUNCTION
function checkStatus(e) {
    console.log('==CHECK STATUS==')
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
function takeTurn(id) {
    console.log('==TAKE TURN==')
    let btnID = id.slice(3);
    console.log(btnID)

    //create a thisHand object to represent the actions taken this turn,
    let thisHand = {};
    thisHand.who = playerMove.playerThisTurn;

    // move the pieces IN THE WELL THE USER SELECTED 
    // get id of btn clicked & use to find the well ID selected
    // let btnID = id;
    // let wellNumStr = 'well'+btnID.slice(7);

    //get selected well data
    let wellSelected = gameBoard[btnID];
    console.log(wellSelected)

    //if wellSelected.piece == 0, render an error message & stop fn execution
    if (wellSelected.pieces === 0){
        gameplayMsg('error');
        return
    }

    //update thisHand
    thisHand.selectedWell = btnID;
    thisHand.numPieces = wellSelected.pieces;
    //console.log(thisHand.numPieces);

    //update playerMove.lastTurn with info avail so far
    playerMove.lastTurn.who = thisHand.who;
    playerMove.lastTurn.numPieces = thisHand.numPieces;
    playerMove.lastTurn.selectedWell = btnID;

    //empty the well
    gameBoard[btnID].pieces = 0;
    console.log(btnID)

    //find the starting wellIDNum to start the while loop
    let strToInt = parseInt(btnID.slice(4))
    console.log(strToInt)
    let startingWellIDNum = strToInt === 0 ? 13 : strToInt - 1

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
    console.log('==CHANGE PLAYER==')
    let prevPlayer = playerMove.lastTurn.who
    //if last turn = player A, make this turn player B, & vice versa
    playerMove.playerThisTurn = prevPlayer == 'playerA' ? 'playerB' : 'playerA'

    //change the well the btn selects based on the current player
    changeBtnDir(playerMove.playerThisTurn);

    //display message to the user on who's turn it is
    gameplayMsg(playerMove.playerThisTurn);

    // if player B's turn, call comp turn
    //NOTE - to update when imput of 1 or 2 player
}

//>>>>>>CHANGE BTN SELECTION FUNCTION
//function to change which set of wells is being selected from
function changeBtnDir(e) {
    console.log('==CHANGE BTN DIRECTION==')
    let playerID = e;
    //set btn ID to playerA or playerB attr based on playerID
    wellSelectors.forEach((e) => {
        let idVal = e.getAttribute(playerID);
        e.setAttribute('id', 'btn'+idVal);
        e.innerText = playerID == 'playerA' ? 'v' : '^';
    });
}

//>>>>>>COMPUTER TURN FUNCTION
//need a function that will take the turn on behalf of the computer
function compTurn(){
    console.log('==COMP TURN==')


    //declare an arr that will hold the wells the computer will pick from
    let allPlayerBWells =[];

    //find all the of wells that belong to player B & push to array
    for (let i = 0 ; i <= 13 ; i++) {
        let wellID = 'well'+i;
        let wellDeets = gameBoard[wellID]
        if (wellDeets.type == 'well' && wellDeets.owner == 'playerB'){
            allPlayerBWells.push(wellID)
        }
    }

    //declare a new array for only selectable wells
    let activeWells =[];
    //for each wellID in the allPlayerBWells, find which have more than 0 still in the gameBoard
    //if they have 0, remove from arr
    for (let i = 0 ; i < allPlayerBWells.length; i++){
        let wellCheck = allPlayerBWells[i]
        console.log(wellCheck)
        if (gameBoard[wellCheck].pieces > 0) {
            activeWells.push(wellCheck)
        }
    }
    
    //pick a random index from this array & call takeTurn function with it
    let compArrPick = Math.floor(Math.random()*activeWells.length);
    let compWellPick = 'btn' + activeWells[compArrPick];
    takeTurn(compWellPick);
}


//>>>>>>ERROR MSG FUNCTION
//function to stop gameplay and render mid-gameplay messages in play area
function gameplayMsg(e){
    console.log('==GAMEPLAY MESSAGE==')
    // dont forget to make the buttons not clickable

    let messageArea = document.getElementById('gameplayMsg');
    if (e == 'playerA') {
        messageArea.innerHTML = '<span class="turnDeclariton">It\'s your turn, PlayerA!</span><br>Click a button below to pick a well and make your move!';
    } else if (e == 'playerB') {
        messageArea.innerHTML = '<span class="turnDeclariton">It\'s the robot\'s turn!</span><br>Click <button id="compStart">this button</button> to see what move it will make!'
        const compStart = document.getElementById('compStart');
        compStart.addEventListener('click', compTurn);
    } else if (e == 'error') {
        messageArea.innerHTML = '<span class="errorMsg">ERROR!</span>You cannot select a well with no pieces in it! Please pick again!</span>'
    }
}

//>>>>>>GAME OVER FUNCTION
//function to stop gameplay and render gameOver in dom
function gameOver(){
    console.log('==GAME OVER==')
    // dont forget to make the buttons not clickable
}

/*

TODO - 

gameover function
make the computer turn happen - include SOMEE user interface so it doesn't just happen in a flash - ideally one for "its player b's turn" and a pop-up of their selection

============================================
peronsonal notes section
============================================

== takeTurn - running whenever i click anywhere? Conditional doesnt seem to work
/// this is bc it was applying the click event to every element on the apge


== takeTurn - why did I need to make wellSelected = gameBoard[whatever]?
== takeTurn - conditional in while loop - can i combine?

*/