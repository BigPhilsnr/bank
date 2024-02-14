const Queue = require('bull');
const { handleDepositEvent, handleWithdrawalEvent, startQueueWorker } = require('../../services/queueService');
const { recordTransaction } = require('../../controllers/balanceController');
const Account = require('../../models/account');

jest.mock('bull');
jest.mock('../../controllers/balanceController');
jest.mock('../../models/account');

describe('Queue Service', () => {
  describe('handleDepositEvent', () => {
    test('should add deposit transaction to the queue', async () => {
      const mockMessage = {
        value: JSON.stringify({
          type: 'deposit',
          amount: 50,
          customer_id: 1,
          account_id: 1,
        }),
      };

      await handleDepositEvent(mockMessage);

      expect(Queue.prototype.add).toHaveBeenCalledWith('process_transaction', {
        type: 'deposit',
        amount: 50,
        customer_id: 1,
        account_id: 1,
      });
    });
  });

  describe('handleWithdrawalEvent', () => {
    test('should add withdrawal transaction to the queue', async () => {
      const mockMessage = {
        value: JSON.stringify({
          type: 'withdrawal',
          amount: 30,
          customer_id: 2,
          account_id: 2,
        }),
      };

      await handleWithdrawalEvent(mockMessage);

      expect(Queue.prototype.add).toHaveBeenCalledWith('process_transaction', {
        type: 'withdrawal',
        amount: 30,
        customer_id: 2,
        account_id: 2,
      });
    });
  });

  describe('startQueueWorker', () => {
    test('should start the queue worker and process transactions', async () => {
      // Mock the isReady method of the queue
      Queue.prototype.isReady.mockResolvedValueOnce({ status: 'ready' });
  
      // Mock the process method of the queue
      Queue.prototype.process.mockImplementationOnce(async (job, jobProcessor) => {
        // Simulate processing a deposit transaction
        await jobProcessor({ data: { type: 'deposit', amount: 50, customer_id: 1, account_id: 1 } });
  
        // Simulate processing a withdrawal transaction
        await jobProcessor({ data: { type: 'withdrawal', amount: 30, customer_id: 2, account_id: 2 } });
      });
  
      // Mock the findByPk method of the Account model
      Account.findByPk.mockResolvedValueOnce({ update: jest.fn() });
  
      // Mock the recordTransaction function
      recordTransaction.mockImplementationOnce(async (type, amount, customer_id, account_id) => {
        // Simulate recording the transaction
        console.log(`Recording ${type} transaction: ${amount} from customer ${customer_id} for account ${account_id}`);
      });
  
      // Call startQueueWorker
      await startQueueWorker();
  
      // Assert that the queue methods were called as expected
      expect(Queue.prototype.isReady).toHaveBeenCalled();
      expect(Queue.prototype.process).toHaveBeenCalled();
      expect(Account.findByPk).toHaveBeenCalledTimes(1);
      expect(recordTransaction).toHaveBeenCalledTimes(1);
    });
  });
  
});
