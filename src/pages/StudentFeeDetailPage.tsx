import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  IndianRupee,
  Calendar,
  Receipt,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  getStudentFeeById,
  getMonthlyFees,
  getPayments,
  getStudentFeeOverview,
  addPayment,
  adjustMonthlyFee,
  toggleReceiptIssued,
  formatMonth,
  StudentFee,
  MonthlyFeeExpectation,
  Payment,
  MonthlyFeeStatus,
} from '@/data/feeMockData';

const StudentFeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studentFee, setStudentFee] = useState<StudentFee | null>(null);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFeeExpectation[]>([]);
  const [monthlyStatus, setMonthlyStatus] = useState<MonthlyFeeStatus[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<{
    totalExpected: number;
    totalPaid: number;
    totalPending: number;
  } | null>(null);

  // Payment dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [paymentReceiptIssued, setPaymentReceiptIssued] = useState(false);

  // Adjustment dialog
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [adjustFromMonth, setAdjustFromMonth] = useState('');
  const [adjustToMonth, setAdjustToMonth] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [sf, mf, pay, ov] = await Promise.all([
        getStudentFeeById(id),
        getMonthlyFees(id),
        getPayments(id),
        getStudentFeeOverview(id),
      ]);
      
      setStudentFee(sf || null);
      setMonthlyFees(mf);
      setPayments(pay);
      setMonthlyStatus(ov.monthlyStatus);
      setOverview({
        totalExpected: ov.totalExpected,
        totalPaid: ov.totalPaid,
        totalPending: ov.totalPending,
      });
    } catch (error) {
      console.error('Error loading student fee data:', error);
      toast.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: 'paid' | 'partial' | 'due') => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      case 'due':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Due
          </Badge>
        );
    }
  };

  const handleAddPayment = async () => {
    if (!id || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await addPayment(
        id,
        parseFloat(paymentAmount),
        paymentDate,
        paymentRemarks || undefined,
        paymentReceiptIssued
      );
      toast.success('Payment added successfully');
      setPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentRemarks('');
      setPaymentReceiptIssued(false);
      loadData();
    } catch (error) {
      toast.error('Failed to add payment');
    }
  };

  const handleAdjustFee = async () => {
    if (!id || !adjustFromMonth || !adjustToMonth || !adjustAmount || !adjustReason) {
      toast.error('Please fill all fields');
      return;
    }

    if (adjustFromMonth > adjustToMonth) {
      toast.error('From month cannot be after To month');
      return;
    }

    try {
      await adjustMonthlyFee(
        id,
        adjustFromMonth,
        adjustToMonth,
        parseFloat(adjustAmount),
        adjustReason
      );
      toast.success('Fee adjusted successfully');
      setAdjustDialogOpen(false);
      setAdjustFromMonth('');
      setAdjustToMonth('');
      setAdjustAmount('');
      setAdjustReason('');
      loadData();
    } catch (error) {
      toast.error('Failed to adjust fee');
    }
  };

  const handleToggleReceipt = async (paymentId: string) => {
    try {
      await toggleReceiptIssued(paymentId);
      loadData();
    } catch (error) {
      toast.error('Failed to update receipt status');
    }
  };

  if (loading) {
    return (
      <AppLayout title="Student Fee" showBack>
        <div className="space-y-4 animate-pulse">
          <Card>
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!studentFee) {
    return (
      <AppLayout title="Student Fee" showBack>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Student not found</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={studentFee.studentName} showBack>
      <div className="space-y-4">
        {/* Overview Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{studentFee.studentName}</h2>
                <p className="text-sm text-muted-foreground">{studentFee.className}</p>
              </div>
            </div>
            
            {overview && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Expected</p>
                  <p className="text-lg font-bold">{formatCurrency(overview.totalExpected)}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(overview.totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(overview.totalPending)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    value={paymentRemarks}
                    onChange={(e) => setPaymentRemarks(e.target.value)}
                    placeholder="Any notes about this payment"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Receipt Issued</Label>
                  <Switch
                    checked={paymentReceiptIssued}
                    onCheckedChange={setPaymentReceiptIssued}
                  />
                </div>
                <Button onClick={handleAddPayment} className="w-full">
                  Add Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Adjust Fee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust Monthly Fee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>From Month</Label>
                    <Select value={adjustFromMonth} onValueChange={setAdjustFromMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthlyFees.map((mf) => (
                          <SelectItem key={mf.id} value={mf.month}>
                            {formatMonth(mf.month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Month</Label>
                    <Select value={adjustToMonth} onValueChange={setAdjustToMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthlyFees.map((mf) => (
                          <SelectItem key={mf.id} value={mf.month}>
                            {formatMonth(mf.month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>New Amount (₹)</Label>
                  <Input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Enter new monthly amount"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Reason for adjustment"
                  />
                </div>
                <Button onClick={handleAdjustFee} className="w-full">
                  Apply Adjustment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Monthly Breakdown</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4 space-y-2">
            {monthlyStatus.map((status) => {
              const fee = monthlyFees.find((mf) => mf.month === status.month);
              return (
                <Card key={status.month}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{formatMonth(status.month)}</p>
                        {fee?.adjustmentReason && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Adjusted: {fee.adjustmentReason}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(status.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Expected</p>
                        <p className="font-medium">{formatCurrency(status.expectedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Paid</p>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(status.paidAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Balance</p>
                        <p className={`font-medium ${status.balance > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {formatCurrency(status.balance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="payments" className="mt-4 space-y-2">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <IndianRupee className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No payments recorded</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.date).toLocaleDateString('en-IN')}
                        </p>
                        {payment.remarks && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {payment.remarks}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleReceipt(payment.id)}
                        className={payment.receiptIssued ? 'text-emerald-600' : 'text-muted-foreground'}
                      >
                        <Receipt className="w-4 h-4 mr-1" />
                        {payment.receiptIssued ? 'Receipt Issued' : 'No Receipt'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StudentFeeDetailPage;
