import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, LogOut, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { wishlist } = useWishlist();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="glass rounded-2xl p-8 shadow-purple">
            <h1 className="font-display text-2xl font-bold text-center mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input required className="mt-1" /></div>
                  <div><Label>Last Name</Label><Input required className="mt-1" /></div>
                </div>
              )}
              <div><Label>Email</Label><Input type="email" required className="mt-1" placeholder="you@example.com" /></div>
              <div><Label>Password</Label><Input type="password" required className="mt-1" placeholder="••••••••" /></div>
              {isSignUp && <div><Label>Confirm Password</Label><Input type="password" required className="mt-1" placeholder="••••••••" /></div>}
              <Button type="submit" className="w-full" size="lg">{isSignUp ? "Sign Up" : "Log In"}</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="glass">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
            <TabsTrigger value="orders"><Package className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
            <TabsTrigger value="wishlist"><Heart className="h-4 w-4 mr-1" /> Wishlist ({wishlist.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="glass rounded-xl p-6 max-w-lg">
              <h2 className="font-display text-xl font-semibold mb-4">Personal Details</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input defaultValue="John" className="mt-1" /></div>
                  <div><Label>Last Name</Label><Input defaultValue="Doe" className="mt-1" /></div>
                </div>
                <div><Label>Email</Label><Input defaultValue="john@example.com" className="mt-1" /></div>
                <div><Label>Phone</Label><Input defaultValue="+94 77 123 4567" className="mt-1" /></div>
                <div><Label>Address</Label><Input defaultValue="123 Main St, Colombo" className="mt-1" /></div>
                <Button>Update Profile</Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Order History</h2>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders yet. Order history will appear here once connected to a backend.</p>
                <Button asChild className="mt-4"><Link to="/shop">Start Shopping</Link></Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-6 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Your wishlist is empty.</p>
                <Button asChild className="mt-4"><Link to="/shop">Browse Products</Link></Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
