import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  User,
  Shield,
  CreditCard,
  Star,
  UserPlus,
  LogOut,
  ChevronRight,
} from "lucide-react";

const profileSections = [
  {
    icon: User,
    title: "Personal Info",
    subtitle: "Name, Phone number, Address",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    subtitle: "Block messages, disappearing messages",
  },
  {
    icon: CreditCard,
    title: "Payment & Transactions",
    subtitle: "Payment mode, Transaction History",
  },
  {
    icon: Star,
    title: "My Reviews & Certificates",
    subtitle: "My Ratings, Reviews and Certificates",
  },
  {
    icon: UserPlus,
    title: "Invite a friend",
    subtitle: "",
  },
  {
    icon: LogOut,
    title: "Logout",
    subtitle: "",
  },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-foreground font-display mb-8 underline underline-offset-8 decoration-primary">
            My Profile
          </h1>

          <div className="space-y-3">
            {profileSections.map((section, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-primary/10 transition-colors text-left ${
                  section.title === "Logout" ? "text-destructive" : ""
                }`}
              >
                <section.icon className={`w-6 h-6 ${section.title === "Logout" ? "text-destructive" : "text-primary"}`} />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{section.title}</p>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
