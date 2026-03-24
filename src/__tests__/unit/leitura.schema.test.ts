import { createLeituraSchema } from "../../validats/createLeituraSchema";

describe("createLeituraSchema", () => {

  test("deve validar uma leitura válida", () => {
    const data = {
      umidade: 50,
      temperatura: 25,
      dataHora: "2024-01-01T10:00:00"
    };

    const result = createLeituraSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error.format());
    }

    expect(result.success).toBe(true);
  });

  test("deve falhar com umidade inválida", () => {
    const result = createLeituraSchema.safeParse({
      umidade: 150,
      temperatura: 25,
      dataHora: "2024-01-01T10:00:00"
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com temperatura inválida", () => {
    const result = createLeituraSchema.safeParse({
      umidade: 50,
      temperatura: -100,
      dataHora: "2024-01-01T10:00:00"
    });

    expect(result.success).toBe(false);
  });

  test("deve falhar com data inválida", () => {
    const result = createLeituraSchema.safeParse({
      umidade: 50,
      temperatura: 25,
      dataHora: "data-errada"
    });

    expect(result.success).toBe(false);
  });

  test("deve converter string para número", () => {
    const result = createLeituraSchema.safeParse({
      umidade: "60", // string
      temperatura: "30", // string
      dataHora: "2024-01-01T10:00:00"
    });

    expect(result.success).toBe(true);
  });

});