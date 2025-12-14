import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/student/StudentLayout';
import { mockAccount, mockTransactions, Transaction } from '@/data/studentMockData';
import { format } from 'date-fns';

type FilterType = 'all' | 'credit' | 'debit';

export default function StudentAccountPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = mockTransactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'credit', label: 'Credits' },
    { value: 'debit', label: 'Debits' },
  ];

  return (
    <StudentLayout title="Account" showBack>
      <div className="space-y-6 pb-24">
        {/* Balance Card */}
        <Card variant="elevated" className="animate-slide-up overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/80">Current Balance</p>
                <p className={`text-3xl font-bold ${mockAccount.currentBalance >= 0 ? '' : ''}`}>
                  {mockAccount.currentBalance >= 0 ? '+' : '-'}₹{Math.abs(mockAccount.currentBalance).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Last updated: {format(new Date(mockAccount.lastUpdated), 'MMM d, yyyy')}
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="font-semibold text-success">₹{mockAccount.totalCredits.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="font-semibold text-destructive">₹{mockAccount.totalDebits.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Transactions
          </h2>

          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction} 
                index={index}
              />
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card variant="flat">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No transactions found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Note */}
        <Card variant="flat" className="animate-fade-in">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              💡 Account data is synced from the school finance system. 
              For any discrepancies, please contact the accounts office.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}

function TransactionCard({ transaction, index }: { transaction: Transaction; index: number }) {
  const isCredit = transaction.type === 'credit';
  
  return (
    <Card 
      variant="interactive" 
      className={`animate-slide-up stagger-${Math.min(index + 1, 5)}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCredit ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {isCredit ? (
                <ArrowDownRight className="w-5 h-5 text-success" />
              ) : (
                <ArrowUpRight className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{transaction.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{transaction.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
          <p className={`font-semibold flex-shrink-0 ${
            isCredit ? 'text-success' : 'text-destructive'
          }`}>
            {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
