// controllers/BlogPostcontroller.js
const db = require('../config/database');
const BlogPost = require('../models/BlogPost');
const { blogimageUpload } = require('../config/multer');
const addblogpost = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            const [category] = await db.query('SELECT id, CatName FROM blogcat');
            return res.render('addblogpost', { stores ,category});
        } else if (req.method === 'POST') {
            
            blogimageUpload(req, res, async function (err) {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(500).json({ error: 'An error occurred while uploading the file' });
                }
                const { storeId,blogcatId, title, description, tags,videoEmbedCode} = req.body;
                const blogimages = req.file ? req.file.filename : null;
                console.log('Image filename:', blogimages);
                console.log("Received storeIds:", storeId);
                if (!storeId || !blogcatId || !title || !description || !blogimages || !tags || !videoEmbedCode) {
                    return res.status(400).json({ error: 'Fields can not be empty!' });
                }
                const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
                const blogcatIdStr = Array.isArray(blogcatId) ? blogcatId.join(',') : blogcatId;
                const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
                const blogpostData = { storeId: storeIdStr,blogcatId:blogcatIdStr, title,blogimages, description, tags:tagsStr,videoEmbedCode };
                const result = await BlogPost.add(blogpostData);
                console.log("Transformed storeIds to String:", storeIdStr);
                return res.json({ message: 'Blog Post added successfully', result });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in BlogPostController:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
};

const viewblogpost = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const blogpost = await BlogPost.displayAll();
            if (!blogpost || blogpost.length === 0) {
                return res.status(404).render('showblogpost', { error: 'No Blog Post found' });
            }
            return res.status(200).render('showblogpost', { blogpost });
        } catch (error) {
            console.error('Error viewing Blog Post:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the Blog Post' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const deleteblogpost = async (req, res) => {
    try {
        console.log("Received delete Blog Post request:", req.method);
        if (req.method === 'POST') {
            const blogpostId = req.body.blogpostId;
            console.log(blogpostId);
            if (!blogpostId) {
                return res.status(400).json({ error: 'blog category ID is missing in the request body' });
            }
            console.log("Attempting to delete Blog Post with ID:", blogpostId);
            const result = await BlogPost.delete(blogpostId);
            console.log("Deletion result:", result);
            if (result.affectedRows === 0) {
                console.error("Category not found");
                return res.status(404).json({ error: 'Category not found' });
            }
            console.log("Blog Post deleted successfully");
            return res.json({ message: 'Blog Post deleted successfully' });
        } else {
            console.error("Method Not Allowed");
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the category' });
    }
};

const updateblogpost = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const blogpostId = req.query.blogpostId;
            if (!blogpostId) {
                return res.status(400).json({ error: 'Blog Post ID is missing in the URL' });
            }
            const blogpost = await BlogPost.getcategoryById(blogpostId);
            if (!blogpost) {
                return res.status(404).json({ error: 'Blog Post not found' });
            }
            const [stores] = await db.query('SELECT id, store_name FROM stores');
            const [blogcat] = await db.query('SELECT id, CatName FROM blogcat');
            return res.render('updateblogpost', { blogpost, stores, blogcat });
        } else if (req.method === 'POST') {
            blogimageUpload(req, res, async function (err) {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(500).json({ error: 'An error occurred while uploading the file' });
                }
                const { id, storeId, blogcatId, title, description, tags, videoEmbedCode } = req.body;
                const blogimages = req.file ? req.file.filename : undefined;

                const updatedFields = { title, description, tags, videoEmbedCode };
                if (blogimages !== undefined) {
                    updatedFields.blogimages = blogimages;
                }

                const storeIds = Array.isArray(storeId) ? storeId.map(Number) : [storeId];
                const blogcatIds = Array.isArray(blogcatId) ? blogcatId.map(Number) : [blogcatId];
                const result = await BlogPost.update(id, updatedFields, storeIds, blogcatIds);
                if (result.affectedRows === 0) {
                    return res.status(200).json({ error: 'Blog Post not found or no changes were made' });
                }
                const blogpost = await BlogPost.getcategoryById(id);
                const [stores] = await db.query('SELECT id, store_name FROM stores');
                const [blogcat] = await db.query('SELECT id, CatName FROM blogcat');

                res.render('updateblogpost', { blogpost, stores, blogcat }, (err, html) => {
                    if (err) {
                        console.error('Error rendering view:', err);
                        return res.status(500).json({ error: 'An error occurred while rendering the view' });
                    }
                    return res.status(200).json({ message: 'Blog Post updated successfully', html });
                });
            });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating Blog Post:', error);
        return res.status(500).json({ error: 'An error occurred while updating the Blog Post' });
    }
};

module.exports = {
    addblogpost,
    viewblogpost,
    updateblogpost,
    deleteblogpost
    
};
