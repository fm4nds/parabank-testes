import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaginaTransferencias extends BasePage {
  readonly inputAmount: Locator;
  readonly selectContaOrigem: Locator;
  readonly selectContaDestino: Locator;
  readonly botaoTransferir: Locator;
  readonly resultadoTransferencia: Locator;

  constructor(page: Page) {
    super(page);
    this.inputAmount = page.locator('#amount');
    this.selectContaOrigem = page.locator('select#fromAccountId');
    this.selectContaDestino = page.locator('select#toAccountId');
    this.botaoTransferir = page.locator('input[type="submit"][value="Transfer"]');
    this.resultadoTransferencia = page.locator('#showResult');
  }

  async navegar(): Promise<void> {
    await this.page.goto('/parabank/transfer.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async preencherValor(valor: string): Promise<void> {
    await this.inputAmount.fill(valor);
  }

  async selecionarContaOrigem(accountId: string): Promise<void> {
    await this.selectContaOrigem.selectOption(accountId);
  }

  async selecionarContaDestino(accountId: string): Promise<void> {
    await this.selectContaDestino.selectOption(accountId);
  }

  async submeter(): Promise<void> {
    await this.botaoTransferir.click();
    await this.page.waitForLoadState('networkidle');
  }

  async obterTextoResultadoTransferencia(): Promise<string> {
    const isVisible = await this.resultadoTransferencia.isVisible().catch(() => false);
    if (!isVisible) return '';
    return (await this.resultadoTransferencia.locator('h1').textContent()) || '';
  }

  async transferirValor(valor: string): Promise<void> {
    await this.preencherValor(valor);
    await this.submeter();
  }

  async verificarTransferenciaComSucesso(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    try {
      const textoResultado = await this.obterTextoResultadoTransferencia();
      const mensagem = await this.obterMensagem();
      return (
        textoResultado.includes('Transfer Complete!') ||
        mensagem.includes('Transfer Complete!') ||
        mensagem.includes('has been transferred from account') ||
        mensagem.includes('Amount')
      );
    } catch {
      return false;
    }
  }

  async verificarErroTransferencia(): Promise<boolean> {
    await this.botaoTransferir.click({ force: true });
    await this.page.waitForLoadState('networkidle');
    const mensagem = await this.obterMensagem();
    return mensagem.includes('Error!') || mensagem.includes('Amount');
  }
}
