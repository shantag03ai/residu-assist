import { useState } from 'react';
import { 
  Building2, Users, Receipt, TrendingUp, FileText, Database, Plus, Car, Edit, Trash2,
  Bot, CreditCard, Calendar, Upload, Download, AlertCircle, CheckCircle2, X,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Interfaces
interface Apartment {
  apartmentId: string;
  name: string;
  location: string;
  totalFlats: number;
  occupiedFlats: number;
}

interface Flat {
  flatId: string;
  apartmentId: string;
  flatNumber: string;
  ownerName: string;
  isRented: boolean;
  tenantName?: string;
  carOwned: boolean;
  carNumber?: string;
  familyMembersCount: number;
}

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

interface PendingMaintenance {
  apartmentId: string;
  month: string;
  flatId: string;
  flatNumber: string;
  ownerOrTenant: string;
  dueAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

interface IncomeExpenseReport {
  periodStart: string;
  periodEnd: string;
  byMonth: Array<{
    month: string;
    receipts: number;
    expenses: number;
    surplus: number;
  }>;
  financialYear: {
    fyLabel: string;
    receipts: number;
    expenses: number;
    surplus: number;
  };
}

interface ImportResult {
  fileName: string;
  rowsProcessed: number;
  rowsSucceeded: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export const SocietyManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // State for apartments and flats
  const [apartments, setApartments] = useState<Apartment[]>([
    {
      apartmentId: 'apt-1',
      name: 'Green Valley Heights',
      location: 'Sector 18, Noida',
      totalFlats: 120,
      occupiedFlats: 115
    },
    {
      apartmentId: 'apt-2', 
      name: 'Royal Gardens',
      location: 'Gurgaon',
      totalFlats: 85,
      occupiedFlats: 82
    }
  ]);

  const [flats, setFlats] = useState<Flat[]>([
    {
      flatId: 'flat-1',
      apartmentId: 'apt-1',
      flatNumber: 'A-101',
      ownerName: 'Rajesh Kumar',
      isRented: false,
      carOwned: true,
      carNumber: 'DL-3C-1234',
      familyMembersCount: 4
    },
    {
      flatId: 'flat-2',
      apartmentId: 'apt-1',
      flatNumber: 'A-102',
      ownerName: 'Priya Sharma',
      isRented: true,
      tenantName: 'Amit Singh',
      carOwned: false,
      familyMembersCount: 3
    }
  ]);

  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [newApartment, setNewApartment] = useState({
    name: '',
    location: '',
    totalFlats: 0
  });
  const [newFlat, setNewFlat] = useState({
    flatNumber: '',
    ownerName: '',
    isRented: false,
    tenantName: '',
    carOwned: false,
    carNumber: '',
    familyMembersCount: 0
  });

  // State for transactions
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

  const [nlpInput, setNlpInput] = useState('');
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
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

  // State for reports
  const [reportApartment, setReportApartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-01-31'
  });

  // State for CSV
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Sample data for demo
  const stats = {
    totalApartments: apartments.length,
    totalFlats: apartments.reduce((sum, apt) => sum + apt.totalFlats, 0),
    occupiedFlats: apartments.reduce((sum, apt) => sum + apt.occupiedFlats, 0),
    pendingMaintenance: 45600,
    thisMonthCollection: 234500,
    totalExpenses: 89200
  };

  // Mock data for reports
  const pendingMaintenanceData: PendingMaintenance[] = [
    {
      apartmentId: 'apt-1',
      month: '2025-01',
      flatId: 'flat-3',
      flatNumber: 'A-103',
      ownerOrTenant: 'Priya Sharma',
      dueAmount: 5000,
      paidAmount: 0,
      pendingAmount: 5000
    },
    {
      apartmentId: 'apt-1',
      month: '2025-01',
      flatId: 'flat-4',
      flatNumber: 'A-104',
      ownerOrTenant: 'Amit Singh (Tenant)',
      dueAmount: 5000,
      paidAmount: 2500,
      pendingAmount: 2500
    },
    {
      apartmentId: 'apt-2',
      month: '2025-01',
      flatId: 'flat-5',
      flatNumber: 'B-201',
      ownerOrTenant: 'Ravi Kumar',
      dueAmount: 4500,
      paidAmount: 0,
      pendingAmount: 4500
    }
  ];

  const incomeExpenseData: IncomeExpenseReport = {
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    byMonth: [
      {
        month: '2025-01',
        receipts: 234500,
        expenses: 89200,
        surplus: 145300
      },
      {
        month: '2024-12',
        receipts: 245000,
        expenses: 95600,
        surplus: 149400
      }
    ],
    financialYear: {
      fyLabel: 'FY 2024-25',
      receipts: 2850000,
      expenses: 1125000,
      surplus: 1725000
    }
  };

  const balanceSheetData = {
    asOf: '2025-01-31',
    assets: {
      cashBank: 875000
    },
    liabilities: {
      advances: 45000
    },
    equity: {
      openingBalance: 750000,
      surplus: 170000
    }
  };

  const flatLedgerData = [
    {
      flatId: 'flat-1',
      flatNumber: 'A-101',
      periodStart: '2025-01-01',
      periodEnd: '2025-01-31',
      opening: 0,
      receipts: 5000,
      expenses: 0,
      closing: 5000,
      rows: [
        {
          date: '2025-01-15',
          type: 'maintenance_receipt' as 'maintenance_receipt' | 'other_receipt' | 'expense',
          amount: 5000,
          narration: 'Monthly maintenance - January 2025'
        }
      ]
    }
  ];

  // CSV Templates
  const csvTemplates = {
    apartments: `Apartment Name,Location,Total Flats
Green Valley Heights,Sector 18 Noida,120
Royal Gardens,Gurgaon,85
Sunshine Apartments,Delhi,95`,

    flats: `Apartment Name,Flat Number,Owner Name,Is Rented (Yes/No),Tenant Name,Car Owned (Yes/No),Car Number,Family Members
Green Valley Heights,A-101,Rajesh Kumar,No,,Yes,DL-3C-1234,4
Green Valley Heights,A-102,Priya Sharma,Yes,Amit Singh,No,,3
Royal Gardens,B-201,Ravi Gupta,No,,Yes,DL-8C-5678,5`,

    transactions: `Apartment Name,Flat Number (optional),Date (DD/MM/YYYY),Type (maintenance_receipt/other_receipt/expense),Category,Amount,Mode,Narration
Green Valley Heights,A-101,15/01/2025,maintenance_receipt,maintenance,5000,upi,Monthly maintenance January 2025
Green Valley Heights,,12/01/2025,expense,electricity,8500,bank,Electricity bill January 2025  
Royal Gardens,B-201,10/01/2025,maintenance_receipt,maintenance,4500,cash,Maintenance payment for January`
  };

  // Apartment Management Functions
  const handleAddApartment = () => {
    if (!newApartment.name || !newApartment.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const apartment: Apartment = {
      apartmentId: `apt-${Date.now()}`,
      ...newApartment,
      occupiedFlats: 0
    };

    setApartments([...apartments, apartment]);
    setNewApartment({ name: '', location: '', totalFlats: 0 });
    toast({
      title: "Success",
      description: "Apartment added successfully!",
    });
  };

  const handleAddFlat = () => {
    if (!selectedApartment || !newFlat.flatNumber || !newFlat.ownerName) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const flat: Flat = {
      flatId: `flat-${Date.now()}`,
      apartmentId: selectedApartment,
      ...newFlat
    };

    setFlats([...flats, flat]);
    
    // Update occupied flats count
    setApartments(apartments.map(apt => 
      apt.apartmentId === selectedApartment 
        ? { ...apt, occupiedFlats: apt.occupiedFlats + 1 }
        : apt
    ));

    setNewFlat({
      flatNumber: '',
      ownerName: '',
      isRented: false,
      tenantName: '',
      carOwned: false,
      carNumber: '',
      familyMembersCount: 0
    });

    toast({
      title: "Success",
      description: "Flat added successfully!",
    });
  };

  const getApartmentFlats = (apartmentId: string) => {
    return flats.filter(flat => flat.apartmentId === apartmentId);
  };

  // Transaction Functions
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

  // CSV Functions
  const downloadTemplate = (templateType: keyof typeof csvTemplates) => {
    const csvContent = csvTemplates[templateType];
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: `${templateType} template has been downloaded successfully.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const processCSVImport = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select CSV files to import",
        variant: "destructive"
      });
      return;
    }

    const results: ImportResult[] = [];

    // Mock processing for each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      
      // Simulate processing with some mock results
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async processing

      const mockResult: ImportResult = {
        fileName,
        rowsProcessed: Math.floor(Math.random() * 50) + 10,
        rowsSucceeded: 0,
        errors: []
      };

      // Simulate some errors for demonstration
      if (fileName.toLowerCase().includes('error') || Math.random() < 0.3) {
        mockResult.errors = [
          { row: 3, message: "Invalid date format. Expected DD/MM/YYYY" },
          { row: 7, message: "Amount field is empty or invalid" }
        ];
        mockResult.rowsSucceeded = mockResult.rowsProcessed - mockResult.errors.length;
      } else {
        mockResult.rowsSucceeded = mockResult.rowsProcessed;
      }

      results.push(mockResult);
    }

    setImportResults(results);
    
    const totalSucceeded = results.reduce((sum, result) => sum + result.rowsSucceeded, 0);
    const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0);

    if (totalErrors === 0) {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${totalSucceeded} records.`,
      });
    } else {
      toast({
        title: "Import Completed with Errors", 
        description: `${totalSucceeded} records imported, ${totalErrors} errors found.`,
        variant: "destructive"
      });
    }
  };

  const exportData = (dataType: string) => {
    // Mock export functionality
    let csvContent = '';
    let filename = '';

    switch (dataType) {
      case 'apartments':
        csvContent = csvTemplates.apartments;
        filename = 'apartments_export.csv';
        break;
      case 'flats':
        csvContent = csvTemplates.flats;
        filename = 'flats_export.csv';
        break;
      case 'transactions':
        csvContent = csvTemplates.transactions;
        filename = 'transactions_export.csv';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${dataType} data has been exported successfully.`,
    });
  };

  const downloadReport = (reportType: string) => {
    // Mock download functionality
    console.log(`Downloading ${reportType} report...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Society Manager</h1>
                <p className="text-sm text-muted-foreground">Professional Apartment Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Database className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="default" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="apartments" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Apartments</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Apartments
                    <Building2 className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalApartments}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all locations</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Occupied Flats
                    <Users className="w-4 h-4 text-secondary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">
                    {stats.occupiedFlats}/{stats.totalFlats}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.occupiedFlats / stats.totalFlats) * 100)}% occupancy rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-society-dues-pending">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Pending Maintenance
                    <Receipt className="w-4 h-4 text-society-dues-pending" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-society-dues-pending">
                    ₹{stats.pendingMaintenance.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Outstanding collections</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-society-dues-paid">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    This Month Collection
                    <TrendingUp className="w-4 h-4 text-society-dues-paid" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-society-dues-paid">
                    ₹{stats.thisMonthCollection.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current month receipts</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-destructive">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Expenses
                    <Receipt className="w-4 h-4 text-destructive" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    ₹{stats.totalExpenses.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This month outgoing</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Net Balance
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ₹{(stats.thisMonthCollection - stats.totalExpenses).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current month surplus</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for society management</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('apartments')}
                >
                  <Building2 className="w-8 h-8 text-primary" />
                  <span className="font-medium">Manage Apartments</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Add apartments & flats
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('transactions')}
                >
                  <Receipt className="w-8 h-8 text-secondary" />
                  <span className="font-medium">Record Transaction</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Quick NLP entry
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('reports')}
                >
                  <FileText className="w-8 h-8 text-society-dues-paid" />
                  <span className="font-medium">View Reports</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Financial analysis
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('csv')}
                >
                  <Database className="w-8 h-8 text-society-dues-pending" />
                  <span className="font-medium">Import/Export</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Bulk data operations
                  </span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APARTMENTS TAB */}
          <TabsContent value="apartments">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Apartment Management</h2>
                  <p className="text-muted-foreground">Manage apartments and flats information</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Apartment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Apartment</DialogTitle>
                        <DialogDescription>Enter the apartment details below</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="apt-name">Apartment Name *</Label>
                          <Input
                            id="apt-name"
                            value={newApartment.name}
                            onChange={(e) => setNewApartment({...newApartment, name: e.target.value})}
                            placeholder="e.g. Green Valley Heights"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apt-location">Location *</Label>
                          <Input
                            id="apt-location"
                            value={newApartment.location}
                            onChange={(e) => setNewApartment({...newApartment, location: e.target.value})}
                            placeholder="e.g. Sector 18, Noida"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apt-flats">Total Flats</Label>
                          <Input
                            id="apt-flats"
                            type="number"
                            value={newApartment.totalFlats}
                            onChange={(e) => setNewApartment({...newApartment, totalFlats: parseInt(e.target.value) || 0})}
                            placeholder="120"
                          />
                        </div>
                        <Button onClick={handleAddApartment} className="w-full">
                          Add Apartment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {apartments.map((apartment) => (
                  <Card 
                    key={apartment.apartmentId}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedApartment === apartment.apartmentId ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedApartment(apartment.apartmentId)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span className="truncate">{apartment.name}</span>
                        </span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{apartment.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Occupied Flats:</span>
                          <span className="font-medium">
                            {apartment.occupiedFlats}/{apartment.totalFlats}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Occupancy Rate:</span>
                          <Badge variant={apartment.occupiedFlats / apartment.totalFlats > 0.9 ? "default" : "secondary"}>
                            {Math.round((apartment.occupiedFlats / apartment.totalFlats) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedApartment && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-secondary" />
                          <span>Flat Details - {apartments.find(a => a.apartmentId === selectedApartment)?.name}</span>
                        </CardTitle>
                        <CardDescription>Manage individual flat information</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Flat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add New Flat</DialogTitle>
                            <DialogDescription>Enter the flat details below</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="flat-number">Flat Number *</Label>
                              <Input
                                id="flat-number"
                                value={newFlat.flatNumber}
                                onChange={(e) => setNewFlat({...newFlat, flatNumber: e.target.value})}
                                placeholder="A-101"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="owner-name">Owner Name *</Label>
                              <Input
                                id="owner-name"
                                value={newFlat.ownerName}
                                onChange={(e) => setNewFlat({...newFlat, ownerName: e.target.value})}
                                placeholder="Rajesh Kumar"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="is-rented"
                                checked={newFlat.isRented}
                                onCheckedChange={(checked) => setNewFlat({...newFlat, isRented: checked})}
                              />
                              <Label htmlFor="is-rented">Is Rented</Label>
                            </div>
                            {newFlat.isRented && (
                              <div className="space-y-2">
                                <Label htmlFor="tenant-name">Tenant Name</Label>
                                <Input
                                  id="tenant-name"
                                  value={newFlat.tenantName}
                                  onChange={(e) => setNewFlat({...newFlat, tenantName: e.target.value})}
                                  placeholder="Amit Singh"
                                />
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="car-owned"
                                checked={newFlat.carOwned}
                                onCheckedChange={(checked) => setNewFlat({...newFlat, carOwned: checked})}
                              />
                              <Label htmlFor="car-owned">Car Owned</Label>
                            </div>
                            {newFlat.carOwned && (
                              <div className="space-y-2">
                                <Label htmlFor="car-number">Car Number</Label>
                                <Input
                                  id="car-number"
                                  value={newFlat.carNumber}
                                  onChange={(e) => setNewFlat({...newFlat, carNumber: e.target.value})}
                                  placeholder="DL-3C-1234"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <Label htmlFor="family-members">Family Members</Label>
                              <Input
                                id="family-members"
                                type="number"
                                value={newFlat.familyMembersCount}
                                onChange={(e) => setNewFlat({...newFlat, familyMembersCount: parseInt(e.target.value) || 0})}
                                placeholder="4"
                              />
                            </div>
                            <Button onClick={handleAddFlat} className="w-full">
                              Add Flat
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Flat #</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Car</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getApartmentFlats(selectedApartment).map((flat) => (
                          <TableRow key={flat.flatId}>
                            <TableCell className="font-medium">{flat.flatNumber}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{flat.ownerName}</div>
                                {flat.isRented && flat.tenantName && (
                                  <div className="text-sm text-muted-foreground">
                                    Tenant: {flat.tenantName}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={flat.isRented ? "secondary" : "default"}>
                                {flat.isRented ? "Rented" : "Owner"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {flat.carOwned ? (
                                <div className="flex items-center space-x-1">
                                  <Car className="w-4 h-4 text-primary" />
                                  <span className="text-sm">{flat.carNumber}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No</span>
                              )}
                            </TableCell>
                            <TableCell>{flat.familyMembersCount}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* TRANSACTIONS TAB */}
          <TabsContent value="transactions">
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
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Reports Dashboard</h2>
                  <p className="text-muted-foreground">Financial reports and analytics</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => downloadReport('all')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Apartment</Label>
                      <Select value={reportApartment} onValueChange={setReportApartment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Apartments</SelectItem>
                          <SelectItem value="apt-1">Green Valley Heights</SelectItem>
                          <SelectItem value="apt-2">Royal Gardens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="pending" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pending">Pending Maintenance</TabsTrigger>
                  <TabsTrigger value="income-expense">Income & Expense</TabsTrigger>
                  <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
                  <TabsTrigger value="flat-ledger">Flat Ledgers</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-society-dues-pending" />
                            <span>Pending Maintenance</span>
                          </CardTitle>
                          <CardDescription>Outstanding maintenance collections by flat</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => downloadReport('pending-maintenance')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-l-4 border-l-society-dues-pending">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-society-dues-pending">
                              ₹{pendingMaintenanceData.reduce((sum, item) => sum + item.pendingAmount, 0).toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-muted-foreground">Total Outstanding</p>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-society-dues-partial">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-society-dues-partial">
                              {pendingMaintenanceData.filter(item => item.paidAmount > 0 && item.pendingAmount > 0).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Partial Payments</p>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-destructive">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-destructive">
                              {pendingMaintenanceData.filter(item => item.paidAmount === 0).length}
                            </div>
                            <p className="text-xs text-muted-foreground">No Payment</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Flat</TableHead>
                            <TableHead>Resident</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead>Due Amount</TableHead>
                            <TableHead>Paid Amount</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingMaintenanceData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.flatNumber}</TableCell>
                              <TableCell>{item.ownerOrTenant}</TableCell>
                              <TableCell>{new Date(item.month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</TableCell>
                              <TableCell>₹{item.dueAmount.toLocaleString('en-IN')}</TableCell>
                              <TableCell>₹{item.paidAmount.toLocaleString('en-IN')}</TableCell>
                              <TableCell className="font-medium text-society-dues-pending">
                                ₹{item.pendingAmount.toLocaleString('en-IN')}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  item.paidAmount === 0 ? "destructive" : 
                                  item.pendingAmount > 0 ? "secondary" : "default"
                                }>
                                  {item.paidAmount === 0 ? "Not Paid" : 
                                   item.pendingAmount > 0 ? "Partial" : "Paid"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="income-expense">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <TrendingUp className="w-5 h-5 text-primary" />
                              <span>Income & Expense Summary</span>
                            </CardTitle>
                            <CardDescription>Financial performance overview</CardDescription>
                          </div>
                          <Button variant="outline" onClick={() => downloadReport('income-expense')}>
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="border-l-4 border-l-society-dues-paid">
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-society-dues-paid">
                                ₹{incomeExpenseData.financialYear.receipts.toLocaleString('en-IN')}
                              </div>
                              <p className="text-xs text-muted-foreground">Total Receipts ({incomeExpenseData.financialYear.fyLabel})</p>
                            </CardContent>
                          </Card>
                          <Card className="border-l-4 border-l-destructive">
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-destructive">
                                ₹{incomeExpenseData.financialYear.expenses.toLocaleString('en-IN')}
                              </div>
                              <p className="text-xs text-muted-foreground">Total Expenses ({incomeExpenseData.financialYear.fyLabel})</p>
                            </CardContent>
                          </Card>
                          <Card className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-primary">
                                ₹{incomeExpenseData.financialYear.surplus.toLocaleString('en-IN')}
                              </div>
                              <p className="text-xs text-muted-foreground">Net Surplus ({incomeExpenseData.financialYear.fyLabel})</p>
                            </CardContent>
                          </Card>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Receipts</TableHead>
                              <TableHead>Expenses</TableHead>
                              <TableHead>Surplus</TableHead>
                              <TableHead>Margin %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {incomeExpenseData.byMonth.map((month, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {new Date(month.month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                </TableCell>
                                <TableCell className="text-society-dues-paid font-medium">
                                  ₹{month.receipts.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="text-destructive font-medium">
                                  ₹{month.expenses.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="text-primary font-medium">
                                  ₹{month.surplus.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="default">
                                    {((month.surplus / month.receipts) * 100).toFixed(1)}%
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="balance-sheet">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <span>Balance Sheet</span>
                          </CardTitle>
                          <CardDescription>As of {new Date(balanceSheetData.asOf).toLocaleDateString('en-IN')}</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => downloadReport('balance-sheet')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-primary">Assets</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span>Cash & Bank Balance</span>
                              <span className="font-bold">₹{balanceSheetData.assets.cashBank.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 border-t-2 border-primary font-bold">
                              <span>Total Assets</span>
                              <span>₹{balanceSheetData.assets.cashBank.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-secondary">Liabilities & Equity</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span>Advances Received</span>
                              <span className="font-bold">₹{balanceSheetData.liabilities.advances.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span>Opening Balance</span>
                              <span className="font-bold">₹{balanceSheetData.equity.openingBalance.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span>Current Period Surplus</span>
                              <span className="font-bold">₹{balanceSheetData.equity.surplus.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 border-t-2 border-secondary font-bold">
                              <span>Total Liabilities & Equity</span>
                              <span>₹{(balanceSheetData.liabilities.advances + balanceSheetData.equity.openingBalance + balanceSheetData.equity.surplus).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flat-ledger">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span>Flat-wise Ledgers</span>
                          </CardTitle>
                          <CardDescription>Individual flat transaction history</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => downloadReport('flat-ledgers')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {flatLedgerData.map((ledger, index) => (
                        <div key={index} className="mb-6 p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">Flat {ledger.flatNumber}</h4>
                            <div className="text-sm text-muted-foreground">
                              Period: {new Date(ledger.periodStart).toLocaleDateString('en-IN')} - {new Date(ledger.periodEnd).toLocaleDateString('en-IN')}
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Opening</div>
                              <div className="font-bold">₹{ledger.opening.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Receipts</div>
                              <div className="font-bold text-society-dues-paid">₹{ledger.receipts.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Expenses</div>
                              <div className="font-bold text-destructive">₹{ledger.expenses.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Closing</div>
                              <div className="font-bold">₹{ledger.closing.toLocaleString('en-IN')}</div>
                            </div>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Narration</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {ledger.rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell>{new Date(row.date).toLocaleDateString('en-IN')}</TableCell>
                                  <TableCell>
                                    <Badge variant={row.type === 'expense' ? "destructive" : "default"}>
                                      {row.type.replace('_', ' ')}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className={row.type === 'expense' ? 'text-destructive font-medium' : 'text-society-dues-paid font-medium'}>
                                    {row.type === 'expense' ? '-' : '+'}₹{row.amount.toLocaleString('en-IN')}
                                  </TableCell>
                                  <TableCell>{row.narration}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* CSV TAB */}
          <TabsContent value="csv">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">CSV Import/Export</h2>
                <p className="text-muted-foreground">Manage bulk data operations using CSV files</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CSV Templates */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="w-5 h-5 text-primary" />
                      <span>Download Templates</span>
                    </CardTitle>
                    <CardDescription>Get blank CSV templates with proper headers and sample data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Apartments Template</div>
                          <div className="text-sm text-muted-foreground">Apartment master data with locations</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadTemplate('apartments')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Flats Template</div>
                          <div className="text-sm text-muted-foreground">Flat details with owner/tenant information</div>
                        </div>  
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadTemplate('flats')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Transactions Template</div>
                          <div className="text-sm text-muted-foreground">Transaction records with receipts and expenses</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadTemplate('transactions')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <FileText className="w-4 h-4" />
                      <AlertDescription>
                        Templates include sample data and proper formatting. Use these as reference for your CSV files.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* CSV Import */}
                <Card className="border-l-4 border-l-secondary">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-secondary" />
                      <span>Import CSV Data</span>
                    </CardTitle>
                    <CardDescription>Upload CSV files to import apartments, flats, and transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="csv-files">Select CSV Files</Label>
                      <Input
                        id="csv-files"
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can select multiple CSV files at once
                      </p>
                    </div>

                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files:</Label>
                        <div className="space-y-1">
                          {Array.from(selectedFiles).map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                              <span className="font-medium">{file.name}</span>
                              <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={processCSVImport} 
                      className="w-full"
                      disabled={!selectedFiles || selectedFiles.length === 0}
                      variant="secondary"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV Files
                    </Button>

                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        CSV files will be validated before import. Any errors will be shown in the results below.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Export Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-primary" />
                    <span>Export Current Data</span>
                  </CardTitle>
                  <CardDescription>Download current apartment, flat, and transaction data as CSV</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => exportData('apartments')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">Export Apartments</span>
                      <span className="text-xs text-muted-foreground text-center">Download all apartment data</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => exportData('flats')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">Export Flats</span>
                      <span className="text-xs text-muted-foreground text-center">Download all flat data</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => exportData('transactions')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">Export Transactions</span>
                      <span className="text-xs text-muted-foreground text-center">Download all transaction data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Import Results */}
              {importResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span>Import Results</span>
                    </CardTitle>
                    <CardDescription>Results from the latest CSV import operation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {importResults.map((result, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">{result.fileName}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant="default">
                                {result.rowsSucceeded} Success
                              </Badge>
                              {result.errors.length > 0 && (
                                <Badge variant="destructive">
                                  {result.errors.length} Errors
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Processed:</span>
                              <span className="ml-2 font-medium">{result.rowsProcessed}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Succeeded:</span>
                              <span className="ml-2 font-medium text-success">{result.rowsSucceeded}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Errors:</span>
                              <span className="ml-2 font-medium text-destructive">{result.errors.length}</span>
                            </div>
                          </div>

                          {result.errors.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-destructive">Errors:</Label>
                              <div className="space-y-1">
                                {result.errors.map((error, errorIndex) => (
                                  <div key={errorIndex} className="flex items-start space-x-2 p-2 bg-destructive/10 rounded text-sm">
                                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium">Row {error.row}:</span>
                                      <span className="ml-1">{error.message}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={() => setImportResults([])}
                      className="mt-4"
                    >
                      Clear Results
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};