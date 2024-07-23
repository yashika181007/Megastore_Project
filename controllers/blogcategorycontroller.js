// controllers/blogcategorycontroller.js
const db = require('../config/database');
const BlogCategory = require('../models/BlogCategory');
const { singleUpload } = require('../config/multer');
const addblogcategory = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            return res.render('addblogcategory', { stores });
        } else if (req.method === 'POST') {
            //   if (!storeId || !CatName || !Catimage || !CatDescription) {
            //     return res.status(400).json({ error: 'Fields can not be empty!' });
            // }
            singleUpload(req, res, async function (err) {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(500).json({ error: 'An error occurred while uploading the file' });
                }
                const { storeId, CatName, CatDescription } = req.body;
                const Catimage = req.file ? req.file.filename : null;
                console.log('Image filename:', Catimage);
                console.log("Received storeIds:", storeId);
                if (!storeId || !CatName || !Catimage || !CatDescription) {
                    return res.status(400).json({ error: 'Fields can not be empty!' });
                }
                const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
                const blogcategoryData = { storeId: storeIdStr, CatName, Catimage, CatDescription };
                const result = await BlogCategory.add(blogcategoryData);
                console.log("Transformed storeIds to String:", storeIdStr);
                return res.json({ message: 'Category added successfully', result });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in BlogCategoryController:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
};
const viewblogcategory = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const blogcategory = await BlogCategory.displayAll();
            if (!blogcategory || blogcategory.length === 0) {
                return res.status(404).render('showblogcategory', { error: 'No category found' });
            }
            return res.status(200).render('showblogcategory', { blogcategory });
        } catch (error) {
            console.error('Error viewing category:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the category' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};

const updateblogcategory = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const blogcategoryId = req.query.blogcategoryId;
            if (!blogcategoryId) {
                return res.status(400).json({ error: 'category ID is missing in the URL' });
            }
            const blogcategory = await BlogCategory.getcategoryById(blogcategoryId);
            if (!blogcategory) {
                return res.status(404).json({ error: 'category not found' });
            }
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            return res.render('updateblogcategory', { blogcategory, stores });
        } else if (req.method === 'POST') {
            singleUpload(req, res, async function (err) {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(500).json({ error: 'An error occurred while uploading the file' });
                }
                const { id,storeId, CatName, CatDescription } = req.body;
                const Catimage = req.file ? req.file.filename : null;
                const updatedFields = { CatName, CatDescription };
                if (Catimage) {
                    updatedFields.Catimage = Catimage;
                }



                const storeIds = Array.isArray(storeId) ? storeId.map(Number) : [storeId];
                const result = await BlogCategory.update(id, { CatName, Catimage, CatDescription }, storeIds);
                if (result.affectedRows === 0) {
                    return res.status(200).json({ error: 'Category not found or no changes were made' });
                }
                const blogcategory = await BlogCategory.getcategoryById(id);
                const [stores] = await db.query('SELECT id, store_name FROM stores');




                res.render('updateblogcategory', { blogcategory, stores }, (err, html) => {
                    if (err) {
                        console.error('Error rendering view:', err);
                        return res.status(500).json({ error: 'An error occurred while rendering the view' });
                    }
                    return res.status(200).json({ message: 'Category updated successfully', html });
                });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'An error occurred while updating the category' });
    }
};
const deleteblogcegory = async (req, res) => {
    try {
        console.log("Received delete category request:", req.method);
        if (req.method === 'POST') {
            const blogcategoryId = req.body.blogcategoryId;
            console.log(blogcategoryId);
            if (!blogcategoryId) {
                return res.status(400).json({ error: 'blog category ID is missing in the request body' });
            }
            console.log("Attempting to delete category with ID:", blogcategoryId);
            const result = await BlogCategory.delete(blogcategoryId);
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
    addblogcategory,
    viewblogcategory,
    updateblogcategory,
    deleteblogcegory
};
