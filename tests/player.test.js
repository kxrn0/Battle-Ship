import create_player from "../player";
import create_board from "../board";

let player1, player2;

beforeEach(() => {
    let board1, board2;

    board1 = create_board([
        {
            coordinates: {x : 2, y : 2}, 
            orientation: "horizontal",
            length: 5,
            name: "Shimakaze"
        }
    ], 10, 10);
    board2 = create_board([
        {
            coordinates: {x : 4, y : 5},
            orientation: "vertical",
            length: 3,
            name: "Tsubaki"
        }
    ], 10, 10);
    player1 = create_player(board1, "_by_me");
    player2 = create_player(board2, "kxrn0");
});

test("Receive an attack.", () => {
    const cells = new Array(100).fill("hidden");

    cells[22] = "wrecked";

    player1.receive_attack({x : 2, y : 2});
    expect(player1.get_board().get_cells()).toEqual(cells);
});

test("Attack other player.", () => {
    player1.attack(player2.get_board(), {x : 1, y : 5});

    expect(player2.get_board().get_cells().indexOf("tried")).toBe(51);
});

test("Test random attack", () => {
    let board = create_board([{
        coordinates: {x : 1, y : 1},
        orientation: "vertical",
        length: 1,
        name: "Touwata"
    }],3, 3);

    for (let x = 0; x < 3; x++)
        for (let y = 0; y < 3; y++) 
            if (x == 1 && y == 1)
                continue;
            else
                player1.attack(board, {x, y});

    expect(player1.random_attack(board).coordinates).toEqual({x : 1, y : 1});
});