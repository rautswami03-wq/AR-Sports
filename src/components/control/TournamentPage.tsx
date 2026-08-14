import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, ChevronRight, Trophy, Calendar, Users } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';

export interface TournamentItem {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  tossText: string;
  createdAt: string;
}

const DEFAULT_TOURNAMENTS: TournamentItem[] = [
  {
    id: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
    name: 'Asthavinayak Premier League',
    teamA: 'ASHTAVINAYAK SUPER KINGS',
    teamB: 'ASHTAVINAYAK INDIANS',
    tossText: 'ASHTAVINAYAK INDIANS WON THE TOSS AND OPTED TO BOWL',
    createdAt: '2026-07-24',
  },
  {
    id: 'tourn_ipl_2026',
    name: 'T20 World Trophy Final 2026',
    teamA: 'INDIA',
    teamB: 'AUSTRALIA',
    tossText: 'AUSTRALIA WON THE TOSS AND OPTED TO BOWL',
    createdAt: '2026-07-24',
  },
];

export const TournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<TournamentItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ar_sports_tournaments_v1') || localStorage.getItem('cricscorer_tournaments_v1');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load tournaments:', e);
      }
    }
    return DEFAULT_TOURNAMENTS;
  });

  const saveTournaments = (items: TournamentItem[]) => {
    setTournaments(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ar_sports_tournaments_v1', JSON.stringify(items));
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTourName, setNewTourName] = useState('');

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTourName.trim()) return;

    const newItem: TournamentItem = {
      id: `tourn_${Date.now()}`,
      name: newTourName,
      teamA: 'TEAM 1',
      teamB: 'TEAM 2',
      tossText: 'TOSS PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newItem, ...tournaments];
    saveTournaments(updatedList);
    setShowCreateModal(false);
    setNewTourName('');
    navigate(`/tournament/${newItem.id}`);
  };

  const handleDelete = (id: string) => {
    saveTournaments(tournaments.filter((t) => t.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020408 0%, #070c16 100%)', color: '#f1f5f9' }}>
      <CricNavbar />

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '3px', height: '28px',
              background: 'linear-gradient(180deg, #06b6d4, #8b5cf6)',
              borderRadius: '2px',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#475569', textTransform: 'uppercase' }}>
              Broadcast Studio
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: '42px',
            letterSpacing: '-0.01em',
            color: '#f1f5f9',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            Tournaments
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Create and manage tournaments. Click a tournament to set up matches and go live.
          </p>
        </div>

        {/* Top bar: Nav + Create Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/theme_links"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                color: '#a78bfa', fontSize: '12px', fontWeight: 600,
                textDecoration: 'none', letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              <LinkIcon style={{ width: '13px', height: '13px' }} /> Overlay Links
            </Link>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
              border: '1px solid rgba(6,182,212,0.4)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
              transition: 'all 0.15s',
            }}
          >
            <Plus style={{ width: '15px', height: '15px' }} /> New Tournament
          </button>
        </div>

        {/* Tournament Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tournaments.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'rgba(12,18,32,0.6)',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '16px',
              color: '#475569',
            }}>
              <Trophy style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: '#334155' }} />
              <p style={{ fontWeight: 600, fontSize: '14px' }}>No tournaments yet</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Click "New Tournament" to create your first one</p>
            </div>
          )}

          {tournaments.map((tour, idx) => (
            <div
              key={tour.id}
              style={{
                background: 'linear-gradient(135deg, rgba(14,20,36,0.95) 0%, rgba(10,15,28,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '20px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '3px',
                background: `linear-gradient(180deg, ${idx % 3 === 0 ? '#06b6d4, #0284c7' : idx % 3 === 1 ? '#8b5cf6, #7c3aed' : '#10b981, #059669'})`,
                borderRadius: '14px 0 0 14px',
              }} />

              <div style={{ paddingLeft: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Trophy style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0 }} />
                  <h3 style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '18px', fontWeight: 700,
                    color: '#f1f5f9',
                    letterSpacing: '0.01em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {tour.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    <Users style={{ width: '11px', height: '11px' }} />
                    {tour.teamA} <span style={{ color: '#334155' }}>vs</span> {tour.teamB}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                    <Calendar style={{ width: '11px', height: '11px' }} />
                    {tour.createdAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <Link
                  to={`/tournament/${tour.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                    border: '1px solid rgba(6,182,212,0.35)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 12px rgba(6,182,212,0.25)',
                  }}
                >
                  Open <ChevronRight style={{ width: '13px', height: '13px' }} />
                </Link>

                <button
                  onClick={() => {
                    const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');
                    const shareUrl = `${baseUrl}/#/tournament/${tour.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Tournament Link copied!');
                  }}
                  title="Copy link"
                  style={{
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: '8px', color: '#a78bfa', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <LinkIcon style={{ width: '13px', height: '13px' }} />
                </button>

                <button
                  onClick={() => handleDelete(tour.id)}
                  title="Delete"
                  style={{
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px', color: '#f87171', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(2,4,8,0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div style={{
            background: 'linear-gradient(145deg, #0c1220, #070c16)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '32px',
            maxWidth: '440px', width: '100%',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(6,182,212,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0891b2, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus style={{ width: '18px', height: '18px', color: '#fff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em', textTransform: 'uppercase', fontFamily: "'Rajdhani', sans-serif" }}>
                  New Tournament
                </h2>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>Set up a new tournament to manage matches</p>
              </div>
            </div>

            <form onSubmit={handleCreateTournament}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                  Tournament Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premier League 2026"
                  value={newTourName}
                  onChange={(e) => setNewTourName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(2,4,8,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '12px 14px',
                    color: '#f1f5f9', fontSize: '14px', fontWeight: 600,
                    outline: 'none', transition: 'border-color 0.15s',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '9px', color: '#94a3b8', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                    border: '1px solid rgba(6,182,212,0.4)', borderRadius: '9px',
                    color: '#fff', fontSize: '12px', fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                    boxShadow: '0 4px 16px rgba(6,182,212,0.3)',
                  }}
                >
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
