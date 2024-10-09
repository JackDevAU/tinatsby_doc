import express from 'express';
import { parseMDX } from '@tinacms/mdx';
import tinaConfig from './tina/config';
import generateQueryForCollection from './src/utils/tinaGenerator';
import { GatsbyNode } from 'gatsby';
import path from 'path';

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

    collections.forEach((collection) => {
        console.log('Processing collection:', collection.name);

        result.data.allFile.edges.forEach(
            ({ node }: { node: { childMdx: { frontmatter: { slug: string }; body: string } } }) => {
                const { frontmatter, body } = node.childMdx;

                console.log('Processing file:', frontmatter);

                const relativePath = frontmatter.slug + '.mdx';
                const query = generateQueryForCollection(collection, relativePath);

                createPage({
                    path: `${collection.name}/${frontmatter.slug.toLowerCase()}`,
                    component: path.resolve('./src/templates/contentTemplate.js'),
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
    });
};

//Required as per https://tina.io/docs/frameworks/gatsby/#allowing-static-adminindexhtml-file-in-dev-mode
import { Express } from 'express';

exports.onCreateDevServer = ({ app }: { app: Express }) => {
    app.use('/admin', express.static('public/admin'));
};
