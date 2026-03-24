module.exports = {
  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }]
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};