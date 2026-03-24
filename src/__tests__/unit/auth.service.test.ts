import AuthService from "../../services/AuthService";
import AppError from "../../errors/AppError";

// mocks
const mockPesquisadorRepo = {
  findOne: jest.fn()
};

const mockRefreshRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

// mock datasource
jest.mock("../../database/appDataSource", () => ({
  appDataSource: {
    getRepository: (entity: any) => {
      if (entity.name === "Pesquisador") return mockPesquisadorRepo;
      if (entity.name === "RefreshToken") return mockRefreshRepo;
    }
  }
}));

// mock bcrypt
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

// mock jwt
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));

// mock ms
jest.mock("ms", () => jest.fn(() => 1000));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve fazer login com sucesso", async () => {
    const service = new AuthService();

    const user = {
      id: "1",
      email: "teste@email.com",
      senha: "hash"
    };

    mockPesquisadorRepo.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    mockRefreshRepo.findOne.mockResolvedValue(null);

    mockRefreshRepo.create.mockReturnValue({ jti: "123" });
    mockRefreshRepo.save.mockResolvedValue({ jti: "123" });

    (bcrypt.hash as jest.Mock).mockResolvedValue("hash-refresh");

    (jwt.sign as jest.Mock).mockReturnValue("token-fake");

    const result = await service.login(
      "teste@email.com",
      "123456",
      "chrome",
      "127.0.0.1"
    );

    expect(result).toHaveProperty("tokenAccess");
    expect(result).toHaveProperty("tokenRefresh");
  });

  test("deve falhar se usuário não existir", async () => {
    const service = new AuthService();

    mockPesquisadorRepo.findOne.mockResolvedValue(null);

    await expect(
      service.login("teste@email.com", "123", "chrome", "ip")
    ).rejects.toThrow("Credências Inválidas");
  });

  test("deve falhar se senha estiver incorreta", async () => {
    const service = new AuthService();

    mockPesquisadorRepo.findOne.mockResolvedValue({
      senha: "hash"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login("teste@email.com", "123", "chrome", "ip")
    ).rejects.toThrow("Credênciais Inválidas");
  });

  test("deve reutilizar refresh token existente", async () => {
    const service = new AuthService();

    const user = {
      id: "1",
      email: "teste@email.com",
      senha: "hash"
    };

    mockPesquisadorRepo.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    mockRefreshRepo.findOne.mockResolvedValue({ jti: "123" });

    (jwt.sign as jest.Mock).mockReturnValue("token-fake");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hash-refresh");

    const result = await service.login(
      "teste@email.com",
      "123",
      "chrome",
      "ip"
    );

    expect(result.tokenAccess).toBe("token-fake");
  });
});