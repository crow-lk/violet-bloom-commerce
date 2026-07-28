import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LAUNCH_DATE } from "@/config/launch";

export default function LaunchCountdown() {
    return (
        <div className="glass rounded-3xl p-10 text-center shadow-purple">

            <h2 className="font-display text-4xl font-bold mb-3">
                 ChuttakPay is Launching Soon
            </h2>

            <p className="text-muted-foreground mb-8">
                Create your account today and start adding your favourite
                products to your wishlist.
            </p>

            <Countdown
                date={LAUNCH_DATE}
                renderer={({ days, hours, minutes, seconds }) => (
                    <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-8">

                        {[
                            ["Days", days],
                            ["Hours", hours],
                            ["Minutes", minutes],
                            ["Seconds", seconds],
                        ].map(([label, value]) => (

                            <div
                                key={label}
                                className="glass rounded-xl p-4"
                            >
                                <h1 className="text-4xl font-bold">
                                    {String(value).padStart(2, "0")}
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    {label}
                                </p>

                            </div>

                        ))}

                    </div>
                )}
            />

            <div className="flex gap-4 justify-center">

                <Button asChild size="lg">
                    <Link to="/account">
                        Create Account
                    </Link>
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    asChild
                >
                    <Link to="/shop">
                        Browse Products
                    </Link>
                </Button>

            </div>

        </div>
    );
}