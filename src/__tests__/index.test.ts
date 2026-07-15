import { CreditCardProcessor, PixProcessor, PaymentProcessor } from '../index';

describe('Payment Processors (OOP Paradigm)', () => {
  describe('CreditCardProcessor', () => {
    it('should process a credit card payment successfully', () => {
      const processor = new CreditCardProcessor('1234567812345678');
      expect(processor.getProviderName()).toBe('CreditCard');

      const result = processor.process(150.0);
      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('TX-CC-');
    });

    it('should fail if payment amount is invalid', () => {
      const processor = new CreditCardProcessor('1234567812345678');
      const result = processor.process(0);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Invalid payment amount');
    });
  });

  describe('PixProcessor', () => {
    it('should process a PIX payment successfully', () => {
      const processor = new PixProcessor('my-pix-key@example.com');
      expect(processor.getProviderName()).toBe('PIX');

      const result = processor.process(90.0);
      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('TX-PIX-');
    });
  });

  describe('Polymorphism', () => {
    it('should allow processing payments polymorphically', () => {
      const cart: PaymentProcessor[] = [
        new CreditCardProcessor('1234567812345678'),
        new PixProcessor('key-pix'),
      ];

      cart.forEach((processor) => {
        const result = processor.process(100);
        expect(result.success).toBe(true);
      });
    });
  });
});
