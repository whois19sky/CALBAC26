"use client";

import Link from "next/link";
import { ExternalLink, AlertTriangle } from "lucide-react";

// Room management moved to Sanity Studio as of the CMS migration.
// This page intentionally no longer edits Supabase's rooms table, since the
// live site no longer reads from it - editing here would silently do nothing
// visible on the actual website, which was confusing and misleading.
export default function RoomsManagerMovedNotice() {
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-amber-600" size={28} />
        </div>
        <h1 className="text-2xl font-serif text-dark mb-3">Rooms Have Moved</h1>
        <p className="text-dark/60 leading-relaxed mb-8">
          Room management (pricing, photos, features, availability toggle) now lives in your
          Sanity CMS, not here. This page used to edit an older database that the live website
          no longer reads from — any changes made here would not show up on your site.
        </p>
        <a
          href="https://calcuttabackpackers-cms.sanity.studio/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Open Sanity Studio <ExternalLink size={16} />
        </a>
        <div className="mt-6">
          <Link href="/admin" className="text-sm text-dark/50 hover:text-dark underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
