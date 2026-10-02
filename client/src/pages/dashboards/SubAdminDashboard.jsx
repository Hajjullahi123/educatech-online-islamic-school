import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, API_BASE_URL } from '../../api';

/* ─────────────────────────────────────────────────────────────
   Permission helper – mirrors Layout.jsx logic
───────────────────────────────────────────────────────────── */
const hasPermission = (user, key) => {
  if (!user?.permissions || user.permissions.length === 0) return true;
  return user.permissions.includes(key);
};

/* ─────────────────────────────────────────────────────────────
   All possible quick-link tiles (key = permission key)
───────────────────────────────────────────────────────────── */
const ALL_QUICK_LINKS = [
  { key: 'students',          label: 'Students',         icon: '🎓', color: 'from-blue-500 to-blue-700',     path: '/dashboard/student-management' },
  { key: 'users',             label: 'Users',            icon: '👥', color: 'from-indigo-500 to-indigo-700', path: '/dashboard/users' },
  { key: 'classes',           label: 'Classes',          icon: '🏫', color: 'from-violet-500 to-violet-700', path: '/dashboard/class-management' },
  { key: 'subjects',          label: 'Subjects',         icon: '📚', color: 'from-cyan-500 to-cyan-700',     path: '/dashboard/subject-management' },
  { key: 'attendance',        label: 'Attendance',       icon: '📅', color: 'from-teal-500 to-teal-700',     path: '/dashboard/attendance' },
  { key: 'results',           label: 'Results Entry',    icon: '📝', color: 'from-emerald-500 to-emerald-700', path: '/dashboard/result-entry' },
  { key: 'report_cards',      label: 'Report Cards',     icon: '📄', color: 'from-green-500 to-green-700',   path: '/dashboard/report-cards' },
  { key: 'examinations',      label: 'Examinations',     icon: '🎯', color: 'from-yellow-500 to-yellow-700', path: '/dashboard/examinations' },
  { key: 'results_management',label: 'Results Mgmt',     icon: '📊', color: 'from-orange-500 to-orange-700', path: '/dashboard/results-management' },
  { key: 'fees',              label: 'School Fees',      icon: '💰', color: 'from-amber-500 to-amber-700',   path: '/dashboard/fees' },
  { key: 'admissions',        label: 'Admissions',       icon: '🎒', color: 'from-rose-500 to-rose-700',     path: '/dashboard/admissions' },
  { key: 'notices',           label: 'Notices',          icon: '📢', color: 'from-pink-500 to-pink-700',     path: '/dashboard/notices' },
  { key: 'hr',                label: 'HR & Staff',       icon: '🧑‍💼', color: 'from-slate-500 to-slate-700',  path: '/dashboard/hr-admin' },
  { key: 'lesson_plans',      label: 'Lesson Notes',     icon: '📖', color: 'from-sky-500 to-sky-700',       path: '/dashboard/lesson-notes' },
  { key: 'timetable',         label: 'Timetable',        icon: '🕐', color: 'from-purple-500 to-purple-700', path: '/dashboard/timetable' },
  { key: 'cbt',               label: 'CBT Exams',        icon: '💻', color: 'from-fuchsia-500 to-fuchsia-700', path: '/dashboard/cbt' },
  { key: 'homework',          label: 'Homework',         icon: '✏️', color: 'from-lime-500 to-lime-700',     path: '/dashboard/homework' },
  { key: 'certificates',      label: 'Certificates',     icon: '🏆', color: 'from-gold-500 to-yellow-600',   path: '/dashboard/certificates' },
  { key: 'gallery',           label: 'Gallery',          icon: '🖼️', color: 'from-pink-400 to-rose-600',     path: '/dashboard/gallery' },
  { key: 'analytics',         label: 'Analytics',        icon: '📈', color: 'from-blue-400 to-indigo-600',   path: '/dashboard/performance-trends' },
  { key: 'id_cards',          label: 'ID Cards',         icon: '🪪', color: 'from-gray-500 to-gray-700',     path: '/dashboard/id-cards' },
  { key: 'settings',          label: 'Settings',         icon: '⚙️', color: 'from-slate-600 to-slate-800',   path: '/dashboard/settings' },
  { key: 'calendar',          label: 'Calendar',         icon: '📅', color: 'from-teal-400 to-cyan-600',     path: '/dashboard/school-calendar' },
  { key: 'promotions',        label: 'Promotions',       icon: '🎓', color: 'from-violet-400 to-purple-600', path: '/dashboard/promotions' },
  { key: 'departments',       label: 'Departments',      icon: '🏛️', color: 'from-indigo-400 to-blue-600',   path: '/dashboard/departments' },
  { key: 'resources',         label: 'Resources',        icon: '📂', color: 'from-emerald-400 to-teal-600',  path: '/dashboard/academic-resources' },
];

/* ─────────────────────────────────────────────────────────────
   Shimmer skeleton
───────────────────────────────────────────────────────────── */
const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

/* ─────────────────────────────────────────────────────────────
   Main Dashboard Component
───────────────────────────────────────────────────────────── */
const SubAdminDashboard = ({ user, schoolSettings }) => {
  const [sections, setSections]           = useState([]);
  const [sectionStats, setSectionStats]   = useState({});
  const [schoolStats, setSchoolStats]     = useState(null);
  const [notices, setNotices]             = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchSectionsWithStats(),
      fetchSchoolStats(),
      fetchNotices(),
    ]);
    setLoading(false);
  };

  /* Fetch all sections + their class/student counts for this sub-admin */
  const fetchSectionsWithStats = async () => {
    try {
      const [sectionsRes, assignmentsRes] = await Promise.all([
        api.get('/api/sections'),
        api.get('/api/sections/admin-assignments'),
      ]);

      if (!sectionsRes.ok) return;
      const allSections = await sectionsRes.json();

      let mySectionIds = null;
      if (assignmentsRes.ok) {
        const assignments = await assignmentsRes.json();
        const mine = assignments.filter(a => a.User?.id === user.id);
        if (mine.length > 0) {
          mySectionIds = mine.map(a => a.Section?.id);
        }
      }

      // Filter to only the sections this sub-admin manages (null = all sections)
      const relevantSections = mySectionIds
        ? allSections.filter(s => mySectionIds.includes(s.id))
        : allSections;

      setSections(relevantSections);

      // Fetch student counts per section using classes already included
      const stats = {};
      for (const sec of relevantSections) {
        const classIds = (sec.classes || []).map(c => c.id);
        stats[sec.id] = {
          classCount: classIds.length,
          studentCount: null, // will load separately if needed
        };
      }

      // Get student counts from stats-summary (section-scoped class data)
      try {
        const statsRes = await api.get('/api/settings/stats-summary');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setSectionStats({ total: data.students, classes: data.classes, subjects: data.subjects });
        }
      } catch (_) {}

      setSectionStats(prev => ({ ...prev, sections: stats }));
    } catch (err) {
      console.error('fetchSectionsWithStats error:', err);
    }
  };

  const fetchSchoolStats = async () => {
    try {
      const res = await api.get('/api/settings/stats-summary');
      if (res.ok) {
        const data = await res.json();
        setSchoolStats(data);
      }
    } catch (_) {}
  };

  const fetchNotices = async () => {
    try {
      const res = await api.get('/api/notices?limit=3');
      if (res.ok) {
        const data = await res.json();
        setNotices(Array.isArray(data) ? data.slice(0, 3) : []);
      }
    } catch (_) {}
  };

  // Only show quick links the sub-admin has permission for
  const allowedLinks = ALL_QUICK_LINKS.filter(link => hasPermission(user, link.key));
  const permissionCount = allowedLinks.length;
  const hasNoSectionRestriction = sections.length === 0 ||
    (sections.length > 0 && !user?.sectionAccess?.length);

  const photoSrc = user?.photoUrl
    ? (user.photoUrl.startsWith('data:') || user.photoUrl.startsWith('http')
        ? user.photoUrl
        : `${API_BASE_URL}${user.photoUrl}`)
    : null;

  return (
    <div className="space-y-5">

      {/* ── Hero Welcome Header ───────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-2xl border border-white/5">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {photoSrc ? (
              <img src={photoSrc} alt="Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-xl shadow-indigo-900/30" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/30 flex items-center justify-center text-2xl font-black text-indigo-300">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em]">Sub-Admin Portal</p>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 truncate">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-[10px] font-black uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active Session
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-wide">
                🔑 {permissionCount} Module{permissionCount !== 1 ? 's' : ''} Authorized
              </span>
            </div>
          </div>

          {/* School logo */}
          {schoolSettings?.logoUrl && (
            <div className="hidden sm:block flex-shrink-0">
              <img
                src={schoolSettings.logoUrl.startsWith('http') ? schoolSettings.logoUrl : `${API_BASE_URL}${schoolSettings.logoUrl}`}
                alt="School Logo"
                className="h-12 w-12 object-contain opacity-60"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Top Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Students',  value: schoolStats?.students,  icon: '🎓', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
          { label: 'Active Classes',   value: schoolStats?.classes,   icon: '🏫', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
          { label: 'Subjects',         value: schoolStats?.subjects,  icon: '📚', bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-100' },
          { label: 'Sections Managed', value: sections.length || '—', icon: '🏛️', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
        ].map(({ label, value, icon, bg, text, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${text} mb-1`}>{icon} {label}</p>
            {loading ? (
              <Shimmer className="h-8 w-16 mt-1" />
            ) : (
              <p className={`text-2xl font-black ${text}`}>{value ?? '—'}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Sections Panel ────────────────────────────────────── */}
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
          🏛️ Your Managed Sections
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => <Shimmer key={i} className="h-28" />)}
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-wide">Full School Access</p>
              <p className="text-[11px] text-amber-700 mt-0.5">No section restriction applied — you can manage all sections in this school.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map(section => (
              <div key={section.id}
                className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all group p-5">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {section.code || 'Section'}
                      </p>
                      <h3 className="text-base font-black text-gray-900 mt-0.5">{section.name}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black">
                      {section.name?.[0]}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                      <p className="text-lg font-black text-gray-800">{section.classes?.length ?? 0}</p>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Classes</p>
                    </div>
                    <Link
                      to={`/dashboard/class-management`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl p-2 text-center transition-colors group/btn"
                    >
                      <p className="text-[10px] font-black text-white uppercase tracking-wide group-hover/btn:scale-105 transition-transform">View Classes →</p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Links Grid ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            ⚡ Your Authorized Modules
          </h2>
          <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {permissionCount} / {ALL_QUICK_LINKS.length}
          </span>
        </div>

        {permissionCount === 0 ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-center">
            <p className="text-sm font-black text-rose-700">No modules assigned yet.</p>
            <p className="text-[11px] text-rose-500 mt-1">Contact your school administrator to grant module access.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {allowedLinks.map(link => (
              <Link
                key={link.key}
                to={link.path}
                className={`relative overflow-hidden bg-gradient-to-br ${link.color} rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-[1.04] active:scale-[0.97] transition-all group`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <span className="text-2xl block mb-2">{link.icon}</span>
                  <p className="text-[11px] font-black text-white uppercase tracking-wide leading-tight">{link.label}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Notices Panel ─────────────────────────────────────── */}
      {notices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              📢 Latest Notices
            </h2>
            <Link to="/dashboard/notices"
              className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-wide transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {notices.map(notice => (
              <div key={notice.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-sm flex-shrink-0">
                  📢
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-800 truncate">{notice.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">
                    {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Access Summary Footer ─────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Summary</p>
            <p className="text-xs text-gray-600 mt-0.5">
              <span className="font-black text-indigo-600">{permissionCount} module{permissionCount !== 1 ? 's' : ''}</span> active ·{' '}
              <span className="font-black text-indigo-600">
                {sections.length > 0 ? `${sections.length} section${sections.length !== 1 ? 's' : ''}` : 'All sections'}
              </span> managed
            </p>
          </div>
          <Link to="/dashboard/profile"
            className="text-[10px] font-black text-gray-500 hover:text-indigo-600 uppercase tracking-wide transition-colors">
            View Profile →
          </Link>
        </div>
      </div>

    </div>
  );
};

export default SubAdminDashboard;
