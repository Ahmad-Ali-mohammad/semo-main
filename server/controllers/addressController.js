import * as AddressModel from '../models/AddressModel.js';

export async function list(req, res) {
  try {
    const rows = await AddressModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await AddressModel.findById(id);
    if (!row) return res.status(404).json({ error: 'العنوان غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const row = await AddressModel.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await AddressModel.update(id, req.body);
    if (!row) return res.status(404).json({ error: 'العنوان غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const ok = await AddressModel.remove(id);
    if (!ok) return res.status(404).json({ error: 'العنوان غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
