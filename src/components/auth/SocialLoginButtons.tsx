import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface Props {
  onGoogle: () => void;
  onFacebook: () => void;
}

export default function SocialLoginButtons({
  onGoogle,
  onFacebook,
}: Props) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 flex items-center gap-3"
        onClick={onGoogle}
      >
        <FcGoogle size={22} />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 flex items-center gap-3"
        onClick={onFacebook}
      >
        <FaFacebook
          size={20}
          className="text-[#1877F2]"
        />
        Continue with Facebook
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}