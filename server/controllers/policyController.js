import * as PolicyModel from '../models/PolicyModel.js';

export async function list(req, res) {
  try {
    const rows = await PolicyModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const row = await PolicyModel.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'السياسة غير موجودة' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const body = { ...req.body, id: req.body.id || `policy-${Date.now()}` };
    const row = await PolicyModel.create(body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const row = await PolicyModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'السياسة غير موجودة' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await PolicyModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'السياسة غير موجودة' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
