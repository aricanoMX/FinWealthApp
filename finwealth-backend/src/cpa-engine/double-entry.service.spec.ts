import { DoubleEntryService } from './double-entry.service';
import { DoubleEntryViolationException } from './exceptions/double-entry-violation.exception';

describe('DoubleEntryService', () => {
  let service: DoubleEntryService;

  beforeEach(() => {
    service = new DoubleEntryService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTransactionBalance', () => {
    it('should return true when debits and credits equal exactly 0', () => {
      const entries = [
        { accountId: '1', amount: '100.50' },
        { accountId: '2', amount: '-100.50' },
      ];
      expect(service.validateTransactionBalance(entries)).toBe(true);
    });

    it('should throw DoubleEntryViolationException when sum is not 0 (debits exceed credits)', () => {
      const entries = [
        { accountId: '1', amount: '100.50' },
        { accountId: '2', amount: '-100.00' },
      ];
      expect(() => service.validateTransactionBalance(entries)).toThrow(
        DoubleEntryViolationException,
      );
    });

    it('should throw DoubleEntryViolationException when sum is not 0 (credits exceed debits)', () => {
      const entries = [
        { accountId: '1', amount: '50.00' },
        { accountId: '2', amount: '-100.00' },
      ];
      expect(() => service.validateTransactionBalance(entries)).toThrow(
        DoubleEntryViolationException,
      );
    });

    it('should handle multiple entries correctly', () => {
      const entries = [
        { accountId: '1', amount: '150.00' }, // Débito
        { accountId: '2', amount: '50.00' }, // Débito
        { accountId: '3', amount: '-200.00' }, // Crédito
      ];
      expect(service.validateTransactionBalance(entries)).toBe(true);
    });

    it('should prevent floating point precision errors', () => {
      const entries = [
        { accountId: '1', amount: '0.10' },
        { accountId: '2', amount: '0.20' },
        { accountId: '3', amount: '-0.30' },
      ];
      expect(service.validateTransactionBalance(entries)).toBe(true);
    });

    it('should throw DoubleEntryViolationException if entries are empty', () => {
      expect(() => service.validateTransactionBalance([])).toThrow(
        DoubleEntryViolationException,
      );
    });
  });
});
