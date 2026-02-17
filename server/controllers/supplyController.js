import * as SupplyModel from '../models/SupplyModel.js';

export async function list(req, res) {
  try {
    const rows = await SupplyModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await SupplyModel.findById(id);
    if (!row) return res.status(404).json({ error: 'المستلزم غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const row = await SupplyModel.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await SupplyModel.update(id, req.body);
    if (!row) return res.status(404).json({ error: 'المستلزم غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const ok = await SupplyModel.remove(id);
    if (!ok) return res.status(404).json({ error: 'المستلزم غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
