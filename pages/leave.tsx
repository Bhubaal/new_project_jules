import Link from 'next/link';

export default function LeavePage() {
  return (
    <div>
      <h1>Leave</h1>
      <nav>
        <ul>
          <li><Link href="/"><a>Home</a></Link></li>
          <li><Link href="/iv-forum"><a>IV Forum</a></Link></li>
          <li><Link href="/work-from-home"><a>Work From Home</a></Link></li>
          <li><Link href="/attendance"><a>Attendance</a></Link></li>
        </ul>
      </nav>
    </div>
  );
}
