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
    const name = this.normalizeRequiredText(data.name, 'Name');
    const city = this.normalizeRequiredText(data.city, 'City');
    const acronym = this.normalizeRequiredText(data.acronym, 'Acronym').toUpperCase();

    const existingTeam = await this.teamRepository.findByAcronym(acronym);

    if (existingTeam) {
      throw new AppError('Team acronym already exists', 409);
    }

    return this.teamRepository.create({
      name,
      city,
      acronym,
      status: 'active',
    });
  }

  async update(id, data) {
    const team = await this.getById(id);
    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = this.normalizeRequiredText(data.name, 'Name');
    }

    if (data.city !== undefined) {
      updateData.city = this.normalizeRequiredText(data.city, 'City');
    }

    if (data.acronym !== undefined) {
      const acronym = this.normalizeRequiredText(data.acronym, 'Acronym').toUpperCase();
      const existingTeam = await this.teamRepository.findByAcronym(acronym);

      if (existingTeam && existingTeam.id !== team.id) {
        throw new AppError('Team acronym already exists', 409);
      }

      updateData.acronym = acronym;
    }

    if (data.status !== undefined) {
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

  normalizeRequiredText(value, fieldName) {
    if (typeof value !== 'string') {
      throw new AppError(`${fieldName} is required`);
    }

    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw new AppError(`${fieldName} is required`);
    }

    return normalizedValue;
  }

  validateStatus(status) {
    const validStatuses = ['active', 'deactivated'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid team status');
    }
  }
}

module.exports = TeamService;
