let arr;
let checkerLeft; //클릭했는지 안했는지 체크용
let visited;
let checkerRight;
let mineNumber = 5; //폭탄개수

//새로운 배열 만들기
function makeArray(n) {
    let data = new Array(n);

    for (let i = 0; i < data.length; i++) {
        data[i] = new Array(n);
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

// 인덱스 칸 체크(벗어났을 때)
function dfs(data, col, row) {
    if (isAvailableIndex(data, col, row) == false) return;

    if (data[col][row] > 0) { //숫자일때
        checkerLeft[col][row] = 1;
        return; // 숫자일땐 더 보여주면 안되니까
    } else if (data[col][row] == -1) { //지뢰일때
        return; // 지뢰는 보여주면 안되니까
    } else {
        // 8자리 돌면서 체크- 나중에 리팩토링
        for (let i = col - 1; i <= col + 1; i++) {
            for (let j = row - 1; j <= row + 1; j++) {
                if (isAvailableIndex(data, i, j) == false) continue;
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

    arr = makeArray(10);
    checkerLeft = makeArray(10);
    checkerRight = makeArray(10);

    let currentMine = 0; //내가 생성한 지뢰개수

    console.log(arr)

    // 지뢰를 i,j 에 넣을 건지 while 문에서 생성
    while (true) {
        // Math.floor(Math.random() * N) -> 0에서 N-1까지 랜덤하게 생성
        let i = Math.floor(Math.random() * arr.length);
        let j = Math.floor(Math.random() * arr.length);

        // 지뢰 중복체크 - 햇던 애가 또 지뢰하면 안되니까
        // -1을 한 이유는, 숫자로만 체크할 건데 음수면 무조건 폭탄으로 정의
        if (arr[i][j] !== -1) {
            arr[i][j] = -1;
            checkerRight[i][j] = 1;
            currentMine++;
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

    // *********찍어보려고 한 부분
    console.log("-------")
    visited = makeArray(10);
    dfs(arr, 2, 3);
    console.log(arr);
    console.log(checkerLeft);
    for (let i = 0; i < arr.length; i++) {
        let str = "";
        for (let j = 0; j < arr.length; j++) {
            if (checkerLeft[i][j] == 1) {
                str += arr[i][j];
            } else {
                str += "X";
            }
        }
        console.log(str);
    }
    console.log("-------")
    let totalAccount = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (checkerRight[i][j] == 1 && arr[i][j] == -1) {
                totalAccount++;
            }
        }
    }
    if (totalAccount == mineNumber) console.log("게임 종료. 축하!");
    else console.log("again");
    // *********찍어보려고 한 부분
};

setBoard();

// 숫자 설정 (뿌려주기) - 폭탄일 때 8자리 검사하면서 숫자 뿌리기
// 날 주변으로 한 번에 갈 수 있는 좌표를 검사
function addNumOnBoard(board, col, row) {
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (i < 0 || j < 0) continue;
            if (i >= board.length || j >= board.length) continue;
            if (board[i][j] !== -1) {
                board[i][j]++; // + 해주면서 8자리 주변의 숫자를 카운팅
            }
        }
    }
}

const leftform = document.getElementById("leftform");
const LEFT = document.getElementById("left");
const rightform = document.getElementById("rightform");
const RIGHT = document.getElementById("right");

leftform.addEventListener('submit', processLeft);
rightform.addEventListener('submit', processRight);


function processLeft() {
    const value = document.getElementById("left").value;
    console.log(value)
    const axis = value.split(",");

    let x = parseInt(axis[0]);
    let y = parseInt(axis[1]);

    if (checkerLeft[x][y] == 1) return; //누른거 또 노름

    if (arr[x][y] >= 1) { //여긴 무조건 숫자 0: 빈칸, 1: 숫자, -1: 지뢰
        checkerLeft[x][y] = 1; //누른거 보여주기 //chekcker에서 판단하고 arr에서 보여준다
    } else if (arr[x][y] == -1) {
        console.log("지뢰를 클릭하셨습니다.");
        console.log(arr);
    } else {
        visited = makeArray(10);
        dfs(arr, x, y);
    }

    for (let i = 0; i < arr.length; i++) {
        let str = "";
        for (let j = 0; j < arr.length; j++) {
            if (checkerLeft[i][j] == 1) {
                str += arr[i][j];
            } else {
                str += "X";
            }
        }
    }
}

function processRight() {
    const value = document.getElementById("right").value;
    const axis = value.split(",");

    let x = parseInt(axis[0]);
    let y = parseInt(axis[1]);

    if (checkerRight[x][y] == 1) {
        checkerRight[x][y] = 0;
    } else {
        checkerRight[x][y] = 1;
    }

    let totalAccount = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (checkerRight[i][j] == 1 && arr[i][j] == -1) {
                totalAccount++;
            }
        }
    }

    if (totalAccount == mineNumber) console.log("게임 종료. 축하!");
}

