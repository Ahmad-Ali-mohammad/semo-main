import * as ArticleModel from '../models/ArticleModel.js';

export async function list(req, res) {
  try {
    const rows = await ArticleModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await ArticleModel.findById(id);
    if (!row) return res.status(404).json({ error: 'المقال غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const row = await ArticleModel.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await ArticleModel.update(id, req.body);
    if (!row) return res.status(404).json({ error: 'المقال غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const ok = await ArticleModel.remove(id);
    if (!ok) return res.status(404).json({ error: 'المقال غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
