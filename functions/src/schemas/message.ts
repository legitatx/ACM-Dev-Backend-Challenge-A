/**
 * Defines a SendMessage type used within our CRUD function `sendMessage`
 * to parse the request body and send a message to a chat room.
 */
export type SendMessage = {
  chat_id: string;
  sender: string;
  message: string;
};

/**
 *  Defines a ReadMessage type used within our CRUD function `readMessage`
 *  to parse the request body and read a message from a sender for a specified *  chat room.
 */
export type ReadMessage = {
  chat_id: string;
  sender?: string;
};

/**
 *  Defines a Message type schema used within our CRUD functions to read and
 *  write messages to a specified recipient from a chat room.
 */
export type Message = {
  message: string;
  timestamp: string;
};
