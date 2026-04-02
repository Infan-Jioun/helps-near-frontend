import React from "react";
import Navbar from "./shared/components/Navbar";
import Footer from "./shared/components/Footer";

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
                <Footer />
            </body>
        </html>
    );
}