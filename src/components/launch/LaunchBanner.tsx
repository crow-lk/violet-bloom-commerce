import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { Button } from "@/components/ui/button";
import { LAUNCH_DATE } from "@/config/launch";

export default function LaunchBanner() {
  return (
    <section className="bg-gradient-to-r from-primary via-violet-600 to-primary text-white py-10">
      <div className="container mx-auto px-4 text-center">

        <h2 className="font-display text-4xl font-bold">
          ChuttakPay is Launching Soon
        </h2>

        <p className="mt-3 text-white/80 max-w-3xl mx-auto">
          Create your account today and save your favourite products.
          Buying will be enabled on launch day.
        </p>

        <Countdown
          date={LAUNCH_DATE}
          renderer={({ days, hours, minutes, seconds }) => (

            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <h1 className="text-5xl font-bold">{days}</h1>
                <p>Days</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <h1 className="text-5xl font-bold">{hours}</h1>
                <p>Hours</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <h1 className="text-5xl font-bold">{minutes}</h1>
                <p>Minutes</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <h1 className="text-5xl font-bold">{seconds}</h1>
                <p>Seconds</p>
              </div>

            </div>

          )}
        />

        <div className="flex justify-center gap-4 mt-8">

          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link to="/account">
              Create Account
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-primary hover:bg-white/20"
          >
            <Link to="/wishlist">
              View Wishlist
            </Link>
          </Button>

        </div>

      </div>
    </section>
  );
}