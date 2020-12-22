import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
type Query{
    hello: String!
}

`);
const rootResolver = {
  hello: () => "Hello World!!",
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000/graphql`);
});
