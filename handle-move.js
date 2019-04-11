const parseBoard = board => {
    let parsedBoard = [];

    for (let y = 0; y < board.height; y++) {
        parsedBoard[y] = [];
        for (let x = 0; x < board.width; x++) {
            parsedBoard[y].push(0);
        }
    }
        
    board.snakes.forEach(snake => {
        snake.body.forEach(coord => {
            parsedBoard[coord.y][coord.x] = -150;
        });
    });

    board.food.forEach(food => {
        parsedBoard[food.y][food.x] = 100;
    });

    console.log(parsedBoard);
    return parsedBoard;
};

const checkCell = (parsedBoard, { food, snakes }, x, y) => {
    const distanceToFood = () => {
        let minDist = 100;
        food.forEach(f => {
            const dist = Math.abs(x -f.x) + Math.abs(y - f.y);
            if (dist < minDist) {
                minDist = dist;
            }
        });

        return minDist;
    };

    let value = 0;

    if (x >= parsedBoard[0].length || x < 0) {
        value = -2;
    } else if (y >= parsedBoard.length || y < 0) {
        value = -2;
    } else {
        if (parsedBoard[y][x] !== 0) {
            value = parsedBoard[y][x];
        } else {
            value = 100 - distanceToFood();
        }
    }

    // console.log("checkcell value: ", value);
    return value;
};

module.exports = ({ body }) => {
    let direction = "up";
    const headX = body.you.body[0].x;
    const headY = body.you.body[0].y;
    const parsedBoard = parseBoard(body.board);
    const upValue = checkCell(parsedBoard, body.board, headX, headY - 1);
    const leftValue = checkCell(parsedBoard, body.board, headX - 1, headY);
    const downValue = checkCell(parsedBoard, body.board, headX, headY + 1);
    const rightValue = checkCell(parsedBoard, body.board, headX + 1, headY);

    const directions = [upValue, leftValue, downValue, rightValue];
    const sortedDirections = directions.sort((a, b) => b - a);
    const max = sortedDirections[0];

    if (max === upValue) {
        direction = "up";
    } else if (max === leftValue) {
        direction = "left";
    } else if (max === downValue) {
        direction = "down";
    } else if (max === rightValue) {
        direction = "right";
    }


    
    // if (headX === 0 && headY === 0) {
    //     direction = "down";
    // } else if (headX === 14 && headY === 0) {
    //     direction = "left";
    // } else if (headX === 0 && headY === 14) {
    //     direction = "right";
    // } else if (headX === 14 && headY === 14) {
    //     direction = "up";
    // } else if (headX  === 0) {
    //     direction = "down";
    // } else if (headY === 0) {
    //     direction = "left";
    // } else if (headY === 14) {
    //     direction = "right";
    // } else if (headX === 14) {
    //     direction = "up";
    // }

    return {
        move: direction
    }
};
