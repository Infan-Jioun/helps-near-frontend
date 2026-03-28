import Navbar from "./shared/components/Navbar";

export default function commonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Navbar />
        { children }
    );
}
