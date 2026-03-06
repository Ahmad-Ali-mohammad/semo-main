import * as ServiceModel from '../models/ServiceModel.js';

export async function list(req, res) {
  try {
    const publishedOnly = req.query.publishedOnly === 'true';
    const services = await ServiceModel.findAll(publishedOnly);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function get(req, res) {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'الخدمة غير موجودة.' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const service = await ServiceModel.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const service = await ServiceModel.update(req.params.id, req.body);
    if (!service) {
      return res.status(404).json({ error: 'الخدمة غير موجودة.' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await ServiceModel.remove(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'الخدمة غير موجودة.' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function reorder(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'يجب إرسال المصفوفة items.' });
    }

    await ServiceModel.updateSortOrders(items);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
