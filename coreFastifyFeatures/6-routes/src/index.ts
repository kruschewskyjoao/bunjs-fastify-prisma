import Fastify from "fastify";

const server = Fastify();

server.get("/", async (req, rep) => {
  return 'hello word';
});

/* server.get<{
  Headers: { myheader: number },
  Querystring: { id: number },
  Reply: {
    200: { status: string },
    500: { status: number },
  }
}>("/employee", async (req, rep) => {
  // return req.headers.myheader;
  // return `you passed ${req.query.id}`
  return rep.status(200).send({ status: "success" })
}); */

server.post<{
  Body: { userName: string },
}>("/employee", async (req, rep) => {
  return `userName is ${req.body.userName}`
})

server.get<{Params: { id: string }}>("/employee/:id", async (req, rep) => {
  return `id is ${req.params.id}`;
});

server.listen({
  port: 8080, host: "::1"
}, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1);
  }
  console.log(`Server is ready on ${address}`)
});
