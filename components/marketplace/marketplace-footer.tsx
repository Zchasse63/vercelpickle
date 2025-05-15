import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function MarketplaceFooter() {
  return (
    <footer className="border-t bg-background" data-testid="main-footer">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4" data-testid="company-info">
            <h3 className="text-lg font-semibold">Pickle</h3>
            <p className="text-sm text-muted-foreground">
              Connecting food businesses with quality suppliers since 2023.
            </p>
            <div className="flex space-x-4" data-testid="social-links">
              <Link href="#" className="text-muted-foreground hover:text-foreground" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground" data-testid="social-linkedin">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4" data-testid="footer-shop-links">
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace/categories" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-categories">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/marketplace/deals" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-deals">
                  Deals & Discounts
                </Link>
              </li>
              <li>
                <Link href="/marketplace/new-arrivals" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-new-arrivals">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/marketplace/best-sellers" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-best-sellers">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4" data-testid="footer-account-links">
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace/account" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-account">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/marketplace/account/orders" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-orders">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/marketplace/account/wishlist" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-wishlist">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/marketplace/account/settings" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-settings">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4" data-testid="footer-seller-links">
            <h3 className="text-sm font-semibold">Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seller" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-seller-dashboard">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/marketplace/become-seller" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-become-seller">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/marketplace/seller-guidelines" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-seller-guidelines">
                  Seller Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4" data-testid="footer-help-links">
            <h3 className="text-sm font-semibold">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace/faq" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/marketplace/shipping" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-shipping">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/marketplace/returns" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-returns">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/marketplace/contact" className="text-muted-foreground hover:text-foreground" data-testid="footer-link-contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left" data-testid="copyright">
              &copy; {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground" data-testid="footer-links">
              <Link href="/marketplace/privacy" className="hover:text-foreground" data-testid="footer-link-privacy">
                Privacy Policy
              </Link>
              <Link href="/marketplace/terms" className="hover:text-foreground" data-testid="footer-link-terms">
                Terms of Service
              </Link>
              <Link href="/marketplace/cookies" className="hover:text-foreground" data-testid="footer-link-cookies">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
