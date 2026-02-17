import * as MediaFolderModel from '../models/MediaFolderModel.js';

export async function list(req, res) {
  try {
    const rows = await MediaFolderModel.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const row = await MediaFolderModel.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'المجلد غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const row = await MediaFolderModel.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const row = await MediaFolderModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'المجلد غير موجود' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await MediaFolderModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'المجلد غير موجود' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
