const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/connect_DB');
const crypto = require('crypto');

const {
  recordFailedLogin,
  clearLoginAttempts
} = require('../middlewares/rateLimiter');
const { ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { success, created, badRequest, unauthorized, serverError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Register a new employee (data_entry or verifier)
 */
exports.register = async (req, res) => {
  try {
    const { id, name, last_name, role, password } = req.body;

    logger.debug('Register request:', { id, name, last_name, role });

    if (!id || !name || !last_name || !role || !password) {
      return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
    }

    if (!Object.values(ROLES).includes(role)) {
      return badRequest(res, ERROR_MESSAGES.INVALID_ROLE);
    }

    const checkQuery = 'SELECT * FROM employees WHERE id = ? OR name = ?';
    db.query(checkQuery, [id, name], async (err, results) => {
      if (err) {
        logger.error('Error checking employee:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length > 0) {
        return badRequest(res, ERROR_MESSAGES.ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO employees (id, name, last_name, role, password) VALUES (?, ?, ?, ?, ?)';

      db.query(insertQuery, [id, name, last_name, role, hashedPassword], (err, result) => {
        if (err) {
          logger.error('Error registering employee:', err);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }
        return created(res, SUCCESS_MESSAGES.EMPLOYEE_REGISTERED, {
          employee: { id, name, last_name, role }
        });
      });
    });
  } catch (err) {
    logger.error('Error during registration:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return badRequest(res, 'Please provide employee ID and password');
    }

    if (!process.env.SECRET) {
      logger.error('JWT secret is not defined');
      return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
    }

    const loginQuery = 'SELECT * FROM employees WHERE id = ?';

    db.query(loginQuery, [id], async (err, results) => {
      if (err) {
        logger.error('Error during login:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      if (results.length === 0) {
        recordFailedLogin(req.loginKey);
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const employee = results[0];
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        recordFailedLogin(req.loginKey);
        logger.warn('Failed login attempt for employee:', { id });
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // ✅ ກວດວ່າມີຄົນ login ຄ້າງຢູ່ບໍ່ (ແລະ ຍັງບໍ່ໝົດອາຍຸ)
      const now = new Date();
      if (
        employee.session_id &&
        employee.session_expires_at &&
        new Date(employee.session_expires_at) > now
      ) {
        logger.warn('Login rejected - account already active:', { id });
        return badRequest(
          res,
          'ບັນຊີນີ້ກຳລັງຖືກນຳໃຊ້ຢູ່ອຸປະກອນອື່ນ ກະລຸນາອອກຈາກລະບົບກ່ອນ ຈຶ່ງຈະສາມາດເຂົ້າສູ່ລະບົບໄດ້'
        );
      }

      clearLoginAttempts(req.loginKey);

      try {
        const sessionId = crypto.randomUUID();
        const expiresInMs = 2 * 60 * 1000; // 2 ນາທີ
        const sessionExpiresAt = new Date(Date.now() + expiresInMs);

        db.query(
          'UPDATE employees SET session_id = ?, session_expires_at = ? WHERE id = ?',
          [sessionId, sessionExpiresAt, employee.id],
          (updateErr) => {
            if (updateErr) {
              logger.error('Error updating session_id:', updateErr);
              return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
            }

            const token = jwt.sign(
              {
                id: employee.id,
                name: employee.name,
                role: employee.role,
                sessionId
              },
              process.env.SECRET,
              { expiresIn: '5h' }
            );

            logger.info('Employee logged in successfully:', { id: employee.id });

            return success(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
              token,
              employee: {
                id: employee.id,
                name: employee.name,
                last_name: employee.last_name,
                role: employee.role
              }
            });
          }
        );
      } catch (jwtErr) {
        logger.error('Error signing JWT:', jwtErr);
        return serverError(res, 'Error generating token');
      }
    });
  } catch (err) {
    logger.error('Error during login:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * ✅ Logout - ລ້າງ session ອອກຈາກ DB ເພື່ອໃຫ້ຄົນອື່ນ login ໄດ້
 */
exports.logout = (req, res) => {
  try {
    const { id } = req.user;
    db.query(
      'UPDATE employees SET session_id = NULL, session_expires_at = NULL WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          logger.error('Error during logout:', err);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }
        return success(res, 'Logout successful');
      }
    );
  } catch (err) {
    logger.error('Error during logout:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * ✅ Heartbeat - ຍືດອາຍຸ session ອອກໄປ ຂະນະ user ຍັງເປີດແທັບຄ້າງຢູ່
 */
exports.heartbeat = (req, res) => {
  try {
    const { id, sessionId } = req.user;

    // ຍືດ session ອອກໄປອີກ 2 ນາທີ ນັບຈາກຕອນນີ້
    const newExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    db.query(
      'UPDATE employees SET session_expires_at = ? WHERE id = ? AND session_id = ?',
      [newExpiresAt, id, sessionId],
      (err, result) => {
        if (err) {
          logger.error('Error during heartbeat:', err);
          return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
        }
        // ✅ ຖ້າ session_id ບໍ່ກົງກັນ (ຖືກແທນທີ່ໄປແລ້ວ) affectedRows ຈະເປັນ 0
        if (result.affectedRows === 0) {
          return unauthorized(res, 'Session expired or replaced');
        }
        return res.status(200).json({ message: 'Heartbeat ok' });
      }
    );
  } catch (err) {
    logger.error('Error during heartbeat:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * ✅ Verify password only - ໃຊ້ສຳລັບ re-auth (ເຊັ່ນ popup ຢືນຢັນຕົວຕົນ)
 * ບໍ່ສ້າງ token ໃໝ່, ບໍ່ແຕະ session_id - ພຽງແຕ່ກວດວ່າ id/password ຖືກຕ້ອງ ແລະ role ກົງກັນ
 */
exports.verifyReceiverPassword = async (req, res) => {
  try {
    const { id, password, requiredRole } = req.body;

    if (!id || !password) {
      return badRequest(res, 'Please provide employee ID and password');
    }

    const query = 'SELECT * FROM employees WHERE id = ?';
    db.query(query, [id], async (err, results) => {
      if (err) {
        logger.error('Error during verifyPassword:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0) {
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const employee = results[0];
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // ✅ ຖ້າມີການລະບຸ role ທີ່ຕ້ອງການ ໃຫ້ກວດເພີ່ມ
      if (requiredRole && employee.role !== requiredRole) {
        return badRequest(res, `ໜ້ານີ້ສຳລັບ ${requiredRole} ເທົ່ານັ້ນ`);
      }

      return success(res, 'Verified', {
        employee: {
          id: employee.id,
          name: employee.name,
          last_name: employee.last_name,
          role: employee.role,
        },
      });
    });
  } catch (err) {
    logger.error('Error during verifyPassword:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};
/**
 * Login employee
 */
// exports.login = async (req, res) => {
//   try {
//     const { id, password } = req.body;

//     logger.debug('Login request:', { id });

//     if (!id || !password) {
//       return badRequest(res, 'Please provide employee ID and password');
//     }

//     if (!process.env.SECRET) {
//       logger.error('JWT secret is not defined');
//       return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
//     }

//     const loginQuery = 'SELECT * FROM employees WHERE id = ?';

//     db.query(loginQuery, [id], async (err, results) => {

//       if (err) {
//         logger.error('Error during login:', err);
//         return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
//       }

//       // ❌ ບໍ່ພົບ user
//       if (results.length === 0) {

//         recordFailedLogin(req.loginKey);

//         return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
//       }

//       const employee = results[0];

//       const isMatch = await bcrypt.compare(
//         password,
//         employee.password
//       );

//       // ❌ password ຜິດ
//       if (!isMatch) {

//         recordFailedLogin(req.loginKey);

//         logger.warn('Failed login attempt for employee:', { id });

//         return badRequest(
//           res,
//           ERROR_MESSAGES.INVALID_CREDENTIALS
//         );
//       }

//       // ✅ login ສຳເລັດ => reset
//       clearLoginAttempts(req.loginKey);

//       try {

//         const token = jwt.sign(
//           {
//             id: employee.id,
//             name: employee.name,
//             role: employee.role
//           },
//           process.env.SECRET,
//           { expiresIn: '5h' }
//         );

//         logger.info(
//           'Employee logged in successfully:',
//           { id: employee.id }
//         );

//         return success(
//           res,
//           SUCCESS_MESSAGES.LOGIN_SUCCESS,
//           {
//             token,
//             employee: {
//               id: employee.id,
//               name: employee.name,
//               last_name: employee.last_name,
//               role: employee.role
//             }
//           }
//         );

//       } catch (jwtErr) {

//         logger.error('Error signing JWT:', jwtErr);

//         return serverError(
//           res,
//           'Error generating token'
//         );
//       }

//     });

//   } catch (err) {

//     logger.error('Error during login:', err);

//     return serverError(
//       res,
//       ERROR_MESSAGES.SERVER_ERROR
//     );
//   }
// };

/**
 * Get current authenticated user
 */
exports.currentUser = (req, res) => {
  try {
    const { id } = req.user;
    const query = 'SELECT id, name, last_name, email, role FROM employees WHERE id = ?';

    db.query(query, [id], (err, results) => {
      if (err) {
        logger.error('Error retrieving current user:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0) {
        return notFound(res, ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
      }

      const employee = results[0];
      return success(res, SUCCESS_MESSAGES.CURRENT_USER_FETCHED, {
        employee: {
          id: employee.id,
          name: employee.name,
          last_name: employee.last_name,
          email: employee.email,
          role: employee.role
        }
      });
    });
  } catch (err) {
    logger.error('Error retrieving current user:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};