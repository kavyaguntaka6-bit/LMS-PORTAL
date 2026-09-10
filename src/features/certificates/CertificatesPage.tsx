import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { certificateService } from '../../services/api';
import {
  Award,
  CheckCircle2,
  Download,
  Search,
  ShieldCheck,
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Verified Credentials & Certificates
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          TYC certificates are cryptographically verifiable credentials backed by real project code submissions and passing exam benchmarks.
        </p>
      </div>

      {/* Verification Lookup Tool */}
      <Card className="bg-gradient-to-r from-white via-slate-50 to-white dark:from-[#0D121F] dark:via-[#161F30] dark:to-[#0D121F] p-6 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Verification Engine</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verify Any Candidate&apos;s TYC Credential</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter a Certificate ID (e.g. TYC-2026-REACT-8849) to validate authenticity.</p>
          </div>

          <form onSubmit={handleVerify} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. TYC-2026-REACT-8849"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="text-xs bg-white dark:bg-[#0D121F] border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={isVerifying}>
              <Search className="w-3.5 h-3.5 mr-1" />
              Verify
            </Button>
          </form>
        </div>

        {/* Verification Result Card */}
        {verifyResult && (
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start justify-between gap-4 text-xs animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="green" size="sm">Authentic & Verified</Badge>
                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{verifyResult.certificateId}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{verifyResult.courseTitle}</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Issued to <strong className="text-slate-900 dark:text-white">{verifyResult.studentName}</strong> on {verifyResult.issuedDate}. Grade: {verifyResult.grade}.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={() => setSelectedCert(verifyResult)}>
              View Certificate
            </Button>
          </div>
        )}
      </Card>

      {/* Earned Certificates Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Earned Credentials ({mockCertificates.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCertificates.map((cert) => (
            <Card key={cert.id} hoverable className="p-6 space-y-5 relative overflow-hidden">
              {/* Corner Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black py-1 text-center rotate-45 translate-x-7 translate-y-3 shadow-sm">
                  VERIFIED
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <Badge variant="green" size="sm" className="mb-1">Issued {cert.issuedDate}</Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{cert.courseTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: {cert.instructorName}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Credential ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{cert.certificateId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Evaluation Grade:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cert.grade}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 text-xs"
                >
                  Inspect Credential
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificate Modal Showcase */}
      {selectedCert && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCert(null)}
          size="2xl"
        >
          <div className="p-2 sm:p-6 space-y-6">
            {/* Diploma UI */}
            <div className="relative border-4 border-amber-400/60 bg-gradient-to-b from-white to-amber-50/20 dark:from-[#0D121F] dark:to-[#161F30] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-amber-400/30 pb-4">
                <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  TYC VERIFIED CERTIFICATION
                </div>
                <div className="text-xs font-mono text-slate-400">
                  ID: {selectedCert.certificateId}
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white">
                  Certificate of Competence
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">This is to officially certify that</p>
              </div>

              <div className="py-2 border-b-2 border-dashed border-amber-300 dark:border-amber-800 max-w-sm mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {selectedCert.studentName}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                has demonstrated industry proficiency and successfully fulfilled all capstone and examination requirements for
              </p>

              <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {selectedCert.courseTitle}
              </h4>

              <div className="pt-6 grid grid-cols-2 gap-8 border-t border-amber-400/30 text-xs">
                <div className="text-left space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">{selectedCert.instructorName}</div>
                  <div className="text-slate-500 dark:text-slate-400">Lead Curriculum Architect</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">{selectedCert.issuedDate}</div>
                  <div className="text-slate-500 dark:text-slate-400">Date of Award</div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Cryptographically Sealed
              </span>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print / Save PDF
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
