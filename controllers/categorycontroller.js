const Addcategory = require('../models/category');
const db = require('../config/database');
const addcategoryController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            return res.render('addcategory', { stores });
        } else if (req.method === 'POST') {
            const { storeId, Name, Description, PageTitle, MetaKeywords, MetaDescription } = req.body;
            if (!storeId || !Name || !Description || !PageTitle || !MetaKeywords || !MetaDescription) {
                return res.status(400).json({ error: 'Fields can not be empty!' });
            }
            console.log("Received storeIds:", storeId); 
            const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
            const categoryData = { storeId: storeIdStr,  Name, Description, PageTitle, MetaKeywords, MetaDescription };
            ;
                const result = await Addcategory.add(categoryData);
            console.log("Transformed storeIds to String:", storeIdStr);
            
            return res.json({ message: 'Category added successfully', result });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error adding category:', error);
        return res.status(500).json({ error: 'An error occurred while adding the category' });
    }
};
const viewCategoryController = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const category = await Addcategory.displayAll();
            if (!category || category.length === 0) {
                return res.status(404).render('showcategory', { error: 'No category found' });
            }
            return res.status(200).render('showcategory', { category });
        } catch (error) {
            console.error('Error viewing category:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the category' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const updateCategoryController = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const categoryId = req.query.categoryId;
            if (!categoryId) {
                return res.status(400).json({ error: 'category ID is missing in the URL' });
            }
            const category = await Addcategory.getcategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'category not found' });
            }
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            return res.render('updatecategory', { category, stores });
        } else if (req.method === 'POST') {
            const { id, Name, Description, PageTitle, MetaKeywords, MetaDescription, storeId } = req.body; 
            const storeIds = Array.isArray(storeId) ? storeId.map(Number) : [storeId];
            const result = await Addcategory.update(id, { Name, Description, PageTitle, MetaKeywords, MetaDescription }, storeIds);
            if (result.affectedRows === 0) {
                return res.status(200).json({ error: 'Category not found or no changes were made' });
            }
            const category = await Addcategory.getcategoryById(id);
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            res.render('updatecategory', { category, stores }, (err, html) => {
                if (err) {
                    console.error('Error rendering view:', err);
                    return res.status(500).json({ error: 'An error occurred while rendering the view' });
                }
                return res.status(200).json({ message: 'Category updated successfully', html });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'An error occurred while updating the category' });
    }
};
const deleteCategoryController = async (req, res) => {
    try {
        console.log("Received delete category request:", req.method);
        if (req.method === 'POST') {
            const categoryId = req.body.categoryId; 
            console.log(categoryId);
            if (!categoryId) {
                return res.status(400).json({ error: 'category ID is missing in the request body' });
            }
            console.log("Attempting to delete category with ID:", categoryId);
            const result = await Addcategory.delete(categoryId);
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
        console.error('Error deleting category:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the category' });
    }
};
module.exports = {
    addcategoryController,
    viewCategoryController,
    updateCategoryController,
    deleteCategoryController
};
