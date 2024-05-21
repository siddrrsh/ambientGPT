import Link from "next/link";

export default function Hello() {
  return (
    <div>
      <Link href="/">
        <button>Bye world</button>
      </Link>
    </div>
  );
}
