export function Card({ children, classes }: { children: React.ReactNode, classes?: string }) {
    return (
        <div
            className={`p-4 rounded-xl shadow shadow-white ${classes}`}
        >
            <div>{children}</div>
        </div>
    );
}