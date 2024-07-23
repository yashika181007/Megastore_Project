const db = require('../config/database');
class Product {
    static async add(productData) {
        const {
            storeId, catId, subcatId, sub_subcatId, ProductTitle, Description, Price, images
        } = productData;
        const productQuery = `
            INSERT INTO products (
                storeId, catId, subcatId, sub_subcatId, ProductTitle, Description, Price, images
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [storeId, catId, subcatId, sub_subcatId, ProductTitle	, Description, Price, images];
        try {
            console.log('Insert Product Query:', productQuery);
            console.log('Insert Product Data:', productValues);
            const [productResult] = await db.query(productQuery, productValues);
            console.log('Product Insertion Result:', productResult);
            return productResult;
        } catch (error) {
            console.error('Product Insert Error:', error);
            throw error;
        }
    }
    static async displayAll() {
        try {
            const [rows] = await db.query('SELECT * FROM products');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async delete(productId) {
        try {
            const [rows] = await db.query('DELETE FROM products WHERE id = ?', [productId]);
             return rows;
        } catch (error) {
            console.error("Error deleting Product:", error);
            throw error;
        }
    }
    static async update(id, productData) {
        try {
            const {
                storeId, catId, subcatId,sub_subcatId, ProductTitle, Description, Price, images
            } = productData;
    
            console.log('Updating product with ID:', id);
            console.log('Updated data:', productData);
    
            const [rows] = await db.query(
                `UPDATE products 
                 SET storeId = ?, catId = ?, subcatId = ?, sub_subcatId = ?, ProductTitle = ?, 
                 Description = ?, Price = ?, images = ? 
                 WHERE id = ?`,
                [storeId, catId, subcatId, sub_subcatId, ProductTitle, Description, Price, images, id]
            );
    
            console.log('Update query result:', rows);
    
            return rows;
        } catch (error) {
            // Log the error
            console.error('Error updating product:', error);
            throw error;
        }
    }
    
    
    
    
    static async getProductById(product) {
        try {
            const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [product]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Product;
