import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Shield, Eye, EyeOff, Fingerprint, Key, Smartphone,
  AlertTriangle, Loader2, Lock, UserCheck, Briefcase,
  UserPlus, CheckCircle2, Stethoscope, ArrowRight, User,
  Heart, Building2, UserCircle
} from 'lucide-react';

const ADMIN_PRESETS = [
  {
    name: 'Dr. Evelyn Vance, MD',
    role: 'Chief Medical Officer / Lead Admin',
    adminId: 'ADM-9001',
    pin: '9999',
    department: 'Executive Medical Leadership',
  },
  {
    name: 'Arthur Hastings, MBA',
    role: 'Director of Hospital Operations',
    adminId: 'ADM-1002',
    pin: '1234',
    department: 'Hospital Administration & HR',
  },
];

const CLINICAL_PRESETS = [
  { name: 'Dr. Sharma, MD', role: 'Attending Intensivist', email: 'sharma.md@metrohealth.org', staffId: 'DOC-84729', color: '#2563eb', initials: 'DS' },
  { name: 'Nurse Priya, RN', role: 'Primary Bedside BSN', email: 'priya.rn@metrohealth.org', staffId: 'RN-88219', color: '#059669', initials: 'NP' },
  { name: 'Pharm. Dave', role: 'Clinical Pharmacist', email: 'dave.pharm@metrohealth.org', staffId: 'PH-31405', color: '#7c3aed', initials: 'PD' },
  { name: 'Admin Elena', role: 'Ward Supervisor', email: 'elena.admin@metrohealth.org', staffId: 'ADM-2001', color: '#d97706', initials: 'AE' },
];

const PATIENT_PRESETS = [
  { name: 'Rahul Patil', mrn: '94021-08', bed: 'Bed ICU-12', diagnosis: 'Septic Shock', pin: '1234', initials: 'RP', color: '#0b4da2' },
  { name: 'Anita Desai', mrn: '94022-15', bed: 'Bed ICU-14', diagnosis: 'Type 2 Diabetes', pin: '1234', initials: 'AD', color: '#0284c7' },
  { name: 'Rajesh Sharma', mrn: '94023-08', bed: 'Bed ICU-08', diagnosis: 'Post-op Bowel Resection', pin: '1234', initials: 'RS', color: '#0d9488' },
  { name: 'Meera Iyer', mrn: '94024-03', bed: 'Bed ICU-03', diagnosis: 'COPD Exacerbation', pin: '1234', initials: 'MI', color: '#7c3aed' },
];

const STAFF_PRESETS = [
  {
    name: 'Arjun Mehta, MLS',
    badgeId: 'LT-44201',
    roleLabel: 'LAB & BLOOD BANK',
    initials: 'AM',
    avatarBg: '#8b5cf6',
    borderActive: '#8b5cf6',
    bgActive: '#f5f3ff',
    department: 'Central Pathology & Blood Bank',
    pin: '1234',
  },
  {
    name: 'Pooja Sharma, RT(R)',
    badgeId: 'RT-55102',
    roleLabel: 'IMAGING & RADIOLOGY',
    initials: 'PS',
    avatarBg: '#06b6d4',
    borderActive: '#06b6d4',
    bgActive: '#ecfeff',
    department: 'Diagnostic Radiology & CT Imaging',
    pin: '1234',
  },
  {
    name: 'Nurse Suresh Verma, RN',
    badgeId: 'CN-40192',
    roleLabel: 'CARE COORDINATOR',
    initials: 'SV',
    avatarBg: '#10b981',
    borderActive: '#10b981',
    bgActive: '#ecfdf5',
    department: 'Ward Resource Management & Care Coordination',
    pin: '1234',
  },
  {
    name: 'Nurse Kavita Nair, RN',
    badgeId: 'RN-55219',
    roleLabel: 'CHARGE & SAFETY',
    initials: 'KN',
    avatarBg: '#f97316',
    borderActive: '#f97316',
    bgActive: '#fff7ed',
    department: 'Acute Inpatient Care & Medication Safety',
    pin: '1234',
  },
];

export default function LoginPage() {
  const { login, loginAsReceptionist, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab: 'admin' | 'clinical' | 'patient' | 'receptionist' | 'staff'
  const [activeTab, setActiveTab] = useState<'admin' | 'clinical' | 'patient' | 'receptionist' | 'staff'>('admin');

  // Admin form state
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(0);
  const [adminId, setAdminId] = useState('ADM-9001');
  const [adminPin, setAdminPin] = useState('9999');
  const [showAdminPin, setShowAdminPin] = useState(false);

  // Clinical form state
  const [clinicalEmail, setClinicalEmail] = useState('priya.rn@metrohealth.org');
  const [clinicalPassword, setClinicalPassword] = useState('SmartMed@2024');
  const [showClinicalPass, setShowClinicalPass] = useState(false);
  const [selectedMfa, setSelectedMfa] = useState<'biometric' | 'yubikey' | 'otp'>('biometric');

  // Patient form state
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [patientMrn, setPatientMrn] = useState('94021-08');
  const [patientPin, setPatientPin] = useState('1234');
  const [showPatientPin, setShowPatientPin] = useState(false);

  // Hospital Staff form state
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const [staffBadgeId, setStaffBadgeId] = useState('LT-44201');
  const [staffPin, setStaffPin] = useState('1234');
  const [showStaffPin, setShowStaffPin] = useState(false);

  const [error, setError] = useState('');

  const handleAdminSelect = (idx: number) => {
    setSelectedAdminIndex(idx);
    setAdminId(ADMIN_PRESETS[idx].adminId);
    setAdminPin(ADMIN_PRESETS[idx].pin);
  };

  const handleClinicalSelect = (preset: typeof CLINICAL_PRESETS[0]) => {
    setClinicalEmail(preset.email);
    setClinicalPassword('SmartMed@2024');
  };

  const handlePatientSelect = (idx: number) => {
    setSelectedPatientIndex(idx);
    setPatientMrn(PATIENT_PRESETS[idx].mrn);
    setPatientPin(PATIENT_PRESETS[idx].pin);
  };

  const handleStaffSelect = (idx: number) => {
    setSelectedStaffIndex(idx);
    setStaffBadgeId(STAFF_PRESETS[idx].badgeId);
    setStaffPin(STAFF_PRESETS[idx].pin);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ staffId: staffBadgeId.trim(), pin: staffPin.trim() });
      navigate('/staff');
    } catch (err: any) {
      const respMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Hospital Staff authentication failed.';
      setError(String(respMsg));
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ adminId: adminId.trim(), pin: adminPin.trim() });
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor');
      } else if (user.role === 'NURSE') {
        navigate('/nurse');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      const respMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Admin authentication failed.';
      setError(String(respMsg));
    }
  };

  const handleEnrollShortcut = async () => {
    setError('');
    try {
      await login({ adminId: 'ADM-9001', pin: '9999' });
      navigate('/admin?enroll=true');
    } catch (err: any) {
      setError('Failed to enter enrollment mode.');
    }
  };

  const handleClinicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ email: clinicalEmail.trim(), password: clinicalPassword.trim() });
      if (user.role === 'NURSE') navigate('/nurse');
      else if (user.role === 'DOCTOR') navigate('/doctor');
      else if (user.role === 'PHARMACIST') navigate('/prescriptions');
      else navigate('/admin');
    } catch (err: any) {
      const respMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Clinical authentication failed.';
      setError(String(respMsg));
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ mrn: patientMrn.trim(), pin: patientPin.trim(), isPatient: true });
      navigate('/patient-portal');
    } catch (err: any) {
      const respMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Patient authentication failed. Check MRN & Passcode.';
      setError(String(respMsg));
    }
  };

  const handleReceptionistLogin = async () => {
    setError('');
    try {
      await loginAsReceptionist();
    } catch (err) {
      console.error('Receptionist login error:', err);
    }
    navigate('/receptionist');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#070f1e',
      backgroundImage: 'radial-gradient(ellipse at 50% 10%, #172847 0%, #070f1e 75%)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
              SmartMedChart
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
              Hospital Inpatient, Staff &amp; Patient Administration System
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleReceptionistLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: 9999,
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 700,
              color: '#22d3ee',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={13} />
            <span>Receptionist Desk</span>
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 9999,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 700,
            color: '#38bdf8',
            letterSpacing: '0.04em'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            SECURE SERVER ACTIVE
          </div>
        </div>
      </header>

      {/* Main Centered Login Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: '#ffffff',
          borderRadius: 22,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          padding: '28px 24px 24px',
          color: '#0f172a'
        }}>
          {/* Top 5-Way Segmented Navigation Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            backgroundColor: '#f1f5f9',
            padding: 4,
            borderRadius: 14,
            marginBottom: 24,
            gap: 3
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: activeTab === 'admin' ? '#0b4da2' : 'transparent',
                color: activeTab === 'admin' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'admin' ? '0 2px 8px rgba(11, 77, 162, 0.35)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Shield size={12} />
              <span>1. Admin</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('clinical'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: activeTab === 'clinical' ? '#0b4da2' : 'transparent',
                color: activeTab === 'clinical' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'clinical' ? '0 2px 8px rgba(11, 77, 162, 0.35)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Stethoscope size={12} />
              <span>2. Clinical</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('patient'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: activeTab === 'patient' ? '#0b4da2' : 'transparent',
                color: activeTab === 'patient' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'patient' ? '0 2px 8px rgba(11, 77, 162, 0.35)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Heart size={12} />
              <span>3. Patients</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('receptionist'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: activeTab === 'receptionist' ? '#0b4da2' : 'transparent',
                color: activeTab === 'receptionist' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'receptionist' ? '0 2px 8px rgba(11, 77, 162, 0.35)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Building2 size={12} />
              <span>4. Reception</span>
            </button>

            <button
              id="tab-hospital-staff-btn"
              type="button"
              onClick={() => { setActiveTab('staff'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: activeTab === 'staff' ? '#0b4da2' : 'transparent',
                color: activeTab === 'staff' ? '#ffffff' : '#64748b',
                boxShadow: activeTab === 'staff' ? '0 2px 8px rgba(11, 77, 162, 0.35)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              <Briefcase size={12} />
              <span>5. Hospital Staff</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: ADMINISTRATOR LOGIN                                */}
          {/* ======================================================== */}
          {activeTab === 'admin' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(145deg, #0b4da2, #0284c7)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(11, 77, 162, 0.28)',
                  marginBottom: 12
                }}>
                  <Shield size={26} color="#ffffff" />
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 9999,
                    marginBottom: 6
                  }}>
                    LEVEL 4 ROOT AUTHORITY
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                  Administrator Login
                </h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Sign in with your Admin ID to manage &amp; enroll doctors, nurses, pharmacists, and support staff.
                </p>
              </div>

              {/* Preset Selector */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SELECT AUTHORIZED ADMINISTRATOR:
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7' }}>
                    2 PRESET PROFILES
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {ADMIN_PRESETS.map((admin, idx) => {
                    const isSelected = selectedAdminIndex === idx && adminId === admin.adminId;
                    return (
                      <div
                        key={admin.adminId}
                        onClick={() => handleAdminSelect(idx)}
                        style={{
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                          borderRadius: 10,
                          padding: '8px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          {idx === 0 ? <UserCheck size={14} color="#2563eb" /> : <Briefcase size={14} color="#475569" />}
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {admin.name}
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                          {admin.adminId} &bull; PIN: {admin.pin}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin Form */}
              <form onSubmit={handleAdminSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                    Administrator ID / Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="e.g. ADM-9001"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        fontSize: 13,
                        fontWeight: 600,
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 9,
                        outline: 'none',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                    Admin Security Passcode / PIN
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showAdminPin ? 'text' : 'password'}
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter Admin PIN"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 38px',
                        fontSize: 14,
                        letterSpacing: showAdminPin ? '0' : '0.2em',
                        fontWeight: 700,
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 9,
                        outline: 'none',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showAdminPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 12, marginBottom: 14 }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: 10,
                    backgroundColor: '#0a499f',
                    backgroundImage: 'linear-gradient(180deg, #0d5ec4 0%, #0a499f 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(13, 94, 196, 0.35)'
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /><span>Verifying Authority...</span></>
                  ) : (
                    <><span>Authenticate &amp; Enter Admin Hub</span><ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 12px' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    HOSPITAL STAFF ENROLLMENT
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
                </div>

                <button
                  type="button"
                  onClick={handleEnrollShortcut}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    backgroundColor: '#ffffff',
                    border: '1.5px dashed #93c5fd',
                    color: '#0369a1',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <UserPlus size={15} />
                  <span>Enroll New Doctor, Nurse, or Staff</span>
                </button>
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>256-bit TLS Encrypted &bull; HIPAA &amp; NHS Digital Compliant</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CLINICAL STAFF LOGIN                              */}
          {/* ======================================================== */}
          {activeTab === 'clinical' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(145deg, #059669, #10b981)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(16, 185, 129, 0.25)',
                  marginBottom: 10
                }}>
                  <Stethoscope size={24} color="#ffffff" />
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 9999,
                    marginBottom: 6
                  }}>
                    BEDSIDE eMAR &amp; CPOE
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '4px 0 4px', letterSpacing: '-0.02em' }}>
                  Clinical Staff Sign In
                </h2>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                  Metropolitan General Hospital &bull; Ward 4B ICU &bull; Shift 07:00–15:00
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    QUICK CLINICIAN SIMULATION:
                  </span>
                  <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 600 }}>Auto-fills Form</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {CLINICAL_PRESETS.map((p) => {
                    const isSelected = clinicalEmail === p.email;
                    return (
                      <button
                        key={p.email}
                        type="button"
                        onClick={() => handleClinicalSelect(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 9px',
                          borderRadius: 9,
                          border: `1.5px solid ${isSelected ? p.color : '#e2e8f0'}`,
                          backgroundColor: isSelected ? `${p.color}10` : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: p.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {p.initials}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 9, color: '#64748b' }}>{p.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleClinicalSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Clinician Staff ID / Hospital SSO Email
                  </label>
                  <input
                    type="email"
                    value={clinicalEmail}
                    onChange={(e) => setClinicalEmail(e.target.value)}
                    placeholder="e.g. priya.rn@metrohealth.org"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      fontSize: 13,
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 8,
                      outline: 'none',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                      Clinical Passphrase / PIN
                    </label>
                    <span style={{ fontSize: 10, color: '#2563eb', cursor: 'pointer' }}>Reset PIN?</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showClinicalPass ? 'text' : 'password'}
                      value={clinicalPassword}
                      onChange={(e) => setClinicalPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 36px 9px 12px',
                        fontSize: 13,
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 8,
                        outline: 'none',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowClinicalPass(!showClinicalPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showClinicalPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    SECONDARY VERIFICATION (MANDATORY FOR CPOE)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {[
                      { key: 'biometric', label: 'Biometric Touch', sub: 'COW-08 Sensor', icon: Fingerprint },
                      { key: 'yubikey', label: 'YubiKey FIDO', sub: 'Slot 1 Ready', icon: Key },
                      { key: 'otp', label: 'Hospital Pager', sub: 'Push Alert', icon: Smartphone },
                    ].map(({ key, label, sub, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedMfa(key as any)}
                        style={{
                          padding: '8px 6px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: selectedMfa === key ? '#eff6ff' : '#f8fafc',
                          border: `1.5px solid ${selectedMfa === key ? '#2563eb' : '#e2e8f0'}`,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={16} color={selectedMfa === key ? '#2563eb' : '#64748b'} style={{ margin: '0 auto 2px' }} />
                        <div style={{ fontSize: 10, fontWeight: 700, color: selectedMfa === key ? '#1d4ed8' : '#334155' }}>{label}</div>
                        <div style={{ fontSize: 8, color: '#94a3b8' }}>{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 12, marginBottom: 12 }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 9,
                    backgroundColor: '#16a34a',
                    backgroundImage: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /><span>Authenticating Clinical Session...</span></>
                  ) : (
                    <><Shield size={16} /><span>Authenticate &amp; Open Clinical Chart</span></>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PATIENT PORTAL LOGIN                              */}
          {/* ======================================================== */}
          {activeTab === 'patient' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(145deg, #0b4da2, #0284c7)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(11, 77, 162, 0.25)',
                  marginBottom: 10
                }}>
                  <Heart size={24} color="#ffffff" />
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 9999,
                    marginBottom: 6
                  }}>
                    INPATIENT MYCHART ACCESS
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '4px 0 4px', letterSpacing: '-0.02em' }}>
                  Patient &amp; Family Sign In
                </h2>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                  Enter your MRN to review medications, doses given by nurses, and safety precautions.
                </p>
              </div>

              {/* Quick Patient Selection */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SELECT ADMITTED INPATIENT (DEMO):
                  </span>
                  <span style={{ fontSize: 10, color: '#0b4da2', fontWeight: 700 }}>4 Active Patients</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {PATIENT_PRESETS.map((p, idx) => {
                    const isSelected = selectedPatientIndex === idx && patientMrn === p.mrn;
                    return (
                      <button
                        key={p.mrn}
                        type="button"
                        onClick={() => handlePatientSelect(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 9px',
                          borderRadius: 9,
                          border: `1.5px solid ${isSelected ? p.color : '#e2e8f0'}`,
                          backgroundColor: isSelected ? `${p.color}10` : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: p.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {p.initials}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>
                            {p.mrn} &bull; {p.bed}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Form */}
              <form onSubmit={handlePatientSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Medical Record Number (MRN)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <UserCircle size={16} />
                    </div>
                    <input
                      type="text"
                      value={patientMrn}
                      onChange={(e) => setPatientMrn(e.target.value)}
                      placeholder="e.g. 94021-08"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        fontSize: 13,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 8,
                        outline: 'none',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                      Bed Passcode / PIN (Default: 1234)
                    </label>
                    <span style={{ fontSize: 10, color: '#0b4da2', cursor: 'pointer' }} onClick={() => setPatientPin('1234')}>Use 1234</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPatientPin ? 'text' : 'password'}
                      value={patientPin}
                      onChange={(e) => setPatientPin(e.target.value)}
                      placeholder="Enter 4-digit PIN"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 36px 9px 36px',
                        fontSize: 13,
                        letterSpacing: showPatientPin ? '0' : '0.2em',
                        fontWeight: 700,
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 8,
                        outline: 'none',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPatientPin(!showPatientPin)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showPatientPin ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 12, marginBottom: 12 }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 9,
                    backgroundColor: '#0b4da2',
                    backgroundImage: 'linear-gradient(180deg, #0d5ec4 0%, #0a499f 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(11, 77, 162, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /><span>Opening MyChart Session...</span></>
                  ) : (
                    <><Heart size={16} /><span>Access My Medical Chart</span></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={12} color="#16a34a" /> Protected by Hospital Patient Privacy &amp; HIPAA eMAR Gateway
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: RECEPTIONIST & ADMISSIONS DESK                    */}
          {/* ======================================================== */}
          {activeTab === 'receptionist' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 8px 16px -4px rgba(6, 182, 212, 0.4)'
                }}>
                  <Building2 size={26} color="#ffffff" />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                  Receptionist &amp; Admissions Desk
                </h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  OPD Registration, Inpatient Admissions, QR Wristbands &amp; Ward Bed Mapping
                </p>
              </div>

              {/* Station Card */}
              <div
                id="receptionist-station-card"
                onClick={handleReceptionistLogin}
                style={{
                  backgroundColor: '#f0fdfa',
                  border: '1.5px solid #99f6e4',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 18,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(13, 148, 136, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.backgroundColor = '#ecfdf5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#99f6e4';
                  e.currentTarget.style.backgroundColor = '#f0fdfa';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                      PS
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#134e4a' }}>Priya Sen, Receptionist</div>
                      <div style={{ fontSize: 11, color: '#0f766e' }}>Station: Front Desk Admissions 01</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: 9999 }}>
                    ON DUTY
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#115e59', lineHeight: 1.4, marginTop: 6 }}>
                  Direct access to Patient Triage, OPD Queue, Doctor Allotment, Bed Map &amp; Printable Health Passes.
                </div>
              </div>

              <button
                id="launch-receptionist-portal-btn"
                type="button"
                onClick={handleReceptionistLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  backgroundColor: '#0891b2',
                  backgroundImage: 'linear-gradient(180deg, #0891b2 0%, #0e7490 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Building2 size={18} />
                <span>Launch Receptionist Portal</span>
              </button>

              <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={12} color="#0d9488" /> Hospital Central Admissions &amp; EHR Live Sync Active
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: HOSPITAL STAFF PORTAL                             */}
          {/* ======================================================== */}
          {activeTab === 'staff' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(145deg, #0b4da2, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 8px 18px rgba(11, 77, 162, 0.28)'
                }}>
                  <Building2 size={26} color="#ffffff" />
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 9999,
                    marginBottom: 6
                  }}>
                    ALLIED &amp; HOSPITAL SERVICES
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                  Hospital Staff Portal
                </h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Pathology Lab &bull; Diagnostic Radiology &bull; Care Coordination &bull; Operations
                </p>
              </div>

              {/* Preset Selector */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SELECT HOSPITAL STAFF (DEMO):
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7' }}>
                    4 Preset Roles
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {STAFF_PRESETS.map((preset, idx) => {
                    const isSelected = selectedStaffIndex === idx && staffBadgeId === preset.badgeId;
                    return (
                      <div
                        key={preset.badgeId}
                        onClick={() => handleStaffSelect(idx)}
                        style={{
                          border: `1.5px solid ${isSelected ? preset.borderActive : '#e2e8f0'}`,
                          backgroundColor: isSelected ? preset.bgActive : '#ffffff',
                          borderRadius: 10,
                          padding: '8px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: isSelected ? `0 2px 8px ${preset.borderActive}25` : 'none'
                        }}
                      >
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: preset.avatarBg,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10.5,
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {preset.initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {preset.name}
                          </div>
                          <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {preset.badgeId} &bull; {preset.roleLabel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staff ID & PIN Form */}
              <form onSubmit={handleStaffSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Hospital Staff ID / Badge Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      value={staffBadgeId}
                      onChange={(e) => setStaffBadgeId(e.target.value)}
                      placeholder="e.g. LT-44201"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#0f172a',
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Staff Passcode / Security PIN
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showStaffPin ? 'text' : 'password'}
                      value={staffPin}
                      onChange={(e) => setStaffPin(e.target.value)}
                      placeholder="••••"
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 38px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPin(!showStaffPin)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showStaffPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#b91c1c',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16
                  }}>
                    <AlertTriangle size={15} color="#b91c1c" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  id="authenticate-staff-portal-btn"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    backgroundColor: '#0b4da2',
                    backgroundImage: 'linear-gradient(180deg, #0d5ec4 0%, #0a499f 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(11, 77, 162, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /><span>Authenticating Staff...</span></>
                  ) : (
                    <><Building2 size={16} /><span>Authenticate &amp; Enter Staff Portal</span><ArrowRight size={15} /></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Shield size={12} color="#0284c7" />
                <span>Pathology &bull; Radiology &bull; Care Coordination &bull; Operations</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Page Footer */}
      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 12,
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>
          Administrator Support
        </span>
        <span>&bull;</span>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>
          Clinical Security Policy
        </span>
        <span>&bull;</span>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}>
          Patient Rights &amp; Privacy Notice
        </span>
      </footer>
    </div>
  );
}
