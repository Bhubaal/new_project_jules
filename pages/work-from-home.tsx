import Link from 'next/link';

export default function WorkFromHomePage() {
  return (
    <div>
      <h1>Work From Home</h1>
      <nav>
        <ul>
          <li><Link href="/"><a>Home</a></Link></li>
          <li><Link href="/iv-forum"><a>IV Forum</a></Link></li>
          <li><Link href="/leave"><a>Leave</a></Link></li>
          <li><Link href="/attendance"><a>Attendance</a></Link></li>
        </ul>
      </nav>
    </div>
  );
}
