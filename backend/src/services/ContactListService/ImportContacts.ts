import { head, has } from "lodash";
import ExcelJS from "exceljs";
import ContactListItem from "../../models/ContactListItem";
import CheckContactNumber from "../WbotServices/CheckNumber";
import { logger } from "../../utils/logger";
// import CheckContactNumber from "../WbotServices/CheckNumber";

export async function ImportContacts(
  contactListId: number,
  companyId: number,
  file: Express.Multer.File | undefined
) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file?.path as string);
  const worksheet = workbook.worksheets[0];
  
  const contacts = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    
    const values = row.values as any[];
    let name = "";
    let number = "";
    let email = "";

    // Assuming columns are in order: name, number, email
    if (values[1]) name = values[1].toString();
    if (values[2]) {
      number = values[2].toString();
      number = number.replace(/\D/g, "");
    }
    if (values[3]) email = values[3].toString();

    contacts.push({ name, number, email, contactListId, companyId });
  });

  const contactList: ContactListItem[] = [];

  for (const contact of contacts) {
    const [newContact, created] = await ContactListItem.findOrCreate({
      where: {
        number: `${contact.number}`,
        contactListId: contact.contactListId,
        companyId: contact.companyId
      },
      defaults: contact
    });
    if (created) {
      contactList.push(newContact);
    }
  }

  if (contactList) {
    for (let newContact of contactList) {
      try {
        const response = await CheckContactNumber(newContact.number, companyId);
        newContact.isWhatsappValid = response.exists;
        const number = response.jid.replace(/\D/g, "");
        newContact.number = number;
        await newContact.save();
      } catch (e) {
        logger.error(`Número de contato inválido: ${newContact.number}`);
      }
    }
  }

  return contactList;
}
