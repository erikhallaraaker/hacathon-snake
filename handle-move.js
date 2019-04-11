const parseBoard = (board, { id }) => {
    let parsedBoard = [];

    for (let y = 0; y < board.height; y++) {
        parsedBoard[y] = [];
        for (let x = 0; x < board.width; x++) {
            parsedBoard[y].push(0);
        }
    }
        
    board.snakes.forEach(snake => {
        snake.body.forEach((coord, i) => {
            if (snake.id === id && i === 0) {
                parsedBoard[coord.y][coord.x] = 0;
            } else {
                parsedBoard[coord.y][coord.x] = -150;
            }
        });
    });

    board.food.forEach(food => {
        parsedBoard[food.y][food.x] = 200;
    });

    // console.log(parsedBoard);
    return parsedBoard;
};

const checkCell = (parsedBoard, { food, snakes }, x, y) => {
    const distanceToFood = () => {
        let minDist = 15;
        food.forEach(f => {
            const dist = Math.abs(x -f.x) + Math.abs(y - f.y);
            if (dist < minDist) {
                minDist = dist;
            }
        });

        return minDist;
    };

    const distanceToSnake = () => {
        let minDist = 15;
        snakes.forEach(snake => {
            snake.body.forEach(s => {
                const dist = Math.abs(x -s.x) + Math.abs(y - s.y);
                if (dist < minDist) {
                    minDist = dist;
                }
            });
        });

        console.log(minDist);
        return minDist;
    };

    let value = 100;
    if (x >= parsedBoard[0].length || x < 0) {
        value = -160;
    } else if (y >= parsedBoard.length || y < 0) {
        value = -160;
    } else {
        if (parsedBoard[y][x] !== 0) {
            value = parsedBoard[y][x];
        } else {
            const foodDist = distanceToFood();
            const snakeDist = distanceToSnake();
            value = 100 - (foodDist - snakeDist);
        }
    }

    return value;
};

const findDirection = (parsedBoard, {board}, x, y) => {
    const upValue = checkCell(parsedBoard, board, x, y - 1) + (checkCell(parsedBoard, board, x, y - 2) / 10);
    const leftValue = checkCell(parsedBoard, board, x - 1, y) + (checkCell(parsedBoard, board, x - 2, y) / 10);
    const downValue = checkCell(parsedBoard, board, x, y + 1) + (checkCell(parsedBoard, board, x, y + 2) / 10);
    const rightValue = checkCell(parsedBoard, board, x + 1, y) + (checkCell(parsedBoard, board, x + 2, y) / 10);

    const directions = [upValue, leftValue, downValue, rightValue];
    const sortedDirections = directions.sort((a, b) => b - a);
    const max = sortedDirections[0];

    let direction = "up";
    
    if (max === upValue) {
        direction = "up";
    } else if (max === leftValue) {
        direction = "left";
    } else if (max === downValue) {
        direction = "down";
    } else if (max === rightValue) {
        direction = "right";
    }

    return direction;
};

module.exports = ({ body }) => {
    let direction = "up";
    const headX = body.you.body[0].x;
    const headY = body.you.body[0].y;
    const parsedBoard = parseBoard(body.board, body.you);

    // console.log("direction: ", direction);

    console.log(parsedBoard);

    return {
        move: findDirection(parsedBoard, body, headX, headY)
    }
};
