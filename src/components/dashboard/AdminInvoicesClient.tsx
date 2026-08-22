"use client";

import React, { useState } from 'react';
import { FileText, Printer, CheckCircle, Search, DollarSign, Calendar, Mail, FileCheck, Landmark } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

interface InvoiceData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: string;
  gatewayResponse: string | null;
  invoiceUrl: string | null;
  createdAt: string;
  track: string;
}

interface AdminInvoicesClientProps {
  invoices: InvoiceData[];
}

const AdminInvoicesClient: React.FC<AdminInvoicesClientProps> = ({ invoices }) => {
  const { tenant } = useTenant();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(invoices[0] || null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredInvoices = invoices.filter(item => 
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethod = (invoice: InvoiceData) => {
    if (!invoice.gatewayResponse) return 'Credit Card';
    try {
      const resp = JSON.parse(invoice.gatewayResponse);
      if (resp.brand) return `${resp.brand.toUpperCase()} (ending in ${resp.last4 || '1234'})`;
      return 'Stripe Checkout';
    } catch (e) {
      return 'Online Gateway';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left Column: Ledger List */}
      <div className="lg:col-span-5 space-y-6 print:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Payment Ledger</h3>
          <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {filteredInvoices.length} Receipts
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search invoice number, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 p-4 pl-12 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-700 placeholder:text-slate-300"
          />
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400">
            No transactions matching criteria.
          </div>
        ) : (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;

              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`glass p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20 scale-[1.01]' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black tracking-wider uppercase">
                        Ref: #{inv.id.substring(0, 8)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm">{inv.userName}</h4>
                      <p className={`text-[10px] font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-sm">{formatCurrency(inv.amount)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider mt-1 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {inv.status === 'succeeded' ? 'PAID' : inv.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Active Invoice details */}
      <div className="lg:col-span-7 print:col-span-12 space-y-6">
        {selectedInvoice ? (
          <div className="space-y-6">
            {/* Action Bar (Print / PDF options) */}
            <div className="flex justify-end gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Certified PDF
              </button>
            </div>

            {/* Printable Invoice Statement Container */}
            <div 
              id="printable-statement" 
              className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden print:shadow-none print:border-none print:p-0 print:rounded-none font-sans"
            >
              {/* Gold Verification Stamp */}
              {selectedInvoice.status === 'succeeded' && (
                <div className="absolute right-10 top-10 border-4 border-amber-500/30 text-amber-600 rounded-full w-24 h-24 flex flex-col justify-center items-center font-black rotate-12 bg-amber-50/50 backdrop-blur-sm border-dashed select-none print:right-4 print:top-4">
                  <span className="text-[8px] uppercase tracking-widest text-amber-500/80 font-bold">Official</span>
                  <span className="text-xs uppercase font-black tracking-widest text-amber-700">VERIFIED</span>
                  <span className="text-[7px] uppercase tracking-widest text-amber-500/80 font-bold truncate max-w-[80px]">{tenant.name}</span>
                </div>
              )}

              {/* Invoice Layout Header */}
              <div className="border-b-2 border-slate-100 pb-8 space-y-6">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="font-black text-xl tracking-tight text-slate-900 uppercase">{tenant.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                  <div>
                    <p className="text-slate-800 font-black">{tenant.name}</p>
                    <p>Digital Academic Operations</p>
                    <p>support@educatech.org</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-800 font-black text-sm uppercase tracking-wider">Tuition Invoice Statement</p>
                    <p className="font-bold text-slate-700 mt-1">Ref: #{selectedInvoice.id}</p>
                    <p>Date Issued: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Student / Parent Payer information */}
              <div className="py-8 border-b-2 border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Billed To</span>
                  <p className="text-sm font-black text-slate-800">{selectedInvoice.userName}</p>
                  <p className="text-slate-400 mt-0.5">{selectedInvoice.userEmail}</p>
                  <p className="text-slate-400 mt-0.5">Program Track: {selectedInvoice.track} Program</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Payment Method</span>
                  <p className="text-slate-800 font-bold flex items-center justify-end gap-1.5"><Landmark className="w-3.5 h-3.5 text-slate-400" /> {getPaymentMethod(selectedInvoice)}</p>
                  <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Receipt Status: PAID
                  </span>
                </div>
              </div>

              {/* Billing Itemization Table */}
              <div className="py-8 space-y-6">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-4 py-3 rounded-l-xl">Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/20">
                      <td className="px-4 py-6">
                        <p className="font-bold text-slate-800">{tenant.name} Tuition Fee</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Full Term enrollment - Track: {selectedInvoice.track}</p>
                      </td>
                      <td className="px-4 py-6 text-center text-slate-500">1</td>
                      <td className="px-4 py-6 text-right text-slate-500">{formatCurrency(selectedInvoice.amount)}</td>
                      <td className="px-4 py-6 text-right font-bold text-slate-800">{formatCurrency(selectedInvoice.amount)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Subtotals & Totals summary */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-3 text-xs font-semibold border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>VAT / Taxes (0%)</span>
                      <span>₦0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-3">
                      <span>Total Paid</span>
                      <span>{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-slate-100 pt-8 text-center text-[10px] font-medium text-slate-400 leading-relaxed">
                <p>This is a computer-generated official receipt verified secure via Stripe Gateway.</p>
                <p className="mt-1">Thank you for partnering with {tenant.name}. May Allah bless your learning and recitation journey.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center text-slate-400">
            Select a payment record from the ledger list to preview statement.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoicesClient;
