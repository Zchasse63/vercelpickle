import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

export function MarketplaceTestimonials() {
  const testimonials = [
    {
      quote:
        "Pickle has transformed how we source ingredients for our restaurant. The quality is consistently excellent, and the platform is so easy to use.",
      author: "Sarah Johnson",
      role: "Head Chef, The Green Table",
      avatar: "/avatar-1.jpg",
    },
    {
      quote:
        "As a small grocery store owner, I've been able to discover unique local producers that I wouldn't have found otherwise. My customers love the variety!",
      author: "Michael Chen",
      role: "Owner, Community Market",
      avatar: "/avatar-2.jpg",
    },
    {
      quote:
        "The delivery is always on time, and the produce is fresher than what I was getting from my previous suppliers. Pickle has become essential to our business.",
      author: "Olivia Martinez",
      role: "Operations Manager, Fresh Bites Catering",
      avatar: "/avatar-3.jpg",
    },
  ]

  return (
    <section className="container space-y-6 bg-muted/50 px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Customers Say</h2>
        <p className="max-w-[700px] text-muted-foreground md:text-lg">
          Hear from businesses that have transformed their food sourcing with Pickle.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-0 bg-background shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar || `/placeholder.svg?height=48&width=48&query=person`}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <blockquote className="text-lg font-medium leading-relaxed">"{testimonial.quote}"</blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
