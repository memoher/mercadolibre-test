describe("Prueba de ejemplo", () => {
    test("Probando una simple suma", done => {
        let sum = 1 + 2 + 3;
        expect(sum).toEqual(6);
        done();
    })
});