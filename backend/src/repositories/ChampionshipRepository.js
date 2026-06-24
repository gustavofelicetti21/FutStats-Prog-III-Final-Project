const { Championship } = require('../models');

class ChampionshipRepository {
  async findAll() {
    return Championship.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return Championship.findByPk(id);
  }

  async create(data) {
    return Championship.create(data);
  }

  async update(championship, data) {
    return championship.update(data);
  }

  async delete(championship) {
    await championship.destroy();
  }
}

module.exports = ChampionshipRepository;
