# ACM Dev Back-end Developer Challenge A

Chat App API challenge for ACM Development - Fall 2021.

### Quick Start

- Set up a new Firebase project [here](https://console.firebase.google.com/).
- Make sure the project name is `acm-chat-api` and that it is running on Spark plan in order for Cloud Functions to run.
- Clone the repo
- Install `firebase-tools`

```
$ npm install -g firebase-tools
```

- Login to firebase

```
$ firebase login
```

Note: Make sure to sign in with a Google account.

#### Testing Locally

- Make sure you have the latest version of Node.js LTS (v14) installed on your respective operating system. You can find the installer files [here](https://nodejs.org/en/download/).
- Because only Cloud Firestore and Cloud Functions will be run by the Firebase emulator, you do not need to set up any local admin credentials.
- To deploy locally, run the following command in your terminal:

```
$ npm run serve
```

#### Testing Routes

- This section will cover how to test the routes implemented in this challenge.
- You can use the [firebase functions shell](https://firebase.google.com/docs/functions/local-shell) to test any routes or with an HTTP client such as curl or Postman.

##### Send Message

- To test the send message route, you can invoke the endpoint (`/message/send`). A `chat_id`, `sender`, and `message` field must be included in the body represented as a JSON object.
- Here is an example below using curl:

```
curl --location --request POST 'http://localhost:5002/acm-chat-api/us-central1/challenge/message/send' \
--header 'Content-Type: application/json' \
--data-raw '{
    "chat_id": "123abc",
    "sender": "Ryan",
    "message": "Hello World!"
}'
```

##### Read Message

- To test the read message route, you can invoke the endpoint (`/message/read`).

- To get the chat log from a chat room from a specific sender, a `chat_id` and `sender` field must be specified in the body represented as a JSON object.
- The endpoint will only return a response containing the chat messages in the room for that specific user.

- Here is an example below using curl:

```
curl --location --request GET 'http://localhost:5002/acm-chat-api/us-central1/challenge/message/read' \
--header 'Content-Type: application/json' \
--data-raw '{
    "chat_id": "123abc",
    "sender": "Ryan"
}'
```

- Here is an example response for this type of chat log with a specified sender:

```
{
    "sender": "Ryan",
    "messages": [
        [
            {
                "message": "Hello",
                "timestamp": "September 16th 2021, 8:01:06 am"
            },
            {
                "message": "World",
                "timestamp": "September 16th 2021, 8:01:10 am"
            }
        ]
    ]
}
```

- To get the full chat log from a chat room, only a `chat_id` field must be specified in the body represented as a JSON object.
- The endpoint will then return a response containing a full chat log of all messages in the specified chat room.

- Here is an example below using curl:

```
curl --location --request GET 'http://localhost:5002/acm-chat-api/us-central1/challenge/message/read' \
--header 'Content-Type: application/json' \
--data-raw '{
    "chat_id": "123abc"
}'
```

- Here is an example response for a type of chat log with no specified sender:

```
{
    "chatLog": [
        {
            "sender": "Ryan",
            "messages": [
                {
                    "message": "Hello",
                    "timestamp": "September 16th 2021, 8:01:06 am"
                },
                {
                    "message": "World",
                    "timestamp": "September 16th 2021, 8:01:10 am"
                }
            ]
        },
        {
            "sender": "Willie",
            "messages": [
                {
                    "message": "Hello there!",
                    "timestamp": "September 16th 2021, 8:14:48 am"
                }
            ]
        }
    ]
}
```

#### Deploying to Production

- Run the following command in your terminal to deploy the app to Cloud Functions on your respective Firebase project:

```
$ npm run deploy
```
