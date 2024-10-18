import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField, useEditState, } from "tinacms/dist/react";
import { PostDocument } from "../../tina/__generated__/types";

const Post = ({pageContext}) => {
    console.log("Generating page?");
    console.log("pageContext:", pageContext);
    const {edit} = useEditState();

    const {data} = useTina({
        data: pageContext.data,
        query: PostDocument,
        variables: {
            relativePath: `${pageContext.data._sys.relativePath}`,
        }
    })

    console.log("data:", data);
    
    if(edit){
        return (
            <div>
              <h1>Post page:</h1>
              <h1 data-tina-field={tinaField(data?.post, "title")}>
                {data?.post?.title}
              </h1>
      
              <div data-tina-field={tinaField(data?.post, "body")}>
                <TinaMarkdown content={data?.post?.body} />
              </div>
            </div>
          ); 
    }

    return (
        <div>
          <h1>
            {data?._values?.title}
          </h1>
          <div>
            <TinaMarkdown content={data?._values?.body} components={{
                p(props) {
                    return <h1 style={{color: "red"}}>{props?.children}</h1>
                },
            }} />
          </div>
        </div>
    )
    

   
};

export default Post;


    // return (
    //   <div>
    //     <h1>Post page:</h1>
    //     <h1 data-tina-field={tinaField(data?.data.post, "title")}>
    //       {data?.data.post?.title}
    //     </h1>

    //     <div data-tina-field={tinaField(data?.data.post, "body")}>
    //       <TinaMarkdown content={data?.data.post?.body} />
    //     </div>
    //   </div>
    // );