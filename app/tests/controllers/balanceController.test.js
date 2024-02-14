const { getBalance, recordTransaction} = require('../../controllers/balanceController');
const Account = require('../../models/account');
const Transaction =  require('../../models/transaction');
jest.mock('../../models/account');
jest.mock('../../models/transaction');

describe('Balance Controller', () => {
    describe('getBalance', () => {
      test('should return correct balance', async () => {
        const mockReq = { query: { account_id: 1 } };
        const mockRes = { json: jest.fn() };
  
        Transaction.sum.mockResolvedValueOnce(100);
        Transaction.sum.mockResolvedValueOnce(50);
        Account.findByPk.mockResolvedValueOnce({ balance: 50, currency: 'USD' });
  
        await getBalance(mockReq, mockRes);
  
        expect(mockRes.json).toHaveBeenCalledWith({ balance: 50, currency: 'USD' });
      });
  
      test('should handle missing account_id', async () => {
        const mockReq = { query: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getBalance(mockReq, mockRes);
  
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Account parameter is required for balance' });
      });
    });
  
    describe('recordTransaction', () => {
      test('should record transaction and update account balance', async () => {
        const mockTransactionData = {
          type: 'deposit',
          amount: 50,
          customer_id: 1,
          account_id: 1,
        };
  
        Transaction.create.mockResolvedValueOnce({});
        Transaction.sum.mockResolvedValueOnce(100); // totalDeposits
        Transaction.sum.mockResolvedValueOnce(50); // totalWithdrawals
  
        Account.findByPk.mockResolvedValueOnce({ update: jest.fn() });
  
        await recordTransaction(mockTransactionData.type, mockTransactionData.amount, mockTransactionData.customer_id, mockTransactionData.account_id);
  
        expect(Transaction.create).toHaveBeenCalledWith({
          type: 'deposit',
          amount: 50,
          timestamp: expect.any(String),
          customer_id: 1,
          account_id: 1,
        });
  
        expect(Account.findByPk).toHaveBeenCalledWith(1);
       
      });
  
    });
  });