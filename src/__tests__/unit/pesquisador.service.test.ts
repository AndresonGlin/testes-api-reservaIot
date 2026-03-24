import PesquisadorService from "../../services/PesquisadorService";
import AppError from "../../errors/AppError";


// mock do repository
const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn()
};

// mock do datasource
jest.mock("../../database/appDataSource.js", () => ({
  appDataSource: {
    getRepository: () => mockRepository
  }
}));

// mock do bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("senha-hash")
}));

describe("PesquisadorService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // criar
  test("deve criar um pesquisador com sucesso", async () => {
    const service = new PesquisadorService();

    const data: any = {
      nome: "Andreson",
      email: "teste@email.com",
      senha: "12345678",
      matricula: "123",
      titulacao: "Graduação",
      dataNascimento: new Date()
    };

    mockRepository.findOneBy
      .mockResolvedValueOnce(null) // email
      .mockResolvedValueOnce(null); // matricula

    mockRepository.create.mockReturnValue(data);
    mockRepository.save.mockResolvedValue(data);

    const result = await service.create(data);

    expect(result.nome).toBe("Andreson");
    expect(result.senha).toBe("senha-hash");
  });

  test("deve falhar se email já existir", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy.mockResolvedValueOnce({}); // email existe

    await expect(service.create({} as any))
      .rejects
      .toThrow("E-mail ou Matrícula já cadastrados");
  });

  test("deve falhar se matrícula já existir", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy
      .mockResolvedValueOnce(null) // email ok
      .mockResolvedValueOnce({});  // matricula existe

    await expect(service.create({} as any))
      .rejects
      .toThrow(AppError);
  });

  // pesquisar
  test("deve retornar todos pesquisadores", async () => {
    const service = new PesquisadorService();

    mockRepository.find.mockResolvedValue([{ nome: "Teste" }]);

    const result = await service.findAll();

    expect(result.length).toBe(1);
  });

  // pesquisar por id
  test("deve retornar pesquisador por id", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy.mockResolvedValue({ id: "1" });

    const result = await service.findById("1");

    expect(result).toHaveProperty("id", "1");
  });

  test("deve falhar ao buscar id inexistente", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findById("1"))
      .rejects
      .toThrow("Pesquisador não encontrado");
  });

  // atualizar
  test("deve atualizar pesquisador com sucesso", async () => {
    const service = new PesquisadorService();

    const existente = { id: "1", nome: "Old" };
    const novosDados = { nome: "Novo" };

    mockRepository.findOneBy.mockResolvedValue(existente);
    mockRepository.create.mockReturnValue(novosDados);
    mockRepository.merge.mockReturnValue({ ...existente, ...novosDados });
    mockRepository.save.mockResolvedValue({ ...existente, ...novosDados });

    const result = await service.update("1", novosDados as any);

    expect(result.nome).toBe("Novo");
  });

  test("deve falhar ao atualizar pesquisador inexistente", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update("1", {} as any))
      .rejects
      .toThrow("Pesquisador não encontrado");
  });

  // delete
  test("deve remover pesquisador com sucesso", async () => {
    const service = new PesquisadorService();

    const pesquisador = { id: "1" };

    mockRepository.findOneBy.mockResolvedValue(pesquisador);
    mockRepository.remove.mockResolvedValue(pesquisador);

    await service.delete("1");

    expect(mockRepository.remove).toHaveBeenCalled();
  });

  test("deve falhar ao remover pesquisador inexistente", async () => {
    const service = new PesquisadorService();

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.delete("1"))
      .rejects
      .toThrow("Pesquisador não encontrado");
  });

});