let arr;
let checkOpened;  //실제 보드에 출력 여부 결정, 0: 오픈 안함 / 1:오픈 함
let visited; //0: 방문 안함 , 1: 방문 함 , dfs에서 빈칸 확장해나가는데 사용
let checkerRight; // 오른쪽 버튼 눌렸는지 0과 1로 확인
let mineNumber;
let boardSize;
let timer;

function setBoardValue(data, i, j) {
    let element = document.getElementById(i + "," + j);
    switch (data[i][j]) {
        case -1:
            element.textContent = "💣";
            break;
        case 0:
            element.textContent = "⬜️";
            break;
        case 1:
            element.textContent = "1️⃣";
            break;
        case 2:
            element.textContent = "2️⃣";
            break;
        case 3:
            element.textContent = "3️⃣";
            break;
        case 4:
            element.textContent = "4️⃣";
            break;
        case 5:
            element.textContent = "5️⃣";
            break;
        case 6:
            element.textContent = "6️⃣";
            break;
        case 7:
            element.textContent = "7️⃣";
            break;
        case 8:
            element.textContent = "8️⃣";
            break;
    }
}

function updateBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (checkOpened[i][j] == 1) {
                setBoardValue(arr, i, j);
            } else {
                if (checkerRight[i][j] == 1) {
                    document.getElementById(i + "," + j).textContent = "🚩";
                } else {
                    document.getElementById(i + "," + j).textContent = "🟪";
                }
            }
        }
    }
}

function makeBoard() {
    const boardDiv = document.getElementById("board");
    const tb = document.createElement("table");
    tb.setAttribute("id", "table__game");
    for (let i = 0; i < boardSize; i++) {
        const currentTR = document.createElement("tr");
        for (let j = 0; j < boardSize; j++) {
            const currentTD = document.createElement("td");
            currentTD.setAttribute("id", i + "," + j);
            currentTD.appendChild(document.createTextNode("🟪"));
            currentTR.appendChild(currentTD);
        }
        tb.appendChild(currentTR);
    }
    boardDiv.appendChild(tb);
}

//새로운 배열 만들기 (초기화)
function makeArray(boardSize) {
    let data = new Array(boardSize);

    for (let i = 0; i < data.length; i++) {
        data[i] = new Array(boardSize);
        for (let j = 0; j < data[i].length; j++) {
            data[i][j] = 0;
        }
    }

    return data;
}

//바운더리 체크
function isAvailableIndex(data, col, row) {
    if (col < 0 || row < 0) return false;

    if (col >= data.length || row >= data.length) return false;

    return true;
}

//조건에 맞게 탐색
function dfs(data, col, row) {
    if (data[col][row] > 0) { //숫자
        checkOpened[col][row] = 1;
        return; // 더 오픈 x
    } else if (data[col][row] == -1) { //지뢰
        return; // 오픈 x
    } else { //빈칸
        checkOpened[col][row] = 1;
        for (let i = col - 1; i <= col + 1; i++) {
            for (let j = row - 1; j <= row + 1; j++) {
                if (isAvailableIndex(data, i, j) == false) continue;
                if (i !== col && j !== row) continue; // 사방(위, 아래, 오, 왼) 만 확인
                if (visited[i][j] !== 1) { // 방문 안 했을 때만 돌아야 하니까
                    visited[i][j] = 1;
                    dfs(data, i, j); // 빈칸일 때는 계속 돌아줌
                }
            }
        }
    }
}

// 게임판을 생성
function setBoard() {

    arr = makeArray(boardSize);
    checkOpened = makeArray(boardSize);
    checkerRight = makeArray(boardSize);

    let currentMine = 0;

    // 지뢰 while 문에서 생성
    while (true) {
        let i = Math.floor(Math.random() * arr.length);
        let j = Math.floor(Math.random() * arr.length);

        // 지뢰 중복체크
        if (arr[i][j] !== -1) {
            arr[i][j] = -1;
            currentMine++;  // 지뢰가 심어졌으니까 개수 카운팅
        }
        if (currentMine == mineNumber) break;
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i][j] == -1) {
                addNumOnBoard(arr, i, j);
            }
        }
    }
};

// 숫자 설정 (뿌려주기) - 폭탄일 때 8자리 검사하면서 숫자 뿌리기
function addNumOnBoard(board, col, row) {
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (isAvailableIndex(board, i, j) == false) continue;
            if (board[i][j] !== -1) {
                board[i][j]++; // + 해주면서 8자리 주변의 숫자를 카운팅
            }
        }
    }
}

function processLeft(value) {
    const axis = value.split(",");

    let x = parseInt(axis[0]);
    let y = parseInt(axis[1]);

    if (checkOpened[x][y] == 1) return; //누른거 또 노름

    if (arr[x][y] >= 1) { // 0: 빈칸 , 1: 숫자 , -1: 지뢰
        checkOpened[x][y] = 1;
    } else if (arr[x][y] == -1) {
        checkOpened = Array.from(Array(boardSize), () => Array(boardSize).fill(1));
        updateBoard();
        clearInterval(timer);
        alert("Game over");
    } else {
        visited = makeArray(boardSize);
        dfs(arr, x, y);
    }
}

function processRight(value) {
    const axis = value.split(",");
    let myflag = document.getElementById("myflag");

    let x = parseInt(axis[0]);
    let y = parseInt(axis[1]);

    if (checkerRight[x][y] == 1) {
        checkerRight[x][y] = 0;
        myflag.innerText = parseInt(myflag.innerText) - 1;
    } else {
        checkerRight[x][y] = 1;
        myflag.innerText = parseInt(myflag.innerText) + 1;
    }

    updateBoard();

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (checkerRight[i][j] == 1 && arr[i][j] !== -1) {
                return;
            }
            if (checkerRight[i][j] == 0 && arr[i][j] == -1) {
                return;
            }
        }
    }

    checkOpened = Array.from(Array(boardSize), () => Array(boardSize).fill(1));
    updateBoard();
    clearInterval(timer);
    alert("축하합니다! You win!");
}

function clickLeftBoard(event) {
    if (event.button == 0) { //왼쪽 버튼 event.button == 0
        processLeft(this.id);
        updateBoard();
    }
}

function resetInputValue() {
    let divMineNumber = document.getElementById("mineNumber");
    let divBoardSize = document.getElementById("boardSize");

    divMineNumber.value = 0;
    divBoardSize.value = 0;

    let boardDiv = document.getElementById("board");
    if (boardDiv.childNodes.length !== 0) {
        boardDiv.removeChild(boardDiv.firstChild);
    }

    divMineNumber.disabled = false;
    divBoardSize.disabled = false;
    start.disabled = false;

    const clock = document.getElementById("clock");
    clock.innerText = 0;
    clearInterval(timer);

    const myflag = document.getElementById("myflag");
    myflag.innerText = 0;
}

function startGame() {
    let divMineNumber = document.getElementById("mineNumber");
    let divBoardSize = document.getElementById("boardSize");
    let start = document.getElementById("start");

    mineNumber = parseInt(divMineNumber.value);
    boardSize = parseInt(divBoardSize.value);

    if (mineNumber <= 0 || boardSize <= 0) {
        alert("보드값과 지뢰값에 1이상 입력해주세요.");
        resetInputValue();
        return;
    }

    if (boardSize > 11) {
        alert("10까지만 가능합니다.");
        resetInputValue();
        return;
    }

    if (Math.floor((boardSize * boardSize) / 2) <= mineNumber) {
        console.log(Math.floor((10 * boardSize) / 2))
        alert(`지뢰가 너무 많습니다. ${Math.floor((boardSize * boardSize) / 2)}보다 작게 설정해주세요.`);
        return;
    }

    setBoard();
    makeBoard();
    console.table(arr);

    divMineNumber.disabled = true;
    divBoardSize.disabled = true;
    start.disabled = true;

    timer = setInterval(function () {
        const clock = document.getElementById("clock");
        clock.innerText = parseInt(clock.innerText) + 1;
    }, 1000);

    document.querySelectorAll('#table__game td').forEach(e => e.addEventListener("click", clickLeftBoard));
    document.querySelectorAll('#table__game td').forEach(e => e.addEventListener("contextmenu", checkMine));
}

function checkMine(ev) {
    processRight(this.id);
    ev.preventDefault();
    return false;
}

//Event
document.querySelector("#start").addEventListener("click", startGame);
document.querySelector("#reset").addEventListener("click", resetInputValue);
