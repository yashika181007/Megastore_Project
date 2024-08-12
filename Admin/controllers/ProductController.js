const db = require('../config/database');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { upload } = require('../config/multer');

const addproduct = async (req, res) => {
    if (req.method === 'POST') {
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(500).json({ error: 'An error occurred while uploading files' });
            }
            try {
                console.log('Request body:', req.body);
                console.log('Uploaded Files:', req.files);

                const { storeId, catId, subcatId, sub_subcatId, ProductTitle, Description, Price } = req.body;
                console.log('Store IDs:', storeId);
                console.log('Category IDs:', catId);
                console.log('Subcategory IDs:', subcatId);
                console.log('Sub-subcategory IDs:', sub_subcatId);

                if (!storeId || !ProductTitle || !Description || !Price) {
                    return res.status(400).json({ error: 'Fields can not be empty!' });
                }

                const images = req.files.map(file => file.filename);
                console.log('Image filenames:', images);

                const productData = {
                    storeId: storeId.join(','),
                    catId: catId.join(','),
                    subcatId: subcatId.join(','),
                    sub_subcatId: sub_subcatId.join(','),
                    ProductTitle,
                    Description,
                    Price,
                    images: images.join(',')
                };

                console.log('Product data:', productData);

                const productResult = await Product.add(productData);
                res.status(201).json({ message: 'Product added successfully', product: productResult });
            } catch (error) {
                console.error('Error adding Product:', error);
                res.status(500).json({ error: 'An internal server error occurred while adding the Product' });
            }
        });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};

const getproduct = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const { storeIds } = req.query;
            let categories = [];
            let subcategories = [];
            let subSubcategories = [];
            if (storeIds) {
                const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
                const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
                const catquery = `SELECT id, Name FROM category WHERE ${conditions}`;
                const subcatquery = `SELECT id, SubCatName FROM subcategory WHERE ${conditions}`;
                const subSubcatquery = `SELECT id, Sub_SubCatName FROM sub_subcategory WHERE ${conditions}`;
                const [categoriesResult] = await db.query(catquery, storeIdArray);
                categories = categoriesResult;
                const [subcategoriesResult] = await db.query(subcatquery, storeIdArray);
                subcategories = subcategoriesResult;
                const [subSubcategoriesResult] = await db.query(subSubcatquery, storeIdArray);
                subSubcategories = subSubcategoriesResult;
                console.log('Subcategories:', subcategories);
                console.log('SubSubcategories:', subSubcategories);
            }
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ categories, subcategories, subSubcategories });
            } else {
                const stores = await Store.displayAll();
                return res.render('addproduct', { stores, categories, subcategories, subSubcategories });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send('Server Error');
    }
};
const viewproduct = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const product = await Product.displayAll();
            if (!product || product.length === 0) {
                return res.status(404).render('product', { error: 'No  product found' });
            }
            return res.status(200).render('showproduct', { product });
        } catch (error) {
            console.error('Error viewing product:', error);
            return res.status(500).render('error', { error: 'An error occurred while viewing the product' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
const deleteproduct = async (req, res) => {
    try {
        console.log("Received delete Product request:", req.method);
        if (req.method === 'POST') {
            const productId = req.body.productId;
            console.log(productId);
            if (!productId) {
                return res.status(400).json({ error: 'Product ID is missing in the request body' });
            }
            console.log("Attempting to delete Product with ID:", productId);
            const result = await Product.delete(productId);
            console.log("Deletion result:", result);
            if (result.affectedRows === 0) {
                console.error("product not found");
                return res.status(404).json({ error: 'Product not found' });
            }
            console.log("product deleted successfully");
            return res.json({ message: 'Product deleted successfully' });
        } else {
            console.error("Method Not Allowed");
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the Product' });
    }
};
const updateproduct = async (req, res) => {
    if (req.method === 'GET') {
        const productId = req.query.productId;
        if (!productId) {
            return res.status(400).json({ error: 'Sub-subcategory ID is missing in the URL' });
        }
        const product = await Product.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Sub-subcategory not found' });
        }
        const { storeIds } = req.query;
        let categories = [];
        let subcategories = [];
        let subSubcategories = [];
        if (storeIds) {
            const storeIdArray = Array.isArray(storeIds) ? storeIds : storeIds.split(',');
            const conditions = storeIdArray.map(() => 'FIND_IN_SET(?, storeId)').join(' OR ');
            const catquery = `SELECT id, Name FROM category WHERE ${conditions}`;
            const subcatquery = `SELECT id, SubCatName FROM subcategory WHERE ${conditions}`;
            const subSubcatquery = `SELECT id, Sub_SubCatName FROM sub_subcategory WHERE ${conditions}`;
            const [categoriesResult] = await db.query(catquery, storeIdArray);
            categories = categoriesResult;
            const [subcategoriesResult] = await db.query(subcatquery, storeIdArray);
            subcategories = subcategoriesResult;
            const [subSubcategoriesResult] = await db.query(subSubcatquery, storeIdArray);
            subSubcategories = subSubcategoriesResult;
        }
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ categories, subcategories, subSubcategories, product });
        } else {
            const stores = await Store.displayAll();
            return res.render('updateproduct', { stores, categories, subcategories, subSubcategories, product });
        }
    } else if (req.method === 'POST') {
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(500).json({ error: 'An error occurred while uploading files' });
            }

            try {
                const productId = req.body.id;
                if (!productId) {
                    return res.status(400).json({ error: 'Product ID is missing in the request body' });
                }
                const existingProduct = await Product.getProductById(productId);
                if (!existingProduct) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                const { storeId, catId, subcatId, sub_subcatId, ProductTitle, Description, Price, deletedImages } = req.body;
                const storeIdStr = Array.isArray(storeId) ? storeId.join(',') : storeId;
                const catIdStr = Array.isArray(catId) ? catId.join(',') : catId;
                const subcatIdStr = Array.isArray(subcatId) ? subcatId.join(',') : subcatId;
                const subSubcatIdStr = Array.isArray(sub_subcatId) ? sub_subcatId.join(',') : sub_subcatId;
                const product = existingProduct[0];

                // Handle deleted images
                let productImages = product.images ? product.images.split(',') : [];
                if (deletedImages) {
                    const imagesToDelete = deletedImages.split(',');
                    productImages = productImages.filter(image => !imagesToDelete.includes(image));
                }

                // Add new images
                const newImages = req.files ? req.files.map(file => file.filename) : [];
                productImages = [...new Set([...productImages, ...newImages])];
                console.log('productImages:', productImages);
                // Prepare updated product data
                const productData = {
                    storeId: storeIdStr,
                    catId: catIdStr,
                    subcatId: subcatIdStr,
                    sub_subcatId: subSubcatIdStr,
                    ProductTitle,
                    Description,
                    Price,
                    images: productImages.join(',')
                };

                // Update the product
                const productResult = await Product.update(productId, productData);
                res.status(200).json({ message: 'Product updated successfully', product: productResult });
            } catch (error) {
                console.error('Error updating Product:', error);
                res.status(500).json({ error: 'An internal server error occurred while updating the Product' });
            }
        });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};

module.exports = {
    addproduct,
    getproduct,
    viewproduct,
    deleteproduct,
    updateproduct
};