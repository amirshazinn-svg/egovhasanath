import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Edit2,
  IndianRupee,
  Calendar,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import {
  StudentFee,
  MonthlyFeeStatus,
  getStudentFees,
  getStudentFeeOverview,
  getMonthlyFees,
  addPayment,
  adjustMonthlyFee,
  formatMonth,
  getCurrentAcademicYear,
  MonthlyFeeExpectation,
} from '@/data/feeMockData';

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentAdded: () => void;
  preSelectedStudentId?: string;
}

interface AllocationPreview {
  month: string;
  expectedAmount: number;
  currentBalance: number;
  amountToApply: number;
  newBalance: number;
  willClear: boolean;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  open,
  onOpenChange,
  onPaymentAdded,
  preSelectedStudentId,
}) => {
  const [students, setStudents] = useState<StudentFee[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentFee | null>(null);
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [monthlyStatus, setMonthlyStatus] = useState<MonthlyFeeStatus[]>([]);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFeeExpectation[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [receiptIssued, setReceiptIssued] = useState(false);
  
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load students on mount
  useEffect(() => {
    if (open) {
      loadStudents();
      resetForm();
    }
  }, [open]);

  // Pre-select student if provided
  useEffect(() => {
    if (preSelectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === preSelectedStudentId);
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, [preSelectedStudentId, students]);

  // Load student fee details when selected
  useEffect(() => {
    if (selectedStudent) {
      loadStudentFeeDetails();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    const academicYear = getCurrentAcademicYear();
    const data = await getStudentFees(academicYear.id);
    setStudents(data);
  };

  const loadStudentFeeDetails = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const [overview, fees] = await Promise.all([
        getStudentFeeOverview(selectedStudent.id),
        getMonthlyFees(selectedStudent.id),
      ]);
      setMonthlyStatus(overview.monthlyStatus);
      setMonthlyFees(fees);
      
      // Initialize adjustments with current expected amounts
      const adj: Record<string, string> = {};
      fees.forEach(f => {
        adj[f.month] = f.expectedAmount.toString();
      });
      setAdjustments(adj);
    } catch (error) {
      console.error('Error loading student fee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setRemarks('');
    setReceiptIssued(false);
    setShowAdjustment(false);
    setAdjustments({});
    setMonthlyStatus([]);
    setMonthlyFees([]);
  };

  // Calculate allocation preview based on current amount and adjustments
  const allocationPreview = useMemo((): AllocationPreview[] => {
    const paymentAmount = parseFloat(amount) || 0;
    if (paymentAmount <= 0 || monthlyStatus.length === 0) return [];

    let remaining = paymentAmount;
    const preview: AllocationPreview[] = [];

    // Apply adjustments to get effective balances
    const effectiveBalances = monthlyStatus.map(status => {
      const adjustedAmount = parseFloat(adjustments[status.month] || status.expectedAmount.toString());
      const paidAmount = status.paidAmount;
      return {
        ...status,
        expectedAmount: adjustedAmount,
        balance: Math.max(0, adjustedAmount - paidAmount),
      };
    });

    for (const status of effectiveBalances) {
      if (status.balance > 0 && remaining > 0) {
        const amountToApply = Math.min(remaining, status.balance);
        const newBalance = status.balance - amountToApply;
        
        preview.push({
          month: status.month,
          expectedAmount: status.expectedAmount,
          currentBalance: status.balance,
          amountToApply,
          newBalance,
          willClear: newBalance === 0,
        });
        
        remaining -= amountToApply;
      }
    }

    return preview;
  }, [amount, monthlyStatus, adjustments]);

  const totalPending = useMemo(() => {
    return monthlyStatus.reduce((sum, s) => {
      const adjusted = parseFloat(adjustments[s.month] || s.expectedAmount.toString());
      return sum + Math.max(0, adjusted - s.paidAmount);
    }, 0);
  }, [monthlyStatus, adjustments]);

  const paymentAmount = parseFloat(amount) || 0;
  const isOverpayment = paymentAmount > totalPending;
  const remainingAfterPayment = Math.max(0, totalPending - paymentAmount);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(s => 
      s.studentName.toLowerCase().includes(query) ||
      s.className.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const handleAdjustmentChange = (month: string, value: string) => {
    setAdjustments(prev => ({ ...prev, [month]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      // First apply any adjustments
      const hasAdjustments = monthlyFees.some(mf => {
        const adjusted = parseFloat(adjustments[mf.month] || mf.expectedAmount.toString());
        return adjusted !== mf.expectedAmount;
      });

      if (hasAdjustments) {
        for (const mf of monthlyFees) {
          const adjusted = parseFloat(adjustments[mf.month] || mf.expectedAmount.toString());
          if (adjusted !== mf.expectedAmount) {
            await adjustMonthlyFee(
              selectedStudent.id,
              mf.month,
              mf.month,
              adjusted,
              'Adjusted during payment entry'
            );
          }
        }
      }

      // Then add the payment
      await addPayment(
        selectedStudent.id,
        parseFloat(amount),
        paymentDate,
        remarks || undefined,
        receiptIssued
      );

      toast.success(`Payment of ₹${amount} added for ${selectedStudent.studentName}`);
      onPaymentAdded();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add payment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Add Payment
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {/* Student Selector */}
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto py-2"
                  >
                    {selectedStudent ? (
                      <div className="flex items-center gap-2 text-left">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{selectedStudent.studentName}</p>
                          <p className="text-xs text-muted-foreground">{selectedStudent.className}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Search student...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search by name or class..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No student found.</CommandEmpty>
                      <CommandGroup>
                        {filteredStudents.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={student.studentName}
                            onSelect={() => {
                              setSelectedStudent(student);
                              setStudentSearchOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <p className="font-medium">{student.studentName}</p>
                                <p className="text-xs text-muted-foreground">{student.className}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Student Fee Summary */}
            {selectedStudent && !loading && monthlyStatus.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Pending</span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalPending)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Unpaid months</span>
                    <span className="text-sm">
                      {monthlyStatus.filter(s => s.status !== 'paid').length} months
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-12 bg-muted rounded" />
                </CardContent>
              </Card>
            )}

            {/* Payment Details */}
            {selectedStudent && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any notes..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Receipt Issued</Label>
                  <Switch checked={receiptIssued} onCheckedChange={setReceiptIssued} />
                </div>

                <Separator />

                {/* Allocation Preview */}
                {allocationPreview.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Allocation Preview</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdjustment(!showAdjustment)}
                        className="h-7 text-xs"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        {showAdjustment ? 'Hide' : 'Adjust Fees'}
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      {allocationPreview.map((preview) => (
                        <div
                          key={preview.month}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {preview.willClear ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                            <span>{formatMonth(preview.month)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">
                              {formatCurrency(preview.currentBalance)}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className={preview.willClear ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                              {preview.willClear ? 'Cleared' : formatCurrency(preview.newBalance)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isOverpayment && (
                      <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Overpayment of {formatCurrency(paymentAmount - totalPending)}</span>
                      </div>
                    )}

                    {!isOverpayment && remainingAfterPayment > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Remaining balance after payment: {formatCurrency(remainingAfterPayment)}
                      </p>
                    )}
                  </div>
                )}

                {/* Fee Adjustment Section */}
                {showAdjustment && monthlyStatus.length > 0 && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <Label className="text-sm">Adjust Monthly Fees</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {monthlyStatus
                        .filter(s => s.status !== 'paid')
                        .map((status) => (
                          <div key={status.month} className="flex items-center gap-2">
                            <span className="text-sm w-20">{formatMonth(status.month)}</span>
                            <Input
                              type="number"
                              value={adjustments[status.month] || ''}
                              onChange={(e) => handleAdjustmentChange(status.month, e.target.value)}
                              className="h-8 text-sm"
                            />
                            {parseFloat(adjustments[status.month] || '0') !== status.expectedAmount && (
                              <Badge variant="outline" className="text-xs text-amber-600">
                                was {formatCurrency(status.expectedAmount)}
                              </Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedStudent || !amount || submitting}
            className="flex-1"
          >
            {submitting ? 'Adding...' : 'Add Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
