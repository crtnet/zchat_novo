import { QueryInterface } from "sequelize";

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addConstraint("Contacts", {
      fields: ["number", "companyId"],
      type: "unique",
      name: "number_companyid_unique"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeConstraint("Contacts", "number_companyid_unique");
  }
};
