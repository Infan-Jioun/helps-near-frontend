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
                <main className="pt-7 md:pt-12 mb-10">{children}</main>
            </body>
        </html>
    );
}