'use client';

import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { useTina, tinaField } from 'tinacms/dist/react';

const Recipe = ({ pageContext }) => {
    const { query, variables, parsedMdx } = pageContext;

    const { data } = useTina({
        query: query,
        variables: variables,
        data: parsedMdx,
    });

    return (
        <div>
            <h1>Recipe page:</h1>
            <h2 data-tina-field={tinaField(data?.recipe, 'title')}>{data?.recipe?.title}</h2>
            <p data-tina-field={tinaField(data?.recipe, 'author')}>Author : {data?.recipe?.author}</p>

            <div data-tina-field={tinaField(data?.recipe, 'body')}>
                <TinaMarkdown content={data?.recipe?.body} />
            </div>
        </div>
    );
};

export default Recipe;
