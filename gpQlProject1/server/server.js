import express from "express";
import { ApolloServer } from "apollo-server-express";

const authors = [
  {
    id: "1",
    info: {
      name: "Premnath",
      age: 29,
      gender: "Male",
    },
  },
  {
    id: "2",
    info: {
      name: "Priya",
      age: 27,
      gender: "FeMale",
    },
  },
];

const typeDefs = `
type Author {
    id: ID!
    info: Person
}
type Person {
    name: String!
    age: Int
    gender: String
}
type DeleteMessage{
    id: ID!
    message: String
}
type Query{
    getAuthors: [Author],
    retrieveAuthor(id: ID!): Author
}
type Mutation{
    createAuthor(name: String!, gender: String!): Author,
    updateAuthor(id: ID!, name: String, gender: String, age: Int): Author,
    deleteAuthor(id: ID!): DeleteMessage
}
`;

const resolvers = {
  Query: {
    getAuthors: () => authors,
    retrieveAuthor: (obj, { id }) => authors.find((author) => author.id === id),
  },
  Mutation: {
    createAuthor: (obj, args) => {
      const id = String(authors.length + 1);
      const { name, gender } = args;
      const newAuthor = {
        id,
        info: {
          name,
          gender,
        },
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (obj, { id, name, gender, age }) => {
      const author = authors.find((author) => author.id === id);
      if (author) {
        const authorIndex = authors.indexOf(author);
        if (name) author.info.name = name;
        if (gender) author.info.gender = gender;
        if (age) author.info.age = age;

        authors[authorIndex] = { id, info: author };
        return { id, info: author };
      } else {
        throw new Error("Author Id not found");
      }
    },
    deleteAuthor: (obj, { id }) => {
      const author = authors.find((author) => author.id === id);
      if (author) {
        const authorIndex = authors.indexOf(author);
        authors.splice(authorIndex, 1);
        return { id, message: `Author with id:${id} deleted succesfully` };
      } else {
        throw new Error("Author Id not found");
      }
    },
  },
};

const port = process.env.PORT || 3000;

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({
  app,
  path: "/graphql",
});

/* 
app.use("/graphql", (req, res, next) => {
  res.send("Welcome to our Author app");
});
 */
app.listen(port, () => {
  console.log(
    `Server running on http://localhost:${port}${server.graphqlPath}`
  );
});
