import request from "supertest";
import app from "../../app";
import { appDataSource } from "../../database/appDataSource";

let areaId: string;
let sensorId: string;
const fakeId = "550e8400-e29b-41d4-a716-446655440000";

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

beforeEach(async () => {
  await appDataSource.query("DELETE FROM leitura");
  await appDataSource.query("DELETE FROM sensor");
  await appDataSource.query("DELETE FROM area");

  // cria área
  const areaResponse = await request(app)
    .post("/api/area")
    .send({
      nome: "Área Teste",
      bioma: "Floresta",
      latitude: -3.10,
      longitude: -60.02,
      largura: 100,
      comprimento: 200
    });

  areaId = areaResponse.body.id;

  // cria sensor
  const sensorResponse = await request(app)
    .post("/api/sensors")
    .send({
      serialNumber: `SN-${Date.now()}`,
      fabricante: "Intel",
      modelo: "X1000",
      tipo: "Temperatura",
      status: "Ativo",
      dataInstalacao: new Date(),
      cicloLeitura: 10,
      latitude: -3.10,
      longitude: -60.02,
      area_id: areaId
    });

  sensorId = sensorResponse.body.id;
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

describe("Integração - Leitura", () => {


  it("deve criar uma leitura", async () => {
    const response = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: sensorId
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });


  it("deve retornar 404 ao criar leitura com sensor inexistente", async () => {
    const response = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: fakeId
      });

    expect(response.status).toBe(404);
  });


  it("deve retornar 400 ao criar leitura inválida", async () => {
    const response = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 200, // inválido
        temperatura: 999
      });

    expect(response.status).toBe(400);
  });


  it("deve listar leituras", async () => {
    await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: sensorId
      });

    const response = await request(app)
      .get("/api/leitura");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


  it("deve buscar leitura por id", async () => {
    const createResponse = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: sensorId
      });

    const leituraId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/leitura/${leituraId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", leituraId);
  });

  it("deve retornar 404 ao buscar leitura inexistente", async () => {
    const response = await request(app)
      .get(`/api/leitura/${fakeId}`);

    expect(response.status).toBe(404);
  });

  it("deve atualizar uma leitura", async () => {
    const create = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: sensorId
      });

    const response = await request(app)
      .put(`/api/leitura/${create.body.id}`)
      .send({
        umidade: 80
      });

    expect(response.status).toBe(200);
    expect(response.body.umidade).toBe(80);
  });

  it("deve retornar 404 ao atualizar leitura inexistente", async () => {
    const response = await request(app)
      .put(`/api/leitura/${fakeId}`)
      .send({
        umidade: 80
      });

    expect(response.status).toBe(404);
  });

  it("deve deletar uma leitura", async () => {
    const create = await request(app)
      .post("/api/leitura")
      .send({
        umidade: 60,
        temperatura: 25,
        dataHora: new Date(),
        sensor_id: sensorId
      });

    const response = await request(app)
      .delete(`/api/leitura/${create.body.id}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 ao deletar leitura inexistente", async () => {
    const response = await request(app)
      .delete(`/api/leitura/${fakeId}`);

    expect(response.status).toBe(404);
  });

});