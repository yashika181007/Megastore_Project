const db = require('../config/database');
class BlogPost {
    static async add(blogpostData) {
        try {
            const {  storeId,blogcatId, title, description, tags,blogimages,videoEmbedCode} = blogpostData;
            const query = `
                    INSERT INTO blogpost (
                        storeId,blogcatId, title, description, tags,blogimages,videoEmbedCode 
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
            console.log('Executing query:', query);  // Log the query string
            console.log('With values:', [ storeId,blogcatId, title, description, tags,blogimages,videoEmbedCode]);  // Log the values
            const [rows] = await db.query(query, [
                storeId,blogcatId, title, description, tags,blogimages,videoEmbedCode
            ]);
            return rows;
        } catch (error) {
            console.error('Failed to add category:', error);
            throw error;
        }
    }
    static async displayAll() {
        try {
            const [rows] = await db.query('SELECT * FROM BlogPost');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async delete(blogpostId) {
        try {
            const [rows] = await db.query('DELETE FROM BlogPost WHERE id = ?', [blogpostId]);
            return rows;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
   
    static async update(id, blogpostData, storeIds, blogcatIds) {
        try {
            const { title, description, tags, videoEmbedCode, blogimages } = blogpostData;
            const storeIdString = storeIds.join(',');
            const blogcatIdString = blogcatIds.join(',');
            let tagsArray = tags;
            if (typeof tags === 'string') {
                tagsArray = tags.split(',').map(tag => tag.trim());
            }
    
            let queryString = 'UPDATE BlogPost SET ';
            const queryParams = [];
    
            if (blogimages !== undefined) {
                queryString += 'blogimages = ?, ';
                queryParams.push(blogimages);
            }
            if (videoEmbedCode !== undefined) {
                queryString += 'videoEmbedCode = ?, ';
                queryParams.push(videoEmbedCode);
            }
            if (tagsArray !== undefined) {
                queryString += 'tags = ?, ';
                queryParams.push(tagsArray.join(','));
            }
            if (description !== undefined) {
                queryString += 'description = ?, ';
                queryParams.push(description);
            }
            if (title !== undefined) {
                queryString += 'title = ?, ';
                queryParams.push(title);
            }
    
            queryString += 'blogcatId = ?, storeId = ? WHERE id = ?';
            queryParams.push(blogcatIdString, storeIdString, id);
    
            console.log("SQL Query:", queryString);
            console.log("Query Parameters:", queryParams);
    
            const [rows] = await db.query(queryString, queryParams);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    
    
    static async getcategoryById(blogpostId) {
        try {
            const [rows] = await db.query('SELECT * FROM BlogPost WHERE id = ?', [blogpostId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = BlogPost;
