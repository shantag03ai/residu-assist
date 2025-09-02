import { useState } from 'react';
import { Bot, Receipt, CreditCard, Calendar, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  txnId: string;
  apartmentId: string;
  flatId?: string;
  date: string;
  type: 'maintenance_receipt' | 'other_receipt' | 'expense';
  category: string;
  amount: number;
  mode: 'cash' | 'bank' | 'upi' | 'other';
  narration: string;
  createdFrom: 'ui' | 'csv' | 'nlp';
}

interface NLPResult {
  input: string;
  parsed: {
    apartmentName?: string;
    flatNumber?: string;
    partyName?: string;
    date?: string;
    type?: string;
    category?: string;
    amount: number;
    mode?: string;
  };
  proposedTransaction: Transaction;
  explanation: string;
  warnings: string[];
}

export const TransactionEntry = () => {
  const { toast } = useToast();
  const [nlpInput, setNlpInput] = useState('');
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      txnId: 'txn-1',
      apartmentId: 'apt-1',
      flatId: 'flat-1',
      date: '2025-01-15',
      type: 'maintenance_receipt',
      category: 'maintenance',
      amount: 5000,
      mode: 'upi',
      narration: 'Monthly maintenance - January 2025',
      createdFrom: 'ui'
    }
  ]);

  const [formData, setFormData] = useState({
    apartmentId: '',
    flatId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'maintenance_receipt' as const,
    category: 'maintenance',
    amount: '',
    mode: 'upi' as const,
    narration: ''
  });

  // Mock NLP parsing function
  const parseNLPInput = (input: string): NLPResult => {
    const lowerInput = input.toLowerCase();
    let amount = 0;
    let type: 'maintenance_receipt' | 'other_receipt' | 'expense' = 'maintenance_receipt';
    let category = 'maintenance';
    let mode: 'cash' | 'bank' | 'upi' | 'other' = 'upi';
    let partyName = '';
    let flatNumber = '';
    let date = new Date().toISOString().split('T')[0];

    // Extract amount
    const amountMatch = input.match(/(\d+)/);
    if (amountMatch) {
      amount = parseInt(amountMatch[1]);
    }

    // Determine type
    if (lowerInput.includes('expense') || lowerInput.includes('paid') || lowerInput.includes('electricity') || lowerInput.includes('water')) {
      type = 'expense';
    } else if (lowerInput.includes('maintenance') || lowerInput.includes('received')) {
      type = 'maintenance_receipt';
    } else {
      type = 'other_receipt';
    }

    // Determine category
    if (lowerInput.includes('electricity')) category = 'electricity';
    else if (lowerInput.includes('water')) category = 'water';
    else if (lowerInput.includes('security')) category = 'security';
    else if (lowerInput.includes('housekeeping')) category = 'housekeeping';
    else if (lowerInput.includes('repair')) category = 'repairs';
    else if (type === 'expense') category = 'other';
    else category = 'maintenance';

    // Extract flat number
    const flatMatch = input.match(/([A-Z]-?\d+)/i);
    if (flatMatch) {
      flatNumber = flatMatch[1];
    }

    // Extract person name (simple heuristic)
    const words = input.split(' ');
    const nameWords = words.filter(word => 
      word.length > 2 && 
      !word.match(/\d/) && 
      !['maintenance', 'received', 'expense', 'paid', 'from', 'to', 'for'].includes(word.toLowerCase())
    );
    if (nameWords.length > 0) {
      partyName = nameWords.slice(0, 2).join(' ');
    }

    // Extract date (simple format detection)
    const dateMatch = input.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const fullYear = year.length === 2 ? `20${year}` : year;
      date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const explanation = `Parsed as ${type.replace('_', ' ')} of ₹${amount} for ${category}${flatNumber ? ` (Flat: ${flatNumber})` : ''}${partyName ? ` from ${partyName}` : ''}`;

    const warnings: string[] = [];
    if (!flatNumber && type === 'maintenance_receipt') {
      warnings.push('No flat number specified for maintenance receipt');
    }
    if (amount === 0) {
      warnings.push('Amount not detected or is zero');
    }

    return {
      input,
      parsed: {
        apartmentName: 'Green Valley Heights', // Mock
        flatNumber,
        partyName,
        date,
        type,
        category,
        amount,
        mode
      },
      proposedTransaction: {
        txnId: `txn-${Date.now()}`,
        apartmentId: 'apt-1', // Mock
        flatId: flatNumber ? 'flat-1' : undefined, // Mock
        date,
        type,
        category,
        amount,
        mode,
        narration: `NLP Entry: ${input}`,
        createdFrom: 'nlp'
      },
      explanation,
      warnings
    };
  };

  const handleNLPParse = () => {
    if (!nlpInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transaction description",
        variant: "destructive",
      });
      return;
    }

    const result = parseNLPInput(nlpInput);
    setNlpResult(result);
  };

  const handleConfirmNLP = () => {
    if (nlpResult) {
      setTransactions([...transactions, nlpResult.proposedTransaction]);
      setNlpResult(null);
      setNlpInput('');
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
    }
  };

  const handleFormSubmit = () => {
    if (!formData.amount || !formData.narration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      txnId: `txn-${Date.now()}`,
      apartmentId: formData.apartmentId || 'apt-1',
      flatId: formData.flatId || undefined,
      date: formData.date,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      mode: formData.mode,
      narration: formData.narration,
      createdFrom: 'ui'
    };

    setTransactions([...transactions, transaction]);
    setFormData({
      apartmentId: '',
      flatId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'maintenance_receipt',
      category: 'maintenance',
      amount: '',
      mode: 'upi',
      narration: ''
    });

    toast({
      title: "Success",
      description: "Transaction recorded successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transaction Entry</h2>
        <p className="text-muted-foreground">Record maintenance receipts and expenses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NLP Quick Entry */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-secondary" />
              <span>Smart Quick Entry</span>
            </CardTitle>
            <CardDescription>
              Enter transactions in natural language. Try: "maintenance 5000 Rajesh 15/01/2025" or "expense 3500 electricity"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nlp-input">Transaction Description</Label>
              <Textarea
                id="nlp-input"
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder="maintenance 5000 Rajesh A-101 15/01/2025"
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleNLPParse} className="w-full" variant="secondary">
              <Bot className="w-4 h-4 mr-2" />
              Parse Transaction
            </Button>

            {nlpResult && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium text-sm mb-2">Parsed Result:</h4>
                  <p className="text-sm text-muted-foreground">{nlpResult.explanation}</p>
                </div>
                
                {nlpResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Warnings:</h4>
                    {nlpResult.warnings.map((warning, index) => (
                      <Badge key={index} variant="destructive" className="mr-2 mb-1">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">{nlpResult.proposedTransaction.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-2 font-medium">₹{nlpResult.proposedTransaction.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium">{nlpResult.proposedTransaction.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="ml-2 font-medium">{nlpResult.proposedTransaction.mode}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleConfirmNLP} size="sm" variant="default">
                    Confirm & Add
                  </Button>
                  <Button onClick={() => setNlpResult(null)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Form Entry */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-primary" />
              <span>Manual Entry</span>
            </CardTitle>
            <CardDescription>Enter transaction details manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Apartment</Label>
                <Select value={formData.apartmentId} onValueChange={(value) => setFormData({...formData, apartmentId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select apartment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apt-1">Green Valley Heights</SelectItem>
                    <SelectItem value="apt-2">Royal Gardens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Flat (Optional)</Label>
                <Select value={formData.flatId} onValueChange={(value) => setFormData({...formData, flatId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat-1">A-101</SelectItem>
                    <SelectItem value="flat-2">A-102</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance_receipt">Maintenance Receipt</SelectItem>
                    <SelectItem value="other_receipt">Other Receipt</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="repairs">Repairs</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={formData.mode} onValueChange={(value: any) => setFormData({...formData, mode: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="narration">Narration *</Label>
              <Textarea
                id="narration"
                value={formData.narration}
                onChange={(e) => setFormData({...formData, narration: e.target.value})}
                placeholder="Monthly maintenance for January 2025"
              />
            </div>

            <Button onClick={handleFormSubmit} className="w-full">
              <Receipt className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest recorded transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(-5).reverse().map((txn) => (
              <div key={txn.txnId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.type === 'expense' ? 'bg-society-expense-bg' : 'bg-society-receipt-bg'
                  }`}>
                    {txn.type === 'expense' ? (
                      <CreditCard className="w-5 h-5 text-destructive" />
                    ) : (
                      <Receipt className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{txn.narration}</div>
                    <div className="text-sm text-muted-foreground">
                      {txn.category} • {txn.mode} • {new Date(txn.date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    txn.type === 'expense' ? 'text-destructive' : 'text-success'
                  }`}>
                    {txn.type === 'expense' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                  <Badge variant={txn.createdFrom === 'nlp' ? 'secondary' : 'outline'} className="text-xs">
                    {txn.createdFrom.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};