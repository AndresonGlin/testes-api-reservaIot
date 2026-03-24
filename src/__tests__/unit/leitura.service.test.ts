import LeituraService from "../../services/LeituraService";
import { AppError } from "../../errors/AppError";

// mocks
const mockLeituraRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn()
};

const mockSensorRepository = {
  findOne: jest.fn()
};

// mock datasource
jest.mock("../../database/appDataSource", () => ({
  appDataSource: {
    getRepository: (entity: any) => {
      if (entity.name === "Leitura") return mockLeituraRepository;
      if (entity.name === "Sensor") return mockSensorRepository;
    }
  }
}));

describe("LeituraService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // pesquisar
  test("deve retornar todas leituras", async () => {
    const service = new LeituraService();

    mockLeituraRepository.find.mockResolvedValue([{ id: "1" }]);

    const result = await service.findAll();

    expect(result.length).toBe(1);
  });

  // pesquisar por id
  test("deve retornar leitura por id", async () => {
    const service = new LeituraService();

    mockLeituraRepository.findOneBy.mockResolvedValue({ id: "1" });

    const result = await service.findById("1");

    expect(result).toHaveProperty("id", "1");
  });

  test("deve falhar ao buscar leitura inexistente", async () => {
    const service = new LeituraService();

    mockLeituraRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findById("1"))
      .rejects
      .toThrow("Leitura não encontrada");
  });

  // criacao
  test("deve criar leitura com sucesso", async () => {
    const service = new LeituraService();

    const data = {
      umidade: 50,
      temperatura: 25,
      sensor_id: "1"
    };

    mockSensorRepository.findOne.mockResolvedValue({ id: "1" });

    mockLeituraRepository.create.mockReturnValue({
      ...data,
      dataHora: new Date()
    });

    mockLeituraRepository.save.mockResolvedValue(data);

    const result = await service.create(data as any);

    expect(result.umidade).toBe(50);
    expect(mockLeituraRepository.save).toHaveBeenCalled();
  });

  test("deve falhar se sensor não existir", async () => {
    const service = new LeituraService();

    mockSensorRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ sensor_id: "1" } as any)
    ).rejects.toThrow("Sensor não foi encontrado!");
  });

  // atualizar
  test("deve atualizar leitura com sucesso", async () => {
    const service = new LeituraService();

    const existente = { id: "1", temperatura: 20 };
    const novosDados = { temperatura: 30 };

    mockLeituraRepository.findOneBy.mockResolvedValue(existente);
    mockLeituraRepository.create.mockReturnValue(novosDados);
    mockLeituraRepository.merge.mockReturnValue({
      ...existente,
      ...novosDados
    });
    mockLeituraRepository.save.mockResolvedValue({
      ...existente,
      ...novosDados
    });

    const result = await service.update("1", novosDados as any);

    expect(result.temperatura).toBe(30);
  });

  test("deve falhar ao atualizar leitura inexistente", async () => {
    const service = new LeituraService();

    mockLeituraRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update("1", {} as any))
      .rejects
      .toThrow("Leitura não encontrada");
  });

  // deletar
  test("deve remover leitura com sucesso", async () => {
    const service = new LeituraService();

    const leitura = { id: "1" };

    mockLeituraRepository.findOneBy.mockResolvedValue(leitura);
    mockLeituraRepository.remove.mockResolvedValue(leitura);

    await service.delete("1");

    expect(mockLeituraRepository.remove).toHaveBeenCalled();
  });

  test("deve falhar ao remover leitura inexistente", async () => {
    const service = new LeituraService();

    mockLeituraRepository.findOneBy.mockResolvedValue(null);

    await expect(service.delete("1"))
      .rejects
      .toThrow("Leitura não encontrada");
  });

  
  test("deve listar leituras por área", async () => {
    const service = new LeituraService();

    const mockRows = [
      {
        dataHora: new Date(),
        temperatura: 25,
        umidade: 60
      }
    ];

    const mockQueryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockRows)
    };

    mockLeituraRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await service.listarLeiturasPorArea("1");

    expect(result).toHaveProperty("labels");
    expect(result.temperatura[0]).toBe(25);
    expect(result.umidade[0]).toBe(60);
  });
});