import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCatalog } from "@/hooks/useCatalog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
  const { wishlist } = useWishlist();
  const { products } = useCatalog();
  const { user, isLoading, login, register, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [profileForm, setProfileForm] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "", mobile: user.mobile || "" });
    }
  }, [user]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && authForm.password !== authForm.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    const success = isSignUp
      ? await register({ name: authForm.name, email: authForm.email, mobile: authForm.mobile, password: authForm.password })
      : await login(authForm.email, authForm.password);

    if (!success) {
      toast({ title: "Authentication failed", description: "Please check your details and try again.", variant: "destructive" });
    } else {
      setAuthForm({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      mobile: profileForm.mobile || null,
    });
    if (success) {
      toast({ title: "Profile updated" });
    } else {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  if (isLoading && !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="glass rounded-2xl p-8 shadow-purple">
            <h1 className="font-display text-2xl font-bold text-center mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label>Name</Label>
                    <Input required className="mt-1" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Mobile</Label>
                    <Input className="mt-1" value={authForm.mobile} onChange={(e) => setAuthForm({ ...authForm, mobile: e.target.value })} />
                  </div>
                </>
              )}
              <div>
                <Label>Email</Label>
                <Input type="email" required className="mt-1" placeholder="you@example.com" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" required className="mt-1" placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
              </div>
              {isSignUp && (
                <div>
                  <Label>Confirm Password</Label>
                  <Input type="password" required className="mt-1" placeholder="••••••••" value={authForm.confirmPassword} onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })} />
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isSignUp ? "Sign Up" : "Log In"}
              </Button>
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
          <Button variant="outline" onClick={logout}>
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
              <form className="space-y-4" onSubmit={handleProfileUpdate}>
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1" value={profileForm.mobile} onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })} />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Order History</h2>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Order history will appear here once the backend provides an orders endpoint.</p>
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
