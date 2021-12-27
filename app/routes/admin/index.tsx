import { Link } from 'remix';

export default function AdminIndex() {
  return (
    <ul>
      <li>
        <Link to='new'>Create a New Post</Link>
      </li>
    </ul>
  );
}
