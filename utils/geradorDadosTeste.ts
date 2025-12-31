import { faker } from '@faker-js/faker';

export function gerarDadosCadastro(
  overrides?: Record<string, string>,
  testId?: string
): Record<string, string> {
  const password = faker.internet.password({ length: 10 });
  const testIdPart = testId ? testId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) : '';
  const random = Math.random().toString(36).substring(2, 6);
  const username = `usr${testIdPart}${random}`.toLowerCase();

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),
    phoneNumber: faker.phone.number(),
    ssn: faker.string.numeric(9),
    username: username,
    password: password,
    repeatedPassword: password,
    ...overrides,
  };
}

export function gerarSenhaAleatoria(): string {
  return faker.internet.password({ length: 10 });
}

export function gerarUsernameAleatorio(): string {
  const random = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString().slice(-6);
  return `user${timestamp}${random}`.toLowerCase();
}

export function gerarValorTransferencia(): string {
  return faker.finance.amount({ min: 1, max: 100, dec: 2 });
}

export function gerarZipCodesInvalidos(): string[] {
  return ['123', '12345-6789-0', 'ABCDE', '12-345'];
}
