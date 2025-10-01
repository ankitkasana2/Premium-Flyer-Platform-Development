import FlyerForm from "@/components/flyer/flyer-form"

export default function NewOrderPage({ searchParams }: { searchParams?: { flyerId?: string } }) {
  const flyerId = searchParams?.flyerId
  return (
    <main className="min-h-screen bg-black">
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* add page header and embed the 7-variant flyer form */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white text-balance">Create Your Flyer</h1>
          <p className="mt-2 text-zinc-400">
            Choose your form type, fill in event details, upload assets, and we&apos;ll deliver your flyer fast.
          </p>
        </header>

        <FlyerForm flyerId={flyerId} />
      </section>
    </main>
  )
}
