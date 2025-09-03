const { openDatabase } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data (username, email, password)
   * @returns {Promise} - Resolves with the created user ID
   */
  static async create(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        const db = openDatabase();
        
        db.run(
          `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
          [userData.username, userData.email, hashedPassword],
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
   * Find a user by their ID
   * @param {number} id - User ID
   * @returns {Promise} - Resolves with the user object or null if not found
   */
  static findById(id) {
    return new Promise((resolve, reject) => {
      const db = openDatabase();
      
      db.get(
        `SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?`,
        [id],
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
   * Find a user by their username
   * @param {string} username - Username
   * @returns {Promise} - Resolves with the user object or null if not found
   */
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const db = openDatabase();
      
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
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
   * Find a user by their email
   * @param {string} email - Email address
   * @returns {Promise} - Resolves with the user object or null if not found
   */
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const db = openDatabase();
      
      db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
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
   * Verify a user's password
   * @param {string} providedPassword - The password to verify
   * @param {string} storedHash - The stored password hash
   * @returns {Promise} - Resolves with boolean indicating if password is correct
   */
  static async verifyPassword(providedPassword, storedHash) {
    return await bcrypt.compare(providedPassword, storedHash);
  }
}

module.exports = User;