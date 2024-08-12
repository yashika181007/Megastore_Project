const db = require('../config/database');
class Sub_Subcategory {
    static async add(Sub_SubcategoryData) {
        const {
            storeId, catId,	subcatId, Sub_SubCatName, Sub_SubCatDescription,
            Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription
        } = Sub_SubcategoryData;
        const query = `
            INSERT INTO sub_subcategory (
                storeId, catId,subcatId, Sub_SubCatName, Sub_SubCatDescription, Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription
            ) VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;
        const values = [storeId, catId,subcatId, Sub_SubCatName, Sub_SubCatDescription, Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription];
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
            const [rows] = await db.query('SELECT * FROM sub_subcategory');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async delete(Sub_SubcategoryId) {
        try {
            const [rows] = await db.query('DELETE FROM sub_subcategory WHERE id = ?', [Sub_SubcategoryId]);
             return rows;
        } catch (error) {
            console.error("Error deleting Sub_Sub category:", error);
            throw error;
        }
    }
    static async update(id, updatedData, storeIds, catIds, subcatIds) {
        try {
            const {
                Sub_SubCatName,
                Sub_SubCatDescription,
                Sub_SubCatPageTitle,
                Sub_SubCatMetaKeywords,
                Sub_SubCatMetaDescription
            } = updatedData;
    
            // Convert arrays to comma-separated strings if they are arrays
            const storeId = Array.isArray(storeIds) ? storeIds.join(',') : storeIds;
            const catId = Array.isArray(catIds) ? catIds.join(',') : catIds;
            const subcatId = Array.isArray(subcatIds) ? subcatIds.join(',') : subcatIds;
    
            const [rows] = await db.query(
                `UPDATE sub_subcategory 
                 SET storeId = ?, catId = ?, subcatId = ?, Sub_SubCatName = ?, 
                     Sub_SubCatDescription = ?, Sub_SubCatPageTitle = ?, 
                     Sub_SubCatMetaKeywords = ?, Sub_SubCatMetaDescription = ? 
                 WHERE id = ?`,
                [storeId, catId, subcatId, Sub_SubCatName, Sub_SubCatDescription, Sub_SubCatPageTitle, Sub_SubCatMetaKeywords, Sub_SubCatMetaDescription, id]
            );
    
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async getsub_subcategoryById(sub_subcategory) {
        try {
            const [rows] = await db.query('SELECT * FROM sub_subcategory WHERE id = ?', [sub_subcategory]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}
    


module.exports = Sub_Subcategory;
