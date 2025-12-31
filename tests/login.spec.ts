import { test, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin';
import { PaginaCadastro } from '../pages/PaginaCadastro';
import {
  gerarDadosCadastro,
  gerarSenhaAleatoria,
  gerarUsernameAleatorio,
} from '../utils/geradorDadosTeste';

test.describe('Login - ParaBank', () => {
  let paginaLogin: PaginaLogin;
  let paginaCadastro: PaginaCadastro;

  test.beforeEach(async ({ page }) => {
    paginaLogin = new PaginaLogin(page);
    paginaCadastro = new PaginaCadastro(page);
    await paginaLogin.navegar();
  });

  test('CT-01 - Deve fazer login com sucesso', async () => {
    await paginaCadastro.navegar();
    const dadosUsuario = gerarDadosCadastro();
    await paginaCadastro.cadastrar(dadosUsuario);
    await paginaCadastro.fazerLogout();
    await paginaLogin.navegar();
    await paginaLogin.fazerLogin(dadosUsuario.username, dadosUsuario.password);
    expect(await paginaLogin.verificarLoginComSucesso()).toBe(true);
  });

  test('CT-02 - Deve validar mensagem/estado de erro ao informar senha incorreta', async () => {
    await paginaCadastro.navegar();
    const dadosUsuario = gerarDadosCadastro();
    await paginaCadastro.cadastrar(dadosUsuario);
    await paginaCadastro.fazerLogout();
    await paginaLogin.navegar();
    await paginaLogin.fazerLoginComSenhaIncorreta(
      dadosUsuario.username,
      dadosUsuario.password,
      gerarSenhaAleatoria
    );
    expect(await paginaLogin.verificarErroLogin()).toBe(true);
  });

  test('CT-03 - Deve validar mensagem/estado de erro ao informar usuário inexistente', async () => {
    await paginaLogin.navegar();
    await paginaLogin.fazerLoginComUsuarioInexistente(gerarUsernameAleatorio, gerarSenhaAleatoria);
    expect(await paginaLogin.verificarErroLogin()).toBe(true);
  });

  test('CT-04 - Deve validar comportamento ao tentar logar sem preencher e validar comportamento', async () => {
    await paginaLogin.submeter();
    expect(await paginaLogin.verificarAindaNoLogin()).toBe(true);
  });
});
