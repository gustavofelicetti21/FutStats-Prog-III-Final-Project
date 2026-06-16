const { Team } = require('../models');

class TeamRepository {
  async findAll() {
    return Team.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return Team.findByPk(id);
  }

  async findByAcronym(acronym) {
    return Team.findOne({
      where: { acronym },
    });
  }

  async create(data) {
    return Team.create(data);
  }

  async update(team, data) {
    return team.update(data);
  }

  async delete(team) {
    await team.destroy();
  }
}

module.exports = TeamRepository;
