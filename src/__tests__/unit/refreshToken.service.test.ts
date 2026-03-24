import RefreshTokenService from "../../services/RefreshTokenService";
import AppError from "../../errors/AppError";

// mocks
const mockRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  save: jest.fn()
};

// mock datasource
jest.mock("../../database/appDataSource.js", () => ({
  appDataSource: {
    getRepository: () => mockRepository
  }
}));

// mock bcrypt
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue("hash-novo")
}));

// mock jwt
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn().mockReturnValue("token-gerado")
}));

describe("RefreshTokenService", () => {

  const service = new RefreshTokenService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve gerar novos tokens com sucesso", async () => {

    const fakeToken = "refresh-token";

    // jwt decode
    const jwt = require("jsonwebtoken");
    jwt.verify.mockReturnValue({ jti: "123" });

    const bcrypt = require("bcryptjs");
    bcrypt.compare.mockResolvedValue(true);

    const tokenDb = {
      id: "1",
      jti: "123",
      revoked: false,
      expireIn: new Date(Date.now() + 100000),
      sessionId: "abc",
      pesquisador: {
        id: "user-1",
        email: "teste@email.com"
      }
    };

    mockRepository.findOne.mockResolvedValue(tokenDb);
    mockRepository.update.mockResolvedValue({});
    mockRepository.save.mockResolvedValue({
      jti: "novo-jti"
    });

    const result = await service.refresh(
      fakeToken,
      "chrome",
      "127.0.0.1"
    );

    expect(result).toHaveProperty("tokenAccess");
    expect(result).toHaveProperty("tokenRefresh");
  });

  test("deve falhar se token não existir", async () => {

    const jwt = require("jsonwebtoken");
    jwt.verify.mockReturnValue({ jti: "123" });

    mockRepository.findOne.mockResolvedValue(null);

    await expect(
      service.refresh("token", "chrome", "127.0.0.1")
    ).rejects.toThrow(AppError);
  });

  test("deve falhar se token expirado", async () => {

    const jwt = require("jsonwebtoken");
    jwt.verify.mockReturnValue({ jti: "123" });

    mockRepository.findOne.mockResolvedValue({
      expireIn: new Date(Date.now() - 1000) // expirado
    });

    await expect(
      service.refresh("token", "chrome", "127.0.0.1")
    ).rejects.toThrow("Token inválido");
  });

  test("deve falhar se hash não bater", async () => {

    const jwt = require("jsonwebtoken");
    jwt.verify.mockReturnValue({ jti: "123" });

    const bcrypt = require("bcryptjs");
    bcrypt.compare.mockResolvedValue(false);

    mockRepository.findOne.mockResolvedValue({
      id: "1",
      jti: "123",
      revoked: false,
      expireIn: new Date(Date.now() + 10000),
      pesquisador: { id: "1", email: "teste@email.com" }
    });

    await expect(
      service.refresh("token", "chrome", "127.0.0.1")
    ).rejects.toThrow("Token inválido");
  });

});