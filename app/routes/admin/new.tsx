import { useActionData, useTransition, redirect, Form } from 'remix';
import type { ActionFunction } from 'remix';
import { createPost } from '~/posts';
import invariant from 'tiny-invariant';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';

export type PostFormError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000));

  const formData = await getFormDataItemsFromRequest(request, ['title', 'slug', 'markdown'])
  const {title, slug, markdown} = formData

  const errors: PostFormError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');

  await createPost({ title, slug, markdown });

  return redirect('/admin');
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method='post'>
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type='text' name='title' />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type='text' name='slug' />
        </label>
      </p>
      <p>
        <label htmlFor='markdown'>Markdown:</label>{' '}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea rows={20} name='markdown' />
      </p>
      <p>
        <button type='submit'>
          {transition.submission ? 'Creating...' : 'Create Post'} Post
        </button>
      </p>
    </Form>
  );
}
