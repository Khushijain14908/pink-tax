import LinkChecker from "@/components/LinkChecker";

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Is it Pink Taxed?</h1>
        <p className="mt-2 text-gray-600">
          Paste an Amazon product link. We&apos;ll find out if you&apos;re paying extra for the color.
        </p>
      </header>
      <LinkChecker />
    </div>
  );
}
