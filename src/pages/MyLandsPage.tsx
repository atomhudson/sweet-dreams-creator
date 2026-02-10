import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import farmLand from "@/assets/farm-land.jpg";
import monsoonCrops from "@/assets/monsoon-crops.jpg";

const landsData = {
  lended: [
    {
      image: farmLand,
      area: "1000*1000 sq. feet",
      location: "Mewati, Haryana",
      price: "₹10,000",
    },
    {
      image: monsoonCrops,
      area: "900*900 sq. feet",
      location: "Raahghar, Haryana",
      price: "₹10,000",
    },
  ],
  nonLended: [
    {
      image: farmLand,
      area: "500*500 sq. feet",
      location: "Palwal, Haryana",
      price: "₹5,000",
    },
  ],
};

const MyLandsPage = () => {
  const [tab, setTab] = useState<"lended" | "nonLended">("lended");

  const currentLands = landsData[tab];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-foreground font-display mb-6 underline underline-offset-8 decoration-primary">
            My Lands
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setTab("lended")}
              className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                tab === "lended"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Lended
            </button>
            <button
              onClick={() => setTab("nonLended")}
              className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                tab === "nonLended"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Non Lended
            </button>
          </div>

          {/* Land Cards */}
          <div className="space-y-4">
            {currentLands.map((land, i) => (
              <div
                key={i}
                className="flex gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={land.image}
                  alt={`Land at ${land.location}`}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Area:</span> {land.area}
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    <span className="font-semibold">Location:</span> {land.location}
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    <span className="font-semibold">Price:</span> {land.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyLandsPage;
