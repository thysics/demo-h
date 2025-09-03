const { openDatabase } = require('../config/database');

class Project {
  /**
   * Create a new project
   * @param {Object} projectData - Project data (name, description, user_id)
   * @returns {Promise} - Resolves with the created project ID
   */
  static async create(projectData) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        const { name, description, user_id } = projectData;
        
        db.run(
          `INSERT INTO projects (name, description, user_id) 
           VALUES (?, ?, ?)`,
          [name, description, user_id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
        
        db.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Find a project by its ID
   * @param {number} id - Project ID
   * @param {number} userId - User ID (for security)
   * @returns {Promise} - Resolves with the project object or null if not found
   */
  static findById(id, userId) {
    return new Promise((resolve, reject) => {
      const db = openDatabase();
      
      db.get(
        `SELECT * FROM projects WHERE id = ? AND user_id = ?`,
        [id, userId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
          db.close();
        }
      );
    });
  }

  /**
   * Find all projects for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Resolves with an array of projects
   */
  static findByUser(userId) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        db.all(
          `SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC`,
          [userId],
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows || []);
            }
            db.close();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update a project
   * @param {number} id - Project ID
   * @param {number} userId - User ID (for security)
   * @param {Object} projectData - Updated project data
   * @returns {Promise} - Resolves with boolean indicating success
   */
  static async update(id, userId, projectData) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        // Build update query dynamically based on provided fields
        const updateFields = [];
        const params = [];
        
        if (projectData.name !== undefined) {
          updateFields.push('name = ?');
          params.push(projectData.name);
        }
        
        if (projectData.description !== undefined) {
          updateFields.push('description = ?');
          params.push(projectData.description);
        }
        
        // Add updated_at timestamp
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        
        // Add project ID and user ID to params
        params.push(id, userId);
        
        const query = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
        
        db.run(query, params, function(err) {
          if (err) {
            reject(err);
          } else {
            // Check if a row was actually updated
            resolve(this.changes > 0);
          }
          db.close();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete a project
   * @param {number} id - Project ID
   * @param {number} userId - User ID (for security)
   * @returns {Promise} - Resolves with boolean indicating success
   */
  static async delete(id, userId) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        db.run(
          `DELETE FROM projects WHERE id = ? AND user_id = ?`,
          [id, userId],
          function(err) {
            if (err) {
              reject(err);
            } else {
              // Check if a row was actually deleted
              resolve(this.changes > 0);
            }
            db.close();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get tasks for a specific project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID (for security)
   * @returns {Promise} - Resolves with an array of tasks
   */
  static async getTasks(projectId, userId) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        db.all(
          `SELECT * FROM tasks WHERE project_id = ? AND user_id = ? ORDER BY due_date ASC, created_at DESC`,
          [projectId, userId],
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows || []);
            }
            db.close();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = Project;