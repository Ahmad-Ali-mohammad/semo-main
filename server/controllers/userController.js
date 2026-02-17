import * as UserModel from '../models/UserModel.js';

function sanitize(user) {
  if (!user) return user;
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export async function list(req, res) {
  try {
    const rows = await UserModel.findAll();
    res.json(rows.map(sanitize));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const row = await UserModel.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'المستخدم غير موجود' });
    res.json(sanitize(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const row = await UserModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'المستخدم غير موجود' });
    res.json(sanitize(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
