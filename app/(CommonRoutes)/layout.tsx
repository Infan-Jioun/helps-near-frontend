import React from "react";
import Navbar from "./shared/components/Navbar";

export default function commonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="pt-20">{children}</main>
            </body>
        </html>
    );
}