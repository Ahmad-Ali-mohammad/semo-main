import * as PageContentModel from '../models/PageContentModel.js';

export async function list(req, res) {
  try {
    const rows = await PageContentModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const row = await PageContentModel.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'المحتوى غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getBySlug(req, res) {
  try {
    const row = await PageContentModel.findBySlug(req.params.slug);
    if (!row) return res.status(404).json({ error: 'المحتوى غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const body = { ...req.body, id: req.body.id || `page-${Date.now()}` };
    const row = await PageContentModel.create(body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const row = await PageContentModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'المحتوى غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await PageContentModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'المحتوى غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
