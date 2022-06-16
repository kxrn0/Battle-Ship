import create_ship from "../ship";

let ship1, ship2;

beforeEach(() => {
    ship1 = create_ship(6, "horizontal", { x: 3, y: 4 }, "Shimakaze");
    ship2 = create_ship(5, "vertical", { x : 1, y : 1}, "Tsubaki");
});

test("Test name.", () => {
    expect(ship1.get_name()).toBe("Shimakaze");
    expect(ship2.get_name()).toBe("Tsubaki");
});

test("Test missing hit.", () => {
    for (let i = 0; i < 10; i++) {
        const x = fun(3, 1, 10);
        const y = fun(4, 1, 10);

        expect(ship1.hit({ x, y })).toBe(false);
    }
    for (let i = 0; i < 10; i++) {
        let x, y;

        x = fun(1, 1, 10);
        y = fun(1, 1, 10);

        expect(ship2.hit({x, y})).toBe(false);
    }
});

test("Test valid hit.", () => {
    for (let x = 3; x <= 8; x++) 
        expect(ship1.hit({x, y : 4})).toBe(true);
    for (let y = 1; y <= 5; y++)
        expect(ship2.hit({x : 1, y})).toBe(true);
});

test("Test sunkenness.", () => {
    expect(ship1.is_sunk()).toBe(false);
    expect(ship2.is_sunk()).toBe(false);
    for (let x = 3; x <= 8; x++) 
        ship1.hit({x, y : 4});
    for (let y = 1; y <= 5; y++)
        ship2.hit({x : 1, y});
    expect(ship1.is_sunk()).toBe(true);
    expect(ship2.is_sunk()).toBe(true);
});

function fun(avoid, from, to) {
    let rnd;

    do
        rnd = ~~(Math.random() * (to - from) + from);
    while (rnd == avoid);
    return rnd;
}