import AreaService from "../../services/AreaService";
import AppError from "../../errors/AppError";

// mock do repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(), 
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

describe("AreaService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // criar
  test("deve criar uma área com sucesso", async () => {
    const service = new AreaService();

    const data: any = {
      nome: "Floresta Amazônica",
      bioma: "Floresta",
      latitude: -3.1,
      longitude: -60.0,
      largura: 100,
      comprimento: 200
    };

    mockRepository.create.mockReturnValue(data);
    mockRepository.save.mockResolvedValue(data);

    const result = await service.create(data);

    expect(result.nome).toBe("Floresta Amazônica");
    expect(mockRepository.save).toHaveBeenCalled();
  });

  //pequisar
  test("deve retornar todas as áreas", async () => {
    const service = new AreaService();

    mockRepository.find.mockResolvedValue([{ nome: "Área 1" }]);

    const result = await service.findAll();

    expect(result.length).toBe(1);
  });

  // pesquisar por id
  test("deve retornar área por id", async () => {
  const service = new AreaService();

  mockRepository.findOne.mockResolvedValue({
    id: "1",
    nome: "Área Teste"
  });

  const result = await service.findById("1");

  expect(result).toHaveProperty("id", "1");
});

  test("deve falhar ao buscar área inexistente", async () => {
    const service = new AreaService();

    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findById("1"))
      .rejects
      .toThrow("Área não encontrada");
  });

  // atualizar
  test("deve atualizar área com sucesso", async () => {
    const service = new AreaService();

    const existente = { id: "1", nome: "Antigo" };
    const novosDados = { nome: "Novo Nome" };

    mockRepository.findOneBy.mockResolvedValue(existente);
    mockRepository.create.mockReturnValue(novosDados);
    mockRepository.merge.mockReturnValue({ ...existente, ...novosDados });
    mockRepository.save.mockResolvedValue({ ...existente, ...novosDados });

    const result = await service.update("1", novosDados as any);

    expect(result.nome).toBe("Novo Nome");
  });

  test("deve falhar ao atualizar área inexistente", async () => {
    const service = new AreaService();

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update("1", {} as any))
      .rejects
      .toThrow("Área não encontrada");
  });

  // deletar
  test("deve remover área com sucesso", async () => {
    const service = new AreaService();

    const area = { id: "1" };

    mockRepository.findOneBy.mockResolvedValue(area);
    mockRepository.remove.mockResolvedValue(area);

    await service.delete("1");

    expect(mockRepository.remove).toHaveBeenCalled();
  });

  test("deve falhar ao remover área inexistente", async () => {
    const service = new AreaService();

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.delete("1"))
      .rejects
      .toThrow("Área não encontrada");
  });

});