/* ------------------------------ Event listeners ------------------------------ */ 

// Divs

let root = document.querySelector('#root');
let game = document.querySelector('#game');
let loginDiv = document.querySelector('#login');
let welcome = document.querySelector('#welcome');
let chooseDiff = document.querySelector('#choose-diff');
let gameOn = document.querySelector('#game-on');
let board = document.querySelector('#board');
let timer = document.querySelector('#timer');
let difficultyDisplay = document.querySelector('#difficulty-display');
let instructions = document.querySelector('#instructions');
let winDiv = document.querySelector('#win-div');

// Buttons

let regBtn = document.querySelector('#reg-btn');
let loginBtn = document.querySelector('#login-btn-main');
let guestBtn = document.querySelector('#guest-btn');

let register = document.querySelector('#register-btn');
let login = document.querySelector('#login-btn');

let returnFromReg = document.querySelector('#return-from-reg');
let returnFromLogin = document.querySelector('#return-from-login');
let returnFromDiff = document.querySelector('#return-from-diff');
let returnFromGame = document.querySelector('#return-from-game');
let returnFromWin = document.querySelector('#return-from-win');
let newGame = document.querySelector('#new-game');

let regForm = document.querySelector('#register-form');
let loginForm = document.querySelector('#login-form');

let easy = document.querySelector('#easy');
let medium = document.querySelector('#medium');
let hard = document.querySelector('#hard');

let closeInsctrucitons = document.querySelector('#close-instructions');

closeInsctrucitons.addEventListener('click',function() {
  instructions.style.display = "none";
})

//Display element functions

const display = (element) => {
  element.setAttribute("style", "display:block;");
  element.classList.remove('hidden');
  element.classList.add('visible');
}

const displayForTime = (element,ms) => {
  element.setAttribute("style", "display:block;");
  element.classList.remove('hidden');
  element.classList.add('visible');
  setTimeout(function() {
    element.classList.remove('visible');
    element.classList.add('hidden');
    element.setAttribute("style", "display:none;");
  },ms)
}

const switchDisplay = (from, to) => {
  from.classList.remove('visible');
  from.classList.add('hidden');
  setTimeout(function(){from.setAttribute("style", "display:none;")},500);
  setTimeout(function(){to.setAttribute("style", "display:flex;");},500);
  to.classList.remove('hidden');
  to.classList.add('visible');
}


// Register form actions

regBtn.addEventListener('click',function loadRegForm() {
  switchDisplay(welcome,loginDiv)
  regForm.setAttribute("style", "display:flex;");
})

let users = [];
let passwords = [];

register.addEventListener('click',function() {
  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;
  let password2 = document.querySelector('#password2').value;
  if (password == password2 && username.length > 0 && password.length > 0) {
    let success = document.querySelector('#success-register');
    displayForTime(success,3000);
    users.push(username);
    passwords.push(password);
    setTimeout(function(){
      switchDisplay(loginDiv,welcome);
      regForm.setAttribute("style", "display:none;");
    },1000);
    setTimeout(function(){
      document.querySelector('#username').value = "";
      document.querySelector('#password').value = "";
      document.querySelector('#password2').value = "";
    },2000)

  } else if (password != password2){
    let passDontMatch = document.querySelector('#pass-dont-match')
    displayForTime(passDontMatch,3000);
  } else {
    let fillAllFields = document.querySelector('#fill-all-fields')
    displayForTime(fillAllFields,3000);
    
  }
  
})

returnFromReg.addEventListener('click',function() {
  switchDisplay(loginDiv,welcome)
  setTimeout(function(){regForm.setAttribute("style", "display:none;");},500);
})


// Login form actions

loginBtn.addEventListener('click', function() {
  switchDisplay(welcome,loginDiv)
  loginForm.setAttribute("style", "display:flex;");
})

login.addEventListener('click',function() {
  if (users.length == 0){
    let noSuchUser = document.querySelector('#no-such-user');
    displayForTime(noSuchUser,2000);
  } else {
    let loginUsername = document.querySelector('#login-username').value;
    let loginPassword = document.querySelector('#login-password').value;
    let i,j;
    for (i = 0; users[i] != loginUsername && i < passwords.length; i++);
    for (j = 0; passwords[j] != loginPassword && j < passwords.length; j++);
    if (i == j) {
      switchDisplay(loginDiv,game); 
      displayForTime(instructions,20000);
    } else {
      let passDontMatch = document.querySelector('#pass-dont-match-on-login');
      displayForTime(passDontMatch,2000);
    }
  }
})

returnFromLogin.addEventListener('click',function() {
  switchDisplay(loginDiv,welcome)
  setTimeout(function(){loginForm.setAttribute("style", "display:none;");},500);
})

// Guest entry

guestBtn.addEventListener('click', function() {
  switchDisplay(welcome,game);
  displayForTime(instructions,20000);

})

//Return from choose difficulty window 

returnFromDiff.addEventListener('click',function() {
  switchDisplay(game,welcome);
})

returnFromWin.addEventListener('click',function() {
  switchDisplay(winDiv,welcome);
})

newGame.addEventListener('click',function () {
  switchDisplay(winDiv,chooseDiff);
})

//Return from board mode to main menu 

returnFromGame.addEventListener('click',function() {
  switchDisplay(gameOn,chooseDiff);
  switchDisplay(game,welcome);
  stopTimer();
  resetTimer();
})

let difficulty;

easy.addEventListener('click',function() {
  switchDisplay(chooseDiff,gameOn);
  difficultyDisplay.innerHTML = 'Easy Sudoku';
  difficulty = 'Easy';
  generateBoard(2.5);
});
medium.addEventListener('click',function() {
  switchDisplay(chooseDiff,gameOn);
  difficultyDisplay.innerHTML = 'Medium Sudoku';
  difficulty = 'Medium';
  generateBoard(2);
});
hard.addEventListener('click',function() {
  switchDisplay(chooseDiff,gameOn);
  difficultyDisplay.innerHTML = 'Hard Sudoku';
  difficulty = 'Hard';
  generateBoard(1);
});



/* ------------------------------ Game functions ------------------------------ */ 

const columnIncludes = (mat,column,num) => {
  let col = [];
  for(let i = 0; i < mat.length; i++)
    col.push(Number(mat[i][column]));
  if (col.includes(num))
    return true;
  return false;
}

const blockIncludes = (mat,mati,matj,num) => {
  let k,l;
  if (mati <= 2) k = 0;
  else if (mati <= 5) k = 3;
  else if (mati <= 8) k = 6;
  if (matj <= 2) l = 0;
  else if (matj <= 5) l = 3;
  else if (matj <= 8) l = 6;
  for (let i = k; i < k + 3 && i < mat.length; i++)
    for (let j = l; j < l + 3 && j < mat[i].length; j++)
      if (mat[i][j] == num)
        return true;
  return false;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const generateRow = (sudoku,rowNum) => {
  let tries = 0;
  while (true) {
    let row = [];
    let nums = [1,2,3,4,5,6,7,8,9];
    row = shuffleArray(nums);
    let columnFlag = 1;
    if (rowNum == 0)
      return row;
    else {
      row.forEach((value,index) => {
        if (columnIncludes(sudoku,index,value))
          columnFlag = 0;
      })
      if (columnFlag) {
        let blockFlag = 1;
        row.forEach((value,index) => {
          if (blockIncludes(sudoku,rowNum,index,value))
            blockFlag = 0;
        })
        if (blockFlag)
          return row;
         else
          if (tries == 300)
            return false;
          else 
            tries++;
      }
    } 
  }
}

const generateSudoku = () => {
  let sudoku = [];
  let rows = 0;
  while (rows < 9) {
    let row = generateRow(sudoku,rows);
    if (row){
      sudoku.push(row);
      rows++;
    } else {
      sudoku.pop();
      sudoku.pop();
      rows--;
      rows--;
    }
  }
  return sudoku;
}

let sudoku;
let revealedSudoku = [];

const generateBoard = (difficulty) => {
  sudoku = generateSudoku();
  reveal(difficulty,sudoku);
  startTimer();
  empties = document.querySelectorAll('.empty');
  for(const empty of empties){
    empty.addEventListener('dragover',dragOver);
    empty.addEventListener('dragenter',dragEnter);
    empty.addEventListener('dragleave',dragLeave);
    empty.addEventListener('drop',dragDrop);
  }
}

let empties;

const reveal = (difficulty,sudoku) => {
  let boardContent = '';
  let toReveal = difficulty * 20;
  let revealed = 0;
  let revealedArray = [];
  while (revealed < toReveal){
    let i = Math.floor(Math.random() * 9 + 1);
    let j = Math.floor(Math.random() * 9 + 1);
    if (!revealedArray[i * 9 + j]){
      revealedArray[i * 9 + j] = 1;
      revealed++;
    }
  }
  for (let i = 0; i < 9 ;i++){
    revealedSudoku[i] = [];
    for (let j = 0; j < 9; j++){
      revealedSudoku[i][j] = 0;
    }
  }

  sudoku.forEach((row,i) => {
    boardContent += '<div class="row">';
    row.forEach((value,j) => {
      if (revealedArray[i * 9 + j]){
        boardContent += `<div class="cell static" >${value}</div>`;
        revealedSudoku[i][j] = value;
      } else {
        boardContent += `<div class="cell empty" id="${i}${j}"></div>`;
      }
    })
    boardContent += '</div>';
  })
  board.innerHTML = boardContent;
}

let status = 0;
let time = 0;

function startTimer() {
  status = 1;
  timerSet();
}
function stopTimer() { 
  status = 0;
}
function resetTimer() {
  status = 0;
  time = -1;
  timer.innerHTML = "00:00"
}
function timerSet() {
  if (status == 1) {
    setTimeout(function() {
      time++;
      let min = Math.floor(time/60)
      let sec = Math.floor(time%60);

      if (min < 10) {
        min = "0" + min;
      } 
      if (sec >=60 ) {
        sec = sec % 60;
      } 
      if (sec < 10) {
        sec = "0" + sec;
      }
      timer.innerHTML = min + ":" + sec;
      timerSet();
    },1000)
  }
}

const colorRow = (i) => {
  if (!board.children[i].classList.add('red-hover'))
    board.children[i].classList.add('red-hover');
}
const colorColumn = (j) =>{
  for (let i = 0; i < board.children.length; i++) {
    if(!board.children[i].children[j].classList.add('red-hover'))
      board.children[i].children[j].classList.add('red-hover');
  }
}

const colorBlock = (color,mati,matj) => {
  let k,l;
  if (mati <= 2) k = 0;
  else if (mati <= 5) k = 3;
  else if (mati <= 8) k = 6;
  if (matj <= 2) l = 0;
  else if (matj <= 5) l = 3;
  else if (matj <= 8) l = 6;
  if (color){
    for (let i = k; i < k + 3 ; i++)
      for (let j = l; j < l + 3; j++)
          board.children[i].children[j].className += ' red-hover';
  } else {
    for (let i = k; i < k + 3 ; i++)
      for (let j = l; j < l + 3; j++)
          board.children[i].children[j].classList.remove('red-hover');
  }
}

const blockIsColored = (mati,matj) => {
  let k,l;
  if (mati <= 2) k = 0;
  else if (mati <= 5) k = 3;
  else if (mati <= 8) k = 6;
  if (matj <= 2) l = 0;
  else if (matj <= 5) l = 3;
  else if (matj <= 8) l = 6;
  for (let i = k; i < k + 3 ; i++)
    for (let j = l; j < l + 3; j++)
        if(!board.children[i].children[j].classList.contains(' red-hover'))
          return false;
  return true;
}

var fills = document.querySelectorAll('.fill');

// Fill listeners

for (const fill of fills) {
    fill.addEventListener('dragstart', dragStart);
    fill.addEventListener('dragend', dragEnd);
}

// Drag Functions

let hold;

function dragStart(e) {
  // if (blockIsColored(e.target.id[0],e.target.id[1])){
  //   colorBlockBack(e.target.id[0],e.target.id[1])
  // }
  if (this.classList.contains('on-board')){
    // console.log(e.target.id[0],e.target.id[1])
    this.className = 'cell fill hold';
    hold = document.querySelector('.hold');
    empties++;
      setTimeout(() => {
        this.innerHTML = '';
        this.className = 'cell empty';
        this.setAttribute('draggable','false');
        revealedSudoku[Number(hold.id[0])][Number(hold.id[1])] = 0;
        if(!blockIsColored(hold.id[0],hold.id[1]))
          colorBlock(0,hold.id[0],hold.id[0]);
        if(board.children[hold.id[0]].classList.contains('red-hover'))
          board.children[hold.id[0]].classList.remove('red-hover')
        if(board.children[hold.id[0]].children[hold.id[1]].classList.contains('red-hover'))
          for (let i = 0; i < 9; i++){
            board.children[i].classList.remove('red-hover')
          }
      }, 2000);
  } else {
    this.className = 'cell fill hold';
    hold = document.querySelector('.hold');

  }
  if (this.parentNode.classList.contains('hovered')) {
    this.parentNode.classList.remove('hovered');
  }
}

function dragEnd(e) {
  if (e.target.parentNode.parentNode == board){
    this.className = 'cell fill on-board';
  } else  {
    this.className = 'cell fill';
  }

}

function dragOver(e) {
  e.preventDefault();
  let i = this.id[0];
  let j = this.id[1];
  let num = Number(hold.innerHTML);
  if (columnIncludes(revealedSudoku,j,num)) {
    if (!board.children[i].children[j].classList.contains('red-hover'))
      colorColumn(j);
  } 
  if (revealedSudoku[i].includes(num)){
    if (!board.children[i].classList.contains('red-hover'))
      colorRow(i);
  }
  if (blockIncludes(revealedSudoku,i,j,num)) {
    if(!blockIsColored(i,j))
      colorBlock(1,i,j);
    if (!blockIncludes(revealedSudoku,i,j,num) && blockIsColored(i,j))
      colorBlock(0,i,j)
  }
}

function dragEnter(e) {
  e.preventDefault();
  if (!this.classList.contains('hovered'))
    this.classList.add('hovered');
}

function dragLeave(e) {
  if (e.target.classList.contains('hovered')){
    if (e.target.classList.contains('static')){
      this.className = 'cell static';
    } else if (e.target.classList.contains('empty')){
      this.className = 'cell empty';
    } 
  }
  if(!blockIsColored(e.target.id[0],e.target.id[1]))
    colorBlock(0,e.target.id[0],e.target.id[1]);
  let num = Number(hold.innerHTML);
  if (board.children[this.id[0]].classList.contains('red-hover')){
    board.children[this.id[0]].classList.remove('red-hover');
  } 
  if (columnIncludes(revealedSudoku,this.id[1],num)) {
    for (let i = 0; i < board.children.length; i++) {
      if (board.children[i].children[this.id[1]].classList.contains('red-hover')){
        if (board.children[i].children[this.id[1]].classList.contains('static')){
          board.children[i].children[this.id[1]].className = 'cell static';
        } else {
          board.children[i].children[this.id[1]].className = 'cell';
        }
      }
    }
  }
}

function dragDrop(e) {
  this.setAttribute("class", "cell fill on-board");
  this.setAttribute("draggable", "true");
  empties = 0;
  if (e.target.classList.contains('cell')) {
    revealedSudoku[Number(e.target.id[0])][Number(e.target.id[1])] = Number(hold.innerText)
    revealedSudoku.forEach(row => {
      row.forEach(value => {
        if (value == 0){
          empties++;
        }
      })
    });
  } else {
    empties--;
  }
  this.innerHTML = `${hold.innerText}`;
  fills = document.querySelectorAll('.fill');
  for (const fill of fills) {
    fill.addEventListener('dragstart', dragStart);
    fill.addEventListener('dragend', dragEnd);
  }
  if (empties == 0) {
    if (checkSudoku (sudoku, revealedSudoku)){
      stopTimer ();
      let finishTime = Math.floor(time/60) + ":" + Math.floor(time%60);
      let content = `Congrats! You've finished the ${difficulty} sudoku in just ${finishTime} !`
      winDiv.prepend(content);
      switchDisplay (game, winDiv);
    }
  }
}

function checkSudoku (originalSudoku, newSudoku) {
  let flag = true;
  for (let i = 0; i < 9 && flag; i++) {
    for (let j = 0; j < 9 && flag; j++){
      if (originalSudoku[i][j] != newSudoku[i][j]){
        flag = false;
      }
    }
  } 
  return flag;
} 

