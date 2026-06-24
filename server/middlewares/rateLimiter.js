const loginAttempts = new Map();

const blockLevels = [
  2 * 60 * 1000,     // 2 ນາທີ
  5 * 60 * 1000,     // 5 ນາທີ
  10 * 60 * 1000,    // 10 ນາທີ
  30 * 60 * 1000,    // 30 ນາທີ
  60 * 60 * 1000     // 1 ຊົ່ວໂມງ
];

const loginLimiter = (req, res, next) => {

  const id = req.body.id || 'unknown';

  const key = `${req.ip}-${id}`;

  let current = loginAttempts.get(key);

  // ຍັງບໍ່ມີຂໍ້ມູນ
  if (!current) {

    current = {
      failedAttempts: 0,
      blockLevel: 0,
      blockUntil: 0,
      lastDelay: 0
    };

    loginAttempts.set(key, current);
  }

  // ຖ້າຍັງຖືກ block
  if (current.blockUntil > Date.now()) {

    const remainingMs =
      current.blockUntil - Date.now();

    let timeMessage;

    // ສະແດງເປັນຊົ່ວໂມງ
    if (remainingMs >= 60 * 60 * 1000) {

      const hours =
        Math.ceil(remainingMs / (60 * 60 * 1000));

      timeMessage = `${hours} ຊົ່ວໂມງ`;

    } else {

      // ສະແດງເປັນນາທີ
      const minutes =
        Math.ceil(remainingMs / (60 * 1000));

      timeMessage = `${minutes} ນາທີ`;
    }

    return res.status(429).json({
      success: false,
      message: `ຖືກລັອກ ລໍຖ້າ ${timeMessage}`
    });
  }

  req.loginKey = key;

  next();
};

const recordFailedLogin = (key) => {

  let current = loginAttempts.get(key);

  if (!current) return;

  current.failedAttempts += 1;

  // ຮອບທຳອິດຜິດໄດ້ 5 ຄັ້ງ
  const maxAttempts =
    current.blockLevel === 0 ? 5 : 1;

  // ຖ້າຜິດຄົບ
  if (current.failedAttempts >= maxAttempts) {

    let delay;

    // ໃຊ້ຄ່າໃນ array ກ່ອນ
    if (current.blockLevel < blockLevels.length) {

      delay = blockLevels[current.blockLevel];

    } else {

      // ຫຼັງຈາກ 1 ຊົ່ວໂມງ
      // ເພີ່ມ 2h, 4h, 8h...
      const extraLevel =
        current.blockLevel - blockLevels.length;

      delay =
        Math.pow(2, extraLevel + 1) *
        60 *
        60 *
        1000;
    }

    current.lastDelay = delay;

    current.blockUntil =
      Date.now() + delay;

    current.failedAttempts = 0;

    current.blockLevel += 1;

    console.log(
      `Block Level: ${current.blockLevel}`
    );
  }

  loginAttempts.set(key, current);
};

// login ສຳເລັດ => reset
const clearLoginAttempts = (key) => {

  loginAttempts.delete(key);
};

module.exports = {
  loginLimiter,
  recordFailedLogin,
  clearLoginAttempts
};