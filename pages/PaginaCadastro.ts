import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaginaCadastro extends BasePage {
  readonly inputs: Record<string, Locator>;
  readonly erros: Record<string, Locator>;
  readonly botaoRegistrar: Locator;

  constructor(page: Page) {
    super(page);

    const seletores = {
      firstName: '#customer\\.firstName',
      lastName: '#customer\\.lastName',
      address: '#customer\\.address\\.street',
      city: '#customer\\.address\\.city',
      state: '#customer\\.address\\.state',
      zipCode: '#customer\\.address\\.zipCode',
      phoneNumber: '#customer\\.phoneNumber',
      ssn: '#customer\\.ssn',
      username: '#customer\\.username',
      password: '#customer\\.password',
      repeatedPassword: '#repeatedPassword',
    };

    this.inputs = Object.fromEntries(
      Object.entries(seletores).map(([campo, seletor]) => [campo, page.locator(seletor)])
    ) as Record<string, Locator>;

    this.erros = Object.fromEntries(
      Object.entries(seletores).map(([campo, seletor]) => [
        campo,
        page.locator(`${seletor}\\.errors`),
      ])
    ) as Record<string, Locator>;

    this.botaoRegistrar = page.locator('input[type="submit"][value="Register"]');
  }

  async navegar(): Promise<void> {
    await this.page.goto('/parabank/register.htm');
  }

  async preencherFormulario(dados: Record<string, string>): Promise<void> {
    for (const [campo, valor] of Object.entries(dados)) {
      if (valor && this.inputs[campo]) {
        await this.inputs[campo].fill(valor);
      }
    }
  }

  async submeter(): Promise<void> {
    await this.botaoRegistrar.click();
  }

  async cadastrar(dados: Record<string, string>): Promise<void> {
    await this.preencherFormulario(dados);
    await this.submeter();
  }

  async obterTodosErros(): Promise<Record<string, Locator>> {
    return this.erros;
  }

  async verificarErroZipCode(): Promise<boolean> {
    return await this.erros.zipCode.isVisible().catch(() => false);
  }

  async verificarErroRepetidoPassword(): Promise<boolean> {
    const mensagem = await this.obterMensagem();
    return mensagem.includes('did not match');
  }

  async verificarErroUsernameExistente(): Promise<boolean> {
    await this.erros.username.waitFor({ state: 'visible' }).catch(() => {});
    const textoErro = await this.erros.username.textContent();
    return textoErro?.includes('username already exists') || false;
  }

  async verificarCadastroComSucesso(): Promise<boolean> {
    const mensagem = await this.obterMensagem();
    return (
      mensagem.includes('Your account was created successfully') ||
      mensagem.includes('Welcome') ||
      mensagem.includes('Accounts Overview')
    );
  }

  async verificarTodosCamposObrigatoriosVisiveis(): Promise<boolean> {
    const mensagem = await this.obterMensagem();
    return mensagem.includes('is required');
  }

  async verificarCamposObrigatoriosVisiveis(): Promise<boolean> {
    return await this.verificarTodosCamposObrigatoriosVisiveis();
  }

  async cadastrarComSenhasDiferentes(
    gerarDadosCadastro: (overrides?: Record<string, string>) => Record<string, string>,
    gerarSenhaAleatoria: () => string
  ): Promise<void> {
    const dados = gerarDadosCadastro({
      password: gerarSenhaAleatoria(),
      repeatedPassword: gerarSenhaAleatoria(),
    });
    await this.cadastrar(dados);
  }

  async cadastrarComUsernameExistente(
    dadosUsuario: Record<string, string>,
    gerarDadosCadastro: (overrides?: Record<string, string>) => Record<string, string>
  ): Promise<void> {
    await this.cadastrar(dadosUsuario);
    await this.fazerLogout().catch(() => {});
    await this.navegar();
    await this.cadastrar(gerarDadosCadastro({ username: dadosUsuario.username }));
  }

  async cadastrarComZipInvalido(
    zipInvalido: string,
    gerarDadosCadastro: (
      overrides?: Record<string, string>,
      testId?: string
    ) => Record<string, string>,
    testId?: string
  ): Promise<void> {
    const dadosUsuario = gerarDadosCadastro({ zipCode: zipInvalido }, testId);
    await this.cadastrar(dadosUsuario);
  }
}
