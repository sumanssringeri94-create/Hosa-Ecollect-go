const { test, describe } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');

// Set test environment configuration
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-super-secure-32chars';
process.env.USE_LOCAL_DB = 'true';
process.env.SEED_DEMO = 'true';

const { forgotPassword, resetPassword } = require('../controllers/authController');
const User = require('../models/User');

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

describe('Password Reset Security Integration Tests', () => {
  test('1. Reset without a token fails with 400', async () => {
    const req = {
      body: { password: 'NewPassword123!' },
      query: {},
    };
    const res = createMockRes();

    await resetPassword(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Invalid or expired password reset token.');
  });

  test('2. Reset with a wrong/invalid token fails with generic 400', async () => {
    const req = {
      body: {
        token: 'wrong-nonexistent-token-value-1234567890',
        password: 'NewPassword123!',
      },
      query: {},
    };
    const res = createMockRes();

    await resetPassword(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Invalid or expired password reset token.');
  });

  test('3. Reset with an expired token fails with generic 400', async () => {
    // Generate expired token directly on user
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');

    const testUser = await User.findOne({ email: 'priya@example.com' });
    assert.ok(testUser, 'Seed user priya@example.com should exist');
    testUser.resetPasswordToken = expiredHash;
    testUser.resetPasswordExpire = new Date(Date.now() - 3600000); // 1 hour in the past
    await testUser.save();

    const req = {
      body: {
        token: expiredRawToken,
        password: 'NewPassword123!',
      },
      query: {},
    };
    const res = createMockRes();

    await resetPassword(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Invalid or expired password reset token.');
  });

  test('4. Reset with valid token succeeds once and fails when reused (single-use)', async () => {
    // Step A: Request password reset
    const forgotReq = {
      body: { email: 'priya@example.com' },
    };
    const forgotRes = createMockRes();

    await forgotPassword(forgotReq, forgotRes);

    assert.strictEqual(forgotRes.statusCode, 200);
    assert.strictEqual(forgotRes.body.success, true);
    assert.ok(
      forgotRes.body.resetToken,
      'Raw reset token should be returned in non-production environment'
    );

    const validToken = forgotRes.body.resetToken;

    // Step B: First reset attempt with valid token -> MUST succeed
    const firstReq = {
      body: {
        token: validToken,
        password: 'NewSecurePassword123!',
      },
      query: {},
    };
    const firstRes = createMockRes();

    await resetPassword(firstReq, firstRes);

    assert.strictEqual(firstRes.statusCode, 200);
    assert.strictEqual(firstRes.body.success, true);
    assert.strictEqual(
      firstRes.body.message,
      'Password reset successfully. You can now login with your new password.'
    );

    // Step C: Second reset attempt using identical token -> MUST fail with generic 400
    const secondReq = {
      body: {
        token: validToken,
        password: 'AnotherPassword456!',
      },
      query: {},
    };
    const secondRes = createMockRes();

    await resetPassword(secondReq, secondRes);

    assert.strictEqual(secondRes.statusCode, 400);
    assert.strictEqual(secondRes.body.success, false);
    assert.strictEqual(secondRes.body.message, 'Invalid or expired password reset token.');
  });
});
