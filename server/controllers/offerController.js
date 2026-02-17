import * as OfferModel from '../models/OfferModel.js';

export async function list(req, res) {
  try {
    const rows = await OfferModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const row = await OfferModel.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'العرض غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const body = { ...req.body, id: req.body.id || `offer-${Date.now()}` };
    const row = await OfferModel.create(body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const row = await OfferModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'العرض غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await OfferModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'العرض غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
