import request from "supertest";
import app from "../../app";
import { appDataSource } from "../../database/appDataSource";

let areaId: string;
const fakeId = "550e8400-e29b-41d4-a716-446655440000";

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

beforeEach(async () => {
  await appDataSource.query("DELETE FROM sensor");
  await appDataSource.query("DELETE FROM area");

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
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

describe("Integração - Sensor", () => {


  it("deve criar um sensor", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });


  it("deve retornar 400 ao criar sensor com serial duplicado", async () => {
    const payload = {
      serialNumber: "SN-123",
      fabricante: "Intel",
      modelo: "X1000",
      tipo: "Temperatura",
      status: "Ativo",
      dataInstalacao: new Date(),
      cicloLeitura: 10,
      latitude: -3.10,
      longitude: -60.02,
      area_id: areaId
    };

    await request(app).post("/api/sensors").send(payload);

    const response = await request(app)
      .post("/api/sensors")
      .send(payload);

    expect(response.status).toBe(400);
  });


  it("deve retornar 404 ao criar sensor com área inexistente", async () => {
    const response = await request(app)
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
        area_id: fakeId
      });

    expect(response.status).toBe(404);
  });


  it("deve retornar 400 ao criar sensor inválido", async () => {
    const response = await request(app)
      .post("/api/sensors")
      .send({
        serialNumber: "", // inválido
      });

    expect(response.status).toBe(400);
  });


  it("deve listar sensores", async () => {
    await request(app)
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

    const response = await request(app)
      .get("/api/sensors");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


  it("deve atualizar um sensor", async () => {
    const create = await request(app)
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

    const response = await request(app)
      .put(`/api/sensors/${create.body.id}`)
      .send({
        status: "Inativo"
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Inativo");
  });


  it("deve retornar 404 ao atualizar sensor inexistente", async () => {
    const response = await request(app)
      .put(`/api/sensors/${fakeId}`)
      .send({
        status: "Inativo"
      });

    expect(response.status).toBe(404);
  });


  it("deve deletar um sensor", async () => {
    const create = await request(app)
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

    const response = await request(app)
      .delete(`/api/sensors/${create.body.id}`);

    expect(response.status).toBe(204);
  });


  it("deve retornar 404 ao deletar sensor inexistente", async () => {
    const response = await request(app)
      .delete(`/api/sensors/${fakeId}`);

    expect(response.status).toBe(404);
  });

});