import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaginaLogin extends BasePage {
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly botaoLogin: Locator;

  constructor(page: Page) {
    super(page);
    this.inputUsername = page.locator('input[type="text"][name="username"]');
    this.inputPassword = page.locator('input[type="password"][name="password"]');
    this.botaoLogin = page.locator('input[type="submit"][value="Log In"]');
  }

  async navegar(): Promise<void> {
    await this.page.goto('/parabank/index.htm');

    const mensagem = await this.obterMensagem();
    if (!mensagem.includes('Customer Login')) {
      await this.fazerLogout();
    }
  }

  async preencherLogin(username: string, password: string): Promise<void> {
    await this.inputUsername.fill(username);
    await this.inputPassword.fill(password);
  }

  async submeter(): Promise<void> {
    await this.botaoLogin.click();
  }

  async fazerLogin(username: string, password: string): Promise<void> {
    await this.preencherLogin(username, password);
    await this.submeter();
  }

  async verificarLoginComSucesso(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const mensagem = await this.obterMensagem();
    return mensagem.includes('Accounts Overview');
  }

  async verificarErroLogin(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const mensagem = await this.obterMensagem();
    return (
      mensagem.includes('The username and password could not be verified.') ||
      mensagem.includes('An internal error has occurred')
    );
  }

  async verificarAindaNoLogin(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const mensagem = await this.obterMensagem();
    return (
      mensagem.includes('Customer Login') ||
      mensagem.includes('Please enter a username and password.') ||
      !mensagem.includes('Accounts Overview')
    );
  }

  async fazerLoginComSenhaIncorreta(
    username: string,
    senhaCorreta: string,
    gerarSenhaAleatoria: () => string
  ): Promise<void> {
    let senhaIncorreta = gerarSenhaAleatoria();
    while (senhaIncorreta === senhaCorreta) {
      senhaIncorreta = gerarSenhaAleatoria();
    }
    await this.fazerLogin(username, senhaIncorreta);
  }

  async fazerLoginComUsuarioInexistente(
    gerarUsernameAleatorio: () => string,
    gerarSenhaAleatoria: () => string
  ): Promise<void> {
    const usernameInexistente = gerarUsernameAleatorio();
    const senhaAleatoria = gerarSenhaAleatoria();
    await this.fazerLogin(usernameInexistente, senhaAleatoria);
  }
}
