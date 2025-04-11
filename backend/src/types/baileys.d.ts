declare module '@whiskeysockets/baileys' {
  export interface WASocket {
    id?: number;
    store?: any;
    ev: {
      on(event: string, listener: (...args: any[]) => void): void;
      off(event: string, listener: (...args: any[]) => void): void;
    };
    logout(): Promise<void>;
    sendMessage(jid: string, content: any, options?: any): Promise<any>;
    onWhatsApp(jid: string): Promise<{ exists: boolean; jid: string }>;
    profilePictureUrl(jid: string): Promise<string>;
    chatModify(options: any, jid: string): Promise<void>;
    readMessages(keys: any[]): Promise<void>;
    groupMetadata(jid: string): Promise<any>;
    presenceSubscribe(jid: string): Promise<void>;
    sendPresenceUpdate(type: string, jid: string): Promise<void>;
    user: {
      id: string;
      name: string;
    };
  }

  export interface AuthenticationState {
    creds: AuthenticationCreds;
    keys: any;
  }

  export interface AuthenticationCreds {
    noiseKey: Uint8Array;
    signedIdentityKey: Uint8Array;
    signedPreKey: SignedKeyPair;
    registrationId: number;
    advSecretKey: string;
    processedHistoryMessages: MessageUserReceipt[];
    nextPreKeyId: number;
    firstUnuploadedPreKeyId: number;
    serverHasPreKeys: boolean;
    account: any;
    me: any;
    signalIdentities: any[];
    lastAccountSyncTimestamp: number;
    platform: string;
    myAppStateKeyId: string;
  }

  export interface SignedKeyPair {
    keyPair: KeyPair;
    signature: Uint8Array;
    keyId: number;
  }

  export interface KeyPair {
    public: Uint8Array;
    private: Uint8Array;
  }

  export interface MessageUserReceipt {
    key: MessageKey;
    receipt: string;
    timestamp: number;
  }

  export interface MessageKey {
    remoteJid: string;
    fromMe: boolean;
    id: string;
    participant?: string;
  }

  export interface SocketConfig {
    auth: AuthenticationState;
    logger: any;
    printQRInTerminal: boolean;
    browser?: any;
    markOnlineOnConnect?: boolean;
    generateHighQualityLinkPreview?: boolean;
    getMessage?: () => Promise<{ conversation: string }>;
    msgRetryCounterCache?: any;
    defaultQueryTimeoutMs?: number;
    emitOwnEvents?: boolean;
    fireInitQueries?: boolean;
    shouldIgnoreJid?: (jid: string) => boolean;
    patchMessageBeforeSending?: (message: any) => any;
    options?: {
      maxCachedMessages?: number;
    };
  }

  export const Browsers: {
    macOS: (name: string) => any;
  };

  export function makeInMemoryStore(config: { logger: any }): any;
  export function downloadMediaMessage(message: any): Promise<Buffer>;
  export function extractMessageContent(message: any): any;
  export function getContentType(message: any): string;
  export function jidNormalizedUser(jid: string): string;
  export function useMultiFileAuthState(folder: string): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }>;
  export function initAuthCreds(): AuthenticationCreds;
  export const BufferJSON: any;
  export type DisconnectReason = any;
  export type Chat = any;
  export type Contact = any;
  export type AnyMessageContent = any;
  export type BinaryNode = any;
  export type SignalDataTypeMap = any;
  export const delay: (ms: number) => Promise<void>;
  
  export type MessageUpsertType = 'notify' | 'append';
  export type WAMessage = any;
  export type WAMessageStubType = any;
  export type WAMessageUpdate = any;
  
  export namespace proto {
    export interface WebMessageInfo {
      key: MessageKey;
      message: any;
      messageTimestamp: number;
      pushName: string;
      status?: any;
      messageStubType?: any;
    }
    export type IWebMessageInfo = WebMessageInfo;
  }

  const makeWASocket: (config: Partial<SocketConfig>) => WASocket;
  export default makeWASocket;
} 