import Link from 'next/link';

export default function IVForumPage() {
  return (
    <div>
      <h1>IV Forum</h1>
      <nav>
        <ul>
          <li><Link href="/"><a>Home</a></Link></li>
          <li><Link href="/work-from-home"><a>Work From Home</a></Link></li>
          <li><Link href="/leave"><a>Leave</a></Link></li>
          <li><Link href="/attendance"><a>Attendance</a></Link></li>
        </ul>
      </nav>
    </div>
  );
}
