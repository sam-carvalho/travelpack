import FeatureList from "./components/feature-list";
import Hero from "./components/hero";

export default function Home() {
  return (
    <div>
      <div className="mt-6 flex flex-col items-center">
        <Hero />
        <FeatureList />
      </div>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]"></footer>
    </div>
  );
}
