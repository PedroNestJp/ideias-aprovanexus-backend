module.exports = {
  apps: [
    {
      name: "inova-v1.2",
      script: "dist/main.js", // ou "src/main.ts" se usar ts-node
      watch: true,
      interpreter: "node", // ou "ts-node"
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
