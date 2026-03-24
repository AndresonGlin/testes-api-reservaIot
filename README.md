# 🧪 Reserva IoT — Backend com Testes

API REST para monitoramento de reservas florestais com sensores IoT.

Este projeto tem foco em:

* ✅ Testes unitários
* ✅ Testes de integração
* ✅ Cobertura de código (coverage)

---

## 🚀 Tecnologias

* Node.js + TypeScript
* Express
* TypeORM
* PostgreSQL
* Jest + Supertest
* Zod

---

## 📦 Instalação

```bash
git clone https://github.com/AndresonGlin/testes-api-reservaIot.git
cd projeto-typescript-aula
npm install
```

---

## 🐘 Subindo o banco de dados

```bash
docker compose up postgres -d
```

Verifique se está rodando:

```bash
docker ps
```

---

## ▶️ Rodando a aplicação

```bash
npm run dev
```

Saída esperada:

```
Conectou com o banco!
Server is running in port: 6060
```

---

## 🧪 Executando os testes

### Rodar todos os testes

```bash
npm test
```

---

### Rodar testes com cobertura

```bash
npm run test:cov
```

ou

```bash
npm test -- --coverage
```

---

### Rodar um teste específico (RECOMENDADO)

Para evitar conflitos entre testes (principalmente por causa de **foreign keys**), rode individualmente:

```bash
npm test area.test.ts
npm test sensor.test.ts
npm test leitura.test.ts
npm test pesquisador.test.ts
```

---

## ⚠️ Importante — Isolamento dos testes

Os testes de integração usam o **mesmo banco**, então:

* Existe dependência entre entidades (Area → Sensor → Leitura)
* Pode ocorrer erro de foreign key
* Pode ocorrer falso positivo/negativo ao rodar tudo junto

---

## ✔️ Boas práticas adotadas

Limpeza do banco antes de cada teste:

```ts
await appDataSource.query("DELETE FROM leitura");
await appDataSource.query("DELETE FROM sensor");
await appDataSource.query("DELETE FROM area");
```

Outras práticas:

* Criar dados dentro do próprio teste
* Usar valores únicos (`Date.now()`)
* Garantir independência entre testes

---

## 🧪 Tipos de testes

### 🔹 Testes Unitários

Local:

```
src/__tests__/unit
```

Testam:

* Services
* Validações (Zod)

Exemplo:

```ts
createPesquisadorSchema.parse(data)
```

---

### 🔹 Testes de Integração

Local:

```
src/__tests__/integration
```

Testam:

* Fluxo completo (request → controller → service → banco)

Exemplo:

```ts
request(app).post("/api/area")
```

---

## 🎯 O que está sendo testado

### Área

* Criar
* Listar
* Buscar por ID
* Atualizar
* Deletar
* Erros (400 / 404)

### Sensor

* Criar
* Listar
* Atualizar
* Deletar
* Validação de área
* Serial duplicado

### Leitura

* Criar
* Listar
* Buscar por ID
* Relacionamento com sensor/área
* Validação de dados

### Pesquisador

* Criar
* Listar
* Buscar por ID
* Atualizar
* Deletar
* Validação de duplicidade

---

## 🧠 Observações importantes

* IDs inválidos (não UUID) podem gerar erro 500 se não tratados
* Validações feitas com Zod
* Services usam AppError
* Controllers retornam status HTTP corretamente

---

## 📁 Estrutura do Projeto

```
src/
├── __tests__/
│   ├── integration/
│   └── unit/
├── controllers/
├── services/
├── entities/
├── routes/
├── middleware/
├── validats/
└── database/
```

---

## 💡 Observação

Este projeto utiliza banco real nos testes de integração.

Por isso, em alguns cenários é recomendado rodar testes isoladamente para evitar:

* Conflitos de chave estrangeira
* Interferência entre testes
* Resultados inconsistentes

Em um cenário ideal, seria utilizado:

* Banco exclusivo para testes
* Ou mocks/stubs

---

## ✅ Conclusão

Este projeto demonstra:

* Boas práticas de testes em API REST
* Separação entre testes unitários e integração
* Uso de banco real para validação completa
* Controle de erros e validações

---

## 👨‍💻 Autor

Andreson Glin
