"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getAllExerciseDetails } from "@/lib/exerciseDatabase";
import { useLanguage } from "@/lib/useLanguage";
import { useUser } from "@/lib/useUser";
import { createClient } from "@/lib/supabase/client";
import {
  ThumbsUp, ThumbsDown, Plus, X, CheckCircle, Trash2,
  Users, Dumbbell, Youtube, Upload, Play,
  Flame, MinusCircle, Search, Loader2,
} from "lucide-react";
import type { MuscleGroup } from "@/lib/store";

type Proposal = {
  id: string;
  user_id: string;
  username: string;
  name: string;
  muscle: string;
  note?: string;
  youtube_url?: string;
  file_data_url?: string;
  file_type?: "image" | "video";
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  downvotes: number;
  created_at: string;
  my_vote?: "up" | "down" | null;
};

type RemovalRequest = {
  id: string;
  user_id: string;
  username: string;
  exercise_slug: string;
  exercise_name: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  downvotes: number;
  created_at: string;
  my_vote?: "up" | "down" | null;
};

const MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Glutes", "Core", "Cardio", "Full Body",
];

const MUSCLE_NL: Partial<Record<MuscleGroup, string>> = {
  Chest: "Borst", Back: "Rug", Shoulders: "Schouders",
  Biceps: "Biceps", Triceps: "Triceps", Legs: "Benen",
  Glutes: "Billen", Core: "Core", Cardio: "Cardio", "Full Body": "Volledig lichaam",
};

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ─── Vote row ─────────────────────────────────────────────────────────────────
function VoteRow({ upvotes, downvotes, myVote, disabled, nl, onUp, onDown }: {
  upvotes: number; downvotes: number;
  myVote: "up" | "down" | null | undefined;
  disabled: boolean; nl: boolean;
  onUp: () => void; onDown: () => void;
}) {
  const score = upvotes - downvotes;
  return (
    <div className="flex items-center gap-3 pt-1 border-t border-gray-800">
      <button onClick={onUp} disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500"
          : myVote === "up" ? "bg-green-600/20 border-green-600/50 text-green-400"
          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-green-600/50 hover:text-green-400"
        }`}>
        <ThumbsUp className="w-4 h-4" /><span>{upvotes}</span>
      </button>
      <button onClick={onDown} disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500"
          : myVote === "down" ? "bg-red-600/20 border-red-600/50 text-red-400"
          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-red-600/50 hover:text-red-400"
        }`}>
        <ThumbsDown className="w-4 h-4" /><span>{downvotes}</span>
      </button>
      <span className={`text-sm font-semibold ml-auto ${score > 0 ? "text-green-400" : score < 0 ? "text-red-400" : "text-gray-500"}`}>
        {score > 0 ? "+" : ""}{score} {nl ? "netto" : "net"}
      </span>
    </div>
  );
}

// ─── Media preview ────────────────────────────────────────────────────────────
function MediaPreview({ proposal }: { proposal: Proposal }) {
  const [playing, setPlaying] = useState(false);
  const ytId = proposal.youtube_url ? extractYoutubeId(proposal.youtube_url) : null;

  if (proposal.file_data_url && proposal.file_type === "image") {
    return <img src={proposal.file_data_url} alt={proposal.name} className="w-full max-h-72 object-cover rounded-xl" />;
  }
  if (proposal.file_data_url && proposal.file_type === "video") {
    return <video src={proposal.file_data_url} controls className="w-full max-h-72 rounded-xl bg-black" playsInline />;
  }
  if (ytId) {
    if (playing) {
      return (
        <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
          <iframe className="absolute inset-0 w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title="Exercise video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    return (
      <button onClick={() => setPlaying(true)}
        className="relative w-full rounded-xl overflow-hidden group cursor-pointer"
        style={{ paddingBottom: "56.25%", display: "block" }}>
        <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="thumbnail"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
          <p className="text-white text-xs font-medium flex items-center gap-1 drop-shadow">
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </p>
        </div>
      </button>
    );
  }
  return null;
}

// ─── Proposal card ────────────────────────────────────────────────────────────
function ProposalCard({ proposal, adminMode, nl, onVote, onApprove, onDelete }: {
  proposal: Proposal; adminMode: boolean; nl: boolean;
  onVote: (id: string, dir: "up" | "down") => void;
  onApprove: (id: string) => void; onDelete: (id: string) => void;
}) {
  const isHot = proposal.upvotes >= 5 && proposal.status === "pending";
  const hasMedia = !!(proposal.file_data_url || proposal.youtube_url);

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-colors ${
      proposal.status === "approved" ? "border-green-700/30" : isHot ? "border-purple-700/40" : "border-gray-800"
    }`}>
      {hasMedia && <div className="border-b border-gray-800"><MediaPreview proposal={proposal} /></div>}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{proposal.name}</h3>
              {isHot && (
                <span className="flex items-center gap-1 text-xs bg-orange-600/20 border border-orange-700/40 text-orange-400 px-1.5 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" /> Trending
                </span>
              )}
              {proposal.status === "approved" && (
                <span className="text-xs bg-green-600/20 border border-green-700/40 text-green-400 px-2 py-0.5 rounded-full">
                  {nl ? "Toegevoegd ✓" : "Added ✓"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                {nl ? (MUSCLE_NL[proposal.muscle as MuscleGroup] ?? proposal.muscle) : proposal.muscle}
              </span>
              <span className="text-xs text-gray-600">door {proposal.username}</span>
              <span className="text-xs text-gray-600">
                {new Date(proposal.created_at).toLocaleDateString(nl ? "nl-NL" : "en-US", { day: "numeric", month: "short" })}
              </span>
            </div>
          </div>
          {adminMode && (
            <div className="flex gap-1.5 shrink-0">
              {proposal.status === "pending" && (
                <button onClick={() => onApprove(proposal.id)}
                  className="p-1.5 rounded-lg bg-green-600/20 border border-green-700/40 text-green-400 hover:bg-green-600/30 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => onDelete(proposal.id)}
                className="p-1.5 rounded-lg bg-red-600/20 border border-red-700/40 text-red-400 hover:bg-red-600/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {proposal.note && <p className="text-sm text-gray-400 leading-relaxed">{proposal.note}</p>}
        <VoteRow
          upvotes={proposal.upvotes} downvotes={proposal.downvotes}
          myVote={proposal.my_vote} disabled={proposal.status !== "pending"} nl={nl}
          onUp={() => proposal.status === "pending" && onVote(proposal.id, "up")}
          onDown={() => proposal.status === "pending" && onVote(proposal.id, "down")}
        />
      </div>
    </div>
  );
}

// ─── Removal card ─────────────────────────────────────────────────────────────
function RemovalCard({ request, adminMode, nl, onVote, onApprove, onDelete }: {
  request: RemovalRequest; adminMode: boolean; nl: boolean;
  onVote: (id: string, dir: "up" | "down") => void;
  onApprove: (id: string) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-colors ${
      request.status === "approved" ? "border-red-700/30" : "border-gray-800"
    }`}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <MinusCircle className="w-4 h-4 text-red-400 shrink-0" />
              <h3 className="font-semibold text-base">{request.exercise_name}</h3>
              {request.status === "approved" && (
                <span className="text-xs bg-red-600/20 border border-red-700/40 text-red-400 px-2 py-0.5 rounded-full">
                  {nl ? "Verwijderd ✓" : "Removed ✓"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-600">door {request.username}</span>
              <span className="text-xs text-gray-600">
                {new Date(request.created_at).toLocaleDateString(nl ? "nl-NL" : "en-US", { day: "numeric", month: "short" })}
              </span>
            </div>
          </div>
          {adminMode && (
            <div className="flex gap-1.5 shrink-0">
              {request.status === "pending" && (
                <button onClick={() => onApprove(request.id)}
                  className="p-1.5 rounded-lg bg-red-600/20 border border-red-700/40 text-red-400 hover:bg-red-600/30 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => onDelete(request.id)}
                className="p-1.5 rounded-lg bg-gray-700/50 border border-gray-700 text-gray-400 hover:bg-gray-700 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {request.reason && (
          <div className="bg-gray-800/60 rounded-xl px-3 py-2.5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{nl ? "Reden" : "Reason"}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{request.reason}</p>
          </div>
        )}
        <VoteRow
          upvotes={request.upvotes} downvotes={request.downvotes}
          myVote={request.my_vote} disabled={request.status !== "pending"} nl={nl}
          onUp={() => request.status === "pending" && onVote(request.id, "up")}
          onDown={() => request.status === "pending" && onVote(request.id, "down")}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { lang } = useLanguage();
  const nl = lang === "nl";
  const { user } = useUser();
  const supabase = createClient();

  const [tab, setTab] = useState<"proposals" | "removals">("proposals");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [removals, setRemovals] = useState<RemovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [submitted, setSubmitted] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Proposal form
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup>("Chest");
  const [note, setNote] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Removal form
  const [showRemovalForm, setShowRemovalForm] = useState(false);
  const [removalSearch, setRemovalSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<{ name: string; slug: string } | null>(null);
  const [removalReason, setRemovalReason] = useState("");

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Anoniem";

  // ─── Load data ───────────────────────────────────────────────────────────────
  const loadProposals = useCallback(async () => {
    const { data: props } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (!props) return;

    if (user) {
      const { data: votes } = await supabase
        .from("proposal_votes")
        .select("proposal_id, direction")
        .eq("user_id", user.id);

      const voteMap = new Map(votes?.map((v) => [v.proposal_id, v.direction]) ?? []);
      setProposals(props.map((p) => ({ ...p, my_vote: voteMap.get(p.id) ?? null })));
    } else {
      setProposals(props.map((p) => ({ ...p, my_vote: null })));
    }
  }, [user]);

  const loadRemovals = useCallback(async () => {
    const { data: reqs } = await supabase
      .from("removal_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!reqs) return;

    if (user) {
      const { data: votes } = await supabase
        .from("removal_votes")
        .select("removal_id, direction")
        .eq("user_id", user.id);

      const voteMap = new Map(votes?.map((v) => [v.removal_id, v.direction]) ?? []);
      setRemovals(reqs.map((r) => ({ ...r, my_vote: voteMap.get(r.id) ?? null })));
    } else {
      setRemovals(reqs.map((r) => ({ ...r, my_vote: null })));
    }
  }, [user]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([loadProposals(), loadRemovals()]);
      setLoading(false);
    }
    load();
  }, [loadProposals, loadRemovals]);

  // ─── Vote on proposal ────────────────────────────────────────────────────────
  async function handleProposalVote(proposalId: string, direction: "up" | "down") {
    if (!user) return;

    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    const existingVote = proposal.my_vote;

    // Optimistic update
    setProposals((prev) => prev.map((p) => {
      if (p.id !== proposalId) return p;
      let { upvotes, downvotes } = p;

      if (existingVote === direction) {
        // Undo vote
        if (direction === "up") upvotes--;
        else downvotes--;
        return { ...p, upvotes, downvotes, my_vote: null };
      } else {
        // Switch or new vote
        if (existingVote === "up") upvotes--;
        if (existingVote === "down") downvotes--;
        if (direction === "up") upvotes++;
        else downvotes++;
        return { ...p, upvotes, downvotes, my_vote: direction };
      }
    }));

    if (existingVote === direction) {
      // Delete vote
      await supabase.from("proposal_votes").delete()
        .eq("proposal_id", proposalId).eq("user_id", user.id);
      const delta = direction === "up" ? -1 : 0;
      const deltaDown = direction === "down" ? -1 : 0;
      await supabase.from("proposals").update({
        upvotes: proposal.upvotes + delta,
        downvotes: proposal.downvotes + deltaDown,
      }).eq("id", proposalId);
    } else if (existingVote) {
      // Switch vote
      await supabase.from("proposal_votes").update({ direction })
        .eq("proposal_id", proposalId).eq("user_id", user.id);
      await supabase.from("proposals").update({
        upvotes: proposal.upvotes + (direction === "up" ? 1 : -1),
        downvotes: proposal.downvotes + (direction === "down" ? 1 : -1),
      }).eq("id", proposalId);
    } else {
      // New vote
      await supabase.from("proposal_votes").insert({ proposal_id: proposalId, user_id: user.id, direction });
      await supabase.from("proposals").update({
        upvotes: proposal.upvotes + (direction === "up" ? 1 : 0),
        downvotes: proposal.downvotes + (direction === "down" ? 1 : 0),
      }).eq("id", proposalId);
    }
  }

  // ─── Vote on removal ─────────────────────────────────────────────────────────
  async function handleRemovalVote(removalId: string, direction: "up" | "down") {
    if (!user) return;

    const request = removals.find((r) => r.id === removalId);
    if (!request) return;

    const existingVote = request.my_vote;

    setRemovals((prev) => prev.map((r) => {
      if (r.id !== removalId) return r;
      let { upvotes, downvotes } = r;
      if (existingVote === direction) {
        if (direction === "up") upvotes--; else downvotes--;
        return { ...r, upvotes, downvotes, my_vote: null };
      } else {
        if (existingVote === "up") upvotes--;
        if (existingVote === "down") downvotes--;
        if (direction === "up") upvotes++; else downvotes++;
        return { ...r, upvotes, downvotes, my_vote: direction };
      }
    }));

    if (existingVote === direction) {
      await supabase.from("removal_votes").delete()
        .eq("removal_id", removalId).eq("user_id", user.id);
      await supabase.from("removal_requests").update({
        upvotes: request.upvotes + (direction === "up" ? -1 : 0),
        downvotes: request.downvotes + (direction === "down" ? -1 : 0),
      }).eq("id", removalId);
    } else if (existingVote) {
      await supabase.from("removal_votes").update({ direction })
        .eq("removal_id", removalId).eq("user_id", user.id);
      await supabase.from("removal_requests").update({
        upvotes: request.upvotes + (direction === "up" ? 1 : -1),
        downvotes: request.downvotes + (direction === "down" ? 1 : -1),
      }).eq("id", removalId);
    } else {
      await supabase.from("removal_votes").insert({ removal_id: removalId, user_id: user.id, direction });
      await supabase.from("removal_requests").update({
        upvotes: request.upvotes + (direction === "up" ? 1 : 0),
        downvotes: request.downvotes + (direction === "down" ? 1 : 0),
      }).eq("id", removalId);
    }
  }

  // ─── Submit proposal ─────────────────────────────────────────────────────────
  async function handleSubmitProposal() {
    if (!user || !name.trim() || !(youtubeUrl.trim() || fileDataUrl)) return;
    setSubmitting(true);

    const { error } = await supabase.from("proposals").insert({
      user_id: user.id,
      username,
      name: name.trim(),
      muscle,
      note: note.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
      file_data_url: fileDataUrl || null,
      file_type: fileType || null,
    });

    if (!error) {
      setName(""); setNote(""); setYoutubeUrl("");
      setFileDataUrl(null); setFileType(null); setFileName(""); setFileError("");
      setMuscle("Chest");
      setShowProposalForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      await loadProposals();
    }
    setSubmitting(false);
  }

  // ─── Submit removal ──────────────────────────────────────────────────────────
  async function handleSubmitRemoval() {
    if (!user || !selectedExercise || !removalReason.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("removal_requests").insert({
      user_id: user.id,
      username,
      exercise_slug: selectedExercise.slug,
      exercise_name: selectedExercise.name,
      reason: removalReason.trim(),
    });

    if (!error) {
      setRemovalSearch(""); setSelectedExercise(null); setRemovalReason("");
      setShowRemovalForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      await loadRemovals();
    }
    setSubmitting(false);
  }

  // ─── Admin actions ───────────────────────────────────────────────────────────
  async function handleApproveProposal(id: string) {
    await supabase.from("proposals").update({ status: "approved" }).eq("id", id);
    await loadProposals();
  }

  async function handleDeleteProposal(id: string) {
    await supabase.from("proposals").delete().eq("id", id);
    setProposals((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleApproveRemoval(id: string) {
    await supabase.from("removal_requests").update({ status: "approved" }).eq("id", id);
    await loadRemovals();
  }

  async function handleDeleteRemoval(id: string) {
    await supabase.from("removal_requests").delete().eq("id", id);
    setRemovals((prev) => prev.filter((r) => r.id !== id));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFileError(nl ? "Bestand te groot (max 10MB)" : "File too large (max 10MB)");
      return;
    }
    setFileError(""); setFileName(file.name);
    setFileType(file.type.startsWith("video") ? "video" : "image");
    const reader = new FileReader();
    reader.onload = (ev) => setFileDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const hasMedia = !!(youtubeUrl.trim() || fileDataUrl);
  const canSubmitProposal = !!name.trim() && hasMedia;
  const canSubmitRemoval = !!selectedExercise && removalReason.trim().length > 0;

  const allExercises = getAllExerciseDetails().map((e) => ({ name: e.name, slug: e.id }));
  const filteredExercises = removalSearch.trim()
    ? allExercises.filter((e) => e.name.toLowerCase().includes(removalSearch.toLowerCase()))
    : allExercises;

  const filteredProposals = proposals
    .filter((p) => filter === "all" || p.status === filter)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));

  const filteredRemovals = removals
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));

  return (
    <div className="sm:ml-52 space-y-5 pb-16 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Community
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {nl ? "Stem mee over oefeningen in de library" : "Vote on exercises in the library"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!adminMode && (
            <button onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-xs text-gray-700 hover:text-gray-500 transition-colors px-2 py-1">
              Admin
            </button>
          )}
          {adminMode && (
            <span className="text-xs bg-orange-600/20 border border-orange-700/40 text-orange-400 px-2.5 py-1 rounded-full">
              Admin
            </span>
          )}
          {user && (
            <button
              onClick={() => tab === "proposals" ? setShowProposalForm(true) : setShowRemovalForm(true)}
              className={`flex items-center gap-1.5 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                tab === "proposals" ? "bg-purple-600 hover:bg-purple-500" : "bg-red-700 hover:bg-red-600"
              }`}>
              <Plus className="w-4 h-4" />
              {tab === "proposals" ? (nl ? "Voorstel" : "Propose") : (nl ? "Verwijderverzoek" : "Request removal")}
            </button>
          )}
        </div>
      </div>

      {/* Admin login */}
      {showAdminLogin && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <span className="text-sm text-gray-400">Admin code:</span>
          <input type="password" value={adminInput} onChange={(e) => setAdminInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (adminInput === "dkb2024" ? (setAdminMode(true), setShowAdminLogin(false), setAdminInput("")) : null)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            placeholder="••••••••" />
          <button onClick={() => { if (adminInput === "dkb2024") { setAdminMode(true); setShowAdminLogin(false); setAdminInput(""); }}}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
            OK
          </button>
        </div>
      )}

      {/* Not logged in banner */}
      {!user && (
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-sm text-purple-300">
          {nl ? "Log in om te stemmen of voorstellen in te dienen." : "Log in to vote or submit proposals."}{" "}
          <a href="/login" className="underline hover:text-purple-200">{nl ? "Inloggen" : "Log in"}</a>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className="bg-green-600/15 border border-green-700/40 text-green-400 text-sm px-4 py-3 rounded-xl">
          {nl ? "✓ Ingediend! De community kan nu stemmen." : "✓ Submitted! The community can now vote."}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
        <button onClick={() => { setTab("proposals"); setFilter("all"); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "proposals" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-gray-200"
          }`}>
          <Plus className="w-4 h-4" />
          {nl ? "Toevoegen" : "Add exercise"}
          <span className="text-xs text-gray-600">{proposals.length}</span>
        </button>
        <button onClick={() => { setTab("removals"); setFilter("all"); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "removals" ? "bg-red-600/20 text-red-400" : "text-gray-400 hover:text-gray-200"
          }`}>
          <MinusCircle className="w-4 h-4" />
          {nl ? "Verwijderen" : "Remove exercise"}
          <span className="text-xs text-gray-600">{removals.length}</span>
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved"] as const).map((f) => {
          const count = tab === "proposals"
            ? (f === "all" ? proposals.length : proposals.filter((p) => p.status === f).length)
            : (f === "all" ? removals.length : removals.filter((r) => r.status === f).length);
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === f
                  ? tab === "proposals" ? "bg-purple-600/20 border-purple-700/40 text-purple-400" : "bg-red-600/20 border-red-700/40 text-red-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}>
              {f === "all" ? (nl ? "Alle" : "All") : f === "pending" ? (nl ? "In stemming" : "Voting") : (nl ? "Afgehandeld" : "Handled")}
              <span className="ml-1.5 text-gray-600">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── PROPOSAL FORM MODAL ─────────────────────────────────────────────── */}
      {showProposalForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-400" />
                {nl ? "Oefening voorstellen" : "Propose exercise"}
              </h2>
              <button onClick={() => setShowProposalForm(false)} className="text-gray-500 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={nl ? "Naam van de oefening *" : "Exercise name *"}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder-gray-600" />
            <select value={muscle} onChange={(e) => setMuscle(e.target.value as MuscleGroup)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-gray-300">
              {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{nl ? MUSCLE_NL[m] : m}</option>)}
            </select>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={nl ? "Waarom wil je deze oefening toevoegen? (optioneel)" : "Why add this exercise? (optional)"}
              rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none" />
            <div className={`space-y-3 rounded-xl border p-4 ${hasMedia ? "border-purple-700/40 bg-purple-900/10" : "border-gray-700"}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {nl ? "Uitvoering (verplicht — kies minimaal 1)" : "Execution (required — at least 1)"}
              </p>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="YouTube link (bijv. https://youtu.be/...)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder-gray-600" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="flex-1 h-px bg-gray-800" />
                {nl ? "of upload een bestand" : "or upload a file"}
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                {fileDataUrl ? (
                  <div className="space-y-2">
                    {fileType === "image"
                      ? <img src={fileDataUrl} alt="preview" className="w-full max-h-48 object-cover rounded-xl" />
                      : <video src={fileDataUrl} controls className="w-full max-h-48 rounded-xl bg-black" />}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 truncate">{fileName}</span>
                      <button onClick={() => { setFileDataUrl(null); setFileType(null); setFileName(""); }}
                        className="text-xs text-red-400 hover:text-red-300 ml-2 shrink-0">
                        {nl ? "Verwijderen" : "Remove"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-700 hover:border-purple-600/50 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">{nl ? "Klik om foto of video te uploaden" : "Click to upload photo or video"}</span>
                    <span className="text-xs text-gray-600">JPG, PNG, MP4, MOV · max 10MB</span>
                  </button>
                )}
                {fileError && <p className="text-xs text-red-400 mt-1">{fileError}</p>}
              </div>
            </div>
            {!hasMedia && (
              <p className="text-xs text-yellow-500 text-center">
                {nl ? "⚠ Voeg een YouTube link of bestand toe om in te dienen" : "⚠ Add a YouTube link or file to submit"}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowProposalForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-xl transition-colors">
                {nl ? "Annuleren" : "Cancel"}
              </button>
              <button onClick={handleSubmitProposal} disabled={!canSubmitProposal || submitting}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {nl ? "Indienen" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVAL FORM MODAL ──────────────────────────────────────────────── */}
      {showRemovalForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-red-400" />
                {nl ? "Verwijderverzoek indienen" : "Request exercise removal"}
              </h2>
              <button onClick={() => setShowRemovalForm(false)} className="text-gray-500 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">{nl ? "Zoek de oefening die verwijderd moet worden *" : "Search the exercise to remove *"}</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={removalSearch} onChange={(e) => { setRemovalSearch(e.target.value); setSelectedExercise(null); }}
                  placeholder={nl ? "Typ om te zoeken…" : "Type to search…"}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 placeholder-gray-600" />
              </div>
              {selectedExercise ? (
                <div className="mt-2 flex items-center justify-between bg-red-900/20 border border-red-700/40 rounded-xl px-3 py-2">
                  <span className="text-sm text-red-300 font-medium">{selectedExercise.name}</span>
                  <button onClick={() => setSelectedExercise(null)} className="text-gray-500 hover:text-gray-300 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : removalSearch.trim() ? (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredExercises.length === 0 ? (
                    <p className="text-xs text-gray-500 p-3">{nl ? "Geen oefeningen gevonden." : "No exercises found."}</p>
                  ) : filteredExercises.map((ex) => (
                    <button key={ex.slug} onClick={() => { setSelectedExercise(ex); setRemovalSearch(""); }}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-0">
                      {ex.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">{nl ? "Reden voor verwijdering *" : "Reason for removal *"}</p>
              <textarea value={removalReason} onChange={(e) => setRemovalReason(e.target.value)}
                placeholder={nl ? "Leg uit waarom deze oefening verwijderd moet worden…" : "Explain why this exercise should be removed…"}
                rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 placeholder-gray-600 resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowRemovalForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-xl transition-colors">
                {nl ? "Annuleren" : "Cancel"}
              </button>
              <button onClick={handleSubmitRemoval} disabled={!canSubmitRemoval || submitting}
                className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {nl ? "Indienen" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FEEDS ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
        </div>
      ) : tab === "proposals" ? (
        filteredProposals.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Dumbbell className="w-10 h-10 text-gray-700 mx-auto" />
            <p className="text-gray-500 text-sm">{nl ? "Nog geen voorstellen." : "No proposals yet."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} adminMode={adminMode} nl={nl}
                onVote={handleProposalVote}
                onApprove={handleApproveProposal}
                onDelete={handleDeleteProposal} />
            ))}
          </div>
        )
      ) : (
        filteredRemovals.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <MinusCircle className="w-10 h-10 text-gray-700 mx-auto" />
            <p className="text-gray-500 text-sm">{nl ? "Nog geen verwijderverzoeken." : "No removal requests yet."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRemovals.map((r) => (
              <RemovalCard key={r.id} request={r} adminMode={adminMode} nl={nl}
                onVote={handleRemovalVote}
                onApprove={handleApproveRemoval}
                onDelete={handleDeleteRemoval} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
