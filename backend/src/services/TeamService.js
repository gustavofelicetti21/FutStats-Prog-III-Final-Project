const AppError = require('../utils/AppError');

class TeamService {
  constructor(teamRepository) {
    this.teamRepository = teamRepository;
  }

  async list() {
    return this.teamRepository.findAll();
  }

  async getById(id) {
    const team = await this.teamRepository.findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    return team;
  }

  async create(data) {
    this.validateRequiredFields(data);

    const acronym = data.acronym.trim().toUpperCase();
    const existingTeam = await this.teamRepository.findByAcronym(acronym);

    if (existingTeam) {
      throw new AppError('Team acronym already exists', 409);
    }

    return this.teamRepository.create({
      name: data.name.trim(),
      city: data.city.trim(),
      acronym,
      status: 'active',
    });
  }

  async update(id, data) {
    const team = await this.getById(id);
    const updateData = {};

    if (data.name) {
      updateData.name = data.name.trim();
    }

    if (data.city) {
      updateData.city = data.city.trim();
    }

    if (data.acronym) {
      const acronym = data.acronym.trim().toUpperCase();
      const existingTeam = await this.teamRepository.findByAcronym(acronym);

      if (existingTeam && existingTeam.id !== team.id) {
        throw new AppError('Team acronym already exists', 409);
      }

      updateData.acronym = acronym;
    }

    if (data.status) {
      this.validateStatus(data.status);
      updateData.status = data.status;
    }

    return this.teamRepository.update(team, updateData);
  }

  async delete(id) {
    const team = await this.getById(id);

    await this.teamRepository.delete(team);
  }

  async deactivate(id) {
    const team = await this.getById(id);

    return this.teamRepository.update(team, {
      status: 'deactivated',
    });
  }

  validateRequiredFields(data) {
    if (!data.name || !data.city || !data.acronym) {
      throw new AppError('Name, city and acronym are required');
    }
  }

  validateStatus(status) {
    const validStatuses = ['active', 'deactivated'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid team status');
    }
  }
}

module.exports = TeamService;
