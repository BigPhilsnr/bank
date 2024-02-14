const validationService = require('../../services/validationService');
const Account = require('../../models/account');

jest.mock('../../models/account');

describe('Validation Service', () => {
  describe('validateDeposit', () => {
    it('should return invalid if customer_id or account_id is null', async () => {
      const result = await validationService.validateDeposit(100, null, 'account123');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Both customer and account parameters are required for deposit');
    });

    it('should return invalid if amount is null or <= 0', async () => {
      const result = await validationService.validateDeposit(0, 'customer123', 'account123');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Invalid deposit amount');
    });

    it('should return invalid if account is not found', async () => {
      Account.findOne.mockResolvedValue(null);
      const result = await validationService.validateDeposit(100, 'customer123', 'account123');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Account not found for the given customer and account');
    });

    it('should return valid if all conditions are met', async () => {
      Account.findOne.mockResolvedValue({ id: 'account123', customer_id: 'customer123' });
      const result = await validationService.validateDeposit(100, 'customer123', 'account123');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });
  });

  describe('validateWithdrawal', () => {
    it('should return invalid if customer_id or account_id is null', async () => {
      const result = await validationService.validateWithdrawal(100, null, 'account123', 500);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Both customer and account parameters are required for withdrawal');
    });

    it('should return invalid if amount is null or <= 0', async () => {
      const result = await validationService.validateWithdrawal(0, 'customer123', 'account123', 500);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Invalid withdrawal amount');
    });

    it('should return invalid if amount > current_balance', async () => {
      const result = await validationService.validateWithdrawal(600, 'customer123', 'account123', 500);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Insufficient funds');
    });

    it('should return invalid if account is not found', async () => {
      Account.findOne.mockResolvedValue(null);
      const result = await validationService.validateWithdrawal(100, 'customer123', 'account123', 500);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Account not found for the given customer and account');
    });

    it('should return valid if all conditions are met', async () => {
      Account.findOne.mockResolvedValue({ id: 'account123', customer_id: 'customer123' });
      const result = await validationService.validateWithdrawal(100, 'customer123', 'account123', 500);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });
  });
});
