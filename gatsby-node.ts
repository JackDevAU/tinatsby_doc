import type { GatsbyNode } from "gatsby";
import path from "node:path";
import { client } from "./tina/__generated__/client";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;

  const allCollections = await client.request(
    {
      query: `{
  collections {
    __typename
    slug
    path
    documents {
      totalCount
      edges {
        node {
          ...DocumentFields
        }
      }
    }
  }
}

fragment DocumentFields on Document {
  _values
  _sys {
    filename
    path
    relativePath
    breadcrumbs
    extension
  }
}`,
    },
    {}
  );

  // biome-ignore lint/complexity/noForEach: <explanation>
  allCollections.data.collections?.forEach((collection: any) => {
    console.log(collection);
    // biome-ignore lint/complexity/noForEach: <explanation>
    collection.documents?.edges?.forEach((document: any) => {
      console.log(document);

      console.log(`building page: ${`./src/templates/${document.node._values._collection}.tsx`}`);
      
      console.log(`building path: ${document.node._values._collection}/${document.node._sys.path}`);
      
      createPage({
        path: `${document.node._values._collection}/${document.node._sys.filename}`,
        component: path.resolve(
          `./src/templates/${document.node._values._collection}.tsx`
        ),
        context: {
            data: document.node
        }
      });
    });
  });
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
import express,{ Express } from "express";

exports.onCreateDevServer = ({ app }: { app: Express }) => {
  app.use("/admin", express.static("public/admin"));
};
