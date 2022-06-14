import create_ship from "../ship";

const ship = create_ship(23, "horizontal", {x : 10, y : 20}, "Shimakaze");

test("test name", () => {
    expect(ship.get_name()).toBe("Shimakaze");
});