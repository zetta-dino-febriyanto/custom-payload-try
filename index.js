const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/dialogflow-fulfillment", (request, response) => {
  dialogflowFulfillment(request, response);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response });

  function sayHello(agent) {
    agent.add("Hello, welcome to our platform");
  }

  function try_button(agent) {
    const a = 1;
    const b = 2;
    var payloadData = {
      richContent: [
        [
          {
            type: "list",
            title: "Sop Ayam",
            event: {
              languageCode: "",
              parameters: {
                value: a,
              },
              name: "pesan",
            },
            subtitle: "List item 1 subtitle",
          },
          {
            type: "divider",
          },
          {
            type: "list",
            event: {
              parameters: {
                value: b,
              },
              languageCode: "",
              name: "pesan",
            },
            title: "Sop Kambing",
            subtitle: "List item 2 subtitle",
          },
        ],
      ],
    };

    agent.add( new Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
  }

  function get_data(agent) {
      agent.add("Oke")
      console.log(request.body.queryResult.outputContexts);
      
      infoContext = agent.context.get("pesan")
      console.log(infoContext)
      choice = infoContext.parameters.value
      if (choice==1){
          agent.add("Anda Memesan Sop Ayam")
      } else {
          agent.add("Anda memesan sop kambing")
      }
  }
  //inisialisasi intent
  let intentMap = new Map();

  intentMap.set("Default Welcome Intent", sayHello);
  intentMap.set("ask-name", try_button);
  intentMap.set("ask-name - custom", get_data)
  agent.handleRequest(intentMap);
};
