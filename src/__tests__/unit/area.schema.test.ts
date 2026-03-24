import { createAreaSchema } from "../../validats/createAreaSchema";

describe("createAreaSchema", () => {

  test("deve validar uma área válida", () => {
    const data = {
      nome: "Área 1",
      descricao: "Teste",
      bioma: "Floresta",
      latitude: -3.1,
      longitude: -60.0,
      largura: 100,
      comprimento: 200,
      relevo: "Plano"
    };

    const result = createAreaSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error.format());
    }

    expect(result.success).toBe(true);
  });

  test("deve falhar sem nome", () => {
    const result = createAreaSchema.safeParse({
      bioma: "Floresta",
      latitude: -3.1,
      longitude: -60.0,
      largura: 100,
      comprimento: 200
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com bioma inválido", () => {
    const result = createAreaSchema.safeParse({
        nome: "Área 1",
        bioma: "Amazônia",
        latitude: -3.1,
        longitude: -60.0,
        largura: 100,
        comprimento: 200
    });

    expect(result.success).toBe(false);
   });

  test("deve falhar com latitude inválida", () => {
    const result = createAreaSchema.safeParse({
        nome: "Área 1",
        bioma: "Floresta",
        latitude: -100, // inválido
        longitude: -60.0,
        largura: 100,
        comprimento: 200
    });

    expect(result.success).toBe(false);
   });

   test("deve falhar com largura negativa", () => {
    const result = createAreaSchema.safeParse({
        nome: "Área 1",
        bioma: "Floresta",
        latitude: -3.1,
        longitude: -60.0,
        largura: -10,
        comprimento: 200
    });

    expect(result.success).toBe(false);
   });

});