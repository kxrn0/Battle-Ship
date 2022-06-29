import { to_number, segments, distance } from "./utilities.js";

export default function create_player(board, name, width, height) {

    if (!board) {
        board = create_random_board(width, height);
    }

    function receive_attack(coordinates) {
        coordinates = to_number(coordinates);
        return board.receive_attack(coordinates);
    }

    function attack(otherBoard, coordinates) {
        coordinates = to_number(coordinates);
        return otherBoard.receive_attack(coordinates);
    }

    function get_board() {
        return board;
    }

    function get_name() {
        return name;
    }

    function lost() {
        return board.all_is_lost();
    }

    function create_random_board(width, height) {
        const ships = [];
        const bluePrints = [
            {
                length: 5,
                name: "Carrier"
            },
            {
                length: 4,
                name: "Battleship"
            },
            {
                length: 3,
                name: "Cruiser"
            },
            {
                length: 3,
                name: "Submarine"
            },
            {
                length: 2,
                name: "Patrol Boat"
            }
        ];

        for (let i = 0; i < bluePrints.length; i++) {
            const ship = { length: bluePrints[i].length, name: bluePrints[i].name };
            let x, y, orientation, validShip, theseSegments;

            do {
                let end, limit;

                x = ~~(Math.random() * width);
                y = ~~(Math.random() * height);
                orientation = Math.random() < .5 ? "vertical" : "horizontal";
                validShip = true;

                end = (orientation == "vertical" ? y : x) + ship.length - 1;
                limit = orientation == "vertical" ? height : width;

                if (end < limit) {
                    ship.coordinates = { x, y };
                    ship.orientation = orientation;
                    theseSegments = segments(ship);

                    for (let other of ships) {
                        const thoseSegments = segments(other);
                        const badDistance = theseSegments.every(segment => thoseSegments.every(otherSegment => distance(segment, otherSegment) > 2));

                        if (!badDistance) {
                            validShip = false;
                            break;
                        }
                    }
                }
                else
                    validShip = false;
            } while (!validShip);
            ships.push(ship);
        }
        return ships;
    }

    function random_attack(otherBoard) {
        let x, y;

        do {
            x = ~~(Math.random() * otherBoard.get_dimensions().width);
            y = ~~(Math.random() * otherBoard.get_dimensions().height);
        } while (!otherBoard.is_cell_hidden({ x, y }));
        return { result: otherBoard.receive_attack({ x, y }), coordinates: { x, y } };
    }

    return { receive_attack, attack, get_board, random_attack, get_name, lost, create_random_board };
}