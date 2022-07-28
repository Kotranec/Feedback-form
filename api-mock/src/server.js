const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Have all URLS prefixed with a /api
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

var isFeedbackSubmitSuccessful = false;

server.post("/feedback-form-submit", (req, res) => {
  if (isFeedbackSubmitSuccessful) {
    res.statusCode = 200;    
    setTimeout(() => res.jsonp({
      message: "Отправлено успешно!"
    }), 2000);
    
  }
  else {
    res.statusCode = 400;
    setTimeout(() => res.jsonp({
      message: "Неверный запрос"
    }), 2000);
  }
  isFeedbackSubmitSuccessful = !isFeedbackSubmitSuccessful;
});

server.listen(8080, () => {
  console.log("JSON Server is running");
});
