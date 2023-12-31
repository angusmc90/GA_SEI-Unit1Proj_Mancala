/*
STATES ==================
*/

let gameStatus; // "gameplay state" to status
let gameBoard; // object with keys to represent the well, and objects to represent which player owns the well, well vs store, and count of pieces
let playerMove; // object that tracks who's turn it is, it was, the well selected last turn, the number of pieces taken from that well, the well that last piece was placed in, and a turn tracker array
let scores; // will need to call in player scores from a top-level at some point


/*
EVENT LISTENERS & DOM ELEMENTS==================
*/

const flip = document.querySelector('.restartGame'); //find the flip coin button / game start button
const pieceCountEls = document.querySelectorAll('.seedCount'); //find the el where the piece counter will be
const wellSelectors = document.querySelectorAll('.playBtn'); //find the play buttons
const instructions = document.querySelector('#stepByStep');
const ahnk= document.querySelector('#ankhOpenDiv');

// need to know when the user clicks buttons, specifically for:
// BTN 1 - START GAME - use a class for this one? so same buttons can be used for re-running init & then in future versions with a "forfiet" button, that can be the ID so it runs an game-over screen with scores first?
flip.addEventListener('click', coinFlip);

// BTN "2" - WELL SELECTION - when the user selects which well they want to play, take the turn
wellSelectors.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        takeTurn(e.target.id) // we are passing the ID directly into the function here
    });
});

ahnk.addEventListener('click', () => {
    let instruct= instructions;
    let ahnkPic = ahnk 
    if (instruct.className == 'hide'){
        instruct.className = 'noClass';
        ahnkPic.className = 'close';
    } else {
        instruct.className = 'hide';
        ahnkPic.className = 'open';
    }
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

     //
     scores = {
        playerA : 0,
        playerB : 0,
        winner : '',
        loser : '',
     }

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
        let numPieces = gameBoard[wellNum].pieces;
        let imgEls = '<span class="seedCount"></span>';
        for (let i=1; i <= numPieces; i++){
            imgEls += '<img src="https://i.imgur.com/4v5EyDk.png" class="pieces">';
        }
        e.innerHTML = imgEls;
    })
    
    let firstTurn = playerMove.turnTracker.length > 0 ? false : true;
    
    // check if the same player gets to go again
    if (!firstTurn) {
        let lastWell = playerMove.lastTurn.lastWell;
        let goAgain = gameBoard[lastWell].type == 'store' ? true : false;
            // if the game is over, add a "game over" msg to last well, end the function here
        if (gameStatus === 'gameOver') {
            // call gameOver fun
            gameOver()
        } else if (goAgain === true) {
            // if the last piece lands in the player's well, don't change players 
            return
        } else if (gameStatus === 'active' && firstTurn === false ) {
            //change to the next player
            changePlayer()
        }
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
    let coinSide = flipNum === 0 ? 'horus' : 'ra';
    playerMove.playerThisTurn = coinSide === 'horus' ? 'playerB' : 'playerA';
    //console.log(playerMove.playerThisTurn);

    //call updateStatus function
    //updateStatus('active');
    checkStatus();

    //display message to the user on who's turn it is
    gameplayMsg(coinSide);

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
    let playerID = e

    //set btn ID to playerA or playerB attr based on playerID
    wellSelectors.forEach((e) => {
        let idVal = e.getAttribute(playerID);
        let classList = e.classList;
        if (classList.contains('noone')){
            classList.remove('noone')
        };
        e.setAttribute('id', 'btn'+idVal);
        let oldClass = playerID == 'playerA' ? 'playerB' : 'playerA';
        classList.toggle(playerID);
        if (classList.contains(oldClass)){
            classList.remove(oldClass)
        };
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


//>>>>>>GAME OVER FUNCTION
//function to stop gameplay and render gameOver in dom
function gameOver(){
    console.log('==GAME OVER==')
    // dont forget to make the buttons not clickable
    let playerAPoints = scores.PlayerA + 1;
    let playerBPoints = scores.PlayerB;
    for (let i=0;i<gameBoard.length;i++){
        let wellName = 'well' + i;
        let thisWell = gameBoard[wellName];
        let wellOwner = thisWell.owner;
        let points = thisWell.pieces;
        if (wellOwner === 'playerA'){
            playerAPoints = playerAPoints + points
        } else {
            playerBPoints = playerBPoints + points
        }
    }

    scores.PlayerA = playerAPoints;
    scores.PlayerB = playerBPoints;

    if (playerAPoints === playerBPoints) {
        gameplayMsg('tie');
    } else if (playerAPoints > playerBPoints) {
        scores.Winner='You';
        scores.Loser='The Pharoh';
        gameplayMsg('userWins');
    } else {
        scores.Loser='You';
        scores.Winner='The Pharoh';
        gameplayMsg('userWins');
        gameplayMsg('pharohWins');
    }
}



//>>>>>>ERROR MSG FUNCTION
//function to stop gameplay and render mid-gameplay messages in play area
function gameplayMsg(e){
    console.log('==GAMEPLAY MESSAGE==')
    let signal = e;
    let winner = scores.Winner;
    let loser = scores.Loser;

    //assign all of the msgs available to variables
    let playerAsTurn = (
        '<div class="instructMsg">It\'s your turn, Player!</div><img src="https://i.imgur.com/jsZ6wgG.png" id="selfPortrait"><div class="instructMsg">Click a button below to pick a well and make your move!</div>'
    );
    let playerBsTurn= (
        '<div class="instructMsg">It\'s The Pharoh\'s turn!</div><button id="compStart"></button><div><span class="instructMsg">Click their face to see what move they will make!</div>'
    )
    // let playerBsLastTurn=()
    let errorMsg = (
        '<div class="errorMsg instructMsg">ERROR!</div><img src="https://i.imgur.com/BUi4Vcg.png" class="errorImg"><div class="insructMsg">You cannot select a well with no pieces in it!<br><span class="instructMsg">Please make another selection!</div>'
    )
    let flip4Horus = (
        '<div class="instructMsg">Oh no! It looks like The Pharoh is going first!</div><button id="coinHorus" class="shimmer"></button><div>Let\'s hope this doesn\'t put us at a disadvantage!</div><br><br>'
    )
    let flip4Ra = (
        '<div class="instructMsg">Yes! Looks like you get to go first!</div><button id="coinRa" class="shimmer"></button><div>Let\'s make the most of this! If we believe in the heart of the cards, we can\'t lose!</div><br><br>'
    )
    let userWins = (
        '<div class="endgameMsg">Way to go Yugi boy!</div><div>Looks like you had the power of God & anime on your side!</div><img src="https://i.imgur.com/3AGIElH.png" class="endgameImg"><br><button id="gameStartBtn">Play Again</button>'
    )
    let pharohWins = (
        '<div class="endgameMsg">You\'ve been sent to the shadow realm!</div><div>This must be one of Yugi\'s games to try and take over my company!</div><img src="https://i.imgur.com/czIXQq8.jpeg" class="endgameImg"><br><button id="gameStartBtn">Now I can go find Mokuba</button>'
    )
    let results = (
        '<div id="winner">'+winner+' : '+scores[winner]+'</div><div id="loser">'+loser+' : '+scores[loser]+'</div>'
    )

    //Add the right error message to the DOM based on the info passed into the function
    let messageArea;
    let sectionEls = document.getElementsByName('section');
    let flexContainer = document.getElementById('topContainerDiv');
    
    if (gameStatus !== 'gameOver') {
        messageArea = document.getElementById('gameplayMsg')
        messageArea.innerHTML = signal == 'playerA' ? playerAsTurn
                                :signal == 'playerB' ? playerBsTurn 
                                :signal == 'error' ? errorMsg 
                                :signal == 'horus' ? flip4Horus + playerBsTurn : flip4Ra + playerAsTurn
    } else {
        sectionEls.forEach((e) => {
            e.className = 'hide';
        });
        flexContainer.appendChild('div');
        sectionEls.setAttribute('id', 'gameplayMsg');
        messageArea.innerHTML = signal == 'playerAWon' ? userWins + results : pharohWins + results
    }
}

/*

TODO - 

-gameover function
-on comp turn, make buttons not clickable?
-find a better was to pop gameplay message
---include a msg with computer's turn
---add a line to go again

============================================
peronsonal notes section
============================================

== takeTurn - running whenever i click anywhere? Conditional doesnt seem to work
/// this is bc it was applying the click event to every element on the apge


== takeTurn - why did I need to make wellSelected = gameBoard[whatever]?
== takeTurn - conditional in while loop - can i combine?

*/