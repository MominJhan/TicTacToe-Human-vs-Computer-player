let boxes = document.querySelectorAll('.box');
let resetbutton = document.querySelector('.btn');
let msg = document.querySelector('.msg');
// Turn player0 (human)
let turn0 = true;

const winningPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
 // disabling all the game boxes when the game is over
function disableBoxes() {
    boxes.forEach(box => {
        box.classList.add('disabled');                  // Add the 'disabled' class to each box
        box.removeEventListener('click', handleClick);  // Remove the event listener to prevent further clicks
    });
}
//for reset the game
function enableBoxes() {
    boxes.forEach(box => {
        box.classList.remove('disabled');               //Remove the disabled Class
        box.innerHTML = '';                             //Clear the Box Content:
        box.addEventListener('click', handleClick);     // This makes each box clickable again, allowing players to make moves
    });
}

function resetGame() {
    turn0 = true;                                       // Reset turn (human starts)
    enableBoxes();
    msg.classList.add('hide');
}

function showWinner(winner) {
    msg.innerText = `Congratulations! Winner is ${winner}`;
    msg.classList.remove('hide');
    disableBoxes();
}

function handleClick(event) {
    const box = event.target;                        // Get the element that was clicked

    if (box.classList.contains('disabled')) return; // disabled hai, to function kuch nahi karega aur exit ho jayega.

    if (turn0) { // Human player
        box.innerText = '0';
        turn0 = false;
        box.classList.add('disabled');
        checkWinner();
        if (!msg.classList.contains('hide')) return; // If game is over, return
        setTimeout(computerMove, 500); // Computer makes a move after a short delay
    }
}

function computerMove() {
    let availableBoxes = [...boxes].filter(box => !box.classList.contains('disabled'));

    if (availableBoxes.length === 0) return; // No available boxes

    let bestMove = findBestMove();

    if (bestMove !== null) {
        bestMove.innerText = 'X';
        bestMove.classList.add('disabled');
        turn0 = true;
        checkWinner();
    }
}

function findBestMove() {
    // Check if computer can win
    for (const pattern of winningPattern) {
        const [a, b, c] = pattern;
        const values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        const emptyIndices = [a, b, c].filter(index => boxes[index].innerText === '');

        if (values.filter(value => value === 'X').length === 2 && emptyIndices.length === 1) {
            return boxes[emptyIndices[0]];
        }
    }

    // Block human player from winning
    for (const pattern of winningPattern) {
        const [a, b, c] = pattern;
        const values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        const emptyIndices = [a, b, c].filter(index => boxes[index].innerText === '');

        if (values.filter(value => value === '0').length === 2 && emptyIndices.length === 1) {
            return boxes[emptyIndices[0]];
        }
    }

    // Play center if available
    if (boxes[4].innerText === '') {
        return boxes[4];
    }

    // Play a corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => boxes[index].innerText === '');
    if (availableCorners.length > 0) {
        return boxes[availableCorners[Math.floor(Math.random() * availableCorners.length)]];
    }

    // Play a random move
    return [...boxes].filter(box => !box.classList.contains('disabled'))[0];
}

function checkWinner() {
    for (const pattern of winningPattern) {
        let value1 = boxes[pattern[0]].innerText;
        let value2 = boxes[pattern[1]].innerText;
        let value3 = boxes[pattern[2]].innerText;

        if (value1 !== '' && value2 !== '' && value3 !== '') {
            if (value1 === value2 && value2 === value3) {
                showWinner(value1);
                return;
            }
        }
    }

    // Check for a draw
    if ([...boxes].every(box => box.classList.contains('disabled'))) {
        msg.innerText = "It's a draw!";
        msg.classList.remove('hide');
        disableBoxes();
    }
}

resetbutton.addEventListener('click', resetGame);

// Initialize the game
enableBoxes();
