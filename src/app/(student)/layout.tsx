import { StudentLayout } from "@/components/StudentLayout";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <StudentLayout>{children}</StudentLayout>;
}
