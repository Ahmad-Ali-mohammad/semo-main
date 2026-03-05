import * as UserPreferencesModel from '../models/UserPreferencesModel.js';

export async function get(req, res) {
  try {
    const requestedUserId = req.query.userId;
    const isAdmin = ['admin', 'manager'].includes(req.authUser?.role);
    const userId = isAdmin && requestedUserId ? requestedUserId : req.authUser?.id || 'default';
    const prefs = await UserPreferencesModel.get(userId);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const requestedUserId = req.query.userId;
    const isAdmin = ['admin', 'manager'].includes(req.authUser?.role);
    const userId = isAdmin && requestedUserId ? requestedUserId : req.authUser?.id || 'default';
    const prefs = await UserPreferencesModel.update(userId, req.body);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
