import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
    Search, MapPin, Wheat, IndianRupee, Leaf, Send, X, SlidersHorizontal, Star,
} from "lucide-react";

interface LandListing {
    id: string;
    area: string;
    location: string;
    pin_code: string;
    price: number;
    land_quality: string;
    crop_feasibility: string;
    is_lended: boolean;
    user_id: string;
    farmer_name?: string;
}

const qualityColors: Record<string, string> = {
    excellent: "bg-emerald-100 text-emerald-700 border-emerald-200",
    good: "bg-primary/10 text-primary border-primary/20",
    average: "bg-amber-100 text-amber-700 border-amber-200",
    poor: "bg-red-100 text-red-700 border-red-200",
};

const BrowseLandsPage = () => {
    const { user } = useAuth();
    const [lands, setLands] = useState<LandListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [qualityFilter, setQualityFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Proposal dialog state
    const [proposalLand, setProposalLand] = useState<LandListing | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [proposalForm, setProposalForm] = useState({
        title: "",
        crop_type: "",
        quantity: "",
        price: "",
        start_date: "",
        end_date: "",
        description: "",
    });

    const fetchLands = async () => {
        setLoading(true);
        // Fetch all non-lended lands (contractor RLS policy allows this)
        const { data: landsData, error } = await supabase
            .from("lands")
            .select("*")
            .eq("is_lended", false)
            .order("created_at", { ascending: false });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setLoading(false);
            return;
        }

        // Fetch farmer names for these lands
        const userIds = [...new Set((landsData || []).map((l: any) => l.user_id))];
        let farmerMap: Record<string, string> = {};

        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from("profiles")
                .select("user_id, full_name")
                .in("user_id", userIds);

            if (profiles) {
                profiles.forEach((p: any) => {
                    farmerMap[p.user_id] = p.full_name;
                });
            }
        }

        const enriched = (landsData || []).map((l: any) => ({
            ...l,
            farmer_name: farmerMap[l.user_id] || "Unknown Farmer",
        }));

        setLands(enriched);
        setLoading(false);
    };

    useEffect(() => {
        fetchLands();
    }, []);

    const filteredLands = lands.filter((land) => {
        const matchesSearch =
            land.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            land.crop_feasibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
            land.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (land.farmer_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesQuality = qualityFilter === "all" || land.land_quality === qualityFilter;
        return matchesSearch && matchesQuality;
    });

    const handleProposalChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProposalForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const openProposalDialog = (land: LandListing) => {
        setProposalLand(land);
        setProposalForm({
            title: `Contract for ${land.crop_feasibility || "crops"} — ${land.location}`,
            crop_type: land.crop_feasibility || "",
            quantity: "",
            price: String(land.price),
            start_date: "",
            end_date: "",
            description: "",
        });
    };

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !proposalLand) return;
        setSubmitting(true);

        const { error } = await supabase.from("contracts").insert({
            title: proposalForm.title,
            description: proposalForm.description,
            crop_type: proposalForm.crop_type,
            quantity: proposalForm.quantity,
            price: parseFloat(proposalForm.price) || 0,
            start_date: proposalForm.start_date || null,
            end_date: proposalForm.end_date || null,
            status: "submitted" as const,
            contractor_id: user.id,
            farmer_id: proposalLand.user_id,
            land_id: proposalLand.id,
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Proposal sent!", description: "The farmer will review your proposal." });
            setProposalLand(null);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-surface-mint py-8">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground font-display underline underline-offset-8 decoration-primary">
                            Browse Available Lands
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Discover fertile lands listed by farmers and send contract proposals.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-card rounded-xl border border-border p-4 mb-6 space-y-3">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by location, crop, area, or farmer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowFilters(!showFilters)}
                                className={showFilters ? "bg-primary/10 border-primary" : ""}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                                <span className="text-sm font-medium text-muted-foreground self-center mr-2">Quality:</span>
                                {["all", "excellent", "good", "average", "poor"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setQualityFilter(q)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${qualityFilter === q
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                            }`}
                                    >
                                        {q === "all" ? "All Qualities" : q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-muted-foreground mb-4">
                        {loading ? "Searching..." : `${filteredLands.length} land${filteredLands.length !== 1 ? "s" : ""} available`}
                    </p>

                    {/* Lands Grid */}
                    {loading ? (
                        <div className="text-center py-16 text-muted-foreground">Loading available lands...</div>
                    ) : filteredLands.length === 0 ? (
                        <div className="text-center py-16">
                            <Leaf className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No matching lands found.</p>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredLands.map((land) => (
                                <div
                                    key={land.id}
                                    className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                                >
                                    {/* Card header with quality badge */}
                                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-4 py-3 border-b border-border flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Wheat className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                                                {land.farmer_name}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${qualityColors[land.land_quality] || qualityColors.good}`}>
                                            {land.land_quality}
                                        </span>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                            <p className="text-sm text-foreground">{land.location}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Area</p>
                                                <p className="font-medium text-foreground">{land.area}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Price</p>
                                                <p className="font-medium text-primary flex items-center gap-0.5">
                                                    <IndianRupee className="w-3.5 h-3.5" />
                                                    {land.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {land.crop_feasibility && (
                                            <div className="flex items-center gap-1.5">
                                                <Leaf className="w-3.5 h-3.5 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">
                                                    Crops: <span className="text-foreground font-medium">{land.crop_feasibility}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card footer */}
                                    <div className="px-4 pb-4">
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={() => openProposalDialog(land)}
                                        >
                                            <Send className="w-4 h-4 mr-1.5" />
                                            Send Proposal
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Proposal Dialog Overlay */}
            {proposalLand && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
                    <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Send Contract Proposal</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    To {proposalLand.farmer_name} — {proposalLand.location}
                                </p>
                            </div>
                            <button onClick={() => setProposalLand(null)} className="text-muted-foreground hover:text-foreground p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProposal} className="p-4 space-y-4">
                            <div>
                                <Label>Proposal Title *</Label>
                                <Input
                                    value={proposalForm.title}
                                    onChange={handleProposalChange("title")}
                                    placeholder="Contract title"
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Crop Type *</Label>
                                    <Input
                                        value={proposalForm.crop_type}
                                        onChange={handleProposalChange("crop_type")}
                                        placeholder="Wheat, Rice..."
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        value={proposalForm.quantity}
                                        onChange={handleProposalChange("quantity")}
                                        placeholder="100 quintals"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Offered Price (₹) *</Label>
                                    <Input
                                        type="number"
                                        value={proposalForm.price}
                                        onChange={handleProposalChange("price")}
                                        placeholder="50000"
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Land Area</Label>
                                    <Input value={proposalLand.area} disabled className="mt-1 bg-secondary" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={proposalForm.start_date}
                                        onChange={handleProposalChange("start_date")}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={proposalForm.end_date}
                                        onChange={handleProposalChange("end_date")}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Description / Terms</Label>
                                <textarea
                                    value={proposalForm.description}
                                    onChange={handleProposalChange("description")}
                                    placeholder="Describe your contract terms, requirements..."
                                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" className="flex-1" disabled={submitting}>
                                    <Send className="w-4 h-4 mr-1.5" />
                                    {submitting ? "Sending..." : "Send Proposal"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setProposalLand(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BrowseLandsPage;
