// import fs from "fs";
// import path from "path";

// // // @ts-ignore
// // const dirname = path.dirname(fileURLToPath(import.meta.url));

// const schemaFiles = ["./user.graphql", "./event.graphql", "./enrolled.graphql"];

// // Combine schemas into typeDefs
// const typeDefs = `#graphql
//   ${schemaFiles
//     .map((file) => fs.readFileSync(path.join(__dirname, file), "utf-8"))
//     .join("\n")}
// `;

import { mergeTypeDefs } from "@graphql-tools/merge";
import EnrolledTypes from "./enrolled.types";
import EventType from "./event.types";
import SeedType from "./seed.types";
import UserType from "./user.types";

const typeDefs = mergeTypeDefs([UserType, EventType, EnrolledTypes, SeedType]);

export default typeDefs;
