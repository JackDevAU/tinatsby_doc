const express = require('express');
const { parseMDX } = require('@tinacms/mdx');
const tinaConfig = require('./tina/config');
const generateQueryForCollection = require('./src/utils/tinaGenerator');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
        {
          allFile(filter: { extension: { eq: "mdx" } }) {
            edges {
              node {
                id
                childMdx {
                  frontmatter {
                    slug
                  }
                  body
                }
              }
            }
          }
        }
      `);

  const collections = tinaConfig.schema.collections;
  const postCollection = collections.find(col => col.name === 'post');
  
  result.data.allFile.edges.forEach(({ node }) => {
    const { frontmatter, body } = node.childMdx;

    const query = generateQueryForCollection(postCollection, relativePath);

    createPage({
      path: frontmatter.slug,
      component: require.resolve(`./src/templates/contentTemplate.js`),
      context: {
        parsedMdx: parseMDX(body, { field: { parser: { type: "markdown" } } }),
        variables: { relativePath: frontmatter.slug + ".mdx" },
        query: query,
      },
      defer: true,
    });
  });
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
exports.onCreateDevServer = ({ app }) => {
  app.use('/admin', express.static('public/admin'));
};