context('Health check endpoint', () => {
  describe('Service health endpoint', () => {
    it('returns a 204 status', () => {
      cy.request('/{{ cookiecutter.service_slug }}/health').then(response => {
        expect(response.status).to.equal(204)
        expect(response.body).to.be.empty
      })
    })
  })
})
