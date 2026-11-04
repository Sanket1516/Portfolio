import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap grid min-h-[100svh] content-center">
      <p className="mono text-sm text-rose">$ curl {"<this page>"}<br />404: route not found. The packet was dropped.</p>
      <h1 className="display mt-5 text-[clamp(5rem,22vw,16rem)]">Lost hop</h1>
      <Link href="/" className="btn mt-8 w-fit">Back to the home route</Link>
    </main>
  );
}
