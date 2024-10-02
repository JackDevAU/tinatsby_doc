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

    result.data.allFile.edges.forEach(({ node }) => {
        const { frontmatter, body } = node.childMdx;

        createPage({
            path: frontmatter.slug,
            component: require.resolve(`./src/templates/contentTemplate.js`),
            context: {
                mdx: parseMDX(body, { field: { parser: { type: "markdown" } } }),
                slug: frontmatter.slug,
                query: `
                    query($slug: String!) {
                        mdx(frontmatter: { slug: { eq: $slug } }) {
                        body
                        }
                    }
                `,
            },
            defer: true,
        });
    });
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
exports.onCreateDevServer = ({ app }) => {
    app.use('/admin', express.static('public/admin'));
};