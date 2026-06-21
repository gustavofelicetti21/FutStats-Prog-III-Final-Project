const AppError = require('../utils/AppError');

class ChampionshipService {
  constructor(championshipRepository) {
    this.championshipRepository = championshipRepository;
  }

  async list() {
    return this.championshipRepository.findAll();
  }

  async getById(id) {
    const championship = await this.championshipRepository.findById(id);

    if (!championship) {
      throw new AppError('Championship not found', 404);
    }

    return championship;
  }

  async create(data = {}) {
    const name = this.normalizeRequiredText(data.name, 'Name');
    const season = this.normalizeRequiredText(data.season, 'Season');

    return this.championshipRepository.create({
      name,
      season,
      status: 'draft',
    });
  }

  async update(id, data = {}) {
    const championship = await this.getById(id);
    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = this.normalizeRequiredText(data.name, 'Name');
    }

    if (data.season !== undefined) {
      updateData.season = this.normalizeRequiredText(data.season, 'Season');
    }

    if (data.status !== undefined) {
      this.validateStatus(data.status);
      updateData.status = data.status;
    }

    return this.championshipRepository.update(championship, updateData);
  }

  async delete(id) {
    const championship = await this.getById(id);

    await this.championshipRepository.delete(championship);
  }

  async deactivate(id) {
    const championship = await this.getById(id);

    return this.championshipRepository.update(championship, {
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
    const validStatuses = ['draft', 'active', 'finished', 'deactivated'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid championship status');
    }
  }
}

module.exports = ChampionshipService;
