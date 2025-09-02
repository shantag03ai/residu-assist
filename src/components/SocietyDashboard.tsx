import { useState } from 'react';
import { Building2, Users, Receipt, TrendingUp, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApartmentManagement } from './ApartmentManagement';
import { TransactionEntry } from './TransactionEntry';
import { ReportsDashboard } from './ReportsDashboard';
import { CSVManager } from './CSVManager';

export const SocietyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for demo
  const stats = {
    totalApartments: 12,
    totalFlats: 340,
    occupiedFlats: 312,
    pendingMaintenance: 45600,
    thisMonthCollection: 234500,
    totalExpenses: 89200
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

          <TabsContent value="apartments">
            <ApartmentManagement />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionEntry />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsDashboard />
          </TabsContent>

          <TabsContent value="csv">
            <CSVManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};