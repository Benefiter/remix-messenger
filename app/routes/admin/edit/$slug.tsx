import { ActionFunction, Form, redirect, useActionData, useLoaderData, useTransition } from "remix";
import type { LoaderFunction } from "remix";
import { getPost, NewPost, updatePost } from "~/posts";
import invariant from "tiny-invariant";
import { PostFormError } from '../new';
import React from 'react';

 type UpdatePost = {
  title: string | undefined,
  slug: string | undefined,
  html: string | undefined
}

export const action: ActionFunction = async ({ request }) => {
  console.log('Action function');
  console.log(request);

    await new Promise(res => setTimeout(res, 1000));
  
    const formData = await request.formData();
  
    const title = formData.get('title');
    const slug = formData.get('slug');
    const html = formData.get('html');
  
    const errors: PostFormError = {};
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!html) errors.markdown = true;
  
    if (Object.keys(errors).length) {
      return errors;
    }
  
    invariant(typeof title === 'string');
    invariant(typeof slug === 'string');
    invariant(typeof html === 'string');
  
    await updatePost({ title, slug, markdown: html });
  
    return redirect('/admin');
  };

export const loader: LoaderFunction = async ({
  params
}) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function EditSlug() {
    const post = useLoaderData();
    const [postValue, setPostValue] = React.useState<UpdatePost>(post);
    const errors = useActionData();
    const transition = useTransition();

    React.useEffect(() => {
      setPostValue(post);
    }, [post]);

    return (
        <Form method='post'>
          <p>
            <label>
              Post Title: {errors?.title ? <em>Title is required</em> : null}
              <input value={postValue.title} onChange={(e) => setPostValue({...postValue, title: e.target.value})} type='text' name='title' />
            </label>
          </p>
          <p>
            <label>
              Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
              <input value={postValue.slug} onChange={(e) => setPostValue({...postValue, slug: e.target.value})} type='text' name='slug' />
            </label>
          </p>
          <p>
            <label htmlFor='html'>Markdown:</label>{' '}
            {errors?.html ? <em>Markdown is required</em> : null}
            <br />
            <textarea value={postValue.html} onChange={(e) => setPostValue({...postValue, html: e.target.value})} rows={20} name='html' />
          </p>
          <p>
            <button type='submit'>
              {transition.submission ? 'Updating...' : 'Update '} Post
            </button>
          </p>
        </Form>
      );
    
  } 