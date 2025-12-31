import { test, expect } from '@playwright/test';
import { PaginaTransferencias } from '../pages/PaginaTransferencias';
import { PaginaCadastro } from '../pages/PaginaCadastro';
import { gerarDadosCadastro } from '../utils/geradorDadosTeste';

test.describe('Transferências - ParaBank', () => {
  let paginaTransferencias: PaginaTransferencias;
  let paginaCadastro: PaginaCadastro;
  let dadosUsuario: Record<string, string>;

  test.beforeEach(async ({ page }) => {
    paginaTransferencias = new PaginaTransferencias(page);
    paginaCadastro = new PaginaCadastro(page);

    if (!dadosUsuario) {
      await paginaCadastro.navegar();
      dadosUsuario = gerarDadosCadastro();
      await paginaCadastro.cadastrar(dadosUsuario);
    }

    await paginaTransferencias.navegar();
  });

  test('CT-01 - Deve transferir valor válido e validar mensagem de sucesso', async () => {
    await paginaTransferencias.transferirValor('100');
    expect(await paginaTransferencias.verificarTransferenciaComSucesso()).toBe(true);
  });

  test('CT-02 - Deve clicar em Transfer sem preencher e validar erro', async () => {
    await paginaTransferencias.submeter();
    expect(await paginaTransferencias.verificarErroTransferencia()).toBe(true);
  });

  test('CT-03 - Deve preencher com letras e validar erro', async () => {
    await paginaTransferencias.transferirValor('abc');
    expect(await paginaTransferencias.verificarErroTransferencia()).toBe(true);
  });
});
