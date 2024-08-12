const db = require('../config/database');
class BlogCategory {
    static async add(blogcategoryData) {
        try {
            const { storeId, CatName, Catimage, CatDescription } = blogcategoryData;
            const query = `
                    INSERT INTO blogcat (
                        storeId, CatName, Catimage, CatDescription
                    ) VALUES (?, ?, ?, ?)
                `;
            console.log('Executing query:', query);  // Log the query string
            console.log('With values:', [storeId, CatName, Catimage, CatDescription]);  // Log the values
            const [rows] = await db.query(query, [
                storeId, CatName, Catimage, CatDescription
            ]);
            return rows;
        } catch (error) {
            console.error('Failed to add category:', error);
            throw error;
        }
    }
    static async displayAll() {
        try {
            const [rows] = await db.query('SELECT * FROM blogcat');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async delete(blogcategoryId) {
        try {
            const [rows] = await db.query('DELETE FROM blogcat WHERE id = ?', [blogcategoryId]);
            return rows;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
    static async getcategoryById(blogcategoryId) {
        try {
            const [rows] = await db.query('SELECT * FROM blogcat WHERE id = ?', [blogcategoryId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async update(id, blogcategoryData, storeIds) {
        try {
            const { CatName, Catimage, CatDescription } = blogcategoryData;
            const storeIdString = storeIds.join(',');
            const [rows] = await db.query(
                'UPDATE blogcat SET CatName = ?, Catimage = ?, CatDescription = ?, storeId = ? WHERE id = ?',
                [CatName, Catimage, CatDescription, storeIdString, id]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = BlogCategory;
