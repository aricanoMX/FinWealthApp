import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { JournalEntryInput } from './journal-entry.type';
import { DoubleEntryViolationException } from './exceptions/double-entry-violation.exception';

@Injectable()
export class DoubleEntryService {
  /**
   * Valida matemáticamente que la suma de los amounts en las partidas sea exactamente 0.
   * Tolerancia cero a descuadres según ADR-001.
   * Responsabilidad Única: Cálculo matemático puro de la partida doble.
   * Lanza una excepción fuerte si hay descuadre.
   */
  validateTransactionBalance(entries: JournalEntryInput[]): boolean {
    if (!entries || entries.length === 0) {
      throw new DoubleEntryViolationException('Cannot validate balance for an empty transaction.');
    }

    const total = entries.reduce((sum, entry) => {
      return sum.plus(new Decimal(entry.amount));
    }, new Decimal(0));

    if (!total.isZero()) {
      throw new DoubleEntryViolationException(`The sum of debits and credits is not zero (Difference: ${total.toString()}).`);
    }

    return true; // We can still return true for success, though throwing is the main contract
  }
}
