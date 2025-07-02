export default function Header() {
  return (
    <header className="bg-blue-900 text-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto"
          />
        </div>
        <span className="text-sm text-blue-200">React + Firebase + Tailwind</span>
      </div>
    </header>
  );
}
