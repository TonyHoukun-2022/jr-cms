function sum(a, b) {
    return a + b
}

/** unit test e.g */
//describe(testWhat, testLogic)
describe('sum function', () => {
    //test('',()=>{})
    it('should return the correct sum of 2 numbers', () => {
        const result = sum(1, 2)
        expect(result).toBe(3)
    })
})