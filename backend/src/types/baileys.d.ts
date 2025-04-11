declare module '@whiskeysockets/baileys' {
  export interface WASocket {
    id?: number;
    store?: any;
    sendMessage(jid: string, content: any, options?: any): Promise<any>;
  }

  export function downloadMediaMessage(message: any): Promise<Buffer>;
  export function extractMessageContent(message: any): any;
  export function getContentType(message: any): string;
  export function jidNormalizedUser(jid: string): string;
  
  export type MessageUpsertType = 'notify' | 'append';
  export type WAMessage = any;
  export type WAMessageStubType = any;
  export type WAMessageUpdate = any;
  
  export namespace proto {
    export interface WebMessageInfo {
      key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
      };
      message: any;
      messageTimestamp: number;
      pushName: string;
    }
    export type IWebMessageInfo = WebMessageInfo;
  }
} 