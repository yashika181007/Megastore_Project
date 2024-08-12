const db = require('../config/database');

class Addcategory {
 
        static async add(categoryData) {
            try {
                const {storeId, Name, Description, PageTitle, MetaKeywords, MetaDescription } = categoryData;
                const query = `
                    INSERT INTO category (
                     storeId ,Name, Description, PageTitle, MetaKeywords, MetaDescription
                    ) VALUES (?, ?, ?, ?, ?,?)
                `;
                const [rows] = await db.query(query, [
                    storeId ,Name, Description, PageTitle, MetaKeywords, MetaDescription
                ]);
    
                return rows;
            } catch (error) {
                console.error('Failed to add category:', error);
                throw error;
            }
        }
    
    


static async displayAll() {
    try {
        const [rows] = await db.query('SELECT * FROM category');
        return rows;
    } catch (error) {
        throw error;
    }
}
static async update(id, updatedData, storeIds) {
    try {
        const { Name, Description, PageTitle, MetaKeywords, MetaDescription } = updatedData;

        // Convert array of store IDs into a comma-separated string
        const storeIdString = storeIds.join(',');

        const [rows] = await db.query(
            'UPDATE category SET Name = ?, Description = ?, PageTitle = ?, MetaKeywords = ?, MetaDescription = ?, storeId = ? WHERE id = ?',
            [Name, Description, PageTitle, MetaKeywords, MetaDescription, storeIdString, id]
        );

        return rows;
    } catch (error) {
        throw error;
    }
}




static async delete(categoryId) {
    try {
        const [rows] = await db.query('DELETE FROM category WHERE id = ?', [categoryId]);
         return rows;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}


static async getcategoryById(categoryId) {
    try {
        const [rows] = await db.query('SELECT * FROM category WHERE id = ?', [categoryId]);
        return rows;
    } catch (error) {
        throw error;
    }
}



}

module.exports = Addcategory;
