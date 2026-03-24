import { createSensorSchema } from "../../validats/createSensorSchema";

describe("createSensorSchema", () => {

  test("deve validar um sensor válido", () => {
    const data = {
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ativo",
      ipFixo: "192.168.0.1",
      dataInstalacao: "2024-01-01",
      dataManutencao: "2024-02-01",
      cicloLeitura: 10,
      latitude: -3.1,
      longitude: -60.0,
      finalidade: "Monitoramento"
    };

    const result = createSensorSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error.format());
    }

    expect(result.success).toBe(true);
  });

  test("deve falhar sem campos obrigatórios", () => {
    const result = createSensorSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  test("deve falhar com status inválido", () => {
    const result = createSensorSchema.safeParse({
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ligado", 
      dataInstalacao: "2024-01-01",
      cicloLeitura: 10,
      latitude: -3.1,
      longitude: -60.0
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com IP inválido", () => {
    const result = createSensorSchema.safeParse({
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ativo",
      ipFixo: "999.999.999.999", 
      dataInstalacao: "2024-01-01",
      cicloLeitura: 10,
      latitude: -3.1,
      longitude: -60.0
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com cicloLeitura negativo", () => {
    const result = createSensorSchema.safeParse({
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ativo",
      dataInstalacao: "2024-01-01",
      cicloLeitura: -5, 
      latitude: -3.1,
      longitude: -60.0
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com latitude inválida", () => {
    const result = createSensorSchema.safeParse({
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ativo",
      dataInstalacao: "2024-01-01",
      cicloLeitura: 10,
      latitude: -100, 
      longitude: -60.0
    });

    expect(result.success).toBe(false);
  });

  test("deve aceitar campos opcionais vazios", () => {
    const result = createSensorSchema.safeParse({
      serialNumber: "ABC123",
      fabricante: "Intelbras",
      modelo: "X100",
      tipo: "Temperatura",
      status: "Ativo",
      dataInstalacao: "2024-01-01",
      cicloLeitura: 10,
      latitude: -3.1,
      longitude: -60.0,
      ipFixo: "",
      finalidade: ""
    });

    expect(result.success).toBe(true);
  });

});