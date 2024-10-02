import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina } from 'tinacms/dist/react';

const ContentTemplate = ({ pageContext }) => {
    const { mdx } = pageContext;

    const { data } = useTina({
        query: {},
        variables: {},
        data: mdx,
      });

    return (
        <div>
            <h1>Markdown test</h1>
            <TinaMarkdown content={data} />
        </div>
    );
};

export default ContentTemplate;