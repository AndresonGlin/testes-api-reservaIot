import SensorService from "../../services/SensorService";
import AppError from "../../errors/AppError";


// mock do repository
const mockSensorRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn()
};

const mockAreaRepository = {
  findOne: jest.fn()
};

// mock do datasource
jest.mock("../../database/appDataSource", () => ({
  appDataSource: {
    getRepository: (entity: any) => {
      if (entity.name === "Sensor") return mockSensorRepository;
      if (entity.name === "Area") return mockAreaRepository;
    }
  }
}));

describe("SensorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ciar
  test("deve criar um sensor com sucesso", async () => {
    const service = new SensorService();

    const data = {
      serialNumber: "ABC123",
      area_id: "1"
    };

    mockSensorRepository.findOne.mockResolvedValue(null); // não existe sensor
    mockAreaRepository.findOne.mockResolvedValue({ id: "1" }); // área existe

    mockSensorRepository.create.mockReturnValue(data);
    mockSensorRepository.save.mockResolvedValue(data);

    const result = await service.addSensor(data);

    expect(result.serialNumber).toBe("ABC123");
    expect(mockSensorRepository.save).toHaveBeenCalled();
  });

  test("deve falhar se serialNumber já existir", async () => {
    const service = new SensorService();

    mockSensorRepository.findOne.mockResolvedValue({}); // já existe

    await expect(service.addSensor({} as any))
      .rejects
      .toThrow("Sensor com este Serial Number já cadastrado!");
  });

  test("deve falhar se área não existir", async () => {
    const service = new SensorService();

    mockSensorRepository.findOne.mockResolvedValue(null);
    mockAreaRepository.findOne.mockResolvedValue(null);

    await expect(service.addSensor({ area_id: "1" } as any))
      .rejects
      .toThrow("Area não foi encontrada!");
  });

  // pesquisar
  test("deve retornar todos sensores", async () => {
    const service = new SensorService();

    mockSensorRepository.find.mockResolvedValue([{ serialNumber: "ABC123" }]);

    const result = await service.getAllSensors();

    expect(result.length).toBe(1);
  });

  // atualizar
  test("deve atualizar sensor com sucesso", async () => {
    const service = new SensorService();

    const existente = { id: "1", modelo: "Antigo" };
    const novosDados = { modelo: "Novo" };

    mockSensorRepository.findOneBy.mockResolvedValue(existente);
    mockSensorRepository.create.mockReturnValue(novosDados);
    mockSensorRepository.merge.mockReturnValue({ ...existente, ...novosDados });
    mockSensorRepository.save.mockResolvedValue({ ...existente, ...novosDados });

    const result = await service.updateSensor("1", novosDados);

    expect(result.modelo).toBe("Novo");
  });

  test("deve falhar ao atualizar sensor inexistente", async () => {
    const service = new SensorService();

    mockSensorRepository.findOneBy.mockResolvedValue(null);

    await expect(service.updateSensor("1", {}))
      .rejects
      .toThrow("Sensor não encontrado!");
  });

  // delete
  test("deve remover sensor com sucesso", async () => {
    const service = new SensorService();

    const sensor = { id: "1" };

    mockSensorRepository.findOneBy.mockResolvedValue(sensor);
    mockSensorRepository.remove.mockResolvedValue(sensor);

    await service.deleteSensor("1");

    expect(mockSensorRepository.remove).toHaveBeenCalled();
  });

  test("deve falhar ao remover sensor inexistente", async () => {
    const service = new SensorService();

    mockSensorRepository.findOneBy.mockResolvedValue(null);

    await expect(service.deleteSensor("1"))
      .rejects
      .toThrow("Sensor não encontrado");
  });
});