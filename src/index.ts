/**
 * Interface que define o resultado de uma transação de pagamento.
 */
export interface IPaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

/**
 * Classe abstrata base para processadores de pagamento.
 */
export abstract class PaymentProcessor {
  /**
   * Construtor do processador.
   * @param providerName Nome do provedor de pagamento.
   */
  protected constructor(protected readonly providerName: string) {}

  /**
   * Retorna o nome do provedor configurado.
   * @returns O nome do provedor.
   */
  public getProviderName(): string {
    return this.providerName;
  }

  /**
   * Método abstrato polimórfico para processar um pagamento.
   * @param amount Valor a ser processado.
   * @returns Resultado do processamento do pagamento.
   */
  public abstract process(amount: number): IPaymentResult;
}

/**
 * Processador de pagamentos via Cartão de Crédito.
 */
export class CreditCardProcessor extends PaymentProcessor {
  private readonly cardNumber: string;

  /**
   * Inicializa o processador de cartão de crédito.
   * @param cardNumber Número do cartão de crédito.
   */
  constructor(cardNumber: string) {
    super('CreditCard');
    this.cardNumber = cardNumber;
  }

  /**
   * Mascara o número do cartão para exibição segura.
   * @returns Número do cartão mascarado.
   */
  private maskCardNumber(): string {
    return `****-****-****-${this.cardNumber.slice(-4)}`;
  }

  /**
   * Processa o pagamento via cartão de crédito.
   * @param amount Valor do pagamento.
   * @returns O resultado da transação.
   */
  public process(amount: number): IPaymentResult {
    if (amount <= 0) {
      return { success: false, errorMessage: 'Invalid payment amount' };
    }

    return {
      success: true,
      transactionId: `TX-CC-${Math.floor(Math.random() * 1000000)}`,
    };
  }
}

/**
 * Processador de pagamentos via PIX.
 */
export class PixProcessor extends PaymentProcessor {
  private readonly pixKey: string;

  /**
   * Inicializa o processador de PIX.
   * @param pixKey Chave PIX do recebedor.
   */
  constructor(pixKey: string) {
    super('PIX');
    this.pixKey = pixKey;
  }

  /**
   * Processa o pagamento via PIX.
   * @param amount Valor do pagamento.
   * @returns O resultado da transação.
   */
  public process(amount: number): IPaymentResult {
    if (amount <= 0) {
      return { success: false, errorMessage: 'Invalid payment amount' };
    }

    return {
      success: true,
      transactionId: `TX-PIX-${Math.floor(Math.random() * 1000000)}`,
    };
  }
}
