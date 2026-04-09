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
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}