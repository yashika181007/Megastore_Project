const db = require('../config/database');
const Store = require('../models/Store');
const Subcategory = require('../models/subcategory');
const addSubcategoryController = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { storeId, catId, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription } = req.body;
            if (!storeId || !SubCatName || !SubCatDescription || !SubCatPageTitle || !SubCatMetaKeywords || !SubCatMetaDescription) {
                return res.status(400).json({ error: 'Fields can not be empty!' });
            }
            const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
            const catIdStr = Array.isArray(catId) ? catId.join(',') : catId;
            const subcategoryData = { storeId: storeIdStr, catId: catIdStr, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription };
            ;
            const result = await Subcategory.add(subcategoryData);
            res.status(201).json({ message: 'Subcategory added successfully' });
        } catch (error) {
            console.error('Error adding subcategory:', error);
            res.status(500).json({ error: 'An internal server error occurred while adding the subcategory' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const getsubcategories = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const { storeIds } = req.query;
            let categories = [];

            if (storeIds) {
                const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
                console.log('Received store IDs:', storeIdArray); // Debug log

                const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
                const query = `SELECT id, Name, storeId FROM category WHERE ${conditions}`;
                const [categoriesResult] = await db.query(query, storeIdArray);
                categories = categoriesResult;
            }

            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ categories });
            } else {
                const stores = await Store.displayAll();
                return res.render('addsubcategory', { stores, categories });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send('Server Error');
    }
};



const viewsubcategoryController = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const subcategory = await Subcategory.displayAll();

            if (!subcategory || subcategory.length === 0) {
                return res.status(404).render('showsubcategory', { error: 'No sub category found' });
            }
            return res.status(200).render('showsubcategory', { subcategory });
        } catch (error) {
            console.error('Error viewing sub category:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the sub category' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const deleteSubcategoryController = async (req, res) => {
    try {
        console.log("Received delete subcategory request:", req.method);

        if (req.method === 'POST') {
            const subcategoryId = req.body.subcategoryId;
            console.log(subcategoryId);
            if (!subcategoryId) {
                return res.status(400).json({ error: 'subcategory ID is missing in the request body' });
            }

            console.log("Attempting to delete subcategory with ID:", subcategoryId);
            const result = await Subcategory.delete(subcategoryId);
            console.log("Deletion result:", result);

            if (result.affectedRows === 0) {
                console.error("Category not found");
                return res.status(404).json({ error: 'Category not found' });
            }

            console.log("Category deleted successfully");
            return res.json({ message: 'Category deleted successfully' });
        } else {
            console.error("Method Not Allowed");
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the subcategory' });
    }
};
const updatesubcategoryController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const subcategoryId = req.query.subcategoryId;
            if (!subcategoryId) {
                return res.status(400).json({ error: 'Subcategory ID is missing in the URL' });
            }
            let subcategories = [];
            const subcategory = await Subcategory.getsubcategoryById(subcategoryId);
            if (!subcategory) {
                return res.status(404).json({ error: 'Subcategory not found' });
            }
            subcategories = subcategory;

            const { storeIds } = req.query;
            let categories = [];
            if (storeIds) {
                const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
                const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
                const query = `SELECT id, Name, storeId FROM category WHERE ${conditions}`;
                console.log('Generated SQL Query:', query); // Debug log

                
                const [categoriesResult] = await db.query(query, storeIdArray);
                console.log('Categories fetched:', categoriesResult); // Debug log
                categories = categoriesResult;
            }
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ categories });
            } else {
                const stores = await Store.displayAll();
                return res.render('updatesubcategory', { stores, categories, subcategories });
            }

        } else if (req.method === 'POST') {
            const { id, storeId, catId, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription } = req.body;

            const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
            const catIdStr = Array.isArray(catId) ? catId.join(',') : catId;
            const subcategoryData = {
                storeId: storeIdStr,
                catId: catIdStr,
                SubCatName,
                SubCatDescription,
                SubCatPageTitle,
                SubCatMetaKeywords,
                SubCatMetaDescription
            };

            const result = await Subcategory.update(id, subcategoryData, storeId, catId);

            
            if (result.affectedRows > 0) {
                console.log('Update successful for subcategory ID:', id);
                return res.status(200).json({ message: 'Subcategory updated successfully' });
            } else {
                console.log('No changes made for subcategory ID:', id);
                return res.status(200).json({ error: 'No changes were made' });
            }

        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return res.status(500).json({ error: 'An error occurred while updating the subcategory' });
    }
};


module.exports = {
    addSubcategoryController,
    getsubcategories,
    viewsubcategoryController,
    deleteSubcategoryController,
    updatesubcategoryController
};
