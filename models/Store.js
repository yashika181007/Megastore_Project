const db = require('../config/database');
class AddStore {
    static async add(storeData) {
        try {
            const { store_name, domain_name } = storeData;
            const query = `
                INSERT INTO stores (store_name, domain_name) VALUES (?, ?)
            `;
            const [rows] = await db.query(query, [store_name, domain_name]);
            return rows;
        } catch (error) {
            console.error('Failed to add Store:', error);
            throw error;
        }
    }

    static async isExists({ store_name, domain_name }) {
        try {
            const [storeRows] = await db.query(
                'SELECT * FROM stores WHERE store_name = ?',
                [store_name]
            );
            const [domainRows] = await db.query(
                'SELECT * FROM stores WHERE domain_name = ?',
                [domain_name]
            );

            if (storeRows.length > 0 && domainRows.length > 0) {
                return 'Both store name and domain exist';
            } else if (storeRows.length > 0) {
                return 'Store name exists';
            } else if (domainRows.length > 0) {
                return 'Domain exists';
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error checking store/domain existence:', error);
            throw error;
        }
    }

    static async displayAll() {
    try {
        const [rows] = await db.query('SELECT * FROM stores');
        return rows;
    } catch (error) {
        throw error;
    }
}

static async update(id, updatedData) {
    try {
        const { store_name, domain_name } = updatedData; 
        const [rows] = await db.query(
            'UPDATE stores SET store_name = ?, domain_name = ?, updated = CURRENT_TIMESTAMP() WHERE id = ?',
            [store_name, domain_name, id] 
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

    


    static async getStoreById(storeId) {
    try {
        const [rows] = await db.query('SELECT * FROM stores WHERE id = ?', [storeId]);
        return rows;
    } catch (error) {
        throw error;
    }
}
    static async delete (storeId) {
    try {
        const [rows] = await db.query('DELETE FROM stores WHERE id = ?', [storeId]);
        return rows;
    } catch (error) {
        console.error("Error deleting stores:", error);
        throw error;
    }
}
}
module.exports = AddStore;
