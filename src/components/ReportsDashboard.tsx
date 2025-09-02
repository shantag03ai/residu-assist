import { useState } from 'react';
import { FileText, Calendar, DollarSign, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export const ReportsDashboard = () => {
  const [selectedApartment, setSelectedApartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-01-31'
  });

  // Mock data for demo
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

  const downloadReport = (reportType: string) => {
    // Mock download functionality
    console.log(`Downloading ${reportType} report...`);
  };

  return (
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
              <Select value={selectedApartment} onValueChange={setSelectedApartment}>
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
  );
};