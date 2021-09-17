// Import necessary modules.
import { Response, Request } from "express";
import { firestore } from "../db/firebase";
import moment from "moment";
import admin from "firebase-admin";
import { Message, ReadMessage, SendMessage } from "../schemas/message";

const alphanumericMatcher = /^([0-9]|[a-z])+([0-9a-z]+)$/i;

export const sendMessage = async (request: Request, response: Response): Promise<void> => {
  // Parse the request body as a SendMessage type.
  const data: SendMessage = request.body;
  // Destructure the required data from the request body.
  const { chat_id, sender, message } = data;

  // Sanity check to make sure a sender and chat_id was passed in the body.
  if (!sender || !chat_id) {
    response.status(400);
    response.json({
      error: "Either `chat_id` or `sender` was not provided in the request body.",
    });
    return;
  }

  /* Do a regex check to make sure the chat_id field or sender field is a valid alphanumeric string. */
  if (!chat_id.match(alphanumericMatcher) || !sender.match(alphanumericMatcher)) {
    response.status(400);
    response.json({
      error: "`chat_id` or `sender` must be an alphanumeric string.",
    });
    return;
  }

  try {
    // Get a reference to the chat room collection in Firestore.
    const chatRoomCollectionRef = await firestore.collection("chat_rooms");
    // Get a reference to the chat room document in Firestore if it exists.
    const chatRoomRef = await chatRoomCollectionRef.doc(chat_id).get();
    // If the chat room doesn't exist, initialize the document with empty data.
    if (!chatRoomRef.exists) {
      chatRoomCollectionRef.doc(chat_id).create({});
    }

    /* Initializes a object of type Message specifying a message and timestamp
    to send to rhe specified recipient's chat room. */
    const newMessage: Message = {
      message,
      // Timestamp format: September 14th 2021, 7:27:31 am
      timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
    };

    /* Update the list of messages for the specified recipient from said
    sender in Firestore. */
    const result = await chatRoomRef.ref
      .collection("messages")
      .doc(sender)
      .set(
        {
          // Use an arrayUnion field value to prevent overwriting previous messages.
          messages: admin.firestore.FieldValue.arrayUnion(newMessage),
        },
        { merge: true }
      );

    /* If the document write was successful, return a success message from our endpoint. */
    if (result.writeTime) {
      console.log(`Successfully sent chat message to room ${chat_id}: ${message}`);
      response.json({
        message: `Chat message from ${sender} sent successfully to room ${chat_id}.`,
      });
    }
  } catch (err) {
    // If any error occurred, let our error handler middleware handle it.
    throw new Error(`Failed to send a message to chat room "${chat_id}": ${err}`);
  }
};

export const readMessage = async (request: Request, response: Response): Promise<void> => {
  // Parse the request body as a ReadMessage type.
  const data: ReadMessage = request.body;
  // Destructure the required data from the request body.
  const { chat_id, sender } = data;

  // Sanity check to make sure a sender and chat_id was passed in the body.
  if (!chat_id) {
    response.status(400);
    response.json({
      error: "A `chat_id` or `sender` was not provided in the request body.",
    });
    return;
  }

  /* Be sure that the chat_id field is a valid alphanumeric string, and if the sender is specified then match our alphanumeric regex expression as well. */
  if (!chat_id.match(alphanumericMatcher) || (sender && !sender.match(alphanumericMatcher))) {
    response.status(400);
    response.json({
      error: "`chat_id` or `sender` field must be an alphanumeric string.",
    });
    return;
  }

  try {
    // Get a reference to the chat_id document in our chat_rooms collection on Firestore.
    const chatRoomRef = await firestore.collection("chat_rooms").doc(chat_id).get();

    // If the chat_id document does not exist, return an error back to the client.
    if (!chatRoomRef.exists) {
      response.status(404);
      response.json({
        error: "You specified an invalid `chat_id`. This chat room does not exist.",
      });
      return;
    }

    // Stores a list of messages used to return to the client.
    const messages: Array<Record<string, unknown>> = [];

    // If the sender is specified, get a reference to the sender's messages from our messages collection for the specified chat_id on Firestore.
    if (sender) {
      const senderRef = await chatRoomRef.ref.collection("messages").doc(sender).get();

      // If the sender's messages document does not exist, return an error back to the client stating that no messages exists.
      if (!senderRef.exists) {
        response.status(404);
        response.json({
          message: `There are no messages from ${sender} in chat room ${chat_id}.`,
        });
        return;
      }

      // Return all data from the messages field from the specified sender for the specified chat_id.
      const data = senderRef.data();
      if (data) {
        // Add all the sender's messages to our messages array to be returned to the client.
        messages.push(data.messages);
      }

      // Additional debug to clarify how many messages were found from the sender to the chat room.
      console.log(`Successfully found ${messages.length} chat messages from ${sender} to room ${chat_id}.`);

      // Return the total number of messages and Adds a sender field to the response for additional clarity as to which sender sent the messages.
      response.json({ sender, messages });
    } else {
      /* If the sender is not specified, then we will return all messages in the chat room. First, get a reference to the messages collection from the specified chat room collection on Firestore based on the chat_id. */
      const messagesRef = await chatRoomRef.ref.collection("messages").get();

      // For each document, the unique ID will be the sender's name and the document will have a field with a list of messages. Add these messages to our messages array.
      messagesRef.forEach((docSnapshot) => {
        messages.push({ sender: docSnapshot.id, messages: docSnapshot.data().messages });
      });

      // Debug how many messages were found in the chat room in total.
      console.log(`Successfully found ${messages.length} total chat messages to room ${chat_id}.`);

      // Return the full chat log to the client.
      response.json({ chatLog: messages });
    }
  } catch (err) {
    // If any error occurred, let our error handler middleware handle it.
    throw new Error(`Failed to send a message to chat room "${chat_id}": ` + err);
  }
};
