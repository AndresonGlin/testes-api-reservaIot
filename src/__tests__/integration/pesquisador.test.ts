import request from "supertest";
import app from "../../app";
import { appDataSource } from "../../database/appDataSource";

const fakeId = "550e8400-e29b-41d4-a716-446655440000";

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

beforeEach(async () => {
  await appDataSource.query("DELETE FROM pesquisador");
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

describe("Integração - Pesquisador", () => {


  it("deve criar um pesquisador", async () => {
    const response = await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "Andreson",
        email: "teste@email.com",
        senha: "12345678",
        especialidade: "TI",
        titulacao: "Graduação",
        matricula: "123",
        linhaPesquisa: "IoT",
        dataNascimento: "1995-05-10"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });


  it("deve retornar 400 ao criar pesquisador inválido", async () => {
    const response = await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "A" // inválido
      });

    expect(response.status).toBe(400);
  });


  it("deve retornar 400 ao criar pesquisador com email duplicado", async () => {
    const payload = {
      nome: "Andreson",
      email: "teste@email.com",
      senha: "12345678",
      especialidade: "TI",
      titulacao: "Graduação",
      matricula: "123",
      linhaPesquisa: "IoT",
      dataNascimento: "1995-05-10"
    };

    await request(app).post("/api/pesquisador").send(payload);

    const response = await request(app)
      .post("/api/pesquisador")
      .send(payload);

    expect(response.status).toBe(400);
  });


  it("deve listar pesquisadores", async () => {
    await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "Andreson",
        email: `teste${Date.now()}@email.com`,
        senha: "12345678",
        especialidade: "TI",
        titulacao: "Graduação",
        matricula: `${Date.now()}`,
        linhaPesquisa: "IoT",
        dataNascimento: "1995-05-10"
      });

    const response = await request(app)
      .get("/api/pesquisador");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


  it("deve buscar pesquisador por id", async () => {
    const create = await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "Andreson",
        email: `teste${Date.now()}@email.com`,
        senha: "12345678",
        especialidade: "TI",
        titulacao: "Graduação",
        matricula: `${Date.now()}`,
        linhaPesquisa: "IoT",
        dataNascimento: "1995-05-10"
      });

    const response = await request(app)
      .get(`/api/pesquisador/${create.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("deve retornar 404 ao buscar pesquisador inexistente", async () => {
    const response = await request(app)
      .get(`/api/pesquisador/${fakeId}`);

    expect(response.status).toBe(404);
  });


  it("deve atualizar um pesquisador", async () => {
    const create = await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "Andreson",
        email: `teste${Date.now()}@email.com`,
        senha: "12345678",
        especialidade: "TI",
        titulacao: "Graduação",
        matricula: `${Date.now()}`,
        linhaPesquisa: "IoT",
        dataNascimento: "1995-05-10"
      });

    const response = await request(app)
      .put(`/api/pesquisador/${create.body.id}`)
      .send({
        nome: "Atualizado"
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe("Atualizado");
  });


  it("deve retornar 404 ao atualizar pesquisador inexistente", async () => {
    const response = await request(app)
      .put(`/api/pesquisador/${fakeId}`)
      .send({
        nome: "Teste"
      });

    expect(response.status).toBe(404);
  });

  it("deve deletar um pesquisador", async () => {
    const create = await request(app)
      .post("/api/pesquisador")
      .send({
        nome: "Andreson",
        email: `teste${Date.now()}@email.com`,
        senha: "12345678",
        especialidade: "TI",
        titulacao: "Graduação",
        matricula: `${Date.now()}`,
        linhaPesquisa: "IoT",
        dataNascimento: "1995-05-10"
      });

    const response = await request(app)
      .delete(`/api/pesquisador/${create.body.id}`);

    expect(response.status).toBe(204);
  });


  it("deve retornar 404 ao deletar pesquisador inexistente", async () => {
    const response = await request(app)
      .delete(`/api/pesquisador/${fakeId}`);

    expect(response.status).toBe(404);
  });

});