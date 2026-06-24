class HealthController {
  check(request, response) {
    return response.json({
      status: 'ok',
      app: 'FutStats API',
    });
  }
}

module.exports = new HealthController();
