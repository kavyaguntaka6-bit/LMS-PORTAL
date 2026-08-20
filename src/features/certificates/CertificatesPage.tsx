import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { certificateService } from '../../services/api';
import {
  Award,
  CheckCircle2,
  Download,
  Share2,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Printer
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockCertificates } from '../../services/mockData';
import { Certificate } from '../../types';

export const CertificatesPage: React.FC = () => {
  const { toast } = useNotifications();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<Certificate | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    setIsVerifying(true);
    try {
      const found = await certificateService.verifyCertificate(verifyInput);
      setVerifyResult(found);
      if (found) {
        toast('Verification Successful', `Certificate ${found.certificateId} is valid.`, 'certificate');
      } else {
        toast('Invalid ID', 'No certificate matched this verification ID.', 'system');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPDF = () => {
    toast('Generating PDF...', 'Your official high-resolution certificate is downloading.', 'system');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Certificates' }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Verified Credentials & Certificates
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          TYC certificates are cryptographically verifiable credentials backed by real project code submissions and passing exam benchmarks.
        </p>
      </div>

      {/* Verification Lookup Tool */}
      <Card className="bg-gradient-to-r from-white via-tyc-bg to-white p-6 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-tyc-green uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Verification Engine</span>
            </div>
            <h3 className="text-base font-bold text-tyc-text">Verify Any Candidate&apos;s TYC Credential</h3>
            <p className="text-xs text-tyc-muted">Enter a Certificate ID (e.g. TYC-2026-REACT-8849) to validate authenticity.</p>
          </div>

          <form onSubmit={handleVerify} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. TYC-2026-REACT-8849"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="text-xs bg-white border border-tyc-border rounded-lg px-3.5 py-2 text-tyc-text focus:outline-none focus:border-tyc-green w-full md:w-64"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={isVerifying}>
              <Search className="w-3.5 h-3.5 mr-1" />
              Verify
            </Button>
          </form>
        </div>

        {/* Verification Result Card */}
        {verifyResult && (
          <div className="p-4 bg-tyc-green-soft/50 border border-tyc-green/30 rounded-xl flex items-start justify-between gap-4 text-xs animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="green" size="sm">Authentic & Verified</Badge>
                <span className="font-mono text-tyc-muted text-[11px]">{verifyResult.certificateId}</span>
              </div>
              <h4 className="font-bold text-tyc-text text-sm">{verifyResult.courseTitle}</h4>
              <p className="text-tyc-muted">
                Awarded to <strong>{verifyResult.studentName}</strong> on {verifyResult.issuedDate} &bull; Instructor: {verifyResult.instructorName}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedCert(verifyResult)}>
              View Certificate
            </Button>
          </div>
        )}
      </Card>

      {/* My Earned Certificates Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-tyc-text">Your Earned Certificates (2)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCertificates.map((cert) => (
            <Card key={cert.id} className="p-6 space-y-4 shadow-subtle border-tyc-green/30">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-tyc-green-soft text-tyc-green">
                  <Award className="w-6 h-6" />
                </div>
                <Badge variant="green" size="sm">Verified (Score: {cert.credentialScore}%)</Badge>
              </div>

              <div>
                <span className="text-[11px] font-mono text-tyc-muted">{cert.certificateId}</span>
                <h4 className="text-base font-bold text-tyc-text mt-0.5">{cert.courseTitle}</h4>
                <p className="text-xs text-tyc-muted mt-1">
                  Issued to <strong>{cert.studentName}</strong> &bull; {cert.issuedDate}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-tyc-border">
                {cert.skills.slice(0, 3).map((sk) => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="primary" size="sm" onClick={() => setSelectedCert(cert)}>
                  View Official Certificate
                </Button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cert.verificationUrl);
                    toast('Link Copied', 'Public verification link copied to clipboard.', 'system');
                  }}
                  className="p-2 rounded-lg border border-tyc-border hover:bg-tyc-bg text-tyc-muted hover:text-tyc-text"
                  title="Share Verification URL"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Official Certificate Preview Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        maxWidth="2xl"
      >
        {selectedCert && (
          <div className="space-y-6">
            {/* Printable Certificate Canvas */}
            <div className="bg-white border-8 border-double border-tyc-border rounded-xl p-8 sm:p-12 text-center relative shadow-modal space-y-6">
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 text-[10px] font-bold text-tyc-green tracking-widest uppercase">
                Traya Yukti Core &bull; Official
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-tyc-muted">
                {selectedCert.certificateId}
              </div>

              <div className="space-y-2 pt-2">
                <div className="w-12 h-12 rounded-xl bg-tyc-green text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  TYC
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-tyc-muted">
                  Certificate of Achievement & Engineering Competence
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-tyc-muted">This is officially certified to</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-tyc-text underline decoration-tyc-green/40 underline-offset-8">
                  {selectedCert.studentName}
                </h2>
                <p className="text-xs text-tyc-muted pt-2 max-w-md mx-auto">
                  for successfully mastering the curriculum, passing all automated benchmark assessments, and publishing approved industry capstones for:
                </p>
                <h3 className="text-lg font-bold text-tyc-green pt-1">
                  {selectedCert.courseTitle}
                </h3>
              </div>

              {/* Skills Verified */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
                {selectedCert.skills.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded font-medium text-tyc-text">
                    {s}
                  </span>
                ))}
              </div>

              {/* Signatures & Verification Stamp */}
              <div className="grid grid-cols-2 pt-6 border-t border-tyc-border text-xs text-tyc-muted">
                <div className="text-left space-y-1">
                  <div className="font-serif italic text-base text-tyc-text">Sarah Chen, Ph.D.</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-tyc-text">Lead Instructor</div>
                  <div className="text-[10px]">Traya Yukti Core Academic Board</div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-mono text-tyc-text font-bold">{selectedCert.issuedDate}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-tyc-text">Issue Date</div>
                  <div className="text-[10px] text-tyc-green font-semibold">Grade: {selectedCert.grade}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-tyc-muted">
                Public URL: <strong className="text-tyc-text">{selectedCert.verificationUrl}</strong>
              </span>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print / Save PDF
                </Button>
                <Button variant="primary" size="sm" onClick={() => setSelectedCert(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
