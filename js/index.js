let arr;
let checkOpened;  //실제 보드에 출력 여부 결정 //0: 오픈 안한거 / 1:오픈한거
let visited; //0: 방문안하거, 1: 방문한거 dfs에서 빈칸 확장해나가는데 사용
let checkerRight; // 오른쪽 버튼 눌렸는지 여부확인 0과 1로
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
        default:
            console.log(arr[i][j])
        // console.error("error");
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
    let parent = document.getElementById("board");
    let tb = document.createElement("table");
    tb.setAttribute("id", "zzang");
    for (let i = 0; i < boardSize; i++) {
        let currentTR = document.createElement("tr");
        for (let j = 0; j < boardSize; j++) {
            let currentTD = document.createElement("td");
            currentTD.setAttribute("id", i + "," + j);
            currentTD.appendChild(document.createTextNode("🟪")); //innertext
            currentTR.appendChild(currentTD);
        }
        tb.appendChild(currentTR);
    }
    parent.appendChild(tb);
}

//새로운 배열 만들기
function makeArray(boardSize) {
    let data = new Array(boardSize);

    for (let i = 0; i < data.length; i++) {
        data[i] = new Array(boardSize);
        // 초기화
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

    return true; // 위의 2개가 아니면 true 로 반환
}

// deeop first search : 깊이 우선 탐색 : 
// 지뢰가 정의된 보드를 그래프로 봤다. 어떤 버튼이 눌렸을 때 노드라고 봤고, 조건에 맞게 탐색을 해야한다.
function dfs(data, col, row) {
    if (data[col][row] > 0) { //숫자일때
        checkOpened[col][row] = 1;
        return; // 숫자일땐 더 보여주면 안되니까
    } else if (data[col][row] == -1) { //지뢰일때
        return; // 지뢰는 보여주면 안되니까
    } else { //빈칸
        checkOpened[col][row] = 1;
        // 8자리 돌면서 체크- 나중에 리팩토링
        for (let i = col - 1; i <= col + 1; i++) {
            for (let j = row - 1; j <= row + 1; j++) {
                if (isAvailableIndex(data, i, j) == false) continue;
                if (i !== col && j !== row) continue; // 사방(위, 아래, 오, 왼) 만 확인 : 대각선은 회피 : 대각선만 col, row가 둘 다 바뀜
                if (visited[i][j] !== 1) { // 방문안했을 때만 돌아야 하니까
                    visited[i][j] = 1; // 본인꺼 방문했다고 (표시 해당 하는 부분) - 방문 안한 곳 중에서 표시
                    dfs(data, i, j); //빈칸일 때는 계속 돌아줘야 하니까 불러줌
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

    console.log("arr length : " + arr.length);
    console.log("mineNumber : " + mineNumber);

    let currentMine = 0; //내가 생성한 지뢰개수

    // 지뢰를 i,j 에 넣을 건지 while 문에서 생성
    while (true) {
        // Math.floor(Math.random() * N) -> 0에서 N-1까지 랜덤하게 생성
        // ath.random() : 0 < x < 1 사이 값 출력
        // floor : 정수만 가져온다.
        let i = Math.floor(Math.random() * arr.length);
        let j = Math.floor(Math.random() * arr.length);

        // 지뢰 중복체크 - 햇던 애가 또 지뢰하면 안되니까
        // -1을 한 이유는, 숫자로만 체크할 건데 음수면 무조건 폭탄으로 정의
        if (arr[i][j] !== -1) {
            arr[i][j] = -1;
            currentMine++;  //지뢰가 심어졌으니까 개수가 카운팅 되어야지
        }
        if (currentMine == mineNumber) break; //지뢰가 다 만들어졌으니까 break
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
// 날 주변으로 한 번에 갈 수 있는 좌표를 검사
function addNumOnBoard(board, col, row) {
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (isAvailableIndex(board, i, j) == false) continue;
            // isAvailableIndex 자체를 따지지말고 그 안에 false를 가져와서 비교하기 때문에 false
            if (board[i][j] !== -1) {
                board[i][j]++; // + 해주면서 8자리 주변의 숫자를 카운팅
            }
        }
    }
}

function processLeft(value) {
    console.log("leftClicked Axis=>" + value);
    const axis = value.split(",");

    let x = parseInt(axis[0]);
    let y = parseInt(axis[1]);

    if (checkOpened[x][y] == 1) return; //누른거 또 노름

    if (arr[x][y] >= 1) { //여긴 무조건 숫자 0: 빈칸, 1: 숫자, -1: 지뢰
        checkOpened[x][y] = 1; //누른거 보여주기 //chekcker에서 판단하고 arr에서 보여준다
    } else if (arr[x][y] == -1) {
        //모달창 활용해서 retry 하면 게임 다시시작하게 하면 좋을듯   
        //지뢰 밟으면 모든 다 오픈
        checkOpened = Array.from(Array(boardSize), () => Array(boardSize).fill(1))
        updateBoard();
        clearInterval(timer);
        alert("게임 종료");
    } else {
        visited = makeArray(boardSize); //초기화
        dfs(arr, x, y); //다음 보드 상태를 결정
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

    checkOpened = Array.from(Array(boardSize), () => Array(boardSize).fill(1))
    updateBoard();
    clearInterval(timer);
    alert("게임 종료. 축하!");
}

function clickLeftBoard() {
    if (event.button == 0) { //왼쪽 버튼
        processLeft(this.id);
        updateBoard();
    }
}

function resetInputValue() {
    let divMineNumber = document.getElementById("mineNumber");
    let divBoardSize = document.getElementById("boardSize");

    divMineNumber.value = 0;
    divBoardSize.value = 0;

    let parent = document.getElementById("board");
    if (parent.childNodes.length !== 0) {
        parent.removeChild(parent.firstChild);
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
        alert("보드값과 지뢰값은 1이상부터 입력해주세요.");
        resetInputValue();
        return;
    }

    if (boardSize > 11) {
        alert("보드판은 10까지만 가능합니다.");
        resetInputValue();
        return;
    }

    if ((boardSize * boardSize) / 2 <= mineNumber) {
        alert(`지뢰가 너무 많습니다. ${boardSize * boardSize / 2}보다 작게 설정해주세요.`);
        return;
    }

    setBoard();
    makeBoard();
    console.table(arr);

    divMineNumber.disabled = true; //게임 시작하고 더이상 수정 안되도록 지뢰개수
    divBoardSize.disabled = true;
    start.disabled = true;

    timer = setInterval(function () {
        const clock = document.getElementById("clock");
        clock.innerText = parseInt(clock.innerText) + 1;
    }, 1000);

    document.querySelectorAll('#zzang td').forEach(e => e.addEventListener("click", clickLeftBoard));
    document.querySelectorAll('#zzang td').forEach(e => e.addEventListener("contextmenu", checkMine));
}

function checkMine(ev) {
    processRight(this.id);
    ev.preventDefault();
    return false;
}

//Event
document.querySelector("#start").addEventListener("click", startGame);
document.querySelector("#reset").addEventListener("click", resetInputValue);
