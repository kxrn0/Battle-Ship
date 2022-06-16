import create_board from "../board";

let board;

beforeEach(() => {
    board = create_board([
        {
            coordinates: {x : 2, y : 2}, 
            orientation: "horizontal",
            length: 5,
            name: "Shimakaze"
        },
        {
            coordinates: {x : 4, y : 5},
            orientation: "vertical",
            length: 3,
            name: "Tsubaki"
        }
    ], 10, 10);
});

test("Test missing hit.", () => {
    expect(board.receive_attack({x : 1, y : 5})).toBe(false);
    expect(board.receive_attack({x : 0, y : 0})).toBe(false);
    expect(board.receive_attack({x : 4, y : 1})).toBe(false);
});

test("Test good hits.", () => {
    expect(board.receive_attack({x : 2, y : 2})).toBe(true);
    expect(board.receive_attack({x : 4, y : 2})).toBe(true);
    expect(board.receive_attack({x : 4, y : 7})).toBe(true);
});

test("Test that the correct resut of the attack is reported.", () => {
    expect(board.receive_attack({x : 1, y : 5})).toBe(false);
    expect(board.receive_attack({x : 2, y : 2})).toBe(true);
});

test("Test valid selection of cells", () => {
    expect(board.is_cell_hidden({x : 7, y : 5})).toBe(true);
    expect(board.is_cell_hidden({x : 2, y : 2})).toBe(true);

    board.receive_attack({x : 2, y : 8});
    board.receive_attack({x : 2, y : 2});

    expect(board.is_cell_hidden({x : 2, y : 8})).toBe(false);
    expect(board.is_cell_hidden({x : 2, y : 2})).toBe(false);   
});

test("Testing invalid selection.", () => {
    board.receive_attack({x : 1, y : 5});
    board.receive_attack({x : 2, y : 2});
    board.receive_attack({x : 2, y : 8});
    expect(board.is_cell_hidden({x : 1, y : 5})).toBe(false);
    expect(board.is_cell_hidden({x : 2, y : 2})).toBe(false);
    expect(board.is_cell_hidden({x : 2, y : 8})).toBe(false);
});

test("Test that it correctly reports when there are no more active ships.", () => {
    board.receive_attack({x : 2, y : 2});
    board.receive_attack({x : 4, y : 2});
    board.receive_attack({x : 4, y : 6});

    expect(board.all_is_lost()).toBe(false);

    board.receive_attack({x : 3, y : 2});
    board.receive_attack({x : 4, y : 2});
    board.receive_attack({x : 5, y : 2});
    board.receive_attack({x : 6, y : 2});
    board.receive_attack({x : 4, y : 5});
    board.receive_attack({x : 4, y : 7});

    expect(board.all_is_lost()).toBe(true);
});