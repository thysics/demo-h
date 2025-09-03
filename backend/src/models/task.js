const { openDatabase } = require('../config/database');

class Task {
  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, status, priority, due_date, user_id, project_id)
   * @returns {Promise} - Resolves with the created task ID
   */
  static async create(taskData) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        const { title, description, status = 'pending', priority = 'medium', due_date = null, user_id, project_id = null } = taskData;
        
        db.run(
          `INSERT INTO tasks (title, description, status, priority, due_date, user_id, project_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, description, status, priority, due_date, user_id, project_id],
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
   * Find a task by its ID
   * @param {number} id - Task ID
   * @param {number} userId - User ID (for security)
   * @returns {Promise} - Resolves with the task object or null if not found
   */
  static findById(id, userId) {
    return new Promise((resolve, reject) => {
      const db = openDatabase();
      
      db.get(
        `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
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
   * Find all tasks for a user with optional filtering
   * @param {number} userId - User ID
   * @param {Object} filters - Optional filters (status, priority, project_id, search)
   * @returns {Promise} - Resolves with an array of tasks
   */
  static findByUser(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        let query = `SELECT * FROM tasks WHERE user_id = ?`;
        const params = [userId];
        
        // Apply filters if provided
        if (filters.status) {
          query += ` AND status = ?`;
          params.push(filters.status);
        }
        
        if (filters.priority) {
          query += ` AND priority = ?`;
          params.push(filters.priority);
        }
        
        if (filters.project_id) {
          query += ` AND project_id = ?`;
          params.push(filters.project_id);
        }
        
        if (filters.search) {
          query += ` AND (title LIKE ? OR description LIKE ?)`;
          const searchTerm = `%${filters.search}%`;
          params.push(searchTerm, searchTerm);
        }
        
        // Add sorting
        query += ` ORDER BY due_date ASC, created_at DESC`;
        
        db.all(query, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
          db.close();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {number} userId - User ID (for security)
   * @param {Object} taskData - Updated task data
   * @returns {Promise} - Resolves with boolean indicating success
   */
  static async update(id, userId, taskData) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        // Build update query dynamically based on provided fields
        const updateFields = [];
        const params = [];
        
        if (taskData.title !== undefined) {
          updateFields.push('title = ?');
          params.push(taskData.title);
        }
        
        if (taskData.description !== undefined) {
          updateFields.push('description = ?');
          params.push(taskData.description);
        }
        
        if (taskData.status !== undefined) {
          updateFields.push('status = ?');
          params.push(taskData.status);
        }
        
        if (taskData.priority !== undefined) {
          updateFields.push('priority = ?');
          params.push(taskData.priority);
        }
        
        if (taskData.due_date !== undefined) {
          updateFields.push('due_date = ?');
          params.push(taskData.due_date);
        }
        
        if (taskData.project_id !== undefined) {
          updateFields.push('project_id = ?');
          params.push(taskData.project_id);
        }
        
        // Add updated_at timestamp
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        
        // Add task ID and user ID to params
        params.push(id, userId);
        
        const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
        
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
   * Delete a task
   * @param {number} id - Task ID
   * @param {number} userId - User ID (for security)
   * @returns {Promise} - Resolves with boolean indicating success
   */
  static async delete(id, userId) {
    return new Promise((resolve, reject) => {
      try {
        const db = openDatabase();
        
        db.run(
          `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
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
}

module.exports = Task;