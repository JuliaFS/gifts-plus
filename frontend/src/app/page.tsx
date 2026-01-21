import DashboardPage from "./dashboard/page";


export default function Home() {
  return (
    <div className="flex items-center justify-center font-sans bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 container w-full flex-col items-center justify-between py-10 px-16 bg-white dark:bg-black sm:items-start">
       <div><DashboardPage /></div>
      </main>
    </div>
  );
}
