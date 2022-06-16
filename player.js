import create_board from "./board.js";

export default function create_player(board, name) {
    function receive_attack(coordinates) {
        return board.receive_attack(coordinates);
    }

    function attack(otherBoard, coordinates) {
        return otherBoard.receive_attack(coordinates);
    }

    function get_board() {
        return board;
    }

    function get_name() {
        return name;
    }

    function random_attack(otherBoard) {
        let x, y;
        let limit = 0;

        do {
            x = ~~(Math.random() * otherBoard.get_dimentions().width);
            y = ~~(Math.random() * otherBoard.get_dimentions().height);
        } while (!otherBoard.is_cell_hidden({ x, y }) && limit++ < 100);
        return {result: otherBoard.receive_attack({ x, y }), coordinates : {x, y}};
    }

    return { receive_attack, attack, get_board, random_attack, get_name };
}