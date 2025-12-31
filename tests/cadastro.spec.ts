import { test, expect } from '@playwright/test';
import { PaginaCadastro } from '../pages/PaginaCadastro';
import {
  gerarDadosCadastro,
  gerarSenhaAleatoria,
  gerarZipCodesInvalidos,
} from '../utils/geradorDadosTeste';

test.describe('Cadastro de Usuário - ParaBank', () => {
  let paginaCadastro: PaginaCadastro;

  test.beforeEach(async ({ page }) => {
    paginaCadastro = new PaginaCadastro(page);
    await paginaCadastro.navegar();
  });

  test('CT-01 - Deve registrar usuário', async ({ page }, testInfo) => {
    const dadosUsuario = gerarDadosCadastro(undefined, testInfo.testId);
    await paginaCadastro.cadastrar(dadosUsuario);
    await paginaCadastro.page.waitForLoadState('networkidle');
  });

  test('CT-02 - Deve exibir validação de campos obrigatórios', async () => {
    await paginaCadastro.submeter();
    expect(await paginaCadastro.verificarTodosCamposObrigatoriosVisiveis()).toBe(true);
  });

  test('CT-03 - Deve exibir erro ao informar senha diferente da confirmação', async () => {
    await paginaCadastro.cadastrarComSenhasDiferentes(gerarDadosCadastro, gerarSenhaAleatoria);
    expect(await paginaCadastro.verificarErroRepetidoPassword()).toBe(true);
  });

  test('CT-04 - Deve exibir erro ao tentar cadastrar duas vezes com o mesmo username', async () => {
    const dadosUsuario = gerarDadosCadastro();
    await paginaCadastro.cadastrarComUsernameExistente(dadosUsuario, gerarDadosCadastro);
    expect(await paginaCadastro.verificarErroUsernameExistente()).toBe(true);
  });

  test('CT-05 - Deve validar que zip aceita qualquer valor', async ({ page }, testInfo) => {
    for (const zipInvalido of gerarZipCodesInvalidos()) {
      await paginaCadastro.navegar();
      await paginaCadastro.cadastrarComZipInvalido(
        zipInvalido,
        gerarDadosCadastro,
        testInfo.testId
      );
      expect(await paginaCadastro.verificarErroZipCode()).toBe(false);
    }
  });
});
