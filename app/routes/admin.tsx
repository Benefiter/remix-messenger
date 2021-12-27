import { Outlet, Link, useLoaderData } from 'remix';
import { getPosts } from '~/posts';
import type { Post } from '~/posts';
import adminStyles from '~/styles/admin.css';

export const links = () => {
  return [{ rel: 'stylesheet', href: adminStyles }];
};

export const loader = () => {
  return getPosts();
};

export default function Admin() {
  const posts = useLoaderData<Post[]>();
  return (
    <div className='admin'>
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map(post => (
            <li style={{ cursor: 'pointer', padding: '5px' }} key={post.slug}>
              <div className='d-flex row'>
                <Link className='col' to={`/admin/edit/${post.slug}`}>
                  {post.title}
                </Link>
                <Link className='no-decorations' to={`/admin/delete/${post.slug}`}>
                  <i
                  className='col-2 bi-x-lg d-flex justify-content-center align-items-center delete'
                />

                </Link>

              </div>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
