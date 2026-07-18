"use client";

import { useState } from "react";
import { User, Trash2 } from "lucide-react";

export interface AdminUserRow {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  calendarToken: string | null;
  codeforcesHandle: string | null;
  atcoderHandle: string | null;
  leetcodeHandle: string | null;
  codechefHandle: string | null;
}

interface UsersTabProps {
  users: AdminUserRow[];
  loading: boolean;
  onDelete: (user: AdminUserRow) => void;
  onSelectUser: (user: AdminUserRow) => void;
  onRowClickSound: () => void;
}

export function UsersTab({ users, loading, onDelete, onSelectUser, onRowClickSound }: UsersTabProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 font-mono">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-primary/10 pb-4">
        <div className="text-xs text-muted-foreground/45 flex items-center gap-2">
          <span className="text-primary font-bold">$</span>
          <span>users-admin --list --active</span>
          <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
        </div>

        <div className="relative w-full sm:max-w-xs flex items-center border border-border bg-card/50 focus-within:border-primary/50 transition-colors px-2.5 py-1">
          <span className="text-[10px] text-primary/60 shrink-0 mr-1.5 select-none font-bold">$ grep</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent border-none p-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 h-6 text-foreground font-mono placeholder:text-muted-foreground/35 flex-1"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground/45 font-mono text-xs animate-pulse">
          $ query --table=users
          <br />
          [LOAD] Fetching user records...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="border border-border bg-card/25 p-12 text-center text-xs text-muted-foreground/35 shadow-xl select-none font-mono">
          [INFO] No users found.
        </div>
      ) : (
        <div className="border border-border bg-card/25 overflow-x-auto select-text scrollbar-thin">
          <table className="w-full text-[11px] text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase tracking-wider select-none text-[10px]">
                <th className="py-2.5 px-3">Permissions</th>
                <th className="py-2.5 px-3">Username</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Email verified</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => {
                    onRowClickSound();
                    onSelectUser(u);
                  }}
                  className="hover:bg-primary/[0.02] transition-colors leading-relaxed cursor-pointer"
                >
                  <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rw-r--r--</td>
                  <td className="py-3 px-3 font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                    <span>{u.username}</span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground/60">{u.email}</td>
                  <td className="py-3 px-3 select-none">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                      u.emailVerified 
                        ? "border-success bg-success/5 text-success" 
                        : "border-warning bg-warning/5 text-warning"
                    }`}>
                      {u.emailVerified ? "VERIFIED" : "UNVERIFIED"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground/60">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right select-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClickSound();
                        onDelete(u);
                      }}
                      className="text-[10px] text-muted-foreground/45 hover:text-destructive transition-colors cursor-pointer border border-transparent hover:border-destructive/20 px-1.5 py-0.5"
                    >
                      <span className="flex items-center gap-1 justify-end">
                        <Trash2 className="h-3 w-3" />
                        <span>[purge]</span>
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
