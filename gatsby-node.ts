import express from 'express';
import { parseMDX } from '@tinacms/mdx';
import tinaConfig from './tina/config';
import generateQueryForCollection from './src/utils/tinaGenerator';
import { GatsbyNode } from 'gatsby';
import path from 'path'; // Import the path module

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const result = (await graphql(`
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
    `)) as { data: { allFile: { edges: { node: { childMdx: { frontmatter: { slug: string }; body: string } } }[] } } };

    const collections = tinaConfig.schema.collections;
    const postCollection = collections.find((col) => col.name === 'post');

    console.log('collections', collections);
    console.log('postCollection', postCollection);

    result.data.allFile.edges.forEach(
        ({ node }: { node: { childMdx: { frontmatter: { slug: string }; body: string } } }) => {
            const { frontmatter, body } = node.childMdx;

            const relativePath = frontmatter.slug + '.mdx';
            const query = generateQueryForCollection(postCollection, relativePath);

            createPage({
                path: frontmatter.slug,
                component: path.resolve('./src/templates/contentTemplate.js'), // Use path.resolve()
                context: {
                    parsedMdx: parseMDX(
                        body,
                        { type: 'rich-text', name: 'markdownParser', parser: { type: 'markdown' } },
                        (s: string) => s
                    ),
                    variables: { relativePath: frontmatter.slug + '.mdx' },
                    query: query,
                },
                defer: true,
            });
        }
    );
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
import { Express } from 'express';

exports.onCreateDevServer = ({ app }: { app: Express }) => {
    app.use('/admin', express.static('public/admin'));
};
