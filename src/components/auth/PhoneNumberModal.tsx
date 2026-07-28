import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
    open: boolean;
    onSubmit: (phone: string) => void;
}

export default function PhoneNumberModal({
    open,
    onSubmit,
}: Props) {
    const [phone, setPhone] = useState("");

    return (
        <Dialog
            open={open}
            onOpenChange={() => {}}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Complete Your Account
                    </DialogTitle>

                    <DialogDescription>
                        Please enter your mobile number before continuing.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="07XXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                />

                <Button
                    disabled={phone.length < 10}
                    onClick={() => onSubmit(phone)}
                >
                    Continue
                </Button>
            </DialogContent>
        </Dialog>
    );
}