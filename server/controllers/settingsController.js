import { companyInfo, contactInfo, shamcashConfig, seoSettings } from '../models/SettingsModel.js';

export async function getCompany(req, res) {
  try {
    const row = await companyInfo.get();
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setCompany(req, res) {
  try {
    const row = await companyInfo.set(req.body);
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getContact(req, res) {
  try {
    const row = await contactInfo.get();
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setContact(req, res) {
  try {
    const row = await contactInfo.set(req.body);
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getShamcash(req, res) {
  try {
    const row = await shamcashConfig.get();
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setShamcash(req, res) {
  try {
    const row = await shamcashConfig.set(req.body);
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSeo(req, res) {
  try {
    const row = await seoSettings.get();
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setSeo(req, res) {
  try {
    const row = await seoSettings.set(req.body);
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
