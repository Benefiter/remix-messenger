import { ActionFunction, Form, redirect, useActionData, useLoaderData, useTransition } from "remix";
import type { LoaderFunction } from "remix";
import { getPost, deletePost } from "~/posts";
import invariant from "tiny-invariant";
import React from 'react';

 type UpdatePost = {
  title: string | undefined,
  slug: string | undefined,
  html: string | undefined
}

export const action: ActionFunction = async ({ request }) => {
  console.log('Action function for ****delete post****');
  console.log(request);
  
    await new Promise(res => setTimeout(res, 1000));
  
    const formData = await request.formData();
    console.log('formdata****');
    console.log(formData)

  
    const slug = formData.get('slug');
  
    console.log('invariant check***');
    console.log(typeof slug);
    console.log('slug');
    console.log(slug);
 
    invariant(typeof slug === 'string');
  
    await deletePost({slug});
  
    return redirect('/admin');
  };

export const loader: LoaderFunction = async ({
  params
}) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function DeleteSlug() {
    const post = useLoaderData();
    const [postValue, setPostValue] = React.useState<UpdatePost>(post);
    const transition = useTransition();

    console.log('post value');
    console.log(postValue)
    React.useEffect(() => {
      setPostValue(post);
    }, [post]);

    return (
        <Form method='delete'>
          <p>
            <label>
              Post Title: {postValue.title}
            </label>
          </p>
          <p>
            <label>
              Post Slug:
              <input value={postValue.slug} readOnly={true} type='text' name='slug' />
            </label>
          </p>
          <p>
            <label htmlFor='html'>Markdown: {postValue.html}</label>
          </p>
          <p>
            <button>
              {transition.submission ? 'Deleting...' : 'Delete '} Post
            </button>
          </p>
        </Form>
      );
    
  } 