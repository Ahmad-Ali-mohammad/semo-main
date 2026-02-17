import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import * as articleController from '../controllers/articleController.js';
import * as supplyController from '../controllers/supplyController.js';
import * as heroController from '../controllers/heroController.js';
import * as addressController from '../controllers/addressController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as teamController from '../controllers/teamController.js';
import * as filterController from '../controllers/filterController.js';
import * as customDataController from '../controllers/customDataController.js';
import * as policyController from '../controllers/policyController.js';
import * as offerController from '../controllers/offerController.js';
import * as pageContentController from '../controllers/pageContentController.js';
import * as mediaController from '../controllers/mediaController.js';
import * as mediaFolderController from '../controllers/mediaFolderController.js';
import * as userPreferencesController from '../controllers/userPreferencesController.js';
import * as serviceController from '../controllers/serviceController.js';

const router = Router();

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Users
router.get('/users', userController.list);
router.get('/users/:id', userController.get);
router.put('/users/:id', userController.update);

// Products
router.get('/products', productController.list);
router.get('/products/:id', productController.get);
router.post('/products', productController.create);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.remove);

// Orders
router.get('/orders', orderController.list);
router.get('/orders/:id', orderController.get);
router.post('/orders', orderController.create);
router.put('/orders/:id', orderController.update);
router.patch('/orders/:id/status', orderController.updateStatus);
router.delete('/orders/:id', orderController.remove);

// Articles
router.get('/articles', articleController.list);
router.get('/articles/:id', articleController.get);
router.post('/articles', articleController.create);
router.put('/articles/:id', articleController.update);
router.delete('/articles/:id', articleController.remove);

// Supplies
router.get('/supplies', supplyController.list);
router.get('/supplies/:id', supplyController.get);
router.post('/supplies', supplyController.create);
router.put('/supplies/:id', supplyController.update);
router.delete('/supplies/:id', supplyController.remove);

// Hero slides
router.get('/hero', heroController.list);
router.get('/hero/:id', heroController.get);
router.post('/hero', heroController.create);
router.put('/hero/:id', heroController.update);
router.delete('/hero/:id', heroController.remove);

// Addresses
router.get('/addresses', addressController.list);
router.get('/addresses/:id', addressController.get);
router.post('/addresses', addressController.create);
router.put('/addresses/:id', addressController.update);
router.delete('/addresses/:id', addressController.remove);

// Settings (single-row)
router.get('/settings/company', settingsController.getCompany);
router.put('/settings/company', settingsController.setCompany);
router.get('/settings/contact', settingsController.getContact);
router.put('/settings/contact', settingsController.setContact);
router.get('/settings/shamcash', settingsController.getShamcash);
router.put('/settings/shamcash', settingsController.setShamcash);
router.get('/settings/seo', settingsController.getSeo);
router.put('/settings/seo', settingsController.setSeo);

// Team
router.get('/team', teamController.list);
router.get('/team/:id', teamController.get);
router.post('/team', teamController.create);
router.put('/team/:id', teamController.update);
router.delete('/team/:id', teamController.remove);

// Filters
router.get('/filters', filterController.list);
router.get('/filters/:id', filterController.get);
router.post('/filters', filterController.create);
router.put('/filters/:id', filterController.update);
router.delete('/filters/:id', filterController.remove);

// Custom categories & species
router.get('/custom-categories', customDataController.getCategories);
router.post('/custom-categories', customDataController.addCategory);
router.get('/custom-species', customDataController.getSpecies);
router.post('/custom-species', customDataController.addSpecies);

// Policies
router.get('/policies', policyController.list);
router.get('/policies/:id', policyController.get);
router.post('/policies', policyController.create);
router.put('/policies/:id', policyController.update);
router.delete('/policies/:id', policyController.remove);

// Offers
router.get('/offers', offerController.list);
router.get('/offers/:id', offerController.get);
router.post('/offers', offerController.create);
router.put('/offers/:id', offerController.update);
router.delete('/offers/:id', offerController.remove);

// Services
router.get('/services', serviceController.list);
router.get('/services/:id', serviceController.get);
router.post('/services', serviceController.create);
router.put('/services/:id', serviceController.update);
router.delete('/services/:id', serviceController.remove);
router.post('/services/reorder', serviceController.reorder);

// Page contents CMS
router.get('/page-contents', pageContentController.list);
router.get('/page-contents/slug/:slug', pageContentController.getBySlug);
router.get('/page-contents/:id', pageContentController.get);
router.post('/page-contents', pageContentController.create);
router.put('/page-contents/:id', pageContentController.update);
router.delete('/page-contents/:id', pageContentController.remove);

// Media library
router.get('/media', mediaController.list);
router.get('/media/:id', mediaController.get);
router.post('/media', mediaController.create);
router.put('/media/:id', mediaController.update);
router.delete('/media/:id', mediaController.remove);
router.post('/media/bulk-delete', mediaController.bulkDelete);

// Media folders
router.get('/media-folders', mediaFolderController.list);
router.get('/media-folders/:id', mediaFolderController.get);
router.post('/media-folders', mediaFolderController.create);
router.put('/media-folders/:id', mediaFolderController.update);
router.delete('/media-folders/:id', mediaFolderController.remove);

// User preferences
router.get('/user-preferences', userPreferencesController.get);
router.put('/user-preferences', userPreferencesController.update);

export default router;
