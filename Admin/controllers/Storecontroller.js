const db = require('../config/database');
const AddStore = require('../models/Store');
const addStoreController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            return res.render('addstores');
        } else if (req.method === 'POST') {
            const { store_name, domain_name } = req.body;
            if (!store_name || !domain_name) {
                return res.status(400).json({ error: 'Fields cannot be empty!' });
            }
            // Check if store name or domain already exists
            const exists = await AddStore.isExists({ store_name, domain_name });
            if (exists) {
                return res.status(409).json({ error: exists });
            }
            const storeData = { store_name, domain_name };
            const result = await AddStore.add(storeData);
            return res.json({ message: 'Store added successfully', result });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in addStoreController:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
};
const viewStoreController = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const stores = await AddStore.displayAll();
            if (!stores || stores.length === 0) {
                return res.status(404).render('showstores', { error: 'No stores found' });
            }
            return res.status(200).render('showstores', { stores });
        } catch (error) {
            console.error('Error viewing stores:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the stores' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const updateStoreController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const storeId = req.query.storeId;
            if (!storeId) {
                return res.status(400).json({ error: 'Store ID is missing in the URL' });
            }
            const store = await AddStore.getStoreById(storeId);
            if (!store) {
                return res.status(404).json({ error: 'Store not found' });
            }
            const [categories] = await db.query('SELECT Name FROM category');
            return res.status(200).render('updatestores', { store, categories }); // Pass categories to the view
        } else if (req.method === 'POST') {
            const { store_name, domain_name, category, storeId } = req.body;
            const result = await AddStore.update(storeId, { store_name, domain_name, category });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Store not found or no changes were made' });
            }
            return res.json({ message: 'Store updated successfully' });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating store:', error);
        return res.status(500).json({ error: 'An error occurred while updating the store' });
    }
};
const deletestoreController = async (req, res) => {
    try {
        console.log("Received delete store request:", req.method);
        if (req.method === 'POST') {
            const storeId = req.body.storeId; 
            console.log(storeId);
            if (!storeId) {
                return res.status(400).json({ error: 'store ID is missing in the request body' });
            }
            console.log("Attempting to delete store with ID:", storeId);
            const result = await AddStore.delete(storeId);
            console.log("Deletion result:", result);
            if (result.affectedRows === 0) {
                console.error("store not found");
                return res.status(404).json({ error: 'store not found' });
            }
            console.log("store deleted successfully");
            return res.json({ message: 'store deleted successfully' });
        } else {
            console.error("Method Not Allowed");
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error deleting store:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the store' });
    }
};
module.exports = {
    addStoreController,
    viewStoreController,
    updateStoreController,
    deletestoreController
};
