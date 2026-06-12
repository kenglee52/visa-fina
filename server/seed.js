/**
 * Seed Admin User
 * Creates or updates the admin user in the database
 */

const db = require('./config/connect_DB');
const bcrypt = require('bcrypt');
const { ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('./config/constants');
const logger = require('./utils/logger');

async function seedAdmin() {
  try {
    const admin = {
      id: '9',
      name: 'Admin98',
      last_name: 'System',
      email: 'admin@mdpe.la',
      role: ROLES.ADMIN,
      password: '123456'
    };

    const trimmedId = admin.id.toString().trim();
    const trimmedEmail = admin.email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    db.query(
      'SELECT id FROM employees WHERE email = ? OR id = ? LIMIT 1',
      [trimmedEmail, trimmedId],
      (err, results) => {
        if (err) {
          logger.error('Error checking admin:', err);
          process.exit(1);
        }

        if (results.length > 0) {
          // Update existing user to admin role
          db.query(
            'UPDATE employees SET role = ? WHERE id = ?',
            [ROLES.ADMIN, results[0].id],
            (err2) => {
              if (err2) {
                logger.error('Error updating admin:', err2);
                process.exit(1);
              }
              logger.info('✅ Admin already exists → role updated to ADMIN');
              process.exit(0);
            }
          );
        } else {
          // Create new admin user
          db.query(
            'INSERT INTO employees (id, name, last_name, email, role, password) VALUES (?, ?, ?, ?, ?, ?)',
            [trimmedId, admin.name, admin.last_name, trimmedEmail, ROLES.ADMIN, hashedPassword],
            (err3) => {
              if (err3) {
                logger.error('Error creating admin:', err3);
                process.exit(1);
              }
              logger.info('✅ Admin created successfully');
              process.exit(0);
            }
          );
        }
      }
    );
  } catch (e) {
    logger.error('❌ Seed admin failed:', e);
    process.exit(1);
  }
}

seedAdmin();
