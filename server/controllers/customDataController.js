import * as CustomDataModel from '../models/CustomDataModel.js';

export async function getCategories(req, res) {
  try {
    const rows = await CustomDataModel.getCustomCategories();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addCategory(req, res) {
  try {
    const list = await CustomDataModel.addCustomCategory(req.body);
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSpecies(req, res) {
  try {
    const list = await CustomDataModel.getCustomSpecies();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addSpecies(req, res) {
  try {
    const list = await CustomDataModel.addCustomSpecies(req.body?.species ?? req.body);
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
