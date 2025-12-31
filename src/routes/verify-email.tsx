import { createFileRoute } from "@tanstack/react-router";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const Route = createFileRoute("/verify-email")({
    component: VerifyEmail,
});

function VerifyEmail() {
    const [value, setValue] = useState("");

    const handleVerify = () => {
        // TODO: Implement verification logic
        console.log("Verifying code:", value);
    };

    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle >Verify your email</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <InputOTP
                        maxLength={6}
                        value={value}
                        pattern={REGEXP_ONLY_DIGITS}
                        onChange={(value) => setValue(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button
                        className="w-full mt-4"
                        onClick={handleVerify}
                        disabled={value.length < 6}
                    >
                        Verify Email
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
