import { QueryInterface } from "sequelize";
import sequelize from "./index";

const defaultCompany = require("./seeds/20200904070005-create-default-company");
const defaultUser = require("./seeds/20200904070006-create-default-user");
const defaultSettings = require("./seeds/20200904070007-create-default-settings");

const runSeeds = async () => {
  try {
    console.log("Iniciando execução dos seeds...");
    
    // Criar empresa padrão
    console.log("Criando empresa padrão...");
    await defaultCompany.up(sequelize.getQueryInterface() as QueryInterface);
    
    // Criar usuário padrão
    console.log("Criando usuário padrão...");
    await defaultUser.up(sequelize.getQueryInterface() as QueryInterface);
    
    // Criar configurações padrão
    console.log("Criando configurações padrão...");
    await defaultSettings.up(sequelize.getQueryInterface() as QueryInterface);
    
    console.log("Seeds executados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao executar seeds:", error);
    process.exit(1);
  }
};

runSeeds(); 