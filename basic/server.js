import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schema/index.js";

const app = new ApolloServer({typeDefs,resolvers})


app.listen(3000).then(() => console.log('server is runing on 3000'))
    .catch((err) => console.log(err))