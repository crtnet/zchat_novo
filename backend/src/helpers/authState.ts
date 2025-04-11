import type {
  AuthenticationCreds,
  AuthenticationState,
  SignalDataTypeMap
} from "@whiskeysockets/baileys";
import { BufferJSON, initAuthCreds } from "@whiskeysockets/baileys";
import Whatsapp from "../models/Whatsapp";

const KEY_MAP = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory"
} as const;

const authState = async (
  whatsapp: Whatsapp
): Promise<{ state: AuthenticationState; saveState: () => void }> => {
  let creds: AuthenticationCreds;
  let keys: any = {};

  const saveState = async () => {
    try {
      await whatsapp.update({
        session: JSON.stringify({ creds, keys }, BufferJSON.replacer, 0)
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const getSessionDatabase = await whatsappById(whatsapp.id);

  if (whatsapp.session && whatsapp.session !== null) {
    const result = JSON.parse(whatsapp.session, BufferJSON.reviver);
    creds = result.creds;
    keys = result.keys;
  } else {
    creds = initAuthCreds();
    keys = {};
  }

  return {
    state: {
      creds,
      keys: {
        get: (type: keyof SignalDataTypeMap, ids: string[]) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict: any, id) => {
            let value = keys[key]?.[id];
            if (value) {
              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (type: keyof SignalDataTypeMap, data: any) => {
          const key = KEY_MAP[type];
          keys[key] = keys[key] || {};
          Object.assign(keys[key], data);
          saveState();
        }
      }
    },
    saveState
  };
};

export default authState;
