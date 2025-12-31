import { test, expect } from '@playwright/test';
import { PaginaContas } from '../pages/PaginaContas';
import { PaginaCadastro } from '../pages/PaginaCadastro';
import { gerarDadosCadastro } from '../utils/geradorDadosTeste';

test.describe('Contas - ParaBank', () => {
  let paginaContas: PaginaContas;
  let paginaCadastro: PaginaCadastro;
  let dadosUsuario: Record<string, string>;

  test.beforeEach(async ({ page }) => {
    paginaContas = new PaginaContas(page);
    paginaCadastro = new PaginaCadastro(page);

    if (!dadosUsuario) {
      await paginaCadastro.navegar();
      dadosUsuario = gerarDadosCadastro();
      await paginaCadastro.cadastrar(dadosUsuario);
    }

    await paginaContas.navegar();
  });

  test('CT-01 - Deve abrir conta Savings e validar ID', async () => {
    await paginaContas.abrirConta('SAVINGS');
    const novoAccountId = await paginaContas.obterNovoAccountId();
    expect(novoAccountId).toBeTruthy();
  });

  test('CT-02 - Deve abrir conta Checking e validar ID', async () => {
    await paginaContas.abrirConta('CHECKING');
    const novoAccountId = await paginaContas.obterNovoAccountId();
    expect(novoAccountId).toBeTruthy();
  });

  test('CT-03 - Deve validar IDs na página Account Overview', async () => {
    await paginaContas.navegarParaOverview();
    expect(await paginaContas.verificarAccountIdsExistem()).toBe(true);
  });
});
