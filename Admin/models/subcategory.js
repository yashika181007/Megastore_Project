const db = require('../config/database');
class Subcategory {
    static async add(subcategoryData) {
        const {
            storeId, catId, SubCatName, SubCatDescription,
            SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription
        } = subcategoryData;
        const query = `
            INSERT INTO subcategory (
                storeId, catId, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [storeId, catId, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription];
        try {
            console.log('Insert Query:', query);
            console.log('Insert Data:', values);
            const [result] = await db.query(query, values);
            console.log('Insertion Result:', result);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    static async displayAll() {
        try {
            const [rows] = await db.query('SELECT * FROM subcategory');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async delete(subcategoryId) {
        try {
            const [rows] = await db.query('DELETE FROM subcategory WHERE id = ?', [subcategoryId]);
             return rows;
        } catch (error) {
            console.error("Error deleting sub category:", error);
            throw error;
        }
    }
    static async update(id, updatedData, storeIds,catIds) {
        try {
            const { SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription } = updatedData;
    
          
            const storeIdString = storeIds.join(',');
            const catIdString = catIds.join(',');
    
            const [rows] = await db.query(
                'UPDATE subcategory SET storeId = ?, catId = ?, SubCatName = ?, SubCatDescription = ?, SubCatPageTitle = ?, SubCatMetaKeywords = ?, SubCatMetaDescription = ? WHERE id = ?',
                [storeIdString, catIdString, SubCatName, SubCatDescription, SubCatPageTitle, SubCatMetaKeywords, SubCatMetaDescription, id]
            );
            
    
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async getsubcategoryById(subcategoryId) {
        try {
            const [rows] = await db.query('SELECT * FROM subcategory WHERE id = ?', [subcategoryId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Subcategory;
