import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Megaphone, Pin, Plus, Trash2, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const AnnouncementsWidget: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useTournament();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addAnnouncement(title.trim(), content.trim(), priority, priority === 'urgent');
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <div
      className="p-5 rounded flex flex-col justify-between"
      style={{
        background: 'rgba(17, 17, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 168, 76, 0.18)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4" style={{ color: 'var(--cg-gold)' }} />
          <h2
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--cg-ivory)',
              margin: 0,
            }}
          >
            OFFICIAL NOTICE BOARD
          </h2>
        </div>
        <button
          onClick={() => setIsAdding(prev => !prev)}
          className="cg-btn cg-btn-ghost"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.65rem' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW NOTICE</span>
        </button>
      </div>

      {/* Add Notice Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 rounded space-y-3 animate-in fade-in duration-200"
          style={{
            background: 'rgba(10, 10, 11, 0.85)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
          }}
        >
          <div>
            <label
              className="block text-[11px] font-semibold mb-1"
              style={{ fontFamily: 'var(--font-sans)', color: 'rgba(200, 192, 174, 0.6)' }}
            >
              Notice Heading
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Semifinal matches start time"
              className="w-full px-3 py-1.5 rounded text-xs text-white focus:outline-none"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-semibold mb-1"
              style={{ fontFamily: 'var(--font-sans)', color: 'rgba(200, 192, 174, 0.6)' }}
            >
              Notice Details
            </label>
            <textarea
              required
              rows={2}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Enter announcement text for players & spectators..."
              className="w-full px-3 py-1.5 rounded text-xs text-white focus:outline-none resize-none"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[11px]" style={{ color: 'rgba(200, 192, 174, 0.6)' }}>Priority:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'normal' | 'high' | 'urgent')}
                className="px-2 py-1 rounded text-xs"
                style={{
                  background: 'rgba(17, 17, 20, 0.9)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  color: 'var(--cg-ivory)',
                }}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent (Pinned)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded text-xs"
                style={{ color: 'rgba(200, 192, 174, 0.5)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cg-btn cg-btn-primary"
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.65rem' }}
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {announcements.length === 0 ? (
          <div
            className="text-center py-6 text-xs"
            style={{ color: 'rgba(200, 192, 174, 0.4)', fontFamily: 'var(--font-sans)' }}
          >
            No notices published yet.
          </div>
        ) : (
          announcements.map(ann => {
            let priorityBadge = 'bg-[rgba(201,168,76,0.08)] text-[rgba(200,192,174,0.6)] border-[rgba(201,168,76,0.15)]';
            if (ann.priority === 'urgent') priorityBadge = 'bg-[rgba(192,57,43,0.15)] text-[var(--cg-red-bright)] border-[rgba(192,57,43,0.3)]';
            else if (ann.priority === 'high') priorityBadge = 'bg-[rgba(201,168,76,0.2)] text-[var(--cg-gold-bright)] border-[rgba(201,168,76,0.4)]';

            return (
              <div
                key={ann.id}
                className="p-3.5 rounded transition-all"
                style={{
                  background: ann.isPinned ? 'rgba(201, 168, 76, 0.08)' : 'rgba(10, 10, 11, 0.6)',
                  border: ann.isPinned ? '1px solid rgba(201, 168, 76, 0.35)' : '1px solid rgba(201, 168, 76, 0.12)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    <h4
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--cg-ivory)',
                        margin: 0,
                      }}
                    >
                      {ann.title}
                    </h4>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${priorityBadge}`}>
                      {ann.priority}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1 rounded transition-colors text-slate-500 hover:text-red-400"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p
                  className="mt-1.5 leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'rgba(200, 192, 174, 0.75)',
                    margin: '0.35rem 0 0',
                  }}
                >
                  {ann.content}
                </p>

                <div
                  className="flex items-center gap-1.5 text-[10px] mt-2"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(200, 192, 174, 0.4)' }}
                >
                  <Clock className="w-3 h-3 text-amber-400/60" />
                  <span>{formatDateTime(ann.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnnouncementsWidget;
