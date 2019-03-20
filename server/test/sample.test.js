describe("Prueba de ejemplo", () => {
    test("Probando una suma simple", done => {
        let sum = 1 + 2 + 3;
        expect(sum).toEqual(6);
        done();
    })
});