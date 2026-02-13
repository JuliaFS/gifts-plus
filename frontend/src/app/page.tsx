import DashboardPage from "./dashboard/page";


export default function Home() {
  return (
    <div className="w-full flex items-center justify-center font-sans bg-zinc-50 dark:bg-black">
      <div className="flex flex-1 container w-full flex-col items-center justify-between py-6 px-4 md:py-10 md:px-16 bg-white dark:bg-black sm:items-start">
       <div className="w-full"><DashboardPage /></div>
      </div>
    </div>
  );
}
