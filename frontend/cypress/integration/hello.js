describe("our first test", () => {
  it("should do the thing", () => {
    cy.visit("/");
    cy.findByText("Readingly").should("be.visible");
  });
});
