import { createPesquisadorSchema } from "../../validats/createPesquisadorSchema";

describe("createPesquisadorSchema", () => {

  test("deve validar um pesquisador válido", () => {
    // Arrange
    const data = {
      nome: "Andreson",
      email: "andreson@email.com",
      senha: "12345678",
      especialidade: "TI",
      titulacao: "Graduação",
      matricula: "12345",
      linhaPesquisa: "IoT",
      dataNascimento: "1995-05-10"
    };

    // Act
    const result = createPesquisadorSchema.parse(data);

    // Assert
    expect(result.nome).toBe("Andreson");
    expect(result.email).toBe("andreson@email.com");
  });

  test("deve falhar quando faltar campos obrigatórios", () => {
    // Arrange
    const data = {
      nome: "Andreson"
    };

    // Act + Assert
    expect(() => {
      createPesquisadorSchema.parse(data);
    }).toThrow();
  });

  test("deve falhar com titulacao inválida", () => {
    const result = createPesquisadorSchema.safeParse({
      nome: "Teste",
      email: "teste@email.com",
      senha: "12345678",
      especialidade: "TI",
      titulacao: "Ensino Médio", // inválido
      matricula: "123",
      dataNascimento: "1995-05-10"
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com data inválida", () => {
    const result = createPesquisadorSchema.safeParse({
      nome: "Teste",
      email: "teste@email.com",
      senha: "12345678",
      especialidade: "TI",
      titulacao: "Graduação",
      matricula: "123",
      dataNascimento: "data-errada"
    });

    expect(result.success).toBe(false);
  });

});