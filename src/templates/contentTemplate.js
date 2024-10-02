import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina } from 'tinacms/dist/react';

const ContentTemplate = ({ pageContext }) => {
    const { mdx,slug,query } = pageContext;

    const { data } = useTina({
        query: query,
        variables: {relativePath:'content/'+slug},
        data: mdx,
      });

      console.log(pageContext);

    return (
        <div>
            <h1>Markdown test</h1>
            <TinaMarkdown content={data} />
        </div>
    );
};

export default ContentTemplate;