const db = require('../config/database');
const Store = require('../models/Store');
const Sub_Subcategory = require('../models/sub_subcategory');
const addSub_subcategoryController = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { storeId, catId, subcatId, Sub_SubCatName, Sub_SubCatDescription,
                Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription } = req.body;
        
        if (!storeId || !Sub_SubCatName || !Sub_SubCatDescription || 
            !Sub_SubCatPageTitle || !Sub_SubCatMetaKeywords || !Sub_SubCatMetaDescription) {
            return res.status(400).json({ error: 'Fields cannot be empty!' });
        }
        
            const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
            const catIdStr = Array.isArray(catId) ? catId.join(',') : catId;
            const subcatIdStr = Array.isArray(subcatId) ? subcatId.join(',') : subcatId;
            const Sub_SubcategoryData = { storeId: storeIdStr, catId: catIdStr, subcatId:subcatIdStr, Sub_SubCatName, Sub_SubCatDescription,
                Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription};
        ;
            const result = await Sub_Subcategory.add(Sub_SubcategoryData);
            res.status(201).json({ message: 'Sub Subcategory added successfully' });
        } catch (error) {
            console.error('Error adding sub subcategory:', error);
            res.status(500).json({ error: 'An internal server error occurred while adding the sub subcategory' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const getsub_subcategories = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const { storeIds } = req.query;
            let categories = [];
            let subcategories = [];
            if (storeIds) {
                const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
                console.log('Received store IDs:', storeIdArray); // Debug log
                
                const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
                const catquery = `SELECT id, Name,storeId FROM category WHERE ${conditions}`;
                const subcatquery = `SELECT id, SubCatName ,storeId FROM subcategory WHERE ${conditions}`;
                const [categoriesResult] = await db.query(catquery, storeIdArray);
                categories = categoriesResult;
                const [subcategoriesResult] = await db.query(subcatquery, storeIdArray);
                subcategories = subcategoriesResult;
            }
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ categories,subcategories });
            } else {
                const stores = await Store.displayAll();
                return res.render('addsub_subcategory', { stores, categories,subcategories });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send('Server Error');
    }
};
const viewsub_subcategoryController = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const sub_subcategory = await Sub_Subcategory.displayAll();

            if (!sub_subcategory || sub_subcategory.length === 0) {
                return res.status(404).render('sub_subcategory', { error: 'No sub sub category found' });
            }
            return res.status(200).render('showsub_subcategory', { sub_subcategory });
        } catch (error) {
            console.error('Error viewing sub category:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the sub category' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const deleteSub_SubcategoryController = async (req, res) => {
    try {
        console.log("Received delete subcategory request:", req.method);

        if (req.method === 'POST') {
            const sub_subcategoryId = req.body.sub_subcategoryId; 
            console.log(sub_subcategoryId);
            if (!sub_subcategoryId) {
                return res.status(400).json({ error: 'subcategory ID is missing in the request body' });
            }

            console.log("Attempting to delete subcategory with ID:", sub_subcategoryId);
            const result = await Sub_Subcategory.delete(sub_subcategoryId);
            console.log("Deletion result:", result);

            if (result.affectedRows === 0) {
                console.error("Sub Category not found");
                return res.status(404).json({ error: 'Category not found' });
            }

            console.log("Sub Category deleted successfully");
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
const updatesub_subcategoryController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const sub_subcategoryId = req.query.sub_subcategoryId;
            if (!sub_subcategoryId) {
                return res.status(400).json({ error: 'Sub-subcategory ID is missing in the URL' });
            }

            const sub_subcategory = await Sub_Subcategory.getsub_subcategoryById(sub_subcategoryId);
            if (!sub_subcategory) {
                return res.status(404).json({ error: 'Sub-subcategory not found' });
            }

            const { storeIds } = req.query;
            let categories = [];
            let subcategories = [];
            if (storeIds) {
                const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
                const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
                const catquery = `SELECT id, Name FROM category,storeId WHERE ${conditions}`;
                const subcatquery = `SELECT id, SubCatName,storeId FROM subcategory WHERE ${conditions}`;
                const [categoriesResult] = await db.query(catquery, storeIdArray);
                categories = categoriesResult;
                const [subcategoriesResult] = await db.query(subcatquery, storeIdArray);
                subcategories = subcategoriesResult;
            }

            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ categories, subcategories });
            } else {
                const stores = await Store.displayAll();
                return res.render('updatesub_subcategory', { stores, categories, subcategories, sub_subcategory });
            }

        } else if (req.method === 'POST') {
            const {  id,storeId, catId,subcatId, Sub_SubCatName, Sub_SubCatDescription,
                Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription} = req.body;
        
            const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
            const catIdStr = Array.isArray(catId) ? catId.join(',') : catId;
            const subcatIdStr = Array.isArray(subcatId) ? subcatId.join(',') : subcatId;
            const Sub_SubcategoryData = { storeId: storeIdStr, catId: catIdStr, subcatId:subcatIdStr, Sub_SubCatName, Sub_SubCatDescription,
                Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription};
        ;
            const result = await Sub_Subcategory.update(id, {
                Sub_SubCatName, Sub_SubCatDescription,
                Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription
            }, storeId, catId, subcatId);

            if (result.affectedRows === 0) {
                return res.status(200).json({ error: 'Sub-subcategory not found or no changes were made' });
            }

            const sub_subcategory = await Sub_Subcategory.getsub_subcategoryById(id);
            const stores = await Store.displayAll();
            const [categories] = await db.query('SELECT id, Name FROM category');
            const [subcategories] = await db.query('SELECT id, SubCatName FROM subcategory');

            res.render('updatesub_subcategory', { sub_subcategory, stores, categories, subcategories }, (err, html) => {
                if (err) {
                    console.error('Error rendering view:', err);
                    return res.status(500).json({ error: 'An error occurred while rendering the view' });
                }

                return res.status(200).json({ message: 'Sub-subcategory updated successfully', html });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating sub-subcategory:', error);
        return res.status(500).json({ error: 'An error occurred while updating the sub-subcategory' });
    }
};

module.exports = {
    addSub_subcategoryController,
    getsub_subcategories,
    viewsub_subcategoryController,
    deleteSub_SubcategoryController,
    updatesub_subcategoryController
};
