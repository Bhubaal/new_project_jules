import Link from 'next/link';

export default function AttendancePage() {
  return (
    <div>
      <h1>Attendance</h1>
      <nav>
        <ul>
          <li><Link href="/"><a>Home</a></Link></li>
          <li><Link href="/iv-forum"><a>IV Forum</a></Link></li>
          <li><Link href="/work-from-home"><a>Work From Home</a></Link></li>
          <li><Link href="/leave"><a>Leave</a></Link></li>
        </ul>
      </nav>
    </div>
  );
}
