import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaginaContas extends BasePage {
  readonly selectTipoConta: Locator;
  readonly selectContaOrigem: Locator;
  readonly botaoAbrirConta: Locator;
  readonly resultadoAbertura: Locator;
  readonly novoAccountId: Locator;

  constructor(page: Page) {
    super(page);
    this.selectTipoConta = page.locator('select#type');
    this.selectContaOrigem = page.locator('select#fromAccountId');
    this.botaoAbrirConta = page.locator('input.button[value="Open New Account"]');
    this.resultadoAbertura = page.locator('#openAccountResult');
    this.novoAccountId = page.locator('#newAccountId');
  }

  async navegar(): Promise<void> {
    await this.page.goto('/parabank/openaccount.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async selecionarTipoConta(tipo: 'CHECKING' | 'SAVINGS'): Promise<void> {
    const valor = tipo === 'CHECKING' ? '0' : '1';
    await this.selectTipoConta.selectOption(valor);
  }

  async selecionarContaOrigem(accountId: string): Promise<void> {
    await this.selectContaOrigem.selectOption(accountId);
  }

  async abrirConta(tipo: 'CHECKING' | 'SAVINGS', accountIdOrigem?: string): Promise<void> {
    await this.selecionarTipoConta(tipo);
    if (accountIdOrigem) {
      await this.selecionarContaOrigem(accountIdOrigem);
    }
    await this.botaoAbrirConta.click();
    await this.page.waitForLoadState('networkidle');
  }

  async obterAccountIds(): Promise<string[]> {
    await this.page.waitForLoadState('networkidle');

    const ids: string[] = [];

    const links = await this.page.locator('table tbody a[href*="activity.htm"]').all();

    for (const link of links) {
      try {
        const textoLink = await link.textContent();
        if (textoLink && textoLink.trim().match(/^\d+$/)) {
          ids.push(textoLink.trim());
        }
        const href = await link.getAttribute('href');
        if (href) {
          const match = href.match(/[?&]id=(\d+)/);
          if (match && match[1]) {
            ids.push(match[1]);
          }
        }
      } catch {}
    }

    return [...new Set(ids.filter((id) => id.length > 0))];
  }

  async obterNovoAccountId(): Promise<string> {
    await this.resultadoAbertura.waitFor({ state: 'visible' });
    const textoCompleto = await this.resultadoAbertura.textContent();
    if (textoCompleto) {
      const match = textoCompleto.match(/Your new account number:\s*(\d+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    const accountId = await this.novoAccountId.textContent();
    return accountId?.trim() || '';
  }

  async obterPrimeiraContaDisponivel(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    const opcoes = this.selectContaOrigem.locator('option');
    const count = await opcoes.count();

    if (count <= 1) {
      throw new Error('Nenhuma conta disponível encontrada');
    }

    for (let i = 1; i < count; i++) {
      const opcao = opcoes.nth(i);
      const value = await opcao.getAttribute('value');

      if (value && value.trim() !== '' && value.trim() !== '-1' && value.trim() !== '0') {
        const numValue = parseInt(value.trim(), 10);
        if (!isNaN(numValue) && numValue > 0) {
          return value.trim();
        }
      }
    }

    throw new Error('Nenhuma conta disponível encontrada');
  }

  async navegarParaOverview(): Promise<void> {
    await this.page.goto('/parabank/overview.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async verificarAccountIdsExistem(): Promise<boolean> {
    const accountIds = await this.obterAccountIds();
    const temIds = accountIds.length > 0;
    const mensagem = await this.obterMensagem();
    const temAccount = mensagem.includes('Account');
    return temIds || temAccount;
  }
}
