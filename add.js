 // Game state
        let board = ['', '', '', '', '', '', '', '', ''];
        let gameMode = 'human'; // 'human' or 'computer'
        let currentPlayer = 'X';
        let gameActive = false;
        let scores = { xWins: 0, oWins: 0, draws: 0 };
        // DOM elements
        const startScreen = document.getElementById('startScreen');
        const gameScreen = document.getElementById('gameScreen');
        const scoreScreen = document.getElementById('scoreScreen');
        const xWinsDisplay = document.getElementById('xWins');
        const oWinsDisplay = document.getElementById('oWins');
        const drawsDisplay = document.getElementById('draws');
        const gameStatus = document.getElementById('gameStatus');
        // Initialize game
        function initGame() {
            const gameBoard = document.querySelector('#gameScreen .grid');
            gameBoard.innerHTML = '';
            // Create game cells
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.setAttribute('data-index', i);
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
            
            // Reset game state
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            updatePlayerTurn();
        }
         // Handle cell click
        function handleCellClick(e) {
            if (!gameActive) return;
            
            const cellIndex = parseInt(e.target.getAttribute('data-index'));
            
            if (board[cellIndex] !== '') return;
            
            board[cellIndex] = currentPlayer;
            e.target.textContent = currentPlayer;
            e.target.classList.add(currentPlayer === 'X' ? 'x-symbol' : 'o-symbol');
            
            checkGameResult();
            if (gameMode === 'computer' && currentPlayer === 'X') {
                setTimeout(computerMove, 500); // Small delay for better UX
            }
        }
        // Check game result
        function checkGameResult() {
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            let roundWon = false;
            
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                
                if (board[a] === '' || board[b] === '' || board[c] === '') continue;
                
                if (board[a] === board[b] && board[b] === board[c]) {
                    roundWon = true;
                    highlightWinningCells(a, b, c);
                    break;
                }
            }
            if (roundWon) {
                gameStatus.textContent = `Player ${currentPlayer} wins!`;
                updateScores(currentPlayer);
                gameActive = false;
                setTimeout(showScoreScreen, 1500);
                return;
            }
            
            if (!board.includes('')) {
                gameStatus.textContent = "Game ended in a draw!";
                updateScores('draw');
                gameActive = false;
                setTimeout(showScoreScreen, 1500);
                return;
            }
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updatePlayerTurn();
        }
          // Highlight winning cells
        function highlightWinningCells(a, b, c) {
            const cells = document.querySelectorAll('.game-cell');
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');
        }
        // Update player turn display
        function updatePlayerTurn() {
            if (gameMode === 'computer' && currentPlayer === 'O') {
                gameStatus.textContent = `Computer's turn (thinking...)`;
                setTimeout(() => {
                    const cells = document.querySelectorAll('.game-cell');
                    cells.forEach(c => c.classList.add('computer-thinking'));
                    setTimeout(computerMove, 1000);
                }, 300);
            } else {
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
         // Update scores
        function updateScores(result) {
            if (result === 'X') {
                scores.xWins++;
            } else if (result === 'O') {
                scores.oWins++;
            } else {
                scores.draws++;
            }
        }
        // Computer move logic
          function computerMove() {
            if (!gameActive || currentPlayer !== 'O' || gameMode !== 'computer') return;
            
            // Simple AI - first try to win, then block, then random move
            let move = findWinningMove('O') || 
                       findWinningMove('X') || 
                       getValidRandomMove();
            if (move !== null) {
                const cells = document.querySelectorAll('.game-cell');
                board[move] = 'O';
                cells[move].textContent = 'O';
                cells[move].classList.add('o-symbol');
                checkGameResult();
            }
        }
         function findWinningMove(player) {
            const winningConditions = [
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                // Check if two in a row with empty third
                if (board[a] === player && board[b] === player && board[c] === '') return c;
                if (board[a] === player && board[c] === player && board[b] === '') return b;
                if (board[b] === player && board[c] === player && board[a] === '') return a;
            }
            return null;
        }
         function getValidRandomMove() {
            const emptyCells = board.reduce((acc, val, idx) => {
                if (val === '') acc.push(idx);
                return acc;
            }, []);
            
            if (emptyCells.length > 0) {
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
            return null;
        }
         // Show score screen
        function showScoreScreen() {
            gameScreen.classList.add('hidden');
            scoreScreen.classList.remove('hidden');
            
            xWinsDisplay.textContent = scores.xWins;
            oWinsDisplay.textContent = scores.oWins;
            drawsDisplay.textContent = scores.draws;
        }
        // Event listeners
        document.getElementById('vsHumanBtn').addEventListener('click', () => {
            gameMode = 'human';
            startGame();
        });
        document.getElementById('vsComputerBtn').addEventListener('click', () => {
            gameMode = 'computer';
            startGame();
        });
         function startGame() {
            startScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            initGame();
        }
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            scoreScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            initGame();
        });
        document.getElementById('returnToMenuBtn').addEventListener('click', () => {
            scoreScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
        });
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
        // Initialize dark mode if preferred
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }