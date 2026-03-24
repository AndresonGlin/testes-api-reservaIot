import request from "supertest";
import app from "../../app"; 
import { appDataSource } from "../../database/appDataSource";

const fakeId = "550e8400-e29b-41d4-a716-446655440000"; // UUID válido

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

beforeEach(async () => {
  await appDataSource.query("DELETE FROM leitura");
  await appDataSource.query("DELETE FROM sensor");
  await appDataSource.query("DELETE FROM area");
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

describe("Integração - Area", () => {


  it("deve criar uma área", async () => {
    const response = await request(app)
      .post("/api/area")
      .send({
        nome: "Área Teste",
        bioma: "Floresta",
        latitude: -3.10,
        longitude: -60.02,
        largura: 100,
        comprimento: 200,
        descricao: "Área de teste",
        relevo: "Plano"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });


  it("deve retornar 400 ao criar área inválida", async () => {
    const response = await request(app)
      .post("/api/area")
      .send({
        nome: "A",
        bioma: "Nada"
      });

    expect(response.status).toBe(400);
  });


  it("deve listar áreas", async () => {
    const response = await request(app)
      .get("/api/area");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


  it("deve buscar área por id", async () => {
    const createResponse = await request(app)
      .post("/api/area")
      .send({
        nome: "Área Teste",
        bioma: "Floresta",
        latitude: -3.10,
        longitude: -60.02,
        largura: 100,
        comprimento: 200
      });

    const areaId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/area/${areaId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", areaId);
  });


  it("deve retornar 404 ao buscar área inexistente", async () => {
    const response = await request(app)
      .get(`/api/area/${fakeId}`);

    expect(response.status).toBe(404);
  });


  it("deve atualizar uma área", async () => {
    const create = await request(app)
      .post("/api/area")
      .send({
        nome: "Área Teste",
        bioma: "Floresta",
        latitude: -3.10,
        longitude: -60.02,
        largura: 100,
        comprimento: 200
      });

    const response = await request(app)
      .put(`/api/area/${create.body.id}`)
      .send({
        nome: "Área Atualizada"
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe("Área Atualizada");
  });


  it("deve retornar 404 ao atualizar área inexistente", async () => {
    const response = await request(app)
      .put(`/api/area/${fakeId}`)
      .send({
        nome: "Teste"
      });

    expect(response.status).toBe(404);
  });

  it("deve deletar uma área", async () => {
    const create = await request(app)
      .post("/api/area")
      .send({
        nome: "Área Teste",
        bioma: "Floresta",
        latitude: -3.10,
        longitude: -60.02,
        largura: 100,
        comprimento: 200
      });

    const response = await request(app)
      .delete(`/api/area/${create.body.id}`);

    expect(response.status).toBe(204);
  });


  it("deve retornar 404 ao deletar área inexistente", async () => {
    const response = await request(app)
      .delete(`/api/area/${fakeId}`);

    expect(response.status).toBe(404);
  });

});