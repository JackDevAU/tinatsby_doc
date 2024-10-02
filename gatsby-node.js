const express = require('express');
const { parseMDX } = require('@tinacms/mdx');

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

    console.log(result);


    result.data.allFile.edges.forEach(({ node }) => {
        const { frontmatter, body } = node.childMdx;

        createPage({
            path: frontmatter.slug, // Set the path to the slug from frontmatter
            component: require.resolve(`./src/templates/contentTemplate.js`), // Path to your template
            context: {
                mdx: parseMDX(body, { field: { parser: { type: "markdown" } } }), // Parse MDX for TinaMarkdown
            },
            defer: true,
        });
    });
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
exports.onCreateDevServer = ({ app }) => {
    app.use('/admin', express.static('public/admin'));
};