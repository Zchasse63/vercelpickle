import { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: {
    default: "Product Details - Pickle B2B Marketplace",
    template: "%s - Pickle B2B Marketplace",
  },
  description: "View detailed product information on Pickle B2B Marketplace.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </Providers>
  );
}
